#pragma once
#include <string>
#include "StringUtility.h"

namespace RPLL
{
	enum class Action
	{
		Heal,
		CritHeal,

		Hit,
		Crit,
		Missed,
		Suffers,//Dot(?)
		Reflects,

		Gain,
		Drain,

		None,
		Unknown,
		Failed,
		Fades,
		Slain,
		Dies,
		BeginCast,
		Cast,
		AfflictedBy,
		Removed,
		Creates,
		Destroyed,
		Falls,
		PetBeginEats,
		Killed,
		Interrupt,
		SwimmingInLava,
		Awarded,
		Exhausted,
		Drowning,
		EnvFatigue,
		EnvFire,
		EnvSlime,
		Energize,
		Leech,
		Dispel,
		DispelFailed,
		Stolen,
		ExtraAttack,
		GainDose,
		RemoveDose,
		AuraRefresh,
		Broken,
		BrokenSpell,
		Instakill,
		Durability,
		Create,
		Summon,
		PetLocality,
		Reputation,
		RPLL,
	};
	enum class AmountType
	{
		ArcaneDamage,
		NatureDamage,
		ShadowDamage,
		PhysicalDamage,
		FireDamage,
		FrostDamage,
		HolyDamage,

		Health,
		Mana,
		Rage,
		Energy,
		Focus,

		None,
		Unknown,
		Happiness,
		Attack,
		Honor,
		Runes,
		RunicPower,
	};
	enum class ExtraModifier
	{
		None,
		Unknown,
		Blocked,
		Overheal,
		Glancing,
		Crushing,
		Dodged,
		Resisted,
		Parried,
		Evaded,
		Absorbed,
		NotEnoughRage,
		NotYetRecovered,
		OutOfRange,
		AnotherActionIsInProgress,
		Immune,
		Interrupted,
		Reflected,
		Deflected,
		Split,
	};

	inline const char* Enum_ToString(Action _Action)
	{
		switch (_Action)
		{
		case RPLL::Action::None: 		return "None";
		case RPLL::Action::Unknown: 	return "Unknown";
		case RPLL::Action::Missed:		return "Missed";
		case RPLL::Action::Failed: 		return "Failed";
		case RPLL::Action::Hit: 		return "Hit";
		case RPLL::Action::Crit: 		return "Crit";
		case RPLL::Action::Gain: 		return "Gain";
		case RPLL::Action::Fades: 		return "Fades";
		case RPLL::Action::Heal: 		return "Heal";
		case RPLL::Action::CritHeal: 	return "CritHeal";
		case RPLL::Action::Suffers: 	return "Suffers";
		case RPLL::Action::Slain: 		return "Slain";
		case RPLL::Action::Dies: 		return "Dies";
		case RPLL::Action::Reflects: 	return "Reflects";
		case RPLL::Action::BeginCast: 	return "BeginCast";
		case RPLL::Action::Cast: 		return "Cast";
		case RPLL::Action::AfflictedBy: return "AfflictedBy";
		case RPLL::Action::Drain:		return "Drain";
		case RPLL::Action::Removed:		return "Removed";
		case RPLL::Action::Creates:		return "Creates";
		case RPLL::Action::Destroyed:	return "Destroyed";
		case RPLL::Action::Falls:		return "Falls";
		case RPLL::Action::PetBeginEats:return "PetBeginEats";
		case RPLL::Action::Killed:		return "Killed";
		case RPLL::Action::Interrupt:	return "Interrupt";
		case RPLL::Action::SwimmingInLava: return "SwimmingInLava";
		case RPLL::Action::Awarded:		return "Awarded";
		case RPLL::Action::Exhausted:		return "Exhausted";
		case RPLL::Action::Drowning:		return "Drowning";
		case RPLL::Action::EnvFatigue:		return "EnvFatigue";
		case RPLL::Action::EnvFire:		return "EnvFire";
		case RPLL::Action::EnvSlime:		return "EnvSlime";
		case RPLL::Action::ExtraAttack: return "ExtraAttack";
		case RPLL::Action::Energize: return "Energize";
		default: return "?ERROR?";
		}
		return "?ERROR?";
	}

