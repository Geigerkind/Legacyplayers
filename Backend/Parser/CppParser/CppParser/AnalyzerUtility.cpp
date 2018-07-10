#include "AnalyzerUtility.h"

AnalyzerUtility::~AnalyzerUtility()
{
	m_DB = nullptr;
	delete m_ArmoryData;
	if (m_CBTLogParser != nullptr)
		delete m_CBTLogParser;
}

void AnalyzerUtility::AdjustTimeZone(int _TimeZone, std::vector<std::vector<RPLL::SessionLine>>& _Sessions, std::map<std::string, RPLL::UnitData>& _UnitData)
{
	int diff = _TimeZone * 3600000;
	for (auto& sessVec : _Sessions)
		for (auto& sess : sessVec)
			sess.m_TimeStamp += diff; // Does that make a difference?

	for (auto& player : _UnitData)
	{
		if (player.second.m_Joined > 0)
			player.second.m_Joined += diff;
		if (player.second.m_Left > 0)
			player.second.m_Left += diff;
	}
}

int AnalyzerUtility::GetMaxTableId(const std::string _Table, bool _PostVanilla)
{
	int ID = 0;
	//auto query = m_DB->ExecuteStreamStatement("SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'RPLL" + (!_PostVanilla ? std::string("_VANILLA") : std::string("_TBC")) + "' AND TABLE_NAME=:a<char[20]>", 1, true);
	//query.AttachValues(_Table);
	auto query = m_DB->ExecuteStreamStatement("SELECT (id) as autoinc FROM RPLL" + (!_PostVanilla ? std::string("_VANILLA") : std::string("_TBC")) + "." + _Table + " ORDER BY id DESC LIMIT 1", 1, true);
	if (query.HasData())
		query.ReadData(&ID);
	ID += 1; // To have auto inc
	query.CompleteStatement();
	//std::cout << _Table << " => " << ID << std::endl;
	return ID;
}

template<typename T>
int AnalyzerUtility::GetTimeDifference(int version, int _Minute, int _Second, __int64 _StartTime, std::vector<std::vector<T>>& _CombatLogEvents)
{
	T ev;
	// Check for the sync message!
	for (auto cbtSess : _CombatLogEvents)
	{
		for (auto& cbtLogEvent : cbtSess)
		{
			if (cbtLogEvent.m_Action == static_cast<char>(RPLL::Action::RPLL))
			{
				return cbtLogEvent.m_Amount;
			}
		}
	}
	
	return 0;
}

template int AnalyzerUtility::GetTimeDifference<RPLL::CombatLogEvent>(int version, int _Minute, int _Second, __int64 _StartTime, std::vector<std::vector<RPLL::CombatLogEvent>>& _CombatLogEvents);
template int AnalyzerUtility::GetTimeDifference<RPLL::CombatLogEventPost>(int version, int _Minute, int _Second, __int64 _StartTime, std::vector<std::vector<RPLL::CombatLogEventPost>>& _CombatLogEvents);

RPLL::Armory* AnalyzerUtility::FetchArmoryData(const char* _Armory, const int& _Uploader, RPLL::DatabaseAccess& DBAccess, bool _PostVanilla, RPLL::ArmoryProcessor* _Processor)
{
	return new RPLL::Armory(_Armory, _Uploader, DBAccess, _PostVanilla, _Processor);
}

std::vector<std::vector<RPLL::CombatLogEvent>> AnalyzerUtility::FetchCombatLog(const char* _CBTLog, RPLL::DatabaseAccess& db)
{
	RPLL::CombatlogParser clogParser; // Guess this could be made singleton
	std::string textData = RPLL::File_ReadAllText(_CBTLog);
	return (clogParser.Parse(textData.c_str(), static_cast<int>(textData.length()), db));
}

std::vector<std::vector<RPLL::CombatLogEventPost>> AnalyzerUtility::FetchCombatLog(const char* _CBTLog, bool _PostVanilla, RPLL::DatabaseAccess& db)
{
	RPLL::CombatlogParser clogParser; // Guess this could be made singleton

	std::string textData = RPLL::File_ReadAllText(_CBTLog);
	return (clogParser.Parse(textData.c_str(), static_cast<int>(textData.length()), true, db));
}

