#pragma once
#include "MySQLConnector.h"
#include "MySQL_OTL.h"

#include <map>
#include <vector>

#include <iostream>
#include <chrono>
#include <cstdarg>

#include "ArmoryCharData.h"
#include "ParsingStructs.h"
#include "CBTPStructs.h"

#include "xxhash.hpp"

namespace RPLL
{
	enum class WowVersion
	{
		Vanilla,
		TBC,
		WotLK,
		Cataclysm,
		MoP,
		WoD,
		Legion,
	};
	class DatabaseAccess
	{
	public:
		std::map<int, int> m_AbilityDuration;
		std::map<unsigned long long, int> m_AbilityCastTime;
		std::map<int, std::string> m_AbilityNames;
		std::map<int, std::string> m_NPCNames;
		std::map<int, int> m_NPCLiking;

		std::map<unsigned long long, int> m_CharacterIDs;
		std::map<int, int> m_ServerContentLevel;

	private:
		MySQLConnector* m_DB = nullptr;
		MySQLConnector* m_DBSpec = nullptr;
		std::string mExpansion = "vanilla";

		std::map<unsigned long long, int> m_RealmIDs;
		std::map<unsigned long long, int> m_AbilityIDs;
		std::map<unsigned long long, int> m_NPCIDs;
		std::map<unsigned long long, int> m_BossIDs;
		std::map<unsigned long long, int> m_InstanceIDs;
		std::map<unsigned long long, int> m_YellIDs;

		std::map<unsigned long long, int> m_PetIDs;
		std::map<unsigned long long, int> m_GuildIDs;

