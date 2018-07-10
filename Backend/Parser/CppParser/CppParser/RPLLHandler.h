#pragma once
#include "DatabaseAccess.h"
#include "Analyzer.h"
#include <experimental/filesystem>
#include <map>
#include "ArmoryProcessor.h"
namespace fs = std::experimental::filesystem::v1;

namespace RPLL
{
	struct QueueElement
	{
		long long mTS = 0;
		int mUID = 0;
		std::experimental::filesystem::path mPath;
	};
	class RPLLHandler
	{

	private:
		std::thread* APProcessor = nullptr;

		std::map<std::string, bool> m_Lock;
		std::map<std::string, bool> m_InQueue;
		std::map<std::string, int> m_TimeStamp;
		std::vector<QueueElement> m_Queue;
		//static std::map<std::string, int> m_KnownUser;
		ArmoryProcessor* m_Processor = nullptr;

		RPLL::DatabaseAccess* m_DB = nullptr;
		std::string m_Directory;
		bool m_Run;
		bool m_Post;
		void SearchFile();

		int GetUserId(std::string _Name, long long _TimeStamp);
		bool IsUserPriorticed(std::string _Name);

	public:
		RPLLHandler(std::string _Directory, bool _PostVanilla = false);
		~RPLLHandler();

		void Run();
		void Stop();

		void Decompress(std::string _File, std::string _Name);
	};
}
