using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Threading;
using System.Web;
using MoreLinq;

namespace RPLL
{
    public struct RS_Attempts
    {
        public int NpcId { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public bool Killed { get; set; }
    }

    public struct RS_Sa_Reference
    {
        public int SourceId { get; set; }
        public int AbilityId { get; set; }
    }

    public struct RS_Sat_Reference
    {
        public int SourceId { get; set; }
        public int TargetId { get; set; }
        public int AbilityId { get; set; }
    }

    public struct RS_Sata_Reference
    {
        public int SourceId { get; set; }
        public int TargetId { get; set; }
        public int AbilityId { get; set; }
        public int TargetAbilityId { get; set; }
    }

    public struct RS_Auras
    {
        public int SaRefId { get; set; }
        public int Gained { get; set; }
        public int Faded { get; set; }
    }

    public struct RS_Deaths
    {
        public int TimeStamp { get; set; }
        public int SourceId { get; set; }
    }

    public struct RS_Dispels
    {
        public int TimeStamp { get; set; }
        public int SataRefId { get; set; }
    }

    public struct RS_Interrupts
    {
        public int TimeStamp { get; set; }
        public int SataRefId { get; set; }
    }

    public struct RS_Damage
    {
        public int TimeStamp { get; set; }
        public int SatRefId { get; set; }
        public int Amount { get; set; }
        public short HitType { get; set; }
        public int[] MitGated { get; set; }
    }

    public struct RS_Healing
    {
        public int TimeStamp { get; set; }
        public int SatRefId { get; set; }
        public int Amount { get; set; }
        public short HitType { get; set; }
        public short Type { get; set; }
    }

    public struct RS_Loot
    {
        public int TargetId { get; set; }
        public int ItemId { get; set; }
        public int AttemptId { get; set; }
    }

    public struct RS_Threat
    {
        public int TimeStamp { get; set; }
        public int SatRefId { get; set; }
        public int Amount { get; set; }
        public short HitType { get; set; }
    }

    public struct RS_Casts
    {
        public int TimeStamp { get; set; }
        public int SatRefId { get; set; }
        public int Amount { get; set; }
    }

    // TODO: Normalization here as well!
    public class RaidData : IDisposable
    {
        public static ConcurrentDictionary<int, ConcurrentDictionary<int, RaidData>>[] m_RaidData = new ConcurrentDictionary<int, ConcurrentDictionary<int, RaidData>>[2];
        public static ConcurrentDictionary<int, List<KeyValuePair<int, int>>> m_Uploader = new ConcurrentDictionary<int, List<KeyValuePair<int, int>>>();
        private SQLWrapper m_DB;
        //private SQLWrapper m_SDB;

        public string m_Instance;
        public DBGuilds m_Guild;
        public DBServer m_Server;
        public long m_Start;
        public long m_End;
        public int m_InstanceId = 0;
        public int m_UploaderId = 0;

        public Dictionary<int, RS_Attempts> m_Attempts = new Dictionary<int, RS_Attempts>();
        public Dictionary<int, RS_Sa_Reference> m_SaReference = new Dictionary<int, RS_Sa_Reference>();
        public Dictionary<int, RS_Sat_Reference> m_SatReference = new Dictionary<int, RS_Sat_Reference>();
        public Dictionary<int, RS_Sata_Reference> m_SataReference = new Dictionary<int, RS_Sata_Reference>();
        public Dictionary<int, RS_Auras> m_Auras = new Dictionary<int, RS_Auras>();
        public Dictionary<int, RS_Deaths> m_Deaths = new Dictionary<int, RS_Deaths>();
        public Dictionary<int, RS_Dispels> m_Dispels = new Dictionary<int, RS_Dispels>();
        public Dictionary<int, RS_Interrupts> m_Interrupts = new Dictionary<int, RS_Interrupts>();
        public Dictionary<int, RS_Damage> m_Damage = new Dictionary<int, RS_Damage>();
        public Dictionary<int, RS_Healing> m_Healing = new Dictionary<int, RS_Healing>();
        public Dictionary<int, RS_Loot> m_Loot = new Dictionary<int, RS_Loot>();
        public List<RS_Threat> m_Threat = new List<RS_Threat>();
        public Dictionary<int, RS_Casts> m_Casts = new Dictionary<int, RS_Casts>();
        public List<DBChars> m_Participants = new List<DBChars>();

