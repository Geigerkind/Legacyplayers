#include "Threat.h"

std::map<int, int> Threat::mFixedThreat = {
	// Warrior
	// Sunder
	{ 7386, 45 },
	{ 7405, 99 },
	{ 8380, 153 },
	{ 11596, 207 },
	{ 11597, 261 },
	{ 25225, 301 },

	// Shield Bash
	{ 72, 43 },
	{ 1671, 115 },
	{ 1672, 187 },
	{ 29704, 230 },

	// Revenge
	{ 6572, 40 },
	{ 6574, 69 },
	{ 7379, 98 },
	{ 11600, 126 },
	{ 11601, 155 },
	{ 25288, 172 },
	{ 25269, 181 },
	{ 30357, 201 },

	// Heroic Strike
	{ 78, 3 },
	{ 284, 25 },
	{ 285, 50 },
	{ 1608, 75 },
	{ 11564, 100 },
	{ 11565, 125 },
	{ 11566, 140 },
	{ 11567, 145 },
	{ 25286, 173 },
	{ 29707, 196 },
	{ 30324, 220 },

	// Shield Slam
	{ 23922, 175 },
	{ 23923, 211 },
	{ 23924, 237 },
	{ 23925, 250 },
	{ 25258, 286 },
	{ 30356, 307 },

	// Cleave
	{ 845, 38 },
	{ 7369, 57 },
	{ 11608, 76 },
	{ 11609, 92 },
	{ 20569, 100 },
	{ 25231, 130 },

	// Hamstring
	{ 1715, 22 },
	{ 7372, 86 },
	{ 7373, 146 },
	{ 25212, 181 },

	// Mocking Blow
	{ 694, 71 },
	{ 7400, 116 },
	{ 7402, 161 },
	{ 20559, 205 },
	{ 20560, 250 },
	{ 25266, 290 },

	// Battle Shout
	{ 6673, 1 },
	{ 5242, 12 },
	{ 6192, 22 },
	{ 11549, 32 },
	{ 11550, 42 },
	{ 11551, 52 },
	{ 25289, 60 },
	{ 2048, 69 },

	// Demo Shout
	{ 1160, 11 },
	{ 6190, 19 },
	{ 11554, 27 },
	{ 11555, 35 },
	{ 11556, 43 },
	{ 25202, 50 },
	{ 25203, 56 },

	// Commanding Shout
	{ 469, 58 },

	// Disarm
	{ 676, 104 },

	// Devastate 120 + 15*(Count-1)Stacks !!TODO
	/*{ 20243, 120 },
	{ 30016, 120 },
	{ 30022, 120 },*/

	// Thunder Clap Multiplicative *1.75
	// Execute Multiplicative * 1.25
	
	/*
	 * Rogue
	 */

	// Feint
	// Am I going to integrate negative values?
	{ 1966, -150 },
	{ 6768, -240 },
	{ 8637, -390 },
	{ 11303, -600 },
	{ 25302, -800 },
	{ 27448, -1050 },

	/*
	 * Priest
	 */
	// Fade can be ignored, since its not permanent
	// Power Word Shield
	{ 17, 22 },
	{ 592, 44 },
	{ 600, 79 },
	{ 3747, 117 },
	{ 6065, 151 },
	{ 6066, 191 },
	{ 10898, 242 },
	{ 10899, 303 },
	{ 10900, 382 },
	{ 10901, 471 },
	{ 25217, 574 },
	{ 25218, 658 },

	/*
	 * Hunter
	 */
	// Distracting Shot
	{ 20736, 110 },
	{ 14274, 160 },
	{ 15629, 250 },
	{ 15630, 350 },
	{ 15631, 465 },
	{ 15632, 600 },
	{ 27020, 900 },

	// Disengage
	{ 781, -140 },
	{ 14272, -280 },
	{ 14273, -405 },
	{ 27015, -545 },

	/*
	 * Druid
	 */
	// Faerie Fire
	{ 770, 35 },
	{ 16857, 58 },
	{ 778, 58 },
	{ 17390, 58 },
	{ 9749, 81 },
	{ 17391, 81 },
	{ 9907, 108 },
	{ 17392, 108 },
	{ 26993, 127 },
	{ 27011, 127 },

	// Maul
	{6807, 48},
	{ 6808, 87 },
	{ 6809, 125 },
	{ 8972, 163 },
	{ 9745, 202 },
	{ 9880, 240 },
	{ 9881, 207 },
	{ 26996, 322 },
	
	// Lancerate
	{ 33745, 285 },

	// Cower
	{8998, -240},
	{ 9000, -390 },
	{ 9892, -600 },
	{ 31709, -800 },
	{ 27004, -1170 },

	// Cyclone
	{ 33786, 180 },

};

