#pragma once

//https://www.townlong-yak.com/framexml/1.12.1/GlobalStrings.lua


#if __linux__
	#include <inttypes.h>
	#define __int64 long long
#endif

#include <assert.h>
#include <algorithm>
#include <iostream>
#include <time.h> // Correct one?
#include <map>
#include <vector>

#include "DatabaseAccess.h"

namespace RPLL
{
	class CombatlogParser
	{
		__int64 m_CommTS = 0;
		std::map<std::string, bool> mDifficultNpcs = {

			{ "\"Plucky\" Johnson's ", true },
			{ "Alzzin's Minion ", true },
			{ "Arugal's Voidwalker ", true },
			{ "Atal'ai Deathwalker's ", true },
			{ "Darkreaver's Fallen ", true },
			{ "Death's Head ", true },
			{ "Doctor Weavil's ", true },
			{ "Eliza's Guard ", true },
			{ "Father Winter's ", true },
			{ "Fellicent's Shade ", true },
			{ "Flik's Frog ", true },
			{ "Franclorn's Spirit ", true },
			{ "Gizlock's Dummy ", true },
			{ "Great-father Winter's ", true },
			{ "Greatfather Winter's ", true },
			{ "Gunther's Visage ", true },
			{ "Guse's War ", true },
			{ "Hammertoe's Spirit ", true },
			{ "Helcular's Remains ", true },
			{ "Hukku's Imp ", true },
			{ "Hukku's Succubus ", true },
			{ "Hukku's Voidwalker ", true },
			{ "Ichman's Gryphon ", true },
			{ "Jezelle's Felhunter ", true },
			{ "Jezelle's Felsteed ", true },
			{ "Jezelle's Imp ", true },
			{ "Jezelle's Succubus ", true },
			{ "Jezelle's Voidwalker ", true },
			{ "Jeztor's War ", true },
			{ "Jugkar Grim'rod's ", true },
			{ "Krakle's Thermometer ", true },
			{ "Kurzen's Agent ", true },
			{ "Lord Azrethoc's ", true },
			{ "Maiden's Virtue ", true },
			{ "Merithra's Wake ", true },
			{ "Mulverick's War ", true },
			{ "Nefarian's Troops ", true },
			{ "Nijel's Point ", true },
			{ "Noxxion's Spawn ", true },
			{ "Onyxia's Elite ", true },
			{ "Pat's Firework ", true },
			{ "Pat's Hellfire ", true },
			{ "Pat's Splash ", true },
			{ "Ribbly's Crony ", true },
			{ "Ryson's Eye ", true },
			{ "Sartura's Royal ", true },
			{ "Sharpbeak's Father ", true },
			{ "Sharpbeak's Mother ", true },
			{ "Slidore's Gryphon ", true },
			{ "Slim's Friend ", true },
			{ "Sneed's Shredder ", true },
			{ "The Master's ", true },
			{ "Twilight's Hammer ", true },
			{ "Tyrion's Spybot ", true },
			{ "Umi's Mechanical ", true },
			{ "Varo'then's Ghost ", true },
			{ "Vipore's Gryphon ", true },
			{ "Warug's Bodyguard ", true },
			{ "Warug's Target ", true },
			{ "Winna's Kitten ", true },
			{ "Winter's Little ", true },
			{ "Wizzlecrank's Shredder ", true },
			{ "Wrenix's Gizmotronic ", true },
			{ "Xiggs Fuselighter's ", true },
			{ "Ysida's Trigger ", true },
			{ "Zaetar's Spirit ", true },
		};
	public:
		CombatlogParser()
		{
			mNameValues.push_back("");
			mNameKeys[""] = 0;
		}

		std::vector<__int64> mRealTime;
		char mRTIndex = -1;
		std::map<std::string, short> mNameKeys;
		std::vector<std::string> mNameValues;
		short mCurNameKeyCount = 1;

		std::vector<std::vector<CombatLogEventPost>> Parse(const char* _CombatLogString, int _CombatLogStringLength, bool _IsPost, DatabaseAccess& db)
		{
			//int firstTimeStampNumber = -1;
			std::vector<std::vector<CombatLogEventPost>> resultEvents;
			resultEvents.reserve(10);
			std::vector<CombatLogEventPost> currEvents;
			currEvents.reserve(500000);
			int prevTimeStampNumber = 0;
			WowTimestamp prevTimestamp;
			int timeStampNumber = 0;

			int count = 0;
			bool prevParsingError = false;
			const char* oldCurrCharPtr = nullptr;
			for (const char* currCharPtr = _CombatLogString; currCharPtr < _CombatLogString + _CombatLogStringLength;)
			{
				const char* tempStr = currCharPtr;
				currCharPtr = String_GotoAfterNext(tempStr, "  ");
				try
				{
					++count;
					if (tempStr == currCharPtr) //Just a validity check to make sure we are on the correct parsing stage
					{
						if (prevParsingError && oldCurrCharPtr == currCharPtr)
						{
							std::cout << "Aborted cause weird parsing error!" << std::endl;
							break;
						}
						prevParsingError = true;
						oldCurrCharPtr = currCharPtr;
						continue;
					}

					const char* tempStr2;
					auto wowTimeStamp = WowTimestamp::ParseDateTime(tempStr, "  ", &tempStr2);

					if (tempStr2 != currCharPtr) //Just a validity check to make sure we are on the correct parsing stage
					{
						if (prevParsingError && oldCurrCharPtr == currCharPtr)
							break;
						prevParsingError = true;
						oldCurrCharPtr = currCharPtr;
						continue;
					}

					int deltaTimestamp = wowTimeStamp.GetTimeDeltaMilliseconds(prevTimestamp, prevTimeStampNumber);
					timeStampNumber += deltaTimestamp;
					prevTimestamp = wowTimeStamp;
					prevTimeStampNumber = prevTimestamp.GetTimeTotalMilliseconds();

					const char* parseEndString = nullptr;
					const char* resultParsingError = nullptr;
					CombatLogEventPost cbt = ParseCombatLinePost(currCharPtr, &parseEndString, &resultParsingError);

					if (cbt.m_Amount < 0)
						cbt.m_Amount = 0;

					if (deltaTimestamp == -1)
					{
						timeStampNumber = wowTimeStamp.GetTimeTotalMilliseconds();
						currEvents.shrink_to_fit();
						resultEvents.push_back(std::move(currEvents));
						currEvents = std::vector<CombatLogEventPost>();
						currEvents.reserve(100000);
					}

					// Parsing was faulty!
					if (resultParsingError != nullptr
						|| deltaTimestamp == -2)
					{
						std::cout << "Error detected at: " << count << std::endl;
						prevParsingError = true;
						currCharPtr = String_GotoAfterNext(currCharPtr, "\n");
						continue;
					}

					if ((m_CommTS == 0 || (deltaTimestamp == -1 && !prevParsingError)) && wowTimeStamp.Month >= 0 && wowTimeStamp.Month <= 12 && wowTimeStamp.Day >= 0 && wowTimeStamp.Day <= 32 && resultParsingError == nullptr)
					{
						struct tm t = {};
						t.tm_year = 118; // TODO: Get year somewhere
						t.tm_hour = 0;
						t.tm_min = 0;
						t.tm_sec = 0;
						t.tm_mon = wowTimeStamp.Month - 1;
						t.tm_mday = wowTimeStamp.Day;

						m_CommTS = static_cast<__int64>(mktime(&t)) * 1000;
						mRealTime.push_back(m_CommTS);
						++mRTIndex;
					}
					cbt.m_RTIndex = mRTIndex;
					currEvents.push_back(std::move(cbt));
					currCharPtr = parseEndString;
					prevParsingError = false;

					if (resultParsingError == nullptr)
					{
						currEvents.back().m_RTIndex = mRTIndex;
						currEvents.back().m_Timestamp = wowTimeStamp.GetTimeTotalMilliseconds();
						if (currEvents.back().m_Timestamp < 0)
							currEvents.back().m_Timestamp = 0;

						//currEvents.back().m_WowTimestamp = wowTimeStamp;
					}
					else
					{
						prevParsingError = true;
						currEvents.pop_back();
					}
				}
				catch (const std::exception& ex)
				{
					prevParsingError = true;
					std::cout << count << std::endl;
					std::cout << std::string(tempStr, 300) << std::endl;
					std::cout << ex.what() << "\n";
					currCharPtr = String_GotoAfterNext(tempStr, "\n");
				}
			}
			if (currEvents.size() != 0)
			{
				currEvents.shrink_to_fit();
				resultEvents.push_back(std::move(currEvents));
			}
			return resultEvents;
		}

