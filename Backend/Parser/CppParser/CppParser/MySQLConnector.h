#pragma once
//#include <otlv4.h>
#include <string>
#include <map>
#include <iostream>

class otl_connect;
class otl_stream;

namespace RPLL
{
	class MySQLConnector;

	template<typename T_Value>
	void OTLStream_AttachValues(otl_stream* _Stream, const T_Value& _Value);

	template<typename T_Value1, typename ...T_Values>
	void OTLStream_AttachValues(otl_stream* _Stream, const T_Value1& _Value, const T_Values&... _Values)
	{
		OTLStream_AttachValues(_Stream, _Value);
		OTLStream_AttachValues(_Stream, _Values...);
	}

	template<typename T_Value>
	void OTLStream_ReadData(otl_stream* _Stream, T_Value* _Value);
	template<typename T_Value1, typename ...T_Values>
	void OTLStream_ReadData(otl_stream* _Stream, T_Value1* _Value, T_Values*... _Values)
	{
		OTLStream_ReadData(_Stream, _Value);
		OTLStream_ReadData(_Stream, _Values...);
	}

	class MySQLStream
	{
	private:
		otl_stream* m_Stream = nullptr;
	public:
		MySQLStream(MySQLConnector& _Connector, const char* _Statement, int _RowBufferCount = 1);
		~MySQLStream();

		/*
		MySQLStream(MySQLStream&& _Move)
		{
			m_Stream = _Move.m_Stream;
			_Move.m_Stream = nullptr;
		}
		MySQLStream& operator=(MySQLStream&& _Move)
		{
			m_Stream = _Move.m_Stream;
			_Move.m_Stream = nullptr;
		}
		

		MySQLStream(const MySQLStream& _Copy) = delete;
		MySQLStream& operator=(const MySQLStream& _Copy) = delete;
		*/
		
	public:
		template<typename ...T_Values>
		MySQLStream& AttachValues(const T_Values&... _Values)
		{
			OTLStream_AttachValues(m_Stream, _Values...);
			return *this;
		}

		bool HasData() const;

		template<typename ...T_Values>
		MySQLStream& ReadData(T_Values*... _Values)
		{
			OTLStream_ReadData(m_Stream, _Values...);
			return *this;
		}

		void Flush();
		void CompleteStatement();
	};

	class MySQLConnector
	{
		friend class MySQLStream;
	private:
		otl_connect* m_DB = nullptr; 
		bool m_Connected = false;

		std::map<std::string, std::pair<time_t, MySQLStream*>> m_Streams;
	public:	
		bool IsConnected() const { return m_Connected; }
	public:
		MySQLConnector(const char* _Username, const char* _Password, const char* _DSN, const char* _DatabaseName);
		~MySQLConnector();

		void SetBufferSize(int _Size);

		void ExecuteStatement(const char* _Statement);

		MySQLStream ExecuteStreamStatement(std::string _Statement, int _RowBufferCount = 1, bool _IgnoreSave = false);
	};
}