        private ConcurrentDictionary<int, RS_Attempts[]> mAtmtCache = new ConcurrentDictionary<int, RS_Attempts[]>();
        public ConcurrentDictionary<ulong, string> mTooltipCache = new ConcurrentDictionary<ulong, string>(); // TODO: Optimize tooltip with json strings instead
        public ConcurrentDictionary<ulong, QueryData[]> mQueryCache = new ConcurrentDictionary<ulong, QueryData[]>();

        public RS_Attempts[] GetFilterAttempts(int expansion, int Category)
        {
            if (mAtmtCache.ContainsKey(Category))
                return mAtmtCache[Category];

            var atmtData = ((Category == 0) ? m_Attempts.Values.Where(y => y.NpcId >= 3) :
                Category == 1 ?
                    m_Attempts.Values.Where(y => y.NpcId > 4).ToArray() :
                    Category == 2 ? m_Attempts.Values.Where(y => y.Killed && y.NpcId > 4).ToArray() :
                    Category == 3 ?
                        m_Attempts.Values.Where(y => y.NpcId == 3) :
                        m_Attempts.Values.Where(y => y.NpcId == Category)).OrderBy(x => x.Start).ToArray();

            mAtmtCache.TryAdd(Category, atmtData);
            return atmtData;
        }

        public string Error = "";

        // Making sure that data is only requested once, in order to reduce the server resource costs
        private static ConcurrentDictionary<ulong, bool> mRequested = new ConcurrentDictionary<ulong, bool>();
        private static bool IsRequeusted(int index, int instanceid, int uploaderid)
        {
            ulong key = Farmhash.Sharp.Farmhash.Hash64(index + "," + instanceid + "," + uploaderid);
            if (!mRequested.ContainsKey(key))
                return false;
            return mRequested[key]; // By default it will create a key that is false!
        }

        private static RaidData GetReuquestedData(int index, int instanceid, int uploaderid)
        {
            int timeout = 0;
            while (IsRequeusted(index, instanceid, uploaderid))
            {
                Thread.Sleep(200);
                timeout += 200;
                if (timeout > 10000)
                    return null;
            }

            CachingController.RegisterRaidData(instanceid, index);
            if (uploaderid > 0)
                return m_RaidData[index][instanceid][uploaderid];
            return m_RaidData[index][instanceid].First().Value;
        }

        private static void RequestData(int index, int instanceid, int uploaderid)
        {
            mRequested.TryAdd(Farmhash.Sharp.Farmhash.Hash64(index + "," + instanceid + "," + uploaderid), true);
            mRequested.TryAdd(Farmhash.Sharp.Farmhash.Hash64(index + "," + instanceid + ",0"), true);
        }

        private static void FinishRequestData(int index, int instanceid, int uploaderid)
        {
            string key = index + "," + instanceid;
            mRequested[Farmhash.Sharp.Farmhash.Hash64(index + "," + instanceid + "," + uploaderid)] = false;
            mRequested[Farmhash.Sharp.Farmhash.Hash64(index + "," + instanceid + ",0")] = false;
        }