		std::vector<std::vector<CombatLogEvent>> Parse(const char* _CombatLogString, int _CombatLogStringLength, DatabaseAccess& db)
		{
			//int firstTimeStampNumber = -1;
			std::vector<std::vector<CombatLogEvent>> resultEvents;
			resultEvents.reserve(10);
			std::vector<CombatLogEvent> currEvents;
			currEvents.reserve(350000);
			int prevTimeStampNumber = 0;
			WowTimestamp prevTimestamp;
			int timeStampNumber = 0;

			int count = 0;
			bool prevParsingError = false;
			const char* oldCurrCharPtr = nullptr;
			for (const char* currCharPtr = _CombatLogString; currCharPtr < _CombatLogString + _CombatLogStringLength;)
			{
				const char* tempStr = currCharPtr;
				currCharPtr = String_GotoAfterNext(tempStr, "  ");
				try
				{
					++count;
					if (tempStr == currCharPtr) //Just a validity check to make sure we are on the correct parsing stage
					{
						if (prevParsingError && oldCurrCharPtr == currCharPtr)
						{
							std::cout << "Aborted cause weird parsing error!" << std::endl;
							break;
						}
						prevParsingError = true;
						oldCurrCharPtr = currCharPtr;
						continue;
					}

					const char* tempStr2;
					auto wowTimeStamp = WowTimestamp::ParseDateTime(tempStr, "  ", &tempStr2);

					if (tempStr2 != currCharPtr) //Just a validity check to make sure we are on the correct parsing stage
					{
						if (prevParsingError && oldCurrCharPtr == currCharPtr)
							break;
						prevParsingError = true;
						oldCurrCharPtr = currCharPtr;
						continue;
					}

					int deltaTimestamp = wowTimeStamp.GetTimeDeltaMilliseconds(prevTimestamp, prevTimeStampNumber);
					timeStampNumber += deltaTimestamp;
					prevTimestamp = wowTimeStamp;
					prevTimeStampNumber = prevTimestamp.GetTimeTotalMilliseconds();

					const char* parseEndString = nullptr;
					const char* resultParsingError = nullptr;
					CombatLogEvent cbt = ParseCombatLine(currCharPtr, db, &parseEndString, &resultParsingError);

					if (cbt.m_Amount > 64000)
						cbt.m_Amount = 64000;
					if (cbt.m_Amount < 0)
						cbt.m_Amount = 0;

					if (deltaTimestamp == -1)
					{
						timeStampNumber = wowTimeStamp.GetTimeTotalMilliseconds();
						currEvents.shrink_to_fit();
						resultEvents.push_back(std::move(currEvents));
						currEvents = std::vector<CombatLogEvent>();
						currEvents.reserve(100000);
					}
					
					// Parsing was faulty!
					if ((resultParsingError != nullptr
						|| deltaTimestamp == -2
						//|| (cbt.m_Ability.find("/") != std::string::npos && cbt.m_Ability.find("Immune ") == std::string::npos)
						|| (/*cbt.m_Source >= 0 && */mNameValues[cbt.m_Source].find("/") != std::string::npos)
						|| (/*cbt.m_Target >= 0 && */mNameValues[cbt.m_Target].find("/") != std::string::npos)) && cbt.m_Action != static_cast<char>(Action::RPLL))
					{
						std::cout << "Error detected at: " << count << std::endl;

						if (resultParsingError != nullptr)
							std::cout << "Case 1" << std::endl;
						if (deltaTimestamp == -2)
							std::cout << "Case 2" << std::endl;

						/*std::cout << cbt.m_Ability << std::endl;
						std::cout << cbt.m_Source << std::endl;
						std::cout << cbt.m_Target << std::endl;*/
						prevParsingError = true;
						currCharPtr = String_GotoAfterNext(currCharPtr, "\n");

						if (currCharPtr == parseEndString || parseEndString >= _CombatLogString + _CombatLogStringLength)
						{
							std::cout << "Finished after " << count << " events: Error detected" << std::endl;
							break;
						}

						continue;
					}

					if ((m_CommTS == 0 || (deltaTimestamp == -1 && !prevParsingError)) && wowTimeStamp.Month >= 0 && wowTimeStamp.Month <= 12 && wowTimeStamp.Day >= 0 && wowTimeStamp.Day <= 32 && resultParsingError == nullptr)
					{
						struct tm t = {};
						t.tm_year = 118; // TODO: Get year somewhere
						t.tm_hour = 0;
						t.tm_min = 0;
						t.tm_sec = 0;
						t.tm_mon = wowTimeStamp.Month - 1;
						t.tm_mday = wowTimeStamp.Day;

						m_CommTS = static_cast<__int64>(mktime(&t)) * 1000;
						mRealTime.push_back(m_CommTS);
						++mRTIndex;
					}
					cbt.m_RTIndex = mRTIndex;
					currEvents.push_back(std::move(cbt));
					prevParsingError = false;
					
					if (currEvents.back().m_Action == static_cast<char>(Action::None) || resultParsingError != nullptr)
					{
						std::cout << "Sth went wrong in line: " << count << std::endl;
						std::cout << "A:" << currEvents.back().m_Ability << std::endl;
						std::cout << "A:" << currEvents.back().m_Source << std::endl;
						std::cout << "A:" << currEvents.back().m_Target << std::endl;
						std::cout << std::string(currCharPtr, 100) << std::endl << std::endl;
						std::cout << std::string(parseEndString, 100) << std::endl;
					}

					if (resultParsingError == nullptr)
					{
						prevParsingError = false;
						currEvents.back().m_RTIndex = mRTIndex;
						currEvents.back().m_Timestamp = wowTimeStamp.GetTimeTotalMilliseconds(); // If there are many errors the delta method is incorrect!
						if (currEvents.back().m_Timestamp < 0)
							currEvents.back().m_Timestamp = 0;
						//currEvents.back().m_WowTimestamp = wowTimeStamp;

						if (currEvents.back().m_Action == static_cast<char>(Action::RPLL))
						{
							const char* date = (mNameValues[currEvents.back().m_Target]+"}").c_str();
							String_SubStringUntil(date, ",", &date); // Skipping server time
							int month = std::stoi(String_SubStringUntil(date, "-", &date));
							int day = std::stoi(String_SubStringUntil(date, " ", &date));
							int hour = std::stoi(String_SubStringUntil(date, ":", &date));
							int minute = std::stoi(String_SubStringUntil(date, ":", &date));
							int seconds = std::stoi(String_SubStringUntil(date, "}", &date));
							struct tm t = {};
							t.tm_year = 118; // TODO: Get year somewhere
							t.tm_hour = hour;
							t.tm_min = minute;
							t.tm_sec = seconds;
							t.tm_mon = month - 1;
							t.tm_mday = day;
							currEvents.back().m_Amount = static_cast<int>(round(1.0*((mRealTime[currEvents.back().m_RTIndex] + currEvents.back().m_Timestamp) - static_cast<__int64>(mktime(&t)) * 1000)/3600000.0));
						}
					}
					else
					{
						prevParsingError = true;
						currEvents.pop_back();
					}
					if (parseEndString >= _CombatLogString + _CombatLogStringLength)
					{
						std::cout << "Finished after " << count << " events: End reached" << std::endl;
						std::cout << std::string(currCharPtr, 100) << std::endl;
						break;
					}

					if (parseEndString != nullptr)
					{
						currCharPtr = String_GotoAfterNext(parseEndString, "\n");
						if (currCharPtr == parseEndString)
						{
							std::cout << "Finished after " << count << " events: CurrChartPtr == ParseEndString" << std::endl;
							break;
						}
					}
				}
				catch (const std::exception& ex)
				{
					prevParsingError = true;
					std::cout << count << std::endl;
					std::cout << std::string(tempStr, 100) << std::endl;
					std::cout << ex.what() << "\n";
					currCharPtr = String_GotoAfterNext(tempStr, "\n");
				}
			}
			if (currEvents.size() != 0)
			{
				currEvents.shrink_to_fit();
				resultEvents.push_back(std::move(currEvents));
			}
			return resultEvents;
		}
		
		short ProcessNameKey(std::string& name)
		{
			if (name.back() == 32) name.pop_back();
			if (mNameKeys.find(name) != mNameKeys.end())
				return mNameKeys[name];
			mNameValues.push_back(name);
			mNameKeys.insert(std::make_pair(name, mCurNameKeyCount));
			++mCurNameKeyCount;
			return mCurNameKeyCount - 1;
		}
		short ProcessNameKey(const char* str)
		{
			std::string name(str);
			if (name.back() == 32) name.pop_back();
			if (mNameKeys.find(name) != mNameKeys.end())
				return mNameKeys[name];
			mNameValues.push_back(name);
			mNameKeys.insert(std::make_pair(name, mCurNameKeyCount));
			++mCurNameKeyCount;
			return mCurNameKeyCount - 1;
		}

		short ProcessNameKey(std::string&& name)
		{
			if (name.back() == 32) name.pop_back();
			if (mNameKeys.find(name) != mNameKeys.end())
				return mNameKeys[name];
			mNameValues.push_back(name);
			mNameKeys.insert(std::make_pair(name, mCurNameKeyCount));
			++mCurNameKeyCount;
			return mCurNameKeyCount - 1;
		}

		/*
		 * Convention DoT/HoT abilities
		 * Problem: They share the same ability id most of the times
		 * So => Append DoT/HoT
		 * Increase Id by 200k // Incase we get some future patches!
		 */
		CombatLogEventPost ParseCombatLinePost(const char* _String, const char** _ResultStringEnd = nullptr, const char** _ResultParsingError = nullptr)
		{
			// https://wow.gamepedia.com/index.php?title=COMBAT_LOG_EVENT&oldid=1588609
			CombatLogEventPost resultCLE;
			const char* nextString = _String;
			bool periodic = false;

			int prefixChoice = -1;
			std::string prefix = String_SubStringUntil(nextString, "_", &nextString); // Are there always suffix?
			std::string suffix = String_SubStringUntilEither(nextString, std::array<const char*, 2>{"_", ","}, &nextString, &prefixChoice);
			if (prefixChoice == 0)
			{
				periodic = suffix == "PERIODIC";
				if (prefix == "SPELL" && (suffix == "PERIODIC" || suffix == "BUILDING"))
				{
					prefix += "_" + suffix;
					suffix = "";
				}
				suffix += String_SubStringUntil(nextString, ",", &nextString);
			}

			resultCLE.m_SourceGUID.m_GUID = std::stoull(String_SubStringUntil(nextString, ",", &nextString), nullptr, 16);
			resultCLE.m_Source = ProcessNameKey(ParseString(&nextString));
			resultCLE.m_SourceFlags = std::stoul(String_SubStringUntil(nextString, ",", &nextString), nullptr, 16); // Hex to int
			resultCLE.m_DestGUID.m_GUID = std::stoull(String_SubStringUntil(nextString, ",", &nextString), nullptr, 16);
			resultCLE.m_Target = ProcessNameKey(ParseString(&nextString));
			resultCLE.m_DestFlags = std::stoul(String_SubStringUntilEither(nextString, std::array<const char*, 2>{"\n", ","}, &nextString), nullptr, 16);

			std::string special = prefix + suffix;
			//resultCLE.debug = special;
			if (prefix == "RANGE" || prefix == "SPELL" || prefix == "DAMAGE" || prefix == "SPELL_PERIODIC")
			{
				resultCLE.m_SpellID = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_SpellName = ProcessNameKey(ParseString(&nextString));
				resultCLE.m_SpellSchool = static_cast<unsigned char>(std::stoul(String_SubStringUntilEither(nextString, std::array<const char*, 2>{"\n", ","}, &nextString), nullptr, 16));
			}
			else if (prefix == "ENVIRONMENTAL")
			{
				std::string type = String_SubStringUntil(nextString, ",", &nextString);
				if (type == "DROWNING") resultCLE.m_Action = static_cast<char>(Action::Drowning);
				else if (type == "FALLING") resultCLE.m_Action = static_cast<char>(Action::Falls);
				else if (type == "FATIGUE") resultCLE.m_Action = static_cast<char>(Action::EnvFatigue);
				else if (type == "FIRE") resultCLE.m_Action = static_cast<char>(Action::EnvFire);
				else if (type == "LAVA") resultCLE.m_Action = static_cast<char>(Action::SwimmingInLava);
				else if (type == "SLIME") resultCLE.m_Action = static_cast<char>(Action::EnvSlime);
				else resultCLE.m_Action = static_cast<char>(Action::Unknown);
			}
			else if (prefix == "SWING")
			{
				resultCLE.m_SpellName = ProcessNameKey("AutoAttack");
				resultCLE.m_SpellID = 76;
				resultCLE.m_SpellSchool = 1;
			}

			if (suffix == "DAMAGE" || suffix == "SHIELD" || suffix == "SPLIT")
			{
				resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_AmountSchool = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_Resisted = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_Blocked = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_Absorbed = std::stoi(String_SubStringUntil(nextString, ",", &nextString));

				if (periodic)
				{
					resultCLE.m_SpellName = ProcessNameKey(mNameValues[resultCLE.m_SpellName] + " (DoT)");
					resultCLE.m_SpellID += 200000;
				}

				resultCLE.m_Action = static_cast<char>(Action::Hit);
				std::string extraMod = String_SubStringUntil(nextString, ",", &nextString);
				if (extraMod != "nil") resultCLE.m_Action = static_cast<char>(Action::Crit);
				extraMod = String_SubStringUntil(nextString, ",", &nextString);
				if (extraMod != "nil") resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Glancing);
				if (String_StartsWith(nextString, "nil", &nextString) == false) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Crushing);

