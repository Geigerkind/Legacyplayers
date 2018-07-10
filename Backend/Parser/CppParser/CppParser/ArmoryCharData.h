#pragma once

namespace RPLL
{
	struct ArmoryCharData
	{
		int m_RefMisc = 0;
		int m_RefGuild = 0;
		int m_RefHonor = 0;
		int m_RefArena = 0;
		int m_RefGear = 0;
	};

	struct CharData
	{
		std::string m_Name;
		int m_GuildId;
		int m_LifeTimeRank;
	};
}