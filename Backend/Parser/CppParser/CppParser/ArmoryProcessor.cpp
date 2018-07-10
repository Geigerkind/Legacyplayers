#include "ArmoryProcessor.h"
#include "AnalyzerUtility.h"

namespace RPLL
{
	void ArmoryProcessor::OnUpdate()
	{
		int latestUpdate = 0;
		auto query = db->ExecuteStreamStatement("SELECT `AUTO_INCREMENT` FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'RPLL" + (!mPostVanilla ? std::string("_VANILLA") : std::string("_TBC")) + "' AND TABLE_NAME=:a<char[20]>", 1);
		std::string amChars = "am_chars_data";
		query.AttachValues(amChars);
		//auto query = m_DB->ExecuteStreamStatement("SELECT id FROM " + _Table + " ORDER BY id DESC LIMIT 1", 1, true);
		if (query.HasData())
			query.ReadData(&latestUpdate);
		query.CompleteStatement();

		auto streamLock1 = db2->ExecuteStreamStatement("SELECT id FROM gn_user LIMIT :a<int>", 1);
		auto streamLock2 = db->ExecuteStreamStatement("SELECT id FROM gn_uploader LIMIT :a<int>", 1);
		auto deadLockQuery = db2->ExecuteStreamStatement("SELECT (IFNULL(MAX(timestamp), 0)+300 < UNIX_TIMESTAMP()) AS chk FROM gn_deadlock LIMIT :a<int>", 1);
		auto specUpdate = db->ExecuteStreamStatement("UPDATE am_chars_ref_misc SET talents=:a<int> WHERE id = (SELECT IFNULL(z.ref_misc, 0) FROM rpll.gn_chars y LEFT JOIN am_chars_data z ON y.latestupdate = z.id WHERE y.id=:b<int> LIMIT 1)", 1);

		auto sqlstream = db->ExecuteStreamStatement("INSERT INTO am_chars_data (charid, uploaderid, ref_misc, ref_guild, ref_honor" + (mPostVanilla ? std::string(", ref_arena") : "") + ", ref_gear) VALUES (:a<int>" + (mPostVanilla ? std::string(",:b<int>") : "") + ",:c<int>,:d<int>,:e<int>,:f<int>,:g<int>)", 1);
		auto sqlStreamChars = db2->ExecuteStreamStatement("UPDATE gn_chars SET latestupdate=:a<int> WHERE id=:b<int>", 1);
		auto sqlStreamArena = db->ExecuteStreamStatement(mPostVanilla ? "INSERT INTO am_chars_arena_data (arenaid, games, wins, ranking, uploaderid) VALUES (:a<int>, :b<short int>, :c<short int>, :d<short int>, :e<int>)" : "SELECT * FROM gn_uploader LIMIT 0", 1);

		auto lifetimerank = db->ExecuteStreamStatement(mPostVanilla ? "SELECT * FROM gn_uploader LIMIT 0" : "INSERT IGNORE INTO am_chars_lifetimerank (`charid`, `rank`, `uploaderid`) VALUES (:a<int>, :b<int>, :c<int>)");
		
		while (mRun)
		{
			try
			{
				APData apData;
				if (!mQueue.try_dequeue(apData))
				{
					int test = 0;
					try
					{
						streamLock1.AttachValues(1);
						if (streamLock1.HasData()) streamLock1.ReadData(&test);
					}
					catch (otl_exception&) // Connection gone away?
					{
						std::cout << "Detected Connection gone away!" << std::endl;
						delete db2;
						db2 = new MySQLConnector("root", "", "RPLL_BACKEND", "rpll");
						streamLock1 = db2->ExecuteStreamStatement("SELECT id FROM gn_user LIMIT :a<int>", 1);
						deadLockQuery = db2->ExecuteStreamStatement("SELECT (IFNULL(MAX(timestamp), 0)+300 < UNIX_TIMESTAMP()) AS chk FROM gn_deadlock LIMIT :a<int>", 1);
						sqlStreamChars = db2->ExecuteStreamStatement("UPDATE gn_chars SET latestupdate=:a<int> WHERE id=:b<int>", 1);
					}
					try
					{
						streamLock2.AttachValues(1);
						if (streamLock2.HasData()) streamLock2.ReadData(&test);
					}
					catch(otl_exception&)
					{
						std::cout << "Detected Connection gone away!" << std::endl;
						delete db;
						streamLock2 = db->ExecuteStreamStatement("SELECT id FROM gn_uploader LIMIT :a<int>", 1);
						sqlstream = db->ExecuteStreamStatement("INSERT INTO am_chars_data (charid, uploaderid, ref_misc, ref_guild, ref_honor" + (mPostVanilla ? std::string(", ref_arena") : "") + ", ref_gear) VALUES (:a<int>" + (mPostVanilla ? std::string(",:b<int>") : "") + ",:c<int>,:d<int>,:e<int>,:f<int>,:g<int>)", 1);
						sqlStreamArena = db->ExecuteStreamStatement(mPostVanilla ? "INSERT INTO am_chars_arena_data (arenaid, games, wins, ranking, uploaderid) VALUES (:a<int>, :b<short int>, :c<short int>, :d<short int>, :e<int>)" : "SELECT * FROM gn_uploader LIMIT 0", 1);
						lifetimerank = db->ExecuteStreamStatement(mPostVanilla ? "SELECT * FROM gn_uploader LIMIT 0" : "INSERT IGNORE INTO am_chars_lifetimerank (charid, `rank`, uploaderid) VALUES (:a<int>, :b<int>, :c<int>)", 1);
					}
					std::this_thread::sleep_for(std::chrono::seconds(10));
					continue;
				}
				//std::cout << "Processing: " << apData.uData.m_ID << std::endl;

				if (apData.uData.m_ID < 300000) continue; // No player!

				// Handling the deadlock
				// Plan: Check variable in DB if the frontend uses the part of the db currently and vice versa
				while (true)
				{
					int test = 0;
					try
					{
						streamLock2.AttachValues(1);
						if (streamLock2.HasData()) streamLock2.ReadData(&test);
					}
					catch (otl_exception&)
					{
						std::cout << "Detected Connection gone away!" << std::endl;
						delete db;
						streamLock2 = db->ExecuteStreamStatement("SELECT id FROM gn_uploader LIMIT :a<int>", 1);
						sqlstream = db->ExecuteStreamStatement("INSERT INTO am_chars_data (charid, uploaderid, ref_misc, ref_guild, ref_honor" + (mPostVanilla ? std::string(", ref_arena") : "") + ", ref_gear) VALUES (:a<int>" + (mPostVanilla ? std::string(",:b<int>") : "") + ",:c<int>,:d<int>,:e<int>,:f<int>,:g<int>)", 1);
						sqlStreamArena = db->ExecuteStreamStatement(mPostVanilla ? "INSERT INTO am_chars_arena_data (arenaid, games, wins, ranking, uploaderid) VALUES (:a<int>, :b<short int>, :c<short int>, :d<short int>, :e<int>)" : "SELECT * FROM gn_uploader LIMIT 0", 1);
						lifetimerank = db->ExecuteStreamStatement(mPostVanilla ? "SELECT * FROM gn_uploader LIMIT 0" : "INSERT IGNORE INTO am_chars_lifetimerank (charid, `rank`, uploaderid) VALUES (:a<int>, :b<int>, :c<int>)", 1);
					}
					db2->ExecuteStatement("SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED");
					deadLockQuery.AttachValues(1);
					if (!deadLockQuery.HasData())
					{
						db2->ExecuteStatement("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ");
						break;
					}
					db2->ExecuteStatement("SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ");
					short chk = 0;
					deadLockQuery.ReadData(&chk);
					if (chk == 1) // That probably means that there was some form of crash 
					{
						//db2->ExecuteStatement("DELETE FROM gn_deadlock");
						//db2->ExecuteStatement("INSERT INTO gn_deadlock (timestamp) VALUES (UNIX_TIMESTAMP())");
						break;
					}
					std::this_thread::sleep_for(std::chrono::seconds(10));
				}

				// Retrieving the old data
				ArmoryCharData charData;
				GetArmoryCharData(charData, apData.uData.m_ID, mPostVanilla);
				UpdateProfessions(apData.uData.m_ID, apData.uData.m_Prof1, apData.uData.m_Prof2);

				int refMiscID = GetRefMiscID(apData.uData.mTalents, apData.uData.m_Level, apData.uData.m_Sex, apData.uData.m_Race, apData.uData.m_Class, true);
				int refGuildID = GetRefGuildID(apData.uData.m_RankName, apData.uData.m_RankIndex, apData.uData.m_GuildID, true);
				int refHonorID = charData.m_RefHonor;
				int refArenaID = charData.m_RefArena;
				int refGearID = charData.m_RefGear;

				if (refMiscID < 0)
					refMiscID = charData.m_RefMisc;
				if (refGuildID < 0)
					refGuildID = charData.m_RefGuild;

				if (apData.Version < 100)
				{
					if (apData.Version >= 13)
					{
						if (apData.uData.m_PvPData._lifeTimeHK > 0)
							refHonorID = GetRefHonorID(apData.uData.m_PvPData._rankIndex, apData.uData.m_PvPData._progress, apData.uData.m_PvPData._lifeTimeHK, apData.uData.m_PvPData._lifeTimeDK, apData.uData.m_PvPData._weekHonor, apData.uData.m_PvPData._lastWeekStanding, true);

						SetLifeTimeRank(apData.uData.m_ID, apData.uData.m_PvPData._lifeTimeRank, apData.Uploader);
					}
				}
				else
				{
					if (apData.uData.m_PvPData._lifeTimeHK > 0)
						refHonorID = GetRefHonorID(1, 1, apData.uData.m_PvPData._lifeTimeHK, apData.uData.m_PvPData._lifeTimeDK, apData.uData.m_PvPData._weekHonor, 1, true);

					// Handle Arena Data
					int a2v2 = (apData.uData.mArenaData[0].mSize == 2) ? GetArenaTeamID(0, apData.uData.mArenaData[0].mName, apData.RealmId, true) : 0;
					int a3v3 = apData.uData.mArenaData[1].mSize == 3 ? GetArenaTeamID(1, apData.uData.mArenaData[1].mName, apData.RealmId, true) : 0;
					int a5v5 = apData.uData.mArenaData[2].mSize == 5 ? GetArenaTeamID(2, apData.uData.mArenaData[2].mName, apData.RealmId, true) : 0;

					int refArena = GetRefArenaID(a2v2, a3v3, a5v5, true);
					if (refArena > 0)
						refArenaID = refArena;

					// Insert data point for each team!
					if (a2v2 > 0) sqlStreamArena.AttachValues(a2v2, apData.uData.mArenaData[0].mSeasonPlayed, apData.uData.mArenaData[0].mSeasonWins, apData.uData.mArenaData[0].mRating, apData.Uploader);
					if (a3v3 > 0) sqlStreamArena.AttachValues(a3v3, apData.uData.mArenaData[1].mSeasonPlayed, apData.uData.mArenaData[1].mSeasonWins, apData.uData.mArenaData[1].mRating, apData.Uploader);
					if (a5v5 > 0) sqlStreamArena.AttachValues(a5v5, apData.uData.mArenaData[2].mSeasonPlayed, apData.uData.mArenaData[2].mSeasonWins, apData.uData.mArenaData[2].mRating, apData.Uploader);
				}

				int items[19];
				bool notZero = false;
				for (int i = 0; i < 19; ++i)
				{
					if (apData.uData.m_Gear[i]._id > 0)
					{
						items[i] = GetRefItemSlotID(&apData.uData.m_Gear[i], true); // TODO: Sort the gems in the right order at parsing!
						if (items[i] > 0)
							notZero = true;
					}
					else
						items[i] = 0;
				}
				//std::cout << "T" << 4 << std::endl;

				if (notZero)
					refGearID = GetRefGearID(items, true);


				// Now generate a new profile
				if (mPostVanilla)
					sqlstream.AttachValues(apData.uData.m_ID, apData.Uploader, refMiscID, refGuildID, refHonorID, refArenaID, refGearID);
				else
				{
					sqlstream.AttachValues(apData.uData.m_ID, apData.Uploader, refMiscID, refGuildID, refHonorID, refGearID);
					//lifetimerank.Flush();
				}
				//std::cout << "T" << 5 << std::endl;
				charData.m_RefMisc = refMiscID;
				charData.m_RefGuild = refGuildID;
				charData.m_RefHonor = refHonorID;
				charData.m_RefArena = refArenaID;
				charData.m_RefGear = refGearID;
				InsertArmoryData(std::move(charData), apData.uData.m_ID);

				sqlStreamChars.AttachValues(latestUpdate, apData.uData.m_ID);
				++latestUpdate;
				//std::cout << "T" << 6 << std::endl;


				// Adding Specs to it
				std::pair<int, int> spec;
				if (mSpecsQueue.try_dequeue(spec))
				{
					specUpdate.AttachValues(spec.second, spec.first);
				}

			}
			catch (otl_exception& p)
			{ // intercept OTL exceptions
				std::cerr << p.msg << std::endl; // print out error message
				std::cerr << p.stm_text << std::endl; // print out SQL that caused the error
				std::cerr << p.var_info << std::endl; // print out the variable that caused the error
				std::this_thread::sleep_for(std::chrono::seconds(10));
			}
			catch (std::exception ex)
			{
				std::cout << "A unit didnt process correctly!" << std::endl;
				std::cout << "Exception: " << ex.what() << std::endl;
				std::this_thread::sleep_for(std::chrono::seconds(10));
			}
			catch (...)
			{
				std::cout << "Armory processing: Unhandled excpetion!" << std::endl;
				std::this_thread::sleep_for(std::chrono::seconds(10));
			}
		}
	}