        // free resources
        public void Dispose()
        {
            m_Attempts.Clear();
            //foreach (var key in m_Attempts.Select(x => x.Key).ToArray()) m_Attempts[key] = null;
            m_Attempts = null;
            m_SaReference.Clear();
            //foreach (var key in m_SaReference.Select(x => x.Key).ToArray()) m_SaReference[key] = null;
            m_SaReference = null;
            m_SatReference.Clear();
            //foreach (var key in m_SatReference.Select(x => x.Key).ToArray()) m_SatReference[key] = null;
            m_SatReference = null;
            m_SataReference.Clear();
            //foreach (var key in m_SataReference.Select(x => x.Key).ToArray()) m_SataReference[key] = null;
            m_SataReference = null;
            m_Auras.Clear();
            //foreach (var key in m_Auras.Select(x => x.Key).ToArray()) m_Auras[key] = null;
            m_Auras = null;
            m_Deaths.Clear();
            //foreach (var key in m_Deaths.Select(x => x.Key).ToArray()) m_Deaths[key] = null;
            m_Deaths = null;
            m_Dispels.Clear();
            //foreach (var key in m_Dispels.Select(x => x.Key).ToArray()) m_Dispels[key] = null;
            m_Dispels = null;
            m_Interrupts.Clear();
            //foreach (var key in m_Interrupts.Select(x => x.Key).ToArray()) m_Interrupts[key] = null;
            m_Interrupts = null;
            m_Damage.Clear();
            //foreach (var key in m_Damage.Select(x => x.Key).ToArray()) m_Damage[key] = null;
            m_Damage = null;
            m_Healing.Clear();
            //foreach (var key in m_Healing.Select(x => x.Key).ToArray()) m_Healing[key] = null;
            m_Healing = null;
            m_Loot.Clear();
            //foreach (var key in m_Loot.Select(x => x.Key).ToArray()) m_Loot[key] = null;
            m_Loot = null;
            m_Threat.Clear();
            //foreach (var key in m_Threat.Select(x => x.Key).ToArray()) m_Threat[key] = null;
            m_Threat = null;
            m_Casts.Clear();
            //foreach (var key in m_Casts.Select(x => x.Key).ToArray()) m_Casts[key] = null;
            m_Casts = null;
            m_Participants.Clear();
            m_Participants = null;
            foreach (var key in mAtmtCache.Select(x => x.Key).ToArray())
            {
                mAtmtCache[key] = null;
                //for (int i = 0; i < mAtmtCache[key].Length; ++i) mAtmtCache[key][i] = null;
            }
            mTooltipCache.Clear();
            mTooltipCache = null;
            mQueryCache.Clear();
            mQueryCache = null;
            mAtmtCache = null;
            m_Instance = null;
            m_DB = null;
            m_Guild = null;
            m_Server = null;
        }

        ~RaidData()
        {
        }

