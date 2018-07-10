using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
using Microsoft.Win32.SafeHandles;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;


/* Author: Shino
 * Requires: ODBC
 * 
 * A wrapper including utillity functions for
 * - BulkInsert
 * - Common query usage
 *
 * BulkUpdate:
 * Updating each row will take an insanly long amount of time, whereas deleting and inserting is pretty fast actually.
 * Therefore we are going to delete every row first and bulk insert it then.
 */
namespace RPLL
{

    public static class ConcurrentDictionaryEx
    {
        public static bool Remove<TKey, TValue>(
            this ConcurrentDictionary<TKey, TValue> self, TKey key)
        {
            return ((IDictionary<TKey, TValue>)self).Remove(key);
        }
    }

    public static class MySqlExtensions
    {
	    public static void ReadAll(this MySqlDataReader _DR, string _Types)
        {
            for (int i = 0; i<_Types.Length-1; ++i)
            {
                switch (_Types[i])
                {
                    case 'A':
                        _DR.GetInt16(i);
                        break;
                    case 'B':
                        _DR.GetInt32(i);
                        break;
                    case 'C':
                        _DR.GetInt64(i);
                        break;
                    case 'D':
                        _DR.GetString(i);
                        break;
                    case 'E':
                        _DR.GetFloat(i);
                        break;
                }
            }
        }

        public static ConcurrentDictionary<ulong, List<Tuple<long, MySqlDataReader>>> _mMySqlDataReaders = new ConcurrentDictionary<ulong, List<Tuple<long, MySqlDataReader>>>();
        public static MySqlDataReader ExecuteReaderRpll(this MySqlCommand cmd, bool tryagain = true)
        {
            try
            {
                var copy = new ConcurrentDictionary<ulong, List<Tuple<long, MySqlDataReader>>>(_mMySqlDataReaders);
                foreach (var readerIP in copy)
                {
                    foreach (var reader in readerIP.Value)
                    {
                        if (reader == null) continue;
                        if (reader.Item1 + 600 > DateTimeOffset.UtcNow.ToUnixTimeSeconds()) break;
                        reader.Item2.Close();
                        reader.Item2.Dispose();
                    }

                    _mMySqlDataReaders[readerIP.Key].Clear();
                    _mMySqlDataReaders.Remove(readerIP.Key);
                }
            }
            catch { }
            // Add data reader organization
            MySqlDataReader rd;
            string ip = "0";
            if (HttpContext.Current != null)
                ip = Utility.GetIPAddress(HttpContext.Current.Request);
            ulong key = Farmhash.Sharp.Farmhash.Hash64(ip);
            try
            {
                rd = cmd.ExecuteReader();
                if (!_mMySqlDataReaders.ContainsKey(key))
                    _mMySqlDataReaders[key] = new List<Tuple<long, MySqlDataReader>>();
                _mMySqlDataReaders[key].Add(new Tuple<long, MySqlDataReader>(DateTimeOffset.UtcNow.ToUnixTimeSeconds(), rd));
                return rd;
            }
            catch (MySqlException)
            {
                // Just open new connection and execute the reader on there
                if (tryagain)
                {
                    if (cmd.Connection.Database.ToLower().Contains("rpll_vanilla"))       
                        return App.GetDB(1).Query(cmd.CommandText).ExecuteReaderRpll(false);
                    else if (cmd.Connection.Database.ToLower().Contains("rpll_tbc"))
                        return App.GetDB(2).Query(cmd.CommandText).ExecuteReaderRpll(false);
                    else
                        return App.GetDB().Query(cmd.CommandText).ExecuteReaderRpll(false);
                }
                else
                {
                    if (_mMySqlDataReaders.ContainsKey(key) && _mMySqlDataReaders[key].Any())
                    {
                        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                        foreach (var reader in _mMySqlDataReaders[key])
                        {
                            if (reader == null) continue;
                            if (reader.Item1 + 30 > DateTimeOffset.UtcNow.ToUnixTimeSeconds()) break;
                            reader.Item2.Close();
                            reader.Item2.Dispose();
                        }

                        _mMySqlDataReaders[key].Clear();
                    }

                    rd = cmd.ExecuteReader();
                    if (!_mMySqlDataReaders.ContainsKey(key))
                        _mMySqlDataReaders[key] = new List<Tuple<long, MySqlDataReader>>();
                    _mMySqlDataReaders[key].Add(new Tuple<long, MySqlDataReader>(DateTimeOffset.UtcNow.ToUnixTimeSeconds(), rd));
                    return rd;
                }
            }
            catch (KeyNotFoundException)
            {
                return null;
                // Maybe a data race thingy?
            }
            catch (NullReferenceException)
            {
                SQLWrapper.DisposeSQL();
                return null;
                // Dont really know what to do then
            }
            catch (IndexOutOfRangeException)
            {
                return null;
                // Dont really know what to do then
            }
            catch (ObjectDisposedException)
            {
                SQLWrapper.DisposeSQL();
                return null;
                // No clue
            }
            //return null; // Uston?!!
        }

