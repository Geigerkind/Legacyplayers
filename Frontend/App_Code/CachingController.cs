using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using MySql.Data.MySqlClient;

namespace RPLL
{
    public sealed class CachingController
    {
        private static bool mLoadSpells = true;
        private static bool mLoadGuilds = true;
        private static bool mLoadChars = true;
        private static bool mLoadArmory = true;
        private static bool mLoadUsers = true;
        private static bool mLoadRaidSpecific = true;
        private static bool mLoadItemQuantity = true;
        private static bool mLoadNpcs = true;
        private static bool mLoadArena = true;

        public static readonly Thread MUpdate = new Thread(OnUpdate); // How do I start it now :/ ? Maybe in App?

        private static ConcurrentDictionary<int, long>[] mRecordedRaidData = new ConcurrentDictionary<int, long>[2];

        private static bool CheckDeadLock()
        {
            try
            {
                var dr = App.GetDB().Query("UPDATE gn_deadlock SET timestamp = UNIX_TIMESTAMP()").ExecuteReaderRpll();
                if (dr.HasRows) dr.Read();
                dr.CloseRpll();
                return false;
            }
            catch (NullReferenceException)
            {
                // ?!
            }
            catch (MySqlException)
            {
                // Unable to connect to any of the specified MySQL hosts
            }

            return false;
        }

        private static void FreeDeadLock()
        {
            //var dr = App.GetDB().Query("DELETE FROM gn_deadlock").ExecuteReaderRpll();
            var dr = App.GetDB().Query("UPDATE gn_deadlock SET timestamp = 0").ExecuteReaderRpll();
            if (dr.HasRows) dr.Read();
            dr.CloseRpll();
        }

        private static void InvalidFlags()
        {
            mLoadArena = false;
            mLoadArmory = false;
            mLoadChars = false;
            mLoadGuilds = false;
            mLoadItemQuantity = false;
            mLoadNpcs = false;
            mLoadRaidSpecific = false;
            mLoadSpells = false;
            mLoadUsers = false;
        }

        private static void OnUpdate()
        {
            short raidDataClock = 0;
            short clock = 0;
            while (true)
            {
                ++raidDataClock;
                try
                {
                    App.RetrieveRaidData(0, 0, false);
                    if (CheckDeadLock()) continue;
                    GetParameters();

                    if (App.mDebug)
                    {
                        Load(ref mLoadSpells, App.GetSpell);
                        Load(ref mLoadNpcs, App.GetNpc);
                        Load(ref mLoadGuilds, App.GetGuild);
                        Load(ref mLoadArmory, App.GetArmoryData);
                        Load(ref mLoadUsers, App.GetUser);
                        Load(ref mLoadChars, App.GetChar);
                        Load(ref mLoadRaidSpecific, App.UpdateRaidSpecificData);
                        Load(ref mLoadItemQuantity, App.UpdateItemQuantity);
                        Load(ref mLoadArena, App.UpdateArenaData);
                        App.loaded = true;
                    }

                    if (clock == 0)
                    {
                        Load(ref mLoadSpells, App.GetSpell);
                        Load(ref mLoadNpcs, App.GetNpc);
                        ++clock;
                    }
                    else if (clock == 1)
                    {
                        Load(ref mLoadGuilds, App.GetGuild);
                        Load(ref mLoadArmory, App.GetArmoryData);
                        ++clock;
                    }
                    else if (clock == 2)
                    {
                        Load(ref mLoadUsers, App.GetUser);
                        Load(ref mLoadChars, App.GetChar);
                        ++clock;
                    }
                    else if (clock == 3)
                    {
                        Load(ref mLoadRaidSpecific, App.UpdateRaidSpecificData);
                        Load(ref mLoadItemQuantity, App.UpdateItemQuantity);
                        ++clock;
                    }
                    else
                    {
                        Load(ref mLoadArena, App.UpdateArenaData);
                        clock = 0;
                        App.loaded = true;
                    }

                    FreeDeadLock();

                    UnloadRaidData(ref raidDataClock);
                }
                catch (InvalidOperationException ex)
                {
                    Console.WriteLine(ex.Message);
                    // Hmm
                    // Maybe close this invalid connection?
                    InvalidFlags();
                    continue;
                }
                catch (ArgumentException ex)
                {
                    Console.WriteLine(ex.Message);
                    // happens in GetArmoryData for some reason!
                    InvalidFlags();
                    continue;
                }
                catch (NullReferenceException ex)
                {
                    Console.WriteLine(ex.Message);
                    Console.WriteLine("Source: " + ex.Source);
                    Console.WriteLine(ex.StackTrace);
                    // ?!
                    InvalidFlags();
                    continue;
                }
                catch (MySqlException ex)
                {
                    Console.WriteLine(ex.Message);
                    // Unable to connect to any of the specified MySQL hosts
                    InvalidFlags();
                    continue;
                }
                catch (FormatException ex)
                {
                    Console.WriteLine(ex.Message);
                    // GetArmoryData causes it when it runs .Read()
                    InvalidFlags();
                    continue;
                }
                catch (NotSupportedException ex)
                {
                    Console.WriteLine(ex.Message);
                    InvalidFlags();
                    continue;
                }
                Thread.Sleep(10000);
            }
        }