        static RaidData()
        {
            for (int i=0; i<2; ++i)
                m_RaidData[i] = new ConcurrentDictionary<int, ConcurrentDictionary<int, RaidData>>();
        }
        private RaidData() { }
        private RaidData(int _InstanceID, int _GuildID, long _Start, long _End, string _LookUpSpace, int _Id, int _Uploader, int _Index = 0)
        {
            RequestData(_Index, _Id, _Uploader);
            m_InstanceId = _Id;
            m_UploaderId = _Uploader;
            m_DB = App.GetDB(_Index + 1);
             
            string[] Tokens = _LookUpSpace.Split('&');

            m_Instance = App.m_Instances[_InstanceID].Name;
            m_Guild = App.GetGuild(_GuildID); 
            m_Server = App.m_Server[m_Guild.ServerID];
            m_Start = _Start;
            m_End = _End;
            
            string[] Offset = Tokens[0].Split(',');
            try
            {
                MySqlDataReader dr = m_DB
                    .Query("SELECT id, npcid, start, end, killed FROM rs_attempts WHERE id>=" + Offset[0] +
                           " AND id<" + Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_Attempts[dr.GetInt32(0)] = new RS_Attempts()
                    {
                        NpcId = dr.GetInt32(1),
                        Start = dr.GetInt32(2),
                        End = dr.GetInt32(3),
                        Killed = dr.GetInt16(4) == 1
                    };
                }
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "Attempts: " + ex.Message + "<br /><br />";
            }

            // TODO: Optimize these
            try
            {
                if (!m_Uploader.ContainsKey(_Id))
                    m_Uploader[_Id] = new List<KeyValuePair<int, int>>();

                MySqlDataReader dr = m_DB.Query("SELECT a.id, b.userid FROM rs_instance_uploader a LEFT JOIN gn_uploader b ON a.uploaderid = b.id WHERE a.instanceid=" + _Id).ExecuteReaderRpll();
                while (dr.Read())
                {
                    var kvp = new KeyValuePair<int, int>(dr.GetInt32(0), dr.GetInt32(1));
                    if (!m_Uploader[_Id].Contains(kvp))
                        m_Uploader[_Id].Add(kvp);
                }

                dr.CloseRpll();

                dr = m_DB.Query("SELECT charid FROM rs_participants WHERE uploaderid=" + _Uploader).ExecuteReaderRpll();
                while (!dr.IsClosed && dr.Read())
                    m_Participants.Add(App.GetChar(dr.GetInt32(0)));
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_instance_uploader: " + ex.Message + "<br /><br />";
            }

            try
            {
                Offset = Tokens[1].Split(',');
                m_SaReference[0] = new RS_Sa_Reference()
                {
                    SourceId = 0,
                    AbilityId = 0
                };
                MySqlDataReader dr = m_DB.Query("SELECT id, sourceid, abilityid FROM rs_sa_reference WHERE id>=" + Offset[0] + " AND id<" + Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_SaReference[dr.GetInt32(0)] = new RS_Sa_Reference()
                    {
                        SourceId = dr.GetInt32(1),
                        AbilityId = dr.GetInt32(2)
                    };
                }
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "RS_sa_reference: " + ex.Message + "<br /><br />";
            }
        
            try
            {
                Offset = Tokens[2].Split(',');
                m_SatReference[0] = new RS_Sat_Reference()
                {
                    SourceId = 0,
                    AbilityId = 0,
                    TargetId = 0
                };
                MySqlDataReader dr = m_DB.Query("SELECT id, targetid, said FROM rs_sat_reference WHERE id>=" + Offset[0] + " AND id<" + Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_SatReference[dr.GetInt32(0)] = new RS_Sat_Reference()
                    {
                        TargetId = dr.GetInt32(1),
                        AbilityId = m_SaReference[dr.GetInt32(2)].AbilityId,
                        SourceId = m_SaReference[dr.GetInt32(2)].SourceId,
                    };
                }
                dr.CloseRpll();

            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_sat_reference: " + ex.Message + "<br /><br />";
            }

            try
            {
                Offset = Tokens[3].Split(',');
                m_SataReference[0] = new RS_Sata_Reference()
                {
                    SourceId = 0,
                    AbilityId = 0,
                    TargetId = 0,
                    TargetAbilityId = 0
                };
                MySqlDataReader dr = m_DB.Query("SELECT id, targetabilityid, satid FROM rs_sata_reference WHERE id>=" + Offset[0] + " AND id<" + Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_SataReference[dr.GetInt32(0)] = new RS_Sata_Reference()
                    {
                        TargetAbilityId = dr.GetInt32(1),
                        AbilityId = m_SatReference[dr.GetInt32(2)].AbilityId,
                        SourceId = m_SatReference[dr.GetInt32(2)].SourceId,
                        TargetId = m_SatReference[dr.GetInt32(2)].TargetId
                    };
                }
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_sata_reference: " + ex.Message + "<br /><br />";
            }

            try
            {
                Offset = Tokens[4].Split(',');
                MySqlDataReader dr = m_DB.Query("SELECT id, said, gained, faded FROM rs_auras WHERE id>=" + Offset[0] + " AND id<" + Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_Auras[dr.GetInt32(0)] = new RS_Auras()
                    {
                        SaRefId = dr.GetInt32(1),
                        Gained = dr.GetInt32(2),
                        Faded = dr.GetInt32(3)
                    };
                }
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_auras: " + ex.Message + "<br /><br />";
            }

            try
            {
                Offset = Tokens[5].Split(',');
                MySqlDataReader dr = m_DB.Query("SELECT id, sourceid, timestamp FROM rs_deaths WHERE id>=" + Offset[0] + " AND id<" +
                                Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_Deaths[dr.GetInt32(0)] = new RS_Deaths()
                    {
                        SourceId = dr.GetInt32(1),
                        TimeStamp = dr.GetInt32(2)
                    };
                }
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_deaths: " + ex.Message + "<br /><br />";
            }

            try
            {
                Offset = Tokens[6].Split(',');
                MySqlDataReader dr = m_DB.Query("SELECT id, sataid, timestamp FROM rs_dispels WHERE id>=" + Offset[0] + " AND id<" + Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_Dispels[dr.GetInt32(0)] = new RS_Dispels()
                    {
                        SataRefId = dr.GetInt32(1),
                        TimeStamp = dr.GetInt32(2)
                    };
                }
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_dispels: " + ex.Message + "<br /><br />";
            }

            try
            {
                Offset = Tokens[7].Split(',');
                MySqlDataReader dr = m_DB.Query("SELECT id, sataid, timestamp FROM rs_interrupts WHERE id>=" + Offset[0] + " AND id<" + Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_Interrupts[dr.GetInt32(0)] = new RS_Interrupts()
                    {
                        SataRefId = dr.GetInt32(1),
                        TimeStamp = dr.GetInt32(2)
                    };
                }
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_interrupts: " + ex.Message + "<br /><br />";
            }

            try{
                Offset = Tokens[8].Split(','); 
                if (Tokens.Length >= 14)
                {
                    MySqlDataReader dr = m_DB
                        .Query("SELECT a.id, a.satid, a.hittype, a.timestamp, a.amount, IFNULL(b.amount,0) FROM rs_damage a LEFT JOIN rs_damage_threat b ON a.id = b.dmgid WHERE a.id>=" + Offset[0] +
                               " AND a.id<" + Offset[1]).ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        m_Damage[dr.GetInt32(0)] = new RS_Damage()
                        {
                            SatRefId = dr.GetInt32(1),
                            HitType = dr.GetInt16(2),
                            TimeStamp = dr.GetInt32(3),
                            Amount = dr.GetInt32(4),
                            MitGated = new int[3]
                        };
                        m_Threat.Add(new RS_Threat()
                        {
                            SatRefId = dr.GetInt32(1),
                            HitType = dr.GetInt16(2),
                            TimeStamp = dr.GetInt32(3),
                            Amount = dr.GetInt32(5),
                        });
                    }

                    dr.CloseRpll();
                }
                else
                {
                    MySqlDataReader dr = m_DB
                        .Query("SELECT id, satid, hittype, timestamp, amount FROM rs_damage WHERE id>=" + Offset[0] +
                               " AND id<" + Offset[1]).ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        m_Damage[dr.GetInt32(0)] = new RS_Damage()
                        {
                            SatRefId = dr.GetInt32(1),
                            HitType = dr.GetInt16(2),
                            TimeStamp = dr.GetInt32(3),
                            Amount = dr.GetInt32(4),
                            MitGated = new int[3]
                        };
                    }

                    dr.CloseRpll();
                }