        public static void CloseRpll(this MySqlDataReader reader)
        {
            if (reader == null || reader.IsClosed)
                return;

            string ip = "0";
            if (HttpContext.Current != null)
                ip = Utility.GetIPAddress(HttpContext.Current.Request);
            ulong key = Farmhash.Sharp.Farmhash.Hash64(ip);
            reader.Close();
            try
            {
                if (_mMySqlDataReaders.ContainsKey(key))
                {
                    int pos = 0;
                    foreach (var rdr in _mMySqlDataReaders[key])
                    {
                        if (rdr.Item2 == reader)
                        {
                            if (_mMySqlDataReaders[key].Count > pos)
                                _mMySqlDataReaders[key].RemoveAt(pos);
                            break;
                        }

                        ++pos;
                    }
                }
            }
            catch (KeyNotFoundException)
            {
                // Maybe a data race thingy?
            }
            catch (NullReferenceException)
            {
                // Dont really know what to do then
            }
            catch (ObjectDisposedException)
            {
                // No clue
            }
        }
    }

    public class BulkInsert
    {
        private string m_Querystr = null;
        List<string> m_Values = new List<string>();

        public BulkInsert(string table, string[] cols)
        {
            m_Querystr = "INSERT INTO " + table + " (" + string.Join(",", cols) + ") VALUES ";
        }

        public void AddRow(object[] items)
        {
            m_Values.Add("(\"" + string.Join("\",\"", items) + "\")");
        }

        public String BuildQuery()
        {
            if (m_Values.Count > 0)
                return m_Querystr + string.Join(",", m_Values);
            Destroy();
            return null;
        }

        public void Destroy()
        {
            m_Querystr = null;
            m_Values = null;
        }
    }

    public class SQLWrapper
    {

        //private OdbcConnection m_Con = new OdbcConnection(ConfigurationManager.ConnectionStrings["MySQLConnStr"].ConnectionString);
        private MySqlConnection m_Con;
        private bool m_ConOpen = false;

        private static ConcurrentDictionary<int, ConcurrentDictionary<ulong, MySqlConnection>> m_Connections = new ConcurrentDictionary<int, ConcurrentDictionary<ulong, MySqlConnection>>();
        public static ConcurrentDictionary<int, ConcurrentDictionary<ulong, long>> m_ConnectionsTime = new ConcurrentDictionary<int, ConcurrentDictionary<ulong, long>>();
        private static ConcurrentDictionary<int, ConcurrentDictionary<ulong, int>> m_ConnectionNum = new ConcurrentDictionary<int, ConcurrentDictionary<ulong, int>>();

        public static void DisposeSQLGarbage()
        {
            var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            for (int i = 0; i < 3; ++i)
            {
                foreach (var conTuple in m_Connections[i].Select(x => x.Key).ToArray())
                {
                    if (m_ConnectionsTime[i][conTuple] + 60 > now) continue;

                    m_Connections[i][conTuple].Close();
                    m_Connections[i][conTuple].Dispose();
                    m_Connections[i][conTuple] = null;
                    m_Connections[i].Remove(conTuple);
                    m_ConnectionsTime[i].Remove(conTuple);
                }
            }
        }