	ArmoryProcessor::ArmoryProcessor(DatabaseAccess* _DBAccess, bool _PostVanilla)
	{
		DBAccess = _DBAccess;
		db2 = new MySQLConnector("root", "", "RPLL_BACKEND", "rpll"); // General one!
		if (_PostVanilla)
			db = new MySQLConnector("root", "", "RPLL_TBC_BACKEND", "RPLL_TBC");
		else
			db = new MySQLConnector("root", "", "RPLL_VANILLA_BACKEND", "RPLL_VANILLA");
		mPostVanilla = _PostVanilla;

		db->ExecuteStatement("SET SESSION wait_timeout=28600");
		db->ExecuteStatement("SET SESSION interactive_timeout=28600");
		db2->ExecuteStatement("SET SESSION wait_timeout=28600");
		db2->ExecuteStatement("SET SESSION interactive_timeout=28600");

		std::cout << "Loading table 'gn_chars'... \n";
		auto chars = db2->ExecuteStreamStatement("SELECT a.name, a.id, a.serverid FROM gn_chars a JOIN db_servernames b ON a.serverid = b.id WHERE a.ownerid = 0 and b.expansion=" + std::string(_PostVanilla ? "1" : "0"), 1, true);
		while (chars.HasData())
		{
			std::string name;
			int id;
			int serverID;
			CharData crData;
			chars.ReadData(&name, &id, &serverID);
			std::string key = name + "," + std::to_string(serverID); // !!
			crData.m_Name = name;
			crData.m_LifeTimeRank = 0;
			crData.m_GuildId = 0;
			DBAccess->m_CharacterIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), std::move(id)));
			m_CharData.insert(std::make_pair(id, std::move(crData)));
		}
		chars.Flush();
		chars.CompleteStatement();

		/*
		std::cout << "Loading information 'Chars_classtalents'... \n";
		auto classtalents = db->ExecuteStreamStatement("SELECT a.id, IFNULL(d.class, 0), IFNULL(d.talents, 0) FROM rpll.gn_chars a JOIN rpll.db_servernames b ON a.serverid = b.id LEFT JOIN am_chars_data c ON a.latestupdate = c.id LEFT JOIN am_chars_ref_misc d ON c.ref_misc = d.id WHERE a.ownerid = 0 and b.expansion=" + std::string(_PostVanilla ? "1" : "0"), 1, true);
		while (classtalents.HasData())
		{
			int id, classid;
			std::string talents;
			classtalents.ReadData(&id, &classid, &talents);
			m_CharClassTalents.insert(std::make_pair(std::move(id), std::make_pair(std::move(classid), std::move(talents))));
		}
		classtalents.Flush();
		classtalents.CompleteStatement();
		*/

		std::cout << "Loading table 'am_chars_armory'... \n";
		if (_PostVanilla)
		{
			auto charsArmory = db->ExecuteStreamStatement("SELECT b.charid, IFNULL(b.ref_misc, 0), IFNULL(b.ref_guild, 0), IFNULL(b.ref_honor, 0), IFNULL(b.ref_arena, 0), IFNULL(b.ref_gear, 0), (0) as `rank`, IFNULL(d.guildid, -1) FROM am_chars_data b LEFT JOIN am_chars_ref_guild d ON b.ref_guild = d.id JOIN rpll.gn_chars e ON e.latestupdate = b.id JOIN rpll.db_servernames q ON e.serverid = q.id JOIN gn_uploader f ON f.id = b.uploaderid WHERE q.expansion=1 AND f.timestamp >= (UNIX_TIMESTAMP() - 2419200)*1000", 1, true);
			while (charsArmory.HasData())
			{
				int id;
				charsArmory.ReadData(&id);
				ArmoryCharData amData;
				CharData crData = m_CharData[id];
				charsArmory.ReadData(&amData.m_RefMisc, &amData.m_RefGuild, &amData.m_RefHonor, &amData.m_RefArena, &amData.m_RefGear, &crData.m_LifeTimeRank, &crData.m_GuildId);
				m_ArmoryCharData[id] = std::move(amData);
			}
			charsArmory.Flush();
			charsArmory.CompleteStatement();
		}
		else
		{
			auto charsArmory = db->ExecuteStreamStatement("SELECT b.charid, IFNULL(b.ref_misc, 0), IFNULL(b.ref_guild, 0), IFNULL(b.ref_honor, 0), (0) as arena, IFNULL(b.ref_gear, 0), IFNULL(c.rank, -1), IFNULL(d.guildid, -1) FROM am_chars_data b LEFT JOIN am_chars_lifetimerank c ON b.charid = c.charid LEFT JOIN am_chars_ref_guild d ON b.ref_guild = d.id JOIN rpll.gn_chars e ON e.latestupdate = b.id JOIN rpll.db_servernames q ON e.serverid = q.id JOIN gn_uploader f ON f.id = b.uploaderid WHERE q.expansion=0 AND f.timestamp >= (UNIX_TIMESTAMP() - 2419200)*1000", 1, true);
			while (charsArmory.HasData())
			{
				int id;
				charsArmory.ReadData(&id);
				ArmoryCharData amData;
				CharData crData = m_CharData[id];
				charsArmory.ReadData(&amData.m_RefMisc, &amData.m_RefGuild, &amData.m_RefHonor, &amData.m_RefArena, &amData.m_RefGear, &crData.m_LifeTimeRank, &crData.m_GuildId);
				m_ArmoryCharData[id] = std::move(amData);
			}
			charsArmory.Flush();
			charsArmory.CompleteStatement();
		}

		std::cout << "Loading table 'am_chars_ref_misc'... \n";
		if (_PostVanilla)
		{
			//auto refMisc = db->ExecuteStreamStatement("SELECT c.level, c.gender, c.race, c.class, c.id, c.talents FROM rpll.gn_chars a JOIN rpll.db_servernames q ON a.serverid = q.id JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_misc c ON b.ref_misc = c.id WHERE q.expansion=1", 1, true);
			auto refMisc = db->ExecuteStreamStatement("SELECT c.level, c.gender, c.race, c.class, c.id, c.talents FROM am_chars_ref_misc c", 1, true);
			while (refMisc.HasData())
			{
				std::string talents;
				int level, gender, race, clss, id;
				refMisc.ReadData(&level, &gender, &race, &clss, &id, &talents);
				std::string key = std::to_string(level) + "," + std::to_string(gender) + "," + std::to_string(race) + "," + std::to_string(clss) + "," + talents;
				m_RefMiscIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), id));
			}
			refMisc.Flush();
			refMisc.CompleteStatement();
		}
		else
		{
			//auto refMisc = db->ExecuteStreamStatement("SELECT c.level, c.gender, c.race, c.class, c.id FROM rpll.gn_chars a JOIN rpll.db_servernames q ON a.serverid = q.id JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_misc c ON b.ref_misc = c.id WHERE q.expansion=0", 1, true);
			auto refMisc = db->ExecuteStreamStatement("SELECT c.level, c.gender, c.race, c.class, c.id FROM am_chars_ref_misc c", 1, true);
			while (refMisc.HasData())
			{
				int level, gender, race, clss, id;
				refMisc.ReadData(&level, &gender, &race, &clss, &id);
				std::string key = std::to_string(level) + "," + std::to_string(gender) + "," + std::to_string(race) + "," + std::to_string(clss) + ",";
				m_RefMiscIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), id));
			}
			refMisc.Flush();
			refMisc.CompleteStatement();
		}

		std::cout << "Loading table 'am_chars_ref_guild'... \n";
		//auto refGuild = db->ExecuteStreamStatement("SELECT c.guildid, c.grankindex, c.grankname, c.id FROM rpll.gn_chars a JOIN rpll.db_servernames q ON a.serverid = q.id JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_guild c ON b.ref_guild = c.id WHERE q.expansion=" + std::string(_PostVanilla ? "1" : "0"), 1, true);
		auto refGuild = db->ExecuteStreamStatement("SELECT c.guildid, c.grankindex, c.grankname, c.id FROM am_chars_ref_guild c", 1, true);
		while (refGuild.HasData())
		{
			int guildid, grankindex, id;
			std::string grankname;
			refGuild.ReadData(&guildid, &grankindex, &grankname, &id);
			std::string key = std::to_string(grankindex) + "," + std::to_string(guildid) + grankname;
			m_RefGuildIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), id));
		}
		refGuild.Flush();
		refGuild.CompleteStatement();

		std::cout << "Loading table 'am_chars_ref_gear_slot'... \n";
		if (_PostVanilla)
		{
			//auto refGearSlot = db->ExecuteStreamStatement("SELECT c.itemid, c.enchid, c.genenchid, c.gemid, c.id FROM rpll.gn_chars a JOIN rpll.db_servernames q ON a.serverid = q.id JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_gear d ON b.ref_gear = d.id JOIN am_chars_ref_gear_slot c ON c.`id` IN (d.`back`, d.`chest`, d.`feet`, d.`hands`, d.`head`, d.`legs`, d.`mainhand`, d.`neck`, d.`offhand`, d.`ranged`, d.`ring1`, d.`ring2`, d.`shirt`, d.`shoulder`, d.`tabard`, d.`trinket1`, d.`trinket2`, d.`waist`, d.`wrist`) WHERE q.expansion=1", 1, true);
			auto refGearSlot = db->ExecuteStreamStatement("SELECT c.itemid, c.enchid, c.genenchid, c.gemid, c.id FROM am_chars_ref_gear_slot c", 1, true);
			while (refGearSlot.HasData())
			{
				int itemid, enchid, genenchid, id, gemid;
				refGearSlot.ReadData(&itemid, &enchid, &genenchid, &gemid, &id);
				std::string key = std::to_string(itemid) + "," + std::to_string(enchid) + "," + std::to_string(genenchid) + "," + std::to_string(gemid);
				m_RefItemSlotIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), id));
			}
			refGearSlot.Flush();
			refGearSlot.CompleteStatement();
		}
		else
		{
			//auto refGearSlot = db->ExecuteStreamStatement("SELECT c.itemid, c.enchid, c.genenchid, c.id FROM rpll.gn_chars a JOIN rpll.db_servernames q ON a.serverid = q.id JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_gear d ON b.ref_gear = d.id JOIN am_chars_ref_gear_slot c ON c.`id` IN (d.`back`, d.`chest`, d.`feet`, d.`hands`, d.`head`, d.`legs`, d.`mainhand`, d.`neck`, d.`offhand`, d.`ranged`, d.`ring1`, d.`ring2`, d.`shirt`, d.`shoulder`, d.`tabard`, d.`trinket1`, d.`trinket2`, d.`waist`, d.`wrist`) WHERE q.expansion=0", 1, true);
			auto refGearSlot = db->ExecuteStreamStatement("SELECT c.itemid, c.enchid, c.genenchid, c.id FROM am_chars_ref_gear_slot c", 1, true);
			while (refGearSlot.HasData())
			{
				int itemid, enchid, genenchid, id;
				refGearSlot.ReadData(&itemid, &enchid, &genenchid, &id);
				std::string key = std::to_string(itemid) + "," + std::to_string(enchid) + "," + std::to_string(genenchid) + ",0";
				m_RefItemSlotIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), id));
			}
			refGearSlot.Flush();
			refGearSlot.CompleteStatement();
		}

		std::cout << "Loading table 'am_chars_ref_gear'... \n";
		//auto refGear = db->ExecuteStreamStatement("SELECT c.head, c.neck, c.shoulder, c.shirt, c.chest, c.waist, c.legs, c.feet, c.wrist, c.hands, c.ring1, c.ring2, c.trinket1, c.trinket2, c.back, c.mainhand, c.offhand, c.ranged, c.tabard, c.id FROM rpll.gn_chars a JOIN rpll.db_servernames q ON a.serverid = q.id JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_gear c ON b.ref_gear = c.id WHERE q.expansion=" + std::string(_PostVanilla ? "1" : "0"), 1, true);
		// head=:a<int> and neck=:b<int> and shoulder=:c<int> and shirt=:d<int> and chest=:e<int> and waist=:f<int> and legs=:g<int> and feet=:h<int> and wrist=:i<int> and hands=:j<int> and ring1=:k<int> and ring2=:l<int> and trinket1=:m<int> and trinket2=:n<int> and back=:o<int> and mainhand=:p<int> and offhand=:q<int> and ranged=:r<int> and tabard=:s<int>
		auto refGear = db->ExecuteStreamStatement("SELECT c.head, c.neck, c.shoulder, c.shirt, c.chest, c.waist, c.legs, c.feet, c.wrist, c.hands, c.ring1, c.ring2, c.trinket1, c.trinket2, c.back, c.mainhand, c.offhand, c.ranged, c.tabard, c.id FROM am_chars_ref_gear c", 1, true);
		while (refGear.HasData())
		{
			int _Gear[20];
			refGear.ReadData(&_Gear[0], &_Gear[1], &_Gear[2], &_Gear[3], &_Gear[4], &_Gear[5], &_Gear[6], &_Gear[7], &_Gear[8], &_Gear[9], &_Gear[10], &_Gear[11], &_Gear[12], &_Gear[13], &_Gear[14], &_Gear[15], &_Gear[16], &_Gear[17], &_Gear[18], &_Gear[19]);
			std::string key = "";
			for (int i = 0; i < 18; ++i) key += std::to_string(_Gear[i]) + ",";
			key += std::to_string(_Gear[18]);
			m_RefGearIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), _Gear[19]));
		}
		refGear.Flush();
		refGear.CompleteStatement();

		std::cout << "Loading table 'am_chars_ref_honor'... \n";
		if (_PostVanilla)
		{
			//auto refHonor = db->ExecuteStreamStatement("SELECT c.hk, c.dk, c.honor, c.id FROM rpll.gn_chars a JOIN rpll.db_servernames q ON a.serverid = q.id JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_honor c ON b.ref_honor = c.id WHERE q.expansion=1", 1, true);
			auto refHonor = db->ExecuteStreamStatement("SELECT c.hk, c.dk, c.honor, c.id FROM am_chars_ref_honor c", 1, true);
			while (refHonor.HasData())
			{
				int hk, dk, honor, id;
				refHonor.ReadData(&hk, &dk, &honor, &id);
				std::string key = "0,0," + std::to_string(hk) + "," + std::to_string(dk) + "," + std::to_string(honor) + ",0";
				m_RefHonorIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), id));
			}
			refHonor.Flush();
			refHonor.CompleteStatement();

			// TODO: Arena data!
		}
		else
		{
			//auto refHonor = db->ExecuteStreamStatement("SELECT c.rank, c.progress, c.hk, c.dk, c.honor, c.standing, c.id FROM rpll.gn_chars a JOIN rpll.db_servernames q ON a.serverid = q.id JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_honor c ON b.ref_honor = c.id WHERE q.expansion=0", 1, true);
			auto refHonor = db->ExecuteStreamStatement("SELECT c.rank, c.progress, c.hk, c.dk, c.honor, c.standing, c.id FROM am_chars_ref_honor c", 1, true);
			while (refHonor.HasData())
			{
				int rank, progress, hk, dk, honor, standing, id;
				refHonor.ReadData(&rank, &progress, &hk, &dk, &honor, &standing, &id);
				std::string key = std::to_string(rank) + "," + std::to_string(progress) + "," + std::to_string(hk) + "," + std::to_string(dk) + "," + std::to_string(honor) + "," + std::to_string(standing);
				m_RefHonorIDs.insert(std::make_pair(std::move(xxh::xxhash<64>(key, key.length())), id));
			}
			refHonor.Flush();
			refHonor.CompleteStatement();
		}
	}

	ArmoryProcessor::~ArmoryProcessor()
	{
		delete db;
		db = nullptr;
		delete db2;
		db2 = nullptr;
	}

	void ArmoryProcessor::UpdateProfessions(int _CharId, int _Prof1, int _Prof2)
	{
		if (_Prof1 == 0 && _Prof2 == 0)
			return;

		auto stream = db2->ExecuteStreamStatement("UPDATE gn_chars SET prof1=:a<int>, prof2=:b<int> WHERE id=:c<int>", 1);
		stream.AttachValues(_Prof1, _Prof2, _CharId);
	}

	// Armory Implementation
	int ArmoryProcessor::GetRefGuildID(const std::string& _GRankName, int _GRankIndex, int _GuildID, bool _AutoAddToDB)
	{
		if (_GuildID <= 0 || _GRankIndex < 0 || _GRankName.empty())
			return 0;

		std::string key = std::to_string(_GRankIndex) + "," + std::to_string(_GuildID) + _GRankName;
		int refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefGuildIDs, "select id from am_chars_ref_guild where guildid=:s<int> and grankindex=:f<int> and grankname=:n<char[64]>", db, _GuildID, _GRankIndex, _GRankName);

		if (refID == -1 && _AutoAddToDB == true && !_GRankName.empty())
		{
			auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_guild (guildid, grankindex, grankname) values(:s<int>,:f<int>,:n<char[64]>)", 1);
			sqlStream.AttachValues(_GuildID, _GRankIndex, _GRankName);
			return GetRefGuildID(_GRankName, _GRankIndex, _GuildID, false);
		}

		return refID;
	}
	int ArmoryProcessor::GetRefMiscID(const std::string& _Talents, int _Level, int _Gender, int _Race, int _Class, bool _AutoAddToDB)
	{
		std::string key = std::to_string(_Level) + "," + std::to_string(_Gender) + "," + std::to_string(_Race) + "," + std::to_string(_Class);
		if (mPostVanilla) key += "," + _Talents;
		int refID = -1;
		if (mPostVanilla)
		{
			refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefMiscIDs, "select id from am_chars_ref_misc where level=:s<int> and gender=:n<int> and race=:u<int> and class=:f<int> and talents=:q<char[100]>", db, _Level, _Gender, _Race, _Class, _Talents);
		}
		else
			refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefMiscIDs, "select id from am_chars_ref_misc where level=:s<int> and gender=:n<int> and race=:u<int> and class=:f<int>", db, _Level, _Gender, _Race, _Class);

		if (refID == -1 && _AutoAddToDB == true)
		{
			if (mPostVanilla)
			{
				auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_misc (level, gender, race, class, talents) values(:s<int>,:f<int>,:u<int>,:q<int>,:n<char[100]>)", 1);
				sqlStream.AttachValues(_Level, _Gender, _Race, _Class, _Talents);
			}
			else
			{
				auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_misc (level, gender, race, class) values(:s<int>,:f<int>,:u<int>,:q<int>)", 1);
				sqlStream.AttachValues(_Level, _Gender, _Race, _Class);
			}
			return GetRefMiscID(_Talents, _Level, _Gender, _Race, _Class, false);
		}

		return refID;
	}
	int ArmoryProcessor::GetRefHonorID(int _Rank, int _Progress, int _HK, int _DK, int _Honor, int _Standing, bool _AutoAddToDB)
	{
		if (_Rank < 0 || _Progress < 0 || _HK < 0 || _DK < 0 || _Honor < 0)
			return 0;

		std::string key = std::to_string(_Rank) + "," + std::to_string(_Progress) + "," + std::to_string(_HK) + "," + std::to_string(_DK) + "," + std::to_string(_Honor) + "," + std::to_string(_Standing);

		int refID = -1;
		if (!mPostVanilla) refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefHonorIDs, "select id from am_chars_ref_honor where `rank`=:v<int> and progress=:t<int> and hk=:s<int> and dk=:r<int> and honor=:q<int> and standing=:w<int>", db, _Rank, _Progress, _HK, _DK, _Honor, _Standing);
		else refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefHonorIDs, "select id from am_chars_ref_honor where hk=:s<int> and dk=:r<int> and honor=:q<int>", db, _HK, _DK, _Honor);

		if (refID == -1 && _AutoAddToDB == true)
		{
			if (!mPostVanilla)
			{
				auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_honor (`rank`, progress, hk, dk, honor, standing) values(:s<int>,:f<int>,:u<int>,:q<int>,:t<int>,:w<int>)", 1);
				sqlStream.AttachValues(_Rank, _Progress, _HK, _DK, _Honor, _Standing);
			}
			else
			{
				auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_honor (hk, dk, honor) values(:s<int>,:f<int>,:u<int>)", 1);
				sqlStream.AttachValues(_HK, _DK, _Honor);
			}
			return GetRefHonorID(_Rank, _Progress, _HK, _DK, _Honor, _Standing, false);
		}
		return refID;
	}
	int ArmoryProcessor::GetArenaTeamID(int _Size, std::string& _Name, int _ServerId, bool _AutoAddToDB)
	{
		if (_Size < 2 || _Name.empty() || _ServerId < 1)
			return 0;
		std::string key = std::to_string(_Size) + "," + std::to_string(_ServerId) + _Name;
		int refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_ArenaTeamIDs, "select id from am_chars_arena_team where type=:a<int> and serverid=:b<int> and name=:c<char[100]>", db, _Size, _ServerId, _Name);

		if (refID == -1 && _AutoAddToDB == true)
		{
			auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_arena_team (type, serverid, name) values(:s<int>,:f<int>,:c<char[100]>)", 1);
			sqlStream.AttachValues(_Size, _ServerId, _Name);
			return GetArenaTeamID(_Size, _Name, _ServerId, false);
		}
		return refID;
	}

	int ArmoryProcessor::GetRefArenaID(int _Team1, int _Team2, int _Team3, bool _AutoAddToDB)
	{
		if (_Team1 < 0 || _Team2 < 0 || _Team3 < 0)
			return 0;
		std::string key = std::to_string(_Team1) + "," + std::to_string(_Team2) + "," + std::to_string(_Team3);
		int refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefArenaIDs, "select id from am_chars_ref_arena where arena2v2=:a<int> and arena3v3=:b<int> and arena5v5=:c<int>", db, _Team1, _Team2, _Team3);

		if (refID == -1 && _AutoAddToDB == true)
		{
			auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_arena (arena2v2, arena3v3, arena5v5) values(:s<int>,:f<int>,:c<int>)", 1);
			sqlStream.AttachValues(_Team1, _Team2, _Team3);
			return GetRefArenaID(_Team1, _Team2, _Team3, false);
		}
		return refID;
	}

	void ArmoryProcessor::SetLifeTimeRank(int charid, int rank, int _Uploader)
	{
		if (charid <= 0 || rank <= 0 || _Uploader <= 0 || rank > 14)
			return;

		if (m_CharData.find(charid) == m_CharData.end()) // Get char data!
			GetCharData(charid, db2, db);

		if (m_CharData.find(charid) == m_CharData.end()) // sth went wrong!
			return;

		if (m_CharData[charid].m_LifeTimeRank >= rank)
			return;

		// TODO: What means rank 15 and 16?
		if (m_CharData[charid].m_LifeTimeRank == -1)
		{
			auto stream = db->ExecuteStreamStatement("INSERT IGNORE INTO am_chars_lifetimerank (charid, `rank`, uploaderid) VALUES (:a<int>, :b<int>, :c<int>)", 1);
			stream.AttachValues(charid, rank, _Uploader);
		}
		else
		{
			auto stream = db->ExecuteStreamStatement("UPDATE am_chars_lifetimerank SET `rank`=:a<int>, uploaderid=:b<int> WHERE charid=:c<int>", 1);
			stream.AttachValues(rank, _Uploader, charid);
		}
		m_CharData[charid].m_LifeTimeRank = rank;
	}

	int ArmoryProcessor::GetRefItemSlotGemID(Item* _Item, bool _AutoAddToDB)
	{
		if (_Item == nullptr || !mPostVanilla || (_Item->_socket1 == 0 && _Item->_socket2 == 0 && _Item->_socket3 == 0 && _Item->_socket4 == 0))
			return 0;
		std::string key = std::to_string(_Item->_socket1) + "," + std::to_string(_Item->_socket2) + "," + std::to_string(_Item->_socket3);
		int refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefItemSlotGemIDs, "select id from am_chars_ref_gear_slot_gems where gem1=:a<short int> and gem2=:b<short int> and gem3=:c<short int> ", db, _Item->_socket1, _Item->_socket2, _Item->_socket3);

		if (refID == -1 && _AutoAddToDB == true)
		{
			auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_gear_slot_gems (gem1, gem2, gem3) values(:s<short int>,:f<short int>,:u<short int>)", 1);
			sqlStream.AttachValues(_Item->_socket1, _Item->_socket2, _Item->_socket3);
			return GetRefItemSlotGemID(_Item, false);
		}
		if (refID < 0)
			return 0;
		return refID;
	}

	int ArmoryProcessor::GetRefItemSlotID(Item* _Item, bool _AutoAddToDB)
	{
		if (_Item == nullptr)
			return 0;

		// To prevent errors?! // TODO WHAT DOES THAT MEAN?!
		if (_Item->_randomEnchant < 0 || _Item->_randomEnchant > 15000)
			_Item->_randomEnchant = 0;

		int gemId = GetRefItemSlotGemID(_Item, true);
		std::string key = std::to_string(_Item->_id) + "," + std::to_string(_Item->_enchant) + "," + std::to_string(_Item->_randomEnchant) + "," + std::to_string(gemId);

		int refID = -1;
		if (mPostVanilla)
			refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefItemSlotIDs, "select id from am_chars_ref_gear_slot where itemid=:v<int> and enchid=:t<short int> and genenchid=:s<short int> and gemid=:a<int>", db, _Item->_id, _Item->_enchant, _Item->_randomEnchant, gemId);
		else
			refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefItemSlotIDs, "select id from am_chars_ref_gear_slot where itemid=:v<int> and enchid=:t<short int> and genenchid=:s<short int>", db, _Item->_id, _Item->_enchant, _Item->_randomEnchant);

		if (refID == -1 && _AutoAddToDB == true)
		{
			if (mPostVanilla)
			{
				auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_gear_slot (itemid, enchid, genenchid, gemid) values(:s<int>,:f<short int>,:u<short int>,:a<int>)", 1);
				sqlStream.AttachValues(_Item->_id, _Item->_enchant, _Item->_randomEnchant, gemId);
			}
			else
			{
				auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_gear_slot (itemid, enchid, genenchid) values(:s<int>,:f<short int>,:u<short int>)", 1);
				sqlStream.AttachValues(_Item->_id, _Item->_enchant, _Item->_randomEnchant);
			}
			return GetRefItemSlotID(_Item, false);
		}
		return refID;
	}

	int ArmoryProcessor::GetRefGearID(int* _Gear, bool _AutoAddToDB)
	{
		std::string key = "";
		for (int i = 0; i < 18; ++i)
			key += std::to_string(_Gear[i]) + ",";
		key += std::to_string(_Gear[18]);
		int refID = Get_Name_ID(xxh::xxhash<64>(key, key.length()), m_RefGearIDs, "select id from am_chars_ref_gear where head=:a<int> and neck=:b<int> and shoulder=:c<int> and shirt=:d<int> and chest=:e<int> and waist=:f<int> and legs=:g<int> and feet=:h<int> and wrist=:i<int> and hands=:j<int> and ring1=:k<int> and ring2=:l<int> and trinket1=:m<int> and trinket2=:n<int> and back=:o<int> and mainhand=:p<int> and offhand=:q<int> and ranged=:r<int> and tabard=:s<int>", db, _Gear[0], _Gear[1], _Gear[2], _Gear[3], _Gear[4], _Gear[5], _Gear[6], _Gear[7], _Gear[8], _Gear[9], _Gear[10], _Gear[11], _Gear[12], _Gear[13], _Gear[14], _Gear[15], _Gear[16], _Gear[17], _Gear[18]);

		if (refID == -1 && _AutoAddToDB == true)
		{
			auto sqlStream = db->ExecuteStreamStatement("insert into am_chars_ref_gear (head, neck, shoulder, shirt, chest, waist, legs, feet, wrist, hands, ring1, ring2, trinket1, trinket2, back, mainhand, offhand, ranged, tabard) values(:a<int>,:b<int>,:c<int>,:d<int>,:e<int>,:f<int>,:g<int>,:h<int>,:i<int>,:j<int>,:k<int>,:l<int>,:m<int>,:n<int>,:o<int>,:p<int>,:q<int>,:r<int>,:s<int>)", 1);
			sqlStream.AttachValues(_Gear[0], _Gear[1], _Gear[2], _Gear[3], _Gear[4], _Gear[5], _Gear[6], _Gear[7], _Gear[8], _Gear[9], _Gear[10], _Gear[11], _Gear[12], _Gear[13], _Gear[14], _Gear[15], _Gear[16], _Gear[17], _Gear[18]);
			return GetRefGearID(_Gear, false);
		}
		return refID;
	}

	void ArmoryProcessor::InsertArmoryData(ArmoryCharData&& _Data, int _CharID)
	{
		auto foundID = m_ArmoryCharData.find(_CharID);
		if (foundID != m_ArmoryCharData.end())
		{
			foundID->second = _Data; // Can we move it somehow, make it more efficient?
		}
		else
		{
			m_ArmoryCharData.insert(std::make_pair(_CharID, std::move(_Data)));
		}
	}
	void ArmoryProcessor::GetArmoryCharData(ArmoryCharData& _Data, int _CharID, bool _PostVanilla)
	{
		auto foundID = m_ArmoryCharData.find(_CharID);
		if (foundID != m_ArmoryCharData.end())
		{
			_Data = foundID->second;
		}
		else
		{
			auto amCharData = db->ExecuteStreamStatement("SELECT a.ref_misc, a.ref_guild, a.ref_honor, " + (_PostVanilla ? std::string("a.ref_arena") : "(0) as arena") + ", a.ref_gear FROM am_chars_data a WHERE a.charid=:a<int> ORDER BY a.id DESC LIMIT 1", 1);
			amCharData.AttachValues(_CharID);
			if (amCharData.HasData())
			{
				amCharData.ReadData(&_Data.m_RefMisc);
				amCharData.ReadData(&_Data.m_RefGuild);
				amCharData.ReadData(&_Data.m_RefHonor);
				amCharData.ReadData(&_Data.m_RefArena);
				amCharData.ReadData(&_Data.m_RefGear);
			}
		}
	}

	CharData* ArmoryProcessor::GetCharData(const int _Id, MySQLConnector* gen, MySQLConnector* spec)
	{
		auto foundID = m_CharData.find(_Id);
		if (foundID != m_CharData.end())
		{
			return &(foundID->second);
		}

		std::string name = "";
		int guildid = -1;
		int rank = -1;
		auto sqlStream = gen->ExecuteStreamStatement("SELECT name FROM gn_chars WHERE id=:a<int>",1);
		sqlStream.AttachValues(_Id);
		if (sqlStream.HasData())
			sqlStream.ReadData(&name);

		if (_Id < 300000 || name == "")
			return nullptr;

		if (!mPostVanilla)
		{
			sqlStream = spec->ExecuteStreamStatement("SELECT IFNULL(c.guildid, -1), IFNULL(d.rank, -1) FROM am_chars_data b LEFT JOIN am_chars_ref_guild c ON b.ref_guild = c.id LEFT JOIN am_chars_lifetimerank d ON b.charid = d.charid WHERE b.charid=:a<int> ORDER BY b.id DESC LIMIT 1", 1);
			sqlStream.AttachValues(_Id);
			if (sqlStream.HasData())
			{
				sqlStream.ReadData(&guildid, &rank);
			}
		}
		else
		{
			sqlStream = spec->ExecuteStreamStatement("SELECT IFNULL(c.guildid, -1) FROM am_chars_data b LEFT JOIN am_chars_ref_guild c ON b.ref_guild = c.id WHERE b.charid=:a<int> ORDER BY b.id DESC LIMIT 1", 1);
			sqlStream.AttachValues(_Id);
			if (sqlStream.HasData())
			{
				sqlStream.ReadData(&guildid);
			}
		}
		if (name != "")
		{
			CharData cd;
			cd.m_Name = name;
			cd.m_GuildId = guildid;
			cd.m_LifeTimeRank = rank;
			m_CharData[_Id] = std::move(cd);
			return &m_CharData[_Id];
		}
		return nullptr;
	}

}