                if (_Index >= 1)
                {
                    MySqlDataReader dr = m_DB.Query("SELECT dmgid, type, amount FROM rs_damage_mitgated WHERE dmgid>=" + Offset[0] +
                                    " AND dmgid<" + Offset[1]).ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        m_Damage[dr.GetInt32(0)].MitGated[dr.GetInt32(1)] = dr.GetInt32(2);
                    }
                    dr.CloseRpll();
                }
                else
                {
                    MySqlDataReader dr = m_DB.Query("SELECT dmgid, amount FROM rs_damage_mitgated WHERE dmgid>=" + Offset[0] +
                                    " AND dmgid<" + Offset[1]).ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        m_Damage[dr.GetInt32(0)].MitGated[0] = dr.GetInt32(1);
                    }
                    dr.CloseRpll();
                }
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_damage: " + ex.Message + "<br /><br />";
            }

            try
            {
                if (Tokens.Length < 14)
                {
                    Offset = Tokens[9].Split(',');
                    MySqlDataReader dr = m_DB
                        .Query("SELECT id, satid, hittype, timestamp, amount FROM rs_healing WHERE id>=" + Offset[0] +
                               " AND id<" + Offset[1]).ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        m_Healing[dr.GetInt32(0)] = new RS_Healing()
                        {
                            SatRefId = dr.GetInt32(1),
                            HitType = dr.GetInt16(2),
                            TimeStamp = dr.GetInt32(3),
                            Amount = dr.GetInt32(4)
                        };
                    }

                    dr.CloseRpll();
                }
                else
                {
                    Offset = Tokens[9].Split(',');
                    MySqlDataReader dr = m_DB
                        .Query("SELECT a.id, a.satid, a.hittype, a.timestamp, a.amount, IFNULL(b.amount, 0) FROM rs_healing a LEFT JOIN rs_healing_threat b ON a.id = b.healid WHERE a.id>=" + Offset[0] +
                               " AND a.id<" + Offset[1]).ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        m_Healing[dr.GetInt32(0)] = new RS_Healing()
                        {
                            SatRefId = dr.GetInt32(1),
                            HitType = dr.GetInt16(2),
                            TimeStamp = dr.GetInt32(3),
                            Amount = dr.GetInt32(4)
                        };
                        if (dr.GetInt32(5) > 0)
                        {
                            m_Threat.Add(new RS_Threat()
                            {
                                SatRefId = dr.GetInt32(1),
                                HitType = (short) (60 + dr.GetInt16(2)),
                                TimeStamp = dr.GetInt32(3),
                                Amount = dr.GetInt32(5),
                            });
                        }
                    }

                    dr.CloseRpll();
                }
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_healing: " + ex.Message + "<br /><br />";
            }

            try
            {
                Offset = Tokens[10].Split(',');
                MySqlDataReader dr = m_DB.Query("SELECT id, targetid, itemid, attemptid FROM rs_loot WHERE id>=" + Offset[0] + " AND id<" + Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_Loot[dr.GetInt32(0)] = new RS_Loot()
                    {
                        TargetId = dr.GetInt32(1),
                        ItemId = dr.GetInt32(2),
                        AttemptId = dr.GetInt32(3)
                    };
                }
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_loot: " + ex.Message + "<br /><br />";
            }

            if (Tokens.Length >= 14)
            {
                try
                {
                    Offset = Tokens[13].Split(',');
                    MySqlDataReader dr = m_DB
                        .Query("SELECT said, amount, timestamp FROM rs_gained_threat WHERE id>=" + Offset[0] +
                               " AND id<" + Offset[1]).ExecuteReaderRpll();
                    int maxSatRef = m_SatReference.Max(x => x.Key) + 1;
                    Dictionary<int, int> keyMapper = new Dictionary<int, int>();
                    while (dr.Read())
                    {
                        // Creating custom satrefids to make integration easier
                        // Source == Target
                        int saId = dr.GetInt32(0);
                        if (!keyMapper.ContainsKey(saId))
                        {
                            m_SatReference[maxSatRef] = new RS_Sat_Reference()
                            {
                                SourceId = m_SaReference[saId].SourceId,
                                AbilityId = m_SaReference[saId].AbilityId,
                                TargetId = m_SaReference[saId].SourceId
                            };
                            keyMapper[saId] = maxSatRef;
                            ++maxSatRef;
                        }

                        m_Threat.Add(new RS_Threat()
                        {
                            SatRefId = keyMapper[saId],
                            Amount = dr.GetInt32(1),
                            TimeStamp = dr.GetInt32(2),
                            HitType = 20,
                        });
                    }

                    dr.CloseRpll();
                }
                catch (KeyNotFoundException ex)
                {
                    Error += "rs_threat: " + ex.Message + "<br /><br />";
                }
            }

            try
            {
                Offset = Tokens[11].Split(',');
                MySqlDataReader dr = m_DB
                    .Query("SELECT id, satid, timestamp FROM rs_casts WHERE id>=" + Offset[0] +
                           " AND id<" + Offset[1]).ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_Casts[dr.GetInt32(0)] = new RS_Casts()
                    {
                        SatRefId = dr.GetInt32(1),
                        TimeStamp = dr.GetInt32(2),
                        Amount = 1
                    };
                }
                dr.CloseRpll();
            }
            catch (KeyNotFoundException ex)
            {
                Error += "rs_casts: " + ex.Message + "<br /><br />";
            }

            // Sorting the crap for good measure
            m_Attempts = m_Attempts.OrderBy(x => x.Value.Start).ToDictionary();
            m_Auras = m_Auras.OrderBy(x => x.Value.Gained).ToDictionary();
            m_Deaths = m_Deaths.OrderBy(x => x.Value.TimeStamp).ToDictionary();
            m_Dispels = m_Dispels.OrderBy(x => x.Value.TimeStamp).ToDictionary();
            m_Interrupts = m_Interrupts.OrderBy(x => x.Value.TimeStamp).ToDictionary();
            m_Damage = m_Damage.OrderBy(x => x.Value.TimeStamp).ToDictionary();
            m_Healing = m_Healing.OrderBy(x => x.Value.TimeStamp).ToDictionary();
            m_Casts = m_Casts.OrderBy(x => x.Value.TimeStamp).ToDictionary();
            m_Threat = m_Threat.OrderBy(x => x.TimeStamp).ToList();

            // TODO: Boss yells

            FinishRequestData(_Index, _Id, _Uploader); 
        }
        
        public static RaidData GetRaidData(int _RSInstanceID, int _RSUploaderID = 0, bool _PostVanilla = false)
        {
            var index = _PostVanilla ? 1 : 0;

            if (IsRequeusted(index, _RSInstanceID, _RSUploaderID))
            {
                var data = GetReuquestedData(index, _RSInstanceID, _RSUploaderID);
                if (data != null) // To integrate the timeout
                    return data;
            }

            var tempDB = App.GetDB(index+1);
            if (m_RaidData[index].ContainsKey(_RSInstanceID))
            {
                if (m_RaidData[index][_RSInstanceID].ContainsKey(_RSUploaderID))
                {
                    CachingController.RegisterRaidData(_RSInstanceID, index);
                    return m_RaidData[index][_RSInstanceID][_RSUploaderID];
                }
                
                if (_RSUploaderID > 0)
                {
                    MySqlDataReader dr = tempDB.Query("SELECT a.instanceid, a.guildid, a.start, a.end, b.lookupspace, a.id FROM rs_instances a LEFT JOIN rs_instance_uploader b ON a.id = b.instanceid WHERE b.id=" + _RSUploaderID).ExecuteReaderRpll();
                    if (dr.Read())
                    {
                        m_RaidData[index][_RSInstanceID][_RSUploaderID] = new RaidData(dr.GetInt32(0), dr.GetInt32(1), dr.GetInt64(2), dr.GetInt64(3), dr.GetString(4), dr.GetInt32(5), _RSUploaderID, index);
                        dr.CloseRpll();
                        CachingController.RegisterRaidData(_RSInstanceID, index);
                        return m_RaidData[index][_RSInstanceID][_RSUploaderID];
                    }
                    dr.CloseRpll();
                }
                
                CachingController.RegisterRaidData(_RSInstanceID, index);

                // Take the first non private log
                var LogInfo = App.mRSInstances[index].Where(x => x.mId == _RSInstanceID).First();
                if (LogInfo != null)
                {
                    var sth = m_Uploader[_RSInstanceID]
                        .Where(x => LogInfo.mPrivate.Where(y => !y.Value && y.Key == x.Key).Count() >= 1).ToArray();
                    if (sth.Length > 0)
                    {
                        if (m_RaidData[index][_RSInstanceID].ContainsKey(sth[0].Key))
                            return m_RaidData[index][_RSInstanceID][sth[0].Key];
                    }
                }

                try { HttpContext.Current.Response.Redirect("/Private/", false); HttpContext.Current.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
                return null;
            }
            MySqlDataReader drr = tempDB.Query("SELECT b.id, a.instanceid, a.guildid, a.start, a.end, b.lookupspace, a.id FROM rs_instances a LEFT JOIN rs_instance_uploader b ON a.id = b.instanceid WHERE a.id=" + _RSInstanceID).ExecuteReaderRpll();
            ConcurrentDictionary<int, RaidData> newData = new ConcurrentDictionary<int, RaidData>();

            var LogInfo2 = App.mRSInstances[index].Where(x => x.mId == _RSInstanceID).First();
            while (!drr.IsClosed && drr.Read()) // ?!
            {
                if (LogInfo2 != null)
                {
                    if (LogInfo2.mPrivate.Where(y => y.Value && y.Key == drr.GetInt32(0)).Count() >= 1) continue;
                }

                newData[drr.GetInt32(0)] = new RaidData(drr.GetInt32(1), drr.GetInt32(2), drr.GetInt64(3), drr.GetInt64(4), drr.GetString(5), drr.GetInt32(6), drr.GetInt32(0), index);
                break; // Just load first one!
            }
            drr.CloseRpll();
            m_RaidData[index][_RSInstanceID] = newData;
            CachingController.RegisterRaidData(_RSInstanceID, index);

            // Take the first non private log
            if (LogInfo2 != null)
            {
                var sth2 = m_Uploader[_RSInstanceID]
                    .Where(x => LogInfo2.mPrivate.Where(y => !y.Value && y.Key == x.Key).Count() >= 1).ToArray();
                if (sth2.Length > 0)
                {
                    if (m_RaidData[index][_RSInstanceID].ContainsKey(sth2[0].Key))
                        return m_RaidData[index][_RSInstanceID][sth2[0].Key];
                }
            }

            try { HttpContext.Current.Response.Redirect("/Private/", false); HttpContext.Current.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return null;
        }
    }
}