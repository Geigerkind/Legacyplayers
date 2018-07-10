#include "AnalyzerPost.h"

namespace RPLL
{
	AnalyzerPost::AnalyzerPost(const char* _Armory, const char* _CBTLog, const int _Uploader, DatabaseAccess& DBAccess, ArmoryProcessor* _Processor)
	{
		//DatabaseAccess& DBAccess = DatabaseAccess::GetInstance();
		m_DB = DBAccess.GetConnector();
		auto queryProgress = m_DB->ExecuteStreamStatement("UPDATE rs_progress SET progress=:a<int> WHERE uploaderid=:b<int>", 1);

		m_ArmoryData = FetchArmoryData(_Armory, _Uploader, DBAccess, true, _Processor);
		if (m_ArmoryData->m_UnitData.empty() || m_ArmoryData->m_Parser->m_sessions.empty())
		{
			std::cout << "Unitdata or sessions are empty!" << std::endl;
			remove(_Armory);
			remove(_CBTLog);
			return;
		}

		m_CBTLogParser = new CombatlogParser; // Guess this could be made singleton
		std::string textData = RPLL::File_ReadAllText(_CBTLog);
		m_CombatLogEvents = (m_CBTLogParser->Parse(textData.c_str(), static_cast<int>(textData.length()), true, DBAccess));
		if (m_CombatLogEvents.empty()) {
			std::cout << "Combatlog events are empty!" << std::endl;
			remove(_Armory);
			remove(_CBTLog);
			return; // Empty log?
		}

		int realmID = DBAccess.GetRealmID(m_ArmoryData->m_Parser->m_sessions[0][0].mS_Param[0], RPLL::WowVersion::TBC);
		//int unknownPlayer = 300000 + realmID - 1;
		 
		int timezone = GetTimeDifference(m_ArmoryData->m_Parser->m_sessions.begin()->begin()->mI_Param[2], m_ArmoryData->m_Parser->m_sessions.back()[0].mI_Param[0], m_ArmoryData->m_Parser->m_sessions.back()[0].mI_Param[1], m_ArmoryData->m_Parser->m_RealTime.back(), m_CombatLogEvents);
		AdjustTimeZone(timezone, m_ArmoryData->m_Parser->m_sessions, m_ArmoryData->m_UnitData);
		std::cout << "Timedifference: " << timezone << " hours " << std::endl;

		// We need to add all summons to pets and recompute the ids!
		// Pets can also be summoned by sommoned pets xD
		/*
		 * Wrong order!
		 * 1/18 20:31:08.970  SPELL_SUMMON,0xF130003C4F0001EE,"Fire Elemental Totem",0x1112,0xF130003C4E0001EF,"Greater Fire Elemental",0x1112,32982,"Fire Elemental Totem",0x1
		 * 1/18 20:31:08.970  SPELL_SUMMON,0x00000000000DE8D2,"Malenhancemt",0x512,0xF130003C4F0001EE,"Fire Elemental Totem",0x1112,2894,"Fire Elemental Totem",0x4
		 */
		for (auto& CBTLogVec : m_CombatLogEvents)
		{
			for (auto& cbtLogEvent : CBTLogVec)
			{
				if (cbtLogEvent.m_Action == static_cast<char>(Action::Summon))
				{
					__int64 uTS = cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex];
					// Its only relevant if the source is a player
					int SourceId = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);
					if (SourceId < 300000) 
					{
						// Adding the case that a pet summoned a pet
						if (m_ArmoryData->m_PetToOwner.find(cbtLogEvent.m_SourceGUID.m_GUID) != m_ArmoryData->m_PetToOwner.end())
							SourceId = m_ArmoryData->m_PetToOwner[cbtLogEvent.m_SourceGUID.m_GUID];
						// This might cause an segfault, but highly unlikely, lets see xD
						else if ((&cbtLogEvent + 1)->m_Action == static_cast<char>(Action::Summon) && (&cbtLogEvent + 1)->m_DestGUID.m_GUID == cbtLogEvent.m_SourceGUID.m_GUID) // Wrong order detected
						{
							int SourceId2 = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[(&cbtLogEvent + 1)->m_Source], uTS, false, (&cbtLogEvent + 1)->m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[(&cbtLogEvent + 1)->m_SourceGUID.m_GUID]);
							if (SourceId2 >= 300000)
							{
								m_ArmoryData->m_PetToId.insert(std::make_pair(cbtLogEvent.m_DestGUID.m_GUID, SourceId2));
								m_ArmoryData->m_PetToOwner.insert(std::make_pair(cbtLogEvent.m_DestGUID.m_GUID, SourceId2));
								continue;
							}
						}
						else continue;
					}
					if (m_ArmoryData->m_UnitData.find(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source]) == m_ArmoryData->m_UnitData.end()) continue;
					// Target must be an npc!
					int TargetId = cbtLogEvent.m_DestGUID.GetNPCID();
					if (TargetId <= 0 || TargetId >= 300000) continue;