std::vector<RPLL::SessionLine*>& AnalyzerUtility::GetNextRaid(RPLL::DatabaseAccess& _DB)
{
	st_gnr_RaidData.clear(); // Destroys all SessionLines, not sure if that will cause problems later
	m_RaidID = 0;

	std::string zoneName;
	for (; st_gnr_Position_Outer != m_ArmoryData->m_Parser->m_sessions.rend(); st_gnr_Position_Inner = (*(++st_gnr_Position_Outer)).begin()) // Maybe also saving these end pointers would increase the performance
	{
		for (; st_gnr_Position_Inner != (*st_gnr_Position_Outer).end(); ++st_gnr_Position_Inner)
		{
			if (((*st_gnr_Position_Inner).m_Type == 2 || (*st_gnr_Position_Inner).m_Type == 24) && *(*st_gnr_Position_Inner).mI_Param > 0) // Lets see how much overhead it causes
				m_RaidID = *(*st_gnr_Position_Inner).mI_Param;
			if (!zoneName.empty())
				st_gnr_RaidData.push_back(&(*st_gnr_Position_Inner));
			if ((*st_gnr_Position_Inner).m_Type == 2 && zoneName.empty() && _DB.IsInstance(*(*st_gnr_Position_Inner).mS_Param)) // Instances also include Warsong gulch etc.
			{
				st_gnr_RaidData.push_back(&(*st_gnr_Position_Inner));
				zoneName = *(*st_gnr_Position_Inner).mS_Param;
			}
			else if ((*st_gnr_Position_Inner).m_Type == 2 && zoneName != *(*st_gnr_Position_Inner).mS_Param && !zoneName.empty()) 
			{
				// Special case: Mag
				if (zoneName == "Magtheridon's Lair" && *(*st_gnr_Position_Inner).mS_Param == "Hellfire Peninsula")
					continue;

				bool broken = false;
				for (auto itr = st_gnr_Position_Inner; itr != (*st_gnr_Position_Outer).end(); ++itr)
				{
					if ((*itr).m_Type == 2 && _DB.IsInstance(*(*itr).mS_Param))
					{
						if (zoneName == *(*itr).mS_Param)
						{
							goto skipRaidReturn;
						}
						broken = true;
						break;
					}
				}
				if (!broken)
				{
					for (auto oitr = st_gnr_Position_Outer + 1; oitr != m_ArmoryData->m_Parser->m_sessions.rend(); ++oitr)
					{
						for (auto itr = (*oitr).begin(); itr != (*oitr).end(); ++itr)
						{
							if ((*itr).m_Type == 2 && _DB.IsInstance(*(*itr).mS_Param))
							{
								if (zoneName == *(*itr).mS_Param)
								{
									goto skipRaidReturn;
								}
								break;
							}
						}
					}
				}
				return st_gnr_RaidData;
				skipRaidReturn:;
			}
		}
	}
	return st_gnr_RaidData;
}

std::string AnalyzerUtility::GetLookUpSpace(const char* _Table, const int _Border/*, const int& _Uploader*/, bool _PostVanilla)
{
	int MIN = _Border;
	int MAX = GetMaxTableId(_Table, _PostVanilla);
	//auto query = m_DB->ExecuteStreamStatement(_Statement, 1);
	//query.AttachValues(_Border/*, _Uploader*/);
	//if (query.HasData())
	//{
	//	query.ReadData(&MIN);
	//	query.ReadData(&MAX);
	//}
	return std::to_string(MIN) + "," + std::to_string(MAX);
}

// TODO: Sort by liklyness!
// TODO: Optimize by maintaining a list of values that get only higher than the curTime
std::vector<std::vector<RPLL::SessionLine*>::iterator> AnalyzerUtility::GetPossibleEvents(std::vector<__int64>& realTime, std::vector<RPLL::SessionLine*>& remainingList, int timeBuffer, long long curTime)
{
	std::vector<std::vector<RPLL::SessionLine*>::iterator> result;
	for (auto sess = remainingList.begin(); sess != remainingList.end(); ++sess)
	{
		if (realTime[(*sess)->m_RTIndex] + (*sess)->m_TimeStamp + timeBuffer >= curTime && realTime[(*sess)->m_RTIndex] + (*sess)->m_TimeStamp - timeBuffer <= curTime)
			result.push_back(sess);
	}
	return result;
}