				if (suffix == "SHIELD") resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed); // TODO: Can more of these happen at the same time?
				if (suffix == "SPLIT") resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Split); 
				String_SubStringUntil(nextString, "\n", &nextString);
			}
			else if (suffix == "MISSED" || suffix == "SHIELDMISSED")
			{
				resultCLE.m_Action = static_cast<char>(Action::Missed);

				if (String_StartsWith(nextString, "ABSORB", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
				else if (String_StartsWith(nextString, "BLOCK", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Blocked);
				else if (String_StartsWith(nextString, "DEFLECT", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Deflected);
				else if (String_StartsWith(nextString, "DODGE", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Dodged);
				else if (String_StartsWith(nextString, "EVADE", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Evaded);
				else if (String_StartsWith(nextString, "IMMUNE", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Immune);
				else if (String_StartsWith(nextString, "MISS", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::None);
				else if (String_StartsWith(nextString, "PARRY", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Parried);
				else if (String_StartsWith(nextString, "REFLECT", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Reflected);
				else if (String_StartsWith(nextString, "RESIST", &nextString)) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);

				if (suffix == "SHIELDMISSED") resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed); 
				String_SubStringUntil(nextString, "\n", &nextString);
			}
			else if (suffix == "HEAL")
			{
				if (periodic)
				{
					resultCLE.m_SpellName = ProcessNameKey(mNameValues[resultCLE.m_SpellName] + " (HoT)");
					resultCLE.m_SpellID += 200000;
				}
				resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				if (String_StartsWith(nextString, "nil", &nextString)) resultCLE.m_Action = static_cast<char>(Action::Heal);
				else resultCLE.m_Action = static_cast<char>(Action::CritHeal);
				String_SubStringUntil(nextString, "\n", &nextString);
			}
			else if (suffix == "ENERGIZE")
			{
				resultCLE.m_Action = static_cast<char>(Action::Energize);
				resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				ParsePowerTypeInfo(resultCLE, std::stoi(String_SubStringUntil(nextString, "\n", &nextString)));
			}
			else if (suffix == "DRAIN")
			{
				// TODO: How does drain work?
				resultCLE.m_Action = static_cast<char>(Action::Drain);
				resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				ParsePowerTypeInfo(resultCLE, std::stoi(String_SubStringUntil(nextString, ",", &nextString)));
				resultCLE.m_ExtraAmount = std::stoi(String_SubStringUntil(nextString, "\n", &nextString));
			}
			else if (suffix == "LEECH")
			{
				// TODO: How does leech work?
				resultCLE.m_Action = static_cast<char>(Action::Leech);
				resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				ParsePowerTypeInfo(resultCLE, std::stoi(String_SubStringUntil(nextString, ",", &nextString)));
				resultCLE.m_ExtraAmount = std::stoi(String_SubStringUntil(nextString, "\n", &nextString));
			}
			else if (suffix == "INTERRUPT")
			{
				resultCLE.m_Action = static_cast<char>(Action::Interrupt);
				resultCLE.m_ExtraID = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_Extra = ProcessNameKey(ParseString(&nextString));
				resultCLE.m_ExtraSchool = static_cast<unsigned char>(std::stoul(String_SubStringUntil(nextString, "\n", &nextString), nullptr, 16)); // TODO: Parse School?
			}
			else if (suffix == "DISPEL")
			{
				resultCLE.m_Action = static_cast<char>(Action::Dispel);
				resultCLE.m_ExtraID = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_Extra = ProcessNameKey(ParseString(&nextString));
				resultCLE.m_ExtraSchool = static_cast<unsigned char>(std::stoul(String_SubStringUntil(nextString, ",", &nextString), nullptr, 16));
				String_SubStringUntil(nextString, "\n", &nextString);
				// Aura type is not very important, its known!
			}
			else if (suffix == "DISPELFAILED")
			{
				resultCLE.m_Action = static_cast<char>(Action::DispelFailed);
				resultCLE.m_ExtraID = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_Extra = ProcessNameKey(ParseString(&nextString));
				resultCLE.m_ExtraSchool = static_cast<unsigned char>(std::stoul(String_SubStringUntil(nextString, "\n", &nextString), nullptr, 16));
			}
			else if (suffix == "STOLEN")
			{
				resultCLE.m_Action = static_cast<char>(Action::Stolen);
				resultCLE.m_ExtraID = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_Extra = ProcessNameKey(ParseString(&nextString));
				resultCLE.m_ExtraSchool = static_cast<unsigned char>(std::stoul(String_SubStringUntil(nextString, ",", &nextString), nullptr, 16));
				String_SubStringUntil(nextString, "\n", &nextString);
				// Aura type is known!
			}
			else if (suffix == "EXTRAATTACKS")
			{
				resultCLE.m_Action = static_cast<char>(Action::ExtraAttack);
				resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, "\n", &nextString));
			}
			else if (suffix == "AURAAPPLIED")
			{
				resultCLE.m_Action = static_cast<char>(Action::Gain);
				String_SubStringUntil(nextString, "\n", &nextString);
				// Aura type is not very important, its known!
			}
			else if (suffix == "AURAREMOVED")
			{
				resultCLE.m_Action = static_cast<char>(Action::Fades);
				String_SubStringUntil(nextString, "\n", &nextString);
				// Aura type is not very important, its known!
			}
			else if (suffix == "AURAAPPLIED_DOSE")
			{
				resultCLE.m_Action = static_cast<char>(Action::GainDose);
				// Aura type is not very important, its known!
				String_SubStringUntil(nextString, ",", &nextString);
				resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, "\n", &nextString));
			}
			else if (suffix == "AURAREMOVED_DOSE")
			{
				resultCLE.m_Action = static_cast<char>(Action::RemoveDose);
				// Aura type is not very important, its known!
				String_SubStringUntil(nextString, ",", &nextString);
				resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, "\n", &nextString));
			}
			else if (suffix == "AURAREFRESH")
			{
				resultCLE.m_Action = static_cast<char>(Action::AuraRefresh);
				String_SubStringUntil(nextString, "\n", &nextString);
			}
			else if (suffix == "AURABROKEN")
			{
				resultCLE.m_Action = static_cast<char>(Action::Broken);
				String_SubStringUntil(nextString, "\n", &nextString);
			}
			else if (suffix == "AURABROKEN_SPELL")
			{
				resultCLE.m_Action = static_cast<char>(Action::BrokenSpell);
				resultCLE.m_ExtraID = std::stoi(String_SubStringUntil(nextString, ",", &nextString));
				resultCLE.m_Extra = ProcessNameKey(ParseString(&nextString));
				resultCLE.m_ExtraSchool = static_cast<unsigned char>(std::stoul(String_SubStringUntil(nextString, ",", &nextString), nullptr, 16));
				String_SubStringUntil(nextString, "\n", &nextString);
				// Aura type is known!
			}
			else if (suffix == "CASTSTART")
			{
				resultCLE.m_Action = static_cast<char>(Action::BeginCast);
			}
			else if (suffix == "CASTSUCCESS")
			{
				resultCLE.m_Action = static_cast<char>(Action::Cast);
			}
			else if (suffix == "CASTFAILED")
			{
				resultCLE.m_Action = static_cast<char>(Action::Failed);
				resultCLE.m_Extra = ProcessNameKey(String_SubStringUntil(nextString, "\n", &nextString)); // Failed type string
			}
			else if (suffix == "INSTAKILL")
			{
				resultCLE.m_Action = static_cast<char>(Action::Instakill);
			}
			else if (suffix == "DURABILITYDAMGE")
			{
				resultCLE.m_Action = static_cast<char>(Action::Durability); // ?
			}
			else if (suffix == "DURABILITYDAMAGE_ALL")
			{
				resultCLE.m_Action = static_cast<char>(Action::Durability); // ?
			}
			else if (suffix == "CREATE")
			{
				resultCLE.m_Action = static_cast<char>(Action::Create); // ?
			}
			else if (suffix == "SUMMON")
			{
				resultCLE.m_Action = static_cast<char>(Action::Summon);
			}
			else
			{
				if (special == "ENCHANTAPPLIED")
				{
					// We dont really need to parse this!
					String_SubStringUntil(nextString, "\n", &nextString);
				}
				else if (special == "ENCHANTREMOVED")
				{
					// We dont really need to parse this!
					String_SubStringUntil(nextString, "\n", &nextString);
				}
				else if (special == "PARTYKILL")
				{
					resultCLE.m_Action = static_cast<char>(Action::Dies);
				}
				else if (special == "UNITDIED")
				{
					resultCLE.m_Action = static_cast<char>(Action::Dies);
				}
				else if (special == "UNITDESTROYED") // ?
				{
					resultCLE.m_Action = static_cast<char>(Action::Destroyed);
				}
				else
				{
					std::cout << "Unhandled event! " << prefix + suffix << std::endl;
				}
			}

			if (_ResultStringEnd != nullptr) *_ResultStringEnd = nextString;
			return resultCLE;
		}
		void ParsePowerTypeInfo(CombatLogEventPost& _CombatLogEvent, int&& _Type)
		{
			if (_Type == -2) _CombatLogEvent.m_AmountType = static_cast<char>(AmountType::Health);
			else if (_Type == 0) _CombatLogEvent.m_AmountType = static_cast<char>(AmountType::Mana);
			else if (_Type == 1) _CombatLogEvent.m_AmountType = static_cast<char>(AmountType::Rage);
			else if (_Type == 2) _CombatLogEvent.m_AmountType = static_cast<char>(AmountType::Focus);
			else if (_Type == 3) _CombatLogEvent.m_AmountType = static_cast<char>(AmountType::Energy);
			else if (_Type == 4) _CombatLogEvent.m_AmountType = static_cast<char>(AmountType::Happiness);
			else if (_Type == 5) _CombatLogEvent.m_AmountType = static_cast<char>(AmountType::Runes);
			else if (_Type == 6) _CombatLogEvent.m_AmountType = static_cast<char>(AmountType::RunicPower);
		}
		std::string ParseString(const char** nextString)
		{
			if (String_StartsWith(*nextString, "\"", nextString))
				return String_SubStringUntil(*nextString, "\",", nextString);
			// nil case
			return String_SubStringUntil(*nextString, ",", nextString);
		}

		CombatLogEvent ParseCombatLine(const char* _String, DatabaseAccess& db, const char** _ResultStringEnd = nullptr, const char** _ResultParsingError = nullptr)
		{
			CombatLogEvent resultCLE;
			const char* nextString = _String;
			// TODO:
			// https://i.imgur.com/tBGFGvE.png
			if (String_StartsWith(nextString, "RPLL:", &nextString) == true || String_StartsWith(nextString, "RPLL}", &nextString) == true)
			{
				resultCLE.m_Action = static_cast<char>(Action::RPLL);
				resultCLE.m_Source = ProcessNameKey(String_SubStringUntil(nextString, "}", &nextString));
				resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "}", &nextString)); // }\n ?
			}
			else if (String_StartsWith(_String, "You ", &nextString) == true)
			{
				resultCLE.m_Source = ProcessNameKey("PLAYER");
				if (String_StartsWith(nextString, "fail to perform ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Failed);
					resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ": ", &nextString), db);
					
					if (String_StartsWith(nextString, "Another action is in progress") == true)
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::AnotherActionIsInProgress);
					}
					else
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
					}
				}
				else if (String_StartsWith(nextString, "fail to cast ", &nextString) == true)
				{
					int Choice = -1;
					resultCLE.m_Action = static_cast<char>(Action::Failed);
					// No => Not something and No Target
                    resultCLE.m_Ability = GetAbility(String_SubStringUntilEither(nextString, std::array<const char*, 13>{": A", ": Out", ": No", ": Interrupted", ": Target", ": Can", ": You", ": I", ": F", ": E", ": T", ": M", ": R"}, &nextString, &Choice, String_SubStringUntilChoice::Exclude_UntilString), db);
					//if (String_StartsWith(nextString, "Interrupted") == true)
					if (Choice == 3)
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Interrupted);
					}
					else
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
					}
				}
				else if (String_StartsWith(nextString, "hit ", &nextString) == true)
				{
					resultCLE.m_Ability = 47490;
					ParseHitInfo(resultCLE, nextString);
				}
				else if (String_StartsWith(nextString, "crit ", &nextString) == true)
				{
					resultCLE.m_Ability = 47490;
					ParseCritInfo(resultCLE, nextString);
				}
				else if (String_StartsWith(nextString, "gain ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Gain);
					//resultCLE.m_Ability = String_SubStringUntil(nextString, ".");

					int untilStringUsed = -1;
					std::string resourceGained = String_SubStringUntilEither(nextString, std::array<const char*, 4>{" (", " from ", " through ", "."}, &nextString, &untilStringUsed);
					if (untilStringUsed == 3 || untilStringUsed == 0) // "."
					{
						//Means just gained a status like from an ability.
						resultCLE.m_Ability = GetAbility(resourceGained, db);
					}
					else if (untilStringUsed == 1) // " from "
					{
						//Means gained some resource, resourceGained is a value together with resource type(mana, rage, health, energy etc)
						const char* resourceTypeString = nullptr;
						//std::cout << "Test 3" << std::endl;
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(resourceGained.c_str(), " ", &resourceTypeString));
						if (String_StartsWith(resourceTypeString, "Mana") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Mana);
						}
						else if (String_StartsWith(resourceTypeString, "health") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Health); //Not sure if this is even possible.
						}
						else if (String_StartsWith(resourceTypeString, "Rage") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Rage);
						}
						else if (String_StartsWith(resourceTypeString, "Energy") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Energy);
						}
						else if (String_StartsWith(resourceTypeString, "Focus") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Focus); //Not sure if this is even possible.
						}
						else if (String_StartsWith(resourceTypeString, "Happiness") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Happiness);
						}
						else
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
						}

						std::string currData = String_SubStringUntilEither(nextString, std::array<const char*, 3>{"'s ", "your ", "."}, &nextString, &untilStringUsed);
						if (untilStringUsed == 0) // "'s "
						{
							resultCLE.m_Target = ProcessNameKey(std::move(currData));
							resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".") + " (HoT)", db);
						}
						// TODO: your Renew
						else if (untilStringUsed == 1)
						{
							resultCLE.m_Target = ProcessNameKey("PLAYER");
							resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".") + " (HoT)", db);
						}
						else if (untilStringUsed == 2) // "."
						{
							resultCLE.m_Ability = GetAbility(currData + " (HoT)", db);
						}
						std::swap(resultCLE.m_Source, resultCLE.m_Target);
					}
					// TODO: Eowan gains 1 extra attack through Sword Specialization.
					else if (untilStringUsed == 2)
					{
						const char* resourceTypeString = nullptr;
						//std::cout << "Test 4" << std::endl;
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(resourceGained.c_str(), " ", &resourceTypeString));
						if (String_StartsWith(resourceTypeString, "extra attack") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Attack);
						}
						std::string currData = String_SubStringUntil(nextString, ".", &nextString);
						resultCLE.m_Ability = GetAbility(currData, db);
					}
				}
				else if (String_StartsWith(nextString, "have slain ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Slain);
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "!"));
				}
				else if (String_StartsWith(nextString, "cast ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Cast);
					std::string temp = String_SubStringUntil(nextString, ".", &nextString);
					if (temp.find(" on ") != std::string::npos)
					{
						const char* tcstr = temp.c_str();
						resultCLE.m_Ability = GetAbility(String_SubStringUntil(tcstr, " on ", &tcstr), db);
						if (temp.find(":") != std::string::npos)
						{
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(tcstr, ":", &tcstr));
						}
						else
						{
							resultCLE.m_Target = ProcessNameKey(tcstr);
						}
					}
					else
					{
						resultCLE.m_Ability = GetAbility(temp, db);
						resultCLE.m_Target = ProcessNameKey("PLAYER"); // Player casts a totem or so
					}

				}
				else if (String_StartsWith(nextString, "are afflicted by ", &nextString) == true)
				{
					std::swap(resultCLE.m_Source, resultCLE.m_Target); // TODO ?
					int Choice = -1;
					resultCLE.m_Action = static_cast<char>(Action::AfflictedBy);
					resultCLE.m_Ability = GetAbility(String_SubStringUntilEither(nextString, std::array<const char*, 2>{" (", "."}, &nextString, &Choice), db);
				}
				else if (String_StartsWith(nextString, "suffer ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Suffers);

					int untilStringUsed = -1;
					std::string sufferedDamage = String_SubStringUntilEither(nextString, std::array<const char*, 2>{" from ", " points of "}, &nextString, &untilStringUsed);
					const char* damageTypeString = nullptr;
					//std::cout << "Test 7" << std::endl;
					resultCLE.m_Amount = std::stoi(String_SubStringUntil(sufferedDamage.c_str(), " ", &damageTypeString));

					if (untilStringUsed == 0) //" from "
					{
						if (String_StartsWith(damageTypeString, "Nature ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::NatureDamage);
						}
						else if (String_StartsWith(damageTypeString, "Arcane ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::ArcaneDamage);
						}
						else if (String_StartsWith(damageTypeString, "Frost ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::FrostDamage);
						}
						else if (String_StartsWith(damageTypeString, "Fire ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::FireDamage);
						}
						else if (String_StartsWith(damageTypeString, "Shadow ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::ShadowDamage);
						}
						else if (String_StartsWith(damageTypeString, "Holy ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::HolyDamage);
						}
						else if (String_StartsWith(damageTypeString, "Physical ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
						}
						else
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
						}

						untilStringUsed = -1;
						std::string currData = String_SubStringUntilEither(nextString, std::array<const char*, 3>{"'s ", "your ", "."}, &nextString, &untilStringUsed);
						if (untilStringUsed == 0) // "'s"
						{
							resultCLE.m_Target = ProcessNameKey(std::move(currData));
							resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".") + " (DoT)", db);
						}
						else if (untilStringUsed == 1) // "."
						{
							resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".") + " (DoT)", db);
						}
						else if (untilStringUsed == 2) // "."
						{
							resultCLE.m_Ability = GetAbility(currData + " (DoT)", db);
						}
					}
					else if (untilStringUsed == 1) //" points of "
					{
						if (String_StartsWith(nextString, "nature ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::NatureDamage);
						}
						else if (String_StartsWith(damageTypeString, "arcane ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::ArcaneDamage);
						}
						else if (String_StartsWith(damageTypeString, "frost ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::FrostDamage);
						}
						else if (String_StartsWith(damageTypeString, "fire ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::FireDamage);
						}
						else if (String_StartsWith(damageTypeString, "shadow ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::ShadowDamage);
						}
						else if (String_StartsWith(damageTypeString, "holy ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::HolyDamage);
						}
						else if (String_StartsWith(damageTypeString, "physical ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
						}
						else
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
						}
					}

					std::swap(resultCLE.m_Source, resultCLE.m_Target);
					//TODO SUPPORT RESISTED....
					//SUPPORT THIS EXAMPLE: Typoon suffers 375 Nature damage from High Priest Venoxis's Poison Cloud. (125 resisted)
				}
				else if (String_StartsWith(nextString, "miss ", &nextString) == true)
				{
					resultCLE.m_Ability = 47490;
					resultCLE.m_Action = static_cast<char>(Action::Missed);
					resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::None);
					resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
				}
				else if (String_StartsWith(nextString, "die.", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Dies);
				}
				else if (String_StartsWith(nextString, "absorb ", &nextString) == true)
				{
					int Choice = -1;
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{"'s ", "your "}, &nextString, &Choice));
					if (Choice == 1)
						resultCLE.m_Target = ProcessNameKey("PLAYER");
					resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);

					std::swap(resultCLE.m_Source, resultCLE.m_Target); // ?
					resultCLE.m_Action = static_cast<char>(Action::Missed);
					resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
				}
				else if (String_StartsWith(nextString, "fall and lose ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Falls);
					resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, " health.", &nextString));
				}
				else if (String_StartsWith(nextString, "are drowning and lose ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Drowning);
					resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, " health.", &nextString));
				}
				else if (String_StartsWith(nextString, "lose ", &nextString) == true)
				{
					int choice = -1;
					resultCLE.m_Action = static_cast<char>(Action::SwimmingInLava);
					resultCLE.m_Amount = std::stoi(String_SubStringUntilEither(nextString, std::array<const char*, 2>{" health for swimming in lava. (", " health for swimming in lava."}, &nextString, &choice));
					if (choice == 0)
					{
						resultCLE.m_Extra = std::stoi(String_SubStringUntil(nextString, " ", &nextString));

						if (String_StartsWith(nextString, "resisted", &nextString) == true) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
						else if (String_StartsWith(nextString, "absorbed", &nextString) == true) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
						else resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
					}
				}
				else if (String_StartsWith(nextString, "reflect ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Reflects);
					int untilChoice = -1;
					std::string type = String_SubStringUntilEither(nextString, std::array<const char*, 2>{"'s ", " to "}, &nextString, &untilChoice);
					if (untilChoice == 0)
					{
						resultCLE.m_Target = ProcessNameKey(type);
						resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
					}
					else
					{
						std::string reflectedDamage = type;
						const char* damageTypeString = nullptr;
						//std::cout << "Test 6" << std::endl;
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(reflectedDamage.c_str(), " ", &damageTypeString));
						if (String_StartsWith(damageTypeString, "Nature ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::NatureDamage);
						}
						else if (String_StartsWith(damageTypeString, "Arcane ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::ArcaneDamage);
						}
						else if (String_StartsWith(damageTypeString, "Frost ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::FrostDamage);
						}
						else if (String_StartsWith(damageTypeString, "Fire ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::FireDamage);
						}
						else if (String_StartsWith(damageTypeString, "Shadow ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::ShadowDamage);
						}
						else if (String_StartsWith(damageTypeString, "Holy ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::HolyDamage);
						}
						else if (String_StartsWith(damageTypeString, "Physical ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
						}
						else
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
						}
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
					}
				}
				else if (String_StartsWith(nextString, "attack. ", &nextString) == true)
				{
					resultCLE.m_Ability = 47490;
					resultCLE.m_Action = static_cast<char>(Action::Missed);
					resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);

					int untilStringUsed = -1;
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 5>{" dodge", " parry", " parries", " block", " absorb"}, &nextString, &untilStringUsed));
					if (untilStringUsed == 0) // " dodges" || " dodge"
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Dodged);
					}
					else if (untilStringUsed == 1 || untilStringUsed == 2) // " parry" || " parries"
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Parried);
					}
					else if (untilStringUsed == 3) // " blocks" || " block"
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Blocked);
					}
					else if (untilStringUsed == 4) // " absorbs" || " absorb"
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
					}
					else
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
					}
				}
				else if (String_StartsWith(nextString, "perform ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Cast);//Maybe should be called perform?
					int untilStringUsed = -1;
					resultCLE.m_Ability = GetAbility(String_SubStringUntilEither(nextString, std::array<const char*, 2>{".", " on "}, &nextString, &untilStringUsed), db);
					if (untilStringUsed == 0) // "."
					{
						//We are done
					}
					else // " on "
					{
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
					}
				}
				else if (String_StartsWith(nextString, "attack but ", &nextString) == true)
				{
					int untilStringUsed = -1;
					resultCLE.m_Ability = 47490;
					resultCLE.m_Action = static_cast<char>(Action::Missed);
					// you are immune sidecase
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{" is ", " are "}, &nextString, &untilStringUsed));
					if (String_StartsWith(nextString, "immune.") == true)
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Immune);
					}
					else
					{
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
					}
				}
				else if (String_StartsWith(nextString, "create ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Creates);
					resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
				}
				else if (String_StartsWith(nextString, "interrupt ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Interrupt);
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "'s ", &nextString));
					resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
				}
				else if (String_StartsWith(nextString, "resist ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Missed);
					resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{"'s ", " "}, &nextString));
					resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);

					std::swap(resultCLE.m_Source, resultCLE.m_Target);
				}
				else if (String_StartsWith(nextString, "resisted ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Missed);
					resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{"'s ", " "}, &nextString));
					resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);

					std::swap(resultCLE.m_Source, resultCLE.m_Target);
				}
				else if (String_StartsWith(nextString, "have been awarded ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Awarded);
					resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, " ", &nextString));
					std::string type = String_SubStringUntil(nextString, ".", &nextString);
					if (type == "honor points")
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::Honor);
					}
					else
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
						std::cout << "Unknown Amount Type: " << type << std::endl;
					}
				}
				else if (String_StartsWith(nextString, "reflect ", &nextString) == true)
				{
					resultCLE.m_Ability = 17107;
					resultCLE.m_Action = static_cast<char>(Action::Hit);
					std::string reflectedDamage = String_SubStringUntil(nextString, " to ", &nextString);
					const char* damageTypeString = nullptr;
					//std::cout << "Test 6" << std::endl;
					resultCLE.m_Amount = std::stoi(String_SubStringUntil(reflectedDamage.c_str(), " ", &damageTypeString));
					if (String_StartsWith(damageTypeString, "Nature ") == true)
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::NatureDamage);
					}
					else if (String_StartsWith(damageTypeString, "Arcane ") == true)
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::ArcaneDamage);
					}
					else if (String_StartsWith(damageTypeString, "Frost ") == true)
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::FrostDamage);
					}
					else if (String_StartsWith(damageTypeString, "Fire ") == true)
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::FireDamage);
					}
					else if (String_StartsWith(damageTypeString, "Shadow ") == true)
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::ShadowDamage);
					}
					else if (String_StartsWith(damageTypeString, "Holy ") == true)
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::HolyDamage);
					}
					else if (String_StartsWith(damageTypeString, "Physical ") == true)
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
					}
					else
					{
						resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
					}
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
				}
				else if (String_StartsWith(nextString, "are immune to ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Hit);
					resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Immune);
					resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "'s ", &nextString));
					resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
					std::swap(resultCLE.m_Source, resultCLE.m_Target);
				}
				else if (String_StartsWith(nextString, "are exhausted and lose ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Exhausted);
					resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, " health.", &nextString));
				}
				else if (String_StartsWith(nextString, "are drowning and lose ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Drowning);
					resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, " health.", &nextString));
				}
				else if (String_StartsWith(nextString, "are killed by ", &nextString) == true)
				{
					resultCLE.m_Action = static_cast<char>(Action::Dies);
					resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
				}
				else if (String_StartsWith(nextString, "fail to ", &nextString) == true)
				{
					// We dont track that!
					resultCLE.m_Action = static_cast<char>(Action::Failed); 
					String_SubStringUntil(nextString, ".", &nextString);
				}
				else
				{
					std::cout << "You sth missing!: " << std::string(nextString, 50) << std::endl;
				}
			}
			else
			{
				std::string currData = "";
				if (String_StartsWith(_String, "Your ", &nextString) == true)
					resultCLE.m_Source = ProcessNameKey("PLAYER");
				else
					currData = String_SubStringUntil(nextString, " ", &nextString, RPLL::String_SubStringUntilChoice::Include_UntilString);

				resultCLE.m_Ability = -1;
				std::string ability = "";
				while (true)
				{
					if (String_StartsWith(nextString, "hits ", &nextString) == true)
					{
						if (ability.empty())
							resultCLE.m_Ability = 47490;
						SetSourceOrAbility(resultCLE, currData, db, ability);
						ParseHitInfo(resultCLE, nextString);
						break;
					}
					else if (String_StartsWith(nextString, "crits ", &nextString) == true)
					{
						if (ability.empty())
							resultCLE.m_Ability = 47490;
						SetSourceOrAbility(resultCLE, currData, db, ability);
						ParseCritInfo(resultCLE, nextString);
						break;
					}
					else if (String_StartsWith(nextString, "critically heals ", &nextString) == true)
					{
						SetSourceOrAbility(resultCLE, currData, db, ability);
						ParseCritHealInfo(resultCLE, nextString);
						break;
					}
					else if (String_StartsWith(nextString, "heals ", &nextString) == true)
					{
						SetSourceOrAbility(resultCLE, currData, db, ability);
						ParseHealInfo(resultCLE, nextString);
						break;
					}
					else if (String_StartsWith(nextString, "casts ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Cast);
						std::string temp = String_SubStringUntil(nextString, ".", &nextString);
						if (temp.find(" on ") != std::string::npos)
						{
							const char* tcstr = temp.c_str();
							resultCLE.m_Ability = GetAbility(String_SubStringUntil(tcstr, " on ", &tcstr), db);
							if (temp.find(":") != std::string::npos)
							{
								resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(tcstr, ":", &tcstr));
							}
							else
							{
								resultCLE.m_Target = ProcessNameKey(tcstr);
							}
						}
						else
						{
							resultCLE.m_Ability = GetAbility(temp, db);
							resultCLE.m_Target = resultCLE.m_Source; // Player casts a totem or so
						}
						break;
					}
					else if (String_StartsWith(nextString, "misses ", &nextString) == true)
					{
						resultCLE.m_Ability = 47490;
						resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
						SetSourceOrAbility(resultCLE, currData, db, ability);
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::None);
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
						break;
					}
					else if (String_StartsWith(nextString, "missed ", &nextString) == true)
					{
						if (!ability.empty()) resultCLE.m_Ability = GetAbility(ability, db);
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::None);
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
						break;
					}
					else if (String_StartsWith(nextString, "is reflected back by ", &nextString) == true)
					{
						if (!ability.empty()) resultCLE.m_Ability = GetAbility(ability, db);
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Reflects);
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::None);
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
						break;
					}
					else if (String_StartsWith(nextString, "is parried by ", &nextString) == true)
					{
						if (!ability.empty()) resultCLE.m_Ability = GetAbility(ability, db);
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Parried);
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
						break;
					}
					else if (String_StartsWith(nextString, "is removed.", &nextString) == true)
					{
						if (!ability.empty()) resultCLE.m_Ability = GetAbility(ability, db);
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Removed);
						break;
					}
					else if (String_StartsWith(nextString, "interrupts ", &nextString) == true)
					{
						int untilStringUsed;
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Interrupt);
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{"'s ", "your "}, &nextString, &untilStringUsed));
						if (untilStringUsed == 1)
							resultCLE.m_Target = ProcessNameKey("PLAYER");
						resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
						break;
					}
					else if (String_StartsWith(nextString, "creates ", &nextString) == true)
					{
						SetSourceOrAbility(resultCLE, currData, db, ability);
						resultCLE.m_Action = static_cast<char>(Action::Creates);
						resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
						break;
					}
					else if (String_StartsWith(nextString, "attacks but ", &nextString) == true)
					{
						int untilStringUsed = -1;
						SetSourceOrAbility(resultCLE, currData, db, ability);
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
						// you are immune sidecase
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{" is ", " are "}, &nextString, &untilStringUsed));
						if (String_StartsWith(nextString, "immune.") == true)
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Immune);
						}
						else
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
						}
						break;
					}
					else if (String_StartsWith(nextString, "attacks. ", &nextString) == true)
					{
						resultCLE.m_Ability = 47490;
						SetSourceOrAbility(resultCLE, currData, db, ability);
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);

						int untilStringUsed = -1;
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 6>{" dodge", " parry", " parries", " block", " absorb", " resists"}, &nextString, &untilStringUsed));
						if (untilStringUsed == 0) // " dodges" || " dodge"
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Dodged);
						}
						else if (untilStringUsed == 1 || untilStringUsed == 2) // " parry" || " parries"
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Parried);
						}
						else if (untilStringUsed == 3) // " blocks" || " block"
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Blocked);
						}
						else if (untilStringUsed == 4) // " absorbs" || " absorb"
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
						}
						else if (untilStringUsed == 5) // TODO: PhatDabz attacks. Core Hound resists all the damage. (?!)
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
						}
						else
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
						}
						break;
					}
					else if (String_StartsWith(nextString, "dies.", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Dies);
						break;
					}
					// TODO: X dies, honorable kill Rank: First Sergant (Estimated Honor Points: 26)
					else if (String_StartsWith(nextString, "dies,", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Dies);
						String_StartsWith(nextString, ")", &nextString);
						break;
					}
					else if (String_StartsWith(nextString, "is destroyed.", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Destroyed);
						break;
					}
					else if (String_StartsWith(nextString, "is slain by ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Slain);
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "!", &nextString));
						break;
					}
					// TODO: X is killed by Divine Intervention.
					else if (String_StartsWith(nextString, "is killed by ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Killed);
						resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
						break;
					}
					else if (String_StartsWith(nextString, "is immune to ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Immune);
						int choice = -1;
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{"'s ", "your "}, &nextString, &choice));
						if (choice == 1)
							resultCLE.m_Target = ProcessNameKey("PLAYER");
						resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
						break;
					}
					else if (String_StartsWith(nextString, "resists ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
						int choice = -1;
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{"'s ", "your "}, &nextString, &choice));
						if (choice == 1)
							resultCLE.m_Target = ProcessNameKey("PLAYER");
						resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
						break;
					}
					else if (String_StartsWith(nextString, "falls and loses ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Falls);
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, " health.", &nextString));
						break;
					}
					else if (String_StartsWith(nextString, "reflects ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Ability = 17107;
						resultCLE.m_Action = static_cast<char>(Action::Hit);
						std::string reflectedDamage = String_SubStringUntil(nextString, " to ", &nextString);
						const char* damageTypeString = nullptr;
						//std::cout << "Test 6" << std::endl;
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(reflectedDamage.c_str(), " ", &damageTypeString));
						if (String_StartsWith(damageTypeString, "Nature ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::NatureDamage);
						}
						else if (String_StartsWith(damageTypeString, "Arcane ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::ArcaneDamage);
						}
						else if (String_StartsWith(damageTypeString, "Frost ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::FrostDamage);
						}
						else if (String_StartsWith(damageTypeString, "Fire ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::FireDamage);
						}
						else if (String_StartsWith(damageTypeString, "Shadow ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::ShadowDamage);
						}
						else if (String_StartsWith(damageTypeString, "Holy ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::HolyDamage);
						}
						else if (String_StartsWith(damageTypeString, "Physical ") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
						}
						else
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
						}
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
						break;
					}
					else if (String_StartsWith(nextString, "is afflicted by ", &nextString) == true)
					{
						int Choice = -1;
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::AfflictedBy);
						resultCLE.m_Ability = GetAbility(String_SubStringUntilEither(nextString, std::array<const char*, 2>{" (", "."}, &nextString, &Choice), db);
						//std::swap(resultCLE.m_Source, resultCLE.m_Target);
						break;
					}
					else if (String_StartsWith(nextString, "was deflected by ", &nextString) == true)
					{
						resultCLE.m_Ability = GetAbility(currData, db);
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Reflected);
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
						std::swap(resultCLE.m_Source, resultCLE.m_Target);
						break;
					}
					else if (String_StartsWith(nextString, "is drowning and loses ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(currData);
						resultCLE.m_Action = static_cast<char>(Action::Drowning);
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, " health.", &nextString));
						break;
					}
					else if (String_StartsWith(nextString, "suffers ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Suffers);

						int untilStringUsed = -1;
						std::string sufferedDamage = String_SubStringUntilEither(nextString, std::array<const char*, 2>{" from ", " points of "}, &nextString, &untilStringUsed);
						const char* damageTypeString = nullptr;
						//std::cout << "Test 7" << std::endl;
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(sufferedDamage.c_str(), " ", &damageTypeString));


						if (untilStringUsed == 0) //" from "
						{
							if (String_StartsWith(damageTypeString, "Nature ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::NatureDamage);
							}
							else if (String_StartsWith(damageTypeString, "Arcane ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::ArcaneDamage);
							}
							else if (String_StartsWith(damageTypeString, "Frost ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::FrostDamage);
							}
							else if (String_StartsWith(damageTypeString, "Fire ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::FireDamage);
							}
							else if (String_StartsWith(damageTypeString, "Shadow ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::ShadowDamage);
							}
							else if (String_StartsWith(damageTypeString, "Holy ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::HolyDamage);
							}
							else if (String_StartsWith(damageTypeString, "Physical ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
							}
							else
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
							}

							untilStringUsed = -1;
							currData = String_SubStringUntilEither(nextString, std::array<const char*, 3>{"'s ", "your ", "."}, &nextString, &untilStringUsed);
							if (untilStringUsed == 0) // "'s"
							{
								resultCLE.m_Target = ProcessNameKey(std::move(currData));
								resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".") + " (DoT)", db);
							}
							else if (untilStringUsed == 1) // "."
							{
								resultCLE.m_Target = ProcessNameKey("PLAYER");
								resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".") + " (DoT)", db);
							}
							else if (untilStringUsed == 2) // "."
							{
								resultCLE.m_Ability = GetAbility(currData + " (DoT)", db);
							}
						}
						else if (untilStringUsed == 1) //" points of "
						{
							if (String_StartsWith(nextString, "nature ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::NatureDamage);
							}
							else if (String_StartsWith(damageTypeString, "arcane ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::ArcaneDamage);
							}
							else if (String_StartsWith(damageTypeString, "frost ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::FrostDamage);
							}
							else if (String_StartsWith(damageTypeString, "fire ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::FireDamage);
							}
							else if (String_StartsWith(damageTypeString, "shadow ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::ShadowDamage);
							}
							else if (String_StartsWith(damageTypeString, "holy ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::HolyDamage);
							}
							else if (String_StartsWith(damageTypeString, "physical ") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
							}
							else
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
							}
						}

						std::swap(resultCLE.m_Source, resultCLE.m_Target);
						//TODO SUPPORT RESISTED....
						//SUPPORT THIS EXAMPLE: Typoon suffers 375 Nature damage from High Priest Venoxis's Poison Cloud. (125 resisted)
						break;
					}
					else if (String_StartsWith(nextString, "gains ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Gain);

						int untilStringUsed = -1;
						std::string resourceGained = String_SubStringUntilEither(nextString, std::array<const char*, 4>{" (", " from ", " through ", "."}, &nextString, &untilStringUsed);
						if (untilStringUsed == 0 || untilStringUsed == 3) // "."
						{
							//Means just gained a status like from an ability.
							resultCLE.m_Ability = GetAbility(resourceGained, db);
						}
						else if (untilStringUsed == 1) // " from "
						{
							//Means gained some resource, resourceGained is a value together with resource type(mana, rage, health, energy etc)
							const char* resourceTypeString = nullptr;
							//std::cout << "Test 8" << std::endl;
							resultCLE.m_Amount = std::stoi(String_SubStringUntil(resourceGained.c_str(), " ", &resourceTypeString));
							if (String_StartsWith(resourceTypeString, "Mana") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Mana);
							}
							else if (String_StartsWith(resourceTypeString, "health") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Health); //Not sure if this is even possible.
							}
							else if (String_StartsWith(resourceTypeString, "Rage") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Rage);
							}
							else if (String_StartsWith(resourceTypeString, "Energy") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Energy);
							}
							else if (String_StartsWith(resourceTypeString, "Focus") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Focus); //Not sure if this is even possible.
							}
							else if (String_StartsWith(resourceTypeString, "Happiness") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Happiness);
							}
							else
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
							}
							currData = String_SubStringUntilEither(nextString, std::array<const char*, 3>{"'s ", "your ", "."}, &nextString, &untilStringUsed);
							if (untilStringUsed == 0) // "'s "
							{
								resultCLE.m_Target = ProcessNameKey(std::move(currData));
								resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString) + " (HoT)", db);
							} 
							// TODO: your Renew
							else if(untilStringUsed == 1)
							{
								resultCLE.m_Target = ProcessNameKey("PLAYER");
								resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString) + " (HoT)", db);
							}
							else if(untilStringUsed == 2) // "."
							{
								resultCLE.m_Ability = GetAbility(currData + " (HoT)", db);
							}

							std::swap(resultCLE.m_Source, resultCLE.m_Target);
						}
						// TODO: Eowan gains 1 extra attack through Sword Specialization.
						else if(untilStringUsed == 2)
						{
							const char* resourceTypeString = nullptr;
							//std::cout << "Test 9" << std::endl;
							resultCLE.m_Amount = std::stoi(String_SubStringUntil(resourceGained.c_str(), " ", &resourceTypeString));
							if (String_StartsWith(resourceTypeString, "extra attack") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Attack);
							}
							currData = String_SubStringUntil(nextString, ".", &nextString);
							resultCLE.m_Ability = GetAbility(currData, db);
						}
						break;
					}
					else if (String_StartsWith(nextString, "fades from ", &nextString) == true)
					{
						if (String_EndsWith(currData, "'s ") == true)
							resultCLE.m_Ability = GetAbility(currData + " " + ability, db);
						else if (!currData.empty() && !ability.empty())
							resultCLE.m_Ability = GetAbility(currData + "'s " + ability, db);
						else
							resultCLE.m_Ability = GetAbility(currData, db);
						resultCLE.m_Action = static_cast<char>(Action::Fades);
						resultCLE.m_Source = ProcessNameKey(String_SubStringUntil(nextString, "."));
						break;
					}
					else if (String_StartsWith(nextString, "begins to cast ", &nextString) == true
						|| String_StartsWith(nextString, "begins to perform ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::BeginCast);
						resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, "."), db);
						break;
					}
					else if (String_StartsWith(nextString, "pet begins eating a ", &nextString) == true)
					{
						currData = currData.substr(0, currData.length() - 3);
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::PetBeginEats);
						//resultCLE.m_Ability = GetAbility(String_SubStringUntil(nextString, ".", &nextString), db);
						String_SubStringUntil(nextString, ".", &nextString);
						break;
					}
					else if (String_StartsWith(nextString, "performs ", &nextString) == true)
					{
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Cast);//Maybe should be called perform?
						int untilStringUsed = -1;
						resultCLE.m_Ability = GetAbility(String_SubStringUntilEither(nextString, std::array<const char*, 2>{".", " on "}, &nextString, &untilStringUsed), db);
						if (untilStringUsed == 0) // "."
						{
							//We are done
						}
						else // " on "
						{
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
						}
						break;
					}
					else if (String_StartsWith(nextString, "is absorbed by ", &nextString) == true)
					{
						SetSourceOrAbility(resultCLE, currData, db, ability);
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
						break;
					}
					else if (String_StartsWith(nextString, "failed. ", &nextString) == true || String_StartsWith(nextString, "fails. ", &nextString) == true)
					{
						SetSourceOrAbility(resultCLE, currData, db, ability);
						resultCLE.m_Action = static_cast<char>(Action::Missed);
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{" is ", " are "}, &nextString));
						std::string type = String_SubStringUntil(nextString, ".", &nextString);
						if (type == "immune")
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Immune);
						}
						else
						{
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
						}
						break;
					}
					else if (String_StartsWith(nextString, "loses ", &nextString) == true)
					{
						int choice = -1;
						resultCLE.m_Action = static_cast<char>(Action::SwimmingInLava);
						resultCLE.m_Amount = std::stoi(String_SubStringUntilEither(nextString, std::array<const char*, 3>{" health for swimming in lava. (", " health for swimming in lava.", "happiness"}, &nextString, &choice));
						if (choice == 0)
						{
							resultCLE.m_Extra = std::stoi(String_SubStringUntil(nextString, " ", &nextString));

							if (String_StartsWith(nextString, "resisted", &nextString) == true) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
							else if (String_StartsWith(nextString, "absorbed", &nextString) == true) resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
							else resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
						}
						else if (choice == 2) // happiness
						{
							resultCLE.m_Action = static_cast<char>(Action::PetLocality);
							String_SubStringUntil(nextString, ".", &nextString);
						}
						break;
					}
					else if (String_StartsWith(nextString, "pet's loyalty has increased.", &nextString) == true)
					{
						// Do nothing
						resultCLE.m_Action = static_cast<char>(Action::PetLocality);
						break;
					}
					else if (String_StartsWith(nextString, "is dismissed.", &nextString) == true)
					{
						// Do nothing
						resultCLE.m_Action = static_cast<char>(Action::PetLocality);
						break;
					}
					else if (String_StartsWith(nextString, "pet begins eating the ", &nextString) == true)
					{
						// Do nothing
						resultCLE.m_Action = static_cast<char>(Action::PetLocality); // Not really that but owell
						String_SubStringUntil(nextString, ".", &nextString);
						break;
					}
					else if (String_StartsWith(nextString, "equipped items suffer a ", &nextString) == true)
					{
						// Do nothing
						resultCLE.m_Action = static_cast<char>(Action::Durability);
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, "%", &nextString));
						String_SubStringUntil(nextString, ".", &nextString);
						break;
					}
					else if (String_StartsWith(nextString, "reputation has increased by ", &nextString) == true)
					{
						// Do nothing
						resultCLE.m_Target = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Reputation);
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(nextString, ".", &nextString));
						break;
					}
					// Player variant!
					else if (String_StartsWith(nextString, "drains ", &nextString) == true)
					{
						if (!ability.empty()) resultCLE.m_Ability = GetAbility(ability, db);
						resultCLE.m_Source = ProcessNameKey(std::move(currData));
						resultCLE.m_Action = static_cast<char>(Action::Drain);

						std::string drainedResource = String_SubStringUntil(nextString, " from ", &nextString);
						const char* resourceTypeString = nullptr;
						//std::cout << "Test 10" << std::endl;
						resultCLE.m_Amount = std::stoi(String_SubStringUntil(drainedResource.c_str(), " ", &resourceTypeString));
						if (String_StartsWith(resourceTypeString, "Mana") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Mana);
						}
						else if (String_StartsWith(resourceTypeString, "Health") == true)
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Health);
						}
						else
						{
							resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
						}
						resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
						break;
					}
					else if (ability != "")
					{
						if (String_StartsWith(nextString, "was ", &nextString) == true)
						{
							if (String_StartsWith(nextString, "dodged by ", &nextString) == true)
							{
								resultCLE.m_Ability = GetAbility(ability, db);
								resultCLE.m_Source = ProcessNameKey(std::move(currData));
								resultCLE.m_Action = static_cast<char>(Action::Missed);
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Dodged);
								resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
								break;
							}
							else if (String_StartsWith(nextString, "resisted by ", &nextString) == true)
							{
								resultCLE.m_Ability = GetAbility(ability, db);
								resultCLE.m_Source = ProcessNameKey(std::move(currData));
								resultCLE.m_Action = static_cast<char>(Action::Missed);
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
								resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
								break;
							}
							else if (String_StartsWith(nextString, "parried by ", &nextString) == true)
							{
								resultCLE.m_Ability = GetAbility(ability, db);
								resultCLE.m_Source = ProcessNameKey(std::move(currData));
								resultCLE.m_Action = static_cast<char>(Action::Missed);
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Parried);
								resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
								break;
							}
							else if (String_StartsWith(nextString, "blocked by ", &nextString) == true)
							{
								resultCLE.m_Ability = GetAbility(ability, db);
								resultCLE.m_Source = ProcessNameKey(std::move(currData));
								resultCLE.m_Action = static_cast<char>(Action::Missed);
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Blocked);
								resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
								break;
							}
							else if (String_StartsWith(nextString, "evaded by ", &nextString) == true)
							{
								resultCLE.m_Ability = GetAbility(ability, db);
								resultCLE.m_Source = ProcessNameKey(std::move(currData));
								resultCLE.m_Action = static_cast<char>(Action::Missed);
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Evaded);
								resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
								break;
							}
							else if (String_StartsWith(nextString, "dodged.", &nextString) == true)
							{
								resultCLE.m_Ability = GetAbility(ability, db);
								resultCLE.m_Source = ProcessNameKey(std::move(currData));
								resultCLE.m_Action = static_cast<char>(Action::Missed);
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Dodged);
								resultCLE.m_Target = ProcessNameKey("PLAYER");
								break;
							}
							else if (String_StartsWith(nextString, "parried.", &nextString) == true)
							{
								resultCLE.m_Ability = GetAbility(ability, db);
								resultCLE.m_Source = ProcessNameKey(std::move(currData));
								resultCLE.m_Action = static_cast<char>(Action::Missed);
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Parried);
								resultCLE.m_Target = ProcessNameKey("PLAYER");
								break;
							}
							else if (String_StartsWith(nextString, "resisted.", &nextString) == true)
							{
								resultCLE.m_Ability = GetAbility(ability, db);
								resultCLE.m_Source = ProcessNameKey(std::move(currData));
								resultCLE.m_Action = static_cast<char>(Action::Missed);
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
								resultCLE.m_Target = ProcessNameKey("PLAYER");
								break;
							}
							else if (String_StartsWith(nextString, "evaded.", &nextString) == true)
							{
								resultCLE.m_Ability = GetAbility(ability, db);
								resultCLE.m_Source = ProcessNameKey(std::move(currData));
								resultCLE.m_Action = static_cast<char>(Action::Missed);
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Evaded);
								resultCLE.m_Target = ProcessNameKey("PLAYER");
								break;
							}
						}
						else if (String_StartsWith(nextString, "is removed.", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(ability, db);
							resultCLE.m_Source = ProcessNameKey(std::move(currData));
							resultCLE.m_Action = static_cast<char>(Action::Removed);
							break;
						}
						else if (String_StartsWith(nextString, "is absorbed by ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(ability, db);
							resultCLE.m_Source = ProcessNameKey(std::move(currData));
							resultCLE.m_Action = static_cast<char>(Action::Missed);
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
							break;
						}
						else if (String_StartsWith(nextString, "heals ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(ability, db);
							resultCLE.m_Source = ProcessNameKey(std::move(currData));
							ParseHealInfo(resultCLE, nextString);
							break;
						}
						else if (String_StartsWith(nextString, "critically heals ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(ability, db);
							resultCLE.m_Source = ProcessNameKey(std::move(currData));
							ParseCritHealInfo(resultCLE, nextString);
							break;
						}
						// TODO this is actually also a heal sometimes!
						else if (String_StartsWith(nextString, "drains ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(ability, db);
							resultCLE.m_Source = ProcessNameKey(std::move(currData));
							resultCLE.m_Action = static_cast<char>(Action::Drain);

							std::string drainedResource = String_SubStringUntil(nextString, " from ", &nextString);
							const char* resourceTypeString = nullptr;
							//std::cout << "Test 10" << std::endl;
							resultCLE.m_Amount = std::stoi(String_SubStringUntil(drainedResource.c_str(), " ", &resourceTypeString));
							if (String_StartsWith(resourceTypeString, "Mana") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Mana);
							}
							else if (String_StartsWith(resourceTypeString, "Health") == true)
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Health);
							}
							else
							{
								resultCLE.m_AmountType = static_cast<char>(AmountType::Unknown);
							}
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
							break;
						}
						else if (String_StartsWith(nextString, "missed ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(ability, db);
							resultCLE.m_Source = ProcessNameKey(std::move(currData));
							resultCLE.m_Action = static_cast<char>(Action::Missed);
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::None);
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
							break;
						}
						else if (String_StartsWith(nextString, "fails. ", &nextString) == true
							|| String_StartsWith(nextString, "failed. ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(ability, db);
							resultCLE.m_Source = ProcessNameKey(std::move(currData));
							resultCLE.m_Action = static_cast<char>(Action::Failed);
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntilEither(nextString, std::array<const char*, 2>{" are ", " is "}));
							if (String_StartsWith(nextString, "immune") == true)
							{
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Immune);
							}
							else
							{
								resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
							}
							break;
						}
						else
						{
							//Keep building the ability name
							// Problem is now that the string will containt " " at the end
							int subStringResultNr = 0;
							ability += String_SubStringUntilEither(nextString, std::array<const char*, 3>{" ", "  ", "\n"}, &nextString, &subStringResultNr, String_SubStringUntilChoice::Include_UntilString);
							
							if (subStringResultNr >= 1)
							{
								if (_ResultParsingError != nullptr) *_ResultParsingError = "Error1";
								break;//If newline then we stop parsing the line. Something has most likely gone wrong!
							}
						}
					}
					else if (resultCLE.m_Source == ProcessNameKey("PLAYER") && String_StartsWith(nextString, "was ", &nextString) == true)
					{
						if (String_StartsWith(nextString, "dodged by ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(currData, db);
							resultCLE.m_Action = static_cast<char>(Action::Missed);
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Dodged);
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
							break;
						}
						else if (String_StartsWith(nextString, "resisted by ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(currData, db);
							resultCLE.m_Action = static_cast<char>(Action::Missed);
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, "."));
							break;
						}
						else if (String_StartsWith(nextString, "parried by ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(currData, db);
							resultCLE.m_Action = static_cast<char>(Action::Missed);
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Parried);
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
							break;
						}
						else if (String_StartsWith(nextString, "blocked by ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(currData, db);
							resultCLE.m_Action = static_cast<char>(Action::Missed);
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Blocked);
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
							break;
						}
						else if (String_StartsWith(nextString, "evaded by ", &nextString) == true)
						{
							resultCLE.m_Ability = GetAbility(currData, db);
							resultCLE.m_Action = static_cast<char>(Action::Missed);
							resultCLE.m_ExtraModifier = static_cast<char>(ExtraModifier::Evaded);
							resultCLE.m_Target = ProcessNameKey(String_SubStringUntil(nextString, ".", &nextString));
							break;
						}
						else
						{
							std::cout << std::string(nextString, 50) << std::endl;
							break;
						}
					}
					else
					{
						if (String_EndsWith(currData, "'s ") == true)
						{
							int subStringResultNr = 0;
							std::string temp = String_SubStringUntilEither(nextString, std::array<const char*, 3>{" ", "  ", "\n"}, &nextString, &subStringResultNr, String_SubStringUntilChoice::Include_UntilString);
							if (mDifficultNpcs[currData+temp])
							{
								currData += temp;
							}
							else
							{
								currData = currData.substr(0, currData.length() - 3);
								//Actually the next part is the ability name!
								ability += temp;
							}
							
							if (subStringResultNr >= 1)
							{
								if (_ResultParsingError != nullptr) *_ResultParsingError = "Error2";
								break;//If newline then we stop parsing the line. Something has most likely gone wrong!
							}
						}
						else
						{
							//The name of the unit is probably multi word, so test with that!
							int subStringResultNr = 0;
							// Thats why / is not a viable character
							// 1/3 18:32:46.608  Immune Fear/Polymorph/Snare fades from Maidros.
							currData += String_SubStringUntilEither(nextString, std::array<const char*, 3>{" ", "  ", "\n"}, &nextString, &subStringResultNr, String_SubStringUntilChoice::Include_UntilString);
							
							if (subStringResultNr >= 1)
							{
								if (_ResultParsingError != nullptr) *_ResultParsingError = "Error3";
								break;//If newline then we stop parsing the line. Something has most likely gone wrong!
							}
						}
					}

					// FAIL CHECK
					if (currData.size() >= 100)
					{
						std::cout << "Some line wasnt parsed correctly at all! Curr Data kept growing!" << std::endl;
						String_SubStringUntil(nextString, ".", &nextString);
						break;
					}
				}
			}

			if (_ResultStringEnd != nullptr) *_ResultStringEnd = nextString;
			return resultCLE;
		}
		
		int GetAbility(std::string ab, DatabaseAccess& db)
		{
			if (ab.size() > 150 || ab.find("/") != std::string::npos)
				return -1; // Immune Poly/Root/Stun exists :/
			if (ab.back() == 32) ab.pop_back();
			return db.GetAbilityID(ab, true);
		}
		void SetSourceOrAbility(CombatLogEvent& _CombatLogEvent, std::string& currData, DatabaseAccess& db, std::string& ability)
		{
			if (_CombatLogEvent.m_Source == ProcessNameKey("PLAYER"))
			{
				_CombatLogEvent.m_Ability = GetAbility(currData, db);
				//_CombatLogEvent.m_Ability = std::move(currData);
			}
			else
			{
				if (!ability.empty()) _CombatLogEvent.m_Ability = GetAbility(ability, db);
				_CombatLogEvent.m_Source = ProcessNameKey(std::move(currData));
			}
		}
		void ParseCritInfo(CombatLogEvent& _CombatLogEvent, const char* _String)
		{
			_CombatLogEvent.m_Action = static_cast<char>(Action::Crit);
			ParseActionInfo(_CombatLogEvent, _String);
		}
		void ParseHitInfo(CombatLogEvent& _CombatLogEvent, const char* _String)
		{
			_CombatLogEvent.m_Action = static_cast<char>(Action::Hit);
			ParseActionInfo(_CombatLogEvent, _String);
		}
		void ParseHealInfo(CombatLogEvent& _CombatLogEvent, const char* _String)
		{
			_CombatLogEvent.m_Action = static_cast<char>(Action::Heal);
			ParseActionInfo(_CombatLogEvent, _String);
		}
		void ParseCritHealInfo(CombatLogEvent& _CombatLogEvent, const char* _String)
		{
			_CombatLogEvent.m_Action = static_cast<char>(Action::CritHeal);
			ParseActionInfo(_CombatLogEvent, _String);
		}
		void ParseActionInfo(CombatLogEvent& _CombatLogEvent, const char* _String)
		{
			const char* nextString = nullptr;
			_CombatLogEvent.m_Target = ProcessNameKey(String_SubStringUntil(_String, " for ", &nextString));
			int untilStringUsed = -1;
			//std::cout << "Test 11" << std::endl;
			_CombatLogEvent.m_Amount = std::stoi(String_SubStringUntilEither(nextString, std::array<const char*, 2>{ ".", " " }, &nextString, &untilStringUsed));
			if (untilStringUsed == 1) // " "
			{
				//Means there was more data to the amount info
				std::string amountTypeStr = String_SubStringUntil(nextString, ".", &nextString);
				if (String_StartsWith(amountTypeStr.c_str(), "Nature ") == true)
				{
					_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::NatureDamage);
				}
				else if (String_StartsWith(amountTypeStr.c_str(), "Arcane ") == true)
				{
					_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::ArcaneDamage);
				}
				else if (String_StartsWith(amountTypeStr.c_str(), "Frost ") == true)
				{
					_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::FrostDamage);
				}
				else if (String_StartsWith(amountTypeStr.c_str(), "Fire ") == true)
				{
					_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::FireDamage);
				}
				else if (String_StartsWith(amountTypeStr.c_str(), "Shadow ") == true)
				{
					_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::ShadowDamage);
				}
				else if (String_StartsWith(amountTypeStr.c_str(), "Holy ") == true)
				{
					_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::HolyDamage);
				}
				else if (String_StartsWith(amountTypeStr.c_str(), "Physical ") == true)
				{
					_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
				}
				else
				{
					_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
					/*if (_CombatLogEvent.m_Ability == "AutoAttack")
						_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
					else
						_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::Unknown);*/
				}
			}
			else
			{
				_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
				/*if (_CombatLogEvent.m_Ability == "AutoAttack")
				_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::PhysicalDamage);
				else
				_CombatLogEvent.m_AmountType = static_cast<char>(AmountType::Unknown);*/
			}
			if (String_StartsWith(nextString, " (", &nextString) == true)
			{
				if (String_StartsWith(nextString, "glancing)") == true)
				{
					_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Glancing);
				}
				else if (String_StartsWith(nextString, "crushing)") == true)
				{
					_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Crushing);
				}
				else
				{
					//std::cout << "Test 12" << std::endl;
					_CombatLogEvent.m_Extra = std::stoi(String_SubStringUntilEither(nextString, std::array<const char*, 2>{ ")", " " }, &nextString, &untilStringUsed));
					if (untilStringUsed == 1) // " "
					{
						if (String_StartsWith(nextString, "resisted") == true)
						{
							_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
						}
						else if (String_StartsWith(nextString, "blocked") == true)
						{
							_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Blocked);
						}
						else if (String_StartsWith(nextString, "absorbed") == true)
						{
							_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
						}
						else
						{
							_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
						}
					}
					else
					{
						//This should never occur, this means m_Extra was parsed as an int when it probably is not...
						assert(!"This should never occur, this means m_Extra was parsed as an int when it probably is not...");
					}
				}
			}

			// It can basically happen twice!
			// It currently just overwrites the type but adds the amount :/
			// need to solve that differently!
			if (String_StartsWith(nextString, " (", &nextString) == true)
			{
				if (String_StartsWith(nextString, "glancing)") == true)
				{
					_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Glancing);
				}
				else if (String_StartsWith(nextString, "crushing)") == true)
				{
					_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Crushing);
				}
				else
				{
					_CombatLogEvent.m_Extra += std::stoi(String_SubStringUntilEither(nextString, std::array<const char*, 2>{ ")", " " }, &nextString, &untilStringUsed));
					if (untilStringUsed == 1) // " "
					{
						if (String_StartsWith(nextString, "resisted") == true)
						{
							_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Resisted);
						}
						else if (String_StartsWith(nextString, "blocked") == true)
						{
							_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Blocked);
						}
						else if (String_StartsWith(nextString, "absorbed") == true)
						{
							_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Absorbed);
						}
						else
						{
							_CombatLogEvent.m_ExtraModifier = static_cast<char>(ExtraModifier::Unknown);
						}
					}
					else
					{
						//This should never occur, this means m_Extra was parsed as an int when it probably is not...
						assert(!"This should never occur, this means m_Extra was parsed as an int when it probably is not...");
					}
				}
			}
		}
	};
}
