#pragma once
#include "concurrentqueue.h"
#include <thread>
#include "ArmoryStructs.h"
#include "DatabaseAccess.h"

namespace RPLL
{
	class ArmoryProcessor
	{
		DatabaseAccess* DBAccess = nullptr;
		MySQLConnector* db = nullptr;
		MySQLConnector* db2 = nullptr;

		bool mPostVanilla = false;

		std::map<int, ArmoryCharData> m_ArmoryCharData;
		std::map<unsigned long long, int> m_RefMiscIDs;
		std::map<unsigned long long, int> m_RefGuildIDs;
		std::map<unsigned long long, int> m_RefItemSlotIDs;
		std::map<unsigned long long, int> m_RefItemSlotGemIDs;
		std::map<unsigned long long, int> m_RefGearIDs;
		std::map<unsigned long long, int> m_RefHonorIDs;
		std::map<unsigned long long, int> m_ArenaTeamIDs;
		std::map<unsigned long long, int> m_RefArenaIDs;

	public:
		std::map<int, CharData> m_CharData;
		std::map<int, std::pair<int, std::string>> m_CharClassTalents;

		ArmoryProcessor(DatabaseAccess* _DBAccess, bool _PostVanilla = false);
		~ArmoryProcessor();
		int GetRefGuildID(const std::string& _GRankName, int _GRankIndex = 0, int _GuildID = 0, bool _AutoAddToDB = false);
		int GetRefMiscID(const std::string& _Talents, int _Level = 0, int _Gender = 0, int _Race = 0, int _Class = 0, bool _AutoAddToDB = false);
		int GetRefHonorID(int _Rank = 0, int _Progress = 0, int _HK = 0, int _DK = 0, int _Honor = 0, int _Standing = 0, bool _AutoAddToDB = false);
		int GetArenaTeamID(int _Size, std::string& _Name, int _ServerId, bool _AutoAddToDB = false);
		int GetRefArenaID(int _Team1, int _Team2, int _Team3, bool _AutoAddToDB = false);
		void SetLifeTimeRank(int charid = 0, int rank = 0, int _Uploader = 0);
		int GetRefItemSlotGemID(Item* _Item = nullptr, bool _AutoAddToDB = false);
		int GetRefItemSlotID(Item* _Item = nullptr, bool _AutoAddToDB = false);
		int GetRefGearID(int* _Gear, bool _AutoAddToDB = false);
		void InsertArmoryData(ArmoryCharData&& _Data, int _CharID);
		void GetArmoryCharData(ArmoryCharData& _Data, int _CharID, bool _PostVanilla = false);
		void UpdateProfessions(int _CharId, int _Prof1, int _Prof2);
		CharData* GetCharData(const int _Id, MySQLConnector* gen, MySQLConnector* spec);
		void OnUpdate();

		bool mRun = true;
		moodycamel::ConcurrentQueue<APData> mQueue;
		moodycamel::ConcurrentQueue<std::pair<int, int>> mSpecsQueue;

		template<typename ...T_Values>
		int Get_Name_ID(const unsigned long long _Name, std::map<unsigned long long, int>& _NameToIDMap, std::string _SQLSelectStatement, MySQLConnector* m_DB, const T_Values&... _SQLStatementValues)
		{
			if (_Name == 0) return -1;

			auto foundID = _NameToIDMap.find(_Name);
			if (foundID != _NameToIDMap.end())
			{
				return foundID->second;
			}

			int x_ID = -1;
			auto sqlStream = m_DB->ExecuteStreamStatement(_SQLSelectStatement.c_str(), 1);
			try
			{
				sqlStream.AttachValues(_SQLStatementValues...);
			}
			catch (...)
			{
				return -1;
			}
			while (sqlStream.HasData())
			{
				sqlStream.ReadData(&x_ID);
			}
			if (x_ID != -1)
			{
				_NameToIDMap.insert(std::make_pair(_Name, x_ID));
			}
			return x_ID;
		}
	}; 
}