	inline const char* Enum_ToString(AmountType _AmountType)
	{
		switch (_AmountType)
		{
		case RPLL::AmountType::None: 					return "None";
		case RPLL::AmountType::Unknown: 				return "Unknown";
		case RPLL::AmountType::ArcaneDamage: 			return "ArcaneDamage";
		case RPLL::AmountType::NatureDamage: 			return "NatureDamage";
		case RPLL::AmountType::ShadowDamage: 			return "ShadowDamage";
		case RPLL::AmountType::PhysicalDamage: 			return "PhysicalDamage";
		case RPLL::AmountType::FireDamage: 				return "FireDamage";
		case RPLL::AmountType::FrostDamage: 			return "FrostDamage";
		case RPLL::AmountType::HolyDamage: 				return "HolyDamage";
		case RPLL::AmountType::Health: 					return "Health";
		case RPLL::AmountType::Mana: 					return "Mana";
		case RPLL::AmountType::Rage: 					return "Rage";
		case RPLL::AmountType::Energy: 					return "Energy";
		case RPLL::AmountType::Focus: 					return "Focus";
		case RPLL::AmountType::Happiness:				return "Happiness";
		case RPLL::AmountType::Attack:					return "Attack"; // ?!
		case RPLL::AmountType::Honor:					return "Honor";
		case RPLL::AmountType::Runes:					return "Runes"; // ?!
		case RPLL::AmountType::RunicPower:					return "RunicPower";
		}
		return "?ERROR?";
	}

	inline const char* Enum_ToString(ExtraModifier _Modifier)
	{
		switch (_Modifier)
		{
		case RPLL::ExtraModifier::None:							return "None";
		case RPLL::ExtraModifier::Unknown:						return "Unknown";
		case RPLL::ExtraModifier::Blocked:						return "Blocked";
		case RPLL::ExtraModifier::Overheal:						return "Overheal";
		case RPLL::ExtraModifier::Glancing:						return "Glancing";
		case RPLL::ExtraModifier::Crushing:						return "Crushing";
		case RPLL::ExtraModifier::Dodged:						return "Dodged";
		case RPLL::ExtraModifier::Resisted:						return "Resisted";
		case RPLL::ExtraModifier::Parried:						return "Parried";
		case RPLL::ExtraModifier::Evaded:						return "Evaded";
		case RPLL::ExtraModifier::Absorbed:						return "Absorbed";
		case RPLL::ExtraModifier::NotEnoughRage:				return "NotEnoughRage";
		case RPLL::ExtraModifier::NotYetRecovered:				return "NotYetRecovered";
		case RPLL::ExtraModifier::OutOfRange:					return "OutOfRange";
		case RPLL::ExtraModifier::AnotherActionIsInProgress:	return "AnotherActionIsInProgress";
		case RPLL::ExtraModifier::Immune:						return "Immune";
		case RPLL::ExtraModifier::Interrupted:					return "Interrupted";
		case RPLL::ExtraModifier::Reflected:		return "Reflected";
		case RPLL::ExtraModifier::Deflected:		return "Deflected";
		case RPLL::ExtraModifier::Split:		return "Split";
		}
		return "?ERROR?";
	}

	struct WowTimestamp
	{
		short Year = -1;
		char Month = -1;
		char Day = -1;

		char Hour = -1;
		char Minute = -1;
		char Second = -1;
		short Millisecond = -1;

