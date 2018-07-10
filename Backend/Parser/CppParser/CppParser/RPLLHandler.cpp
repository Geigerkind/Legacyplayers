#include "RPLLHandler.h"
#include <cstring>

#if defined(min)
#undef min
#endif
#if defined(max)
#undef max
#endif
#include "../../../Libs/zip/zip_file.hpp"
#include <thread>
#include "AnalyzerPost.h"

void RPLL::RPLLHandler::SearchFile()
{
	//int keepAlive = 0;
	while (m_Run)
	{
		// There is a 3 minute timeout in the db to close connections, so we need to tell the db that we are not idle
		/*if (keepAlive >= 20)
		{
			m_DB->GetConnector(true)->ExecuteStreamStatement("SELECT id FROM gn_user LIMIT 1");
			m_DB->GetConnector()->ExecuteStreamStatement("SELECT uploaderid FROM rs_progress LIMIT 1");
			keepAlive = 0;
		}
		++keepAlive;*/
		auto end = fs::end(fs::directory_iterator(m_Directory));
		bool newElement = false;

		for (auto el = fs::begin(fs::directory_iterator(m_Directory)); el != end; ++el)
		{
			if (el->path().extension() == ".zip" && !m_Lock[el->path().stem().string()] && !m_InQueue[el->path().stem().string()])
			{
				try
				{
					m_InQueue[el->path().stem().string()] = true;
					std::string user = el->path().stem().string().substr(0, el->path().stem().string().find("-1"));
					if (user.length() > 122)
					{
						std::cout << "Uid too long o.O! " << std::endl;
						remove(el->path());
						continue;
					}
					if (user == "")
					{
						std::cout << "Removing file with empty user! " << std::endl;
						remove(el->path());
						continue;
					}
					long long TS = std::stoll(el->path().stem().string().substr(el->path().stem().string().find("-1") + 1, el->path().stem().string().length()));
					int uid = GetUserId(user, TS);
					if (uid == 0)
					{
						std::cout << "User unknown: File removed!" << std::endl;
						// Unknown user: Move it to unknown directory
						// fs::copy_file(el->path(), "../Unknown");
						remove(el->path());
						m_InQueue.erase(el->path().stem().string());
						continue;
					}
					std::cout << "Added to queue: " << uid << std::endl;

					auto add = m_DB->GetConnector()->ExecuteStreamStatement("INSERT IGNORE INTO rs_progress (uploaderid, timestamp) VALUES (:a<int>, UNIX_TIMESTAMP())");
					add.AttachValues(uid);

					QueueElement element;
					element.mTS = IsUserPriorticed(user) ? 0 : TS; // Will be sorted to the front then
					element.mUID = uid;
					element.mPath = el->path();
					m_Queue.push_back(std::move(element));
					newElement = true;
				}
				catch (otl_exception& p)
				{
					std::cerr << p.msg << std::endl; // print out error message
					std::cerr << p.stm_text << std::endl; // print out SQL that caused the error
					std::cerr << p.var_info << std::endl; // print out the variable that caused the error
				}
			}
		}

		if (m_Queue.empty())
		{
			std::this_thread::sleep_for(std::chrono::seconds(1));
			//std::cout << "Empty queue!" << std::endl;
			continue; // Making sure that the vector is not empty!
		}

		// Sorting the vector
		if (newElement) std::sort(m_Queue.begin(), m_Queue.end(), [](auto& left, auto&right) {return left.mTS < right.mTS; });

		QueueElement el = m_Queue.front();
		if (el.mPath.extension() == ".zip" && !m_Lock[el.mPath.stem().string()])
		{
			try
			{
				m_Lock[el.mPath.stem().string()] = true;
				int uid = el.mUID;
				std::cout << "\nWorking on: " << el.mPath.stem().string() << std::endl;
				Decompress(el.mPath.string(), el.mPath.stem().string());
				std::this_thread::sleep_for(std::chrono::seconds(1));
				std::cout << "UID: " << uid << std::endl;
				// Note a log can be empty!
				if (fs::exists(m_Directory + el.mPath.stem().string() + ".lua") && fs::exists(m_Directory + el.mPath.stem().string() + ".txt"))
				{
					try
					{
						if (m_Post)
							RPLL::AnalyzerPost inv(std::string(m_Directory + el.mPath.stem().string() + ".lua").c_str(), std::string(m_Directory + el.mPath.stem().string() + ".txt").c_str(), uid, *m_DB, m_Processor);
						else
							RPLL::Analyzer inv(std::string(m_Directory + el.mPath.stem().string() + ".lua").c_str(), std::string(m_Directory + el.mPath.stem().string() + ".txt").c_str(), uid, *m_DB, m_Processor);
					}
					catch(std::exception anex)
					{
						std::cout << "Exception: Analyzer: " << anex.what() << std::endl;
					}
					catch(...)
					{
						std::cout << "Catch em all!" << std::endl;
					}
				}
				else if (fs::exists(m_Directory + el.mPath.stem().string() + ".lua") && !fs::exists(m_Directory + el.mPath.stem().string() + ".txt"))
				{
					std::experimental::filesystem::path temp(m_Directory + el.mPath.stem().string() + ".lua");
					remove(temp);
				}
				else if (!fs::exists(m_Directory + el.mPath.stem().string() + ".lua") && fs::exists(m_Directory + el.mPath.stem().string() + ".txt"))
				{
					std::experimental::filesystem::path temp(m_Directory + el.mPath.stem().string() + ".txt");
					remove(temp);
				}
				auto query = m_DB->GetConnector()->ExecuteStreamStatement("DELETE FROM rs_progress WHERE uploaderid=:a<int>", 1);
				query.AttachValues(uid);
				m_InQueue.erase(el.mPath.stem().string());
				m_Lock.erase(el.mPath.stem().string());
				m_Queue.erase(m_Queue.begin());
			}
			catch (...)
			{
				if (m_TimeStamp.find(el.mPath.stem().string()) == m_TimeStamp.end()) // Does not exist
				{
					m_TimeStamp[el.mPath.stem().string()] = 0;
				}
				else if (m_TimeStamp[el.mPath.stem().string()] < 15)
				{
					m_TimeStamp[el.mPath.stem().string()]++;
					m_Queue.push_back(*m_Queue.begin());
					m_Queue.erase(m_Queue.begin());
					std::this_thread::sleep_for(std::chrono::seconds(5));
				}
				else
				{
					m_TimeStamp[el.mPath.stem().string()] = 0;
					m_Lock[el.mPath.stem().string()] = false;
					int uid = el.mUID;
					if (uid != 0)
					{
						auto query = m_DB->GetConnector()->ExecuteStreamStatement("DELETE FROM rs_progress WHERE uploaderid=:a<int>", 1);
						query.AttachValues(uid);
					}
					remove(el.mPath);
					m_Queue.erase(m_Queue.begin());
				}
				m_Lock[el.mPath.stem().string()] = false;
			}
		}
		
		std::this_thread::sleep_for(std::chrono::seconds(1));
	}
}

