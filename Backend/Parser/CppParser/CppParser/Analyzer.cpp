#include "Analyzer.h"

namespace RPLL
{
	std::map<std::string, bool> Analyzer::m_InterruptAbilities = {
		//Rogue
		{"Kick", true},
		//Warrior
		{"Pummel", true },
		{ "Shield Bash", true},

		//Mage
		{ "Counterspell", true},
		{ "Counterspell - Silenced", true},

		//Shaman
		{ "Earth Shock", true},

		//Priest
		{ "Silence", true},

		//Stuns
		// Rogue
		{ "Gouge", true},

		//Warlock
		{ "Death Coil", true},
	};

	std::map<std::string, bool> Analyzer::m_StunInterruptAbilities = {
		//Stuns
		// Rogue
		{"Kidney Shot",true},
		{"Cheap Shot",true},

		//Hunter
		{"Scatter Shot",true},
		{"Improved Concussive Shot",true},
		{"Wyvern Sting",true},
		{"Intimidation",true},

		//Warrior
		{"Charge Stun",true},
		{"Intercept Stun",true},
		{"Concussion Blow",true},

		//Druid
		{"Feral Charge",true},
		{"Feral Charge Effect",true},
		{"Bash",true},
		{"Pounce",true},

		//Mage
		{"Impact",true},

		//Paladin
		{"Repentance",true},
		{"Hammer of Justice",true},

		//Warlock
		{"Pyroclasm",true},

		//Priest
		{"Blackout",true},

		//General
		{"Tidal Charm",true},
		{"Reckless Charge",true},
	};

	std::map<std::string, bool> Analyzer::m_DirectDispels = {
		{"Remove Curse",true},
		{"Cleanse",true},
		{"Remove Lesser Curse",true},
		{"Purify",true},
		{"Dispel Magic",true},
		{"Devour Magic",true},
		{"Cure Disease",true},
		{"Cure Poison",true},
		{"Purge",true},
		{"Powerful Anti-Venom",true},
		{"Purification",true},
		{"Purification Potion",true},
	};

	std::map<std::string, bool> Analyzer::m_InDirectDispels = {
		{"Abolish Poison",true},
		{"Poison Cleansing Totem",true},
		{"Abolish Disease",true},
		{"Disease Cleansing Totem",true},
		{"Restauration Potion",true},
		{"Restauration",true},
		{"Restorative Potion",true},
	};

	// Values outputted from an Mangos Server
	std::map<int, int> Analyzer::m_ThreatTable = {
		{11596,261}, // Sunder Armor
		{11566,145}, // Heoric Strike Rank 8 => 145, Rank 9 => 175
		{25288,315}, // Revenge Rank 5 => 315, Rank 6 => 355
		{23922,250}, // Shield Slam
		{11581,180}, // Thunder Clap / #Targets
		{11555,43}, // Demo Shout / #Targets
		{11550,60}, // Battle Shout / #Targets
		{11608,100}, // Cleave / #Targets
		{ 7372,141 }, // Hamstring
		{ 1671,180 }, // Shield Bash
		{20928, 40}, // Holy Shield 10 per tick => 4 ticks
		{9880, 207}, // Maul Druid
		{16857, 108}, // Faeri Fire (Feral) => Hard to track casts!
		{9747, 42}, // Demo Roar / #Targets
	};

	Analyzer::Analyzer(const char* _Armory, const char* _CBTLog, const int _Uploader, DatabaseAccess& DBAccess, ArmoryProcessor* _Processor)
	{
		//DatabaseAccess& DBAccess = DatabaseAccess::GetInstance();
		m_DB = DBAccess.GetConnector();
		auto queryProgress = m_DB->ExecuteStreamStatement("UPDATE rs_progress SET progress=:a<int> WHERE uploaderid=:b<int>", 1, true);
		int queryProgressValue = 0;

		m_ArmoryData = FetchArmoryData(_Armory, _Uploader, DBAccess, false, _Processor);
		if (m_ArmoryData->m_UnitData.empty() || m_ArmoryData->m_Parser->m_sessions.empty())
		{
			std::cout << "Unitdata or sessions are empty!" << std::endl;
			remove(_Armory);
			remove(_CBTLog);
			return;
		}

		m_CBTLogParser = new CombatlogParser; // Guess this could be made singleton
		std::string textData = RPLL::File_ReadAllText(_CBTLog);
		m_CombatLogEvents = (m_CBTLogParser->Parse(textData.c_str(), static_cast<int>(textData.length()), DBAccess));
		if (m_CombatLogEvents.empty() || m_CombatLogEvents.front().empty()) {
			std::cout << "Combatlog events are empty!" << std::endl;
			remove(_Armory);
			remove(_CBTLog);
			return; // Empty log?
		}

			
		int dbgEvents = 0;
		for (auto& sess : m_CombatLogEvents)
			dbgEvents += static_cast<int>(sess.size());
		std::cout << "Found " << dbgEvents << " events! " << std::endl;

		int RealmId = DBAccess.GetRealmID(m_ArmoryData->m_Parser->m_sessions[0][0].mS_Param[0], RPLL::WowVersion::Vanilla);
		int unknownPlayer = 300000 + RealmId - 1;

		
		// Who is the player
		for (auto& player : m_ArmoryData->m_Parser->m_playerdata)
		{
			if (player.size() > 0)
				m_PlayerNamesBySession.push_back(player[0]._name);
		}
		
		std::vector<std::pair<std::string, std::pair<__int64, __int64>>> timeFrameToPlayer;
		int SessCount = 0;
		for (auto sess = m_ArmoryData->m_Parser->m_sessions.rbegin(); sess != m_ArmoryData->m_Parser->m_sessions.rend(); ++sess)
		{
			int rlSc = static_cast<int>(m_ArmoryData->m_Parser->m_sessions.size()) - 1 - SessCount;
			if (m_ArmoryData->m_Parser->m_playerdata[rlSc].size() > 0)
				timeFrameToPlayer.push_back(std::make_pair(m_ArmoryData->m_Parser->m_playerdata[rlSc][0]._name, std::make_pair(m_ArmoryData->m_Parser->m_RealTime[rlSc] + sess->front().m_TimeStamp, m_ArmoryData->m_Parser->m_RealTime[rlSc] + sess->back().m_TimeStamp)));
			SessCount++;
		}
		
		int smcount = 0;
		int NewSessCount = 0;
		short curPlayerName = m_CBTLogParser->ProcessNameKey(timeFrameToPlayer[0].first);
		__int64 curPlayerNameTime = timeFrameToPlayer[0].second.second;
		for (auto cbtSess = m_CombatLogEvents.begin(); cbtSess != m_CombatLogEvents.end(); ++cbtSess)
		{
			int player = m_CBTLogParser->ProcessNameKey("PLAYER");
			int you = m_CBTLogParser->ProcessNameKey("You");
			int you2 = m_CBTLogParser->ProcessNameKey("you");
			int your = m_CBTLogParser->ProcessNameKey("Your");
			int your2 = m_CBTLogParser->ProcessNameKey("your");
			for (auto& cbtLogEvent : *cbtSess)
			{
				++smcount;
				if (m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] + cbtLogEvent.m_Timestamp > curPlayerNameTime && NewSessCount + 1 < timeFrameToPlayer.size())
				{
					++NewSessCount;
					curPlayerName = m_CBTLogParser->ProcessNameKey(timeFrameToPlayer[NewSessCount].first);
					curPlayerNameTime = timeFrameToPlayer[NewSessCount].second.second;
				}

				if (cbtLogEvent.m_Source == player || cbtLogEvent.m_Source == you || cbtLogEvent.m_Source == your || cbtLogEvent.m_Source == you2 || cbtLogEvent.m_Source == your2)
				{
					cbtLogEvent.m_Source = curPlayerName;
				}
				if (cbtLogEvent.m_Target == player || cbtLogEvent.m_Target == you || cbtLogEvent.m_Target == your || cbtLogEvent.m_Target == you2 || cbtLogEvent.m_Target == your2)
				{
					cbtLogEvent.m_Target = curPlayerName;
				}
			}
		}

		short curChainHealTick = 1;
		short curChainHealSource = -1;
		int curChainHealTime = 0;
		for (auto cbtSess = m_CombatLogEvents.begin(); cbtSess != m_CombatLogEvents.end(); ++cbtSess)
		{
			for (auto& cbtLogEvent : *cbtSess)
			{
				if (cbtLogEvent.m_Ability != 10622)
				{
					curChainHealTick = 1;
					continue;
				}
				if (curChainHealSource != cbtLogEvent.m_Source || curChainHealTime - 10 >= cbtLogEvent.m_Timestamp || curChainHealTick > 3)
				{
					curChainHealTick = 1;
					curChainHealSource = cbtLogEvent.m_Source;
					curChainHealTime = cbtLogEvent.m_Timestamp;
				}

				if (curChainHealTick == 2) cbtLogEvent.m_Ability = 105651;
				else if (curChainHealTick == 3) cbtLogEvent.m_Ability = 105652;
				++curChainHealTick;
			}
		}

		int timezone = GetTimeDifference(m_ArmoryData->m_Parser->m_sessions.begin()->begin()->mI_Param[2], m_ArmoryData->m_Parser->m_sessions.back()[0].mI_Param[0], m_ArmoryData->m_Parser->m_sessions.back()[0].mI_Param[1], m_ArmoryData->m_Parser->m_RealTime.back(), m_CombatLogEvents);
		AdjustTimeZone(timezone, m_ArmoryData->m_Parser->m_sessions, m_ArmoryData->m_UnitData);
		std::cout << "Timedifference: " << timezone << " hours " << std::endl;

		/*
		 *
		 * Specs can be spotted this way:
		 * Warrior:
		 * - Arms: Sweeping Strikes and Mortal Strike
		 * - Fury: Bloodthirst & No Shield Spec
		 * - Tank: Shield Specialization
		 * 
		 * Rogue:
		 * - Assasination: Cold Blood
		 * - Combat: Blade Flurry / Adrenaline Rush
		 * - Subtlety: Preperation / Premeditation
		 * 
		 * Priest: 
		 * - Disci: Inner Focus (Also Holy skill this :/)
		 * - Holy: Spirit of Redemption 
		 * - Shadow: Shadowform
		 * 
		 * Hunter:
		 * - BM: Bestial Wrath (Aura of Pet tho)
		 * - MM: Scatter Shot (Dmg) => Hard to tell MM Hunter
		 * - Survival: Deterrence
		 * 
		 * Druid:
		 * - Balance: Moonkin Form
		 * - Feral: Shred / Maul (Bind weakly)
		 * - Resto: Swiftmend / Nature's Swiftness
		 * 
		 * Mage:
		 * - Arcane: Arcane Power
		 * - Fire: Combustion
		 * - Frost: Ice Barrier / Ice Block
		 * 
		 * Warlock:
		 * - Affli: Siphon Life
		 * - Demo: Soul Link
		 * - Destro: Conflagrate
		 * 
		 * Paladin:
		 * - Holy: Holy Shock / Illumination
		 * - Prot: Holy Shield
		 * - Ret: Vengeance
		 * 
		 * Shaman:
		 * - Ele: Elemental Mastery
		 * - Ehance: Stormstrike
		 * - Resto: Nature's Swiftness
		 * 
		 */
		std::map<int, int> playerSpec;
		auto talentsQuery = m_DB->ExecuteStreamStatement("SELECT c.talents FROM rpll.gn_chars a JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_misc c ON b.ref_misc = c.id WHERE a.id=:a<int>", 1);
		// For each player determine its spec
		for (auto player : m_ArmoryData->m_UnitData)
		{
			int srcId = player.second.m_ID;

			for (auto& CBTLogVec : m_CombatLogEvents)
			{
				for (auto& cbtLogEvent : CBTLogVec)
				{
					if (m_CBTLogParser->mNameValues[cbtLogEvent.m_Source] != player.first) continue;
					
					if (player.second.m_Class == 0) // Warrior
					{
						if (cbtLogEvent.m_Ability == 105093 || cbtLogEvent.m_Ability == 105541) // Shield Spec
						{
							playerSpec[srcId] = 3; // Tank
							break;
						}
						else if (cbtLogEvent.m_Ability == 23892 && playerSpec[srcId] == 0) // Bloodthirst
						{
							playerSpec[srcId] = 2; // Fury
						}
						else if (cbtLogEvent.m_Ability == 12723 || cbtLogEvent.m_Ability == 21551) // Sweeping or Mortal Strike
						{
							playerSpec[srcId] = 1; // Arms
						}
					}
					else if (player.second.m_Class == 1) // Rogue
					{
						if (cbtLogEvent.m_Ability == 14177) // Cold Blood
						{
							playerSpec[srcId] = 4;// Assa
							break;
						}
						else if (cbtLogEvent.m_Ability == 13877 || cbtLogEvent.m_Ability == 13750) // Blade Fury or Adrenaline Rush
						{
							playerSpec[srcId] = 5;// Combat
							break;
						}
						else if (cbtLogEvent.m_Ability == 106863 || cbtLogEvent.m_Ability == 14183)
						{
							playerSpec[srcId] = 6; // Subtlety
							break;
						}
					}
					else if (player.second.m_Class == 2) // Priest
					{
						if (cbtLogEvent.m_Ability == 14751) // Inner Focus 
						{
							playerSpec[srcId] = 7; // Disci
						}
						else if (cbtLogEvent.m_Ability == 105701 || cbtLogEvent.m_Ability == 106060) // Lightwell
						{
							playerSpec[srcId] = 8; // Holy
						}
						else if (cbtLogEvent.m_Ability == 15473) // Shadowform
						{
							playerSpec[srcId] = 9; // Shadow
							break;
						}
					}
					else if (player.second.m_Class == 3) // Hunter // TODO
					{
						if (cbtLogEvent.m_Ability == 19574) 
						{
							if (player.second.m_Owner > 0)
								srcId = player.second.m_Owner;
							playerSpec[srcId] = 10; // BM
							break;
						}
						else if (cbtLogEvent.m_Ability == 19503) // Scatter Shot
						{
							playerSpec[srcId] = 11; // MM
							break;
						}
						else if (cbtLogEvent.m_Ability == 19263) // Deterrence
						{
							playerSpec[srcId] = 12; // Survival
							break;
						}
					}
					else if (player.second.m_Class == 4) // Druid
					{
						if (cbtLogEvent.m_Ability == 24858) // Moonkin Form
						{
							playerSpec[srcId] = 13; // Balance
							break;
						}
						else if (cbtLogEvent.m_Ability == 9829 || cbtLogEvent.m_Ability == 9880) // Shred or Maul
						{
							playerSpec[srcId] = 14; // Feral
						}
						else if (cbtLogEvent.m_Ability == 18562 || cbtLogEvent.m_Ability == 29274) // Swiftmend or Natures Swiftness
						{
							playerSpec[srcId] = 15; // Resto
							break;
						}
					}
					else if (player.second.m_Class == 5) // Mage
					{
						if (cbtLogEvent.m_Ability == 12042) // Arcane Power
						{
							playerSpec[srcId] = 16; // Arcane
							break;
						}
						else if (cbtLogEvent.m_Ability == 11129) // Combustion
						{
							playerSpec[srcId] = 17; // Fire
							break;
						}
						else if (cbtLogEvent.m_Ability == 11958 || cbtLogEvent.m_Ability == 11426) // Ice Block or Ice Barrier
						{
							playerSpec[srcId] = 18; // Frost
							break;
						}
					}
					else if (player.second.m_Class == 6) // Warlock
					{
						if (cbtLogEvent.m_Ability == 18265 || cbtLogEvent.m_Ability == 107618) // Siphon Life or Nightfall
						{
							playerSpec[srcId] = 19; // Affli
						}
						else if (cbtLogEvent.m_Ability == 19028) // Soul Link
						{
							playerSpec[srcId] = 20; // Demo
							break;
						}
						else if (cbtLogEvent.m_Ability == 17962) // Conflagrate
						{
							playerSpec[srcId] = 21; // Destruction
							break;
						}
					}
					else if (player.second.m_Class == 7) // Paladin
					{
						if (cbtLogEvent.m_Ability == 20473 || cbtLogEvent.m_Ability == 105546 || cbtLogEvent.m_Ability == 105094) // Holy Shock or Illumination
						{
							playerSpec[srcId] = 22; // Holy
							break;
						}
						else if (cbtLogEvent.m_Ability == 20928) // Holy SHield
						{
							playerSpec[srcId] = 23; // Prot
							break;
						}
						else if (cbtLogEvent.m_Ability == 20058) // Vengeance
						{
							playerSpec[srcId] = 24; // Ret
							break;
						}
					}
					else if (player.second.m_Class == 8) // Shaman
					{
						if (cbtLogEvent.m_Ability == 16166) // Elemental Mastery
						{
							playerSpec[srcId] = 25; // Ele
							break;
						}
						else if (cbtLogEvent.m_Ability == 17364) // Stormstrike
						{
							playerSpec[srcId] = 26; // Enhancement
							break;
						}
						else if (cbtLogEvent.m_Ability == 29274) // Nature's Swiftness
						{
							playerSpec[srcId] = 27; // Resto
							break;
						}
					}
				}
			}

			if (playerSpec[srcId] == 0)
			{
				// Query DB for value
				int spec = 0;
				talentsQuery.AttachValues(srcId);
				if (talentsQuery.HasData())
					talentsQuery.ReadData(&spec);
				playerSpec[srcId] = spec;
			}
			else
			{
				// Insert Class into DB
				_Processor->mSpecsQueue.enqueue(std::make_pair(srcId, playerSpec[srcId]));
			}
		}

		// Set contentLevel in the threat table
		if (DBAccess.m_ServerContentLevel[RealmId] >= 4)
		{
			m_ThreatTable[11566] = 175;
			m_ThreatTable[25288] = 355;
		}
		else
		{
			m_ThreatTable[11566] = 145;
			m_ThreatTable[25288] = 315;
		}

