#include "Armory.h"
#include "../../../Libs/utf8.h"
#include <algorithm>
#include <thread>

namespace RPLL
{
	void fix_utf8_string(std::string& str)
	{
		std::string temp;
		utf8::replace_invalid(str.begin(), str.end(), back_inserter(temp));
		str = temp;
	}

	static inline std::string rtrim(std::string& s, char someChar) {
		int times = 0;
		for (auto a = s.rbegin(); a != s.rend() && *a == someChar; ++a)
			++times;
		return s.substr(0, s.length() - times);
	}

	Armory::Armory(const char* _FileName, const int& _Uploader, DatabaseAccess& DBAccess, bool _PostVanilla, ArmoryProcessor* _Processor)
	{
		m_Parser = new RPLLParser(_FileName, _PostVanilla);

		if (m_Parser->m_sessions.empty()) // Log is empty?!
		{
			std::cout << "Armory: Sessions empty!" << std::endl;
			return;
		}

		std::string serverName = m_Parser->m_sessions[0][0].mS_Param[0];
		if (serverName.empty())
			serverName = "Unknown"; // Discard this one later

		if (serverName.find(" (Alliance)") != std::string::npos || serverName.find(" (Horde)") != std::string::npos)
		{
			serverName = "Felmyst";
			m_Parser->m_sessions[0][0].mS_Param[0] = serverName;
		}

		auto realmID = DBAccess.GetRealmID(serverName, (_PostVanilla) ? WowVersion::TBC : WowVersion::Vanilla);
		m_ServerID = realmID;
		if (realmID == -1)
		{
			// Flag files
			std::cout << "Armory: Realm not found!" << " => " << serverName << std::endl;
			return;
		}
		try
		{
			// If version < 9, All pvp data is wrong! (Typo xD)
			int version = m_Parser->m_sessions[0][0].mI_Param[2];

			auto db = DBAccess.GetConnector();
			auto db2 = DBAccess.GetConnector(true);

			auto queryProgress = db->ExecuteStreamStatement("UPDATE rs_progress SET progress=:a<int> WHERE uploaderid=:b<int>", 1);
			
			queryProgress.AttachValues(5, _Uploader);

			for (auto session = m_Parser->m_playerdata.rbegin(); session != m_Parser->m_playerdata.rend(); ++session)
			{
				for (auto& unit : *session)
				{
					int npcid = DBAccess.GetNPCID(unit._name);
					if (npcid <= 0 || unit._gear[0]._id > 0)
					{
						fix_utf8_string(unit._name);
						fix_utf8_string(unit._guildName);
						fix_utf8_string(unit._rankName);

						auto foundID = m_UnitData.find(unit._name);
						if (foundID == m_UnitData.end())
						{
							UnitData data;
							data.m_Faction = unit._faction;
							data.m_Class = unit._class;
							data.m_Joined = unit._cbtTimeJoin;
							data.m_Left = unit._cbtTimeLeave;

							for (auto& pet : unit._petName)
							{
								if (!pet.empty())
									data.m_PetName.push_back(pet);
							}

							data.m_Race = unit._race;
							data.m_RankName = unit._rankName;
							data.m_RankIndex = unit._rankIndex;
							if (data.m_RankName == "" && unit._guildName == "RPLL!EPTY!")
								data.m_GuildName = "";
							else
								data.m_GuildName = unit._guildName;
							if (unit._level < 0 || unit._level > 110)
								data.m_Level = 1;
							else
								data.m_Level = unit._level;
							data.m_Sex = unit._sex;

							for (int i = 0; i<19; ++i)
								data.m_Gear[i] = unit._gear[i];

							
							data.m_PvPData = unit._pvpData;
							if (version < 9)
							{
								data.m_PvPData = { -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1 };
							}
							
							data.mTalents = unit.mTalents;
							if (!data.mTalents.empty()) data.mTalents = HashTalents(data.mTalents, data.m_Class, _PostVanilla) + GetTalentsSpend(data.mTalents);
							for (int i=0; i<3; ++i)
								data.mArenaData[i] = unit.mArenaData[i];

							data.m_Prof1 = unit.mProf1;
							data.m_Prof2 = unit.mProf2;

							m_UnitData.insert(std::make_pair(unit._name, std::move(data)));
						}
						else
						{
							// Trying to consolidate data now!
							if (foundID->second.m_Faction <= 0 || foundID->second.m_Faction > 2)
								foundID->second.m_Faction = unit._faction;

							if (foundID->second.m_Class == 99 || foundID->second.m_Class < 0)
								foundID->second.m_Class = unit._class;

							if (foundID->second.m_Race == 99 || foundID->second.m_Race < 0)
								foundID->second.m_Race = unit._race;

							if (((foundID->second.m_GuildName == "" && (unit._guildName != "!RPLL!EPTY!" || (unit._guildName == "!RPLL!EPTY!" && unit._rankName != ""))) || (foundID->second.m_GuildName == "!RPLL!EPTY!")) && unit._guildName != "")
							{
								foundID->second.m_GuildName = unit._guildName;
								foundID->second.m_RankName = unit._rankName;
								foundID->second.m_RankIndex = unit._rankIndex;
							}
							if ((version < 12) || (version >= 100 && version < 111))
							{
								foundID->second.m_GuildName = "";
								foundID->second.m_RankName = "";
								foundID->second.m_RankIndex = -1;
							}

							for (auto& pet : unit._petName)
							{
								if (!pet.empty() && std::find(foundID->second.m_PetName.begin(), foundID->second.m_PetName.end(), pet) == foundID->second.m_PetName.end())
									foundID->second.m_PetName.push_back(pet);
							}

							if (foundID->second.m_Level <= 0 && unit._level >= 0 && unit._level <= 110)
								foundID->second.m_Level = unit._level;

							if (foundID->second.m_Sex <= 0)
								foundID->second.m_Sex = unit._sex;

							// Taking the most actual gear
							bool newAllUkn = true;
							for (int i=0; i<19; ++i)
							{
								if (unit._gear[i]._id != -1)
								{
									newAllUkn = false;
									break;
								}
							}
							if (!newAllUkn)
							{
								for (int i=0; i<19; ++i)
									foundID->second.m_Gear[i] = unit._gear[i];
							}

							// For each pvp value, im going to take the better value!
							if (version >= 9 && version < 100)
							{
								if (foundID->second.m_PvPData._lifeTimeHK < unit._pvpData._lifeTimeHK)
									foundID->second.m_PvPData = unit._pvpData;
							}
							else if (version >= 100) // Post Vanilla
							{
								if (foundID->second.mTalents.empty())
									foundID->second.mTalents = HashTalents(unit.mTalents, unit._class, _PostVanilla) + GetTalentsSpend(unit.mTalents);

								// PvPData handling!
								if (unit._pvpData._sessHK > foundID->second.m_PvPData._sessHK)
								{
									foundID->second.m_PvPData = unit._pvpData;
								}

								// Arena data handling!
								for (int i = 0; i<3; ++i)
								{
									if (unit.mArenaData[i].mSeasonPlayed > foundID->second.mArenaData[i].mSeasonPlayed)
									{
										foundID->second.mArenaData[i] = unit.mArenaData[i];
									}
								}

							}


							if (foundID->second.m_Prof1 == 0)
								foundID->second.m_Prof1 = unit.mProf1;
							if (foundID->second.m_Prof2 == 0)
								foundID->second.m_Prof2 = unit.mProf2;

							if (foundID->second.m_Joined == -1 || (foundID->second.m_Joined > unit._cbtTimeJoin && unit._cbtTimeJoin != -1))
								foundID->second.m_Joined = unit._cbtTimeJoin;
							if (foundID->second.m_Left == -1 || foundID->second.m_Left < unit._cbtTimeLeave)
								foundID->second.m_Left = unit._cbtTimeLeave;
						}
					}
				}
			}
			
			queryProgress.AttachValues(10, _Uploader);

			int alpha = static_cast<int>(m_UnitData.size()/12) + 1;
			int count = 0;
			int inc = 1;
			for (auto& unit : m_UnitData)
			{
				if (count == alpha)
				{
					queryProgress.AttachValues(10 + inc * 5, _Uploader);
					++inc;
					count = 0;
				}
				++count;
				try
				{
					unit.second.m_ID = DBAccess.GetCharacterID(unit.first, realmID, unit.second.m_Faction, true);
					
					if (unit.second.m_GuildName == "!RPLL!EPTY!")
					{
						unit.second.m_GuildName = "";
						unit.second.m_GuildID = -2;
					}
					else
					{
						unit.second.m_GuildID = DBAccess.GetGuildID(unit.second.m_GuildName, realmID, unit.second.m_Faction, true);
						if (unit.second.m_GuildID == -1)
						{
							CharData* cd = _Processor->GetCharData(unit.second.m_ID, db2, db);
							if (cd != nullptr)
							{
								unit.second.m_GuildID = cd->m_GuildId;
							}
						}
					}

					// Moved to Armory Processing
					APData apData;
					apData.uData = unit.second;
					apData.RealmId = realmID;
					apData.Version = version;
					apData.Uploader = _Uploader;
					_Processor->mQueue.enqueue(std::move(apData));
				}
				catch(...)
				{
					std::cout << "Some inserting issue at armory?!" << std::endl;
					// Better than loosing all data I suppose
				}
			}

			queryProgress.AttachValues(70, _Uploader);
			
			// Pets
			for (auto& unit : m_UnitData)
			{
				for (auto& petName : unit.second.m_PetName)
				{
					try
					{
						auto foundID = m_UnitData.find(petName);
						if (foundID == m_UnitData.end())
						{
							if (version < 100)
							{
								UnitData data;
								data.m_ID = DBAccess.GetPetID(petName, realmID, unit.second.m_Faction, true, unit.second.m_ID);
								if (data.m_ID == 0) continue;

								data.m_Class = -1;
								data.m_Joined = unit.second.m_Joined;
								data.m_Left = unit.second.m_Left;

								data.m_Owner = unit.second.m_ID;

								m_UnitData.insert(std::make_pair(petName, std::move(data)));
							}
							else
							{
								WoWGUID pet;
								pet.m_GUID = std::stoull(petName, nullptr, 16);
								if (pet.IsPet())
								{
									m_PetToId.insert(std::make_pair(pet.m_GUID, unit.second.m_ID)); // => Mapping it to the owner
									m_PetToOwner.insert(std::make_pair(pet.m_GUID, unit.second.m_ID));
								}
							}
						}
					}
					catch (...)
					{
						// Catching weird unicode characters
					}
				}
			}
			queryProgress.AttachValues(95, _Uploader);

		}
		catch (otl_exception& p)
		{ // intercept OTL exceptions
			std::cerr << p.msg << std::endl; // print out error message
			std::cerr << p.stm_text << std::endl; // print out SQL that caused the error
			std::cerr << p.var_info << std::endl; // print out the variable that caused the error
		}
		catch(...)
		{
			std::cout << "Something else happened!" << std::endl;
		}
		
	}