std::map<int, double> Threat::mMultiplicativeThreat = {
	// Warrior
	// Thunder Clap
	{ 6343, 1.75 },
	{ 8198, 1.75 },
	{ 8204, 1.75 },
	{ 8205, 1.75 },
	{ 11580, 1.75 },
	{ 11581, 1.75 },
	{ 25264, 1.75 },

	// Execute
	{ 5308, 1.25 },
	{ 20658, 1.25 },
	{ 20660, 1.25 },
	{ 20661, 1.25 },
	{ 20662, 1.25 },
	{ 25234, 1.25 },
	{ 25236, 1.25 },

	/*
	 * Druid
	 */
	// Mangle
	{ 33878, 1.3 },
	{ 33986, 1.3 },
	{ 33987, 1.3 },

	/*
	 * Paladin
	 */
	// Holy Shield
	{ 20925, 1.35 },
	{ 20927, 1.35 },
	{ 20928, 1.35 },
	{ 27179, 1.35 }
};

std::map<int, bool> Threat::mMSBT = {
	{ 12294 , true },
	{ 21551 , true },
	{ 21552 , true },
	{ 21553 , true },
	{ 25248 , true },
	{ 30330 , true },
	{ 23881 , true },
	{ 23892 , true },
	{ 23893 , true },
	{ 23894 , true },
	{ 25251 , true },
	{ 30335 , true }
};

std::map<int, bool> Threat::mZeroThreat = {
	// Holy Nova
	{ 15237 , true },
	{ 15430 , true },
	{ 15431 , true },
	{ 27799 , true },
	{ 27800 , true },
	{ 27801 , true },
	{ 25331 , true },
	// Shadow Guard
	{ 18137 , true },
	{ 19308 , true },
	{ 19309 , true },
	{ 19310 , true },
	{ 19311 , true },
	{ 19312 , true },
	{ 25477 , true },
};

std::map<int, bool> Threat::mAffliSpells = {
	// Drain Life
	{ 689, true },{ 699, true },{ 709, true },{ 7651, true },{ 11699, true },{ 11700, true },{ 27219, true },{ 27220, true },
	// Unstable Affliction
	{ 30108, true },{ 30404, true },{ 30405, true },
	// Drain Soul
	{ 1120, true },{ 8288, true },{ 8289, true },{ 11675, true },
	// Curse of Doom
	{ 603, true },{ 30910, true },
	// Death Coil
	{ 6789, true },{ 17625, true },{ 17926, true },{ 27223, true },
	// Seed of Corruption
	{ 27243, true },
};

std::map<int, bool> Threat::mDestroSpells = {
	// Hellfire
	{ 1949, true },{ 11683, true },{ 11684, true },{ 27213, true },
	// Rain of Fire
	{ 5740, true },{ 6219, true },{ 11677, true },{ 11678, true },{ 27212, true },
	// Soul Fire
	{ 6353, true },{ 17924, true },{ 27211, true },{ 30545, true },
	// Conflagrate
	{ 17962, true },{ 18930, true },{ 18931, true },{ 18932, true },{ 27266, true },{ 30912, true },
	// Incinerate
	{ 29722, true },{ 32231, true },
	// Shadowfury
	{ 30283, true },{ 30413, true },{ 30414, true },
	// Shadow Bolt
	{ 686, true },{ 695, true },{ 705, true },{ 1088, true },{ 1106, true },{ 7641, true },{ 11659, true },{ 11660, true },{ 11661, true },{ 25307, true },{ 27209, true },
	// Shadowburn
	{ 17877, true },{ 18867, true },{ 18868, true },{ 18869, true },{ 18870, true },{ 18871, true },{ 27263, true }, {30546, true}
};