        private static void Load<T>(ref bool controller, Func<int, bool, T> func)
        {
            if (controller)
                func(-1, true);
            controller = false;
        }
        private static void Load<T>(ref bool controller, Func<int, int, bool, T> func)
        {
            if (controller)
            {
                for (int i=0; i<2; ++i)
                    func(-1, i, true);
            }
            controller = false;
        }

        private static void SetParamters(short type)
        {
            switch (type)
            {
                case 0:
                    mLoadSpells = true;
                    break;
                case 1:
                    mLoadGuilds = true;
                    break;
                case 2:
                    mLoadChars = true;
                    break;
                case 3:
                    mLoadArmory = true;
                    mLoadArena = true;
                    break;
                case 4:
                    mLoadUsers = true;
                    break;
                case 5:
                    mLoadRaidSpecific = true;
                    break;
                case 6:
                    mLoadItemQuantity = true;
                    break;
                case 7:
                    mLoadNpcs = true;
                    break;
            }
        }

        private static void GetParameters()
        {
            var db = App.GetDB();
            var dr = db.Query("SELECT type FROM gn_cachingcontroller").ExecuteReaderRpll();
            if (!dr.HasRows) return;
            while (dr.Read())
                SetParamters(dr.GetInt16(0));
            dr.CloseRpll();
            dr = db.Query("DELETE FROM gn_cachingcontroller").ExecuteReaderRpll();
            if (dr.HasRows) dr.Read();
            dr.CloseRpll();
        }
        
        public static void RegisterRaidData(int id, int index = 0)
        {
            mRecordedRaidData[index][id] = DateTimeOffset.Now.ToUnixTimeSeconds();
        }

        private static void UnloadRaidData(ref short raidDataClock)
        {
            if (raidDataClock <= 30) return;

            // Creating a deep copy of the Dictionary in order to not interfere with it
            try
            {
                for (int i = 0; i < 2; ++i)
                {
                    Dictionary<int, long> copy = new Dictionary<int, long>();
                    foreach (var data in mRecordedRaidData[i])
                        copy[data.Key] = data.Value;

                    long fiveMinAgo = DateTimeOffset.Now.ToUnixTimeSeconds() - 300;
                    foreach (var data in copy)
                    {
                        if (data.Value >= fiveMinAgo) continue;
                        foreach (var raidkeys in RaidData.m_RaidData[i][data.Key].Select(x => x.Key).ToArray())
                        {
                            RaidData.m_RaidData[i][data.Key][raidkeys].Dispose();
                            RaidData.m_RaidData[i][data.Key][raidkeys] = null;
                            RaidData.m_RaidData[i][data.Key].Remove(raidkeys);
                            //System.Diagnostics.Debug.WriteLine("Deleted: " + data.Key + " => " + raidkeys);
                        }

                        if (RaidData.m_Uploader.ContainsKey(data.Key))
                        {
                            if (RaidData.m_Uploader[data.Key].Count > 0) RaidData.m_Uploader[data.Key].Clear();
                            RaidData.m_Uploader.Remove(data.Key);
                        }

                        RaidData.m_RaidData[i][data.Key] = null;
                        RaidData.m_RaidData[i].Remove(data.Key);
                        mRecordedRaidData[i].Remove(data.Key);
                    }
                }
            }
            catch (InvalidOperationException)
            {
                // Collection was modified; enumeration operation may not execute
            }
            catch (KeyNotFoundException)
            {
                //??
            }
            catch (IndexOutOfRangeException)
            {
                //!?
            }

            GC.Collect();
            GC.WaitForPendingFinalizers();

            raidDataClock = 0;
        }

        public static CachingController Instance { get; } = new CachingController();

        static CachingController()
        {
            for (int i=0; i<2; ++i)
                mRecordedRaidData[i] = new ConcurrentDictionary<int, long>();
        }
        private CachingController()
        {
        }
    }
}