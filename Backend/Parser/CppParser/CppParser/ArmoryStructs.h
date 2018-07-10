#pragma once
#include <vector>
#include "ParsingStructs.h"

namespace RPLL
{
	struct UnitData
	{
		int m_ID;
		int m_Faction;
		int m_Class;
		int m_GuildID;
		int m_Owner = 0;
		__int64 m_Joined;
		__int64 m_Left;
		std::vector<std::string> m_PetName;

		std::string m_GuildName;
		std::string m_RankName;
		int m_RankIndex;
		int m_Race;
		int m_Level;
		int m_Sex;
		PvPData m_PvPData;
		ArenaData mArenaData[3];
		std::string mTalents = "";
		Item m_Gear[19];
		int m_Prof1 = 0;
		int m_Prof2 = 0;
	};

	struct APData
	{
		UnitData uData;
		int RealmId;
		int Version;
		int Uploader;
	};
}