		WowTimestamp()
		{}
		static WowTimestamp ParseDateTime(const char* _String, const char* _EndIdentifier, const char** _ResultFollowingString = nullptr)
		{
			WowTimestamp result;
			const char* tempStr = _String;
			const char* tempStr2 = nullptr;
			result.Year = -1;
			//std::cout << "Test 1" << std::endl;
			result.Month = std::stoi(String_SubStringUntil(tempStr, "/", &tempStr2));
			result.Day = std::stoi(String_SubStringUntil(tempStr2, " ", &tempStr));

			result.Hour = std::stoi(String_SubStringUntil(tempStr, ":", &tempStr2));
			result.Minute = std::stoi(String_SubStringUntil(tempStr2, ":", &tempStr));
			result.Second = std::stoi(String_SubStringUntil(tempStr, ".", &tempStr2));

			result.Millisecond = std::stoi(String_SubStringUntil(tempStr2, "  ", &tempStr));
			//std::cout << "Test 2" << std::endl;
			if (_ResultFollowingString != nullptr) *_ResultFollowingString = tempStr;
			return result;
		}
		int GetTimeTotalMilliseconds()
		{
			/*
			struct tm t = {};
			t.tm_year = 2017 - 1900; // TODO: Get year somewhere
			t.tm_hour = 0;
			t.tm_min = 0;
			t.tm_sec = 0;
			t.tm_mon = Month - 1;
			t.tm_mday = Day;

			return static_cast<__int64>(static_cast<unsigned int>(mktime(&t)) - 1483225200) * 1000 + Millisecond;
			*/
			return Hour * 60 * 60 * 1000 + Minute * 60 * 1000 + Second * 1000 + Millisecond;
		}
		int GetTimeDeltaMilliseconds(WowTimestamp _PrevTimeStamp, int _PrevTotalMilliseconds)
		{
			int thisMs = GetTimeTotalMilliseconds();

			if (_PrevTotalMilliseconds > thisMs)
			{
				if (_PrevTimeStamp.Month == Month && _PrevTimeStamp.Day == Day && _PrevTotalMilliseconds - thisMs < 3600 * 1000)
				{
					//Something strange going on, possibly wowcombatlog not being correctly ordered
					return -1;
				}

				//if (_PrevTotalMilliseconds - thisMs > 23 * 60 * 60 * 1000) //Bigger difference than 23 hours, most likely day change from 23:59 to 00:00
				//{
				//	thisMs += 24 * 60 * 60 * 1000; //Add an entire day
				//}
				//else 
				// Parsing error where a day is parsed as 1/7 or so
				if ((_PrevTimeStamp.Day > Day && _PrevTimeStamp.Month == Month)
					|| (_PrevTimeStamp.Day == Day && _PrevTimeStamp.Month != Month)
					)
				{
					return -2; // Parsing error detected!
				}
				else if (_PrevTimeStamp.Month != Month || _PrevTimeStamp.Day != Day)
				{
					//Most likely an entire different session
					std::cout << "Month or Day change:" << std::endl;
					std::cout << "Month: " << static_cast<int>(_PrevTimeStamp.Month) << " vs " << static_cast<int>(Month) << std::endl;
					std::cout << "Day: " << static_cast<int>(_PrevTimeStamp.Day) << " vs " << static_cast<int>(Day) << std::endl;
					return -1;
				}
				while (_PrevTotalMilliseconds > thisMs) //daylight savingstime or other timezone changes
				{
					thisMs += 3600 * 1000; //Add 1 hour
				}
			} else if ((_PrevTimeStamp.Month != -1 && _PrevTimeStamp.Day != -1) && (_PrevTimeStamp.Month != Month || _PrevTimeStamp.Day != Day))
			{
				//Most likely an entire different session
				std::cout << "Month or Day change:" << std::endl;
				std::cout << "Month: " << static_cast<int>(_PrevTimeStamp.Month) << " vs " << static_cast<int>(Month) << std::endl;
				std::cout << "Day: " << static_cast<int>(_PrevTimeStamp.Day) << " vs " << static_cast<int>(Day) << std::endl;
				return -1;
			}

			return thisMs - _PrevTotalMilliseconds;
		}
	};
	struct CBTBase
	{
		int m_Timestamp = 0;
		char m_RTIndex = 0;
		//WowTimestamp m_WowTimestamp;
		char m_Action = 9; // None
		char m_AmountType = 11; // None
		char m_ExtraModifier = 0; // None
		int m_Amount = 0;
	};
	struct CombatLogEvent : CBTBase
	{
		short m_Source = 0;
		//std::string m_Ability = "";
		int m_Ability = 0;
		short m_Target = 0;
		int m_Extra = 0;
	};

	struct WoWGUID
	{
		unsigned long long m_GUID = 0;
		int GetNPCID() const
		{
			if (!IsNPC())
				return 0;
			return static_cast<int>((m_GUID & 0x00000FFFFF000000) >> 24); // Correct Bitmask?
		}
		bool IsPlayer() const
		{
			return (m_GUID & 0x00F0000000000000) == 0x0000000000000000;
		}
		bool IsNPC() const
		{
			return (m_GUID & 0x00F0000000000000) == 0x0030000000000000;
		}
		bool IsPet() const
		{
			return (m_GUID & 0x00F0000000000000) == 0x0040000000000000;
		}
	};
	struct CombatLogEventPost : CBTBase
	{
		WoWGUID m_SourceGUID;
		short m_Source; // Changed to unify names!
		unsigned int m_SourceFlags = 0;
		WoWGUID m_DestGUID;
		short m_Target;
		unsigned int m_DestFlags = 0;
		int m_SpellID = 0;
		short m_SpellName;
		unsigned char m_SpellSchool = 0;

		unsigned char m_AmountSchool = 0;
		int m_Resisted = 0;
		int m_Blocked = 0;
		int m_Absorbed = 0;
		short m_Extra;
		int m_ExtraAmount = 0;
		int m_ExtraID = 0;
		unsigned char m_ExtraSchool = 0;

		//std::string debug;
	};
}
