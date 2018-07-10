#include "RPLLParser.h"

#include <iostream>
#include "FileUtility.h"
#include "StringUtility.h"
#include <chrono>
#include <time.h> 
#include <algorithm>

namespace RPLL
{
	RPLLParser::RPLLParser(const char* _source, bool _PostVanilla)
	{
		auto startTime = std::chrono::steady_clock::now();
		auto textData = File_ReadAllText(_source);
        std::cout << "Started parsing RPLLCollector\n";
		auto stopTime = std::chrono::steady_clock::now();
        std::cout << "Reading the file took: " << (std::chrono::duration_cast<std::chrono::milliseconds>(stopTime - startTime).count()) << "ms\n";

		startTime = std::chrono::steady_clock::now();
		if (!textData.empty()) // doing all the work in constructor seems wrong. More importantly, why use a class for one function?
		{
			try
			{
				int m_state = 0;
				// Parsing Player data first
				m_playerdata.reserve(20);
				buffer.reserve(100);

				auto _back = textData.end();
				std::string::const_iterator _token = textData.begin();
				PlayerData* _pd = nullptr;
				std::vector<PlayerData>* _vec = nullptr;
				std::string idBuffer = "";
				int id = 1;
				for (; *_token != '{'; ++_token);
				if (_PostVanilla)
				{
					for (; true; ++_token)
					{
						auto temp = *_token;
						if (temp > 30)
						{
							if (m_state == 0)
							{
								if (temp == '{')
								{
									_vec = new std::vector<PlayerData>;
									_vec->reserve(200);
									id = 1;
									++m_state;
								}
								else if (temp == '}') // may be removeable
								{
									break; // end
								}
							}
							else if (m_state == 1)
							{
								if (temp == '"') // Playerdata start
								{
									_pd = new PlayerData;
									_pd->_id = id;
									++id;
									++m_state;
								}
								else if (temp == '}') // may be removeable
								{
									_vec->shrink_to_fit();
									m_playerdata.push_back(std::move(*_vec));
									++_token; // Skipping ,
									m_state = 0;
								}
								else if (temp == 'n' && *(_token + 2) == 'l')
								{
									_token += 3;
									++id;
								}
							}
							else if (m_state == 2)
							{
								getPlayerDataPost(_token, _pd);
								/*for (int i = 0; i < 19; ++i)
								{
									std::swap(_pd->_gear[i]._randomEnchant, _pd->_gear[i]._socket4);
									std::swap(_pd->_gear[i]._socket1, _pd->_gear[i]._socket4);
									std::swap(_pd->_gear[i]._socket2, _pd->_gear[i]._socket4);
									std::swap(_pd->_gear[i]._socket3, _pd->_gear[i]._socket4);
								}*/

								if (*_token == '"')
								{
									_vec->push_back(std::move(*_pd));
									++_token; // Skipping ,
									m_state = 1;
								}
								else
								{
									std::cout << "Error in state 5: PlayerData has not been parsed correctly!" << std::endl;
									std::cout << *_token << std::endl;
									return; // !! TODO !! Some error should be outputted here!
								}
							}
						}
					}
				}
				else
				{
					for (; true; ++_token)
					{
						auto temp = *_token;
						if (temp > 30)
						{
							if (m_state == 0)
							{
								if (temp == '[')
								{
									_vec = new std::vector<PlayerData>;
									_vec->reserve(200);
									id = 1;
									++m_state;
								}
								else if (temp == '}') // may be removeable
								{
									break; // end
								}
							}
							else if (m_state == 1)
							{
								if (temp == ']')
								{
									++_token; // Space here
									++m_state;
								}
							}
							else if (m_state == 3)
							{
								if (temp == '[')
								{
									_pd = new PlayerData;
									++m_state;
									idBuffer = "";
								}
								else if (temp == '}')
								{
									_vec->shrink_to_fit();
									m_playerdata.push_back(std::move(*_vec));
									++_token; // ,
									m_state = 0;
								}
							}
							else if (m_state == 4)
							{
								if (temp == ']')
								{
									int buffId = std::stoi(idBuffer);
									if (buffId != id)
									{
										std::cout << "Unexpected id detected: " << id << " vs. " << buffId << std::endl;
										if (buffId > id)
										{
											for (; id < buffId; ++id)
											{
												auto dummyPd = new PlayerData;
												dummyPd->_name = "Unknown";
												_vec->push_back(std::move(*dummyPd));
											}
										}
									}

									_pd->_id = id;
									++id;
									_token += 4;
									++m_state;
								}
								else
								{
									idBuffer += *_token;
								}
							}
							else if (m_state == 5)
							{
								getPlayerData(_token, _pd);
								// Now we should be at the end of the string
								if (*_token == '"')
								{
									_vec->push_back(std::move(*_pd));
									++_token; // Skipping ,
									m_state = 3;
								}
								else
								{
									std::cout << "Error in state 5: PlayerData has not been parsed correctly!" << std::endl;
									std::cout << *_token << std::endl;
									return; // !! TODO !! Some error should be outputted here!
								}
							}
							else
							{
								++m_state;
							}
						}
					}
				}


				if (*_token == '}')
					++_token;
				m_playerdata.shrink_to_fit();
				// Skipping first [ so nothing will be pushed into the m_sessions array.
				if (!_PostVanilla)
				{
					for (; *_token != '['; ++_token) // Moving to the beginning of the next array.
					{
						if (*_token == '}') // This means that RPLLSession is empty!
							return;
					}
					++_token;
				}
				else
				{
					for (; *_token != '"'; ++_token)
					{
						if (*_token == '}') // This means that RPLLSession is empty!
							return;
					}
				}

				stopTime = std::chrono::steady_clock::now();
				std::cout << "Parsing took - PlayerData: " << (std::chrono::duration_cast<std::chrono::milliseconds>(stopTime - startTime).count()) << "ms\n";

				// Check if any of them is empty
				for (auto& pd : m_playerdata)
				{
					if (pd.size() == 0)
					{
						std::cout << "Detected Playerdata corruption... \n Trying to correct it!" << std::endl;
						PlayerData dummyPlayer;
						dummyPlayer._name = "Unknown";
						dummyPlayer._cbtTimeJoin = 0;
						dummyPlayer._cbtTimeLeave = 0;
						dummyPlayer._class = 0;
						dummyPlayer._faction = 0;
						dummyPlayer._guildName = "";
						dummyPlayer._id = 1;
						dummyPlayer._level = 0;
						dummyPlayer._race = 0;
						dummyPlayer._rankIndex = -1;
						dummyPlayer._sex = 0;
						for (int i = 0; i < 19; ++i)
							dummyPlayer._gear[i]._id = 0;
						pd.push_back(std::move(dummyPlayer));
					}
				}

				// TODO: Test what happens if there is no RPLLSession in the log.
				m_sessions.reserve(m_playerdata.size());

				if (m_playerdata.size() == 0)
					return;

				std::vector<SessionLine>* vecSL = nullptr;

				std::vector<std::string> abilities;
				std::vector<std::string> npcs;
				std::vector<std::string> speeches;
				std::vector<ComboAST> comboast;

				bool power = false;
				sessionSize = 0;
				for (; _token != _back; ++_token)
				{
					auto temp = *_token;
					if (temp > 30) {
						if (power)
						{
							if (temp != '"')
							{
								//std::cout << temp << std::endl;
								// Sorted by rarity
								if (temp == 'J') // Overheal
								{
									SessionLine sl;
									sl.m_Type = 8;
									getOverHeal(++_token, &sl, comboast);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'H') // Boss health
								{
									SessionLine sl;
									sl.m_Type = 10;
									getBossHealth(++_token, &sl, npcs);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'E') // Raid combat state
								{
									SessionLine sl;
									sl.m_Type = 5;
									getCombatState(++_token, &sl);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'I') // Abilities added
								{
									std::string buffer = "";
									getStringAssociatedToId(++_token, buffer);
									abilities.push_back(std::move(buffer));
								}
								else if (temp == 'F') // Npc added
								{
									std::string buffer = "";
									getStringAssociatedToId(++_token, buffer);
									npcs.push_back(std::move(buffer));
								}
								else if (temp == 'K') // ABID,CID,TID Combo
								{
									ComboAST ast;
									getComboAST(++_token, &ast, npcs, abilities);
									comboast.push_back(std::move(ast));
								}
								else if (temp == 'C') // Player entering combat
								{
									SessionLine sl;
									sl.m_Type = 3;
									for (buffer = ""; *(++_token) != '&';)
										buffer += *_token;
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'D') // Player leaving combat
								{
									SessionLine sl;
									sl.m_Type = 4;
									for (buffer = ""; *(++_token) != '&';)
										buffer += *_token;
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'G') // Boss entering combat
								{
									SessionLine sl;
									sl.m_Type = 7;
									getBossCombatState(++_token, &sl, npcs);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'L') // Interrupts
								{
									SessionLine sl;
									sl.m_Type = 12;
									getDispelInterrupt(++_token, &sl, npcs, abilities);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'M') // Dispels
								{
									SessionLine sl;
									sl.m_Type = 13;
									getDispelInterrupt(++_token, &sl, npcs, abilities);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'Z') // Threat
								{
									SessionLine sl;
									sl.m_Type = 26;
									getThreat(++_token, &sl, npcs);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'V') // Loot
								{
									SessionLine sl;
									sl.m_Type = 22;
									getLoot(++_token, &sl);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'W') // Speech outputted
								{
									SessionLine sl;
									sl.m_Type = 20;
									getSpeech(++_token, &sl, npcs, speeches);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'X') // Enemy dies
								{
									SessionLine sl;
									sl.m_Type = 24;
									getBossDied(++_token, &sl, npcs);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'T') // Speech added
								{
									std::string buffer = "";
									getStringAssociatedToId(++_token, buffer);
									speeches.push_back(std::move(buffer));
								}
								else if (temp == 'B') // Zone entered
								{
									SessionLine sl;
									sl.m_Type = 2;
									getZone(++_token, &sl);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'Q') // BG Announcements (Skipping it for now)
									for (; *_token != '&'; ++_token);
								else if (temp == 'P') // BG Total
									for (; *_token != '&'; ++_token);
								else if (temp == 'R') // BG Left
									for (; *_token != '&'; ++_token);
								else if (temp == 'S') // Bg Joined
									for (; *_token != '&'; ++_token);
								else if (temp == 'U') // Instance reset
								{
									SessionLine sl;
									sl.m_Type = 21;
									for (buffer = ""; *(++_token) != '&';)
										buffer += *_token;
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'N') // Equal to A
								{
									SessionLine sl;
									sl.m_Type = 14;
									getStartEndEntry(++_token, &sl);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else if (temp == 'A') // First entry when joining the world
								{
									SessionLine sl;
									sl.m_Type = 1;
									getStartEndEntry(++_token, &sl);
									sl.m_RTIndex = sessionSize;
									vecSL->push_back(std::move(sl));
								}
								else; // Guess error state

							}
							else
							{
								power = false;
							}
						}
						else
						{
							if ((temp == ']' && !_PostVanilla) || (_PostVanilla && temp == '"'))
							{
								vecSL = new std::vector<SessionLine>;
								if (_PostVanilla) vecSL->reserve(60000);
								else vecSL->reserve(30000);
								sessionPlayerData = &m_playerdata[sessionSize];
								// Clearing all temp tables
								abilities.clear();
								npcs.clear();
								speeches.clear();
								comboast.clear();
								if (!_PostVanilla)
									_token += 4;
								power = true;
								oldTimer = 0;
							}
							else if ((temp == '[' && !_PostVanilla) || (temp == ',' && _PostVanilla))
							{
								vecSL->shrink_to_fit();
								m_sessions.push_back(std::move(*vecSL));
								m_RealTime.push_back(sessionTS);
								++sessionSize;
							}
						}
					}
				}

				if (!_PostVanilla)
				{
					vecSL->shrink_to_fit();
					m_sessions.push_back(std::move(*vecSL));
					m_RealTime.push_back(sessionTS);
				}

				// Adding sessionTS to the player join and leave timestamps
				// If people are in the group and relogg of the logger is done, will the timestamp be assigned again ?
				int i = 0;
				for (auto& e : m_playerdata)
				{
					for (auto& ee : e)
					{
						if (ee._cbtTimeJoin != -1)
							ee._cbtTimeJoin += m_RealTime[i];
						if (ee._cbtTimeLeave != -1)
							ee._cbtTimeLeave += m_RealTime[i];
					}
					++i;
				}

				/*for (auto sessArr : m_sessions)
					for (auto sess : sessArr)
						if (sess.m_Type == 8)
							std::cout << sess.mS_Param[0] << std::endl;*/

				if (m_playerdata.size() != m_sessions.size())
				{
					m_playerdata.clear();
					m_sessions.clear();
					return;
				}

				stopTime = std::chrono::steady_clock::now();
				std::cout << "Parsing took - Sessions: " << (std::chrono::duration_cast<std::chrono::milliseconds>(stopTime - startTime).count()) << "ms\n";
			}
			catch(std::exception ex)
			{
				std::cout << "Exception occoured during RPLL parsing" << std::endl;
				std::cout << ex.what() << std::endl;
				m_sessions.clear();
				m_playerdata.clear();
				return;
			}
		}
		else
		{
            std::cout << "Empty log! " << std::endl;
		}
	}

	RPLLParser::~RPLLParser()
	{
	}

	void RPLLParser::parseInt(int& value, const char** str, int* untilChoice)
	{
		std::string buffer = String_SubStringUntilEither(*str, std::array<const char*, 2>{ ":", "|" }, str, untilChoice);
		if (buffer != "}")
			value = std::stoi(buffer);
	}

	void RPLLParser::parseShort(short& value, const char** str, int* untilChoice)
	{
		std::string buffer = String_SubStringUntilEither(*str, std::array<const char*, 2>{ ":", "|" }, str, untilChoice);
		if (buffer != "}")
			value = static_cast<short>(std::stoi(buffer));
	}

	void RPLLParser::parseChar(char& value, const char** str, int* untilChoice)
	{
		std::string buffer = String_SubStringUntilEither(*str, std::array<const char*, 2>{ ":", "|" }, str, untilChoice);
		if (buffer != "}")
			value = static_cast<char>(std::stoi(buffer));
	}

	void RPLLParser::getPlayerDataPost(std::string::const_iterator& _token, PlayerData* _pd)
	{
		// Getting the name
		if (*_token != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_name = buffer;
		}
		else
		{
			++_token;
			_pd->_name = "";
		}

		// Getting the level
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_level = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_level = 0;
		}

		// Getting unit sex
		if (*(++_token) != '}')
			_pd->_sex = *_token - '0';
		else
		{
			++_token;
			_pd->_sex = 0;
		}

		// Getting Guildname
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_guildName = buffer;
		}
		else
		{
			++_token;
			_pd->_guildName = "";
		}

