#pragma once
#include <string.h>
#include <vector>
#include <sstream>
#include <array>

namespace RPLL
{
	inline void String_Split(const std::string& _String, char _Delimiter, std::vector<std::string>* _ResultArray)
	{
		if (_ResultArray == nullptr)
			return;
		std::stringstream strStream(_String);
		std::string item;
		while (std::getline(strStream, item, _Delimiter)) {
			_ResultArray->push_back(item);
		}
	}

	inline std::vector<std::string> String_Split(const std::string& _String, char _Delimiter) {
		std::vector<std::string> resultArray;
		String_Split(_String, _Delimiter, &resultArray);
		return resultArray;
	}
	inline bool String_StartsWith(const char* _String, char _Char)
	{
		return _String != nullptr && _String[0] == _Char;
	}
	inline bool String_StartsWith(const char* _String, const char* _FindString, const char** _ResultFollowingString = nullptr)
	{
		if (_String == nullptr) return false;
		if (_FindString == nullptr)
		{
			if(_ResultFollowingString != nullptr) *_ResultFollowingString = _String;
			return true;
		}

		while (*_FindString == *_String)
		{
			++_FindString;
			++_String;
			if (*_FindString == '\0')
			{
				if (_ResultFollowingString != nullptr) *_ResultFollowingString = _String;
				return true;
			}
			if (*_String == '\0') return false;
		}
		return false;
	}
	inline bool String_EndsWith(const std::string& _String, char _Char)
	{
		//TODO: Write a const char* version of this
		return _String.length() > 0 && _String.back() == _Char;
	}
	inline bool String_EndsWith(const std::string& _String, const std::string& _FindString)
	{
		//TODO: Write a const char* version of this
		if (_String.length() == 0) return false;
		if (_String.length() < _FindString.length()) return false;
		if (_FindString.length() == 0) return true;

		const char* cmpString = &_String[_String.length() - _FindString.length()];
		int i = 0;
		while (_FindString[i] == *cmpString)
		{
			++cmpString;
			++i;
			if (_FindString[i] == '\0' && *cmpString == '\0')
			{
				return true;
			}
		}
		return false;
	}
	inline const char* String_GotoAfterNext(const char* _String, const char* _FindString)
	{
		if (_String == nullptr) return "";
		if (_FindString == nullptr) return _String;
		if (_FindString[0] == '\0') return "";

		int i = 0;
		while (_String[i] != '\0')
		{
			if (_String[i] == _FindString[0])
			{
				const char* nextString = nullptr;
				if (String_StartsWith(&_String[i], _FindString, &nextString) == true)
				{
					return nextString;
				}
			}
			++i;
		}
		return _String;
	}
	enum String_SubStringUntilChoice
	{
		Exclude_UntilString,
		Include_UntilString,
	};
	inline std::string String_SubStringUntil(const char* _String, const char* _UntilString, const char** _ResultFollowingString = nullptr, String_SubStringUntilChoice _Choice = String_SubStringUntilChoice::Exclude_UntilString)
	{
		if (_ResultFollowingString != nullptr) *_ResultFollowingString = "";

		if (_String == nullptr) return "";
		if (_UntilString == nullptr) return _String;
		if (_UntilString[0] == '\0') return "";

		int i = 0;
		while (_String[i] != '\0')
		{
			if (_String[i] == _UntilString[0])
			{
				const char* nextString = nullptr;
				if (String_StartsWith(&_String[i], _UntilString, &nextString) == true)
				{
					if (_ResultFollowingString != nullptr) *_ResultFollowingString = nextString;
					if (_Choice == String_SubStringUntilChoice::Include_UntilString)
					{
						return std::string(&_String[0], nextString - (&_String[0]));
					}
					return std::string(&_String[0], nextString - (&_String[0]) - strlen(_UntilString));
				}
			}
			++i;
		}
		return _String;
	}

    template<unsigned long T_UntilCount>
    inline std::string String_SubStringUntilEither(const char* _String, const std::array<const char*, T_UntilCount>& _UntilStrings, const char** _ResultFollowingString = nullptr, int* _ResultUntilStringUsed = nullptr, String_SubStringUntilChoice _Choice = String_SubStringUntilChoice::Exclude_UntilString)
	{
		if (_ResultFollowingString != nullptr) *_ResultFollowingString = "";
		if (_ResultUntilStringUsed != nullptr) *_ResultUntilStringUsed = -1;

		if (_String == nullptr) return "";
		for (auto& untilString : _UntilStrings)
		{
			if (untilString == nullptr) return _String;
			if(untilString[0] == '\0') return "";
		}

		int i = 0;
		while (_String[i] != '\0')
		{
			for (auto& untilString : _UntilStrings)
			{
				if (_String[i] == untilString[0])
				{
					const char* nextString = nullptr;
					if (String_StartsWith(&_String[i], untilString, &nextString) == true)
					{
						if (_ResultFollowingString != nullptr) *_ResultFollowingString = nextString;
						if (_ResultUntilStringUsed != nullptr) *_ResultUntilStringUsed = static_cast<int>(&untilString - &_UntilStrings[0]);
						if (_Choice == String_SubStringUntilChoice::Include_UntilString)
						{
							return std::string(&_String[0], nextString - (&_String[0]));
						}
						return std::string(&_String[0], nextString - (&_String[0]) - strlen(untilString));
					}
				}
			}
			++i;
		}
		return _String;
	}

	//inline const char* String_Goto(const char* _Find)
}
