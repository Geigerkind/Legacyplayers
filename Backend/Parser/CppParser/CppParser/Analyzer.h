#pragma once
#include "DatabaseAccess.h"
#include "CombatLogParser.h"
#include "FileUtility.h"
#include "Armory.h"
#include <experimental/filesystem>
#include "AnalyzerUtility.h"

#if __linux__
	#include <inttypes.h>
	#define __int64 long long
#endif

/*
* Note: For merging just insert everything and associate the raid id to the uploader table.
* 
*
* -1. Does the user exist?
* No: Abort, flag files
* Yes: Add uploader and retrieve the id
*
*
* Flowgraph: For RS (Armory is following)
* 0. Fire Armory file analyzation
* Retrieve user information
* 
* 1. Is the server listed?
* No: Add to checklist and flag files
* Yes: continue
* 
* 
* 3. Retrieve the instance information and raiding guild id
* Is the instance listed?
* No: Add to checklist, flag file
* Yes: Execute protocoll according to it? (Assuming only raid/dungeons for now  =>  We have to choose a different path for the battlegrounds, atleast at some stages)
* 
* 4. Is it an empty log?
* No: 
* - Add instance id and retrieve it
* - Add instance instance_uploader and retrieve the id
* Yes: Remove file from the list (Delete it?)
* 
* 4.5 Retrieve relative table information for later
* 
* 5. Retrieve the npc information
* Retrieve the ids
* If some are missing
* Add dummy id and flag it, retrieve the new id then
* 
* 6. Retrieve attempt information
* Is it empty?
* No: Add attempts to db
* Yes: Remove the file from the list (Delete it?)
* 
* 7. Retrieve loot information and associate them to the attempts
* Add them to the database
* 
* 10. Retrieve the abillity information
* Retrieve the ids
* If some are missing:
* Add dummy id and flag it, retrieve the new id then
* 
* 11. Generate the reference tables
* Add them to the Database
* Retrieve them
* 
* 12. Associate dispel and interrupt information
* and build tables for them
* 
* 13. Associate Aura gained and faded
* 
* 14. Associate Overhealing data with healing data
* 
* 14.5. Generate record information
* 
* 15. Dump Bosshealth and Threath table
* 
* 16. Insert all tables into the database
* 
* 17. Update relative ids for later retrieval in the instance table, relative to the relative table information to 4.5
* 
* ??. Bundle to raid cache data structure and hand it over to the frontend?
*/

namespace RPLL
{
	class Analyzer : AnalyzerUtility
	{
	public:
		Analyzer(const char* _Armory, const char* _CBTLog, const int _Uploader, DatabaseAccess& DBAccess, ArmoryProcessor* _Processor);
		~Analyzer();

		struct ThreatMods
		{
			bool BlessingOfSalvation = false;
			bool BattleStance = false;
			bool BerserkerStance = false;
			bool DefensiveStance = false;
			bool TranquilAirTotem = false;
			bool ArcaneShroud = false;
			bool TheEyeOfDiminution = false;
			bool RighteousFury = false;
			bool WarlockT3SetBonus = false;
		};

	private:
		std::vector<std::vector<CombatLogEvent>> m_CombatLogEvents;
		std::vector<std::string> m_PlayerNamesBySession;
		
		static int NumBossesPerInstance(const int _InstanceID)
		{
			switch(_InstanceID)
			{
			//case 14: return 8; // Blackrock Spire
			case 16: return 1; // Onyxias Lair
			case 19: return 9; // Zul Gurub
			case 23: return 10; // Molten Core
			case 25: return 8; // Blackwing Lair
			case 27: return 6; // AQ20
			case 29: return 9; // AQ40
			case 31: return 15; // Naxx
			case 84: return 1; // World bosses
			case 85: return 1;
			case 86: return 1;
			case 87: return 1;
			case 88: return 1;
			case 89: return 1;
			default: return 0;
			}
		}
		static std::map<int, int> m_ThreatTable;
		static std::map<std::string, bool> m_InterruptAbilities;
		static std::map<std::string, bool> m_StunInterruptAbilities;
		static std::map<std::string, bool> m_DirectDispels;
		static std::map<std::string, bool> m_InDirectDispels;
		static std::map<std::string, bool> m_NotRlyGroupBoss;
		static std::map<std::string, std::string> m_BossToGroup;
		static std::map<std::string, short> m_GroupToAmount;
		std::pair<SessionLine*, SessionLine*> GetNextAttempt(DatabaseAccess& _DB, std::vector<SessionLine*>::iterator& ptr, std::vector<SessionLine*>::iterator& end, std::map<std::pair<int, int>, std::pair<__int64, __int64>>& bossAttempts);

		std::map<std::pair<int, int>, std::pair<__int64, __int64>>::const_iterator st_rrd_ptr;
		std::map<std::pair<int, int>, std::pair<__int64, __int64>>::const_iterator st_rrd_end;
		std::map<std::string, int*> st_rrd_chardata;
		void RetrieveRecordData(RPLL::DatabaseAccess& _DB, const __int64 _TS, int _Type, int _Value, std::string _CharID, RPLL::MySQLStream& st_rrd_queryOne, RPLL::MySQLStream& st_rrd_queryTwo, RPLL::MySQLStream& st_rrd_queryThree, RPLL::MySQLStream& st_rrd_queryFour, RPLL::MySQLStream& st_rrd_queryFive, RPLL::MySQLStream& st_rrd_querySix);

		// New 
		void FetchReferenceTables(__int64 StartTime, __int64 EndTime, DatabaseAccess& DBAccess, int RS_UploaderID, int RS_MAX_SA, int RS_MAX_SAT, int RS_MAX_SATA, std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference, std::map<int, std::pair<int, int>>& saReferenceReverse, std::map<int, std::pair<int, int>>& satReferenceReverse, int unknownPlayer);
		void FetchAttempts(DatabaseAccess& DBAccess, __int64 StartTime, __int64 EndTime, int RS_UploaderID, int RaidingGuildID, int InstanceID, std::map<std::pair<int, int>, std::pair<__int64, __int64>>& bossAttempts, std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>>& m_Attempts);
		void FetchCombatLogData(DatabaseAccess& DBAccess, __int64 StartTime, __int64 EndTime, int RS_ProgressID, int RS_UploaderID, MySQLStream& queryProgress, std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference, std::map<int, std::pair<int, int>>& saReferenceReverse, int RS_MAX_Damage, std::map<int, int>& specs, int Faction);
		void FetchSessionData(DatabaseAccess& DBAccess, int RS_MAX_Attempts, int RS_UploaderID, __int64 StartTime, std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>>& m_Attempts);

		void FetchMCedPets(DatabaseAccess& DBAccess, __int64 StartTime, __int64 EndTime);

		std::vector<std::pair<__int64, std::pair<std::string, int>>> m_HackSunders;
		void EstimateSunder(DatabaseAccess& DBAccess, long long StartTime, int RS_UploaderID, std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference, std::map<int, std::pair<int, int>>& saReferenceReverse, std::map<int, std::pair<int, int>>& satReferenceReverse, std::map<int, int>& playerSpec);
	};
};