int AnalyzerUtility::InitRaidCollection(int RaidingGuildID, __int64 StartTime, __int64 EndTime, int _Uploader, int _ServerId, int _Faction,
	int InstanceID, RPLL::DatabaseAccess& DBAccess, int& RS_InstanceID, int& RS_UploaderID, int& RS_ProgressID,
	__int64 evTS, int evSource, int evAmount) const
{
	// Must be in a 12 hour span to include all timezones!
	auto query = m_DB->ExecuteStreamStatement("SELECT a.id, a.guildid, a.start, a.end FROM rs_instances a LEFT JOIN `rpll`.gn_guilds b ON a.guildid = b.id WHERE b.serverid=:y<int> and a.instanceid=:a<int> and ((a.saveid!=0 and a.saveid=:c<int>) or (a.saveid=0 and a.guildid =:q<int>)) and a.end+86400000>:d<bigint> and a.start-86400000<:e<bigint>", 1);
	query.AttachValues(_ServerId/*, _Faction*/, InstanceID, m_RaidID, RaidingGuildID, StartTime, StartTime);
	if (query.HasData()
		&& (DBAccess.GetGuildID("Pug Raid", _ServerId, _Faction, false) != RaidingGuildID || m_RaidID > 0)
		)
	{
		// If the duration is longer, we would like to update it
		// Also if it was listed as Pug raid, we might want to correct it
		__int64 start, end;
		int guildid;
		query.ReadData(&RS_InstanceID, &guildid, &start, &end);
		if (m_RaidID == 0 && RaidingGuildID != guildid)
		{
			goto mistakenMerge;
		}
		bool isListedAsPug = DBAccess.IsPugRaid(guildid, _ServerId, _Faction);
		if ((EndTime-StartTime) > (end-start))
		{
			if (isListedAsPug && RaidingGuildID != guildid)
			{
				auto updateRaid = m_DB->ExecuteStreamStatement("UPDATE rs_instances SET guildid=:a<int>, start=:b<bigint>, end=:c<bigint> WHERE id=:d<int>", 1);
				updateRaid.AttachValues(RaidingGuildID, StartTime, EndTime, RS_InstanceID);
			}
			else
			{
				auto updateRaid = m_DB->ExecuteStreamStatement("UPDATE rs_instances SET start=:b<bigint>, end=:c<bigint> WHERE id=:d<int>", 1);
				updateRaid.AttachValues(StartTime, EndTime, RS_InstanceID);
			}
		}
		else if (isListedAsPug && RaidingGuildID != guildid)
		{
			auto updateRaid = m_DB->ExecuteStreamStatement("UPDATE rs_instances SET guildid=:a<int> WHERE id=:d<int>", 1);
			updateRaid.AttachValues(RaidingGuildID, RS_InstanceID);
		}
	}
	else
	{
		mistakenMerge:;
		query = m_DB->ExecuteStreamStatement("INSERT INTO rs_instances (instanceid, guildid, start, end, saveid) VALUES (:a<int>, :q<int>, :b<bigint>, :c<bigint>, :d<int>)", 1);
		query.AttachValues(InstanceID, RaidingGuildID, StartTime, EndTime, m_RaidID);
		query = m_DB->ExecuteStreamStatement("SELECT id FROM rs_instances WHERE instanceid=:a<int> and guildid=:b<int> and start=:d<bigint> and end=:e<bigint> and saveid=:c<int>", 1);
		query.AttachValues(InstanceID, RaidingGuildID, StartTime, EndTime, m_RaidID);
		if (query.HasData())
			query.ReadData(&RS_InstanceID);
	}

	if (RS_InstanceID == 0)
	{
		std::cout << "Instance ID had been 0 ?!" << std::endl;
		return 1; // Error code
	}

	// Insert into rs_instance_uploader
	// Retrieve the id
	query = m_DB->ExecuteStreamStatement("SELECT a.id FROM rs_instance_uploader a JOIN rs_instances b ON a.instanceid = b.id WHERE a.instanceid=:a<int> and a.uploaderid=:b<int> and b.end>=:c<bigint>", 1);
	query.AttachValues(RS_InstanceID, _Uploader, StartTime);
	if (query.HasData())
	{
		query.ReadData(&RS_UploaderID);

		// This must be super slow later :/
		/*
		 * Commented out because, we dont allow duplicate gn_uploader to begin with
		 *
		query = m_DB->ExecuteStreamStatement("SELECT a.id FROM rs_healing a LEFT JOIN rs_sat_reference b ON a.satid = b.id LEFT JOIN rs_sa_reference c ON b.said = c.id WHERE a.amount=:a<int> and c.sourceid=:c<int> and a.timestamp<=:b<int>+1000 and a.timestamp>=:e<int>-1000", 1);
		query.AttachValues(evAmount, evSource, static_cast<int>(evTS - StartTime), static_cast<int>(evTS - StartTime));
		if (query.HasData())
		{
			std::cout << "Duplicate log!" << std::endl;
			return 2;
		}
		std::cout << "No log found!" << std::endl;*/
		//return 3;

		std::cout << "Duplicate log: Removed!" << std::endl;
		return 2;
	}

	// Get default user preference
	int prvt = 0;
	query = m_DB->ExecuteStreamStatement("SELECT a.defaultpriv FROM rpll.gn_user a JOIN gn_uploader b ON a.id = b.userid WHERE b.id = :a<int>", 1);
	query.AttachValues(_Uploader);
	if (query.HasData())
		query.ReadData(&prvt);

	query = m_DB->ExecuteStreamStatement("INSERT INTO rs_instance_uploader (instanceid, uploaderid, private) VALUES (:a<int>, :b<int>, :c<int>)", 1);
	query.AttachValues(RS_InstanceID, _Uploader, prvt);
	query.Flush();
	query = m_DB->ExecuteStreamStatement("SELECT id FROM rs_instance_uploader WHERE instanceid=:a<int> and uploaderid=:b<int> ORDER BY id DESC LIMIT 1", 1);
	query.AttachValues(RS_InstanceID, _Uploader);
	if (query.HasData())
		query.ReadData(&RS_UploaderID);

	query = m_DB->ExecuteStreamStatement("INSERT IGNORE INTO rs_progress (uploaderid) VALUES (:a<int>)");
	query.AttachValues(_Uploader);
	query = m_DB->ExecuteStreamStatement("UPDATE rs_progress SET instanceid=:a<int>, timestamp=UNIX_TIMESTAMP(), progress=0 WHERE uploaderid=:b<int>");
	query.AttachValues(InstanceID, _Uploader);
	RS_ProgressID = _Uploader;
	return 0;
}

