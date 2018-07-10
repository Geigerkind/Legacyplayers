#pragma once
#include <string>

namespace RPLL
{
	class Coll_PlayerData
	{
	private:
		Coll_PlayerData(std::string _NAME, std::string _GUILD, std::string _CLASS, std::string _RACE, std::string _FACTION, std::string _GEAR, int _LEVEL)
			: m_name(_NAME), m_guild(_GUILD), m_class(_CLASS), m_race(_RACE), m_faction(_FACTION), m_gear(_GEAR), m_level(_LEVEL)
		{
			
		};
	private:
		std::string m_name;
		std::string m_guild;
		std::string m_class;
		std::string m_race;
		std::string m_faction;
		std::string m_gear;
		int m_level;

	};
}