        public static void DisposeSQL()
        {
            for (int i = 0; i < 3; ++i)
            {
                foreach (var conTuple in m_Connections[i].Select(x => x.Key).ToArray())
                {
                    m_Connections[i][conTuple].Close();
                    m_Connections[i][conTuple].Dispose();
                    m_Connections[i][conTuple] = null;
                    m_Connections[i].Remove(conTuple);
                    m_ConnectionsTime[i].Remove(conTuple);
                }
            }

            m_Connections = new ConcurrentDictionary<int, ConcurrentDictionary<ulong, MySqlConnection>>();
            m_ConnectionsTime = new ConcurrentDictionary<int, ConcurrentDictionary<ulong, long>>();
            m_ConnectionNum = new ConcurrentDictionary<int, ConcurrentDictionary<ulong, int>>();

            for (int i = 0; i < 3; ++i)
            {
                m_Connections[i] = new ConcurrentDictionary<ulong, MySqlConnection>();
                m_ConnectionsTime[i] = new ConcurrentDictionary<ulong, long>();
                m_ConnectionNum[i] = new ConcurrentDictionary<ulong, int>();
            }

            try { HttpContext.Current.Response.Redirect("/404/", false); HttpContext.Current.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
        }


        /* Types:
         * 0 => General
         * 1 => Vanilla
         * 2 => TBC
         */
        private static bool mStartUp = false;
        private static bool mLocal = App.mDebug;   
        public SQLWrapper(int type = 0)
        {
            if (!mStartUp)
            {
                for (int i = 0; i < 3; ++i)
                {
                    m_Connections[i] = new ConcurrentDictionary<ulong, MySqlConnection>();
                    m_ConnectionsTime[i] = new ConcurrentDictionary<ulong, long>();
                    m_ConnectionNum[i] = new ConcurrentDictionary<ulong, int>();
                }
                mStartUp = true;
            }

            try
            {
                try
                {
                    DisposeSQLGarbage();
                }
                catch
                {
                }

                string ip = "0";
                if (HttpContext.Current != null)
                    ip = Utility.GetIPAddress(HttpContext.Current.Request);
                ulong key = Farmhash.Sharp.Farmhash.Hash64(ip);
                // Allowing up to X connections per user
                if (!m_ConnectionNum[type].ContainsKey(key))
                    m_ConnectionNum[type][key] = 1;
                else
                {
                    ++m_ConnectionNum[type][key];
                    if (m_ConnectionNum[type][key] > 10000000) // This wont be healthy for the server
                        m_ConnectionNum[type][key] = 1;
                }

                ip += "." + m_ConnectionNum[type][key];
                key = Farmhash.Sharp.Farmhash.Hash64(ip);

                if (m_Connections[type].ContainsKey(key))
                {
                    if (m_Connections[type][key].State == ConnectionState.Open &&
                        m_Connections[type][key].State.ToString() == "Open")
                    {
                        m_ConnectionsTime[type][key] = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                        m_Con = m_Connections[type][key];
                        m_ConOpen = true;
                        return;
                    }

                    m_Connections[type][key].Close();
                    m_Connections[type][key].Dispose();
                    m_Connections[type][key] = null;
                    m_Connections[type].Remove(key);
                    m_ConnectionsTime[type].Remove(key);
                }

                if (mLocal)
                {
                    if (type == 0)
                        m_Con = new MySqlConnection(
                            @"server=localhost;database=rpll;CharSet=utf8;max pool size=1000000;");
                    else if (type == 1)
                        m_Con = new MySqlConnection(
                            @"server=localhost;database=rpll_vanilla;CharSet=utf8;max pool size=1000000;");
                    else if (type == 2)
                        m_Con = new MySqlConnection(
                            @"server=localhost;database=rpll_tbc;CharSet=utf8;max pool size=1000000;");
                }
                else
                {
                    if (type == 0)
                        m_Con = new MySqlConnection(
                            @"server=127.0.0.1;database=rpll;CharSet=utf8;max pool size=1000000;");
                    else if (type == 1)
                        m_Con = new MySqlConnection(
                            @"server=127.0.0.1;database=RPLL_VANILLA;CharSet=utf8;max pool size=1000000;");
                    else if (type == 2)
                        m_Con = new MySqlConnection(
                            @"server=127.0.0.1;database=RPLL_TBC;CharSet=utf8;max pool size=1000000;");
                }

                m_Con.Open();
                m_ConOpen = true;

                m_Connections[type][key] = m_Con;
                m_ConnectionsTime[type][key] = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            }
            catch (IndexOutOfRangeException)
            {
                // I have no clue why it appears?
                DisposeSQL();
            }
            catch (ObjectDisposedException)
            {
                // No clue
                DisposeSQL();
            }
            catch (NullReferenceException)
            {
                DisposeSQL();
            }
        }

        ~SQLWrapper()
        {
            //Kill();
        }
	
	    public MySqlCommand Query(string cmd)
	    {
	        return new MySqlCommand(cmd, m_Con);
	    }

	    public MySqlCommand CreateCommand()
	    {
	        return m_Con.CreateCommand();	
	    }

        public bool ConState()
        {
            return m_ConOpen;
        }
    }
}
