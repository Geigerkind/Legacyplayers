#pragma once


#if __linux__
#include <inttypes.h>
#define __int64 long long
#endif

#include "DatabaseAccess.h"
#include <map>
#include "ArmoryStructs.h"
#include "ArmoryProcessor.h"
#include "CBTPStructs.h"
#include "CombatLogParser.h"


class Threat
{
	struct ThreatGeneral
	{
		// Buffs
		bool TranquilAir = false;
		bool BlessingOfSalvation = false;
		bool ArcaneShroud = false;
		bool TheEyeOfDiminution = false;
		bool PainSupression = false;

		// Debuffs
		bool FungalBloom = false;
		bool Insignifigance = false;
		bool FelRage = false;
		bool SpitefulFury = false;
		bool Seethe = false;
		bool WildMagic = false;
	};

	struct ThreatWarrior
	{
		char Stance = 0;
		double MSBT = 1.0;
		double BeserkerStance = 0.8;
	};

	struct ThreatPriest
	{
		double SilentResolve = 1.0;
		double ShadowAffinity = 1.0;
		double ImprovedPowerWordShield = 1.0;
	};

	struct ThreatDruid
	{
		char Stance = 0;
		double FeralInstinct = 1.0;
		double Subtlety = 1.0;
		double Tranquility = 1.0;
		bool Thunderheart = false;
	};

	struct ThreatMage
	{
		double Arcane = 1.0;
		double Fire = 1.0;
		double Frost = 1.0;
	};

	struct ThreatWarlock
	{
		double Affliction = 1.0;
		double MasterOfDemonology = 1.0;
		double Destruction = 1.0;
		bool ImpActive = false;
	};

	struct ThreatPaladin
	{
		double ImprovedRighteousFury = 1.0;
		double Fanatism = 1.0;
		bool RighteousFury = false;
	};

	struct ThreatShaman
	{
		double ElementalPrecision = 1.0;
		double SpiritWeapons = 1.0;
		double HealingGrace = 1.0;
	};

private:
	int mExpansion = 1;
	std::map<std::string, RPLL::UnitData>* mUnitData = nullptr;;
	RPLL::DatabaseAccess* mDBAccess = nullptr;
	RPLL::ArmoryProcessor* mAProcessor = nullptr;
	std::vector<std::string>* mNameValues = nullptr;
	std::map<unsigned long long, int>* mPetToOwner = nullptr;

	static std::map<int, int> mFixedThreat;
	static std::map<int, double> mMultiplicativeThreat;
	static std::map<int, bool> mMSBT;
	static std::map<int, bool> mZeroThreat;
	static std::map<int, bool> mAffliSpells;
	static std::map<int, bool> mDestroSpells;

	std::map<int, int> mClassIds;
	std::map<int, double> mPMod;
	std::map<int, ThreatGeneral> mStateAuras;
	std::map<int, ThreatWarrior> mStateWarrior;
	std::map<int, ThreatPriest> mStatePriest;
	std::map<int, ThreatDruid> mStateDruid;
	std::map<int, ThreatMage> mStateMage;
	std::map<int, ThreatWarlock> mStateWarlock;
	std::map<int, ThreatPaladin> mStatePaladin;
	std::map<int, ThreatShaman> mStateShaman;
	std::map<int, std::pair<int, int>> mMisdirectionSrcTarget;

	void PrepareUnitData();

	std::map<unsigned long long, int> mUnitSunderStacks;
	int Devastate(unsigned long long targetGUID);
public:
	Threat(std::map<std::string, RPLL::UnitData>* unitData, RPLL::DatabaseAccess* DBAccess, RPLL::ArmoryProcessor* AProcessor, std::vector<std::string>* nameValues, std::map<unsigned long long, int>* petOwner, int expansion = 1);
	~Threat();

	int Feed(int _SourceId, int _TargetId, char _Type, int _TypeId, RPLL::CombatLogEventPost& _Event, int _TS, RPLL::MySQLStream& queryDmg, RPLL::MySQLStream& queryHeal, RPLL::MySQLStream& queryGained);
};