Threat::Threat(std::map<std::string, RPLL::UnitData>* unitData, RPLL::DatabaseAccess* DBAccess, RPLL::ArmoryProcessor* AProcessor, std::vector<std::string>* nameValues, std::map<unsigned long long, int>* petOwner, int expansion)
{
	mExpansion = expansion;
	mPetToOwner = petOwner;
	mNameValues = nameValues;
	mAProcessor = AProcessor;
	mDBAccess = DBAccess;
	mUnitData = unitData;

	PrepareUnitData();
}


Threat::~Threat()
{
	mPetToOwner = nullptr;
	mNameValues = nullptr;
	mAProcessor = nullptr;
	mDBAccess = nullptr;
	mUnitData = nullptr;
}


void Threat::PrepareUnitData()
{
	auto classtalents = mDBAccess->GetConnector(false)->ExecuteStreamStatement("SELECT a.id, IFNULL(d.class, 0), IFNULL(d.talents, 0) FROM rpll.gn_chars a JOIN rpll.db_servernames b ON a.serverid = b.id LEFT JOIN am_chars_data c ON a.latestupdate = c.id LEFT JOIN am_chars_ref_misc d ON c.ref_misc = d.id WHERE a.ownerid = 0 and b.expansion=" + std::to_string(mExpansion), 1, true);
	auto HasSetBonus = mDBAccess->GetConnector(false)->ExecuteStreamStatement("SELECT d.itemid FROM rpll.gn_chars a JOIN am_chars_data b ON a.latestupdate = b.id JOIN am_chars_ref_gear c ON b.ref_gear = c.id JOIN am_chars_ref_gear_slot d ON d.id IN (head,shoulder,chest,waist,legs,feet,wrist,hands) WHERE a.id = :a<int>");
	for(auto& unit : *mUnitData)
	{
		if (unit.second.m_Owner > 0) continue; // Pets are irrelevant
		int UnitID = unit.second.m_ID;

		if (mPMod.find(UnitID) == mPMod.end())
			mPMod[UnitID] = 1.0;

		// Retrieve missing class data
		if (unit.second.m_Class == 99)
		{
			if (mAProcessor->m_CharClassTalents.find(UnitID) == mAProcessor->m_CharClassTalents.end()) continue;

			unit.second.m_Class = mAProcessor->m_CharClassTalents[UnitID].first;
		}
		mClassIds[UnitID] = unit.second.m_Class;

		// Retrieve missing talent data
		if (unit.second.mTalents.size() < 15)
		{
			if (mAProcessor->m_CharClassTalents.find(UnitID) == mAProcessor->m_CharClassTalents.end()) continue;

			unit.second.mTalents = mAProcessor->m_CharClassTalents[UnitID].second;
		}

		int ClassId = unit.second.m_Class;
		std::string Talents = unit.second.mTalents;

		if (ClassId == 1 && mStateWarrior.find(UnitID) == mStateWarrior.end())
		{
			ThreatWarrior temp;
			mStateWarrior.insert(std::make_pair(UnitID, std::move(temp)));
		}

		// Filter talents for class modifier
		if (ClassId == 0)
		{
			if (Talents.size() >= 67)
			{
				// Arms 0-22
					// => No Talent modifiers

				// Fury 24-44
				// Improved Berserker Stance 20. Entry
				int impZerker = unit.second.mTalents[43] - '0';
				mStateWarrior[UnitID].BeserkerStance = (1 - 0.02*impZerker);

				// Protection 46-67
				// Tactical Mastery 2. Entry
				int tacMastery = unit.second.mTalents[47] - '0';
				mStateWarrior[UnitID].MSBT = 1 + (0.21 * tacMastery);

				// Defiance 9. Entry
				// Just increases threat for Attacks (Shouts excluded?)
				int defiance = unit.second.mTalents[54] - '0';
				mPMod[UnitID] *= (1 + 0.05*defiance);
			}
		}
		else if (ClassId == 1)
		{
			mPMod[UnitID] = 0.71; // Passive
		}
		else if (ClassId == 2)
		{
			if (Talents.size() >= 64)
			{
				// Disci 0-21
				// Improved Power Word Shield 5. Entry
				int ipws = Talents[4] - '0';
				mStatePriest[UnitID].ImprovedPowerWordShield = 1 + (0.025 * ipws); // not 7.5% in total cause its halved

				// Silent Resolved 3. Entry
				int sr = Talents[2] - '0';
				mStatePriest[UnitID].SilentResolve = 1 - 0.04 * sr;

				// Holy 23-43
					// => Nothing here
				// Shadow 45-65
				// Shadow Affinity 3. Entry
				int sa = Talents[47] - '0';
				if (sa == 3)
					mStatePriest[UnitID].ShadowAffinity = 0.75;
				else
					mStatePriest[UnitID].ShadowAffinity = 1 - 0.08 * sa;
			}
		}
		else if (ClassId == 4)
		{
			// Checking if druid wears thunderheart set
			// { 31042, 31034, 31039, 31044, 31048 }
			int num = 0;
			HasSetBonus.AttachValues(UnitID);
			while (HasSetBonus.HasData())
			{
				int item = 0;
				HasSetBonus.ReadData(&item);

				if (
					item == 31042 ||
					item == 31034 ||
					item == 31039 ||
					item == 31048 ||
					item == 31044 ||
					item == 34556 ||
					item == 34444 ||
					item == 34573
					)
				{
					++num;
				}
			}
			mStateDruid[UnitID].Thunderheart = num >= 2;

			if (Talents.size() >= 62)
			{
				// Balance 0-20
					// No effects
				// Feral 22-42
				// Feral Instinct 3. Entry
				int fi = Talents[24] - '0';
				mStateDruid[UnitID].FeralInstinct = 1.0 + (0.05*fi);
				// Resto 44-63
				// Subtlety 7. Entry
				int sbt = Talents[50] - '0';
				mStateDruid[UnitID].Subtlety = 1.0 - (0.04 * sbt);
				// Tranquility 14. Entry
				int tran = Talents[57] - '0';
				mStateDruid[UnitID].Tranquility = 1.0 - (0.5 *tran);
			}
		}
		else if (ClassId == 5)
		{
			if (Talents.size() >= 66)
			{
				// Arcane 0-22
				// Arcane Subtlety 1. Entry
				int as = Talents[0] - '0';
				mStateMage[UnitID].Arcane = 1.0 - (0.2 * as);

				// Fire 24-45
				// Burning Sould 9. Entry
				int bs = Talents[32] - '0';
				mStateMage[UnitID].Fire = 1.0 - (0.05 * bs);

				// Frost 47-68
				// Frost Channeling 12. Entry
				int fc = Talents[58] - '0';
				if (fc == 1)
					mStateMage[UnitID].Frost = 0.96;
				else if (fc == 2)
					mStateMage[UnitID].Frost = 0.93;
				else if (fc == 3)
					mStateMage[UnitID].Frost = 0.9;
			}
		}
		else if (ClassId == 6)
		{
			if (Talents.size() >= 64)
			{
				// Affli 0-20
				// Improved Drain Soul 4. Entry
				int ids = Talents[3] - '0';
				mStateWarlock[UnitID].Affliction = 1.0 - (0.05 * ids);

				// Demo 22-43
				// Master Demonologist 17. Entry
				// (Assuming that warlocks constantly have the imp active)
				// But thats rather unlikely
				int md = Talents[48] - '0';
				mStateWarlock[UnitID].MasterOfDemonology = 1.0 - (0.04 * md);

				// Destro 45-65
				// Destructive Reach 10. Entry
				int dr = Talents[54] - '0';
				mStateWarlock[UnitID].Destruction = 1.0 - (0.05 * dr);
			}
		}
		else if (ClassId == 7)
		{
			if (Talents.size() >= 64)
			{
				// Holy 0-19
					// Nothing
				// Prot 21-42
				// Improved Righteous Fury 7. Entry
				int irf = Talents[27] - '0';
				if (irf == 1)
					mStatePaladin[UnitID].ImprovedRighteousFury = 1.16;
				else if (irf == 2)
					mStatePaladin[UnitID].ImprovedRighteousFury = 1.33;
				else if (irf == 2)
					mStatePaladin[UnitID].ImprovedRighteousFury = 1.5;

				// Ret 44-65
				// Fanatism 21. Entry 
				int ftm = Talents[64] - '0';
				mStatePaladin[UnitID].Fanatism = 1.0 - (0.06 * ftm);
			}
		}
		else if (ClassId == 8)
		{
			if (Talents.size() >= 61)
			{
				// Ele 0-19
				// Elemental Precision 15. Entry
				int eg = Talents[14] - '0'; // Fire Frost and nature spells
				if (eg == 1) mStateShaman[UnitID].ElementalPrecision = 0.96;
				else if (eg == 2) mStateShaman[UnitID].ElementalPrecision = 0.93;
				else if (eg == 3) mStateShaman[UnitID].ElementalPrecision = 0.9;

				// Enh 21-41
				// Spirit Weapons 13. Entry
				int sw = Talents[33] - '0'; // Melee Attacks only
				mStateShaman[UnitID].SpiritWeapons = 1.0 - 0.3*sw;

				// Resto 43-62
				// Healing Grace 9. Entry
				int hg = Talents[51] - '0'; // Heals
				mStateShaman[UnitID].HealingGrace = 1.0 - 0.05 * hg;
			}
		}
	}
}

