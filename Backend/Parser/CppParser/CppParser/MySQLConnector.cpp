#include "MySQLConnector.h"

#include "MySQL_OTL.h"

namespace RPLL
{
	template<typename T_Value>
	void OTLStream_AttachValues(otl_stream* _Stream, const T_Value& _Value)
	{
		(*_Stream) << _Value;
	}
	template<typename T_Value>
	void OTLStream_ReadData(otl_stream* _Stream, T_Value* _Value)
	{
		(*_Stream) >> *_Value;
	}

	template void OTLStream_AttachValues<std::string>(otl_stream* _Stream, const std::string& _Value);
	template void OTLStream_AttachValues<int>(otl_stream* _Stream, const int& _Value);
	template void OTLStream_AttachValues<unsigned int>(otl_stream* _Stream, const unsigned int& _Value);
    template void OTLStream_AttachValues<long long>(otl_stream* _Stream, const long long& _Value);
	//template void OTLStream_AttachValues<long>(otl_stream* _Stream, const long& _Value);
	template void OTLStream_AttachValues<short>(otl_stream* _Stream, const short& _Value);
	//template void OTLStream_AttachValues<bool>(otl_stream* _Stream, const bool& _Value);

	template void OTLStream_ReadData<int>(otl_stream* _Stream, int* _Value);
	template void OTLStream_ReadData<unsigned int>(otl_stream* _Stream, unsigned int* _Value);
    template void OTLStream_ReadData<long long>(otl_stream* _Stream, long long* _Value);
	//template void OTLStream_ReadData<long>(otl_stream* _Stream, long* _Value);
	template void OTLStream_ReadData<short>(otl_stream* _Stream, short* _Value);
	//template void OTLStream_ReadData<bool>(otl_stream* _Stream, bool* _Value);
	template void OTLStream_ReadData<std::string>(otl_stream* _Stream, std::string* _Value);

	MySQLStream::MySQLStream(MySQLConnector& _Connector, const char* _Statement, int _RowBufferCount)
	{
		m_Stream = new otl_stream(_RowBufferCount, _Statement, *_Connector.m_DB);
	}
	MySQLStream::~MySQLStream()
	{
		//CompleteStatement();
	}


	bool MySQLStream::HasData() const
	{
		return !m_Stream->eof();
	}

	void MySQLStream::Flush()
	{
		m_Stream->flush();
	}
	void MySQLStream::CompleteStatement()
	{
		if (m_Stream != nullptr)
		{
			delete m_Stream;
			m_Stream = nullptr;
		}
	}

	MySQLConnector::MySQLConnector(const char* _Username, const char* _Password, const char* _DSN, const char* _DatabaseName)
	{
		m_DB = new otl_connect();
		std::string connectionString = std::string(_Username) + "/" + _Password + "@" + _DSN + "@wait_timeout=28600@interactive_timeout=28600";
		connectionString = "dsn=" + std::string(_DSN) + ";wait_timeout=28600;interactive_timeout=28600;";
		std::string useDBString = std::string("USE ") + _DatabaseName;
		otl_connect::otl_initialize(); // initialize the database environment
		try {

			m_DB->rlogon(connectionString.c_str()); // Logon the connection
			otl_cursor::direct_exec(*m_DB, useDBString.c_str(), otl_exception::enabled); // Connect to Database

			m_Connected = true;

			this->ExecuteStatement("SET SESSION wait_timeout=28600");
			this->ExecuteStatement("SET SESSION interactive_timeout=28600");
		}
		catch (otl_exception& p) { // intercept OTL exceptions
			std::cerr << p.msg << std::endl; // print out error message
			std::cerr << p.stm_text << std::endl; // print out SQL that caused the error
			std::cerr << p.var_info << std::endl; // print out the variable that caused the error
		}
	}
	void MySQLConnector::ExecuteStatement(const char* _Statement)
	{
		try {
			otl_cursor::direct_exec(*m_DB, _Statement/*, otl_exception::disabled*/); // drop table
		}
		catch (otl_exception& p) { // intercept OTL exceptions
			std::cerr << p.msg << std::endl; // print out error message
			std::cerr << p.stm_text << std::endl; // print out SQL that caused the error
			std::cerr << p.var_info << std::endl; // print out the variable that caused the error
		}
	}
	MySQLConnector::~MySQLConnector()
	{
		for (auto& stmt : m_Streams)
		{
			stmt.second.second->CompleteStatement();
			delete stmt.second.second;
		}

		if (m_Connected == true)
		{
			m_DB->logoff(); // disconnect from the database
		}
		if (m_DB != nullptr)
		{
			delete m_DB;
			m_DB = nullptr;

		}
	}
	void MySQLConnector::SetBufferSize(int _Size)
	{
		m_DB->set_max_long_size(_Size);
	}

	MySQLStream MySQLConnector::ExecuteStreamStatement(std::string _Statement, int _RowBufferCount, bool _IgnoreSave)
	{
		// Clearing old statements
		// Allow 120 seconds!
		std::time_t t = std::time(0);
		auto foundID = m_Streams.find(_Statement);
		if (foundID != m_Streams.end())
		{
			if (foundID->second.first + 120 < t)
			{
				foundID->second.second->CompleteStatement();
				delete foundID->second.second;
				m_Streams.erase(foundID);
			}
			else
			{
				return *foundID->second.second;
			}
		}
		MySQLStream* stream = new MySQLStream(*this, _Statement.c_str() , _RowBufferCount);
		if (!_IgnoreSave)
			m_Streams.insert(std::make_pair(_Statement, std::make_pair(t, stream)));
		return *stream;
	}
}
