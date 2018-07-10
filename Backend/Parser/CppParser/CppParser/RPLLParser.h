#pragma once
#include "ParsingStructs.h"
#include <vector>
#include <memory>
#include <map>
#include <utility>

#if __linux__
#include <inttypes.h>
#define __int64 long long
#endif

namespace RPLL
{
	class RPLLParser
	{
	public:
		RPLLParser(const char* _source, bool _PostVanilla = false);
		~RPLLParser();

		std::vector<std::vector<PlayerData>> m_playerdata;
		std::vector<std::vector<SessionLine>> m_sessions;
		std::vector<__int64> m_RealTime;
	private:
		std::string buffer;
		__int64 sessionTS;
		__int64 oldTimer = 0;

		int sessionSize;
		std::vector<PlayerData>* sessionPlayerData;

		void parseInt(int & value, const char** str, int* untilChoice = nullptr);

		void parseShort(short & value, const char** str, int* untilChoice = nullptr);

		void parseChar(char & value, const char** str, int* untilChoice = nullptr);

		void getPlayerData(std::string::const_iterator&, PlayerData*);
		void getPlayerDataPost(std::string::const_iterator&, PlayerData*);

		static void getStringAssociatedToId(std::string::const_iterator& _token, std::string& buffer);
		void getComboAST(std::string::const_iterator& _token, ComboAST* _ast, std::vector<std::string>& _npcs, std::vector<std::string>& _abilities);
		void getOverHeal(std::string::const_iterator& _token, SessionLine* _sl, std::vector<ComboAST>& _ast);
		void getCombatState(std::string::const_iterator& _token, SessionLine* _sl);
		void getStartEndEntry(std::string::const_iterator& _token, SessionLine* _sl);
		void getZone(std::string::const_iterator& _token, SessionLine* _sl);
		void getBossHealth(std::string::const_iterator& _token, SessionLine* _sl, std::vector<std::string>& _npcs);
		void getLoot(std::string::const_iterator& _token, SessionLine* _sl);
		void getBossCombatState(std::string::const_iterator& _token, SessionLine* _sl, std::vector<std::string>& _npcs);
		void getBossDied(std::string::const_iterator& _token, SessionLine* _sl, std::vector<std::string>& _npcs);
		void getSpeech(std::string::const_iterator& _token, SessionLine* _sl, std::vector<std::string>& _npcs, std::vector<std::string>& _speeches);
		void getDispelInterrupt(std::string::const_iterator& _token, SessionLine* _sl, std::vector<std::string>& _npcs, std::vector<std::string>& _abilities); 
		void getThreat(std::string::const_iterator & _token, SessionLine * _sl, std::vector<std::string>& _npcs);
	};
}
