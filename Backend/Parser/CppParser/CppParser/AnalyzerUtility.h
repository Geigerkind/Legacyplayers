#pragma once
#include "CombatLogParser.h"
#include "ParsingStructs.h"
#include <map>
#include "Armory.h"
#include "MySQLConnector.h"
#include <experimental/filesystem>
#include <iostream>
#include "FileUtility.h"

#if __linux__
#include <algorithm>
#include <inttypes.h>
#define __int64 long long
#endif

class AnalyzerUtility
{
public:
	virtual ~AnalyzerUtility();

	static int ActionToInt(const RPLL::Action& _Action)
	{
		switch (_Action)
		{
		case RPLL::Action::Heal: return 0;
		case RPLL::Action::CritHeal: return 1;
		case RPLL::Action::Hit: return 0;
		case RPLL::Action::Crit: return 1;
		case RPLL::Action::Missed: return 2;
		default: return 0;
		}
	}

	static int ExtraModToInt(const RPLL::ExtraModifier& _ExtraMod)
	{
		// 20 + this equals hits for these extra things
		// 40 + this equals hits for these extra things
		switch (_ExtraMod)
		{
		case RPLL::ExtraModifier::None: return 0;
		case RPLL::ExtraModifier::Glancing: return 2;
		case RPLL::ExtraModifier::Dodged: return 3;
		case RPLL::ExtraModifier::Parried: return 4;
		case RPLL::ExtraModifier::Resisted: return 5;
		case RPLL::ExtraModifier::Blocked: return 6;
		case RPLL::ExtraModifier::Crushing: return 7;
		case RPLL::ExtraModifier::Absorbed: return 8;
		case RPLL::ExtraModifier::Evaded: return 9;
		case RPLL::ExtraModifier::Interrupted: return 10;
		case RPLL::ExtraModifier::Immune: return 11;
			// 12 miss
		default: return 0;
		}
	}

	RPLL::MySQLConnector* m_DB = nullptr;
	RPLL::Armory* m_ArmoryData = nullptr;
	std::vector<std::pair<std::pair<std::string, std::string>, std::pair<__int64, __int64>>> m_MCedPets;
	RPLL::CombatlogParser* m_CBTLogParser = nullptr;

	template<typename T>
	static int GetTimeDifference(int version, int _Minute, int _Second, __int64 _StartTime, std::vector<std::vector<T>>& _CombatLogEvents);
	static void AdjustTimeZone(int _TimeZone, std::vector<std::vector<RPLL::SessionLine>>& _Sessions, std::map<std::string, RPLL::UnitData>& _UnitData);
	int GetMaxTableId(const std::string _Table, bool _PostVanilla = false);

	static RPLL::Armory* FetchArmoryData(const char* _Armory, const int& _Uploader, RPLL::DatabaseAccess& DBAccess, bool _PostVanilla = false, RPLL::ArmoryProcessor* _Processor = nullptr);
	static std::vector<std::vector<RPLL::CombatLogEvent>> FetchCombatLog(const char* _CBTLog, RPLL::DatabaseAccess& db);
	static std::vector<std::vector<RPLL::CombatLogEventPost>> FetchCombatLog(const char* _CBTLog, bool _PostVanilla, RPLL::DatabaseAccess& db);
	
	std::vector<RPLL::SessionLine*> m_RaidData;
	int m_RaidID;
	std::vector<RPLL::SessionLine*> st_gnr_RaidData;
	std::vector<std::vector<RPLL::SessionLine>>::reverse_iterator st_gnr_Position_Outer;
	std::vector<RPLL::SessionLine>::iterator st_gnr_Position_Inner;
	std::vector<RPLL::SessionLine*>& GetNextRaid(RPLL::DatabaseAccess& _DB);

	std::string GetLookUpSpace(const char* _Table, const int _Border/*, const int& _Uploader*/, bool _PostVanilla = false);

	int GetTargetSourceID(RPLL::DatabaseAccess& _DB, std::string& _Name, __int64 _TimeFrame = 0, bool overRule = false, int _Id = 0, int _PetId = 0, bool _TargetIsNpc = false)
	{
		if (_PetId > 0)
			return _PetId;
		if (_Id > 0)
			return _DB.GetNPCID(_Name, _Id, true); // Its an NPC! We dont want pets here apparently

		auto foundID = m_ArmoryData->m_UnitData.find(_Name);
		if (foundID != m_ArmoryData->m_UnitData.end())
		{
			if (_TargetIsNpc || foundID->second.m_Owner == 0) // The first condition is a little odd ? Bad name?
				return foundID->second.m_ID;

			int npcid = _DB.GetNPCID(_Name, _Id);
			if (npcid > 0) // Case for mced pet!
			{
				if (overRule)
					return npcid;

				// TODO: Enslaved pets!
				for (auto& pet : m_MCedPets)
				{
					if (_TimeFrame > pet.second.second) continue;
					if (_TimeFrame < pet.second.first) break;
					return foundID->second.m_ID;
				}

				return npcid;
			}
			return foundID->second.m_ID;
		}
		return _DB.GetNPCID(_Name, _Id);
	}
	int GetCharacterOrPetID(RPLL::DatabaseAccess& _DB, std::string& _Name, __int64 _TimeFrame = 0, bool overRule = false, int _Id = 0, int _PetId = 0)
	{
		if (_PetId > 0)
			return _PetId;
		auto foundID = m_ArmoryData->m_UnitData.find(_Name);
		if (foundID != m_ArmoryData->m_UnitData.end())
		{
			if (foundID->second.m_Owner == 0)
				return foundID->second.m_ID;

			int npcid = _DB.GetNPCID(_Name, _Id);
			if (npcid > 0) // Case for mced pet!
			{
				if (overRule)
					return 0;

				// TODO: Enslaved pets!
				for (auto& pet : m_MCedPets)
				{
					if (_TimeFrame > pet.second.second) continue;
					if (_TimeFrame < pet.second.first) break;
					return foundID->second.m_ID;
				}

				return 0;
			}
			return foundID->second.m_ID;
		}
		return 0;
	}

	template<typename T>
	int GetGuildID(std::vector<__int64>& realTime, std::vector<std::string>& nameValues, const __int64 start, const __int64 end, const int _ServerID, RPLL::DatabaseAccess& _DBAccess, std::map<int, bool>& _Particitpants, std::vector<std::vector<T>>& _CombatLogEvents);

	static std::vector<std::vector<RPLL::SessionLine*>::iterator> GetPossibleEvents(std::vector<__int64>& realTime, std::vector<RPLL::SessionLine*>& remainingList, int timeBuffer, __int64 curTime);

	int InitRaidCollection(int RaidingGuildID, __int64 StartTime, __int64 EndTime, int _Uploader, int _ServerId, int _Faction, int InstanceID, RPLL::DatabaseAccess& DBAccess, int& RS_InstanceID, int& RS_UploaderID, int& RS_ProgressID, __int64 evTS, int evSource, int evAmount) const;
	
	void SetSpeedRunRecord(std::map<std::pair<int, int>, std::pair<__int64, __int64>>& bossAttempts, int duration, int RS_UploaderID, int RaidingGuildID, int InstanceID, int NumBosses) const;
};

