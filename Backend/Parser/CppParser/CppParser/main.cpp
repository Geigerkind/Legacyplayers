#include "RPLLHandler.h"
#include <thread>
#include "AnalyzerPost.h"

#if __linux__
#include <signal.h>
void segfault_sigaction(int signal, siginfo_t *si, void *arg)
{
	printf("Caught segfault at address %p\n", si->si_addr);
	exit(0);
}
#endif

int main(int argc, char** argv)
{
#if __linux__
	struct sigaction sa;

	memset(&sa, 0, sizeof(struct sigaction));
	sigemptyset(&sa.sa_mask);
	sa.sa_sigaction = segfault_sigaction;
	sa.sa_flags = SA_SIGINFO;

	sigaction(SIGSEGV, &sa, NULL);
#endif

	if (argc <= 1)
	{
		RPLL::RPLLHandler h1("..//Vanilla//");
		RPLL::RPLLHandler h2("..//TBC//", true);
		std::thread t1(&RPLL::RPLLHandler::Run, &h1);
		//h1.Run();
		h2.Run();
		std::cin.ignore().get();
		return 0;
	}
	std::string arg(argv[1]);
	if (arg == "vanilla")
	{
		RPLL::RPLLHandler h1("obscurred");
		h1.Run();
	}
	else if (arg == "tbc")
	{
		RPLL::RPLLHandler h2("obscurred", true);
		h2.Run();
	}

	std::cin.ignore().get();
	return 0;
}