void AnalyzerUtility::SetSpeedRunRecord(std::map<std::pair<int, int>, std::pair<long long, long long>>& bossAttempts, int duration, int RS_UploaderID, int RaidingGuildID, int InstanceID, int NumBosses) const
{
	// Evaluate instance records
	if (bossAttempts.size() < NumBosses) return;

	// Retrieving correct duration now
	long long min = bossAttempts.begin()->second.first;
	long long max = bossAttempts.begin()->second.second;
	for (auto& atmt : bossAttempts)
	{
		min = min > atmt.second.first ? atmt.second.first : min;
		max = max < atmt.second.second ? atmt.second.second : max;
	}
	if (min > 0 && max > 0 && max > min)
		duration = static_cast<int>(max - min);

	duration /= 100;// Only save time accurate to a tenth!
	auto query = m_DB->ExecuteStreamStatement("INSERT INTO rs_guilds_speedruns (value, uploaderid) VALUES (:c<int>, :d<int>)", 1);
	query.AttachValues(duration, RS_UploaderID);

	// Best speedrun
	query = m_DB->ExecuteStreamStatement("SELECT a.value FROM rs_guilds_speedruns_best a LEFT JOIN rs_instance_uploader b ON a.uploaderid = b.id LEFT JOIN rs_instances c ON b.instanceid = c.id WHERE c.guildid=:a<int> and c.instanceid=:b<int> ORDER BY a.id DESC LIMIT 1", 1);
	query.AttachValues(RaidingGuildID, InstanceID);
	if (query.HasData())
	{
		int BestClear;
		query.ReadData(&BestClear);
		if (BestClear > duration)
		{
			query = m_DB->ExecuteStreamStatement("INSERT INTO rs_guilds_speedruns_best (value, uploaderid) VALUES (:c<int>, :d<int>)", 1);
			query.AttachValues(duration, RS_UploaderID);
		}
	}
	else
	{
		query = m_DB->ExecuteStreamStatement("INSERT INTO rs_guilds_speedruns_best (value, uploaderid) VALUES (:c<int>, :d<int>)", 1);
		query.AttachValues(duration, RS_UploaderID);
	}
}

