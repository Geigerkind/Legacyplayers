#pragma once
#include <iostream>
#include <vector>

#if __linux__
#include <inttypes.h>
#define __int64 long long
#endif

namespace RPLL
{
	struct Item
	{
		int _id = 0;
		short _enchant = 0;
		short _randomEnchant = 0;
		short _socket1 = 0;
		short _socket2 = 0;
		short _socket3 = 0;
		short _socket4 = 0;
		short _uniqueid = 0;
	};

	struct PvPData
	{
		short _sessHK = -1;
		short _sessDK = -1;
		short _yesHK = -1;
		//int _yesDK;
		int _yesHonor = -1;
		short _weekHK = -1;
		int _weekHonor = -1;
		short _lastWeekHK = -1;
		int _lastWeekHonor = -1;
		int _lastWeekStanding = -1;
		int _lifeTimeHK = -1;
		int _lifeTimeDK = -1;
		char _lifeTimeRank = -1;
		int _progress = -1; // Note, change precision to 1 digit
		char _rankIndex = -1;
	};

	struct ArenaData
	{
		std::string mName;
		char mSize = 0;
		short mRating = 0;
		short mSeasonPlayed = 0;
		short mSeasonWins = 0;
	};

	struct PlayerData
	{
		short _id;
		std::string _name;
		char _level;
		char _sex;
		char _race;
		char _class;
		// Guild data
		std::string _guildName;
		std::string _rankName;
		char _rankIndex;
		char _faction;
		// Armor data
		Item _gear[19];
		// PvP data
		PvPData _pvpData;
		ArenaData mArenaData[3]; // Post vanilla
		std::string mTalents = "";
		__int64 _cbtTimeJoin;
		__int64 _cbtTimeLeave;
		std::vector<std::string> _petName;
		char mProf1 = 0;
		char mProf2 = 0;
	};

	struct SessionLine
	{
		char m_RTIndex;
		int m_TimeStamp;
		char m_Type;
		PlayerData* m_Players[2];
		std::string mS_Param[3];
		int mI_Param[3];
	};

	struct ComboAST
	{
		std::string m_Ability; // Causing bad malloc
		PlayerData* m_Players[2];
		std::string m_Target;
	};
}