		// Getting the rank index
		if (*(++_token) != '}')
			_pd->_rankIndex = *_token - '0';
		else
		{
			//++_token;
			_pd->_rankIndex = -1;
		}

		_token += 2;
		// Getting the rank name
		if (*_token != '}')
		{
			for (buffer = ""; *_token != '|' || (*(_token + 1) > 57 && *(_token + 2) > 57); ++_token) // Allows '|' in there but not relieable if the rank name is sth like "bla|12|" => Escape with error log then
				buffer += *_token;
			_pd->_rankName = buffer;
		}
		else
		{
			++_token;
			_pd->_rankName = "";
		}

		// Getting the class id
		if (*(++_token) != '}')
			_pd->_class = *_token - '0';
		else
		{
			//++_token;
			_pd->_class = 99; // Meaning unknown
		}

		// Getting the race id
		if (*(++_token) != '}')
			_pd->_race = *_token - '0';
		else
		{
			//++_token;
			_pd->_race = 99; // Meaning unknown
		}

		// Getting the faction id
		if (*(++_token) != '}')
			_pd->_faction = *_token - '0';
		else
		{
			//++_token;
			_pd->_faction = 0;
		}

		// Getting the pvp rank index => Could be longer than one char
		//std::cout << "stoi 31" << std::endl;
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_pvpData._rankIndex = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_pvpData._rankIndex = -1;
		}

		// Getting the armor data
		// TBC: 27797:2996:2725:2725:0:0:0:0
		// itemId, enchantId, jewelId1, jewelId2, jewelId3, jewelId4, suffixId, uniqueId
		// suffix => Random enchant
		// Uniqueid => Master Loot ?
		++_token;
		const char* tokenPtr = &(*_token); //Only needed because iterator is used as input argument. Avoid using iterators if it doesnt make sense to use
		for (int i = 0; i < 19; ++i)
		{
			int untilChoice = 0; //0 means ":"
			parseInt(_pd->_gear[i]._id, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._enchant, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._socket1, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._socket2, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._socket3, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._socket4, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._randomEnchant, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._uniqueid, &tokenPtr, &untilChoice);
		}

		int numParsedCharacters = static_cast<int>(tokenPtr - (&(*_token))); //Only needed because iterator is used as input argument.
		_token += numParsedCharacters; //Only needed because iterator is used as input argument.

		// Getting pvp data
		if (*(_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_pvpData._sessHK = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_pvpData._sessHK = 0;
		}
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_pvpData._weekHonor = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_pvpData._weekHonor = 0;
		}
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_pvpData._yesHK = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_pvpData._yesHK = 0;
		}
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_pvpData._yesHonor = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_pvpData._yesHonor = 0;
		}
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_pvpData._lifeTimeHK = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_pvpData._lifeTimeHK = 0;
		}
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_pvpData._lifeTimeDK = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_pvpData._lifeTimeDK = 0;
		}


		// Getting ArenaData
		for (int i = 0; i < 3; ++i)
		{
			if (*(++_token) != '}')
			{
				for (buffer = ""; *_token != '|'; ++_token)
					buffer += *_token;
				_pd->mArenaData[i].mName = buffer;
				++_token;
				for (buffer = ""; *_token != '|'; ++_token)
					buffer += *_token;
				_pd->mArenaData[i].mSize = std::stoi(buffer);
				++_token;
				for (buffer = ""; *_token != '|'; ++_token)
					buffer += *_token;
				_pd->mArenaData[i].mRating = std::stoi(buffer);
				++_token;
				for (buffer = ""; *_token != '|'; ++_token)
					buffer += *_token;
				_pd->mArenaData[i].mSeasonPlayed = std::stoi(buffer);
				++_token;
				for (buffer = ""; *_token != '|'; ++_token)
					buffer += *_token;
				_pd->mArenaData[i].mSeasonWins = std::stoi(buffer);
			}
			else
			{
				// Skip 5 entries
				_token += 9;
			}
		}

		// Getting the cbt start time
		if (*(++_token) == '}')
		{
			++_token;
			_pd->_cbtTimeJoin = -1;
		}
		else
		{
			//std::cout << "stoi 35" << std::endl;
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_cbtTimeJoin = static_cast<int>(1000 * std::stof(buffer));
		}

		// Getting the cbt end time
		if (*(++_token) == '}')
		{
			++_token;
			_pd->_cbtTimeLeave = -1;
		}
		else
		{
			//std::cout << "stoi 36" << std::endl;
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_cbtTimeLeave = static_cast<int>(1000 * std::stof(buffer));
		}

		// Gettings Talents
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->mTalents = buffer; // Will convert it later!
		}
		else
		{
			++_token;
			_pd->mTalents = "";
		}

		// Getting the pet name
		// Need to consider that there might be an id for but MUSNT
		if (*(++_token) != '}')
		{
			while (*_token != '"' && *_token != '|')
			{
				for (buffer = ""; *_token != '"' && *_token != ',' && *_token != '|'; ++_token)
					buffer += *_token;
				if (*_token == ',') ++_token;
				if (buffer != "Unknown")
					_pd->_petName.push_back(buffer);
			}
		}
		else
		{
			++_token;
		}

		// Professions added with 124
		if (*_token == '|')
		{
			++_token;
			if (*_token != '}')
			{
				for (buffer = ""; *_token != '|'; ++_token)
					buffer += *_token;
				_pd->mProf1 = std::stoi(buffer);
			}
			else
			{
				++_token;
			}
			++_token;
			if (*_token != '}')
			{
				for (buffer = ""; *_token != '"'; ++_token)
					buffer += *_token;
				_pd->mProf2 = std::stoi(buffer);
			}
			else
			{
				++_token;
			}
		}

	}


	void RPLLParser::getPlayerData(std::string::const_iterator& _token, PlayerData* _pd)
	{
		// Getting the name
		if (*_token != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_name = buffer;
		}
		else
		{
			++_token;
			_pd->_name = "";
		}
		//std::cout << _pd->_name << std::endl;


		// Getting the level
		//std::cout << "stoi 30" << std::endl;
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_level = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_level = 0;
		}

		// Getting unit sex
		if (*(++_token) != '}')
			_pd->_sex = *_token - '0';
		else
		{
			++_token;
			_pd->_sex = 0;
		}

		// Getting Guildname
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_guildName = buffer;
		}
		else
		{
			++_token;
			_pd->_guildName = "";
		}

		// Getting the rank index
		if (*(++_token) != '}')
			_pd->_rankIndex = *_token - '0';
		else
		{
			//++_token;
			_pd->_rankIndex = -1;
		}

		_token += 2;
		// Getting the rank name
		if (*_token != '}')
		{
			for (buffer = ""; *_token != '|' || (*(_token + 1) > 57 && *(_token + 2) > 57); ++_token) // Allows '|' in there but not relieable if the rank name is sth like "bla|12|" => Escape with error log then
				buffer += *_token;
			_pd->_rankName = buffer;
		}
		else
		{
			++_token;
			_pd->_rankName = "";
		}

		// Getting the class id
		if (*(++_token) != '}')
			_pd->_class = *_token - '0';
		else
		{
			//++_token;
			_pd->_class = 99; // Meaning unknown
		}

		// Getting the race id
		if (*(++_token) != '}')
			_pd->_race = *_token - '0';
		else
		{
			//++_token;
			_pd->_race = 99; // Meaning unknown
		}

		// Getting the faction id
		if (*(++_token) != '}')
			_pd->_faction = *_token - '0';
		else
		{
			//++_token;
			_pd->_faction = 0;
		}

		// Getting the pvp rank index => Could be longer than one char
		//std::cout << "stoi 31" << std::endl;
		if (*(++_token) != '}')
		{
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_pvpData._rankIndex = std::stoi(buffer);
		}
		else
		{
			++_token;
			_pd->_pvpData._rankIndex = -1;
		}

		// Getting the armor data
		// Example: 12927:2606:0:0,12927:2606:0:0...
		// For vanilla it only consists of 4 values but in tbc sockets are added
		//std::cout << "stoi 32" << std::endl;
		++_token;
		const char* tokenPtr = &(*_token); //Only needed because iterator is used as input argument. Avoid using iterators if it doesnt make sense to use
		for (int i = 0; i < 19; ++i)
		{
			int untilChoice = 0; //0 means ":"
			parseInt(_pd->_gear[i]._id, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._enchant, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._randomEnchant, &tokenPtr, &untilChoice);
			if (untilChoice == 1) continue;
			parseShort(_pd->_gear[i]._uniqueid, &tokenPtr, &untilChoice);
		}

		int numParsedCharacters = static_cast<int>(tokenPtr - (&(*_token))); //Only needed because iterator is used as input argument.
		_token += numParsedCharacters; //Only needed because iterator is used as input argument.

		// Getting pvp data
		tokenPtr = &(*_token);
		parseShort(_pd->_pvpData._sessHK, &tokenPtr);
		parseShort(_pd->_pvpData._sessDK, &tokenPtr);
		parseShort(_pd->_pvpData._yesHK, &tokenPtr);
		parseInt(_pd->_pvpData._yesHonor, &tokenPtr);
		parseShort(_pd->_pvpData._weekHK, &tokenPtr);
		parseInt(_pd->_pvpData._weekHonor, &tokenPtr);
		parseShort(_pd->_pvpData._lastWeekHK, &tokenPtr);
		parseInt(_pd->_pvpData._lastWeekHonor, &tokenPtr);
		parseInt(_pd->_pvpData._lastWeekStanding, &tokenPtr);
		parseInt(_pd->_pvpData._lifeTimeHK, &tokenPtr);
		parseInt(_pd->_pvpData._lifeTimeDK, &tokenPtr);
		parseChar(_pd->_pvpData._lifeTimeRank, &tokenPtr);
		numParsedCharacters = static_cast<int>(tokenPtr - (&(*_token)));
		_token += numParsedCharacters;
		for (buffer = ""; *_token != '|'; ++_token)
			buffer += *_token;
		if (buffer != "}")
			_pd->_pvpData._progress = static_cast<int>(1000 * std::stof(buffer));

        //std::cout << "test4" << std::endl;

		// Getting the cbt start time
		if (*(++_token) == '}')
		{
			++_token;
			_pd->_cbtTimeJoin = -1;
		}
		else
		{
			//std::cout << "stoi 35" << std::endl;
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_cbtTimeJoin = static_cast<int>(1000 * std::stof(buffer));
		}

		// Getting the cbt end time
		if (*(++_token) == '}')
		{
			++_token;
			_pd->_cbtTimeLeave = -1;
		}
		else
		{
			//std::cout << "stoi 36" << std::endl;
			for (buffer = ""; *_token != '|'; ++_token)
				buffer += *_token;
			_pd->_cbtTimeLeave = static_cast<int>(1000 * std::stof(buffer));
		}

		// Getting the pet name
		// Need to consider that there might be an id for but MUSNT
		if (*(++_token) != '}')
		{
			while (*_token != '"' && *_token != '|')
			{
				for (buffer = ""; (*_token != '"' || *(_token+1) != ',') && *_token != ',' && *_token != '|'; ++_token)
                    buffer += *_token;
                if (*_token == ',') ++_token;
				if (buffer != "Unknown")
					_pd->_petName.push_back(buffer);
			}
		}
		else
		{
			++_token;
        }

		// Professions added with 22
		if (*_token == '|')
		{
			++_token;
			if (*_token != '}')
			{
				for (buffer = ""; *_token != '|'; ++_token)
					buffer += *_token;
				try
				{
					_pd->mProf1 = std::stoi(buffer);
				}
				catch (...)
				{
					_pd->mProf1 = 0;
				}
			}
			else
			{
				++_token;
			}
			++_token;
			if (*_token != '}')
			{
				for (buffer = ""; *_token != '"'; ++_token)
					buffer += *_token;
				try
				{
					_pd->mProf2 = std::stoi(buffer);
				}
				catch (...)
				{
					_pd->mProf2 = 0;
				}
			}
			else
			{
				++_token;
			}
		}
	}

	// Different types of ids
	// NPC: F1=Eye of C'Thun
	// Ability: I1=Healing Touch
	// Speech: T1=some string
	void RPLLParser::getStringAssociatedToId(std::string::const_iterator& _token, std::string& buffer)
	{
		for (; *_token != '&'; ++_token)
			buffer += *_token;
	}

	// Will look like this:
	// K1}1}19}20
	void RPLLParser::getComboAST(std::string::const_iterator& _token, ComboAST* _ast, std::vector<std::string>& _npcs, std::vector<std::string>& _abilities)
	{
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		int abKey = std::stoi(buffer) - 1;

		if (_abilities.size() <= abKey) // If some entry was missed!
		{
			std::cout << "Some ability entries were misssed..." << std::endl;
			auto beginSize = _abilities.size();
			for (int i=0; i<abKey+1-beginSize; ++i)
			{
				_abilities.push_back("");
			}
		}

		_ast->m_Ability = _abilities[abKey];
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
        //std::cout << "stoi 13" << std::endl;
		auto key = std::stoi(buffer);
        _ast->m_Players[0] = &((*sessionPlayerData)[key - 1]);

		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
        //std::cout << "stoi 12" << std::endl;
		key = std::stoi(buffer);
		if (key > 0)
            _ast->m_Players[1] = &((*sessionPlayerData)[key-1]);
		else
		{
			if (_npcs.size() <= -key-1) // If some entry was missed!
			{
				std::cout << "Some npc entries were misssed..." << std::endl;
				auto beginSize = _npcs.size();
				for (int i = 0; i<-key - beginSize; ++i)
				{
					_npcs.push_back("");
				}
			}

			_ast->m_Target = _npcs[-key - 1];
		}

	}


	// J77.813}1}3624}264
	// TimeStamp - ABID,CID,TID - Raw Heal - Over heal
	void RPLLParser::getOverHeal(std::string::const_iterator& _token, SessionLine* _sl, std::vector<ComboAST>& _ast)
	{
		// Timestamp
		for (buffer = "";*_token != '}'; ++_token)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Combo token
		for (buffer = ""; *(++_token) != '}';)
            buffer += *_token;
        //std::cout << "stoi 11" << std::endl;
		auto key = std::stoi(buffer)-1;
		
		//std::cout << key << " // " << buffer << " // " << _ast.size() << std::endl;
		if (_ast.size() <= key)
		{
			std::cout << "Key comb not found?! o.O" << std::endl;
			if (_ast.size() == 1)
			{
				auto beginSize = _ast.size();
				for (int i = 0; i < key + 1 - beginSize; ++i)
				{
					ComboAST cast;
					cast.m_Ability = "";
					cast.m_Target = "";
					cast.m_Players[0] = &m_playerdata[0][0];
					_ast.push_back(std::move(cast));
				}
				std::reverse(_ast.begin(), _ast.end());
			}
			else
			{
				auto beginSize = _ast.size();
				for (int i = 0; i < key + 1 - beginSize; ++i)
				{
					ComboAST cast;
					cast.m_Ability = "";
					cast.m_Target = "";
					cast.m_Players[0] = &m_playerdata[0][0];
					_ast.push_back(std::move(cast));
				}
			}
		}

		if (!_ast[key].m_Target.empty())
			_sl->mS_Param[1] = _ast[key].m_Target;
		else
			_sl->m_Players[1] = _ast[key].m_Players[1];
		_sl->m_Players[0] = _ast[key].m_Players[0];
		_sl->mS_Param[0] = _ast[key].m_Ability;



		// Raw heal
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
        //std::cout << "stoi 10" << std::endl;
		_sl->mI_Param[0] = std::stoi(buffer);

		// Overheal
		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
        //std::cout << "stoi 9" << std::endl;
		_sl->mI_Param[1] = std::stoi(buffer);

		//std::cout << "OH: " << _sl->m_Players[0]->_name << " => " << (_ast[key].m_Target.empty() ? (_sl->m_Players[1] != nullptr ? _sl->m_Players[1]->_name : "NONE") : _sl->mS_Param[1]) << " with " << _sl->mS_Param[0] << std::endl;
	}

	// E64.194}40
	// Timestamp / Num player
	void RPLLParser::getCombatState(std::string::const_iterator& _token, SessionLine* _sl)
	{
		// Timestamp
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Num players
		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
        //std::cout << "stoi 8" << std::endl;
		_sl->mI_Param[0] = std::stoi(buffer);
	}

	void RPLLParser::getStartEndEntry(std::string::const_iterator& _token, SessionLine* _sl)
	{
		// Timestamp
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		int timer = static_cast<int>(1000 * (std::stof(buffer)));
		_sl->m_TimeStamp = 0;

		// Gametime
		for (buffer = ""; *(++_token) != ':';)
			buffer += *_token;
		_sl->mI_Param[0] = std::stoi(buffer); // In seconds
		for (buffer = ""; *(++_token) != ',';)
			buffer += *_token;
		_sl->mI_Param[1] = std::stoi(buffer);

		// Realtime (Whereever the uploader lives)
		struct tm t = {};
		//t.tm_isdst = 3600;
		t.tm_year = 2018-1900; // TODO: Get year somewhere
		for (buffer = ""; *(++_token) != '-';)
			buffer += *_token;
		t.tm_mon = std::stoi(buffer) - 1;
		for (buffer = ""; *(++_token) != ' ';)
			buffer += *_token;
		t.tm_mday = std::stoi(buffer);
		for (buffer = ""; *(++_token) != ':';)
			buffer += *_token;
		t.tm_hour = std::stoi(buffer);
		for (buffer = ""; *(++_token) != ':';)
			buffer += *_token;
		t.tm_min = std::stoi(buffer);
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		t.tm_sec = std::stoi(buffer);

		// Another attempt to sync here:
		_sl->mI_Param[0] = t.tm_min;
		_sl->mI_Param[1] = t.tm_sec;

		/*if (t.tm_sec > 18)
			t.tm_sec -= 18;*/
		// 1-1-2017 - 1 Hour offset
		//_sl->mI_Param[1] = static_cast<int>(static_cast<unsigned int>(mktime(&t)) + 3600); // Exactly 1 hour off from gmt+2 Berlin/Europe
		//std::cout << t.tm_hour << std::endl;
		//std::cout << _sl->mI_Param[0] << std::endl;
		//std::cout << (t.tm_hour - _sl->mI_Param[0]) << std::endl;
		//int someint = (_sl->mI_Param[0] - t.tm_hour);
		//if (someint < -12) // Wrap around 0:00 Servertime vs 22:00 system time
		//{
		//	someint = _sl->mI_Param[0] - t.tm_hour + 24;
		//}
		//else if(someint > 12)
		//{
		//	std::cout << "TS > 12 ever occours?!" << std::endl;
		//}
		//std::cout << "Timedifference: " << someint << std::endl;
		auto newTs = (static_cast<__int64>(mktime(&t))) * 1000 - timer;

		/*if (newTs - sessionTS <= 20000)
		{
			sessionTS = newTs + oldTimer;
		}
		else
		{
			sessionTS = newTs;
		}*/
		sessionTS = newTs;
		oldTimer = timer;

		//sessionTS = (static_cast<__int64>(mktime(&t))) * 1000 - timer; // delay until first message was deployed
		//_sl->m_RealTime = sessionTS;
        /*
        char buffer2[30];
		struct tm dt = {};
		time_t rawtime = sessionTS/1000;
		localtime_s(&dt, &rawtime);
		strftime(buffer2, sizeof(buffer2), "%m:%d %H:%M:%y", &dt);
        //std::cout << buffer2 << std::endl;
        */

		// Server
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		_sl->mS_Param[0] = buffer;

		// Locale
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		_sl->mS_Param[1] = buffer;

		// Version
		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
		_sl->mI_Param[2] = std::stoi(buffer);

		// Temp until new version established!
		/*if (*(_token) == '&')
		{
			_sl->mI_Param[3] = -1;
			return;
		}*/

		//// Timestamp when this entry was created
		//for (buffer = ""; *(++_token) != '&';)
		//	buffer += *_token;
		//_sl->mI_Param[3] = static_cast<int>(1000 * (std::stof(buffer)));

	}
	
	// B238.016}Dustwallow Marsh}?
	void RPLLParser::getZone(std::string::const_iterator & _token, SessionLine * _sl)
	{
		// Timestamp
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Zone name
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		_sl->mS_Param[0] = buffer;

		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
        //std::cout << "stoi 7" << std::endl;
		if (buffer != "?")
			_sl->mI_Param[0] = std::stoi(buffer);
		else
			_sl->mI_Param[0] = 0;
	}

	// Bosshealth
	// H1}1353.719}100.000
	void RPLLParser::getBossHealth(std::string::const_iterator & _token, SessionLine * _sl, std::vector<std::string>& _npcs)
	{	
		// Npcid
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		_sl->mS_Param[0] = _npcs[std::stoi(buffer)-1];

		// Timestamp
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Bosshealth
		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
		_sl->mI_Param[0] = static_cast<int>(1000*std::stof(buffer));
	}

	// Loot
	// V1766.610}16}16914
	void RPLLParser::getLoot(std::string::const_iterator & _token, SessionLine * _sl)
	{
		// Timestamp
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Player
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		//std::cout << "stoi 6" << std::endl;
		_sl->m_Players[0] = &((*sessionPlayerData)[std::stoi(buffer) - 1]);

		// Item
		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
		//std::cout << "stoi 5" << std::endl;
		_sl->mI_Param[0] = std::stoi(buffer);
	}

	// Z123.120}13}12}132
	void RPLLParser::getThreat(std::string::const_iterator & _token, SessionLine * _sl, std::vector<std::string>& _npcs)
	{
		// Timestamp
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Player
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		//std::cout << "stoi 6" << std::endl;
		_sl->m_Players[0] = &((*sessionPlayerData)[std::stoi(buffer) - 1]);

		// NPC
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;

		int key = std::stoi(buffer);
		if (_npcs.size() <= key - 1) // If some entry was missed!
		{
			std::cout << "Some npc entries were misssed..." << std::endl;
			auto beginSize = _npcs.size();
			for (int i = 0; i<key - beginSize; ++i)
			{
				_npcs.push_back("");
			}
		}
		_sl->mS_Param[0] = _npcs[key - 1];

		// Amount
		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
		//std::cout << "stoi 5" << std::endl;
		_sl->mI_Param[0] = std::stoi(buffer);
	}

	// G70.887}1
	void RPLLParser::getBossCombatState(std::string::const_iterator & _token, SessionLine * _sl, std::vector<std::string>& _npcs)
	{
		// Timestamp
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Npcname
		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
        //std::cout << "stoi 4" << std::endl;
		int key = std::stoi(buffer) - 1;
		if (_npcs.size() <= key) // If some entry was missed!
		{
			auto beginSize = _npcs.size();
			for (int i = 0; i<key+1 - beginSize; ++i)
			{
				_npcs.push_back("");
			}
		}

		_sl->mS_Param[0] = _npcs[key];
	}

	//X1615.625}1}?
	void RPLLParser::getBossDied(std::string::const_iterator & _token, SessionLine * _sl, std::vector<std::string>& _npcs)
	{
		// Timestamp
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Npcname
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
        //std::cout << "stoi 2" << std::endl;
		_sl->mS_Param[0] = _npcs[std::stoi(buffer) - 1];

		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
        //std::cout << "stoi 3" << std::endl;
		if (buffer != "?")
			_sl->mI_Param[0] = std::stoi(buffer);
		else
			_sl->mI_Param[0] = 0;
	}

	// W1}1353.703}1}1
	// Speech type, Timestamp, Npcid, Speechid
	void RPLLParser::getSpeech(std::string::const_iterator & _token, SessionLine * _sl, std::vector<std::string>& _npcs, std::vector<std::string>& _speeches)
	{
		// Speech type
		_sl->mI_Param[0] = *_token - '0';
		++_token;

		// Timestamp
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Npcname
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		if (std::stoi(buffer) == 0)
			_sl->mS_Param[0] = "Unknown";
		else
			_sl->mS_Param[0] = _npcs[std::stoi(buffer) - 1];

		// Speech
		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;

		auto spKey = std::stoi(buffer) - 1;
		if (_speeches.size() <= spKey) // If some entry was missed!
		{
			auto beginSize = _speeches.size();
			for (int i = 0; i<spKey + 1 - beginSize; ++i)
			{
				_speeches.push_back("");
			}
		}
		_sl->mS_Param[1] = _speeches[spKey];
	}

	// M1192.844}33}14}6}7
	// Timestamp, causeid, targetid (Can be an NPC tho), dispel ability, target debuff
	// TODO: Need to change addon so that the targetid can be negative (NPC)
	void RPLLParser::getDispelInterrupt(std::string::const_iterator & _token, SessionLine * _sl, std::vector<std::string>& _npcs, std::vector<std::string>& _abilities)
	{
		// Timestamp
		for (buffer = ""; *_token != '}'; ++_token)
			buffer += *_token;
		_sl->m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

		// Cause
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
        _sl->m_Players[0] = &(*sessionPlayerData)[std::stoi(buffer) - 1];

		// Target
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
        //std::cout << "stoi 1: " << buffer << std::endl;
		auto key = std::stoi(buffer);
        //std::cout << key << " vs " << (*sessionPlayerData).size() << " in sess: " << sessionSize << std::endl;
		if (key > 0)
            _sl->m_Players[1] = &(*sessionPlayerData)[key - 1];
        else if (key == 0)
            _sl->mS_Param[2] = "Unknown";
		else
			_sl->mS_Param[2] = _npcs[-key - 1];


		// Cause Ability
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		_sl->mS_Param[0] = _abilities[std::stoi(buffer) - 1];

		// Target Ability
		for (buffer = ""; *(++_token) != '&';)
			buffer += *_token;
		_sl->mS_Param[1] = _abilities[std::stoi(buffer) - 1];
	}

	// Deprecated
	/*
	void RPLLParser::getThreat(std::string::const_iterator & _token, std::vector<SessionLine>* _vec)
	{
		for (buffer = ""; *(++_token) != '}';)
			buffer += *_token;
		PlayerData* player = &(m_playerdata[sessionSize - 1][std::stoi(buffer) - 1]);

		while (*_token != '&')
		{
			// Timestamp
			SessionLine _sl;
			_sl.m_Type = 15;
			//_sl.m_Players = new PlayerData*[1];
			_sl.m_Players[0] = player;
			//_sl.m_Param = new int[1];
			for (buffer = ""; *(++_token) != '=';)
				buffer += *_token;
			_sl.m_TimeStamp = static_cast<int>(1000 * std::stof(buffer));

			// Threat value
			for (buffer = ""; *(++_token) != '}';)
				buffer += *_token;
			_sl.mI_Param[0] = static_cast<int>(1000 * std::stof(buffer));
			_vec->push_back(std::move(_sl));
		}
	}
	*/
}