RPLL::RPLLHandler::RPLLHandler(std::string _Directory, bool _PostVanilla) : m_Directory(_Directory), m_Post(_PostVanilla)
{
	m_DB = new DatabaseAccess(_PostVanilla);

	m_Run = fs::exists(fs::begin(fs::directory_iterator(m_Directory))->status());

	m_Processor = new ArmoryProcessor(m_DB, _PostVanilla);
	APProcessor = new std::thread(&RPLL::ArmoryProcessor::OnUpdate, m_Processor);
}


RPLL::RPLLHandler::~RPLLHandler()
{
	delete m_DB;
	m_DB = nullptr;
	m_Processor->mRun = false;
	delete APProcessor;
	APProcessor = nullptr;
	delete m_Processor;
	m_Processor = nullptr;
}

void RPLL::RPLLHandler::Run()
{
	SearchFile();
}

void RPLL::RPLLHandler::Stop()
{
	m_Run = false;
}

void RPLL::RPLLHandler::Decompress(std::string _File, std::string _Name)
{ 
	miniz_cpp::zip_file file(_File);
	file.extractall(m_Directory);
	#if __linux__
		if (!fs::exists(m_Directory + "Files/" + _Name + ".zip"))
			fs::copy_file(_File.c_str(), m_Directory + "Files/" + _Name + ".zip");
	#else
		if (!fs::exists(m_Directory + "Files//" + _Name + ".zip"))
			fs::copy_file(_File.c_str(), m_Directory + "Files//" + _Name + ".zip");
	#endif
	remove(_File.c_str());
}

bool RPLL::RPLLHandler::IsUserPriorticed(std::string _Name)
{
	int uid = 0;
	if (_Name.size() < 32)
	{
		try
		{
			uid = static_cast<int>(std::stoul("0x" + _Name, nullptr, 16));
		}
		catch (...)
		{

		}
	}

	auto query = m_DB->GetConnector(true)->ExecuteStreamStatement("SELECT level FROM gn_user WHERE id=:b<int>");
	query.AttachValues(uid);
	if (!query.HasData()) 
		return false;
	int level;
	query.ReadData(&level);
	return level >= 3;
}

int RPLL::RPLLHandler::GetUserId(std::string _Name, long long _TimeStamp)
{
	int x = 0;
	if (_Name.size() < 32)
	{
		try
		{
			x = static_cast<int>(std::stoul("0x"+_Name, nullptr, 16));
		}
		catch (...)
		{

		}
	}
	auto query = m_DB->GetConnector(true)->ExecuteStreamStatement("SELECT id FROM gn_user WHERE uhash=:a<char[121]> or id=:b<int>");
	query.AttachValues(_Name, x);
	if (!query.HasData()) return 0;
	int userid;
	query.ReadData(&userid);
	query = m_DB->GetConnector()->ExecuteStreamStatement("select IFNULL(MAX(a.id), 0) from gn_uploader a WHERE a.timestamp=:z<bigint>");
	query.AttachValues(_TimeStamp);
	int uid = 0;
	if (query.HasData())
		query.ReadData(&uid);
	if (uid == 0) // gn_uploader does not exist
	{
		query = m_DB->GetConnector()->ExecuteStreamStatement("INSERT INTO gn_uploader (userid, timestamp) VALUES (:a<int>, :b<bigint>)");
		query.AttachValues(userid, _TimeStamp);
		return GetUserId(_Name, _TimeStamp);
	}
	return uid;
	//return m_DB.Get_Name_ID(_Name, m_KnownUser, "select MAX(a.id) from gn_uploader a LEFT JOIN gn_user b ON a.userid = b.id where b.uhash=:n<char[60]>", _Name);
}
