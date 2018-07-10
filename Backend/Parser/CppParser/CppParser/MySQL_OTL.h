#pragma once

#define OTL_ODBC // Compile OTL 4.0/ODBC

#if __linux__
	#define OTL_ODBC_UNIX
	//#define OTL_ODBC_MSSQL_2008
	#define OTL_BIGINT long long
#endif

#define OTL_ODBC_SELECT_STM_EXECUTE_BEFORE_DESCRIBE
//#define OTL_UNICODE // Compile OTL with Unicode 
#define OTL_STL // enable OTL support for STL

#if defined(_MSC_VER) // VC++

#define OTL_BIGINT __int64

#define OTL_STR_TO_BIGINT(str,n)                \
{                                               \
  n=_atoi64(str);                               \
}

#define OTL_BIGINT_TO_STR(n,str)                \
{                                               \
  _i64toa(n,str,10);                            \
}
#endif

#if __linux__
	#include "../../../Libs/otlv4/include/otlv4.h"
#else
	#include <otlv4.h>
#endif