		try
		{
			std::cout << "\nStarted anaylzing the raids\n";
			auto startTime = std::chrono::steady_clock::now();

			st_gnr_Position_Outer = m_ArmoryData->m_Parser->m_sessions.rbegin();
			st_gnr_Position_Inner = (*st_gnr_Position_Outer).begin();

			
			while (!(m_RaidData = GetNextRaid(DBAccess)).empty())
			{
				__int64 StartTime = m_RaidData.front()->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[m_RaidData.front()->m_RTIndex];
				__int64 EndTime = m_RaidData.back()->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[m_RaidData.back()->m_RTIndex];
				std::map<int, bool> Participants;
				m_MCedPets.clear();

				std::cout << "Starting instance: " << m_RaidData[0]->mS_Param[0] << std::endl;
				
				// Retrieve relative information of all tables
				int RS_MAX_Attempts = GetMaxTableId("rs_attempts");
				int RS_MAX_Auras = GetMaxTableId("rs_auras");
				int RS_MAX_BossYells = GetMaxTableId("rs_bossyells");
				int RS_MAX_Damage = GetMaxTableId("rs_damage");
				int RS_MAX_Deaths = GetMaxTableId("rs_deaths");
				int RS_MAX_Dispels = GetMaxTableId("rs_dispels");
				int RS_MAX_Healing = GetMaxTableId("rs_healing");
				int RS_MAX_Interrupts = GetMaxTableId("rs_interrupts");
				int RS_MAX_Loot = GetMaxTableId("rs_loot");
				int RS_MAX_SAT = GetMaxTableId("rs_sat_reference");
				int RS_MAX_SATA = GetMaxTableId("rs_sata_reference");
				int RS_MAX_SA = GetMaxTableId("rs_sa_reference");
				int RS_MAX_Casts = GetMaxTableId("rs_casts");
				int RS_MAX_Threat = GetMaxTableId("rs_gained_threat");
				//int RS_MAX_Uploader = GetMaxTableId("rs_instance_uploader");
				

				int RaidingGuildID = GetGuildID(m_CBTLogParser->mRealTime, m_CBTLogParser->mNameValues, StartTime, EndTime, m_ArmoryData->m_ServerID, DBAccess, Participants, m_CombatLogEvents);
				std::cout << "Guild: " << RaidingGuildID << std::endl;

				int RS_InstanceID = 0;
				int InstanceID = DBAccess.GetInstanceID(m_RaidData.front()->mS_Param[0]);

				int RS_UploaderID = 0;
				int RS_ProgressID = 0;

				if (RaidingGuildID == 0)
				{
					std::cout << "Nobody is participating o.O ?" << std::endl;
					continue;
				}
				if (NumBossesPerInstance(InstanceID) == 0)
				{
					std::cout << "Not an registerd raid!" << std::endl;
					continue;
				}

				__int64 evTS = 0;
				int evSource = 0;
				int evAmount = 0;
				int someCount = 0;
				for (auto& CBTLogVec : m_CombatLogEvents)
				{
					for (auto& cbtLogEvent : CBTLogVec)
					{
						if (m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] + cbtLogEvent.m_Timestamp >= StartTime && m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] + cbtLogEvent.m_Timestamp < EndTime
							&& cbtLogEvent.m_Action <= static_cast<char>(Action::CritHeal)
							)
						{
							evTS = m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] + cbtLogEvent.m_Timestamp;
							evSource = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]);
							evAmount = cbtLogEvent.m_Amount;
							++someCount;
							if (someCount == 1000) break;
						}
					}
				}
				int FactionId = m_ArmoryData->m_UnitData.begin()->second.m_Faction;
				int errId = InitRaidCollection(RaidingGuildID, StartTime, EndTime, _Uploader, RealmId, FactionId, InstanceID, DBAccess, RS_InstanceID, RS_UploaderID, RS_ProgressID, evTS, evSource, evAmount);
				if (errId != 0)
				{
					std::cout << "Error: " << errId << " occoured!" << std::endl;
					continue;
				}
				if (RS_UploaderID == 0)
				{
					std::cout << "Uploader id is zero! We got a problem here!" << std::endl;
					continue;
				}
				
				FetchMCedPets(DBAccess, StartTime, EndTime);
				

				// Reference tables
				std::map<std::string, int> saReference;
				std::map<int, std::pair<int, int>> saReferenceReverse;
				std::map<std::string, int> satReference;
				std::map<int, std::pair<int, int>> satReferenceReverse;
				std::map<std::string, int> sataReference;
				FetchReferenceTables(StartTime, EndTime, DBAccess, RS_UploaderID, RS_MAX_SA, RS_MAX_SAT, RS_MAX_SATA, saReference, satReference, sataReference, saReferenceReverse, satReferenceReverse, unknownPlayer);

				queryProgressValue = 15;
				queryProgress.AttachValues(queryProgressValue, RS_ProgressID);

				EstimateSunder(DBAccess, StartTime, RS_UploaderID, saReference, satReference, sataReference, saReferenceReverse, satReferenceReverse, playerSpec);

				queryProgressValue = 20;
				queryProgress.AttachValues(queryProgressValue, RS_ProgressID);

				// Retrieve attempt information
				std::map<std::pair<int, int>, std::pair<__int64, __int64>> bossAttempts;
				std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>> m_Attempts;
				FetchAttempts(DBAccess, StartTime, EndTime, RS_UploaderID, RaidingGuildID, InstanceID, bossAttempts, m_Attempts);
				
				queryProgressValue = 30;
				queryProgress.AttachValues(queryProgressValue, RS_ProgressID);

				FetchCombatLogData(DBAccess, StartTime, EndTime, RS_ProgressID, RS_UploaderID, queryProgress, saReference, satReference, sataReference, saReferenceReverse, RS_MAX_Damage, playerSpec, FactionId);
				
				queryProgressValue = 85;
				queryProgress.AttachValues(queryProgressValue, RS_ProgressID);

				FetchSessionData(DBAccess, RS_MAX_Attempts, RS_UploaderID, StartTime, m_Attempts);

				queryProgressValue = 90;
				queryProgress.AttachValues(queryProgressValue, RS_ProgressID);

				SetSpeedRunRecord(bossAttempts, static_cast<int>(EndTime - StartTime), RS_UploaderID, RaidingGuildID, InstanceID, NumBossesPerInstance(InstanceID));

				queryProgressValue = 95;
				queryProgress.AttachValues(queryProgressValue, RS_ProgressID);
				// Insert lookupspace relative to retrieved information at the beginning
				auto query = m_DB->ExecuteStreamStatement("UPDATE rs_instance_uploader SET lookupspace=:a<char[330]> WHERE id=:b<int>", 1);
				query.AttachValues(
					// NOTE: THIS ONLY WORKS IF THERE IS NO PARALLEL PROCESSING INVOLVED!
					GetLookUpSpace("rs_attempts", RS_MAX_Attempts) + "&" +
					GetLookUpSpace("rs_sa_reference", RS_MAX_SA) + "&" +
					GetLookUpSpace("rs_sat_reference", RS_MAX_SAT) + "&" +
					GetLookUpSpace("rs_sata_reference", RS_MAX_SATA) + "&" +
					GetLookUpSpace("rs_auras", RS_MAX_Auras) + "&" +
					GetLookUpSpace("rs_deaths", RS_MAX_Deaths) + "&" +
					GetLookUpSpace("rs_dispels", RS_MAX_Dispels) + "&" +
					GetLookUpSpace("rs_interrupts", RS_MAX_Interrupts) + "&" +
					GetLookUpSpace("rs_damage", RS_MAX_Damage) + "&" +
					GetLookUpSpace("rs_healing", RS_MAX_Healing) + "&" +
					GetLookUpSpace("rs_loot", RS_MAX_Loot) + "&" +
					GetLookUpSpace("rs_casts", RS_MAX_Casts) + "&" +
					GetLookUpSpace("rs_bossyells", RS_MAX_BossYells) + "&" +
					GetLookUpSpace("rs_gained_threat", RS_MAX_Threat)
					, RS_UploaderID);

				// For the armory: Participants
				query = m_DB->ExecuteStreamStatement("INSERT INTO `rs_participants` (uploaderid, charid) VALUES (:a<int>, :b<int>)", 100);
				for (auto& player : Participants)
				{
					if (player.second)
					{
						query.AttachValues(RS_UploaderID, player.first);
					}
				}
				query.Flush();

				// Check if it was an instance with attempts
				bool RelevantData = false;
				for (auto& atmt : m_Attempts)
				{
					if (atmt.second.first->m_Type == 10 || atmt.second.first->m_Type == 24 || atmt.second.second->m_Type == 10 || atmt.second.second->m_Type == 24)
					{
						if (InstanceID >= 84 && InstanceID <= 89)
						{
							if (atmt.second.first->mS_Param[0] != "Azuregos"
								&& atmt.second.first->mS_Param[0] != "Taerar"
								&& atmt.second.first->mS_Param[0] != "Lord Kazzak"
								&& atmt.second.first->mS_Param[0] != "Ysondre"
								&& atmt.second.first->mS_Param[0] != "Emeriss"
								&& atmt.second.first->mS_Param[0] != "Lethon"
								)
							{
								break;
							}
						}
						RelevantData = true;
						break;
					}
				}
				if (!RelevantData)
				{
					// If there are no attempts => Remove the raid again.
					std::cout << "Boss attempt size is 0! Deleting raid again!" << std::endl;
					query = m_DB->ExecuteStreamStatement("DELETE FROM rs_instances WHERE id=:a<int> and rdy=0", 1);
					query.AttachValues(RS_InstanceID);
					query = m_DB->ExecuteStreamStatement("DELETE FROM rs_instance_uploader WHERE id=:a<int>", 1);
					query.AttachValues(RS_UploaderID);
				}
				else
				{
					// Change state to rdy
					query = m_DB->ExecuteStreamStatement("UPDATE rs_instances SET rdy = 1 WHERE id=:a<int>", 1);
					query.AttachValues(RS_InstanceID);
				}


				query = m_DB->ExecuteStreamStatement("DELETE FROM rs_instance_uploader WHERE lookupspace=:a<char[2]>", 1);
				std::string rsiunull = "0";
				query.AttachValues(rsiunull);

				auto sqlStream = DBAccess.GetConnector(true)->ExecuteStreamStatement("insert into gn_cachingcontroller (type) values (:a<int>)", 1);
				sqlStream.AttachValues(5);
				sqlStream.AttachValues(1);
				sqlStream.AttachValues(2);
				sqlStream.AttachValues(3);
				sqlStream.AttachValues(6);

                std::cout << "Instance: " << m_RaidData[0]->mS_Param[0] << std::endl;
				
			}

			auto stopTime = std::chrono::steady_clock::now();
            std::cout << "Raid analyzation took: " << (std::chrono::duration_cast<std::chrono::milliseconds>(stopTime - startTime).count()) << "ms\n";
		}
		catch (otl_exception& p)
		{ // intercept OTL exceptions
			std::cerr << p.msg << std::endl; // print out error message
			std::cerr << p.stm_text << std::endl; // print out SQL that caused the error
			std::cerr << p.var_info << std::endl; // print out the variable that caused the error
			m_DB->ExecuteStreamStatement("DELETE FROM rs_instances WHERE rdy = 0", 1);
		}
		catch (const std::exception &exc)
		{
			// Flag file here!
			std::cout << exc.what() << std::endl;
			m_DB->ExecuteStreamStatement("DELETE FROM rs_instances WHERE rdy = 0", 1);
			return;
		}
		catch(...)
		{
			std::cout << "The file may be corrupted or some unknown exception occoured!" << std::endl;
			m_DB->ExecuteStreamStatement("DELETE FROM rs_instances WHERE rdy = 0", 1);
			return;
		}

		// Removing file here
		remove(_Armory);
		remove(_CBTLog);
	}

	Analyzer::~Analyzer()
	{
	}

	// Difficulties:
	// TODO: Localization!
	std::map<std::string, bool> Analyzer::m_NotRlyGroupBoss = {
		{ "Razorgore the Untamed", true },
		{ "Nefarian", true },
		{ "Thaddius", true },
		{ "Gothik the Harvester", true },
		{ "Instructor Razuvious", true },
		{ "Kel'Thuzad", true },
	};

	std::map<std::string, std::string> Analyzer::m_BossToGroup = {
		// MC
		{ "Flamewaker Elite", "Majordomo Executus" }, // 3 Elite and Healear each? => TODO!
		{ "Flamewaker Healer", "Majordomo Executus" },
		{ "Majordomo Executus", "Majordomo Executus" },
		// BWL
		{ "Grethok the Controller", "Razorgore the Untamed" },
		{ "Blackwing Guardsman", "Razorgore the Untamed" },
		{ "Blackwing Legionnaire", "Razorgore the Untamed" },
		{ "Blackwing Mage", "Razorgore the Untamed" },
		{ "Death Talon Dragonspawn", "Razorgore the Untamed" },
		{ "Razorgore the Untamed", "Razorgore the Untamed" },
		// (Adding these as bosses, in order to map the first phase to the boss!)
		{ "Blue Drakonid", "Nefarian" },
		{ "Black Drakonid", "Nefarian" },
		{ "Bronze Drakonid", "Nefarian" },
		{ "Green Drakonid", "Nefarian" },
		{ "Red Drakonid", "Nefarian" },
		{ "Bone Construct", "Nefarian" },
		{ "Chromatic Drakonid", "Nefarian" },
		{ "Corrupted Infernal", "Nefarian" },
		{ "Nefarian", "Nefarian" },
		// AQ
		{ "Eye of C'Thun", "C'Thun" },
		{ "C'Thun", "C'Thun" },
		{ "Emperor Vek'lor", "The Twin Emperors" },
		{ "Emperor Vek'nilash", "The Twin Emperors" },
		{ "The Twin Emperors", "The Twin Emperors" },
		{ "Lord Kri", "The Bug Family" },
		{ "Princess Yauj", "The Bug Family" },
		{ "Vem", "The Bug Family" },
		{ "The Bug Family", "The Bug Family" },
		// NAXX
		{ "Highlord Mograine", "The Four Horsemen" },
		{ "Thane Korth'azz", "The Four Horsemen" },
		{ "Sir Zeliek", "The Four Horsemen" },
		{ "Lady Blaumeux", "The Four Horsemen" },
		{ "The Four Horsemen", "The Four Horsemen" },
		{ "Thaddius", "Thaddius" },
		{ "Feugen", "Thaddius" },
		{ "Stalagg", "Thaddius" },
		{ "Gothik the Harvester", "Gothik the Harvester" },
		{ "Unrelenting Trainee", "Gothik the Harvester" },
		{ "Unrelenting Deathknight", "Gothik the Harvester" },
		{ "Unrelenting Rider", "Gothik the Harvester" },
		{ "Spectral Trainee", "Gothik the Harvester" },
		{ "Spectral Deathknight", "Gothik the Harvester" },
		{ "Spectral Rider", "Gothik the Harvester" },
		{ "Spectral Horse", "Gothik the Harvester" },
		{ "Instructor Razuvious", "Instructor Razuvious" },
		{ "Deathknight Understudy", "Instructor Razuvious" },
		{ "Kel'Thuzad", "Kel'Thuzad" },
		{ "Soldier of the Frozen Wastes", "Kel'Thuzad" },
		{ "Unstoppable Abomination", "Kel'Thuzad" },
		{ "Soul Weaver", "Kel'Thuzad" },
		{ "Guardian of Icecrown", "Kel'Thuzad" },
	};
	std::map<std::string, short> Analyzer::m_GroupToAmount = {
		{ "The Four Horsemen", 4 },
		{ "The Bug Family", 3 },
		{ "The Twin Emperors", 2 },
		{ "C'Thun", 2 },
		{ "Majordomo Executus", 8 }
	};
	std::pair<SessionLine*, SessionLine*> Analyzer::GetNextAttempt(DatabaseAccess& _DB, std::vector<SessionLine*>::iterator& ptr, std::vector<SessionLine*>::iterator& end, std::map<std::pair<int, int>, std::pair<__int64, __int64>>& bossAttempts)
	{
		SessionLine* startLine = nullptr;
		bool trashAttempt = false;
		short zg_thekal = 0; // Special rule for the phases of High Priest Thekal => BTW: A way to track phases of Thekal xD

		bool groupBossFight = false;
		std::map<std::string, bool> groupBossDied;
		std::string currentGroupBoss = "";
		std::string impossible = "Impossible";
		int impCount = impossible.size();

		for (; ptr != end; ++ptr)
		{
			try
			{
				// Vael dialog
				if ((*ptr)->m_Type == 10)
				{
					if ((*ptr)->mS_Param[0] == "Vaelastrasz the Corrupt")
					{
						// Note: This can go wrong :/
						if ((*ptr)->mI_Param[0] >= 29000) // Skip until she has less
						{
							auto bfr = ptr - 1;
							for (; ptr != end; ++ptr)
								if ((*ptr)->m_Type == 10 && (*ptr)->mI_Param[0] < 30000) break;
							if ((startLine != nullptr && startLine->mS_Param[0] != "Vaelastrasz the Corrupt") || ptr == end)
								return std::make_pair(startLine, *bfr);
							if ((*ptr)->mI_Param[0] > 0)
							{
								startLine = *ptr;
							}
						}
					}
				}

				if ((
					//((*ptr)->m_Type == 5 && (*ptr)->mI_Param[0] > 10) ||
					((*ptr)->m_Type == 10 && (*ptr)->mI_Param[0] >= 95000)
					&& (*ptr)->m_Type == 10 && (*ptr)->mI_Param[0] < 100000 // In order to counter dialoges!
					)) // Boss begin!
				{
					if (startLine == nullptr)
					{
						startLine = *ptr;
						if (*(*ptr)->mS_Param == "High Priest Thekal") // TODO: Localization!
							zg_thekal = 1;
						if (m_BossToGroup.find((*ptr)->mS_Param[0]) != m_BossToGroup.end())
						{
							currentGroupBoss = m_BossToGroup[(*ptr)->mS_Param[0]];
							if (m_NotRlyGroupBoss[m_BossToGroup[(*ptr)->mS_Param[0]]])
							{
								// Checking if the boss has already did and its just adds that are cleared
								bool alreadyKilled = false;
								for (auto& kill : bossAttempts)
								{
									if (_DB.m_NPCNames[kill.first.second] == m_BossToGroup[(*ptr)->mS_Param[0]])
									{
										alreadyKilled = true;
										break;
									}
								}
								if (alreadyKilled)
								{
									currentGroupBoss = "";
									groupBossFight = false;
									startLine = nullptr;
								}
								continue;
							}
							// Lets overwrite the actual boss name with the group boss name
							//(*ptr)->mS_Param[0] = m_BossToGroup[(*ptr)->mS_Param[0]];
							std::cout << "Processing Group Boss: " << currentGroupBoss << std::endl;
							groupBossFight = true;
							if (currentGroupBoss == "Majordomo Executus")
							{
								bool alreadyKilled = false;
								for (auto& kill : bossAttempts)
								{
									if (kill.first.second == 12018)
									{
										alreadyKilled = true;
										break;
									}
								}
								if (alreadyKilled)
								{
									currentGroupBoss = "";
									groupBossFight = false;
									startLine = nullptr;
								}
							}
						}
					}
					else if (trashAttempt)
					{
						--ptr;
						if (*ptr == startLine)
						{
							++ptr;
							startLine = nullptr;
							trashAttempt = false;
							continue;
						}
						else
						{
							if (!_DB.IsBossNPC(startLine->mS_Param[0]))
							{
								//std::cout << "Test 1: " << startLine->mS_Param[0] << " // " << (*ptr)->mS_Param[0] << std::endl;
								return std::make_pair(startLine, *ptr);
							}
							else
							{
								++ptr;
								startLine = nullptr;
								trashAttempt = false;
								continue;
							}
						}
					}
					else if (zg_thekal == 2)
					{
						zg_thekal = 3;
					}
					else if (currentGroupBoss != "")
					{
						if (m_NotRlyGroupBoss[m_BossToGroup[(*ptr)->mS_Param[0]]]) continue;
						if (m_BossToGroup.find((*ptr)->mS_Param[0]) != m_BossToGroup.end())
						{
							startLine->mS_Param[0] = m_BossToGroup[(*ptr)->mS_Param[0]];
							(*ptr)->mS_Param[0] = m_BossToGroup[(*ptr)->mS_Param[0]];
						}
						if (currentGroupBoss != (*ptr)->mS_Param[0]) // We missed the wipe ?!
						{
							std::cout << "Missed the wipe or last kill of " << currentGroupBoss << std::endl;
							return std::make_pair(startLine, *(ptr - 1));
						}
					}
				}
				else if (startLine != nullptr && (*ptr)->m_Type == 20 && currentGroupBoss == "Majordomo Executus" && (*ptr)->mS_Param[0].size() >= impCount && (*ptr)->mS_Param[0].compare(0, impCount, impossible))
				{
					bool alreadyKilled = false;
					int npcid = _DB.GetNPCID(currentGroupBoss);
					for (auto& kill : bossAttempts)
					{
						if (kill.first.second == npcid)
						{
							alreadyKilled = true;
							break;
						}
					}
					if (alreadyKilled)
					{
						continue;
					}

					(*ptr)->m_Type = 10;
					(*ptr)->mS_Param[0] = currentGroupBoss;
					startLine->mS_Param[0] = currentGroupBoss;
					return std::make_pair(startLine, *ptr);
				}
				else if (startLine != nullptr && (
					// TODO: Optimization, maybe save the begin and end iterators?
					((*ptr)->m_Type == 24 && (_DB.IsBossNPC(*(*ptr)->mS_Param) || m_BossToGroup.find((*ptr)->mS_Param[0]) != m_BossToGroup.end())) ||
					((*ptr)->m_Type == 10 && (*ptr)->mI_Param[0] == 0)
					)) // Boss was killed
				{
					if (zg_thekal == 1)
						zg_thekal = 2;
					else
					{
						if (groupBossFight)
						{
							if (currentGroupBoss == "Majordomo Executus") continue;
							if (m_NotRlyGroupBoss[(*ptr)->mS_Param[0]])
								return std::make_pair(startLine, *ptr);
							//std::cout << "Killed: " << (*ptr)->mS_Param[0] << std::endl;
							if (m_BossToGroup.find((*ptr)->mS_Param[0]) != m_BossToGroup.end())
							{
								groupBossDied[(*ptr)->mS_Param[0]] = true;
							}
							if (groupBossDied.size() >= m_GroupToAmount[currentGroupBoss])
							{
								// To make sure the group boss id is returned!
								(*ptr)->mS_Param[0] = currentGroupBoss;
								startLine->mS_Param[0] = currentGroupBoss;
								return std::make_pair(startLine, *ptr);
							}
						}
						else
						{
							// Prophet skeram has many illusions that are killed frequently
							// We need to make sure that there is no other event comming where he gets dmg!
							if (startLine->mS_Param[0] == "The Prophet Skeram")
							{
								bool cont = false;
								__int64 curTime = m_ArmoryData->m_Parser->m_RealTime[(*ptr)->m_RTIndex] + (*ptr)->m_TimeStamp + 15000;
								for (auto oldPtr = ptr + 1; oldPtr != end && (m_ArmoryData->m_Parser->m_RealTime[(*oldPtr)->m_RTIndex] + (*oldPtr)->m_TimeStamp) < curTime; ++oldPtr)
								{
									if ((*oldPtr)->m_Type == 10 && (*oldPtr)->mI_Param[0] > 0 && (*oldPtr)->mS_Param[0] == "The Prophet Skeram")
									{
										cont = true;
										break;
									}
								}
								if (cont) continue;
							}

							// Lets just make it a rule that bosses cant be killed twice! If that happens something odd is going on!
							bool alreadyKilled = false;
							int npcid = _DB.GetNPCID(*(*ptr)->mS_Param);
							for (auto& kill : bossAttempts)
							{
								if (kill.first.second == npcid)
								{
									alreadyKilled = true;
									break;
								}
							}
							if (alreadyKilled)
							{
								//std::cout << "Boss killed twice ?! Skipped this!" << " => " << *(*ptr)->mS_Param << std::endl;
								continue;
							}
							if (m_BossToGroup.find((*ptr)->mS_Param[0]) != m_BossToGroup.end())
							{
								if (!m_NotRlyGroupBoss[(*ptr)->mS_Param[0]] && m_NotRlyGroupBoss[m_BossToGroup[(*ptr)->mS_Param[0]]]) continue;
								(*ptr)->mS_Param[0] = m_BossToGroup[(*ptr)->mS_Param[0]];
								startLine->mS_Param[0] = m_BossToGroup[(*ptr)->mS_Param[0]];
							}

							if ((*ptr)->mS_Param[0] == "Majordomo Executus") // Dies at ragna!
								(*ptr)->mS_Param[0] = "Trash";
							if (zg_thekal == 0 || zg_thekal == 3)
							{
								if (m_BossToGroup.find((*ptr)->mS_Param[0]) != m_BossToGroup.end())
								{
									(*ptr)->mS_Param[0] = m_BossToGroup[(*ptr)->mS_Param[0]];
									startLine->mS_Param[0] = m_BossToGroup[(*ptr)->mS_Param[0]];
								}
								else if (m_BossToGroup.find(startLine->mS_Param[0]) != m_BossToGroup.end())
								{
									(*ptr)->mS_Param[0] = m_BossToGroup[startLine->mS_Param[0]];
									startLine->mS_Param[0] = m_BossToGroup[startLine->mS_Param[0]];
								}
								//std::cout << "Test 2: " << startLine->mS_Param[0] << " // " << (*ptr)->mS_Param[0] << std::endl;
								return std::make_pair(startLine, *ptr);
							}
						}
					}
				}
				else if (startLine == nullptr && ((*ptr)->m_Type == 5 && (*ptr)->mI_Param[0] > 10)) // Trash begin
				{
					startLine = *ptr;
					trashAttempt = true;
					if (m_BossToGroup.find((*ptr)->mS_Param[0]) != m_BossToGroup.end())
					{
						if (m_BossToGroup[(*ptr)->mS_Param[0]] == "Nefarian" || m_BossToGroup[(*ptr)->mS_Param[0]] == "Razorgore the Untamed")
						{
							currentGroupBoss = m_BossToGroup[(*ptr)->mS_Param[0]];
							trashAttempt = false;
						}
						else if (m_BossToGroup[(*ptr)->mS_Param[0]] == "Majordomo Executus")
						{
							(*ptr)->mS_Param[0] = "Majordomo Executus";
							currentGroupBoss = "Majordomo Executus";
							trashAttempt = false;
							groupBossFight = true; // Only case cause we need to check if 6 of these guys died

							bool alreadyKilled = false;
							for (auto& kill : bossAttempts)
							{
								if (kill.first.second == 12018)
								{
									alreadyKilled = true;
									break;
								}
							}
							if (alreadyKilled)
							{
								currentGroupBoss = "";
								groupBossFight = false;
								startLine = nullptr;
							}
						}
					}
				}
				// Problem: If the boss is getting pulled but only a few are infight -> pulling it towards the raid
				else if (startLine != nullptr && !trashAttempt
					&& ((*ptr)->m_Type == 5 && (*ptr)->mI_Param[0] == 0)
					) // Wipe condition
				{
					// During the razorgore fight people tend to get outfight very often!
					// Then again, maybe this does not happen too often :/?
					if (m_NotRlyGroupBoss[currentGroupBoss])
					{
						// DO STH!
						// Maybe check the next 10 seconds of the combat log and if there is any cbt event then continue?
						__int64 curTime = m_ArmoryData->m_Parser->m_RealTime[(*ptr)->m_RTIndex] + (*ptr)->m_TimeStamp + 40000;
						for (auto oldPtr = ptr + 1; oldPtr != end && (m_ArmoryData->m_Parser->m_RealTime[(*oldPtr)->m_RTIndex] + (*oldPtr)->m_TimeStamp) < curTime; ++oldPtr)
						{
							if (((*oldPtr)->m_Type == 10 && (*oldPtr)->mI_Param[0] > 0)
								|| ((*oldPtr)->m_Type == 24)
								) goto skipWipe;
						}
					}
					else if (currentGroupBoss == "Majordomo Executus")
					{
						__int64 curTime = m_ArmoryData->m_Parser->m_RealTime[(*ptr)->m_RTIndex] + (*ptr)->m_TimeStamp + 20000;
						for (auto oldPtr = ptr + 1; oldPtr != end && (m_ArmoryData->m_Parser->m_RealTime[(*oldPtr)->m_RTIndex] + (*oldPtr)->m_TimeStamp) < curTime; ++oldPtr)
						{
							if (((*oldPtr)->m_Type == 24 && (_DB.IsBossNPC(*(*oldPtr)->mS_Param) || m_BossToGroup.find((*oldPtr)->mS_Param[0]) != m_BossToGroup.end())))
								goto skipWipe;
						}
					}
					else if (currentGroupBoss != "")
					{
						__int64 curTime = m_ArmoryData->m_Parser->m_RealTime[(*ptr)->m_RTIndex] + (*ptr)->m_TimeStamp + 20000;
						for (auto oldPtr = ptr + 1; oldPtr != end && (m_ArmoryData->m_Parser->m_RealTime[(*oldPtr)->m_RTIndex] + (*oldPtr)->m_TimeStamp) < curTime; ++oldPtr)
						{
							if ((*oldPtr)->m_Type == 10 && (*oldPtr)->mI_Param[0] > 0 && m_BossToGroup.find((*oldPtr)->mS_Param[0]) != m_BossToGroup.end() && m_BossToGroup[(*oldPtr)->mS_Param[0]] == currentGroupBoss)
								goto skipWipe;
						}
					}
					else if (currentGroupBoss == "")
					{
						__int64 curTime = m_ArmoryData->m_Parser->m_RealTime[(*ptr)->m_RTIndex] + (*ptr)->m_TimeStamp + 10000;
						for (auto oldPtr = ptr + 1; oldPtr != end && (m_ArmoryData->m_Parser->m_RealTime[(*oldPtr)->m_RTIndex] + (*oldPtr)->m_TimeStamp) < curTime; ++oldPtr)
						{
							if ((*oldPtr)->m_Type == 10 && (*oldPtr)->mI_Param[0] > 0 && (*oldPtr)->mS_Param[0] == startLine->mS_Param[0])
								goto skipWipe;
						}
					}

					if (m_BossToGroup.find(startLine->mS_Param[0]) != m_BossToGroup.end())
					{
						startLine->mS_Param[0] = m_BossToGroup[startLine->mS_Param[0]];
						(*ptr)->mS_Param[0] = m_BossToGroup[startLine->mS_Param[0]];
					}

					std::cout << "Wiped at the Boss: " << startLine->mS_Param[0] << std::endl;

					return std::make_pair(startLine, *ptr);
				skipWipe:;
				}
			}
			catch(...)
			{
				std::cout << "Some unknown error occoured during attempt parsing" << std::endl;
				break;
			}
		}
		if (startLine == nullptr)
			return std::make_pair(nullptr, nullptr);
		if (ptr == end)
			return std::make_pair(startLine, nullptr); // TODO!!!
		if (m_BossToGroup.find(startLine->mS_Param[0]) != m_BossToGroup.end())
		{
			startLine->mS_Param[0] = m_BossToGroup[startLine->mS_Param[0]];
			(*ptr)->mS_Param[0] = m_BossToGroup[startLine->mS_Param[0]];
		}

		return std::make_pair(startLine, *ptr);
	}

	void Analyzer::FetchReferenceTables(long long StartTime, long long EndTime, DatabaseAccess& DBAccess, int RS_UploaderID, int RS_MAX_SA, int RS_MAX_SAT, int RS_MAX_SATA, std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference, std::map<int, std::pair<int, int>>& saReferenceReverse, std::map<int, std::pair<int, int>>& satReferenceReverse, int unknownPlayer)
	{
		auto querySA = m_DB->ExecuteStreamStatement("INSERT INTO rs_sa_reference (id, sourceid, abilityid, uploaderid) VALUES (:q<int>, :a<int>, :b<int>, :c<int>)", 100000);
		auto querySAT = m_DB->ExecuteStreamStatement("INSERT INTO rs_sat_reference (id, targetid, said) VALUES (:q<int>, :a<int>, :b<int>)", 100000);
		auto querySATA = m_DB->ExecuteStreamStatement("INSERT INTO rs_sata_reference (id, targetabilityid, satid) VALUES (:q<int>, :a<int>, :b<int>)", 100000);
		auto queryInterrupts = m_DB->ExecuteStreamStatement("INSERT INTO rs_interrupts (sataid, timestamp) VALUES (:a<int>, :b<int>)", 10000);
		auto queryDispels = m_DB->ExecuteStreamStatement("INSERT INTO rs_dispels (sataid, timestamp) VALUES (:a<int>, :b<int>)", 10000);
		// That is a lot slower than I expected :D
		// Problem of Insert Ignore, it will execute a query for every combination
		std::string bufferRefSA(8, '\0');
		std::string bufferRefSAT(12, '\0');
		std::string bufferRefSATA(16, '\0');
		std::map<std::string, bool> dbgExist;

		std::map<std::string, bool> doneComb;
		std::map<std::string, bool> doneCombSAT;
		std::map<std::string, bool> doneCombSA;

		// Interrupts
		std::map<std::string, __int64> PotentialKick;
		std::map<std::string, std::string> PotentialKickAb;
		std::map<std::string, __int64> WasKicked;
		std::map<std::string, std::pair<std::pair<int, int>, std::pair<std::string, int>>> WasKickedInfo;

		std::vector<std::pair<std::string, int>> kicks;

		// Dispels
		std::vector<std::pair<std::string, std::pair<int, __int64>>> PotentialDispels;
		std::vector<std::pair<std::pair<std::string, std::string>, std::pair<int, __int64>>> DispelCasts;

		std::map<std::string, std::pair<int, std::pair<__int64, __int64>>> IndirectDispelCasts;
		std::vector<std::pair<std::string, std::pair<int, std::pair<__int64, __int64>>>> IndirectDispelCastsVec;
		std::vector<std::pair<std::string, int>> Dispels;

		// Extra attacks
		std::map<int, CombatLogEvent*> extraAttack; // Is it possible to get extra attacks from extra attacks?

		int SACount = RS_MAX_SA;
		int SATCount = RS_MAX_SAT;
		int SATACount = RS_MAX_SATA;
		std::map<int, std::pair<int, int>> SataReferenceReverse;

		for (auto& CBTLogVec : m_CombatLogEvents)
		{
			for (auto& cbtLogEvent : CBTLogVec)
			{
				__int64 uTS = cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex];
				if (uTS < StartTime) continue;
				if (uTS > EndTime) goto endCBTLoop;

				for (auto& wk : WasKicked)
				{
					if (wk.second == 0) continue;
					auto hackKey = xxh::xxhash<64>(WasKickedInfo[wk.first].second.first, WasKickedInfo[wk.first].second.first.length()); // TODO!
					if (wk.second + (DBAccess.m_AbilityCastTime[hackKey] == 0 ? 2000 : DBAccess.m_AbilityCastTime[hackKey]) >= uTS) continue;

					wk.second = 0;
					int cbtSourceID = WasKickedInfo[wk.first].first.first;
					std::string name = wk.first;
					int cbtTargetID = GetTargetSourceID(DBAccess, name, 0);
					int cbtAbilityID = WasKickedInfo[wk.first].first.second;
					int cbtTargetAbilityID = DBAccess.GetAbilityID(WasKickedInfo[wk.first].second.first);
					if (cbtSourceID <= 0) continue;
					if (cbtTargetID <= 0) continue;
					if (cbtAbilityID <= 0) continue;
					if (cbtTargetAbilityID <= 0) continue;
					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					if (!doneCombSA[bufferRefSA])
					{
						querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
						doneCombSA[bufferRefSA] = true;
						saReference[bufferRefSA] = SACount;
						saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
						++SACount;
					}
					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
					if (!doneCombSAT[bufferRefSAT])
					{
						querySAT.AttachValues(SATCount,cbtTargetID, saReference[bufferRefSA]);
						doneCombSAT[bufferRefSAT] = true;
						satReference[bufferRefSAT] = SATCount;
						satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(cbtTargetID, saReference[bufferRefSA])));
						++SATCount;
					}

					DBAccess.PackMapKey(bufferRefSATA, 4, cbtSourceID, cbtAbilityID, cbtTargetID, cbtTargetAbilityID);
					if (!doneComb[bufferRefSATA])
					{
						querySATA.AttachValues(SATACount,cbtTargetAbilityID, satReference[bufferRefSAT]);
						doneComb[bufferRefSATA] = true;
						sataReference[bufferRefSATA] = SATACount;
						SataReferenceReverse.insert(std::make_pair(SATACount, std::make_pair(cbtTargetAbilityID, satReference[bufferRefSAT])));
						++SATACount;
					}
					kicks.push_back(std::make_pair(bufferRefSATA, WasKickedInfo[wk.first].second.second));
				}

				if ( // SAT
					 // Micropt
					cbtLogEvent.m_Action <= static_cast<char>(Action::Reflects)
					|| cbtLogEvent.m_AmountType <= static_cast<char>(AmountType::HolyDamage)
					|| (cbtLogEvent.m_Action == static_cast<char>(Action::Gain) && cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health))
					|| (cbtLogEvent.m_Action == static_cast<char>(Action::Drain) && cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health))
					)
				{
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, 0, 0, cbtLogEvent.m_Action == static_cast<char>(Action::Heal) || cbtLogEvent.m_Action == static_cast<char>(Action::CritHeal));
					if (cbtTargetID <= 0) continue;
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, 0, 0, cbtTargetID < 300000);
					if (cbtSourceID <= 0) continue;

					if (cbtTargetID < 300000)
						cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, 0, 0, cbtLogEvent.m_Action == static_cast<char>(Action::Heal) || cbtLogEvent.m_Action == static_cast<char>(Action::CritHeal) || cbtSourceID < 300000);

					//int cbtAbilityID = DBAccess.GetAbilityID(cbtLogEvent.m_Ability, true);
					int cbtAbilityID = cbtLogEvent.m_Ability;
					if (cbtAbilityID <= 0) continue;

					if (PotentialKick[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] != 0 && DBAccess.m_AbilityNames[cbtLogEvent.m_Ability] == PotentialKickAb[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]])
					{
						PotentialKick[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] = 0; // Every hit wasnt interrupted!
						PotentialKickAb[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] = "";
					}
					if (m_InterruptAbilities[DBAccess.m_AbilityNames[cbtLogEvent.m_Ability]] && PotentialKick[m_CBTLogParser->mNameValues[cbtLogEvent.m_Target]] != 0)
					{
						WasKicked[m_CBTLogParser->mNameValues[cbtLogEvent.m_Target]] = uTS;
						WasKickedInfo[m_CBTLogParser->mNameValues[cbtLogEvent.m_Target]] = std::make_pair(std::make_pair(cbtSourceID, cbtAbilityID), std::make_pair(PotentialKickAb[m_CBTLogParser->mNameValues[cbtLogEvent.m_Target]], static_cast<int>(uTS - StartTime)));
						PotentialKick[m_CBTLogParser->mNameValues[cbtLogEvent.m_Target]] = 0;
						PotentialKickAb[m_CBTLogParser->mNameValues[cbtLogEvent.m_Target]] = "";
					}

					if (cbtLogEvent.m_Ability == 47490 && extraAttack.find(cbtSourceID) != extraAttack.end() && extraAttack[cbtSourceID]->m_Amount > 0)
					{
						__int64 extraAttackTs = m_CBTLogParser->mRealTime[extraAttack[cbtSourceID]->m_RTIndex] + extraAttack[cbtSourceID]->m_Timestamp;
						if (uTS - 300 <= extraAttackTs)
						{
							//cbtAbilityID = DBAccess.GetAbilityID(extraAttack[cbtSourceID]->m_Ability, true);
							cbtAbilityID = extraAttack[cbtSourceID]->m_Ability;
							if (cbtAbilityID <= 0) continue;
						}
					}

					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					if (!doneCombSA[bufferRefSA])
					{
						querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
						doneCombSA[bufferRefSA] = true;
						saReference[bufferRefSA] = SACount;
						saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
						++SACount;
					}
					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
					if (doneCombSAT[bufferRefSAT]) continue;
					querySAT.AttachValues(SATCount,cbtTargetID, saReference[bufferRefSA]);
					doneCombSAT[bufferRefSAT] = true;
					satReference[bufferRefSAT] = SATCount;
					satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(cbtTargetID, saReference[bufferRefSA])));
					++SATCount;
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Gain))
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					if (cbtSourceID <= 0) continue;
					//int cbtAbilityID = DBAccess.GetAbilityID(cbtLogEvent.m_Ability, true);
					int cbtAbilityID = cbtLogEvent.m_Ability;
					if (cbtAbilityID <= 0) continue;

					if (m_InDirectDispels[DBAccess.m_AbilityNames[cbtLogEvent.m_Ability]])
					{
						IndirectDispelCasts.insert(std::make_pair(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], std::make_pair(cbtLogEvent.m_Ability, std::make_pair(uTS, 0))));
					}
					if (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Attack))
						extraAttack[cbtSourceID] = &cbtLogEvent;
					if (cbtLogEvent.m_Ability == 10613 || cbtLogEvent.m_Ability == 10486)
					{
						cbtLogEvent.m_Amount = 1;
						extraAttack[cbtSourceID] = &cbtLogEvent;
					}

					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					if (doneCombSA[bufferRefSA]) continue;
					querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
					doneCombSA[bufferRefSA] = true;
					saReference[bufferRefSA] = SACount;
					saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
					++SACount;
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::AfflictedBy) && cbtLogEvent.m_Amount == 0)
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					if (cbtSourceID <= 0) continue;
					//int cbtAbilityID = DBAccess.GetAbilityID(cbtLogEvent.m_Ability, true);
					int cbtAbilityID = cbtLogEvent.m_Ability;
					if (cbtAbilityID <= 0) continue;

					if (PotentialKick[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] != 0 && m_StunInterruptAbilities[DBAccess.m_AbilityNames[cbtLogEvent.m_Ability]])
					{
						WasKicked[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] = uTS;
						WasKickedInfo[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] = std::make_pair(std::make_pair(unknownPlayer, cbtAbilityID), std::make_pair(PotentialKickAb[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]], static_cast<int>(uTS - StartTime)));
						PotentialKick[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] = 0;
						PotentialKickAb[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] = "";
					}

					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					if (doneCombSA[bufferRefSA]) continue;
					querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
					doneCombSA[bufferRefSA] = true;
					saReference[bufferRefSA] = SACount;
					saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
					++SACount;
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Fades) && cbtLogEvent.m_Amount == 0)
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					if (cbtSourceID <= 0) continue;
					//int cbtAbilityID = DBAccess.GetAbilityID(cbtLogEvent.m_Ability, true);
					int cbtAbilityID = cbtLogEvent.m_Ability;
					if (cbtAbilityID <= 0) continue;

					if ((cbtLogEvent.m_Ability == 10613 || cbtLogEvent.m_Ability == 10486) && extraAttack.find(cbtSourceID) != extraAttack.end())
						extraAttack[cbtSourceID]->m_Amount = 0;

					if (m_InDirectDispels[DBAccess.m_AbilityNames[cbtLogEvent.m_Ability]] && IndirectDispelCasts.find(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]) != IndirectDispelCasts.end())
					{
						// If someone gets two of these abilities we have a problem!
						IndirectDispelCasts[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].second.second = uTS;
						IndirectDispelCastsVec.push_back(std::make_pair(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], IndirectDispelCasts[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]]));
						IndirectDispelCasts.erase(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]);
					}

					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					if (doneCombSA[bufferRefSA]) continue;
					querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
					doneCombSA[bufferRefSA] = true;
					saReference[bufferRefSA] = SACount;
					saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
					++SACount;
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Interrupt))
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					if (cbtSourceID <= 0) continue;
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS);
					if (cbtTargetID <= 0) continue;
					//int cbtAbilityID = DBAccess.GetAbilityID(cbtLogEvent.m_Ability, true);
					int cbtAbilityID = cbtLogEvent.m_Ability;
					if (cbtAbilityID <= 0) continue;
					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, 18469);
					if (!doneCombSA[bufferRefSA])
					{
						querySA.AttachValues(SACount,cbtSourceID, 18469, RS_UploaderID);
						doneCombSA[bufferRefSA] = true;
						saReference[bufferRefSA] = SACount;
						saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
						++SACount;
					}
					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, 18469, cbtTargetID);
					if (!doneCombSAT[bufferRefSAT])
					{
						querySAT.AttachValues(SATCount,cbtTargetID, saReference[bufferRefSA]);
						doneCombSAT[bufferRefSAT] = true;
						satReference[bufferRefSAT] = SATCount;
						satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(cbtTargetID, saReference[bufferRefSA])));
						++SATCount;
					}
					DBAccess.PackMapKey(bufferRefSATA, 4, cbtSourceID, 18469, cbtTargetID, cbtAbilityID); // 18469 is Counterspell!
					if (doneComb[bufferRefSATA]) continue;
					if (cbtSourceID >= 300000 && m_ArmoryData->m_UnitData[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].m_Class == 5) // its a mage!
					{
						querySATA.AttachValues(SATACount,cbtAbilityID, satReference[bufferRefSAT]);
						kicks.push_back(std::make_pair(bufferRefSATA, static_cast<int>(uTS - StartTime)));
						doneComb[bufferRefSATA] = true;
						sataReference[bufferRefSATA] = SATACount;
						SataReferenceReverse.insert(std::make_pair(SATACount, std::make_pair(cbtAbilityID, satReference[bufferRefSAT])));
						++SATACount;
					}
					else
					{
						std::cout << "Unknown interrupt from: " << m_CBTLogParser->mNameValues[cbtLogEvent.m_Source] << std::endl;
					}
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::BeginCast))
				{
					// Note: Cant differentiate more of the same npc casting this ability!
					// Workaround: Learn all abilities with their casting time?
					if (WasKicked[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] != 0)
					{
						int cbtSourceID = WasKickedInfo[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].first.first;
						int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
						int cbtAbilityID = WasKickedInfo[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].first.second;
						int cbtTargetAbilityID = DBAccess.GetAbilityID(WasKickedInfo[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].second.first);
						if (cbtSourceID <= 0) continue;
						if (cbtTargetID <= 0) continue;
						if (cbtAbilityID <= 0) continue;
						if (cbtTargetAbilityID <= 0) continue;
						DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
						if (!doneCombSA[bufferRefSA])
						{
							querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
							doneCombSA[bufferRefSA] = true;
							saReference[bufferRefSA] = SACount;
							saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
							++SACount;
						}
						DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
						if (!doneCombSAT[bufferRefSAT])
						{
							querySAT.AttachValues(SATCount,cbtTargetID, saReference[bufferRefSA]);
							doneCombSAT[bufferRefSAT] = true;
							satReference[bufferRefSAT] = SATCount;
							satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(cbtTargetID, saReference[bufferRefSA])));
							++SATCount;
						}

						DBAccess.PackMapKey(bufferRefSATA, 4, cbtSourceID, cbtAbilityID, cbtTargetID, cbtTargetAbilityID);
						if (!doneComb[bufferRefSATA])
						{
							querySATA.AttachValues(SATACount,cbtTargetAbilityID, satReference[bufferRefSAT]);
							doneComb[bufferRefSATA] = true;
							sataReference[bufferRefSATA] = SATACount;
							SataReferenceReverse.insert(std::make_pair(SATACount, std::make_pair(cbtTargetAbilityID, satReference[bufferRefSAT])));
							++SATACount;
							kicks.push_back(std::make_pair(bufferRefSATA, WasKickedInfo[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].second.second));
						}
					}

					PotentialKick[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] = uTS;
					PotentialKickAb[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]] = DBAccess.m_AbilityNames[cbtLogEvent.m_Ability];
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Cast))
				{
					if (!m_DirectDispels[DBAccess.m_AbilityNames[cbtLogEvent.m_Ability]]) continue;
					DispelCasts.push_back(std::make_pair(std::make_pair(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], m_CBTLogParser->mNameValues[cbtLogEvent.m_Target]), std::make_pair(cbtLogEvent.m_Ability, uTS)));
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Removed))
				{
					PotentialDispels.push_back(std::make_pair(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], std::make_pair(cbtLogEvent.m_Ability, uTS)));
				}
				
				if (cbtLogEvent.m_Action == static_cast<char>(Action::Gain) && cbtLogEvent.m_Amount > 0 
					&& cbtLogEvent.m_AmountType != static_cast<char>(AmountType::None)
					&& cbtLogEvent.m_AmountType != static_cast<char>(AmountType::Happiness)
					&& cbtLogEvent.m_AmountType != static_cast<char>(AmountType::Focus)
					&& cbtLogEvent.m_AmountType != static_cast<char>(AmountType::Unknown)
					&& ((cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Mana) && cbtLogEvent.m_Amount > 500)
					|| (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health) && cbtLogEvent.m_Amount > 2000)
					|| ((cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Rage) || cbtLogEvent.m_AmountType != static_cast<char>(AmountType::Energy)) && cbtLogEvent.m_Amount > 10)
					|| cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Attack)
					)
					)
					// All kinds of potion
					// Mana could be complicated :/
					// Using a high amount might reduce false positives
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					int cbtTargetID = cbtSourceID;
					int cbtAbilityID = cbtLogEvent.m_Ability;
					if (cbtSourceID <= 0) continue;
					if (cbtTargetID <= 0) continue;
					if (cbtAbilityID <= 0) continue;
					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					if (!doneCombSA[bufferRefSA])
					{
						querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
						doneCombSA[bufferRefSA] = true;
						saReference[bufferRefSA] = SACount;
						saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
						++SACount;
					}
					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
					if (!doneCombSAT[bufferRefSAT])
					{
						querySAT.AttachValues(SATCount,cbtTargetID, saReference[bufferRefSA]);
						doneCombSAT[bufferRefSAT] = true;
						satReference[bufferRefSAT] = SATCount;
						satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(cbtTargetID, saReference[bufferRefSA])));
						++SATCount;
					}
				}
			}
		}
		endCBTLoop:;

		// Lots potential to optimize!
		// Direct dispels!
		// TODO: Type check!
		// TODO: Amount check!
		for (auto& disp : DispelCasts) // We should go through this one in reverse!
		{
			for (auto& pot : PotentialDispels)
			{
				if (pot.second.second == 0) continue;
				if (pot.second.second + 40 < disp.second.second) continue; // 40 ms latency? Maybe add algo to find latency or add it to the addon?
				if (pot.second.second - 40 > disp.second.second) break;
				if (disp.first.second != pot.first) continue; // Target doesnt match!


				std::string name = disp.first.first;
				int cbtSourceID = GetTargetSourceID(DBAccess, name, 0);
				name = pot.first;
				int cbtTargetID = GetTargetSourceID(DBAccess, name, 0);
				//int cbtAbilityID = DBAccess.GetAbilityID(disp.second.first);
				int cbtAbilityID = disp.second.first;
				//int cbtTargetAbilityID = DBAccess.GetAbilityID(pot.second.first);
				int cbtTargetAbilityID = pot.second.first;

				if (cbtSourceID <= 0) continue;
				if (cbtTargetID <= 0) continue;
				if (cbtAbilityID <= 0) continue;
				if (cbtTargetAbilityID <= 0) continue;

				DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
				if (!doneCombSA[bufferRefSA])
				{
					querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
					doneCombSA[bufferRefSA] = true;
					saReference[bufferRefSA] = SACount;
					saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
					++SACount;
				}

				DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
				if (!doneCombSAT[bufferRefSAT])
				{
					querySAT.AttachValues(SATCount,cbtTargetID, saReference[bufferRefSA]);
					doneCombSAT[bufferRefSAT] = true;
					satReference[bufferRefSAT] = SATCount;
					satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(cbtTargetID, saReference[bufferRefSA])));
					++SATCount;
				}

				DBAccess.PackMapKey(bufferRefSATA, 4, cbtSourceID, cbtAbilityID, cbtTargetID, cbtTargetAbilityID);
				if (!doneComb[bufferRefSATA])
				{
					querySATA.AttachValues(SATACount,cbtTargetAbilityID, satReference[bufferRefSAT]);
					doneComb[bufferRefSATA] = true;
					sataReference[bufferRefSATA] = SATACount;
					SataReferenceReverse.insert(std::make_pair(SATACount, std::make_pair(cbtTargetAbilityID, satReference[bufferRefSAT])));
					++SATACount;
				}

				Dispels.push_back(std::make_pair(bufferRefSATA, static_cast<int>(disp.second.second - StartTime)));
				pot.second.second = 0;
			}
		}

		// Indirect dispels
		// TODO: Type check!
		for (auto& disp : IndirectDispelCastsVec)
		{
			for (auto& pot : PotentialDispels)
			{
				if (pot.second.second == 0) continue;
				if (pot.second.second + 40 < disp.second.second.first) continue; // 40 ms latency? Maybe add algo to find latency or add it to the addon?
				if (pot.second.second - 40 > disp.second.second.second) break;
				if (pot.first != disp.first) continue;

				int cbtSourceID = unknownPlayer; // Unknown source by default!
				std::string name = pot.first;
				int cbtTargetID = GetTargetSourceID(DBAccess, name, 0);;
				//int cbtAbilityID = DBAccess.GetAbilityID(disp.second.first);
				int cbtAbilityID = disp.second.first;
				//int cbtTargetAbilityID = DBAccess.GetAbilityID(pot.second.first);
				int cbtTargetAbilityID = pot.second.first;

				if (cbtSourceID <= 0) continue;
				if (cbtTargetID <= 0) continue;
				if (cbtAbilityID <= 0) continue;
				if (cbtTargetAbilityID <= 0) continue;

				DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
				if (!doneCombSA[bufferRefSA])
				{
					querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
					doneCombSA[bufferRefSA] = true;
					saReference[bufferRefSA] = SACount;
					saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
					++SACount;
				}
				DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
				if (!doneCombSAT[bufferRefSAT])
				{
					querySAT.AttachValues(SATCount,cbtTargetID, saReference[bufferRefSA]);
					doneCombSAT[bufferRefSAT] = true;
					satReference[bufferRefSAT] = SATCount;
					satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(cbtTargetID, saReference[bufferRefSA])));
					++SATCount;
				}

				DBAccess.PackMapKey(bufferRefSATA, 4, cbtSourceID, cbtAbilityID, cbtTargetID, cbtTargetAbilityID);
				if (!doneComb[bufferRefSATA])
				{
					querySATA.AttachValues(SATACount,cbtTargetAbilityID, satReference[bufferRefSAT]);
					doneComb[bufferRefSATA] = true;
					sataReference[bufferRefSATA] = SATACount;
					SataReferenceReverse.insert(std::make_pair(SATACount, std::make_pair(cbtTargetAbilityID, satReference[bufferRefSAT])));
					++SATACount;
				}

				Dispels.push_back(std::make_pair(bufferRefSATA, static_cast<int>(pot.second.second - StartTime)));
				pot.second.second = 0;
			}
		}

		for (auto& pot : PotentialDispels)
		{
			if (pot.second.second == 0) continue;
			// Unknown Spell and Source (Probably a totem?) => 25078
			int cbtSourceID = unknownPlayer; // Unknown source by default!
			std::string name = pot.first;
			int cbtTargetID = GetTargetSourceID(DBAccess, name, 0);
			int cbtAbilityID = 25078;
			//int cbtTargetAbilityID = DBAccess.GetAbilityID(pot.second.first);
			int cbtTargetAbilityID = pot.second.first;

			if (cbtTargetID <= 0) continue;
			if (cbtTargetAbilityID <= 0) continue;

			DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
			if (!doneCombSA[bufferRefSA])
			{
				querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
				doneCombSA[bufferRefSA] = true;
				saReference[bufferRefSA] = SACount;
				saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
				++SACount;
			}
			DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
			if (!doneCombSAT[bufferRefSAT])
			{
				querySAT.AttachValues(SATCount,cbtTargetID, saReference[bufferRefSA]);
				doneCombSAT[bufferRefSAT] = true;
				satReference[bufferRefSAT] = SATCount;
				satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(cbtTargetID, saReference[bufferRefSA])));
				++SATCount;
			}

			DBAccess.PackMapKey(bufferRefSATA, 4, cbtSourceID, cbtAbilityID, cbtTargetID, cbtTargetAbilityID);
			if (!doneComb[bufferRefSATA])
			{
				querySATA.AttachValues(SATACount,cbtTargetAbilityID, satReference[bufferRefSAT]);
				doneComb[bufferRefSATA] = true;
				sataReference[bufferRefSATA] = SATACount;
				SataReferenceReverse.insert(std::make_pair(SATACount, std::make_pair(cbtTargetAbilityID, satReference[bufferRefSAT])));
				++SATACount;
			}

			Dispels.push_back(std::make_pair(bufferRefSATA, static_cast<int>(pot.second.second - StartTime)));
			pot.second.second = 0;

			//std::cout << "Missing Dispel! " << pot.first << " => " << pot.second.first << std::endl;
		}

		for (auto& kick : kicks)
		{
			if (sataReference[kick.first] > 0 && kick.second > 0)
			{
				queryInterrupts.AttachValues(sataReference[kick.first], kick.second);
			}
			else
				std::cout << "Kicks: Bad params! => " << sataReference[kick.first] << " // " << kick.second << std::endl;
		}

		for (auto& disp : Dispels)
		{
			if (sataReference[disp.first] > 0 && disp.second > 0)
				queryDispels.AttachValues(sataReference[disp.first], disp.second);
			else
				std::cout << "Dispels: Bad params! => " << sataReference[disp.first] << " // " << disp.second << std::endl;
		}

		querySA.Flush();
		querySAT.Flush();
		querySATA.Flush();

		querySA.Flush();
		querySAT.Flush();
		querySATA.Flush();

		queryInterrupts.Flush();
		queryDispels.Flush();

		std::cout << "SATCOUNT: " << SATCount << std::endl;
	}

	void Analyzer::FetchAttempts(DatabaseAccess& DBAccess, long long StartTime, long long EndTime, int RS_UploaderID, int RaidingGuildID, int InstanceID, std::map<std::pair<int, int>, std::pair<long long, long long>>& bossAttempts, std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>>& m_Attempts)
	{
		std::pair<SessionLine*, SessionLine*> m_Attempt;
		auto query = m_DB->ExecuteStreamStatement("INSERT INTO rs_attempts (npcid, start, end, uploaderid,killed) VALUES (:a<int>, :b<int>, :c<int>, :d<int>, :e<int>)", 1);
		auto queryAtSel = m_DB->ExecuteStreamStatement("SELECT id FROM rs_attempts WHERE npcid=:a<int> and start=:n<int> and end=:c<int> and uploaderid=:d<int>", 1);
		auto querySKIns = m_DB->ExecuteStreamStatement("INSERT INTO rs_guilds_speedkills (attemptid) VALUES (:d<int>)", 10);
		auto querySKBIns = m_DB->ExecuteStreamStatement("INSERT INTO rs_guilds_speedkills_best (attemptid) VALUES (:d<int>)", 10);
		auto querySKBSel = m_DB->ExecuteStreamStatement("SELECT (b.end-b.start) FROM rs_guilds_speedkills_best a LEFT JOIN rs_attempts b ON a.attemptid = b.id LEFT JOIN rs_instance_uploader c ON b.uploaderid = c.id LEFT JOIN rs_instances d ON c.instanceid = d.id WHERE d.guildid=:a<int> and b.npcid=:b<int> ORDER BY a.id DESC LIMIT 1", 1);
		auto queryCurrentProgressCount = m_DB->ExecuteStreamStatement("SELECT MAX(id) FROM am_guilds_progresshistory", 1, true);
		int curCount = 0;
		if (queryCurrentProgressCount.HasData())
			queryCurrentProgressCount.ReadData(&curCount);
		queryCurrentProgressCount.CompleteStatement();
		auto queryProgressHistory = m_DB->ExecuteStreamStatement("INSERT IGNORE INTO am_guilds_progresshistory (id, guildid, instanceid, npcid, attemptid) VALUES (:q<int>, :a<int>, :b<int>, :c<int>, :d<int>)", 1);
		std::vector<SessionLine*>::iterator ptr = m_RaidData.begin();
		std::vector<SessionLine*>::iterator end = m_RaidData.end();
		while ((m_Attempt = GetNextAttempt(DBAccess, ptr, end, bossAttempts)).first != nullptr && m_Attempt.second != nullptr) // An attempt maybe lost here!
		{
			// Regarding the npcid:
			// Either first entry is a boss entry or its 0 => Trash
			int Attempt_NPCID = 3;
			std::string npc = "";
			if (m_Attempt.first->m_Type == 10 && m_Attempt.first->mS_Param != nullptr && DBAccess.IsBossNPC(*m_Attempt.first->mS_Param))
			{
				Attempt_NPCID = DBAccess.GetNPCID(*m_Attempt.first->mS_Param);
				npc = *m_Attempt.first->mS_Param;
			}
			else if (m_Attempt.second->m_Type == 24 && m_Attempt.first->mS_Param != nullptr && DBAccess.IsBossNPC(*m_Attempt.first->mS_Param)) // TODO
			{
				Attempt_NPCID = DBAccess.GetNPCID(*m_Attempt.second->mS_Param);
				npc = *m_Attempt.second->mS_Param;
			}

			if (Attempt_NPCID == 0)
				Attempt_NPCID = 3;

			__int64 atmtStart = m_Attempt.first->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[m_Attempt.first->m_RTIndex];
			__int64 atmtEnd = m_Attempt.second->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[m_Attempt.second->m_RTIndex];
			if (Attempt_NPCID > 3)
			{
				// Lets look for the real start and end timestamps!
				__int64 atmtBeforeStart = m_Attempts.size() > 0 ? m_ArmoryData->m_Parser->m_RealTime[m_Attempts.back().second.second->m_RTIndex] + m_Attempts.back().second.second->m_TimeStamp : 0;
				// Before: Must be after attempt before!
				// After: Not necessarry I believe
				for (auto& CBTLogVec : m_CombatLogEvents)
				{
					for (auto& cbtLogEvent : CBTLogVec)
					{
						__int64 uTS = cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex];
						if (uTS < atmtBeforeStart) continue;
						if (uTS > atmtStart) break;
						if (cbtLogEvent.m_Action > static_cast<char>(Action::Reflects)) continue;
						if (m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == npc || m_CBTLogParser->mNameValues[cbtLogEvent.m_Source] == npc)
						{
							atmtStart = uTS;
							goto foundAtmtStart;
						}
					}
				}
				foundAtmtStart:;
				for (auto& CBTLogVec : m_CombatLogEvents)
				{
					for (auto& cbtLogEvent : CBTLogVec)
					{
						__int64 uTS = cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex];
						if (uTS < atmtEnd) continue;
						if (uTS > atmtEnd + 10000) break;
						if (cbtLogEvent.m_Action > static_cast<char>(Action::Reflects)) continue;
						if (m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == npc) // To prevent after hot dmg by bosses
						{
							atmtEnd = uTS;
						}
					}
				}
			}

			// Insert into rs_attempts
			query.AttachValues(Attempt_NPCID, static_cast<int>(atmtStart - StartTime), static_cast<int>(atmtEnd - StartTime), RS_UploaderID, (Attempt_NPCID > 3 && (m_Attempt.second->m_Type == 24 || m_Attempt.second->m_Type == 10)) ? 1 : 0);

			// Retrieve the attemptid
			int AttemptID = 0;
			queryAtSel.AttachValues(Attempt_NPCID, static_cast<int>(atmtStart - StartTime), static_cast<int>(atmtEnd - StartTime), RS_UploaderID);
			if (queryAtSel.HasData())
				queryAtSel.ReadData(&AttemptID);

			// Check if an boss attempt and if so, a kill?
			if (Attempt_NPCID > 3 && (m_Attempt.second->m_Type == 24 || (m_Attempt.second->m_Type == 10)) && AttemptID != 0) // Is boss kill attempt
			{
				//std::cout << *m_Attempt.second->mS_Param << " => " << Attempt_NPCID << " => " << (atmtEnd-atmtStart)/1000 << std::endl;
				bossAttempts.insert(std::make_pair(std::make_pair(AttemptID, Attempt_NPCID), std::make_pair(atmtStart, atmtEnd)));

				// Guild progresshistory
				queryProgressHistory.AttachValues(++curCount, RaidingGuildID, InstanceID, Attempt_NPCID, AttemptID);

				// Guild speedkills
				querySKIns.AttachValues(AttemptID);

				// Best speed guild kills
				querySKBSel.AttachValues(RaidingGuildID, Attempt_NPCID);
				if (querySKBSel.HasData())
				{
					//int BestID;
					int BestKill;
					querySKBSel.ReadData(&BestKill);
					//query.ReadData(&BestID);
					if (BestKill > (m_Attempt.second->m_TimeStamp - m_Attempt.first->m_TimeStamp))
					{
						querySKBIns.AttachValues(AttemptID);
					}
				}
				else
				{
					querySKBIns.AttachValues(AttemptID);
				}
			}
			m_Attempts.push_back(std::make_pair(AttemptID, std::move(m_Attempt)));
		}
		query.Flush();
		querySKBIns.Flush();
		querySKIns.Flush();

		// Adding Inbetween attempts
		// New NPC 4 => Inbetween attempt

		std::pair<SessionLine*, SessionLine*>* lastPair = nullptr;
		for (auto& atmt : m_Attempts)
		{
			if (lastPair != nullptr
				&& m_ArmoryData->m_Parser->m_RealTime[atmt.second.first->m_RTIndex] + atmt.second.first->m_TimeStamp - (m_ArmoryData->m_Parser->m_RealTime[lastPair->second->m_RTIndex] + lastPair->second->m_TimeStamp) >= 1000
				)
			{
				query.AttachValues(4, static_cast<int>(m_ArmoryData->m_Parser->m_RealTime[lastPair->second->m_RTIndex] + lastPair->second->m_TimeStamp - StartTime), static_cast<int>(m_ArmoryData->m_Parser->m_RealTime[atmt.second.first->m_RTIndex] + atmt.second.first->m_TimeStamp - StartTime), RS_UploaderID, 0);
			}
			lastPair = &atmt.second;
		}
		if (lastPair != nullptr && // After Last attempt
			EndTime - (m_ArmoryData->m_Parser->m_RealTime[lastPair->second->m_RTIndex] + lastPair->second->m_TimeStamp) >= 1000)
			query.AttachValues(4, static_cast<int>(m_ArmoryData->m_Parser->m_RealTime[lastPair->second->m_RTIndex] + lastPair->second->m_TimeStamp - StartTime), static_cast<int>(EndTime - StartTime), RS_UploaderID, 0);
		if (m_Attempts.size() > 0)
		{
			lastPair = &m_Attempts.front().second;
			if (lastPair != nullptr && // Before first attempt
				(m_ArmoryData->m_Parser->m_RealTime[lastPair->second->m_RTIndex] + lastPair->second->m_TimeStamp) - StartTime >= 1000)
				query.AttachValues(4, 0, static_cast<int>(m_ArmoryData->m_Parser->m_RealTime[lastPair->second->m_RTIndex] + lastPair->second->m_TimeStamp - StartTime), RS_UploaderID, 0);
		}
		query.Flush();


		st_rrd_chardata.clear();
		st_rrd_ptr = bossAttempts.begin();
		st_rrd_end = bossAttempts.end();
	}

	void Analyzer::FetchCombatLogData(DatabaseAccess& DBAccess, long long StartTime, long long EndTime, int RS_ProgressID, int RS_UploaderID, MySQLStream& queryProgress, std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference, std::map<int, std::pair<int, int>>& saReferenceReverse, int RS_MAX_Damage, std::map<int, int>& specs, int Faction)
	{
		std::string bufferRefSA(8, '\0');
		std::string bufferRefSAT(12, '\0');
		std::string bufferRefSATA(16, '\0');

		std::vector<SessionLine*> healEvents;
		int cunt = 0;
		for (auto itr = m_RaidData.begin(); itr != m_RaidData.end(); ++itr)
		{
			if ((*itr)->m_Type == 8)
			{
				++cunt;

				// Generating a list of heal events
				healEvents.push_back((*itr));
			}
		}

		auto queryHeal = m_DB->ExecuteStreamStatement("INSERT INTO rs_healing (id,satid, hittype, timestamp, amount) VALUES (:q<int>, :a<int>, :b<int>, :c<int>, :d<int>)", 350000);
		auto queryDamage = m_DB->ExecuteStreamStatement("INSERT INTO rs_damage (id,satid, hittype, timestamp, amount) VALUES (:q<int>, :a<int>, :b<int>, :c<int>, :e<int>)", 1000000);
		auto queryMitgated = m_DB->ExecuteStreamStatement("INSERT INTO rs_damage_mitgated (dmgid, amount) VALUES (:a<int>, :b<int>)", 1000000);
		auto queryDeath = m_DB->ExecuteStreamStatement("INSERT INTO rs_deaths (sourceid, timestamp, uploaderid) VALUES (:a<int>, :b<int>, :c<int>)", 200);
		auto queryAuras = m_DB->ExecuteStreamStatement("INSERT INTO rs_auras (said, gained, faded) VALUES (:a<int>, :b<int>, :c<int>)", 15000);
		auto queryCasts = m_DB->ExecuteStreamStatement("INSERT INTO rs_casts (satid, timestamp) VALUES (:a<int>, :b<int>)", 300000);
		auto queryDamageThreat = m_DB->ExecuteStreamStatement("INSERT INTO rs_damage_threat (dmgid, amount) VALUES (:b<int>, :c<int>)", 300000);
		auto queryHealingThreat = m_DB->ExecuteStreamStatement("INSERT INTO rs_healing_threat (healid, amount) VALUES (:b<int>, :c<int>)", 100000);
		auto queryGainedThreat = m_DB->ExecuteStreamStatement("INSERT INTO rs_gained_threat (said, amount, timestamp) VALUES (:b<int>, :c<int>, :d<int>)", 50000);
		MySQLStream st_rrd_queryOne = m_DB->ExecuteStreamStatement("INSERT INTO rs_chars_rankings (charid, type, value, attemptid) VALUES (:a<int>, :c<int>, :d<int>, :e<int>)", 100);
		MySQLStream st_rrd_queryTwo = m_DB->ExecuteStreamStatement("SELECT ROUND(10000*(a.value/(b.end-b.start))) FROM rs_chars_rankings_best a LEFT JOIN rs_attempts b ON a.attemptid = b.id WHERE a.charid=:a<int> and b.npcid=:b<int> and a.type=:c<int> ORDER BY a.id DESC LIMIT 1", 1);
		MySQLStream st_rrd_queryThree = m_DB->ExecuteStreamStatement("INSERT INTO rs_chars_rankings_best (charid, type, value, attemptid) VALUES (:a<int>, :c<int>, :d<int>, :e<int>)", 100);
		MySQLStream st_rrd_queryFour = m_DB->ExecuteStreamStatement("DELETE a FROM rs_chars_rankings_best a JOIN rs_attempts b ON a.attemptid = b.id WHERE charid=:a<int> AND b.npcid = :b<int> and a.type = :c<int>", 1);
		MySQLStream st_rrd_queryFive = m_DB->ExecuteStreamStatement("SELECT a.id FROM rs_chars_rankings a JOIN rs_attempts b ON a.attemptid = b.id WHERE charid=:a<int> AND b.npcid = :b<int> and a.type = :c<int> ORDER BY a.id DESC", 100);
		MySQLStream st_rrd_querySix = m_DB->ExecuteStreamStatement("DELETE FROM rs_chars_rankings WHERE id = :a<int>",1);

		auto HasWarlockT3SetBonus = m_DB->ExecuteStreamStatement("SELECT d.itemid FROM rpll.gn_chars a JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_gear c ON b.ref_gear = c.id JOIN am_chars_ref_gear_slot d ON d.id IN (head,shoulder,chest,waist,legs,feet,wrist,hands,ring1,ring2) WHERE a.id = :a<int>");
		// Calculating PMod For every player (Threat)
		std::map<int, double> PMod;
		auto calcBuffMod = [](ThreatMods& mods) -> double
		{
			double res = 1.0;
			if (mods.ArcaneShroud)
				res *= 0.3;
			if (mods.BattleStance || mods.BerserkerStance)
				res *= 0.8;
			else if (mods.DefensiveStance)
				res *= 1.3;
			if (mods.BlessingOfSalvation)
				res *= 0.7;
			if (mods.TranquilAirTotem)
				res *= 0.8;
			if (mods.TheEyeOfDiminution)
				res *= 0.65;
			return res;
		};

		std::map<int, std::pair<__int64, std::vector<std::pair<int, int>>>> DelayedThreat;
		std::map<int, ThreatMods> BuffMod;
		for (auto& player : m_ArmoryData->m_UnitData)
		{
			if (player.second.m_Owner > 0) continue;
			ThreatMods mods;

			if (player.second.m_Class == 6)
			{
				int num = 0;
				HasWarlockT3SetBonus.AttachValues(player.second.m_ID);
				while(HasWarlockT3SetBonus.HasData())
				{
					int item = 0;
					HasWarlockT3SetBonus.ReadData(&item);
					
					if (
						item == 22504 ||
						item == 22505 ||
						item == 22506 ||
						item == 22507 ||
						item == 22508 ||
						item == 22509 ||
						item == 22510 ||
						item == 22511 ||
						item == 23063
						)
					{
						++num;
					}
				}
				mods.WarlockT3SetBonus = num >= 6;
			}

			if (specs[player.second.m_ID] == 3) mods.DefensiveStance = true;
			else if (specs[player.second.m_ID] == 2) mods.BerserkerStance = true;
			else if (specs[player.second.m_ID] == 1) mods.BattleStance = true;

			BuffMod.insert(std::make_pair(player.second.m_ID, std::move(mods)));

			double mod = 1.0;
			if (player.second.m_Class == 0 && specs[player.second.m_ID] == 3)
				mod *= 1.15;
			else if (player.second.m_Class == 1)
				mod *= 0.71;
			else if (player.second.m_Class == 2)
			{
				if (specs[player.second.m_ID] == 9)
					mod *= 0.75;
				else
					mod *= 0.8;
			}
			else if (player.second.m_Class == 4 && specs[player.second.m_ID] == 15)
				mod *= 0.8;
			// Mage is special
			else if (player.second.m_Class == 6 && specs[player.second.m_ID] == 20)
				mod *= 0.8;
			// Warlock check if has T3 for crits?
			// Paladin is special
			else if (player.second.m_Class == 4 && specs[player.second.m_ID] == 15)
				mod *= 0.85;
		}

		std::map<int, __int64> GainedAuras;
		std::map<int, int> GainedAuraMappedToPlayer;
		std::pair<int, std::pair<__int64, __int64>> AuraInserter = std::make_pair(0, std::make_pair(0, 0));
		std::map<int, CombatLogEvent*> extraAttack;
		// Mitaged Damage
		//std::map<std::string, int> mitgated; // In vanilla there is only one type of mitgation that is reported

		// Size of the whole thing for progress updates
		int size = 0;
		for (auto& CBTLogVec : m_CombatLogEvents)
			size += static_cast<int>(CBTLogVec.size());
		size /= 10;
		int count = 0;
		int countTwo = 1;
		int counnt = 0;

		int maxDmg = GetMaxTableId("rs_damage");
		int maxHeal = GetMaxTableId("rs_healing");
		std::map<int, __int64> recentlyUsed;

		auto maxHackSunder = m_HackSunders.size();
		int hackSunderCount = 0;

		for (auto& CBTLogVec : m_CombatLogEvents)
		{
			for (auto& cbtLogEvent : CBTLogVec)
			{
				__int64 uTS = cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex];
				
				if (uTS <= 0) continue;

				for (;hackSunderCount < maxHackSunder && m_HackSunders[hackSunderCount].first < uTS; ++hackSunderCount)
				{
					if (m_HackSunders[hackSunderCount].first + 1000 >= uTS)
					{
						RetrieveRecordData(DBAccess, m_HackSunders[hackSunderCount].first, 2, m_HackSunders[hackSunderCount].second.second, m_HackSunders[hackSunderCount].second.first, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
					}
				}
				
				if (count == size)
				{
					count = 0;
					queryProgress.AttachValues(30 + countTwo * 5, RS_ProgressID);
					++countTwo;
				}
				++count;
				if (uTS < StartTime) continue;
				if (uTS > EndTime) goto endInnerLoop;
				
				// HEAL
				if (/*cbtLogEvent.m_Action == static_cast<char>(Action::Heal) || */
					cbtLogEvent.m_Action <= static_cast<char>(Action::CritHeal)
					|| (cbtLogEvent.m_Action == static_cast<char>(Action::Gain) && cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health))
					)
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					if (cbtSourceID <= 0) continue;
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, 0, 0, true);
					if (cbtTargetID <= 0) continue;
					//int cbtAbilityID = DBAccess.GetAbilityID(cbtLogEvent.m_Ability);
					int cbtAbilityID = cbtLogEvent.m_Ability;
					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
					if (satReference[bufferRefSAT] == 0) continue;

					if (cbtAbilityID == 23394)
						cbtLogEvent.m_Amount = 1;

					double extraMod = 1.0;
					if (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::HolyDamage) && BuffMod[cbtSourceID].RighteousFury)
					{
						if (specs[cbtSourceID] == 23)
							extraMod *= 1.9;
						else
							extraMod *= 1.6;
					}

					//std::cout << "------------------------------------------" << std::endl;
					for (auto& sess : GetPossibleEvents(m_ArmoryData->m_Parser->m_RealTime, healEvents, 999, uTS))
					{
						if (
							cbtLogEvent.m_Amount == (*sess)->mI_Param[0]
							&& (DBAccess.m_AbilityNames[cbtLogEvent.m_Ability] == (*sess)->mS_Param[0] || DBAccess.m_AbilityNames[cbtLogEvent.m_Ability] == (*sess)->mS_Param[0] + " (HoT)" || ((*sess)->mS_Param[0] == "Chain Heal" && (cbtLogEvent.m_Ability == 105651 || cbtLogEvent.m_Ability == 105652)))
							&& (*sess)->m_Players[0]->_name.size() <= 200 && m_CBTLogParser->mNameValues[cbtLogEvent.m_Source] == (*sess)->m_Players[0]->_name
							&& ((!(*sess)->mS_Param[1].empty() && m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == (*sess)->mS_Param[1]) || ((*sess)->mS_Param[1].empty() && m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == (*sess)->m_Players[1]->_name))
							) // Our best guess!
						{
							++counnt;

							if (cbtAbilityID == 23394)
								(*sess)->mI_Param[1] = 1;

							if (cbtLogEvent.m_Amount > (*sess)->mI_Param[1])
							{
								queryHeal.AttachValues(maxHeal, satReference[bufferRefSAT], ActionToInt(static_cast<Action>(cbtLogEvent.m_Action)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount - (*sess)->mI_Param[1]);
								RetrieveRecordData(DBAccess, uTS, 1, cbtLogEvent.m_Amount - (*sess)->mI_Param[1], m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
								
								if (cbtSourceID >= 300000)
								{
									queryHealingThreat.AttachValues(maxHeal, static_cast<int>(100.0*(PMod[cbtSourceID] == 0 ? 1.0 : PMod[cbtSourceID]) * calcBuffMod(BuffMod[cbtSourceID])*extraMod*0.5*(m_ArmoryData->m_UnitData[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].m_Class == 7 ? 0.5 : 1.0)*(cbtLogEvent.m_Amount - (*sess)->mI_Param[1])));
									RetrieveRecordData(DBAccess, uTS, 2, static_cast<int>(100.0*(PMod[cbtSourceID] == 0 ? 1.0 : PMod[cbtSourceID]) * calcBuffMod(BuffMod[cbtSourceID])*extraMod*0.5*(m_ArmoryData->m_UnitData[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].m_Class == 7 ? 0.5 : 1.0)*(cbtLogEvent.m_Amount - (*sess)->mI_Param[1])), m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
								}
								++maxHeal;
							}
							if ((*sess)->mI_Param[1] > 0)
							{
								queryHeal.AttachValues(maxHeal,satReference[bufferRefSAT], 10 + ActionToInt(static_cast<Action>(cbtLogEvent.m_Action)), static_cast<int>(uTS - StartTime), (*sess)->mI_Param[1]);
								++maxHeal;
							}

							healEvents.erase(sess);
							goto foundSyncHeal;
						}
						/*else
						{
							if (cbtLogEvent.m_Amount == (*sess)->mI_Param[0])
							{
								if (!((DBAccess.m_AbilityNames[cbtLogEvent.m_Ability] == (*sess)->mS_Param[0] || DBAccess.m_AbilityNames[cbtLogEvent.m_Ability] == (*sess)->mS_Param[0] + " (HoT)" || ((*sess)->mS_Param[0] == "Chain Heal" && (cbtLogEvent.m_Ability == 105651 || cbtLogEvent.m_Ability == 105652)))))
								{
									if ((*sess)->mS_Param[0].size() > 200)
										std::cout << "Ability way too long o.o" << std::endl;
									else
										std::cout << "Ability doesnt match: " << (*sess)->mS_Param[0] << " vs. " << DBAccess.m_AbilityNames[cbtLogEvent.m_Ability] << std::endl;
								}
								else if (!(((!(*sess)->mS_Param[1].empty() && m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == (*sess)->mS_Param[1]) || ((*sess)->mS_Param[1].empty() && m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == (*sess)->m_Players[1]->_name))))
								{
									std::cout << "Target doesnt match: " << m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] << " vs " << ((*sess)->mS_Param[1].empty() ? (*sess)->m_Players[1]->_name : (*sess)->mS_Param[1]) << std::endl;
								}
								else if (!(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source] == (*sess)->m_Players[0]->_name))
								{
									if ((*sess)->m_Players[0] == nullptr)
										std::cout << "Player nullptr o.o " << std::endl;
									else if ((*sess)->m_Players[0]->_name.size() >= 200)
										std::cout << "Player name size too long o.o" << std::endl;
									else
										std::cout << "Source doesnt match: " << m_CBTLogParser->mNameValues[cbtLogEvent.m_Source] << " vs. " << (*sess)->m_Players[0]->_name << std::endl;
								}
							}
						}*/
					}
					//std::cout << "------------------------------------------" << std::endl;
					// Pure effective heal
					queryHeal.AttachValues(maxHeal, satReference[bufferRefSAT], ActionToInt(static_cast<Action>(cbtLogEvent.m_Action)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
					RetrieveRecordData(DBAccess, uTS, 1, cbtLogEvent.m_Amount, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);

					if (cbtSourceID >= 300000)
					{
						queryHealingThreat.AttachValues(maxHeal, static_cast<int>(100.0*(PMod[cbtSourceID] == 0 ? 1.0 : PMod[cbtSourceID])*calcBuffMod(BuffMod[cbtSourceID])*extraMod*0.5*(m_ArmoryData->m_UnitData[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].m_Class == 7 ? 0.5 : 1.0)*cbtLogEvent.m_Amount));
						RetrieveRecordData(DBAccess, uTS, 2, static_cast<int>(100.0*(PMod[cbtSourceID] == 0 ? 1.0 : PMod[cbtSourceID])*calcBuffMod(BuffMod[cbtSourceID])*extraMod*0.5*(m_ArmoryData->m_UnitData[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].m_Class == 7 ? 0.5 : 1.0)*cbtLogEvent.m_Amount), m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
					}
					++maxHeal;
					foundSyncHeal:;

					// This structure maps sa to a timestamp.
					// We make sure that aoe abilities are just counted once!
					// Dont count Blood thirst as healing tick
					if (cbtAbilityID != 23892)
					{
						DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
						if (uTS - recentlyUsed[saReference[bufferRefSA]] >= 50) // 50 ms
						{
							queryCasts.AttachValues(satReference[bufferRefSAT], static_cast<int>(uTS - StartTime));
							recentlyUsed[saReference[bufferRefSA]] = uTS;
						}
					}
				}
				// DAMAGE
				else if (
					(cbtLogEvent.m_Action >= static_cast<char>(Action::Hit) && cbtLogEvent.m_Action <= static_cast<char>(Action::Reflects))
					|| cbtLogEvent.m_AmountType <= static_cast<char>(AmountType::HolyDamage)
					|| (cbtLogEvent.m_Action == static_cast<char>(Action::Drain) && cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health))
					)
				{

					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					if (cbtSourceID <= 0) continue;

					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS);
					if (cbtTargetID <= 0) continue;

					if (cbtSourceID < 300000)
						cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, 0, 0, cbtTargetID < 300000);
					if (cbtTargetID < 300000)
						cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, 0, 0, cbtSourceID < 300000);
						

					if (cbtTargetID >= 300000 && cbtSourceID >= 300000)
						cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, true);

					if (cbtSourceID == cbtTargetID) // Mced pet hits itself?
						cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, true);

					//int cbtAbilityID = DBAccess.GetAbilityID(cbtLogEvent.m_Ability);
					int cbtAbilityID = cbtLogEvent.m_Ability;
					if (cbtLogEvent.m_Ability == 47490 && extraAttack.find(cbtSourceID) != extraAttack.end() && extraAttack[cbtSourceID]->m_Amount > 0)
					{
						__int64 extraAttackTs = m_CBTLogParser->mRealTime[extraAttack[cbtSourceID]->m_RTIndex] + extraAttack[cbtSourceID]->m_Timestamp;
						if (uTS - 300 <= extraAttackTs)
						{
							--extraAttack[cbtSourceID]->m_Amount;
							//cbtAbilityID = DBAccess.GetAbilityID(extraAttack[cbtSourceID]->m_Ability);
							cbtAbilityID = extraAttack[cbtSourceID]->m_Ability;
							if (cbtAbilityID <= 0) continue;
						}
					}
					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
					if (satReference[bufferRefSAT] == 0) continue;


					if (cbtLogEvent.m_Action == static_cast<char>(Action::Missed))
					{
						if (cbtLogEvent.m_ExtraModifier == static_cast<char>(ExtraModifier::None))
							queryDamage.AttachValues(maxDmg,satReference[bufferRefSAT], static_cast<int>(12), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
						else
							queryDamage.AttachValues(maxDmg, satReference[bufferRefSAT], ExtraModToInt(static_cast<ExtraModifier>(cbtLogEvent.m_ExtraModifier)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
					}
					else if (cbtLogEvent.m_Action == static_cast<char>(Action::Hit) || cbtLogEvent.m_Action == static_cast<char>(Action::Suffers) || cbtLogEvent.m_Action == static_cast<char>(Action::Drain))
					{
						queryDamage.AttachValues(maxDmg, satReference[bufferRefSAT], 20 + ExtraModToInt(static_cast<ExtraModifier>(cbtLogEvent.m_ExtraModifier)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
					}
					else
					{
						queryDamage.AttachValues(maxDmg, satReference[bufferRefSAT], 40 + ExtraModToInt(static_cast<ExtraModifier>(cbtLogEvent.m_ExtraModifier)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
					}

					if (cbtTargetID < 300000 && (DBAccess.m_NPCLiking[cbtTargetID] == 0 || cbtTargetID == 13020 ||
						(DBAccess.m_NPCLiking[cbtTargetID] != Faction && DBAccess.m_NPCLiking[cbtTargetID] != Faction + 2)
						)) // Dont allow friendly fire!
						RetrieveRecordData(DBAccess, uTS, 0, cbtLogEvent.m_Amount, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);

					if (cbtLogEvent.m_Extra > 0)
						queryMitgated.AttachValues(maxDmg, cbtLogEvent.m_Extra);

					// According to my investigations the fixed amount of threat is divided by the number of targets
					// In order to calculate that I need to delay the execution and count the number of targets of a spell
					if (cbtSourceID >= 300000 && cbtTargetID < 300000)
					{
						if (cbtAbilityID == 11581 || cbtAbilityID == 11608) // Thunder Clap or Cleave
						{
							DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
							if (DelayedThreat.find(saReference[bufferRefSA]) == DelayedThreat.end())
							{
								std::vector<std::pair<int, int>> ttable;
								ttable.push_back(std::make_pair(maxDmg, cbtLogEvent.m_Amount));
								DelayedThreat[saReference[bufferRefSA]] = std::make_pair(uTS, std::move(ttable));
							}
							else
							{
								if (DelayedThreat[saReference[bufferRefSA]].first + 50 >= uTS)
								{
									DelayedThreat[saReference[bufferRefSA]].second.push_back(std::make_pair(satReference[bufferRefSAT], cbtLogEvent.m_Amount));
								}
								else
								{
									// A new occourance so add id to the db
									int fixed = static_cast<int>(1.0*m_ThreatTable[cbtAbilityID] / DelayedThreat[saReference[bufferRefSA]].second.size());
									for (auto& abil : DelayedThreat[saReference[bufferRefSA]].second)
									{
										queryDamageThreat.AttachValues(abil.first, static_cast<int>(100.0*(PMod[cbtSourceID] == 0 ? 1.0 : PMod[cbtSourceID]) * calcBuffMod(BuffMod[cbtSourceID])*(fixed + abil.second)));
										// Wont be super accurate but oh well
										RetrieveRecordData(DBAccess, DelayedThreat[saReference[bufferRefSA]].first, 2, static_cast<int>(100.0*(PMod[cbtSourceID] == 0 ? 1.0 : PMod[cbtSourceID]) * calcBuffMod(BuffMod[cbtSourceID])*(fixed + abil.second)), m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
									}
									DelayedThreat[saReference[bufferRefSA]].second.clear();
									DelayedThreat[saReference[bufferRefSA]].first = uTS;
									DelayedThreat[saReference[bufferRefSA]].second.push_back(std::make_pair(satReference[bufferRefSAT], cbtLogEvent.m_Amount));
								}
							}
						}
						else
						{
							double extraMod = 1.0;
							if (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::ArcaneDamage) && specs[cbtSourceID] == 16)
								extraMod *= 0.6;
							else if (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::FireDamage) && specs[cbtSourceID] == 17)
								extraMod *= 0.7;
							else if (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::FrostDamage) && specs[cbtSourceID] == 18)
								extraMod *= 0.7;
							else if (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::ShadowDamage) && specs[cbtSourceID] == 9)
								extraMod *= 0.75;
							else if (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::HolyDamage) && BuffMod[cbtSourceID].RighteousFury)
							{
								if (specs[cbtSourceID] == 23)
									extraMod *= 1.9;
								else
									extraMod *= 1.6;
							}

							if (BuffMod[cbtSourceID].WarlockT3SetBonus)
							{
								if (cbtLogEvent.m_Action == static_cast<char>(Action::Crit) ||
									cbtLogEvent.m_Ability == 105551 ||
									cbtLogEvent.m_Ability == 105597 ||
									cbtLogEvent.m_Ability == 105589 ||
									cbtLogEvent.m_Ability == 18265 // DOT ability not recorded yet?
									)
									extraMod *= 0.75;
							}

							queryDamageThreat.AttachValues(maxDmg, static_cast<int>(100.0*(PMod[cbtSourceID] == 0 ? 1.0 : PMod[cbtSourceID]) * calcBuffMod(BuffMod[cbtSourceID])*extraMod*(m_ThreatTable[cbtAbilityID] + cbtLogEvent.m_Amount)));
							RetrieveRecordData(DBAccess, uTS, 2, static_cast<int>(100.0*(PMod[cbtSourceID] == 0 ? 1.0 : PMod[cbtSourceID]) * calcBuffMod(BuffMod[cbtSourceID])*extraMod*(m_ThreatTable[cbtAbilityID] + cbtLogEvent.m_Amount)), m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
						}
					}

					++maxDmg;
					// This structure maps sa to a timestamp.
					// We make sure that aoe abilities are just counted once!
					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					if (cbtAbilityID != 47490 && uTS - recentlyUsed[saReference[bufferRefSA]] >= 50) // 50 ms
					{
						queryCasts.AttachValues(satReference[bufferRefSAT], static_cast<int>(uTS - StartTime));
						recentlyUsed[saReference[bufferRefSA]] = uTS;
					}


					//std::string key = std::to_string(satReference[bufferRefSAT]) + ',' + std::to_string(static_cast<int>(uTS - StartTime)) + ',' + std::to_string(cbtLogEvent.m_Amount);
					//mitgated.insert(std::make_pair(std::move(key), cbtLogEvent.m_Extra));
				}
				
				// DEATH
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Dies))
				{
					int cbtSourceID = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					if (cbtSourceID <= 0) continue;
					queryDeath.AttachValues(cbtSourceID, static_cast<int>(uTS - StartTime), RS_UploaderID);

					// If a unit dies all buffs fade
					auto copy(GainedAuraMappedToPlayer);
					for (auto& aura : copy)
					{
						if (aura.second == cbtSourceID)
						{
							AuraInserter = std::make_pair(saReference[bufferRefSA], std::make_pair(GainedAuras[aura.first], uTS));
							GainedAuraMappedToPlayer.erase(aura.first);
							GainedAuras.erase(aura.first);
						}
					}
				}
				// AURAS
				else if ((cbtLogEvent.m_Action == static_cast<char>(Action::Gain) || cbtLogEvent.m_Action == static_cast<char>(Action::AfflictedBy)))
				{
					//int SourceID = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					int SourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					if (SourceID <= 0) continue;
					//int AbilityID = DBAccess.GetAbilityID(cbtLogEvent.m_Ability);
					int AbilityID = cbtLogEvent.m_Ability;
					DBAccess.PackMapKey(bufferRefSA, 2, SourceID, AbilityID);
					if (saReference[bufferRefSA] == 0) continue;

					// Threat mods!
					if (cbtLogEvent.m_Ability == 1038 || cbtLogEvent.m_Ability == 25895) // BoS
						BuffMod[SourceID].BlessingOfSalvation = true;
					else if (cbtLogEvent.m_Ability == 7165)
					{
						BuffMod[SourceID].BattleStance = true;
						BuffMod[SourceID].BerserkerStance = false;
						BuffMod[SourceID].DefensiveStance = false;
					}
					else if (cbtLogEvent.m_Ability == 7366)
					{
						BuffMod[SourceID].BattleStance = false;
						BuffMod[SourceID].BerserkerStance = true;
						BuffMod[SourceID].DefensiveStance = false;
					}
					else if (cbtLogEvent.m_Ability == 7164)
					{
						BuffMod[SourceID].BattleStance = false;
						BuffMod[SourceID].BerserkerStance = false;
						BuffMod[SourceID].DefensiveStance = true;
					}
					else if (cbtLogEvent.m_Ability == 106048)
						BuffMod[SourceID].TranquilAirTotem = true;
					else if (cbtLogEvent.m_Ability == 26400)
						BuffMod[SourceID].ArcaneShroud = true;
					else if (cbtLogEvent.m_Ability == 28862)
						BuffMod[SourceID].TheEyeOfDiminution = true;

					if (SourceID >= 300000 && cbtLogEvent.m_Amount > 0)
					{
						int am = static_cast<int>(100.0*ceil(PMod[SourceID] * calcBuffMod(BuffMod[SourceID])*0.5*(cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health) && m_ArmoryData->m_UnitData[m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]].m_Class == 7 ? 0.5 : 1.0)*cbtLogEvent.m_Amount));
						if (am > 0)
						{
							queryGainedThreat.AttachValues(saReference[bufferRefSA], am, static_cast<int>(uTS - StartTime));
							RetrieveRecordData(DBAccess, uTS, 2, am, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
						}
					}


					if (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Attack))
						extraAttack[SourceID] = &cbtLogEvent;
					if (cbtLogEvent.m_Ability == 10613 || cbtLogEvent.m_Ability == 10486)
					{
						cbtLogEvent.m_Amount = 1;
						extraAttack[SourceID] = &cbtLogEvent;
					}

					if (AuraInserter.first != 0 && (AuraInserter.first != saReference[bufferRefSA] || AuraInserter.second.second != cbtLogEvent.m_Timestamp))
						queryAuras.AttachValues(AuraInserter.first, static_cast<int>(AuraInserter.second.first - StartTime), static_cast<int>(AuraInserter.second.second - StartTime));
					AuraInserter.first = 0;

					auto foundID = GainedAuras.find(saReference[bufferRefSA]);
					if (foundID == GainedAuras.end())
					{
						GainedAuras.insert(std::make_pair(saReference[bufferRefSA], uTS));
						GainedAuraMappedToPlayer.insert(std::make_pair(saReference[bufferRefSA], SourceID));
					}
					else
					{
						// We've got an gain after an gain, so a refresh or a full new application?
						if (DBAccess.m_AbilityDuration[AbilityID] == 0 || foundID->second + DBAccess.m_AbilityDuration[AbilityID] > uTS) continue;
						// If we have another gain and the duration is up, we need to insert it according to the duration! That would be the better guess!	
						queryAuras.AttachValues(foundID->first, static_cast<int>(foundID->second - StartTime), static_cast<int>(foundID->second + DBAccess.m_AbilityDuration[AbilityID] - StartTime));
						GainedAuras.erase(foundID);
						GainedAuras.insert(std::make_pair(saReference[bufferRefSA], uTS));
					}
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Fades))
				{
					//int SourceID = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					int SourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					if (SourceID <= 0) continue;

					//int AbilityID = DBAccess.GetAbilityID(cbtLogEvent.m_Ability);
					int AbilityID = cbtLogEvent.m_Ability;
					DBAccess.PackMapKey(bufferRefSA, 2, SourceID, AbilityID);
					if (saReference[bufferRefSA] == 0) continue;

					// Threat mods!
					if (cbtLogEvent.m_Ability == 1038 || cbtLogEvent.m_Ability == 25895) // BoS
						BuffMod[SourceID].BlessingOfSalvation = false;
					else if (cbtLogEvent.m_Ability == 7165)
						BuffMod[SourceID].BattleStance = false;
					else if (cbtLogEvent.m_Ability == 7366)
						BuffMod[SourceID].BerserkerStance = false;
					else if (cbtLogEvent.m_Ability == 7164)
						BuffMod[SourceID].DefensiveStance = false;
					else if (cbtLogEvent.m_Ability == 106048)
						BuffMod[SourceID].TranquilAirTotem = false;
					else if (cbtLogEvent.m_Ability == 26400)
						BuffMod[SourceID].ArcaneShroud = false;
					else if (cbtLogEvent.m_Ability == 28862)
						BuffMod[SourceID].TheEyeOfDiminution = false;

					if ((cbtLogEvent.m_Ability == 10613 || cbtLogEvent.m_Ability == 10486) && extraAttack.find(SourceID) != extraAttack.end()) // Windfury Weapon?
						extraAttack[SourceID]->m_Amount = 0;

					auto foundID = GainedAuras.find(saReference[bufferRefSA]);
					if (foundID != GainedAuras.end())
					{
						// Special case: Someone gets an aura, as he loses it => Auras for example => Save space?
						// Treat it by adding this pair variable
						// queryAuras.AttachValues(saReference[bufferRefSA], foundID->second, cbtLogEvent.m_Timestamp);
						AuraInserter = std::make_pair(saReference[bufferRefSA], std::make_pair(foundID->second, uTS));
						// Erase this aura.
						GainedAuras.erase(foundID);
						GainedAuraMappedToPlayer.erase(foundID->first);
					}
					else
					{
						// We have found an fading aura that we didnt track ?
						// TODO: What to do?
					}

				}
				
				
				if (cbtLogEvent.m_Action == static_cast<char>(Action::Gain) && cbtLogEvent.m_Amount > 0
					&& cbtLogEvent.m_AmountType != static_cast<char>(AmountType::None)
					&& cbtLogEvent.m_AmountType != static_cast<char>(AmountType::Happiness)
					&& cbtLogEvent.m_AmountType != static_cast<char>(AmountType::Focus)
					&& cbtLogEvent.m_AmountType != static_cast<char>(AmountType::Unknown)
					&& ((cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Mana) && cbtLogEvent.m_Amount > 500)
						|| (cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health) && cbtLogEvent.m_Amount > 2000)
						|| ((cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Rage) || cbtLogEvent.m_AmountType != static_cast<char>(AmountType::Energy)) && cbtLogEvent.m_Amount > 10)
						|| cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Attack)
						)
					)
					// All kinds of potion
					// Mana could be complicated :/
					// Using a high amount might reduce false positives
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					int cbtTargetID = cbtSourceID;
					int cbtAbilityID = cbtLogEvent.m_Ability;
					if (cbtSourceID <= 0) continue;
					if (cbtTargetID <= 0) continue;
					if (cbtAbilityID <= 0) continue;
					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
					if (satReference[bufferRefSAT] == 0) continue;

					queryCasts.AttachValues(satReference[bufferRefSAT], static_cast<int>(uTS - StartTime));
				}

			}
		}
		endInnerLoop:;
		// Last remaining Aura
		if (AuraInserter.first != 0)
			queryAuras.AttachValues(AuraInserter.first, static_cast<int>(AuraInserter.second.first - StartTime), static_cast<int>(AuraInserter.second.second - StartTime));
		// Everything else was there until the end of the raid
		for (auto& aura : GainedAuras)
		{
			// We should rather give a lower estimate than an upper!
			queryAuras.AttachValues(aura.first, static_cast<int>(aura.second - StartTime), static_cast<int>(aura.second + DBAccess.m_AbilityDuration[saReferenceReverse[aura.first].second] - StartTime));
		}

		// Put remaining delayed into db
		for (auto& src : DelayedThreat)
		{
			int cbtSourceId = saReferenceReverse[src.first].first;
			int fixed = static_cast<int>(1.0*m_ThreatTable[saReferenceReverse[src.first].second] / src.second.second.size());;
			for (auto& abil : src.second.second)
			{
				queryDamageThreat.AttachValues(abil.first, static_cast<int>(100.0*(PMod[cbtSourceId] == 0 ? 1.0 : PMod[cbtSourceId]) * calcBuffMod(BuffMod[cbtSourceId])*(fixed + abil.second)));
			}
		}

		queryProgress.AttachValues(80, RS_ProgressID);

		queryHeal.Flush();
		queryDamage.Flush();
		queryDeath.Flush();
		queryAuras.Flush();
		queryCasts.Flush();
		queryDamageThreat.Flush();
		queryHealingThreat.Flush();
		queryGainedThreat.Flush();

		std::cout << "Overheal events total: " << cunt << std::endl;
		std::cout << "Overheal events skipped: " << healEvents.size() << std::endl;
		std::cout << "Overheal events found: " << counnt << std::endl;
		queryMitgated.Flush();
	}

	/*
	 * It will very much work like gaussen elemination
	 * 0. Estimate sunders and put them into a table
	 * 1. We build a table with vectors of abilities at each window
	 * 2. We look for tables with only one Ability and make a table of average threat values for this ability
	 * 3. Subtract these abilities from all other tables
	 * 4. If there are tables remaining => Go to 2., if not we are have successfully build an threat table
	 * 5. Go through all abilities and push them to DB
	 * 
	 * 
	 * These things give threat:
	 * 1. There are certain abilities with a fixed amount!
	 * 2. Heals/Mana give 0.5
	 * 3. For paladins Heals 0.25
	 * 4. Formular is: Y = PMod * (Fixed + Amount)
	 * 5. Threat changes depending on Buffs/Stances/Talents/Class
	 * 
	 * Information we need:
	 * 1. All these gain factors within an interval
	 * 2. All Targets within an interval (Demo => Refreshs are not shown!)
	 * 3. Buffs of players at each time interval
	 * 4. Talents of each player
	 * 5. Class of each player
	 * 6. When a boss died => To counter things that happened afterwards
	 * 
	 * Good to know:
	 * Subtract the big amounts first => Gains are sometimes not included in ktm
	 * Also KTM doesnt know that threat is divided by #Targets
	 *	{105536, 5}, // Bloodrage (HoT) => Per Amount tho (=> KTM Only!)
	 * 
	 * Rogue: Feint (Reduce threat by a set amount)
	 * Cat: Cover
	 * Item: Grace of Earth (-650) => https://vanilla-twinhead.twinstar.cz/?spell=25892
	 * 
	 * 
	 * Known Modifiers:
	 * General:
	 * - 0.7 => Fetish of the Sand Reaver => https://classicdb.ch/?item=21647
	 * - 0.35 => Eye of Diminution => https://classicdb.ch/?item=23001
	 * - 0.3 => Blessing of Salvation
	 * - 0.2 => Tranquil Air Totem => https://vanilla-twinhead.twinstar.cz/?spell=25908
	 * 
	 * + 0.02 => Gloves enchant
	 * - 0.02 => Cloak enchant
	 * 
	 * Warrior:
	 * - 0.2 => Battle Stance => https://classicdb.ch/?spell=21156
	 * - 0.2 => Berserker Stance => https://classicdb.ch/?spell=7381
	 * + 0.3 => Defensive Stance => https://classicdb.ch/?spell=7376
	 * + 0.15 => Defiance (Prot talent) => https://classicdb.ch/?spell=12303
	 * 
	 * Warlock:
	 * - 0.2 with Imp => Master Demonologist => https://classicdb.ch/?spell=23785
	 * - 0.25 for crits T3 (6) Set Bonus => https://classicdb.ch/?spell=28746
	 * 
	 * Paladin:
	 * - With Talents Righteous Fury + 110% holy aggro
	 * 
	 * Rogue:
	 * - 0.29 Passive
	 * Feint Subletly improvement (But nobody skills that)
	 * 
	 * Priest:
	 * - 0.2 Silent Resolve (Disci early) (Do priest skill it?)
	 * - 0.25 Shadow Affinity (Shadow)
	 * 
	 * Shaman:
	 * - Improved Fire Totem (Ele) => 0.5 for Magma Totem
	 * - 0.15 Healing Grace (Resto)
	 * 
	 * Mage:
	 * - 0.4 Arcane Spells (Arcane Subletly)
	 * - 0.3 Fire Spells (Burning Soul - Fire)
	 * - 0.3 Frost Spells (Frost Channeling)
	 * 
	 * Druid:
	 * - 0.2 Resto (Yes)
	 * 
	 */
	void Analyzer::EstimateSunder(DatabaseAccess& DBAccess, long long StartTime, int RS_UploaderID, std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference, std::map<int, std::pair<int, int>>& saReferenceReverse, std::map<int, std::pair<int, int>>& satReferenceReverse, std::map<int, int>& playerSpec)
	{
		auto querySA = m_DB->ExecuteStreamStatement("INSERT INTO rs_sa_reference (id,sourceid, abilityid, uploaderid) VALUES (:q<int>, :a<int>, :b<int>, :c<int>)", 100000);
		auto querySAT = m_DB->ExecuteStreamStatement("INSERT INTO rs_sat_reference (id,targetid, said) VALUES (:q<int>, :a<int>, :b<int>)", 100000);
		auto queryDamage = m_DB->ExecuteStreamStatement("INSERT INTO rs_damage (id, satid, hittype, timestamp, amount) VALUES (:q<int>, :a<int>, :b<int>, :c<int>, :e<int>)", 1000000);
		auto queryThreat = m_DB->ExecuteStreamStatement("INSERT INTO rs_damage_threat (dmgid, amount) VALUES (:b<int>, :c<int>)", 300000);
		auto queryCasts = m_DB->ExecuteStreamStatement("INSERT INTO rs_casts (satid, timestamp) VALUES (:a<int>, :b<int>)", 300000);

		int SATCount = GetMaxTableId("rs_sat_reference");
		int SACount = GetMaxTableId("rs_sa_reference");
		std::string bufferRefSA(8, '\0');
		std::string bufferRefSAT(12, '\0');
		std::map<std::string, bool> dbgExist;

		std::map<std::string, bool> doneCombSAT;
		std::map<std::string, bool> doneCombSA;

		int maxDmg = GetMaxTableId("rs_damage");

		// Estimate Sunders
		int numSunders = 0;
		std::map<int, __int64> lastThreatTime;
		std::map<int, int> remainingThreat;
		std::map<int, int> currentTarget;

		std::map<int, ThreatMods> threatMods;
		std::map<int, std::vector<std::pair<int, int>>> casts;
		std::map<int, std::map<int, __int64>> castsAt;
		auto sessLine = m_RaidData.begin();
		auto sessLineEnd = m_RaidData.end();

		// Init sessLine
		for (; sessLine != sessLineEnd; ++sessLine)
		{
			if (sessLine != sessLineEnd && (*sessLine)->m_Type == 26 && (*sessLine)->m_Players[0] != nullptr && (*sessLine)->m_Players[0]->_name.size() < 200 && (*sessLine)->m_Players[0]->_class == 0)
			{
				int srcId2 = GetCharacterOrPetID(DBAccess, (*sessLine)->m_Players[0]->_name, 0, true);
				int tarId2 = GetTargetSourceID(DBAccess, (*sessLine)->mS_Param[0]);
				if (tarId2 <= 0) continue;
				if (srcId2 < 300000) continue;

				if (threatMods.find(srcId2) == threatMods.end())
				{
					ThreatMods temp;
					temp.BattleStance = playerSpec[srcId2] == 1;
					temp.BerserkerStance = playerSpec[srcId2] == 2;
					temp.DefensiveStance = playerSpec[srcId2] == 3;
					threatMods.insert(std::make_pair(srcId2, std::move(temp)));
				}

				if (lastThreatTime[srcId2] == 0)
				{
					lastThreatTime[srcId2] = (*sessLine)->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[(*sessLine)->m_RTIndex];
					remainingThreat[srcId2] = 0;
					continue;
				}

				if ((*sessLine)->mI_Param[0] > 5000) continue; // Filter spike

				currentTarget[srcId2] = tarId2;
				break;
			}
		}

		for (auto& CBTLogVec : m_CombatLogEvents)
		{
			for (auto& cbtLogEvent : CBTLogVec)
			{
				if (sessLine == sessLineEnd)
					break; // No work needs to be done!

				if ((*sessLine)->m_Players[0] == nullptr || (*sessLine)->m_Players[0]->_name.size() >= 200)
				{
					++sessLine;
					continue;
				}

				int srcId = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], 0, true);
				int tarId = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target]);
				if (tarId <= 0) continue;
				if (srcId < 300000) continue;

				__int64 uTS = cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex];

				if (uTS <= 0) continue;

				if (casts.find(srcId) == casts.end())
				{
					std::vector<std::pair<int, int>> temp1;
					std::map<int, __int64> temp2;
					casts.insert(std::make_pair(srcId, std::move(temp1)));
					castsAt.insert(std::make_pair(srcId, std::move(temp2)));
				}

				if ((*sessLine)->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[(*sessLine)->m_RTIndex] < uTS)
				{
					// Execute all the code for the estimation
					int srcId2 = GetCharacterOrPetID(DBAccess, (*sessLine)->m_Players[0]->_name, 0, true);
					int tarId2 = GetTargetSourceID(DBAccess, (*sessLine)->mS_Param[0]);
					int window = static_cast<int>((*sessLine)->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[(*sessLine)->m_RTIndex] - lastThreatTime[srcId2]);
					int amount = (*sessLine)->mI_Param[0] + remainingThreat[srcId2];

					double mod = 1.0;
					if (threatMods[srcId2].BlessingOfSalvation) mod *= 0.7;
					if (threatMods[srcId2].BattleStance || threatMods[srcId2].BerserkerStance || threatMods[srcId2].TranquilAirTotem) mod *= 0.8;
					if (threatMods[srcId2].DefensiveStance) mod *= 1.3;
					if (threatMods[srcId2].ArcaneShroud) mod *= 0.3;
					if (threatMods[srcId2].TheEyeOfDiminution) mod *= 0.65;

					if (playerSpec[srcId2] == 3) mod *= 1.15;

					// Now subtract all threat abilties from the current threat and see if there is enough for sunder
					for (auto abil : casts[srcId2])
					{
						amount -= static_cast<int>(mod * (m_ThreatTable[abil.first] + abil.second));
					}

					// Preventing furys from getting false sunders, overall a better approx
					for (int i = 0; threatMods[srcId2].DefensiveStance &&
						i <= static_cast<int>(1.0*window / 1000.0) && static_cast<int>(1.2*amount) >= static_cast<int>(mod * 260); ++i)
					{
						amount -= static_cast<int>(mod * 260);

						DBAccess.PackMapKey(bufferRefSA, 2, srcId2, 11596);
						if (!doneCombSA[bufferRefSA] && saReference.find(bufferRefSA) == saReference.end())
						{
							querySA.AttachValues(SACount, srcId2, 11596, RS_UploaderID);
							doneCombSA[bufferRefSA] = true;
							saReference[bufferRefSA] = SACount;
							saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(srcId2, 11596)));
							++SACount;
						}
						DBAccess.PackMapKey(bufferRefSAT, 3, srcId2, 11596, tarId2);
						if (!doneCombSAT[bufferRefSAT] && satReference.find(bufferRefSAT) == satReference.end())
						{
							querySAT.AttachValues(SATCount, tarId2, saReference[bufferRefSA]);
							doneCombSAT[bufferRefSAT] = true;
							satReference[bufferRefSAT] = SATCount;
							satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(tarId2, saReference[bufferRefSA])));
							++SATCount;
						}
						queryDamage.AttachValues(maxDmg, satReference[bufferRefSAT], 20, static_cast<int>((*sessLine)->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[(*sessLine)->m_RTIndex] - StartTime), 0);
						queryThreat.AttachValues(maxDmg, static_cast<int>(100.0*mod * 260));
						queryCasts.AttachValues(satReference[bufferRefSAT], static_cast<int>((*sessLine)->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[(*sessLine)->m_RTIndex] - StartTime));

						++maxDmg;
						++numSunders;
						m_HackSunders.push_back(std::make_pair((*sessLine)->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[(*sessLine)->m_RTIndex], std::make_pair((*sessLine)->m_Players[0]->_name, static_cast<int>(100.0*mod * 260))));
					}

					lastThreatTime[srcId2] = (*sessLine)->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[(*sessLine)->m_RTIndex];
					if (amount > 0)
						remainingThreat[srcId2] = amount;
					else
						remainingThreat[srcId2] = 0;

					// Moving to the next event
					for (++sessLine; sessLine != sessLineEnd; ++sessLine)
					{
						if ((*sessLine)->m_Type == 26 && (*sessLine)->m_Players[0] != nullptr && (*sessLine)->m_Players[0]->_class == 0)
						{
							int srcId3 = GetCharacterOrPetID(DBAccess, (*sessLine)->m_Players[0]->_name, 0, true);
							int tarId3 = GetTargetSourceID(DBAccess, (*sessLine)->mS_Param[0]);
							if (tarId3 <= 0) continue;
							if (srcId3 < 300000) continue;

							if (threatMods.find(srcId3) == threatMods.end())
							{
								ThreatMods temp;
								temp.BattleStance = playerSpec[srcId3] == 1;
								temp.BerserkerStance = playerSpec[srcId3] == 2;
								temp.DefensiveStance = playerSpec[srcId3] == 3;
								threatMods.insert(std::make_pair(srcId3, std::move(temp)));
							}

							if (lastThreatTime[srcId3] == 0)
							{
								lastThreatTime[srcId3] = (*sessLine)->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[(*sessLine)->m_RTIndex];
								remainingThreat[srcId3] = 0;
								continue;
							}

							if ((*sessLine)->mI_Param[0] > 5000) continue; // Filter spike

							currentTarget[srcId3] = tarId3;

							break;
						}
					}

					casts[srcId2].clear();
					castsAt[srcId2].clear();
				}

				// Collect data for the estimation
				if (cbtLogEvent.m_Action == static_cast<char>(Action::Gain))
				{
					if (cbtLogEvent.m_Ability == 1038 || cbtLogEvent.m_Ability == 25895) // BoS
						threatMods[srcId].BlessingOfSalvation = true;
					else if (cbtLogEvent.m_Ability == 7165)
					{
						threatMods[srcId].BattleStance = true;
						threatMods[srcId].BerserkerStance = false;
						threatMods[srcId].DefensiveStance = false;
					}
					else if (cbtLogEvent.m_Ability == 7366)
					{
						threatMods[srcId].BattleStance = false;
						threatMods[srcId].BerserkerStance = true;
						threatMods[srcId].DefensiveStance = false;
					}
					else if (cbtLogEvent.m_Ability == 7164)
					{
						threatMods[srcId].BattleStance = false;
						threatMods[srcId].BerserkerStance = false;
						threatMods[srcId].DefensiveStance = true;
					}
					else if (cbtLogEvent.m_Ability == 106048)
						threatMods[srcId].TranquilAirTotem = true;
					else if (cbtLogEvent.m_Ability == 26400)
						threatMods[srcId].ArcaneShroud = true;
					else if (cbtLogEvent.m_Ability == 28862)
						threatMods[srcId].TheEyeOfDiminution = true;
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Fades))
				{
					if (cbtLogEvent.m_Ability == 1038 || cbtLogEvent.m_Ability == 25895) // BoS
						threatMods[srcId].BlessingOfSalvation = false;
					else if (cbtLogEvent.m_Ability == 7165)
						threatMods[srcId].BattleStance = false;
					else if (cbtLogEvent.m_Ability == 7366)
						threatMods[srcId].BerserkerStance = false;
					else if (cbtLogEvent.m_Ability == 7164)
						threatMods[srcId].DefensiveStance = false;
					else if (cbtLogEvent.m_Ability == 106048)
						threatMods[srcId].TranquilAirTotem = false;
					else if (cbtLogEvent.m_Ability == 26400)
						threatMods[srcId].ArcaneShroud = false;
					else if (cbtLogEvent.m_Ability == 28862)
						threatMods[srcId].TheEyeOfDiminution = false;
				}
					

				// Abilities
				if (lastThreatTime[srcId] != 0 && uTS > lastThreatTime[srcId]
					&& ((cbtLogEvent.m_Action <= static_cast<char>(Action::Reflects) && cbtLogEvent.m_Action != 4)
						|| (cbtLogEvent.m_Action == static_cast<char>(Action::Gain) && cbtLogEvent.m_Amount > 0)
						)
					&& !DBAccess.m_AbilityNames[cbtLogEvent.m_Ability].empty()
					)
				{
					// The grad should be so short that several abilities are unlikely
					// We filter same abilities at the same time
					//if (uTS - castsAt[cbtLogEvent.m_Ability] <= 10) continue;

					if (currentTarget[srcId] != tarId) continue;

					int amount = cbtLogEvent.m_Amount;
					if ((cbtLogEvent.m_Action == static_cast<char>(Action::Gain) || (cbtLogEvent.m_Ability == 23892 && amount == 20)) && cbtLogEvent.m_Ability != 105536)
						amount /= 2;
					if (cbtLogEvent.m_Ability == 105536)
						amount = (amount - 1) * 5;

					casts[srcId].push_back(std::make_pair(cbtLogEvent.m_Ability, amount));
					castsAt[srcId][cbtLogEvent.m_Ability] = uTS;

				}
				
			}
		}
		
		querySA.Flush();
		querySAT.Flush();

		queryDamage.Flush();
		queryThreat.Flush();
		queryCasts.Flush();

		std::cout << "Found " << numSunders << " sunders!" << std::endl;
	}

	void Analyzer::FetchSessionData(DatabaseAccess& DBAccess, int RS_MAX_Attempts, int RS_UploaderID, long long StartTime, std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>>& m_Attempts)
	{
		auto queryLoot = m_DB->ExecuteStreamStatement("INSERT INTO rs_loot (targetid, itemid, attemptid, uploaderid) VALUES (:a<int>, :b<int>, :c<int>, :d<int>)", 50);
		auto queryYells = m_DB->ExecuteStreamStatement("INSERT INTO rs_bossyells (npcid, yellid, timestamp, uploaderid) VALUES (:a<int>, :q<int>, :b<int>, :c<int>)", 100);

		for (auto& sessLine : m_RaidData)
		{
			if (sessLine->m_Type == 22) // Loot
			{
				// Getting the bestFitting Attemptid
				int AttemptID = 0;
				std::pair<int, std::pair<SessionLine*, SessionLine*>>* lastBossAttempt = nullptr;
				std::pair<int, std::pair<SessionLine*, SessionLine*>>* lastLastBossAttempt = nullptr;
				for (auto atmt = m_Attempts.rbegin(); atmt != m_Attempts.rend(); ++atmt)
				{
					if (atmt->second.second->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[atmt->second.second->m_RTIndex] <= sessLine->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[sessLine->m_RTIndex])
					{
						if (/*atmt.second.first->m_Type == 10 || */atmt->second.second->m_Type == 24 || atmt->second.second->m_Type == 10)
						{
							if (lastBossAttempt != nullptr)
								lastLastBossAttempt = lastBossAttempt;
							lastBossAttempt = &(*atmt);
						}
						if (
							lastBossAttempt != nullptr && (sessLine->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[sessLine->m_RTIndex]) >= (lastBossAttempt->second.second->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[lastBossAttempt->second.second->m_RTIndex])
							&& (lastLastBossAttempt == nullptr || (lastLastBossAttempt != nullptr && sessLine->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[sessLine->m_RTIndex] <= lastLastBossAttempt->second.second->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[lastLastBossAttempt->second.second->m_RTIndex]))
							)
						{
							AttemptID = lastBossAttempt->first;
						}
						else if (lastLastBossAttempt != nullptr && ((sessLine->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[sessLine->m_RTIndex]) >= (lastLastBossAttempt->second.second->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[lastLastBossAttempt->second.second->m_RTIndex])))
						{
							AttemptID = lastLastBossAttempt->first;
						}
						else
							AttemptID = atmt->first;
						break;
					}
				}
				if (AttemptID == 0)
				{
					if (lastBossAttempt != nullptr && lastBossAttempt->second.first->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[lastBossAttempt->second.first->m_RTIndex] >= sessLine->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[sessLine->m_RTIndex])
						AttemptID = lastBossAttempt->first;
					else if (m_Attempts.size() > 0)
						AttemptID = m_Attempts.back().first;
				}
				if (AttemptID == 0) continue; // Something went wrong here
				if (sessLine->m_Players[0] == nullptr || sessLine->m_Players[0]->_name.size() <= 1 || sessLine->m_Players[0]->_name.size() >= 200) continue;
				int charid = GetCharacterOrPetID(DBAccess, sessLine->m_Players[0]->_name, 0, true);
				if (charid < 300000) continue;
				queryLoot.AttachValues(charid, sessLine->mI_Param[0], AttemptID, RS_UploaderID);
			}
			else if (sessLine->m_Type == 20 && DBAccess.IsBossNPC(sessLine->mS_Param[0])) // Speech (Including boss yells)
			{
				//std::cout << "Test 16.8" << std::endl;
				int yellid = DBAccess.GetYellID(sessLine->mS_Param[1]);
				if (yellid > 0)
					queryYells.AttachValues(DBAccess.GetNPCID(sessLine->mS_Param[0]), yellid, static_cast<int>(sessLine->m_TimeStamp /* - timeDiffsTS[m_ArmoryData->m_Parser->m_RealTime[sessLine->m_RTIndex]]*/ + m_ArmoryData->m_Parser->m_RealTime[sessLine->m_RTIndex] - StartTime), RS_UploaderID);
			}
		}


		queryYells.Flush();
		queryLoot.Flush();
	}

	void Analyzer::FetchMCedPets(DatabaseAccess& DBAccess, __int64 StartTime, __int64 EndTime)
	{
		// Before we retrieve the damage, lets get a list of Mind Controlled pets and its timeframes in which they where MCed!
		// Player, Pet, TimeStart, TimeEnd
		std::vector<std::pair<std::string, __int64>> MCBeginCast;
		std::vector<std::pair<std::string, __int64>> MCGain;
		std::vector<std::pair<std::string, __int64>> MCAfflictedBy;
		std::vector<std::pair<std::string, __int64>> MCFades;
		for (auto& CBTLogVec : m_CombatLogEvents)
		{
			for (auto& cbtLogEvent : CBTLogVec)
			{
				if (cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] < StartTime) continue;
				if (cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] > EndTime) goto endCBTLoop2;

				if (cbtLogEvent.m_Action == static_cast<char>(Action::BeginCast))
				{
					// This indicates the start of such event!
					// Note: A begin must not conclude that there is a Mind Control!
					if (cbtLogEvent.m_Ability != 605) continue;
					MCBeginCast.push_back(std::make_pair(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] + cbtLogEvent.m_Timestamp));
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Gain))
				{
					if (cbtLogEvent.m_Ability != 605) continue;
					MCGain.push_back(std::make_pair(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] + cbtLogEvent.m_Timestamp));
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::AfflictedBy))
				{
					if (cbtLogEvent.m_Ability != 605) continue;
					MCAfflictedBy.push_back(std::make_pair(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] + cbtLogEvent.m_Timestamp));
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Fades))
				{
					if (cbtLogEvent.m_Ability != 605) continue;
					MCFades.push_back(std::make_pair(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex] + cbtLogEvent.m_Timestamp));
				}
			}
		}

	endCBTLoop2:;

		// Now connect this data!
		for (auto& cast : MCBeginCast)
		{
			bool foundGain = false;
			std::vector<std::pair<std::string, __int64>>::iterator itr4;
			for (auto gain = MCGain.begin(); gain != MCGain.end(); ++gain)
			{
				if (gain->first != cast.first) continue;
				if (gain->second > cast.second + 10000) break; // Timeout of 10 seconds!
				foundGain = true;
				itr4 = gain;
				break;
			}
			if (!foundGain) continue; // We could continue looking for an afflicted in the timeframe if we were not to have a strict protocoll!
			if (GetTargetSourceID(DBAccess, cast.first, 0) < 300000) continue; // We dont have a player!? o.O

			bool foundAfflicted = false;
			__int64 startValue = 0;
			std::string target = "";
			// Note if two people cast at an npc, we have no way of knowing which is the right one! 50% 50%, first comes, first served!
			std::vector<std::pair<std::string, __int64>>::iterator itr3;
			for (auto afflicted = MCAfflictedBy.begin(); afflicted != MCAfflictedBy.end(); ++afflicted)
			{
				// Continue if this pet is not listed as pet!
				if (std::find(m_ArmoryData->m_UnitData[cast.first].m_PetName.begin(), m_ArmoryData->m_UnitData[cast.first].m_PetName.end(), afflicted->first) == m_ArmoryData->m_UnitData[cast.first].m_PetName.end()) continue;
				if (afflicted->second > cast.second + 10000) break; // Timeout of 10 seconds!
				foundAfflicted = true;
				startValue = afflicted->second;
				target = afflicted->first;
				itr3 = afflicted;
				break;
			}
			if (!foundAfflicted) continue;

			bool foundFadeFromCaster = false;
			bool foundFadeFromTarget = false;
			std::vector<std::pair<std::string, __int64>>::iterator itr1;
			std::vector<std::pair<std::string, __int64>>::iterator itr2;
			__int64 endValue = 0;
			for (auto fade = MCFades.begin(); fade != MCFades.end(); ++fade)
			{
				if (foundFadeFromCaster && foundFadeFromTarget) break;
				if (fade->second - startValue > 60000) break; // Timeout of 60 seconds max cast time? // TODO
				if (!foundFadeFromCaster && fade->first == cast.first)
				{
					foundFadeFromCaster = true;
					endValue = fade->second;
					itr1 = fade;
					continue;
				}
				if (!foundFadeFromTarget && fade->first == target)
				{
					foundFadeFromTarget = true;
					endValue = fade->second;
					itr2 = fade;
				}
			}
			if (!foundFadeFromCaster || !foundFadeFromTarget) continue;

			m_MCedPets.push_back(std::make_pair(std::make_pair(cast.first, target), std::make_pair(startValue, endValue)));

			itr1->second = 0;
			itr2->second = 0;
			itr3->second = 0;
			itr4->second = 0;
			/*MCFades.erase(itr1);
			MCFades.erase(itr2);
			MCAfflictedBy.erase(itr3);
			MCGain.erase(itr4);*/
		}

		std::cout << "Found " << m_MCedPets.size() << " timeframes for MCed pets!" << std::endl;
	}

	// TODO: What to do if multiple bosses are killed within one attempt ? ^^
	// TODO: Can be optimized / Pretty(tized?)
	void Analyzer::RetrieveRecordData(RPLL::DatabaseAccess& _DB, const long long _TS, int _Type, int _Value, std::string _CharID,
		RPLL::MySQLStream& st_rrd_queryOne, RPLL::MySQLStream& st_rrd_queryTwo, RPLL::MySQLStream& st_rrd_queryThree, RPLL::MySQLStream& st_rrd_queryFour, RPLL::MySQLStream& st_rrd_queryFive, RPLL::MySQLStream& st_rrd_querySix)
	{
		if (st_rrd_ptr != st_rrd_end)
		{
			if (st_rrd_ptr->second.first <= _TS)
			{
				if (st_rrd_ptr->second.second >= _TS)
				{
					// TODO: Room for Optimization!
					int charID = GetCharacterOrPetID(_DB, _CharID, _TS);
					if (charID < 300000) return;
					if (_CharID == "Unknown") return;

					if (m_ArmoryData->m_UnitData[_CharID].m_Owner > 0)
					{
						bool foundOwner = false;
						for (auto& chr : m_ArmoryData->m_UnitData)
						{
							if (chr.second.m_ID == m_ArmoryData->m_UnitData[_CharID].m_Owner)
							{
								_CharID = chr.first;
								foundOwner = true;
								break;
							}
						}
						if (!foundOwner) return;
					}

					auto foundID = st_rrd_chardata.find(_CharID);
					if (foundID != st_rrd_chardata.end())
					{
						foundID->second[_Type] += _Value;
					}
					else
					{
						int* data = new int[3]{ 0, 0 };
						data[_Type] = _Value;
						st_rrd_chardata.insert(std::make_pair(_CharID, std::move(data)));
					}
				}
				else
				{
					// Insert values here if >0
					for (auto& record : st_rrd_chardata)
					{
						std::string tempstr = record.first;
						int charID = GetCharacterOrPetID(_DB, tempstr, _TS);
						if (charID > 0)
						{
							for (int i = 0; i < 3; ++i)
							{
								if (record.second[i] > 0)
								{
									int rowCount = 1;
									st_rrd_queryFive.AttachValues(charID, st_rrd_ptr->first.second, i);
									while(st_rrd_queryFive.HasData())
									{
										int rId = 0;
										st_rrd_queryFive.ReadData(&rId);
										if (rowCount >= 5)
											st_rrd_querySix.AttachValues(rId);
										++rowCount;
									}
									st_rrd_queryFive.Flush();

									st_rrd_queryOne.AttachValues(charID/*, st_rrd_ptr->first.second*/, i, record.second[i], st_rrd_ptr->first.first);

									// Best ranking
									st_rrd_queryTwo.AttachValues(charID, st_rrd_ptr->first.second, i);
									if (st_rrd_queryTwo.HasData())
									{
										int BestKill;
										st_rrd_queryTwo.ReadData(&BestKill);
										int bestValue = static_cast<int>(ceil((_Type == 2 ? 100.0 : 10000.0)*record.second[i] / static_cast<int>(st_rrd_ptr->second.second - st_rrd_ptr->second.first)));
										//std::cout << "Comparing: " << i << " => " << charID << " => " << BestKill << " vs " << bestValue << std::endl;
										if (BestKill < bestValue)
										{
											st_rrd_queryFour.AttachValues(charID, st_rrd_ptr->first.second, i);
											st_rrd_queryThree.AttachValues(charID/*, st_rrd_ptr->first.second*/, i, record.second[i], st_rrd_ptr->first.first);
										}
									}
									else
									{
										st_rrd_queryThree.AttachValues(charID/*, st_rrd_ptr->first.second*/, i, record.second[i], st_rrd_ptr->first.first);
									}
								}
							}
						}
					}

					for (auto& val : st_rrd_chardata)
						delete[] val.second;
					st_rrd_queryOne.Flush();
					st_rrd_queryThree.Flush();
					st_rrd_chardata.clear();
					++st_rrd_ptr;
					RetrieveRecordData(_DB, _TS, _Type, _Value, _CharID, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
				}
			}
		}
	}
}
