#pragma once
#include "DatabaseAccess.h"
#include "CombatLogParser.h"
#include "FileUtility.h"
#include "Armory.h"
#include <experimental/filesystem>
#include "AnalyzerUtility.h"
#include "Threat.h"

#if __linux__
	#include <inttypes.h>
	#define __int64 long long
#endif

namespace RPLL
{
	class AnalyzerPost : AnalyzerUtility
	{
	public:
		AnalyzerPost(const char* _Armory, const char* _CBTLog, const int _Uploader, DatabaseAccess& DBAccess, ArmoryProcessor* _Processor);
		~AnalyzerPost();

	private:
		std::vector<std::vector<CombatLogEventPost>> m_CombatLogEvents;

		static int NumBossesPerInstance(const int _InstanceID)
		{
			switch(_InstanceID)
			{
			case 41: return 4; // TK
			case 36: return 1; // Mag
			case 32: return 5; // Hyjal
			case 53: return 2; // Gruul
			case 55: return 6; // ZA
			case 61: return 6; // Sunwell
			case 40: return 6; // SSC
			case 52: return 9; // BT
			case 33: return 8; // Kara (Without chess event, counting opera as one boss)
			case 90: return 1; // Kazzak
			default: return 0;
			}
		}

		static std::map<int, bool> m_NotRlyGroupBoss;
		static std::map<int, int> m_BossToGroup;
		static std::map<int, short> m_GroupToAmount;
		std::pair<SessionLine*, SessionLine*> GetNextAttempt(DatabaseAccess& _DB, std::vector<SessionLine*>::iterator& ptr, std::vector<SessionLine*>::iterator& end, std::map<std::pair<int, int>, std::pair<__int64, __int64>>& bossAttempts);

		std::map<std::pair<int, int>, std::pair<__int64, __int64>>::const_iterator st_rrd_ptr;
		std::map<std::pair<int, int>, std::pair<__int64, __int64>>::const_iterator st_rrd_end;
		std::map<int, int*> st_rrd_chardata;
		void RetrieveRecordData(RPLL::DatabaseAccess& _DB, const __int64 _TS, int _Type, int _Value, int _CharID, RPLL::MySQLStream& st_rrd_queryOne, RPLL::MySQLStream& st_rrd_queryTwo, RPLL::MySQLStream& st_rrd_queryThree, RPLL::MySQLStream& st_rrd_queryFour, RPLL::MySQLStream& st_rrd_queryFive, RPLL::MySQLStream& st_rrd_querySix);


		// New
		void FetchReferenceTables(__int64 StartTime, __int64 EndTime, DatabaseAccess& DBAccess, int RS_UploaderID, int RS_MAX_SA, int RS_MAX_SAT, int RS_MAX_SATA, std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference, std::map<int, std::pair<int, int>>& saReferenceReverse, std::map<int, std::pair<int, int>>& satReferenceReverse);
		void FetchAttempts(DatabaseAccess& DBAccess, __int64 StartTime, __int64 EndTime, int RS_UploaderID, int RaidingGuildID, int InstanceID, std::map<std::pair<int, int>, std::pair<__int64, __int64>>& bossAttempts, std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>>& m_Attempts);
		static std::map<int, bool> mFilteredAbilities;
		void FetchCombatLogData(DatabaseAccess& DBAccess, __int64 StartTime, __int64 EndTime, int RS_ProgressID, int RS_UploaderID, MySQLStream& queryProgress, std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference, std::map<int, std::pair<int, int>>& saReferenceReverse, int RS_Damage_Min, int Faction, Threat& ThreatHandler);
		void FetchSessionData(DatabaseAccess& DBAccess, int RS_UploaderID, __int64 StartTime, std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>>& m_Attempts);
	
	
		// Help structs
		struct RsDamageMitgated
		{
			int resisted = 0;
			int blocked = 0;
			int absorbed = 0;
		};
	};
};