template<typename T>
int AnalyzerUtility::GetGuildID(std::vector<__int64>& realTime, std::vector<std::string>& nameValues, const long long start, const long long end, const int _ServerID, RPLL::DatabaseAccess& _DBAccess, std::map<int, bool>& _Particitpants, std::vector<std::vector<T>>& _CombatLogEvents)
{
	int numPlayer = 0;
	std::map<int, int> numPerGuild;
	int factionID = 0;
	for (int i=0; i<m_ArmoryData->m_Parser->m_playerdata.size(); ++i)
	{
		if (m_ArmoryData->m_Parser->m_playerdata[i].size() > 0)
		{
			factionID = m_ArmoryData->m_Parser->m_playerdata[i][0]._faction;
			break;
		}
	}
	if (factionID < 0 || factionID > 2)
	{
		std::cout << "Faction is weird ?! => " << factionID << std::endl;
		return 0;
	}

	// In order to filter out unrelated people we are going to say that everyone that is near a boss event, i.e. 2 sec since last event, is in the raid
	__int64 lastBossuTS = 0;
	for (auto& CBTLogVec : _CombatLogEvents)
	{
		for (auto cbtLogEvent : CBTLogVec)
		{
			__int64 uTS = cbtLogEvent.m_Timestamp + realTime[cbtLogEvent.m_RTIndex];
			if (uTS < start) continue;
			if (uTS > end) break;

			int cbtSourceID = GetTargetSourceID(_DBAccess, nameValues[cbtLogEvent.m_Source], uTS);
			int cbtTargetID = GetTargetSourceID(_DBAccess, nameValues[cbtLogEvent.m_Target], uTS);

			if (cbtTargetID < 300000 && _DBAccess.IsBossNPC(nameValues[cbtLogEvent.m_Target], cbtTargetID))
				lastBossuTS = uTS;
			
			if (cbtSourceID >= 300000 && cbtTargetID < 300000)
			{
				//std::cout << nameValues[cbtLogEvent.m_Source] << std::endl;
				if (uTS - lastBossuTS <= 2000)
					_Particitpants[cbtSourceID] = true;
			}
		}
	}

	for (auto _par : _Particitpants)
	{
		if (_par.second)
			++numPlayer;
	}

	for (auto& player : m_ArmoryData->m_UnitData)
	{
		if ((
			(player.second.m_Joined == -1 && player.second.m_Left == -1)
			|| (player.second.m_Left != -1 && player.second.m_Joined != -1 && player.second.m_Left <= end && player.second.m_Left >= start)
			|| (player.second.m_Left != -1 && player.second.m_Joined != -1 && player.second.m_Left >= end && player.second.m_Joined <= end)
			|| (((player.second.m_Joined != -1 && player.second.m_Joined <= end) || player.second.m_Joined == -1))
			)
			&& player.second.m_Class != -1
			&& (player.second.m_Faction == 0 || player.second.m_Faction == factionID)
			&& _Particitpants[player.second.m_ID]
			)
		{
			if (player.second.m_GuildID != -1) // -1 unknown guild | -2 NO GUILD!
			{
				auto foundID = numPerGuild.find(player.second.m_GuildID);
				if (foundID != numPerGuild.end())
				{
					++foundID->second;
				}
				else
				{
					numPerGuild.insert(std::make_pair(player.second.m_GuildID, 1));
				}
				//++numPlayer;
			}
		}
	}
	int GuildID = _DBAccess.GetGuildID("Pug Raid", _ServerID, factionID, true);

	if (numPlayer == 0)
	{
		std::cout << "This should never occour, we have no raid participants o.O" << std::endl;
		return 0; // We should error here cause basically nobody is participating o.O
	}

	std::cout << "Num player: " << numPlayer << std::endl;

	// Sorting it by number
	std::vector<std::pair<int,int>> numPerGuildVec;
	for (auto& guild : numPerGuild)
		numPerGuildVec.push_back(guild);
	std::sort(numPerGuildVec.begin(), numPerGuildVec.end(), [](const std::pair<int, int>& first, const std::pair<int, int>& second) {return first.second > second.second; });

	for (auto& guild : numPerGuildVec)
	{
		if ((1.0*guild.second / numPlayer) > 0.3)
		{
			std::cout << "Guild: " << guild.first << std::endl;
			if (guild.first <= 0)
				return GuildID; // TODO
			return guild.first;
		}
	}

	return GuildID;
}

template int AnalyzerUtility::GetGuildID<RPLL::CombatLogEvent>(std::vector<__int64>& realTime, std::vector<std::string>& nameValues, const long long start, const long long end, const int _ServerID, RPLL::DatabaseAccess& _DBAccess, std::map<int, bool>& _Particitpants, std::vector<std::vector<RPLL::CombatLogEvent>>& _CombatLogEvents);
template int AnalyzerUtility::GetGuildID<RPLL::CombatLogEventPost>(std::vector<__int64>& realTime, std::vector<std::string>& nameValues, const long long start, const long long end, const int _ServerID, RPLL::DatabaseAccess& _DBAccess, std::map<int, bool>& _Particitpants, std::vector<std::vector<RPLL::CombatLogEventPost>>& _CombatLogEvents);