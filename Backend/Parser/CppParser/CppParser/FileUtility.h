#pragma once

#include <fstream>
#include <string>

namespace RPLL
{
	inline std::string File_ReadAllText(const std::string& _Filename)
	{
		std::ifstream file;
		file.open(_Filename.c_str(), std::ios::binary);

		if (file.good() == false || file.is_open() == false)
		{
			return "";
		}
		std::string content;
		file.seekg(0, std::ios::end);
		content.reserve(std::size_t(file.tellg()));
		file.seekg(0, std::ios::beg);
		content.assign((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());

		return content;
	}
}