					m_ArmoryData->m_PetToId.insert(std::make_pair(cbtLogEvent.m_DestGUID.m_GUID, SourceId));
					m_ArmoryData->m_PetToOwner.insert(std::make_pair(cbtLogEvent.m_DestGUID.m_GUID, SourceId));
 				}
			}
		}


		// Retrieving pet names
		int petFaction = m_ArmoryData->m_UnitData.begin()->second.m_Faction;
		for (auto& pet : m_ArmoryData->m_PetToId)
		{
			for (auto& CBTLogVec : m_CombatLogEvents)
			{
				for (auto& cbtLogEvent : CBTLogVec)
				{
					if (pet.first == cbtLogEvent.m_SourceGUID.m_GUID)
					{
						pet.second = DBAccess.GetPetID(m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], realmID, petFaction, true, pet.second);
						goto nextPet;
					}
					else if (pet.first == cbtLogEvent.m_DestGUID.m_GUID)
					{
						pet.second = DBAccess.GetPetID(m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], realmID, petFaction, true, pet.second);
						goto nextPet;
					}
				}
			}
			nextPet:;
		}

		try
		{
			std::cout << "\nStarted anaylzing the raids\n";
			auto startTime = std::chrono::steady_clock::now();

			st_gnr_Position_Outer = m_ArmoryData->m_Parser->m_sessions.rbegin();
			st_gnr_Position_Inner = (*st_gnr_Position_Outer).begin();
			while (!(m_RaidData = GetNextRaid(DBAccess)).empty())
			{
				std::cout << "Starting instance: " << m_RaidData[0]->mS_Param[0] << std::endl;
				
				__int64 StartTime = m_RaidData.front()->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[m_RaidData.front()->m_RTIndex];
				__int64 EndTime = m_RaidData.back()->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[m_RaidData.back()->m_RTIndex];
				std::map<int, bool> Participants;
				m_MCedPets.clear();

				// Retrieve relative information of all tables
				int RS_MAX_Attempts = GetMaxTableId("rs_attempts", true);
				int RS_MAX_Auras = GetMaxTableId("rs_auras", true);
				int RS_MAX_BossYells = GetMaxTableId("rs_bossyells", true);
				int RS_MAX_Damage = GetMaxTableId("rs_damage", true);
				int RS_MAX_Deaths = GetMaxTableId("rs_deaths", true);
				int RS_MAX_Dispels = GetMaxTableId("rs_dispels", true);
				int RS_MAX_Healing = GetMaxTableId("rs_healing", true);
				int RS_MAX_Interrupts = GetMaxTableId("rs_interrupts", true);
				int RS_MAX_Loot = GetMaxTableId("rs_loot", true);
				int RS_MAX_SAT = GetMaxTableId("rs_sat_reference", true);
				int RS_MAX_SATA = GetMaxTableId("rs_sata_reference", true);
				int RS_MAX_SA = GetMaxTableId("rs_sa_reference", true);
				int RS_MAX_Casts = GetMaxTableId("rs_casts", true);
				int RS_MAX_Threat = GetMaxTableId("rs_gained_threat", true);

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
				int errId = InitRaidCollection(RaidingGuildID, StartTime, EndTime, _Uploader, realmID, FactionId, InstanceID, DBAccess, RS_InstanceID, RS_UploaderID, RS_ProgressID, evTS, evSource, evAmount);
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
				 
				/* TODO:
				 * TBC version of MindControlled Pets function!
				 * Interrupts
				 * Dispels
				 * Parallelization things!
				 */
				std::map<std::string, int> saReference;
				std::map<int, std::pair<int, int>> saReferenceReverse;
				std::map<std::string, int> satReference;
				std::map<int, std::pair<int, int>> satReferenceReverse;
				std::map<std::string, int> sataReference;
				FetchReferenceTables(StartTime, EndTime, DBAccess, RS_UploaderID, RS_MAX_SA, RS_MAX_SAT, RS_MAX_SATA, saReference, satReference, sataReference, saReferenceReverse, satReferenceReverse);

				queryProgress.AttachValues(15, RS_ProgressID);

				// Retrieve attempt information
				std::map<std::pair<int, int>, std::pair<__int64, __int64>> bossAttempts;
				std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>> m_Attempts;
				FetchAttempts(DBAccess, StartTime, EndTime, RS_UploaderID, RaidingGuildID, InstanceID, bossAttempts, m_Attempts);
				queryProgress.AttachValues(30, RS_ProgressID);

				Threat ThreatHandler(&(m_ArmoryData->m_UnitData), &DBAccess, _Processor, &(m_CBTLogParser->mNameValues), &(m_ArmoryData->m_PetToOwner), 1);

				FetchCombatLogData(DBAccess, StartTime, EndTime, RS_ProgressID, RS_UploaderID, queryProgress, saReference, satReference, sataReference, saReferenceReverse, RS_MAX_Damage, FactionId, ThreatHandler);
				queryProgress.AttachValues(85, RS_ProgressID);

				FetchSessionData(DBAccess, RS_UploaderID, StartTime, m_Attempts);
				queryProgress.AttachValues(90, RS_ProgressID);

				SetSpeedRunRecord(bossAttempts, static_cast<int>(EndTime-StartTime), RS_UploaderID, RaidingGuildID, InstanceID, NumBossesPerInstance(InstanceID));
				queryProgress.AttachValues(95, RS_ProgressID);
				// Insert lookupspace relative to retrieved information at the beginning
				auto query = m_DB->ExecuteStreamStatement("UPDATE rs_instance_uploader SET lookupspace=:a<char[330]> WHERE id=:b<int>", 1);
				query.AttachValues(
					// NOTE: THIS ONLY WORKS IF THERE IS NO PARALLEL PROCESSING INVOLVED!
					GetLookUpSpace("rs_attempts", RS_MAX_Attempts, true) + "&" +
					GetLookUpSpace("rs_sa_reference", RS_MAX_SA, true) + "&" +
					GetLookUpSpace("rs_sat_reference", RS_MAX_SAT, true) + "&" +
					GetLookUpSpace("rs_sata_reference", RS_MAX_SATA, true) + "&" +
					GetLookUpSpace("rs_auras", RS_MAX_Auras, true) + "&" +
					GetLookUpSpace("rs_deaths", RS_MAX_Deaths, true) + "&" +
					GetLookUpSpace("rs_dispels", RS_MAX_Dispels, true) + "&" +
					GetLookUpSpace("rs_interrupts", RS_MAX_Interrupts, true) + "&" +
					GetLookUpSpace("rs_damage", RS_MAX_Damage, true) + "&" +
					GetLookUpSpace("rs_healing", RS_MAX_Healing, true) + "&" +
					GetLookUpSpace("rs_loot", RS_MAX_Loot, true) + "&" +
					GetLookUpSpace("rs_casts", RS_MAX_Casts, true) + "&" +
					GetLookUpSpace("rs_bossyells", RS_MAX_BossYells, true) + "&" +
					GetLookUpSpace("rs_gained_threat", RS_MAX_Threat, true)
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
			m_DB->ExecuteStreamStatement("DELETE FROM rs_instances WHERE rdy = 0", 1); // TODO: Parallelization!
		}
		catch (const std::exception &exc)
		{
			// Flag file here!
			std::cout << exc.what() << std::endl;
			m_DB->ExecuteStreamStatement("DELETE FROM rs_instances WHERE rdy = 0", 1);
			return;
		}
		catch (...)
		{
			std::cout << "The file may be corrupted or some unknown exception occoured!" << std::endl;
			m_DB->ExecuteStreamStatement("DELETE FROM rs_instances WHERE rdy = 0", 1);
			return;
		}

		// Removing file here
		remove(_Armory);
		remove(_CBTLog);
	}

	AnalyzerPost::~AnalyzerPost()
	{
	}
	std::map<int, bool> AnalyzerPost::m_NotRlyGroupBoss = {
		{ 17257, true },
		{ 22887, true },
		{ 22841, true },
		{ 22917, true },
		{ 21216, true },
		{ 21217, true },
		{ 21215, true },
		{ 21214, true },
		{ 21212, true },
		{ 15550, true },
		{ 15687, true },
		{ 18831, true },
		{ 23578, true },
		{ 23577, true },
		//{ 24239, true },
		{ 19514, true },
		{ 18805, true },
		{ 19622, true },
		{ 24850, true },
		{ 25741 , true},
		{ 25315 , true}
	};

	std::map<int, int> AnalyzerPost::m_BossToGroup = {
		// Magtheridon's Lair
		{ 17257, 17257 },
		{ 17256, 17257 },
		{ 17454, 17257 },

		// Black temple
		// High Warlord Najentus
		{ 22887, 22887 },
		//{ 22878, 22887 },
		// Akama
		{ 22841, 22841 },
		{ 23216, 22841 },
		{ 23523, 22841 },
		{ 23318, 22841 },
		{ 23524, 22841 },
		{ 23421, 22841 },
		{ 23215, 22841 },
		// Reliquary of Souls
		{ 23418, 100000 },
		{ 23419, 100000 },
		{ 23420, 100000 },
		{ 23469, 100000 },
		// Illidary Council
		{ 22951, 100001 },
		{ 22950, 100001 },
		{ 22949, 100001 },
		{ 22952, 100001 },
		// Illidan
		{ 22917, 22917 },
		{ 22997, 22917 },
		{ 23498, 22917 },

		// SSC
		// Hydross the unstable
		{ 21216, 21216 },
		{ 22035, 21216 },
		{ 22036, 21216 },
		// Lurker below
		{ 21217, 21217 },
		{ 21873, 21217 },
		{ 21856, 21217 },
		// Leotheras the Blind
		{ 21215, 21215 },
		{ 21875, 21215 },
		{ 21857, 21215 },
		// Fathom-Lord Karathress
		{ 21214, 21214 },
		{ 21964, 21214 },
		{ 21965, 21214 },
		{ 21966, 21214 },
		// Lady Vashj
		{ 21212, 21212 },
		{ 22055, 21212 },
		{ 22056, 21212 },
		{ 22009, 21212 },
		{ 21958, 21212 },
		{ 22140, 21212 },
		// Kara
		// Attumen
		{ 15550, 15550 },
		{ 16151, 15550 },
		{ 16152, 15550 },
		// Moroes
		{ 15687, 15687 },
		{ 19875, 15687 },
		{ 19872, 15687 },
		{ 17007, 15687 },
		{ 19874, 15687 },
		{ 19876, 15687 },
		{ 19873, 15687 },
		// Opera Event
		{ 17521, 100002 },
		{ 17535, 100002 },
		{ 17548, 100002 },
		{ 17543, 100002 },
		{ 17546, 100002 },
		{ 18168, 100002 },
		{ 17533, 100002 },
		{ 17534, 100002 },
		{ 17547, 100002 },

		// Gruul
		// High King Maulgar
		{ 18831, 18831 },
		{ 18832, 18831 },
		{ 18834, 18831 },
		{ 18835, 18831 },
		{ 18836, 18831 },
		{ 18847, 18831 },

		// Zul Aman
		// Jan'alai
		{ 23578, 23578 },
		//{ 23918, 23578 },
		{ 23598, 23578 },
		//{ 23834, 23578 },
		//{ 25867, 23578 },

		// Halazzi
		{ 23577, 23577 },
		{ 24143, 23577 },

		// Hex Lord Malacrass
		{ 24239, 24239 },
		{ 24241, 24239 },
		{ 24240, 24239 },
		{ 24243, 24239 },
		{ 24242, 24239 },
		{ 24244, 24239 },
		{ 24245, 24239 },
		{ 24246, 24239 },
		{ 24247, 24239 },

		// Tempest Keep
		// Al'ar
		{ 19514, 19514 },
		{ 19551, 19514 },
		// High Astromancer Solarian
		{ 18805, 18805 },
		{ 18806, 18805 },
		{ 18925, 18805 },
		// Kael'thas Sunstrider
		{ 19622, 19622 },
		{ 20064, 19622 },
		{ 20060, 19622 },
		{ 20062, 19622 },
		{ 20063, 19622 },
		{ 21362, 19622 },
		{ 21364, 19622 },
		{ 21268, 19622 },
		{ 21274, 19622 },
		{ 21270, 19622 },
		{ 21271, 19622 },
		{ 21272, 19622 },
		{ 21269, 19622 },
		{ 21273, 19622 },

		// Sunwell
		// Kalecgos
		{ 24850, 24850 },
		{ 24844, 24850 },
		{ 24891, 24850 },
		{ 25319, 24850 },
		{ 24892, 24850 },
		// Eredar Twins
		{ 25165, 100003 },
		{ 25166, 100003 },
		// M'uru
		{ 25741 , 25741 },
		{ 25960 , 25741},
		// Kil'Jaeden
		{ 25315 ,25315 },
		{ 25608 , 25608 }
	};
	std::map<int, short> AnalyzerPost::m_GroupToAmount = {
		{ 100000, 4 }, // With Enslaved Soul
		{ 100001, 4 },
		{ 100002, 2 }, // This will change depending on which collection!
		{ 100003, 2 },
		{ 24239, 5 },
	};
	// TODO: Kalecgos, he is special
	std::pair<SessionLine*, SessionLine*> AnalyzerPost::GetNextAttempt(DatabaseAccess& _DB, std::vector<SessionLine*>::iterator& ptr, std::vector<SessionLine*>::iterator& end, std::map<std::pair<int, int>, std::pair<__int64, __int64>>& bossAttempts)
	{
		SessionLine* startLine = nullptr;
		bool trashAttempt = false;

		bool groupBossFight = false;
		std::map<int, bool> groupBossDied;
		int currentGroupBoss = 0;

		for (; ptr != end; ++ptr)
		{
			try
			{
				if ((
					//((*ptr)->m_Type == 5 && (*ptr)->mI_Param[0] > 10) ||
					((*ptr)->m_Type == 10 && (*ptr)->mI_Param[0] >= 92000)
					&& (*ptr)->m_Type == 10 && (*ptr)->mI_Param[0] < 100000 // In order to counter dialoges!
				)) // Boss begin!
				{
					if (startLine == nullptr)
					{
						//std::cout << "Boss begin: " << (*ptr)->mS_Param[0] << std::endl;
						startLine = *ptr;
						int npcid = std::stoi((*ptr)->mS_Param[0]);
						if (m_BossToGroup.find(npcid) != m_BossToGroup.end())
						{
							if (m_NotRlyGroupBoss[m_BossToGroup[npcid]])
							{
								(*ptr)->mS_Param[0] = std::to_string(m_BossToGroup[npcid]);
								continue;
							}
							// Lets overwrite the actual boss name with the group boss name
							std::cout << "Processing Group Boss: " << *(*ptr)->mS_Param << std::endl;
							currentGroupBoss = m_BossToGroup[npcid];
							groupBossFight = true;

							// Opera event
							if (npcid == 17521) // The Big Bad Wolf
							{
								m_GroupToAmount[100002] = 1;
							}
							else if (npcid == 17534 || npcid == 17533) // Romeo and Julianne
							{
								m_GroupToAmount[100002] = 4;
							}
							else if (npcid == 17535 || npcid == 17548 || npcid == 17543 || npcid == 17546 || npcid == 18168 || npcid == 17547)
							{
								m_GroupToAmount[100002] = 6;
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
				}
				else if (startLine != nullptr && (
					((*ptr)->m_Type == 24 && (_DB.IsBossNPC(*(*ptr)->mS_Param, std::stoi(*(*ptr)->mS_Param)) || m_BossToGroup.find(std::stoi((*ptr)->mS_Param[0])) != m_BossToGroup.end())) ||
					((*ptr)->m_Type == 10 && (*ptr)->mI_Param[0] < 1001)
					)) // Boss was killed
				{
					//std::cout << "BK: " << (*ptr)->mS_Param[0] << " => " << (*ptr)->mI_Param[0] << std::endl;
					if ((!groupBossFight && m_BossToGroup.find(std::stoi((*ptr)->mS_Param[0])) == m_BossToGroup.end())
						|| (!groupBossFight && m_BossToGroup.find(std::stoi((*ptr)->mS_Param[0])) != m_BossToGroup.end() && std::stoi((*ptr)->mS_Param[0]) == m_BossToGroup[std::stoi((*ptr)->mS_Param[0])])
						|| (!groupBossFight && startLine->mS_Param[0] == (*ptr)->mS_Param[0])
						//|| 24239 == std::stoi((*ptr)->mS_Param[0])
						)
					{
						// Al'ar dies in Phase 1 and is shortly after reborn in phase 2
						if (19514 == std::stoi((*ptr)->mS_Param[0])) // Al'ar
						{
							__int64 curTime = m_ArmoryData->m_Parser->m_RealTime[(*ptr)->m_RTIndex] + (*ptr)->m_TimeStamp + 30000;
							for (auto oldPtr = ptr + 1; oldPtr != end && (m_ArmoryData->m_Parser->m_RealTime[(*oldPtr)->m_RTIndex] + (*oldPtr)->m_TimeStamp) < curTime; ++oldPtr)
							{
								if (((*oldPtr)->m_Type == 10 && (*oldPtr)->mI_Param[0] > 0)
									|| ((*oldPtr)->m_Type == 5 && (*oldPtr)->mI_Param[0] > 0)
									)
								{
									goto skipKill;
								}
							}
						}
						skipKill:;

						// Check if boss had already been killled!
						bool alreadyKilled = false;
						int npcid = std::stoi(*(*ptr)->mS_Param);
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
							std::cout << "Boss killed twice ?! Skipped this!" << " => " << *(*ptr)->mS_Param << std::endl;
							startLine = nullptr;
							continue;
						}

						return std::make_pair(startLine, *ptr);
					}
					if (!groupBossFight) continue;

					int npcid = std::stoi((*ptr)->mS_Param[0]);
					//std::cout << "Killed: " << npcid << std::endl;
					if (m_BossToGroup.find(npcid) != m_BossToGroup.end())
					{
						groupBossDied[npcid] = true;
					}
					if (groupBossDied.size() == m_GroupToAmount[currentGroupBoss])
					{
						// To make sure the group boss id is returned!
						(*ptr)->mS_Param[0] = std::to_string(m_BossToGroup[npcid]);
						startLine->mS_Param[0] = std::to_string(m_BossToGroup[npcid]);

						// Check if boss had already been killled!
						bool alreadyKilled = false;
						int npcid = std::stoi(*(*ptr)->mS_Param);
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
							std::cout << "Boss killed twice ?! Skipped this!" << " => " << *(*ptr)->mS_Param << std::endl;
							startLine = nullptr;
							continue;
						}
						return std::make_pair(startLine, *ptr);
					}
				}
				else if (startLine == nullptr && ((*ptr)->m_Type == 5 && (*ptr)->mI_Param[0] > 10)) // Trash begin
				{
					startLine = *ptr;
					trashAttempt = true;
				}
				// Problem: If the boss is getting pulled but only a few are infight -> pulling it towards the raid
				else if (startLine != nullptr && !trashAttempt
					&& ((*ptr)->m_Type == 5 && (*ptr)->mI_Param[0] == 0)
					) // Wipe condition
				{
					// Checking if this is just coincidence
					__int64 curTime = m_ArmoryData->m_Parser->m_RealTime[(*ptr)->m_RTIndex] + (*ptr)->m_TimeStamp + 30000;
					for (auto oldPtr = ptr + 1; oldPtr != end && (m_ArmoryData->m_Parser->m_RealTime[(*oldPtr)->m_RTIndex] + (*oldPtr)->m_TimeStamp) < curTime; ++oldPtr)
					{
						if (((*oldPtr)->m_Type == 10 && (*oldPtr)->mI_Param[0] > 0)
							|| ((*oldPtr)->m_Type == 24)
							)
						{
							int npcid = std::stoi((*oldPtr)->mS_Param[0]);
							int npcid2 = -1;
							if (m_BossToGroup.find(npcid) != m_BossToGroup.end())
								npcid2 = m_BossToGroup[npcid];
							if (*startLine->mS_Param == (*oldPtr)->mS_Param[0] 
								|| *startLine->mS_Param == std::to_string(npcid2)
								|| currentGroupBoss == npcid
								|| currentGroupBoss == npcid2
								)
								goto skipWipe;
							if (_DB.IsBossNPC((*oldPtr)->mS_Param[0], npcid))
								break; // This means that we wiped or that we are already at the next boss!
						}
						/*else if ((*oldPtr)->m_Type == 5 && (*oldPtr)->mI_Param[0] > 0)
						{
							goto skipWipe;
						}*/
					}
					if (currentGroupBoss > 0)
					{
						startLine->mS_Param[0] = std::to_string(currentGroupBoss);
						if (m_NotRlyGroupBoss.find(currentGroupBoss) != m_NotRlyGroupBoss.end() && groupBossDied.find(currentGroupBoss) != groupBossDied.end())
						{
							(*ptr)->m_Type = 24;
							(*ptr)->mS_Param[0] = std::to_string(currentGroupBoss);
							return std::make_pair(startLine, *ptr);
						}
					}

					// Kalecgos!
					if (m_BossToGroup.find(std::stoi(startLine->mS_Param[0])) != m_BossToGroup.end())
					{
						int npcid = m_BossToGroup[std::stoi(startLine->mS_Param[0])];
						if (npcid == 24850)
						{
							// Searching for the yell: I am forever in your debt. Once we have triumphed over Kil'jaeden, this entire world will be in your debt as well.
							auto oldPtr = ptr - 10; // Might cause an segfault
							__int64 curTime = m_ArmoryData->m_Parser->m_RealTime[(*ptr)->m_RTIndex] + (*ptr)->m_TimeStamp + 20000;
							for (; oldPtr != end && m_ArmoryData->m_Parser->m_RealTime[(*oldPtr)->m_RTIndex] + (*oldPtr)->m_TimeStamp <= curTime; ++oldPtr)
							{
								if ((*oldPtr)->m_Type == 20 && (*oldPtr)->mS_Param[1] == "I am forever in your debt. Once we have triumphed over Kil'jaeden, this entire world will be in your debt as well.")
								{
									(*ptr)->m_Type = 24;
									(*ptr)->mS_Param[0] = "24850";
									return std::make_pair(startLine, *ptr);
								}
							}
						}
					}

					if (startLine->m_Type == 10)
					{
						// Check if boss had already been killled!
						bool alreadyKilled = false;
						int npcid = std::stoi(*startLine->mS_Param);
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
							std::cout << "Boss killed twice ?! Skipped this!" << " => " << *(*ptr)->mS_Param << std::endl;
							startLine = nullptr;
							continue;
						}
					}
					std::cout << "Boss Wipe: " << startLine->mS_Param[0] << std::endl;

					return std::make_pair(startLine, *ptr);
					skipWipe:;
				}
				}
				catch (...)
				{
					std::cout << "Some unknown error occoured during attempt parsing" << std::endl;
					break;
				}
		}
		if (startLine == nullptr)
			return std::make_pair(nullptr, nullptr);
		if (ptr == end)
			return std::make_pair(startLine, nullptr); // TODO!!!
		return std::make_pair(startLine, *ptr);
	}

	void AnalyzerPost::FetchReferenceTables(__int64 StartTime, __int64 EndTime, DatabaseAccess& DBAccess, int RS_UploaderID, int RS_MAX_SA, int RS_MAX_SAT, int RS_MAX_SATA,
		std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference,
		std::map<int, std::pair<int, int>>& saReferenceReverse, std::map<int, std::pair<int, int>>& satReferenceReverse)
	{
		auto querySA = m_DB->ExecuteStreamStatement("INSERT INTO rs_sa_reference (id,sourceid, abilityid, uploaderid) VALUES (:q<int>, :a<int>, :b<int>, :c<int>)", 100000);
		auto querySAT = m_DB->ExecuteStreamStatement("INSERT INTO rs_sat_reference (id,targetid, said) VALUES (:q<int>, :a<int>, :b<int>)", 100000);
		auto querySATA = m_DB->ExecuteStreamStatement("INSERT INTO rs_sata_reference (id,targetabilityid, satid) VALUES (:q<int>, :a<int>, :b<int>)", 100000);
		// That is a lot slower than I expected :D
		// Problem of Insert Ignore, it will execute a query for every combination
		std::string bufferRefSA(8, '\0');
		std::string bufferRefSAT(12, '\0');
		std::string bufferRefSATA(16, '\0');

		std::map<std::string, bool> doneComb;
		std::map<std::string, bool> doneCombSAT;
		std::map<std::string, bool> doneCombSA;

		int SACount = RS_MAX_SA;
		int SATCount = RS_MAX_SAT;
		int SATACount = RS_MAX_SATA;

		std::map<int, CombatLogEventPost*> extraAttack;
		for (auto& CBTLogVec : m_CombatLogEvents)
		{
			for (auto& cbtLogEvent : CBTLogVec)
			{
				__int64 uTS = cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex];
				if (uTS < StartTime) continue;
				if (uTS > EndTime) goto endCBTLoop;

				if ( // SAT
					 // Micropt
					cbtLogEvent.m_Action <= static_cast<char>(Action::Reflects)
					|| cbtLogEvent.m_AmountType <= static_cast<char>(AmountType::HolyDamage)
					|| (cbtLogEvent.m_Action == static_cast<char>(Action::Gain) && cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health))
					|| (cbtLogEvent.m_Action == static_cast<char>(Action::Drain) && cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health))
					|| cbtLogEvent.m_Action == static_cast<char>(Action::Cast)
					)
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);
					
					if (cbtSourceID <= 0) continue;
					if (cbtLogEvent.m_Action == static_cast<char>(Action::Cast) && m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == "nil")
						m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] = m_CBTLogParser->mNameValues[cbtLogEvent.m_Source];
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (cbtTargetID <= 0) continue;
					int cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], true, cbtLogEvent.m_SpellID);
					if (cbtAbilityID <= 0) continue;

					if (m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName] == "AutoAttack" && extraAttack.find(cbtSourceID) != extraAttack.end() && extraAttack[cbtSourceID]->m_Amount > 0)
					{
						__int64 extraAttackTs = m_CBTLogParser->mRealTime[extraAttack[cbtSourceID]->m_RTIndex] + extraAttack[cbtSourceID]->m_Timestamp;
						if (uTS - 300 <= extraAttackTs)
						{
							cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[extraAttack[cbtSourceID]->m_SpellName], true, extraAttack[cbtSourceID]->m_SpellID);
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
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::ExtraAttack))
				{
					int SourceID = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (SourceID <= 0) continue;
					extraAttack[SourceID] = &cbtLogEvent;
				}
				else if ((cbtLogEvent.m_Action == static_cast<char>(Action::Gain) || cbtLogEvent.m_Action == static_cast<char>(Action::Fades)))
				{
					int cbtSourceID = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (cbtSourceID <= 0) continue;
					int cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], true, cbtLogEvent.m_SpellID);
					if (cbtAbilityID <= 0) continue;

					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					if (doneCombSA[bufferRefSA]) continue;
					querySA.AttachValues(SACount,cbtSourceID, cbtAbilityID, RS_UploaderID);
					doneCombSA[bufferRefSA] = true;
					saReference[bufferRefSA] = SACount;
					saReferenceReverse.insert(std::make_pair(SACount, std::make_pair(cbtSourceID, cbtAbilityID)));
					++SACount;
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Interrupt) || cbtLogEvent.m_Action == static_cast<char>(Action::Dispel))
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);
					if (cbtSourceID <= 0) continue;
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (cbtTargetID <= 0) continue;
					int cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], true, cbtLogEvent.m_SpellID);
					if (cbtAbilityID <= 0) continue;
					int cbtTargetAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_Extra], true, cbtLogEvent.m_ExtraID);
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
						if (doneCombSAT[bufferRefSAT]) continue;
						querySAT.AttachValues(SATCount,cbtTargetID, saReference[bufferRefSA]);
						doneCombSAT[bufferRefSAT] = true;
						satReference[bufferRefSAT] = SATCount;
						satReferenceReverse.insert(std::make_pair(SATCount, std::make_pair(cbtTargetID, saReference[bufferRefSA])));
						++SATCount;
					}

					DBAccess.PackMapKey(bufferRefSATA, 4, cbtSourceID, cbtAbilityID, cbtTargetID, cbtTargetAbilityID);
					if (doneComb[bufferRefSATA]) continue;
					querySATA.AttachValues(SATACount,cbtTargetAbilityID, satReference[bufferRefSAT]);
					doneComb[bufferRefSATA] = true;
					sataReference[bufferRefSATA] = SATACount;
					++SATACount;
				}
				
				if ((cbtLogEvent.m_Action == static_cast<char>(Action::Energize) || cbtLogEvent.m_Action == static_cast<char>(Action::ExtraAttack)) && cbtLogEvent.m_Amount > 0)
					// All kinds of potion
					// Mana could be complicated :/
					// Using a high amount might reduce false positives
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					int cbtTargetID = cbtSourceID;
					int cbtAbilityID = cbtLogEvent.m_SpellID;
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

		querySA.Flush();
		querySAT.Flush();
		querySATA.Flush();
	}

	void AnalyzerPost::FetchAttempts(DatabaseAccess& DBAccess, __int64 StartTime, __int64 EndTime, int RS_UploaderID, int RaidingGuildID, int InstanceID,
		std::map<std::pair<int, int>, std::pair<__int64, __int64>>& bossAttempts, std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>>& m_Attempts)
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
		auto queryProgressHistory = m_DB->ExecuteStreamStatement("INSERT IGNORE INTO am_guilds_progresshistory (id, guildid, instanceid, npcid, attemptid) VALUES (:q<int>, :a<int>, :b<int>, :c<int>, :d<int>)", 1);
		std::vector<SessionLine*>::iterator ptr = m_RaidData.begin();
		std::vector<SessionLine*>::iterator end = m_RaidData.end();
		while ((m_Attempt = GetNextAttempt(DBAccess, ptr, end, bossAttempts)).first != nullptr && m_Attempt.second != nullptr) // An attempt maybe lost here!
		{
			// Regarding the npcid:
			// Either first entry is a boss entry or its 0 => Trash
			int Attempt_NPCID = 3;
			std::string npc = "";
			if (m_Attempt.first->m_Type == 10 && m_Attempt.first->mS_Param != nullptr)
			{
				Attempt_NPCID = DBAccess.GetNPCID(*m_Attempt.first->mS_Param, std::stoi(*m_Attempt.first->mS_Param));
				npc = *m_Attempt.first->mS_Param;
			}
			else if (m_Attempt.second->m_Type == 24 && m_Attempt.first->mS_Param != nullptr) // TODO
			{
				Attempt_NPCID = DBAccess.GetNPCID(*m_Attempt.second->mS_Param, std::stoi(*m_Attempt.first->mS_Param));
				npc = *m_Attempt.second->mS_Param;
			}

			if (Attempt_NPCID == 0)
				Attempt_NPCID = 3;

			// Lets look for the real start and end timestamps!
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
						if (m_CBTLogParser->mNameValues[cbtLogEvent.m_Source] == npc || m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == npc)
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
						if (m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == *m_Attempt.second->mS_Param/* || m_CBTLogParser->mNameValues[cbtLogEvent.m_Source] == *m_Attempt.second->mS_Param*/) // To prevent after hot dmg by bosses
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

		st_rrd_chardata.clear();
		st_rrd_ptr = bossAttempts.begin();
		st_rrd_end = bossAttempts.end();


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
	}

	std::map<int, bool> AnalyzerPost::mFilteredAbilities = {
		{0, false},
		/*{ 38374, true },
		{ 39948, true },
		{ 39835, true },
		{ 39968, true },
		{ 39992, true },*/
	};

	void AnalyzerPost::FetchCombatLogData(DatabaseAccess& DBAccess, __int64 StartTime, __int64 EndTime, int RS_ProgressID, int RS_UploaderID, MySQLStream& queryProgress,
		std::map<std::string, int>& saReference, std::map<std::string, int>& satReference, std::map<std::string, int>& sataReference, std::map<int, std::pair<int, int>>& saReferenceReverse, int RS_Damage_Min, int Faction, Threat& ThreatHandler) 
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
				healEvents.push_back(*itr);
			}
		}

		auto queryHeal = m_DB->ExecuteStreamStatement("INSERT INTO rs_healing (id,satid, hittype, timestamp, amount) VALUES (:q<int>,:a<int>, :b<int>, :c<int>, :d<int>)", 500000);
		auto queryDamage = m_DB->ExecuteStreamStatement("INSERT INTO rs_damage (id,satid, hittype, timestamp, amount) VALUES (:q<int>,:a<int>, :b<int>, :c<int>, :e<int>)", 1000000);
		auto queryMitgated = m_DB->ExecuteStreamStatement("INSERT INTO rs_damage_mitgated (dmgid, type, amount) VALUES (:a<int>, :b<int>, :c<int>)", 1000000);
		auto queryDeath = m_DB->ExecuteStreamStatement("INSERT INTO rs_deaths (sourceid, timestamp, uploaderid) VALUES (:a<int>, :b<int>, :c<int>)", 1000);
		auto queryAuras = m_DB->ExecuteStreamStatement("INSERT INTO rs_auras (said, gained, faded) VALUES (:a<int>, :b<int>, :c<int>)", 20000);
		auto queryInterrupts = m_DB->ExecuteStreamStatement("INSERT INTO rs_interrupts (sataid, timestamp) VALUES (:a<int>, :b<int>)", 500);
		auto queryDispels = m_DB->ExecuteStreamStatement("INSERT INTO rs_dispels (sataid, timestamp) VALUES (:a<int>, :b<int>)", 1500);
		auto queryCasts = m_DB->ExecuteStreamStatement("INSERT INTO rs_casts (satid, timestamp) VALUES (:a<int>, :b<int>)", 60000);
		MySQLStream st_rrd_queryOne = m_DB->ExecuteStreamStatement("INSERT INTO rs_chars_rankings (charid, type, value, attemptid) VALUES (:a<int>, :c<int>, :d<int>, :e<int>)", 100);
		MySQLStream st_rrd_queryTwo = m_DB->ExecuteStreamStatement("SELECT ROUND(10000*(a.value/(b.end-b.start))) FROM rs_chars_rankings_best a LEFT JOIN rs_attempts b ON a.attemptid = b.id WHERE a.charid=:a<int> and b.npcid=:b<int> and a.type=:c<int> ORDER BY a.id DESC LIMIT 1", 1);
		MySQLStream st_rrd_queryThree = m_DB->ExecuteStreamStatement("INSERT INTO rs_chars_rankings_best (charid, type, value, attemptid) VALUES (:a<int>, :c<int>, :d<int>, :e<int>)", 100);
		MySQLStream st_rrd_queryFour = m_DB->ExecuteStreamStatement("DELETE a FROM rs_chars_rankings_best a JOIN rs_attempts b ON a.attemptid = b.id WHERE charid=:a<int> AND b.npcid = :b<int> and a.type = :c<int>", 1);
		MySQLStream st_rrd_queryFive = m_DB->ExecuteStreamStatement("SELECT a.id FROM rs_chars_rankings a JOIN rs_attempts b ON a.attemptid = b.id WHERE charid=:a<int> AND b.npcid = :b<int> and a.type = :c<int> ORDER BY a.id DESC", 100);
		MySQLStream st_rrd_querySix = m_DB->ExecuteStreamStatement("DELETE FROM rs_chars_rankings WHERE id = :a<int>",1);

		MySQLStream mQueryDmg = m_DB->ExecuteStreamStatement("INSERT INTO rs_damage_threat (dmgid, amount) VALUES (:a<int>, :b<int>)", 1000000);
		MySQLStream mQueryHeal = m_DB->ExecuteStreamStatement("INSERT INTO rs_healing_threat (healid, amount) VALUES (:b<int>, :c<int>)", 500000);
		MySQLStream mQueryGained = m_DB->ExecuteStreamStatement("INSERT INTO rs_gained_threat (said, amount, timestamp) VALUES (:b<int>, :c<int>, :d<int>)", 300000);

		std::map<int, __int64> GainedAuras;
		std::map<int, int> GainedAuraMappedToPlayer;
		std::pair<int, std::pair<__int64, __int64>> AuraInserter = std::make_pair(0, std::make_pair(0, 0));

		// Size of the whole thing for progress updates
		int size = 0;
		for (auto& CBTLogVec : m_CombatLogEvents)
			size += static_cast<int>(CBTLogVec.size());
		//std::cout << "Test 13" << std::endl;
		size /= 10;
		int count = 0;
		int countTwo = 1;
		int counnt = 0;

		int maxDmg = GetMaxTableId("rs_damage", true);
		int maxHeal = GetMaxTableId("rs_healing", true);

		// Mitgated damage table
		//std::map<std::string, RsDamageMitgated> mitgated;
		std::map<int, CombatLogEventPost*> extraAttack;
		for (auto& CBTLogVec : m_CombatLogEvents)
		{
			for (auto& cbtLogEvent : CBTLogVec)
			{
				__int64 uTS = cbtLogEvent.m_Timestamp + m_CBTLogParser->mRealTime[cbtLogEvent.m_RTIndex];
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
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);
					if (cbtSourceID <= 0) continue;
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (cbtTargetID <= 0) continue;
					int cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], false, cbtLogEvent.m_SpellID);
					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
					if (satReference[bufferRefSAT] == 0) continue;

					// Remove HoT suffix
					std::string usedSpellId = std::to_string(cbtLogEvent.m_SpellID > 200000 ? cbtLogEvent.m_SpellID - 200000 : cbtLogEvent.m_SpellID);
					for (auto& sess : GetPossibleEvents(m_ArmoryData->m_Parser->m_RealTime, healEvents, 999, uTS))
					{
						if (
							cbtLogEvent.m_Amount == (*sess)->mI_Param[0]
							&& usedSpellId == (*sess)->mS_Param[0] // TODO have some id for the sessions!
							&& m_CBTLogParser->mNameValues[cbtLogEvent.m_Source] == (*sess)->m_Players[0]->_name
							&& ((!(*sess)->mS_Param[1].empty() && std::to_string(cbtLogEvent.m_DestGUID.GetNPCID()) == (*sess)->mS_Param[1]) || ((*sess)->mS_Param[1].empty() && m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == (*sess)->m_Players[1]->_name))
							) // Our best guess!
						{
							++counnt;

							if (cbtLogEvent.m_Amount > (*sess)->mI_Param[1])
							{
								queryHeal.AttachValues(maxHeal, satReference[bufferRefSAT], ActionToInt(static_cast<Action>(cbtLogEvent.m_Action)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount - (*sess)->mI_Param[1]);
								RetrieveRecordData(DBAccess, uTS, 1, cbtLogEvent.m_Amount - (*sess)->mI_Param[1], m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID] > 0 ? m_ArmoryData->m_PetToOwner[cbtLogEvent.m_SourceGUID.m_GUID] : cbtSourceID, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix); // TODO: Do it with ids?
								
								RetrieveRecordData(DBAccess, uTS, 2, ThreatHandler.Feed(cbtSourceID, cbtTargetID, 2, maxHeal, cbtLogEvent, 0, mQueryDmg, mQueryHeal, mQueryGained), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID] > 0 ? m_ArmoryData->m_PetToOwner[cbtLogEvent.m_SourceGUID.m_GUID] : cbtSourceID, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix); // TODO: Do it with ids?

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
					}
					// Pure effective heal
					queryHeal.AttachValues(maxHeal,satReference[bufferRefSAT], ActionToInt(static_cast<Action>(cbtLogEvent.m_Action)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
					RetrieveRecordData(DBAccess, uTS, 1, cbtLogEvent.m_Amount, m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID] > 0 ? m_ArmoryData->m_PetToOwner[cbtLogEvent.m_SourceGUID.m_GUID] : cbtSourceID, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
					RetrieveRecordData(DBAccess, uTS, 2, ThreatHandler.Feed(cbtSourceID, cbtTargetID, 2, maxHeal, cbtLogEvent, 0, mQueryDmg, mQueryHeal, mQueryGained), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID] > 0 ? m_ArmoryData->m_PetToOwner[cbtLogEvent.m_SourceGUID.m_GUID] : cbtSourceID, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix); // TODO: Do it with ids?

					++maxHeal;
					foundSyncHeal:;
				}
				// DAMAGE
				else if (
					(cbtLogEvent.m_Action >= static_cast<char>(Action::Hit) && cbtLogEvent.m_Action <= static_cast<char>(Action::Reflects))
					|| cbtLogEvent.m_AmountType <= static_cast<char>(AmountType::HolyDamage)
					|| (cbtLogEvent.m_Action == static_cast<char>(Action::Drain) && cbtLogEvent.m_AmountType == static_cast<char>(AmountType::Health))
					)
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);
					if (cbtSourceID <= 0) continue;

					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (cbtTargetID <= 0) continue;

					if (cbtTargetID >= 300000 && cbtSourceID >= 300000)
						cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, true, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);

					if (cbtSourceID == cbtTargetID) // Mced pet hits itself?
						cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, true, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);

					int cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], false, cbtLogEvent.m_SpellID);
					if (m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName] == "AutoAttack" && extraAttack.find(cbtSourceID) != extraAttack.end() && extraAttack[cbtSourceID]->m_Amount > 0)
					{
						__int64 extraAttackTs = m_CBTLogParser->mRealTime[extraAttack[cbtSourceID]->m_RTIndex] + extraAttack[cbtSourceID]->m_Timestamp;
						if (uTS - 300 <= extraAttackTs)
						{
							--extraAttack[cbtSourceID]->m_Amount;
							cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[extraAttack[cbtSourceID]->m_SpellName], false, extraAttack[cbtSourceID]->m_SpellID);
							if (cbtAbilityID <= 0) continue;
						}
					}
					if (mFilteredAbilities.find(cbtAbilityID) != mFilteredAbilities.end()) continue;

					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
					if (satReference[bufferRefSAT] == 0) continue;

					if (cbtLogEvent.m_Action == static_cast<char>(Action::Missed))
					{
						if (cbtLogEvent.m_ExtraModifier == static_cast<char>(ExtraModifier::None)) 
							queryDamage.AttachValues(maxDmg,satReference[bufferRefSAT], static_cast<int>(12), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
						else
							queryDamage.AttachValues(maxDmg,satReference[bufferRefSAT], ExtraModToInt(static_cast<ExtraModifier>(cbtLogEvent.m_ExtraModifier)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
					}
					else if (cbtLogEvent.m_Action == static_cast<char>(Action::Hit) || cbtLogEvent.m_Action == static_cast<char>(Action::Suffers) || cbtLogEvent.m_Action == static_cast<char>(Action::Drain))
					{
						queryDamage.AttachValues(maxDmg,satReference[bufferRefSAT], 20 + ExtraModToInt(static_cast<ExtraModifier>(cbtLogEvent.m_ExtraModifier)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
					}
					else
					{
						queryDamage.AttachValues(maxDmg,satReference[bufferRefSAT], 40 + ExtraModToInt(static_cast<ExtraModifier>(cbtLogEvent.m_ExtraModifier)), static_cast<int>(uTS - StartTime), cbtLogEvent.m_Amount);
					}

					if (cbtTargetID < 300000 && (DBAccess.m_NPCLiking[cbtTargetID] == 0 ||
						(DBAccess.m_NPCLiking[cbtTargetID] != Faction && DBAccess.m_NPCLiking[cbtTargetID] != Faction + 2)
						)) // Dont allow friendly fire!
						RetrieveRecordData(DBAccess, uTS, 0, cbtLogEvent.m_Amount, m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID] > 0 ? m_ArmoryData->m_PetToOwner[cbtLogEvent.m_SourceGUID.m_GUID] : cbtSourceID, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);

					if (cbtLogEvent.m_Resisted > 0) queryMitgated.AttachValues(maxDmg, 0, cbtLogEvent.m_Resisted);
					if (cbtLogEvent.m_Blocked > 0) queryMitgated.AttachValues(maxDmg, 1, cbtLogEvent.m_Blocked);
					if (cbtLogEvent.m_Absorbed > 0) queryMitgated.AttachValues(maxDmg, 2, cbtLogEvent.m_Absorbed);

					ThreatHandler.Feed(cbtSourceID, cbtTargetID, 1, maxDmg, cbtLogEvent, 0, mQueryDmg, mQueryHeal, mQueryGained);
					RetrieveRecordData(DBAccess, uTS, 2, ThreatHandler.Feed(cbtSourceID, cbtTargetID, 1, maxDmg, cbtLogEvent, 0, mQueryDmg, mQueryHeal, mQueryGained), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID] > 0 ? m_ArmoryData->m_PetToOwner[cbtLogEvent.m_SourceGUID.m_GUID] : cbtSourceID, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix); // TODO: Do it with ids?
					++maxDmg;
				}
				// DEATH
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Dies))
				{
					int cbtSourceID = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
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
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::ExtraAttack))
				{
					int SourceID = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (SourceID <= 0) continue;
					extraAttack[SourceID] = &cbtLogEvent;
				}
				// AURAS
				else if ((cbtLogEvent.m_Action == static_cast<char>(Action::Gain) || cbtLogEvent.m_Action == static_cast<char>(Action::AfflictedBy)))
				{
					int SourceID = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (SourceID <= 0) continue;
					int AbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], false, cbtLogEvent.m_SpellID);
					DBAccess.PackMapKey(bufferRefSA, 2, SourceID, AbilityID);
					if (saReference[bufferRefSA] == 0) continue;

					if (AuraInserter.first != 0 && (AuraInserter.first != saReference[bufferRefSA] || AuraInserter.second.second != cbtLogEvent.m_Timestamp))
						queryAuras.AttachValues(AuraInserter.first, static_cast<int>(AuraInserter.second.first - StartTime), static_cast<int>(AuraInserter.second.second - StartTime));
					AuraInserter.first = 0;

					RetrieveRecordData(DBAccess, uTS, 2, ThreatHandler.Feed(SourceID, 0, 3, saReference[bufferRefSA], cbtLogEvent, static_cast<int>(uTS - StartTime), mQueryDmg, mQueryHeal, mQueryGained), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID] > 0 ? m_ArmoryData->m_PetToOwner[cbtLogEvent.m_SourceGUID.m_GUID] : SourceID, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix); // TODO: Do it with ids?

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
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Fades) /*|| cbtLogEvent.m_Action == static_cast<char>(Action::Removed)*/)
				{
					int SourceID = GetCharacterOrPetID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (SourceID <= 0) continue;

					int AbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], false, cbtLogEvent.m_SpellID);
					DBAccess.PackMapKey(bufferRefSA, 2, SourceID, AbilityID);
					if (saReference[bufferRefSA] == 0) continue;

					ThreatHandler.Feed(SourceID, 0, 0, 0, cbtLogEvent, 0, mQueryDmg, mQueryHeal, mQueryGained);

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
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Interrupt))
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);
					if (cbtSourceID <= 0) continue;
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (cbtTargetID <= 0) continue;
					int cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], true, cbtLogEvent.m_SpellID);
					if (cbtAbilityID <= 0) continue;
					int cbtTargetAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_Extra], true, cbtLogEvent.m_ExtraID);
					if (cbtTargetAbilityID <= 0) continue;
					DBAccess.PackMapKey(bufferRefSATA, 4, cbtSourceID, cbtAbilityID, cbtTargetID, cbtTargetAbilityID);
					if (sataReference[bufferRefSATA] == 0) continue;
					queryInterrupts.AttachValues(sataReference[bufferRefSATA], static_cast<int>(uTS - StartTime));
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Dispel))
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);
					if (cbtSourceID <= 0) continue;
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (cbtTargetID <= 0) continue;
					int cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], true, cbtLogEvent.m_SpellID);
					if (cbtAbilityID <= 0) continue;
					int cbtTargetAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_Extra], true, cbtLogEvent.m_ExtraID);
					if (cbtTargetAbilityID <= 0) continue;
					DBAccess.PackMapKey(bufferRefSATA, 4, cbtSourceID, cbtAbilityID, cbtTargetID, cbtTargetAbilityID);
					if (sataReference[bufferRefSATA] == 0) continue;
					queryDispels.AttachValues(sataReference[bufferRefSATA], static_cast<int>(uTS - StartTime));
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::Cast))
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);
					if (cbtSourceID <= 0) continue;
					if (m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] == "nil")
						m_CBTLogParser->mNameValues[cbtLogEvent.m_Target] = m_CBTLogParser->mNameValues[cbtLogEvent.m_Source];
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (cbtTargetID <= 0) continue;
					int cbtAbilityID = DBAccess.GetAbilityID(m_CBTLogParser->mNameValues[cbtLogEvent.m_SpellName], false, cbtLogEvent.m_SpellID);
					DBAccess.PackMapKey(bufferRefSAT, 3, cbtSourceID, cbtAbilityID, cbtTargetID);
					if (satReference[bufferRefSAT] == 0) continue;

					ThreatHandler.Feed(cbtSourceID, cbtTargetID, 0, 0, cbtLogEvent, 0, mQueryDmg, mQueryHeal, mQueryGained);

					queryCasts.AttachValues(satReference[bufferRefSAT], static_cast<int>(uTS - StartTime));
				}
				else if (cbtLogEvent.m_Action == static_cast<char>(Action::AuraRefresh))
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS, false, cbtLogEvent.m_SourceGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_SourceGUID.m_GUID]);
					if (cbtSourceID <= 0) continue;
					int cbtTargetID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Target], uTS, false, cbtLogEvent.m_DestGUID.GetNPCID(), m_ArmoryData->m_PetToId[cbtLogEvent.m_DestGUID.m_GUID]);
					if (cbtTargetID <= 0) continue;
					ThreatHandler.Feed(cbtSourceID, cbtTargetID, 0, 0, cbtLogEvent, 0, mQueryDmg, mQueryHeal, mQueryGained);
				}

				// TODO: Do something with gained mana, rage, energy by auras etc. => Maybe conclude who drank and ate when from it?
				if ((cbtLogEvent.m_Action == static_cast<char>(Action::Energize) || cbtLogEvent.m_Action == static_cast<char>(Action::ExtraAttack)) && cbtLogEvent.m_Amount > 0)
					// All kinds of potion
					// Mana could be complicated :/
					// Using a high amount might reduce false positives
				{
					int cbtSourceID = GetTargetSourceID(DBAccess, m_CBTLogParser->mNameValues[cbtLogEvent.m_Source], uTS);
					int cbtTargetID = cbtSourceID;
					int cbtAbilityID = cbtLogEvent.m_SpellID;
					if (cbtSourceID <= 0) continue;
					if (cbtTargetID <= 0) continue;
					if (cbtAbilityID <= 0) continue;
					DBAccess.PackMapKey(bufferRefSA, 2, cbtSourceID, cbtAbilityID);
					if (saReference[bufferRefSA] == 0) continue;
					ThreatHandler.Feed(cbtSourceID, cbtTargetID, 3, saReference[bufferRefSA], cbtLogEvent, static_cast<int>(uTS - StartTime), mQueryDmg, mQueryHeal, mQueryGained); 
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

		queryHeal.Flush();
		queryDamage.Flush();
		queryDeath.Flush();
		queryAuras.Flush();
		queryInterrupts.Flush();
		queryDispels.Flush();
		queryCasts.Flush();
		
		mQueryDmg.Flush();
		mQueryHeal.Flush();
		mQueryGained.Flush();

		std::cout << "Overheal events total: " << cunt << std::endl;
		std::cout << "Overheal events skipped: " << healEvents.size() << std::endl;
		std::cout << "Overheal events found: " << counnt << std::endl;

		queryMitgated.Flush();
	}
	void AnalyzerPost::FetchSessionData(DatabaseAccess& DBAccess, int RS_UploaderID, __int64 StartTime, std::vector<std::pair<int, std::pair<SessionLine*, SessionLine*>>>& m_Attempts)
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
							&& (lastLastBossAttempt == nullptr || sessLine->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[sessLine->m_RTIndex] <= lastLastBossAttempt->second.second->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[lastBossAttempt->second.second->m_RTIndex])
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

				if (AttemptID == 0) continue; // Something went wrong here!

				int charid = GetCharacterOrPetID(DBAccess, sessLine->m_Players[0]->_name, 0, true);
				if (charid < 300000) continue;
				queryLoot.AttachValues(charid, sessLine->mI_Param[0], AttemptID, RS_UploaderID);
			}
			else if (sessLine->m_Type == 20 && DBAccess.IsBossNPC(sessLine->mS_Param[0])) // Speech (Including boss yells)
			{
				int yellid = DBAccess.GetYellID(sessLine->mS_Param[1]);
				if (yellid > 0)
					queryYells.AttachValues(DBAccess.GetNPCID(sessLine->mS_Param[0]), yellid, static_cast<int>(sessLine->m_TimeStamp + m_ArmoryData->m_Parser->m_RealTime[sessLine->m_RTIndex] - StartTime), RS_UploaderID);
			}
		}

		queryYells.Flush();
		queryLoot.Flush();
	}

	// TODO: What to do if multiple bosses are killed within one attempt ? ^^
	// TODO: Can be optimized / Pretty(tized?)
	void AnalyzerPost::RetrieveRecordData(RPLL::DatabaseAccess& _DB, const long long _TS, int _Type, int _Value, int _CharID,
		RPLL::MySQLStream& st_rrd_queryOne, RPLL::MySQLStream& st_rrd_queryTwo, RPLL::MySQLStream& st_rrd_queryThree, RPLL::MySQLStream& st_rrd_queryFour, RPLL::MySQLStream& st_rrd_queryFive, RPLL::MySQLStream& st_rrd_querySix)
	{
		if (_CharID < 300000) return; // No char!
		if (st_rrd_ptr == st_rrd_end) return; // Cant continue!
		if (st_rrd_ptr->second.first > _TS) return; // Wrong timeframe!
			
		if (st_rrd_ptr->second.second >= _TS)
		{
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
				for (int i = 0; i < 3; ++i)
				{
					if (record.second[i] > 0)
					{
						int rowCount = 1;
						st_rrd_queryFive.AttachValues(record.first, st_rrd_ptr->first.second, i);
						while (st_rrd_queryFive.HasData())
						{
							int rId = 0;
							st_rrd_queryFive.ReadData(&rId);
							if (rowCount >= 5)
								st_rrd_querySix.AttachValues(rId);
							++rowCount;
						}
						st_rrd_queryFive.Flush();

						st_rrd_queryOne.AttachValues(record.first, i, record.second[i], st_rrd_ptr->first.first);

						// Best ranking
						st_rrd_queryTwo.AttachValues(record.first, st_rrd_ptr->first.second, i);
						if (st_rrd_queryTwo.HasData())
						{
							int BestKill;
							st_rrd_queryTwo.ReadData(&BestKill);
							int bestValue = static_cast<int>(ceil((i==3 ? 100.0 : 10000.0)*record.second[i] / static_cast<int>(st_rrd_ptr->second.second - st_rrd_ptr->second.first)));
							if (BestKill < bestValue)
							{
								st_rrd_queryFour.AttachValues(record.first, st_rrd_ptr->first.second, i);
								st_rrd_queryThree.AttachValues(record.first, i, record.second[i], st_rrd_ptr->first.first);
							}
						}
						else
						{
							st_rrd_queryThree.AttachValues(record.first, i, record.second[i], st_rrd_ptr->first.first);
						}
					}
				}
			}

			st_rrd_queryOne.Flush();
			st_rrd_queryThree.Flush();
			st_rrd_chardata.clear();
			++st_rrd_ptr;
			RetrieveRecordData(_DB, _TS, _Type, _Value, _CharID, st_rrd_queryOne, st_rrd_queryTwo, st_rrd_queryThree, st_rrd_queryFour, st_rrd_queryFive, st_rrd_querySix);
		}
			
		
	}
}

