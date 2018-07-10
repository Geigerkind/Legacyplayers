#pragma once
#include "RPLLParser.h"
#include "DatabaseAccess.h"
#include "ArmoryCharData.h"
#include <algorithm>
#include <string>
#include <cctype>
#include <locale>
#include "ArmoryProcessor.h"
#include <map>

#if __linux__
#include <algorithm>
#include <inttypes.h>
#define __int64 long long
#endif

/*
* Flowgraph:
* Retrieve the guild information
* Add missing and retrieve their values
*
* Retrieve the character information
* Add missing und retrieve their values
* 
* Retrieve arena team data
* 
* Generate armory char profiles
* Test them for legitemitility
* 
* Add them to the database
* 
*/

// Dummy classes

namespace RPLL
{
	class Armory
	{
	public:
		Armory(const char* _FileName, const int& _Uploader, DatabaseAccess& DBAccess, bool _PostVanilla = false, ArmoryProcessor* _Processor = nullptr);
		~Armory();

		RPLLParser* m_Parser;

		std::map<std::string, UnitData> m_UnitData;
		std::map<unsigned long long, int> m_PetToId;
		std::map<unsigned long long, int> m_PetToOwner;

		int m_ServerID;
		static std::map<int, int> mClassTranslation;
		static std::map<int, int> mConvertClassId;
		static std::string HashTalents(std::string& _Talents, int classid, bool postvanilla);
		static std::string GetTalentsSpend(std::string& _Talents);
	};
}