	public:
		DatabaseAccess(bool _PostVanilla = false)
		{
			m_DB = new MySQLConnector("root", "", "RPLL_BACKEND", "rpll"); // General one!
			if (_PostVanilla)
			{
				m_DBSpec = new MySQLConnector("root", "", "RPLL_TBC_BACKEND", "RPLL_TBC");
				mExpansion = "tbc";
			}
			else
				m_DBSpec = new MySQLConnector("root", "", "RPLL_VANILLA_BACKEND", "RPLL_VANILLA");

			std::cout << "Loading database tables... \n\n";
			std::cout << "Loading table 'db_servernames'... \n";
			auto server = m_DB->ExecuteStreamStatement("SELECT id, name, contentlevel FROM db_servernames", 1, true);
			while (server.HasData())
			{
				int id,level;
				std::string name;
				server.ReadData(&id, &name, &level);
				m_RealmIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(name, name.length())), std::move(id)));
				m_ServerContentLevel.insert(std::make_pair(id, level));
			}
			server.Flush();
			server.CompleteStatement();

			std::cout << "Loading table 'db_" + mExpansion + "_spells'... \n";
			auto abilities = m_DBSpec->ExecuteStreamStatement("SELECT name, id, duration, casttime FROM db_" + mExpansion + "_spells", 1, true);
			while (abilities.HasData())
			{
				std::string name;
				int id;
				int duration, casttime;
				abilities.ReadData(&name, &id, &duration, &casttime);
				unsigned long long key = xxh::xxhash<64>(name, name.length());
				m_AbilityDuration.insert(std::make_pair(id, std::move(duration)));
				m_AbilityNames.insert(std::make_pair(id, name));
				if (!_PostVanilla) // Not used in tbc
					m_AbilityCastTime.insert(std::make_pair(key, std::move(casttime)));
				m_AbilityIDs.insert(std::make_pair(std::move(key), std::move(id)));
			}
			abilities.Flush();
			abilities.CompleteStatement();

			std::cout << "Loading table 'db_" + mExpansion + "_npcs'... \n";
			auto npcs = m_DBSpec->ExecuteStreamStatement("SELECT name, id, type, friend FROM db_" + mExpansion + "_npcs", 1, true); // > 8000 to counter non important named npcs
			while (npcs.HasData())
			{
				std::string name;
				int id;
				int type, liking;
				npcs.ReadData(&name, &id, &type, &liking);
				unsigned long long key = xxh::xxhash<64>(name, name.length());
				if (m_NPCIDs.find(key) == m_NPCIDs.end()) // Prevent duplicates => Kalecgos for example!
				{
					m_NPCIDs.insert(std::make_pair(key, id));
					m_NPCNames.insert(std::make_pair(id, name));
					m_NPCLiking.insert(std::make_pair(id, liking));
					if (type == 1)
						m_BossIDs.insert(std::make_pair(std::move(key), std::move(id)));
				}
			}
			npcs.Flush();
			npcs.CompleteStatement();

			std::cout << "Loading table 'db_instances'... \n";
			auto instances = m_DB->ExecuteStreamStatement("SELECT enus, id FROM db_instances WHERE israid=1", 1, true);
			while (instances.HasData())
			{
				std::string name;
				int id;
				instances.ReadData(&name, &id);
				m_InstanceIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(name, name.length())), std::move(id)));
			}
			instances.Flush();
			instances.CompleteStatement();

			std::cout << "Loading table 'db_yells'... \n";
			auto yells = m_DB->ExecuteStreamStatement("SELECT enus, id FROM db_yells", 1, true);
			while (yells.HasData())
			{
				std::string name;
				int id;
				yells.ReadData(&name, &id);
				m_YellIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(name, name.length())), std::move(id)));
			}
			yells.Flush();
			yells.CompleteStatement();
			
			std::cout << "Loading table 'gn_guilds'... \n";
			auto guilds = m_DB->ExecuteStreamStatement("SELECT a.name, a.id, a.serverid, a.faction FROM gn_guilds a JOIN db_servernames b ON a.serverid = b.id WHERE b.expansion=" + std::string(_PostVanilla ? "1" : "0"), 1, true);
			while (guilds.HasData())
			{
				std::string name;
				int id;
				int serverID;
				int faction;
				guilds.ReadData(&name, &id, &serverID, &faction);
				std::string key = name + "," + std::to_string(serverID) + "," + std::to_string(faction);
				m_GuildIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), std::move(id)));
			}
			guilds.Flush();
			guilds.CompleteStatement();
		}

		DatabaseAccess(const DatabaseAccess&);
		//static DatabaseAccess& GetInstance()
		//{
  //          /*static */MySQLConnector conn("root", "", "RPLL", "rpll");
		//	/*static */DatabaseAccess m_Instance(&conn);
		//	return m_Instance;
		//}

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
			catch(...)
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

		int GetRealmID(const std::string& _RealmName, RPLL::WowVersion _WowVersion)
		{
			return Get_Name_ID(xxh::xxhash<64>(_RealmName, _RealmName.length()), m_RealmIDs, "select id from db_servernames where name=:n<char[100]> and expansion=:e<int>", m_DB, _RealmName, static_cast<int>(_WowVersion));
		};
		int GetAbilityID(const std::string& _Ability, bool _AutoAddToDB = false, int _Id = 0)
		{
			if (_Id > 0) // No need to check!
			{
				if (_AutoAddToDB) // TODO: Improve performance with an reverse map!
				{
					if (m_AbilityNames.find(_Id) != m_AbilityNames.end())
						return _Id;

					auto sqlStream = m_DBSpec->ExecuteStreamStatement("insert ignore into db_" + mExpansion + "_spells (id, name) values(:a<int>, :n<char[520]>)", 1);
					sqlStream.AttachValues(_Id, _Ability);

					sqlStream = m_DB->ExecuteStreamStatement("insert into gn_cachingcontroller (type) values (:a<int>)", 1);
					sqlStream.AttachValues(0);

					m_AbilityNames[_Id] = _Ability;
				}

				return _Id;
			}

			int ABID = Get_Name_ID(xxh::xxhash<64>(_Ability, _Ability.length()), m_AbilityIDs, "select id from db_"+ mExpansion +"_spells where name=:n<char[520]>", m_DBSpec, _Ability);
			if (ABID == -1 && _AutoAddToDB == true && !_Ability.empty())
			{
				auto sqlStream = m_DBSpec->ExecuteStreamStatement("insert into db_" + mExpansion + "_spells (name) values(:n<char[520]>)", 1);
				sqlStream.AttachValues(_Ability);

				sqlStream = m_DB->ExecuteStreamStatement("insert into gn_cachingcontroller (type) values (:a<int>)",1);
				sqlStream.AttachValues(0);

				//Call to get the select statement again etc
				return GetAbilityID(_Ability, false);
			}
			return ABID;
		};
		int GetNPCID(const std::string& _NPC, const int _Id = 0, bool _AddToDB = false)
		{
			if (_Id > 0) // No need to check!
			{
				if (_AddToDB)
				{
					if (m_NPCNames.find(_Id) != m_NPCNames.end())
						return _Id;

					// TODO: Even add school and flags here!
					auto sqlStream = m_DBSpec->ExecuteStreamStatement("insert ignore into db_" + mExpansion + "_npcs (id, name) values(:a<int>, :n<char[520]>)", 1);
					sqlStream.AttachValues(_Id, _NPC);

					sqlStream = m_DB->ExecuteStreamStatement("insert into gn_cachingcontroller (type) values (:a<int>)", 1);
					sqlStream.AttachValues(7);

					m_NPCNames[_Id] = _NPC;

				}
				return _Id;
			}
			
			if (_NPC == "")
				return 0;

			auto key = xxh::xxhash<64>(_NPC, _NPC.length());
			auto foundID = m_NPCIDs.find(key);
			if (foundID != m_NPCIDs.end())
			{
				return foundID->second;
			}
			return 0;
			// Thinking about adding "missing npc"
		};
		int GetInstanceID(const std::string& _Instance)
		{
			return Get_Name_ID(xxh::xxhash<64>(_Instance, _Instance.length()), m_InstanceIDs, "select id from db_instances where enus=:n<char[255]>", m_DB, _Instance);
		};
		bool IsInstance(const std::string& _Map)
		{
			return m_InstanceIDs.find(xxh::xxhash<64>(_Map, _Map.length())) != m_InstanceIDs.end();
			//return GetInstanceID(_Map) > 0;
		}
		int GetYellID(const std::string& _Name, bool _AutoAddToDB = false)
		{
			int yellID = Get_Name_ID(xxh::xxhash<64>(_Name, _Name.length()), m_YellIDs, "select id from db_yells where enus=:n<char[512]>", m_DB, _Name);

			if (yellID == -1 && _AutoAddToDB == true && !_Name.empty())
			{
				auto sqlStream = m_DB->ExecuteStreamStatement("insert into db_yells (enus) values(:n<char[512]>)", 1);
				sqlStream.AttachValues(_Name);

				//Call to get the select statement again etc
				return GetYellID(_Name, false);
			}
			return yellID;
		}

		int GetCharacterID(const std::string& _Name, int _RealmID = 0, int _Faction = 0, bool _AutoAddToDB = false)
		{
			std::string key = _Name + "," + std::to_string(_RealmID);
			int charID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_CharacterIDs, "select id from gn_chars where serverid=:s<int> and ownerid=0 and name=:n<char[51]>", m_DB, _RealmID, _Name);

			if (charID == -1 && _AutoAddToDB == true && !_Name.empty())
			{
				auto sqlStream = m_DB->ExecuteStreamStatement("insert into gn_chars (serverid, faction, latestupdate, name, ownerid) values(:s<int>,:f<int>,0,:n<char[51]>,0)", 1);
				sqlStream.AttachValues(_RealmID, _Faction, _Name);

				//Call to get the select statement again etc
				return GetCharacterID(_Name, _RealmID, false);
			}
			return charID;
		}

		int GetPetID(std::string _Name, int _RealmID = 0, int _Faction = 0, bool _AutoAddToDB = false, int _Owner = 0)
		{
			if (_Owner == 0)
				return 0;

			std::string key = _Name + "," + std::to_string(_RealmID) + "," + std::to_string(_Owner);

			int charID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_PetIDs, "select id from gn_chars where serverid=:s<int> and ownerid=:k<int> and name=:n<char[51]>", m_DB, _RealmID, _Owner, _Name);

			if (charID == -1 && _AutoAddToDB == true && !_Name.empty() && _Owner > 0)
			{
				auto sqlStream = m_DB->ExecuteStreamStatement("insert into gn_chars (serverid, faction, latestupdate, name, ownerid) values(:s<int>,:f<int>,0,:n<char[51]>,:q<int>)", 1);
				sqlStream.AttachValues(_RealmID, _Faction, _Name, _Owner);

				//Call to get the select statement again etc
				return GetPetID(_Name, _RealmID, _Faction, false, _Owner);
			}
			return charID;
		}
		int GetCharacterOrPetID(const std::string& _Name, int _RealmID = 0, int _Faction = 0, int _Owner = 0)
		{
			int charID = GetCharacterID(_Name, _RealmID, _Faction);
			if (charID <= 0)
				charID = GetPetID(_Name, _RealmID, _Faction);
			return charID;
		}


		int GetGuildID(const std::string& _Name, int _RealmID = 0, int _Faction = 0, bool _AutoAddToDB = false)
		{
			std::string key = _Name + "," + std::to_string(_RealmID) + "," + std::to_string(_Faction);
			int guildID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_GuildIDs, "select id from gn_guilds where serverid=:s<int> and name=:n<char[51]> and faction=:c<int>", m_DB, _RealmID, _Name, _Faction);

			if (guildID == -1 && _AutoAddToDB == true && !_Name.empty())
			{
				auto sqlStream = m_DB->ExecuteStreamStatement("insert into gn_guilds (serverid, faction, name) values(:s<int>,:f<int>,:n<char[51]>)", 1);
				sqlStream.AttachValues(_RealmID, _Faction, _Name);

				//Call to get the select statement again etc
				return GetGuildID(_Name, _RealmID, _Faction, false);
			}
			return guildID;
		}
		bool IsPugRaid(int GuildId = 0, int ServerId = 0, int Faction = 0)
		{
			if (GuildId == 0 || ServerId == 0 || Faction ==  0)
				return false;
			std::string key = "Pug Raid," + std::to_string(ServerId) + "," + std::to_string(Faction);
			unsigned long long uKey = xxh::xxhash<64>(key, key.length());
			return m_GuildIDs.find(uKey) != m_GuildIDs.end();
		}

		bool IsBossNPC(std::string& _Name, int _Id = 0)
		{
			if (_Id > 0)
			{
				//std::cout << "Looking for Boss: " << _Id << std::endl;
				for (auto& boss : m_BossIDs)
				{
					if (boss.second == _Id)
					{
						//std::cout << "Found Boss: " << boss.first << std::endl;
						return true;
					}
				}
				return false;
			}
			return m_BossIDs.find(xxh::xxhash<64>(_Name, _Name.length())) != m_BossIDs.end();
		}

		void PackMapKey(std::string& buffer, const int n, ...) const
		{
			va_list ap;
			va_start(ap, n);
			for (int i = 0; i < n; ++i)
			{
				int key = va_arg(ap, int);
				buffer[i * 4] = (key >> 0);
				buffer[i * 4 + 1] = (key >> (8));
				buffer[i * 4 + 2] = (key >> (16));
				buffer[i * 4 + 3] = (key >> (24));
			}
			va_end(ap);
		}

		MySQLConnector* GetConnector(bool _General = false) const
		{
			if (_General)
				return m_DB;
			return m_DBSpec;
		}
	};
}