/*
 * Note: Should flat negative abilities be affected by the modifiers?
 * Note: Only effective heal counts
 * 
 * TODO: Add threat reset events like vanish/feign death/invisibility and npc events
 */
int Threat::Feed(int _SourceId, int _TargetId, char _Type, int _TypeId, RPLL::CombatLogEventPost& _Event, int _TS, RPLL::MySQLStream& queryDmg, RPLL::MySQLStream& queryHeal, RPLL::MySQLStream& queryGained)
{
	if (_SourceId < 300000) 
		return 0;

	double result = static_cast<double>(_Event.m_Amount);

	// Lancerate mod applied before the fixed amount!
	if (_Event.m_SpellID == 33745)
		result *= 0.2;

	// The bonus is distirubted across all mobs 
	// Hmm TODO ?
	result += static_cast<double>(mFixedThreat[_Event.m_SpellID]);

	// General Buffs and items
	if (_Event.m_Action == static_cast<char>(RPLL::Action::Gain) || _Event.m_Action == static_cast<char>(RPLL::Action::AuraRefresh))
	{
		if (_Event.m_SpellID == 25909) mStateAuras[_SourceId].TranquilAir = true;
		else if (_Event.m_SpellID == 1038 || _Event.m_SpellID == 25895) mStateAuras[_SourceId].BlessingOfSalvation = true;
		else if (_Event.m_SpellID == 26400) mStateAuras[_SourceId].ArcaneShroud = true;
		else if (_Event.m_SpellID == 28862) mStateAuras[_SourceId].TheEyeOfDiminution = true;
		else if (_Event.m_SpellID == 33206 || _Event.m_SpellID == 44416) mStateAuras[_SourceId].PainSupression = true;
		else if (_Event.m_SpellID == 29232) mStateAuras[_SourceId].FungalBloom = true;
		else if (_Event.m_SpellID == 40618) mStateAuras[_SourceId].Insignifigance = true;
		else if (_Event.m_SpellID == 40604) mStateAuras[_SourceId].FelRage = true;
		else if (_Event.m_SpellID == 36886) mStateAuras[_SourceId].SpitefulFury = true;
		else if (_Event.m_SpellID == 41520) mStateAuras[_SourceId].Seethe = true;
		else if (_Event.m_SpellID == 45006) mStateAuras[_SourceId].WildMagic = true;
	}
	else if (_Event.m_Action == static_cast<char>(RPLL::Action::Fades) || _Event.m_Action == static_cast<char>(RPLL::Action::Removed))
	{
		if (_Event.m_SpellID == 25909) mStateAuras[_SourceId].TranquilAir = false;
		else if (_Event.m_SpellID == 1038 || _Event.m_SpellID == 25895) mStateAuras[_SourceId].BlessingOfSalvation = false;
		else if (_Event.m_SpellID == 26400) mStateAuras[_SourceId].ArcaneShroud = false;
		else if (_Event.m_SpellID == 28862) mStateAuras[_SourceId].TheEyeOfDiminution = false;
		else if (_Event.m_SpellID == 33206 || _Event.m_SpellID == 44416) mStateAuras[_SourceId].PainSupression = false;
		else if (_Event.m_SpellID == 29232) mStateAuras[_SourceId].FungalBloom = false;
		else if (_Event.m_SpellID == 40618) mStateAuras[_SourceId].Insignifigance = false;
		else if (_Event.m_SpellID == 40604) mStateAuras[_SourceId].FelRage = false;
		else if (_Event.m_SpellID == 36886) mStateAuras[_SourceId].SpitefulFury = false;
		else if (_Event.m_SpellID == 41520) mStateAuras[_SourceId].Seethe = false;
		else if (_Event.m_SpellID == 45006) mStateAuras[_SourceId].WildMagic = false;
	}

	if (mStateAuras[_SourceId].BlessingOfSalvation)
		result *= 0.7;
	else if (mStateAuras[_SourceId].TranquilAir)
		result *= 0.8;
	else if (mStateAuras[_SourceId].ArcaneShroud)
		result *= 0.3;
	else if (mStateAuras[_SourceId].TheEyeOfDiminution)
		result *= 0.65;
	else if (mStateAuras[_SourceId].PainSupression)
		result *= 0.95;
	else if (mStateAuras[_SourceId].FungalBloom)
		result *= 0;
	else if (mStateAuras[_SourceId].Insignifigance)
		result *= 0;
	else if (mStateAuras[_SourceId].FelRage)
		result *= 0;
	else if (mStateAuras[_SourceId].SpitefulFury)
		result *= 6;
	else if (mStateAuras[_SourceId].Seethe)
		result *= 3;
	else if (mStateAuras[_SourceId].WildMagic)
		result *= 2;

	// Stance tracking
	if (_Event.m_Action == static_cast<char>(RPLL::Action::Cast) || _Event.m_Action == static_cast<char>(RPLL::Action::Gain))
	{
		if (_Event.m_SpellID == 2457)
			mStateWarrior[_SourceId].Stance = 0;
		else if (_Event.m_SpellID == 71)
			mStateWarrior[_SourceId].Stance = 1;
		else if (_Event.m_SpellID == 2458)
			mStateWarrior[_SourceId].Stance = 2;
		else if (_Event.m_SpellID == 9634) // Dire Bear Form
			mStateDruid[_SourceId].Stance = 1;
		else if (_Event.m_SpellID == 768) // Cat Form
			mStateDruid[_SourceId].Stance = 2;
	}
	else if (_Event.m_Action == static_cast<char>(RPLL::Action::Fades))
	{
		if (_Event.m_SpellID == 9634) // Dire Bear Form
			mStateDruid[_SourceId].Stance = 0;
		else if (_Event.m_SpellID == 768) // Cat Form
			mStateDruid[_SourceId].Stance = 0;
	}

	// Warlock Pet Tracking
	if ((*mPetToOwner)[_Event.m_SourceGUID.m_GUID] != 0)
		mStateWarlock[(*mPetToOwner)[_Event.m_SourceGUID.m_GUID]].ImpActive = _Event.m_SourceGUID.GetNPCID() == 416;

	/*
	 * Warrior
	 */
	// Sunder tracking
	if (_Event.m_SpellID == 25225 || _Event.m_SpellID == 11597 || _Event.m_SpellID == 11596 || _Event.m_SpellID == 8380 || _Event.m_SpellID == 7405 || _Event.m_SpellID == 7386)
	{
		if (_Event.m_Action == static_cast<char>(RPLL::Action::Gain))
			mUnitSunderStacks[_Event.m_DestGUID.m_GUID] = 1;
		else if (_Event.m_Action == static_cast<char>(RPLL::Action::Fades))
			mUnitSunderStacks[_Event.m_DestGUID.m_GUID] = 0;
		else if (_Event.m_Action == static_cast<char>(RPLL::Action::GainDose) || _Event.m_Action == static_cast<char>(RPLL::Action::RemoveDose))
			mUnitSunderStacks[_Event.m_DestGUID.m_GUID] = _Event.m_Amount;
	}

	if (mClassIds[_SourceId] == 0)
	{
		if (mMSBT[_Event.m_SpellID] && mStateWarrior[_SourceId].Stance == 1)
			result *= mStateWarrior[_SourceId].MSBT;

		if (_Event.m_SpellID == 20243 || _Event.m_SpellID == 30016 || _Event.m_SpellID == 30022)
			result += static_cast<double>(Devastate(_Event.m_DestGUID.m_GUID));

		if (mStateWarrior[_SourceId].Stance == 0)
			result *= 0.8;
		else if (mStateWarrior[_SourceId].Stance == 1)
			result *= 1.3;
		else if (mStateWarrior[_SourceId].Stance == 2)
			result *= 0.8 * mStateWarrior[_SourceId].BeserkerStance;
	}

	/*
	 * Rogue
	 */
	else if (mClassIds[_SourceId] == 1)
	{
		if (_Event.m_SpellID == 26786)
			result = 0;
	}

	/*
	 * Priest
	 */
	else if (mClassIds[_SourceId] == 2)
	{
		if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::ShadowDamage))
		{
			result *= mStatePriest[_SourceId].ShadowAffinity;
		}
		else
		{
			result *= mStatePriest[_SourceId].SilentResolve;

			// Unlikely that anybody uses low rank shields
			if (_Event.m_SpellID == 25218 || _Event.m_SpellID == 25217 || _Event.m_SpellID == 10901)
				result += mStatePriest[_SourceId].ImprovedPowerWordShield;
		}

		// Binding Heal
		if (_Event.m_SpellID == 32546)
			result *= 0.5;
		else if (mZeroThreat[_Event.m_SpellID])
			result = 0;
	}

	/*
	 * Hunter
	 */
	else if (mClassIds[_SourceId] == 3)
	{
		// Misdirection
		if (_Event.m_SpellID == 34477)
		{
			if (_Event.m_Action == static_cast<char>(RPLL::Action::Cast))
			{
				if (mUnitData->find((*mNameValues)[_Event.m_Target]) == mUnitData->end())
				{
					mMisdirectionSrcTarget.insert(std::make_pair(_SourceId, std::make_pair(_Event.m_Timestamp, (*mUnitData)[(*mNameValues)[_Event.m_Target]].m_ID)));
				}
				else
				{
					mMisdirectionSrcTarget.insert(std::make_pair(_SourceId, std::make_pair(_Event.m_Timestamp, -1)));
				}
			}
			else if (_Event.m_Action == static_cast<char>(RPLL::Action::Fades))
			{
				if (mMisdirectionSrcTarget.find(_SourceId) != mMisdirectionSrcTarget.end())
					mMisdirectionSrcTarget.erase(_SourceId);
			}
		}

		if (mMisdirectionSrcTarget.find(_SourceId) != mMisdirectionSrcTarget.end())
		{
			if (_Event.m_Timestamp - mMisdirectionSrcTarget[_SourceId].first < 0 || _Event.m_Timestamp - mMisdirectionSrcTarget[_SourceId].first > 30)
				mMisdirectionSrcTarget.erase(_SourceId);

			if (mMisdirectionSrcTarget.find(_SourceId) != mMisdirectionSrcTarget.end())
			{
				if (mMisdirectionSrcTarget[_SourceId].second == -1)
					result = 0; // We just couldnt find the target :/
				else
				{
					result = 0; // Workaround for now!

					_SourceId = mMisdirectionSrcTarget[_SourceId].second;
					_Event.m_SpellID = 34477; // This will be a pain with the dmg id then :/  !!TODO
				}
			}
		}
	}

	/*
	 * Druid
	 */
	else if (mClassIds[_SourceId] == 4)
	{
		// Tranquility
		if (_Event.m_SpellID == 26983 || _Event.m_SpellID == 9863 || _Event.m_SpellID == 9862 || _Event.m_SpellID == 8918 || _Event.m_SpellID == 740)
			result *= mStateDruid[_SourceId].Tranquility;

		// Heal
		// Arcane and Nature damage
		if (_Event.m_Action <= static_cast<char>(RPLL::Action::CritHeal) || _Event.m_AmountType == static_cast<char>(RPLL::AmountType::ArcaneDamage)
			|| _Event.m_AmountType == static_cast<char>(RPLL::AmountType::NatureDamage))
			result *= mStateDruid[_SourceId].Subtlety;

		// Stances
		if (mStateDruid[_SourceId].Stance == 1)
			result *= 1.3 * mStateDruid[_SourceId].FeralInstinct;
		else if (mStateDruid[_SourceId].Stance == 2)
			result *= 0.71;

		// Life Bloom gets only half as much threat
		if (_Event.m_SpellID == 33763)
			result *= 0.5;

		// Thunderheart for Mangle
		if (mStateDruid[_SourceId].Thunderheart && (
			_Event.m_SpellID == 33987 ||
			_Event.m_SpellID == 33986 ||
			_Event.m_SpellID == 33878
			))
			result *= 1.15;
	}

	/*
	 * Mage
	 */
	else if (mClassIds[_SourceId] == 5)
	{
		// Invis like vanish/feign death
		// It needs 5 sec for that though and in that time it removes threat => TODO
		// No idea how to implement it, probably just ignoring it and people can make up their mind themselves

		if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::ArcaneDamage))
			result *= mStateMage[_SourceId].Arcane;
		else if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::FireDamage))
			result *= mStateMage[_SourceId].Fire;
		else if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::FrostDamage))
			result *= mStateMage[_SourceId].Frost;

	}

	/*
	 * Warlock
	 */
	else if (mClassIds[_SourceId] == 6)
	{
		// Searing Pain
		if (_Event.m_SpellID == 30459 || _Event.m_SpellID == 27210 || _Event.m_SpellID == 17923)
			result *= 2;

		if (mDestroSpells[_Event.m_SpellID])
			result *= mStateWarlock[_SourceId].Destruction;

		if (mAffliSpells[_Event.m_SpellID])
			result *= mStateWarlock[_SourceId].Affliction;

		if (mStateWarlock[_SourceId].ImpActive)
			result *= mStateWarlock[_SourceId].MasterOfDemonology;
	}

	/*
	 * Paladin
	 */
	else if (mClassIds[_SourceId] == 7)
	{
		// Righteous Fury
		if (_Event.m_Action == static_cast<char>(RPLL::Action::Gain) && _Event.m_SpellID == 25780)
			mStatePaladin[_SourceId].RighteousFury = true;
		else if (_Event.m_Action == static_cast<char>(RPLL::Action::Fades) && _Event.m_SpellID == 25780)
			mStatePaladin[_SourceId].RighteousFury = false;

		if (mStatePaladin[_SourceId].RighteousFury && _Event.m_AmountType == static_cast<char>(RPLL::AmountType::HolyDamage))
			result *= 1.6 * mStatePaladin[_SourceId].ImprovedRighteousFury;
		
		if (!mStatePaladin[_SourceId].RighteousFury)
			result *= mStatePaladin[_SourceId].Fanatism;

		// Some weird stuff with Judgements :/

		if (_Event.m_Action <= static_cast<char>(RPLL::Action::CritHeal))
			result *= 0.5;
	}

	/*
	 * Shaman
	 */
	else if (mClassIds[_SourceId] == 8)
	{
		// Frostshock double threat
		if (_Event.m_SpellID == 25464 || _Event.m_SpellID == 10473 || _Event.m_SpellID == 10472 || _Event.m_SpellID == 8058 || _Event.m_SpellID == 8056)
			result *= 2;

		if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::FireDamage)
			|| _Event.m_AmountType == static_cast<char>(RPLL::AmountType::FrostDamage)
			|| _Event.m_AmountType == static_cast<char>(RPLL::AmountType::NatureDamage)
			)
			result *= mStateShaman[_SourceId].ElementalPrecision;

		if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::PhysicalDamage))
			result *= mStateShaman[_SourceId].SpiritWeapons;

		if (_Event.m_Action <= static_cast<char>(RPLL::Action::CritHeal))
			result *= mStateShaman[_SourceId].HealingGrace;
	}

	// In general heal threat is halved
	if (_Event.m_Action <= static_cast<char>(RPLL::Action::CritHeal))
		result *= 0.5;

	// Power gains
	if (_Event.m_Action == static_cast<char>(RPLL::Action::Energize))
	{
		if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::Mana))
			result *= 0.5;
		else if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::Rage))
			result *= 5;
		else if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::Energy))
			result *= 5;
		else if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::Focus))
			result *= 5;
		else if (_Event.m_AmountType == static_cast<char>(RPLL::AmountType::Runes))
			result *= 5;
	}

	result *= mPMod[_SourceId];
	if (mMultiplicativeThreat[_SourceId] != 0)
		result *= mMultiplicativeThreat[_SourceId];

	// 0 => Non directly tracked event
	if (result > 0)
	{
		if (_Type == 1)
			queryDmg.AttachValues(_TypeId, static_cast<int>(100.0*result));
		else if (_Type == 2)
			queryHeal.AttachValues(_TypeId, static_cast<int>(100.0*result));
		else if (_Type == 3)
			queryGained.AttachValues(_TypeId, static_cast<int>(100.0*result), _TS);
	}
	return static_cast<int>(100.0*result);
}

/*
 * Warrior:
 */
int Threat::Devastate(unsigned long long targetGUID)
{
	if (mUnitSunderStacks[targetGUID] == 0)
		return 120;
	return 120 + 15*(mUnitSunderStacks[targetGUID] - 1);
}