    std::map<int,int> Armory::mClassTranslation = {
		{0,1},
		{1,4},
		{2,5},
		{3,3},
		{4,9},
		{5,7},
		{6,8},
		{7,2},
		{8,6}
	};

	std::map<int,int> Armory::mConvertClassId = {
		{ 6, 9 },
		{ 11, 0 },
		{ 3, 1 },
		{ 8, 2 },
		{ 2, 3 },
		{ 5, 4 },
		{ 4, 5 },
		{ 7, 6 },
		{ 9, 7 },
		{ 1, 8 },
		{ 26, 19 },
		{ 31, 10 },
		{ 23, 11 },
		{ 28, 12 },
		{ 22, 13 },
		{ 25, 14 },
		{ 24, 15 },
		{ 27, 16 },
		{ 29, 17 },
		{ 21, 18 }
	};

	std::string Armory::HashTalents(std::string& _Talents, int classid, bool postvanilla)
	{
		if (_Talents == "")
			return "";
		static const char* encArr = "0zMcmVokRsaqbdrfwihuGINALpTjnyxtgevElBCDFHJKOPQSUWXYZ123456789";
		const char* _Token = _Talents.c_str();
		std::string bc = "";
		for (int i = 0; i < 3; ++i)
		{
			//for (; *_Token != '{'; ++_Token);
			//++_Token; // Skipping first {
			if (*_Token == '}') ++_Token;
			int TreeLen = 0;
			for (const char* countToken = _Token; *countToken != '}'; ++countToken) ++TreeLen;
			std::string buffer = "";
			for (; *_Token != '}'; ++_Token) buffer += *_Token;

			buffer = rtrim(buffer, '0');

			int bufferLength = static_cast<int>(buffer.length());
			int bf[2];
			for (int be = 0; be < bufferLength; be += 2)
			{
				for (int bd = 0; bd < 2; ++bd)
				{
					bf[bd] = buffer[be + bd] - '0';
					if (bf[bd] < 0) bf[bd] = 0;
				}
				bc += encArr[bf[0] * 6 + bf[1]];
			}

			if (bufferLength % 2 == 1)
				++bufferLength;
			if (bufferLength < TreeLen)
			{
				bc += 'Z';
			}
		}
		// Without leading classid ! TODO In Frontend encArr[classid*3] (depends on encoding in js)

		classid = mClassTranslation[classid];
		if (postvanilla) classid += 20;

		std::string res = encArr[mConvertClassId[classid] * 3] + bc;
		//std::remove_copy(bc.begin(), bc.end(), std::back_inserter(res), 'L');
		return res;
	}

	std::string Armory::GetTalentsSpend(std::string& _Talents)
	{
		if (_Talents == "")
			return "";

		int points = 0;
		std::string ret = "";
		for (const char* _Token = _Talents.c_str(); *_Token != '\0'; ++_Token)
		{
			if (*_Token == '}')
			{
				ret += ";" + std::to_string(points);
				points = 0;
			}
			else
			{
				points += *_Token - '0';
			}
		}
		return ret;
	}

	Armory::~Armory()
	{
		delete m_Parser;
	}
}
