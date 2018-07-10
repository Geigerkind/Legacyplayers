using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
////using System.Data.Odbc;
using MySql.Data.MySqlClient;

namespace RPLL
{
    // Char Designer
    public struct ItemSlot
    {
        public int ItemId { get; set; }
        public short EnchId { get; set; }
        public short GemId1 { get; set; }
        public short GemId2 { get; set; }
        public short GemId3 { get; set; }

        public string Icon
        {
            get
            {
                if (ItemId <= 0)
                    return "";
                return App.m_Items[0][ItemId].IconName;
            }
        }

        public DBItems Item(int exp)
        {
            if (ItemId <= 0)
                return App.m_Items[0][0];
            return App.m_Items[exp][ItemId];
        }

        public string Serialize()
        {
            return ItemId + ";" + EnchId + ";" + GemId1 + ";" + GemId2 + ";" + GemId3;
        }

        // Note gem represents the ench id!
        // 8 => Blue
        // 4 => Yellow
        // 2 => Red
        // 1 => Meta
        // Flags are just sums of them
        public bool GemMeetsSocket(short gem = 0, short expectedColor = 0, int expansion = 1)
        {
            if (expectedColor == 0)
                return true;
            if (gem == 0)
                return false;
            var flag = App.m_GemProperties[expansion - 1][gem].Flag;
            bool blue = false;
            bool yellow = false;
            bool red = false;
            bool meta = false;
            if (flag >= 8)
            {
                flag -= 8;
                blue = true;
            }

            if (flag >= 4)
            {
                flag -= 4;
                yellow = true;
            }

            if (flag >= 2)
            {
                flag -= 2;
                red = true;
            }

            if (flag >= 1)
            {
                flag -= 1;
                meta = true;
            }

            if (expectedColor == 8 && blue)
                return true;
            if (expectedColor == 4 && yellow)
                return true;
            if (expectedColor == 2 && red)
                return true;
            if (expectedColor == 1 && meta)
                return true;
            return false;
        }

        // Note we are not checking if the meta has all requirements!
        public bool HasSocketBonus(int expansion = 1)
        {
            if (expansion == 0)
                return false;
            short gem1 = GemId1;
            short gem2 = GemId2;
            short gem3 = GemId3;
            if (gem1 == 0 && gem2 == 0 && gem3 == 0)
                return false;

            return GemMeetsSocket(gem1, Item(expansion).Socket1, expansion) &&
                   GemMeetsSocket(gem2, Item(expansion).Socket2, expansion) &&
                   GemMeetsSocket(gem3, Item(expansion).Socket3, expansion);
        }

        // TODO: gem4 ?
        // TODO: ^- Extra sockets? Smithing and this waist thingy
        public short GetSocketBonus(int expansion = 1)
        {
            if (HasSocketBonus(expansion))
            {
                return Item(expansion).SocketBonus;
            }

            return 0;
        }
    };


    public class DBSpells
    {
        public short Type { get; set; }
        public string Name { get; set; }
        public short Icon { get; set; }
        public short Category { get; set; }
        public short SpellCategory { get; set; }
        public short Sourceid { get; set; }
        public int Id { get; set; }
    }

    public class DBNPCS
    {
        public int ID { get; set; }
        public short Type { get; set; }
        public string Name { get; set; }
        public short Family { get; set; }
        public short Class { get; set; }
        public short Liking { get; set; }
    }

    public struct DB_Item_Dmg
    {
        public int Min { get; set; }
        public int Max { get; set; }
        public short Type { get; set; }
    }

    // Temporary
    public class DB_ItemSets
    {
        public string Name { get; set; }
        public string SetNames { get; set; }
        public string SetIds { get; set; }
        public string SetEffectIds { get; set; }
        public string SetEffectNames { get; set; }
    }
    public class DBItems
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public short Icon { get; set; }
        public string IconName
        {
            get => App.m_Icons[Icon];
            set => App.m_Icons[Icon] = value;
        }

        public short Quality
        {
            get;
            set;
        }

        public ConcurrentDictionary<short, int> QuantityData { get; set; }

        public int Quantity(short serverid = 0)
        {
            if (!QuantityData.ContainsKey(serverid))
                QuantityData[serverid] = 0;

            return QuantityData[serverid];
        }

        public KeyValuePair<int, int>[] Stats = new KeyValuePair<int, int>[10];
        public int Armor { get; set; }

        public short InventoryType { get; set; }
        public short Class { get; set; }
        public short SubClass { get; set; }
        public short RequiredLevel { get; set; }
        public short Bonding { get; set; }
        public short Sheath { get; set; }
        public short ItemSetId { get; set; }

        public DB_ItemSets ItemSet
        {
            get => App.m_ItemSets[ItemSetId];
            set => App.m_ItemSets[ItemSetId] = value;
        }
        public short MaxDurability { get; set; }
        public short ItemLevel { get; set; }
        public DB_Item_Dmg[] Dmg = new DB_Item_Dmg[3];
        public short Delay { get; set; }
        public string ExtraTooltip { get; set; }

        public short Socket1 { get; set; }
        public short Socket2 { get; set; }
        public short Socket3 { get; set; }
        public short SocketBonus { get; set; }
    }

    public class DBGuilds
    {
        public int ID { get; set; }
        public short ServerID { get; set; }
        public short Faction { get; set; }
        public string Name { get; set; }

        public int MemberCount
        {
            get => App.m_Chars.Values.Count(x => x.RefGuild.GuildID == ID);
        }
    }

    public class DBServer
    {
        public short ServerId { get; set; }
        public short Expansion { get; set; }
        public string Name { get; set; }
        public short Type { get; set; }
        public short Season { get; set; }
        public short PvPReset { get; set; }
        public short PvEReset { get; set; }
    }

    public class DBChars
    {
        public int OwnerId { get; set; }
        public short ServerID { get; set; }
        public short Faction { get; set; }
        public int LatestUpdate { get; set; }
        public string Name { get; set; }
        public int CharId { get; set; }
        public short LifeTimeRank { get; set; }
        public uint LifeTimeRankAchieved { get; set; }
        public short Prof1 { get; set; }
        public short Prof2 { get; set; }

        public int Expansion()
        {
            if (ServerID <= 0 || ServerID >= App.m_Server.Length)
                return 0;
            return App.m_Server[ServerID].Expansion;
        }
        public DB_am_ref_misc RefMisc
        {
            get
            {
                int exp = Expansion();
                var amData = App.GetArmoryData(LatestUpdate, exp);
                if (exp >= 2) // Not supported yet
                    return App.m_RefMisc[0][0];
                if (amData == null)
                    return App.m_RefMisc[exp][0];
                if (App.m_RefMisc[exp].ContainsKey(amData.Ref_Misc))
                    return App.m_RefMisc[exp][amData.Ref_Misc];
                return App.m_RefMisc[exp][0];

                //return App.m_RefMisc[Expansion()][App.GetArmoryData(LatestUpdate, Expansion()).Ref_Misc];
            }
            set => App.m_RefMisc[Expansion()][App.GetArmoryData(LatestUpdate, Expansion()).Ref_Misc] = value;
        }

        public DB_am_ref_guild RefGuild
        {
            get
            {
                int exp = Expansion();
                var refGuild = App.GetArmoryData(LatestUpdate, exp);
                if (refGuild == null || exp >= 2)
                    return App.m_RefGuild[exp][0];
                return App.m_RefGuild[exp][refGuild.Ref_Guild];
            }
            set => App.m_RefGuild[Expansion()][App.GetArmoryData(LatestUpdate, Expansion()).Ref_Guild] = value;
        }

        public DB_am_ref_honor RefHonor
        {
            get
            {
                var amData = App.GetArmoryData(LatestUpdate, Expansion());
                var exp = Expansion();
                if (exp >= 2) // Not supported yet
                    return App.m_RefHonor[0][0];
                if (amData == null)
                    return App.m_RefHonor[exp][0];
                if (App.m_RefGear[exp].ContainsKey(amData.Ref_Honor))
                    return App.m_RefHonor[exp][amData.Ref_Honor];
                return App.m_RefHonor[exp][0];
            }
            set => App.m_RefHonor[Expansion()][App.GetArmoryData(LatestUpdate, Expansion()).Ref_Honor] = value;
        }
        public DB_am_ref_gear RefGear
        {
            get
            {
                var amData = App.GetArmoryData(LatestUpdate, Expansion());
                var exp = Expansion();
                if (exp >= 2) // Not supported yet
                    return App.m_RefGear[0][0];
                if (amData == null)
                    return App.m_RefGear[exp][0];
                if (App.m_RefGear[exp].ContainsKey(amData.Ref_Gear))
                    return App.m_RefGear[exp][amData.Ref_Gear];
                return App.m_RefGear[exp][0];
            }
            set => App.m_RefGear[Expansion()][App.GetArmoryData(LatestUpdate, Expansion()).Ref_Gear] = value;
        }

        public DB_am_ref_arena RefArena
        {
            get
            {
                if (Expansion() == 0)
                    return App.m_RefArena[0][0];
                return App.m_RefArena[Expansion() - 1][App.GetArmoryData(LatestUpdate, Expansion()).Ref_Arena];
            }
            set => App.m_RefArena[Expansion()-1][App.GetArmoryData(LatestUpdate, Expansion()).Ref_Arena] = value;
        }

        public long Seen
        {
            get => App.GetArmoryData(LatestUpdate).Uploaded;
            set => App.GetArmoryData(LatestUpdate).Uploaded = value;
        }
        
    }

    public class DB_am_data
    {
        public int CharID { get; set; }
        public long Uploaded { get; set; }
        public int Ref_Misc { get; set; }
        public int Ref_Guild { get; set; }
        public int Ref_Honor { get; set; }
        public int Ref_Arena { get; set; }
        public int Ref_Gear { get; set; }
    }

    public class DB_am_ref_misc
    {
        public short Level { get; set; }
        public short Gender { get; set; }
        public short Race { get; set; }
        public short Class { get; set; }
        public string Talents { get; set; }
    }

    public class DB_am_ref_guild
    {
        public int GuildID { get; set; }
        public short GrankIndex { get; set; }
        public string GrankName { get; set; }
    }

    public class DB_am_ref_honor
    {
        public short Rank { get; set; }
        public int Progress { get; set; }
        public int HK { get; set; }
        public int DK { get; set; }
        public int Honor { get; set; }
        public int Standing { get; set; }
    }

    public class DB_item_gemproperties
    {
        public short GemId { get; set; }
        public short Flag { get; set; }
        public short EnchId { get; set; }
        public int Entry { get; set; }
    }

    public class DB_am_ref_gear_slot_gems
    {
        public short Gem1 { get; set; }
        public short Gem2 { get; set; }
        public short Gem3 { get; set; }
        public short Gem4 { get; set; }
    }

    public class DB_am_ref_gear_slot
    {
        public int ItemID { get; set; }
        public DBItems Item(int expansion = 0)
        {
            return (App.m_Items[expansion].ContainsKey(ItemID)) ? App.m_Items[expansion][ItemID] : App.m_Items[expansion][0];
        }

        // Note gem represents the ench id!
        // 8 => Blue
        // 4 => Yellow
        // 2 => Red
        // 1 => Meta
        // Flags are just sums of them
        public bool GemMeetsSocket(short gem = 0, short expectedColor = 0, int expansion = 1)
        {
            if (expectedColor == 0)
                return true;
            if (gem == 0)
                return false;
            var flag = App.m_GemProperties[expansion - 1][gem].Flag;
            bool blue = false;
            bool yellow = false;
            bool red = false;
            bool meta = false;
            if (flag >= 8)
            {
                flag -= 8;
                blue = true;
            }
            if (flag >= 4)
            {
                flag -= 4;
                yellow = true;
            }
            if (flag >= 2)
            {
                flag -= 2;
                red = true;
            }
            if (flag >= 1)
            {
                flag -= 1;
                meta = true;
            }

            if (expectedColor == 8 && blue)
                return true;
            if (expectedColor == 4 && yellow)
                return true;
            if (expectedColor == 2 && red)
                return true;
            if (expectedColor == 1 && meta)
                return true;
            return false;
        }

        // Note we are not checking if the meta has all requirements!
        public bool HasSocketBonus(int expansion = 1)
        {
            if (expansion == 0)
                return false;
            short gem1 = App.m_RefGearSlotGems[expansion - 1][GemId].Gem1;
            short gem2 = App.m_RefGearSlotGems[expansion - 1][GemId].Gem2;
            short gem3 = App.m_RefGearSlotGems[expansion - 1][GemId].Gem3;
            if (gem1 == 0 && gem2 == 0 && gem3 == 0)
                return false;
            
            return GemMeetsSocket(gem1, Item(expansion).Socket1, expansion) && GemMeetsSocket(gem2, Item(expansion).Socket2, expansion) &&
                   GemMeetsSocket(gem3, Item(expansion).Socket3, expansion);
        }

        // TODO: gem4 ?
        // TODO: ^- Extra sockets? Smithing and this waist thingy
        public short GetSocketBonus(int expansion = 1)
        {
            if (HasSocketBonus(expansion))
            {
                return Item(expansion).SocketBonus;
            }
            return 0;
        }

        public int EnchID { get; set; }
        public int GenEnchID { get; set; }
        public int GemId { get; set; }
    }

    public class DB_enchantmentstats
    {
        public string Name { get; set; }
        public KeyValuePair<int, int>[] Stats = new KeyValuePair<int, int>[3];
    }
    

    enum StatType
    {
        HolyRes,
        FireRes,
        NatureRes,
        FrostRes,
        ShadowRes,
        ArcaneRes,
        Hit,
        Crit,
        AttackPower,
        Dodge,
        Parry,
        Block,
        SpellPower,
        HealPower,
        SpellHoly,
        SpellFrost,
        SpellNature,
        SpellFire,
        SpellArcane,
        SpellShadow,
        ManaRegen,
        Defense,
        SpellHit,
        SpellCrit,
        RangedAttackPower,
        BlockChance,
        Strength,
        Agillity,
        Stamina,
        Intellect,
        Spirit,
        Mana,
        Health,
        Armor,
        PrismaticRes,
        AllStats, // Should be divided into strength etc I guess :/
        Haste,
        Expertise,
        Resilience,
        SpellPen,
        ArmorPen,
        SpellHaste
    }
    public class DB_am_ref_gear
    {
        public int GearId { get; set; }
        public DB_am_ref_gear_slot[] Slots = new DB_am_ref_gear_slot[19];

        public int GetStatByType(int type, int expansion = 0)
        {
            return Slots.Sum(x => x.Item(expansion).Stats.Where(y => y.Key == type).Sum(y => y.Value) +
            App.m_EnchantmentStats[expansion][x.EnchID].Stats.Where(y => y.Key == type).Sum(y => y.Value) +
            (App.m_EnchantmentStats[expansion].ContainsKey(x.GenEnchID) ? App.m_EnchantmentStats[expansion][x.GenEnchID].Stats.Where(y => y.Key == type).Sum(y => y.Value) : 0) + // Cause this can be weird ?
            (x.GemId > 0 ?
                App.m_EnchantmentStats[expansion][App.m_GemProperties[expansion - 1][App.m_RefGearSlotGems[expansion - 1][x.GemId].Gem1].EnchId].Stats.Where(y => y.Key == type).Sum(y => y.Value) +
                App.m_EnchantmentStats[expansion][App.m_GemProperties[expansion - 1][App.m_RefGearSlotGems[expansion - 1][x.GemId].Gem2].EnchId].Stats.Where(y => y.Key == type).Sum(y => y.Value) +
                App.m_EnchantmentStats[expansion][App.m_GemProperties[expansion - 1][App.m_RefGearSlotGems[expansion - 1][x.GemId].Gem3].EnchId].Stats.Where(y => y.Key == type).Sum(y => y.Value) +
                App.m_EnchantmentStats[expansion][App.m_GemProperties[expansion - 1][App.m_RefGearSlotGems[expansion - 1][x.GemId].Gem4].EnchId].Stats.Where(y => y.Key == type).Sum(y => y.Value)
            : 0)
            + App.m_EnchantmentStats[expansion][x.GetSocketBonus(expansion)].Stats.Where(y => y.Key == type).Sum(y => y.Value)
            );
        }

        public int GetArmor(int expansion = 0)
        {
            return Slots.Sum(x => x.Item(expansion).Armor) + GetStatByType(33, expansion);
        }
    }

    public class DB_am_ref_arena
    {
        public int mArena2v2 { get; set; }
        public int mArena3v3 { get; set; }
        public int mArena5v5 { get; set; }
    }

    // TODO: Internally during parsing process
    public class DB_am_guild_progress
    {
        public int GuildID { get; set; }
        public int InstanceID { get; set; }
        public int NpcID { get; set; }
        public int AttemptID { get; set; }
        public uint TimeStamp { get; set; } // TODO!
    }
    
    public struct DB_Ranking
    {
        public int Value;
        public int Time;
        public int Attempt;
        public uint Killed;
    };
    public class DB_Rankings
    {
        public int CharID { get; set; }
        public short Type { get; set; }
        public int NpcID { get; set; }
        public short InstanceID { get; set; }
        public DB_Ranking Best { get; set; }
        public List<DB_Ranking> Average = new List<DB_Ranking>();

        public int Rank { get; set; }
        public int GetRank()
        {
            return Rank;
        }
        public int ClassRank { get; set; }
        public int GetClassRank()
        {
            return ClassRank;
        }
        
        public void CalcRank()
        {
            Rank = App.m_Rankings.Where(x => x.NpcID == NpcID && x.Type==Type).OrderByDescending(x => 1.0*x.Best.Value/x.Best.Time).ToList().IndexOf(this) + 1;
        }
        public void CalcClassRank()
        {
            ClassRank = App.m_Rankings.Where(x => x.NpcID == NpcID && x.Type == Type && App.GetChar(x.CharID).RefMisc.Class == App.GetChar(CharID).RefMisc.Class).OrderByDescending(x => 1.0 * x.Best.Value / x.Best.Time).ToList().IndexOf(this) + 1;
        }
        public int GetAverage()
        {
            var query = Average.Where(x => x.Value > 0).OrderByDescending(x => x.Value/x.Time).Take(4).ToArray();
            return (int)(query.Sum(x => 1000.0*x.Value)/(query.Sum(x => x.Time) / 1000.0));
        }
    }
    
    public class DB_SpeedkillRankings
    {
        public int GuildID { get; set; }
        public int NpcID { get; set; }
        public short InstanceID { get; set; }
        public DB_Ranking Best { get; set; }
        public List<DB_Ranking> Average = new List<DB_Ranking>();
        
        public int Rank { get; set; }
        public int GetRank()
        {
            return Rank;
        }

        public void CalcRank()
        {
            Rank = App.m_SpeedkillRankings.Where(x => x.NpcID == NpcID).OrderBy(x => x.Best.Time).ToList().IndexOf(this) + 1;
        }
        public int GetAverage()
        {
            // Temporary
            var searchspace = Average.Where(x => x.Time > 0).OrderBy(x => x.Time).Take(4).ToArray();
            return (int)((searchspace.Length > 0) ? searchspace.Average(x => x.Time) : 99999999);
        }
    }

    public struct DB_SpeedRun
    {
        public int Time;
        public int InstanceID;
        public uint Killed;
    }
    public class DB_SpeedrunRankings
    {
        public int GuildID { get; set; }
        public short InstanceID { get; set; }
        public DB_SpeedRun Best { get; set; }
        public List<DB_SpeedRun> Average = new List<DB_SpeedRun>();

        public int Rank { get; set; }

        public int GetRank()
        {
            return Rank;
        }
        public void CalcRank()
        {
            Rank = App.m_SpeedrunRankings.Where(x => x.InstanceID == InstanceID).OrderBy(x => x.Best.Time).ToList().IndexOf(this) + 1;
        }
        public int GetAverage()
        {
            // Temporary
            var searchspace = Average.Where(x => x.Time > 0).OrderBy(x => x.Time).Take(4).ToArray();
            return (int)((searchspace.Length > 0) ? searchspace.Average(x => x.Time) : 99999999);
        }
    }

    public class DBUser
    {
        public string Name { get; set; }
        public string uHash { get; set; }
        public int Amount { get; set; }
        public uint Registerd { get; set; }
        public uint Patreon { get; set; }
        public short Level { get; set; }
        public uint LastContribution { get; set; }
        public bool DisableAds { get; set; }
    }

    public class DBInstance
    {
        public string Name { get; set; }
        public short Expansion { get; set; }
    }

    public class DBRS_Instances
    {
        public int mId { get; set; }
        public short mInstanceId { get; set; }
        public int mGuildId { get; set; }
        public long mStart { get; set; }
        public long mEnd { get; set; }
        public int mSaveId { get; set; }
        public List<KeyValuePair<int, bool>> mPrivate { get; set; }
    }

    public class DBArena_Team
    {
        public short mType { get; set; }
        public string mName { get; set; }
        public short mServer { get; set; }
    }

    public class DBArena_Data
    {
        public int mArenaId { get; set; }
        public short mGames { get; set; }
        public short mWins { get; set; }
        public short mRanking { get; set; }
        public long mUploaded { get; set; }
    }

    public sealed class App
    {    
        public static bool mDebug = false;
         
        public static DateTime m_startUp;
        public SQLWrapper m_db = null;
        public SQLWrapper m_db_vanilla = null;
        public SQLWrapper m_db_tbc = null;
        public static ConcurrentDictionary<int, DBSpells>[] m_Spells = new ConcurrentDictionary<int, DBSpells>[2];
        public static ConcurrentDictionary<int, DBNPCS>[] m_Npcs = new ConcurrentDictionary<int, DBNPCS>[2];
        public static ConcurrentDictionary<int, DBItems>[] m_Items = new ConcurrentDictionary<int, DBItems>[2];
        public static ConcurrentDictionary<short, DB_ItemSets> m_ItemSets = new ConcurrentDictionary<short, DB_ItemSets>();
        public static string[] m_Icons = new string[5116];  

        public static DBServer[] m_Server;
        public static ConcurrentDictionary<int, DBGuilds> m_Guilds = new ConcurrentDictionary<int, DBGuilds>();
        public static ConcurrentDictionary<int, DBChars> m_Chars = new ConcurrentDictionary<int, DBChars>();
        public static ConcurrentDictionary<int, DBInstance> m_Instances = new ConcurrentDictionary<int, DBInstance>();
        public static ConcurrentDictionary<int, DBUser> m_User = new ConcurrentDictionary<int, DBUser>();

        // Armory stuff
        public static ConcurrentDictionary<int, DB_am_data>[] m_AmData = new ConcurrentDictionary<int, DB_am_data>[2];
        public static ConcurrentDictionary<int, DB_am_ref_gear_slot>[] m_RefGearSlot = new ConcurrentDictionary<int, DB_am_ref_gear_slot>[2];
        public static ConcurrentDictionary<int, DB_am_ref_gear_slot_gems>[] m_RefGearSlotGems = new ConcurrentDictionary<int, DB_am_ref_gear_slot_gems>[1];
        public static ConcurrentDictionary<int, DB_am_ref_gear>[] m_RefGear = new ConcurrentDictionary<int, DB_am_ref_gear>[2];
        public static ConcurrentDictionary<int, DB_am_ref_misc>[] m_RefMisc = new ConcurrentDictionary<int, DB_am_ref_misc>[2];
        public static ConcurrentDictionary<int, DB_am_ref_honor>[] m_RefHonor = new ConcurrentDictionary<int, DB_am_ref_honor>[2];
        public static ConcurrentDictionary<int, DB_am_ref_guild>[] m_RefGuild = new ConcurrentDictionary<int, DB_am_ref_guild>[2];
        public static ConcurrentDictionary<int, DB_am_ref_arena>[] m_RefArena = new ConcurrentDictionary<int, DB_am_ref_arena>[1];
        public static List<DB_am_guild_progress> m_GuildProgress = new List<DB_am_guild_progress>();
        public static ConcurrentDictionary<int, int> m_ItemDisplayID = new ConcurrentDictionary<int, int>();
        public static ConcurrentDictionary<int, DB_enchantmentstats>[] m_EnchantmentStats = new ConcurrentDictionary<int, DB_enchantmentstats>[2];
        public static ConcurrentDictionary<short, DB_item_gemproperties>[] m_GemProperties = new ConcurrentDictionary<short, DB_item_gemproperties>[1];
        // Arena Data
        public static ConcurrentDictionary<int, DBArena_Team>[] m_ArenaTeams = new ConcurrentDictionary<int, DBArena_Team>[1];
        public static List<DBArena_Data>[] m_ArenaData = new List<DBArena_Data>[1];
        
        public static ConcurrentDictionary<string, int> m_RankingsIndex = new ConcurrentDictionary<string, int>();
        public static ConcurrentDictionary<string, int> m_SpeedKillIndex = new ConcurrentDictionary<string, int>();
        public static ConcurrentDictionary<string, int> m_SpeedRunIndex = new ConcurrentDictionary<string, int>();
        public static List<DB_Rankings> m_Rankings = new List<DB_Rankings>();
        public static List<DB_SpeedkillRankings> m_SpeedkillRankings = new List<DB_SpeedkillRankings>();
        public static List<DB_SpeedrunRankings> m_SpeedrunRankings = new List<DB_SpeedrunRankings>();

        // Misc lists
        public static List<DBRS_Instances>[] mRSInstances = new List<DBRS_Instances>[2];

        public static bool loading = true;
        public static bool loaded = false;

        public static SQLWrapper GetDB(int type = 0)
        {
            // If this turns out to be an bad Idea, we can just generate new instances from here
            return new SQLWrapper(type);
            //return m_db;
        }

        public static App Instance { get; } = new App();

        static App()
        {
        }

        // TODO: Actually improve performance and efficiency of this whole process
        private static int m_GuildCount = 0;
        private static long m_GuildLastUpdate = 0;
        public static DBGuilds GetGuild(int id, bool queryDb = true)
        {
            if (m_Guilds.ContainsKey(id))
                return m_Guilds[id];
            if (!queryDb || m_GuildLastUpdate + 5 > DateTimeOffset.Now.ToUnixTimeSeconds() || id == 0) return m_Guilds[0];
            var db = GetDB(0);
            var dr = db.Query("SELECT * FROM gn_guilds WHERE id>"+m_GuildCount.ToString() + " ORDER BY id").ExecuteReaderRpll();
            while (dr.Read())
            {
                var _id = dr.GetInt32(0);
                m_Guilds[_id] = new DBGuilds()
                {
                    ServerID = dr.GetInt16(1),
                    Faction = dr.GetInt16(2),
                    Name = dr.GetString(3),
                    ID = _id
                };
                m_GuildCount = _id;
            }
            dr.CloseRpll();
            m_GuildLastUpdate = DateTimeOffset.Now.ToUnixTimeSeconds();
            return GetGuild(id, false);
        }

        private static int m_CharCount = 0;
        private static long m_CharLastUpdate = 0;
        public static DBChars GetChar(int id, bool queryDb = true)
        {
            if (m_Chars.ContainsKey(id))
                return m_Chars[id];
            if (!queryDb || m_CharLastUpdate + 5 > DateTimeOffset.Now.ToUnixTimeSeconds() || id == 0) return m_Chars[0];
            var db = GetDB(0);
            int prevCharCount = m_CharCount;
            var dr = db.Query("SELECT id, serverid, faction, name, ownerid, latestupdate, prof1, prof2 FROM gn_chars WHERE id>" + m_CharCount.ToString() + " ORDER BY id").ExecuteReaderRpll();
            while (dr.Read())
            {
                var _id = dr.GetInt32(0);
                m_Chars[_id] = new DBChars()
                {
                    ServerID = dr.GetInt16(1),
                    Faction = dr.GetInt16(2),
                    Name = dr.GetString(3),
                    OwnerId = dr.GetInt32(4),
                    LatestUpdate = dr.GetInt32(5),
                    Prof1 = dr.GetInt16(6),
                    Prof2 = dr.GetInt16(7),
                    CharId = _id,
                };
                m_CharCount = _id;
            }
            dr.CloseRpll();

            db = GetDB(1);
            // TODO: Dont execute when tbc(?)
            dr = db.Query("SELECT a.charid, a.rank, b.timestamp FROM am_chars_lifetimerank a JOIN gn_uploader b ON a.uploaderid = b.id WHERE a.charid >"+ prevCharCount.ToString() + " ORDER BY a.charid").ExecuteReaderRpll();
            while (dr.Read())
            {
                var _id = dr.GetInt32(0);
                m_Chars[_id].LifeTimeRank = dr.GetInt16(1);
                m_Chars[_id].LifeTimeRankAchieved = (uint) dr.GetInt64(2);
            }
            dr.CloseRpll();

            m_CharLastUpdate = DateTimeOffset.Now.ToUnixTimeSeconds();
            return GetChar(id, false);
        }
        
        private static int[] m_SpellCount;
        private static long[] m_SpellLastUpdate;
        public static DBSpells GetSpell(int id, int index = 0, bool queryDb = true)
        {   
            if (m_Spells[index].ContainsKey(id))
                return m_Spells[index][id];
            if (!queryDb 
                || m_SpellLastUpdate[index] + 5 > DateTimeOffset.Now.ToUnixTimeSeconds() 
                || id == 0)
                return m_Spells[index][0];
            var db = GetDB(index + 1);
            var dr = db.Query("SELECT id, type, name, icon, dispelcat, spellCat FROM db_"+(index == 0 ? "vanilla" : "tbc")+"_spells WHERE id>" + m_SpellCount[index].ToString() + " ORDER BY id").ExecuteReaderRpll();
            while (dr.Read())
            {
                var _id = dr.GetInt32(0);
                m_Spells[index][_id] = new DBSpells()
                {
                    Type = dr.GetInt16(1),
                    Name = dr.GetString(2),
                    Icon = dr.GetInt16(3),
                    Category = dr.GetInt16(4),
                    SpellCategory = dr.GetInt16(5),
                    Id = _id,
                };
                m_SpellCount[index] = _id;
            }
            dr.CloseRpll();
            m_SpellLastUpdate[index] = DateTimeOffset.Now.ToUnixTimeSeconds();
            return GetSpell(id, index, false);
        }
         
        private static int[] m_NpcCount;
        private static long[] m_NpcLastUpdate;
        public static DBNPCS GetNpc(int id, int index = 0, bool queryDb = true)
        {
            if (m_Npcs[index].ContainsKey(id))
                return m_Npcs[index][id];
            if (!queryDb
                || m_NpcLastUpdate[index] + 5 > DateTimeOffset.Now.ToUnixTimeSeconds()
                || id == 0)
                return m_Npcs[index][0];
            var db = GetDB(index + 1);
            var dr = db.Query("SELECT id, type, name, family, friend FROM db_" + (index == 0 ? "vanilla" : "tbc") + "_npcs WHERE id>" + m_NpcCount[index].ToString() + " ORDER BY id").ExecuteReaderRpll();
            while (dr.Read())
            {
                var _id = dr.GetInt32(0);
                m_Npcs[index][_id] = new DBNPCS()
                {
                    ID = _id,
                    Type = dr.GetInt16(1),
                    Name = dr.GetString(2),
                    Family = dr.GetInt16(3),
                    Liking = dr.GetInt16(4),
                    Class = 0
                };
                m_NpcCount[index] = _id;
            }
            dr.CloseRpll();
            m_NpcLastUpdate[index] = DateTimeOffset.Now.ToUnixTimeSeconds();
            return GetNpc(id, index, false);
        }

        private static int[] m_ArmoryCount;
        private static int[] m_ArmoryCountRefGear;
        private static int[] m_ArmoryCountRefGearSlot;
        private static int[] m_ArmoryCountRefGearSlotGems;
        private static int[] m_ArmoryCountRefMisc;
        private static int[] m_ArmoryCountRefHonor;
        private static int[] m_ArmoryCountRefGuild;
        private static long[] m_ArmoryLastUpdate;
        public static DB_am_data GetArmoryData(int id, int index = 0, bool queryDb = true)
        {
            if (m_AmData[index].ContainsKey(id))
                return m_AmData[index][id];
            if (!queryDb || m_ArmoryLastUpdate[index] + 5 > DateTimeOffset.Now.ToUnixTimeSeconds() || id == 0) return m_AmData[index][0];
            var db = GetDB(index+1);
            MySqlDataReader dr;
            if (index >= 1)
            {
                dr = db.Query("SELECT id,itemid, enchid, genenchid, gemid FROM am_chars_ref_gear_slot WHERE id > " + m_ArmoryCountRefGearSlot[index].ToString() + " ORDER BY id").ExecuteReaderRpll();
                while (dr.Read())
                {
                    var _id = dr.GetInt32(0);
                    m_RefGearSlot[index][_id] = new DB_am_ref_gear_slot()
                    {
                        ItemID = dr.GetInt32(1),
                        EnchID = dr.GetInt32(2),
                        GenEnchID = dr.GetInt32(3),
                        GemId = dr.GetInt32(4),
                    };
                    m_ArmoryCountRefGearSlot[index] = _id;
                }
                dr.CloseRpll();
            }
            else
            {
                dr = db.Query("SELECT id,itemid, enchid, genenchid FROM am_chars_ref_gear_slot WHERE id > " + m_ArmoryCountRefGearSlot[index].ToString() + " ORDER BY id").ExecuteReaderRpll();
                while (dr.Read())
                {
                    var _id = dr.GetInt32(0);
                    m_RefGearSlot[index][_id] = new DB_am_ref_gear_slot()
                    {
                        ItemID = dr.GetInt32(1),
                        EnchID = dr.GetInt32(2),
                        GenEnchID = dr.GetInt32(3),
                        GemId = 0,
                    };
                    m_ArmoryCountRefGearSlot[index] = _id;
                }
                dr.CloseRpll();
            }
            dr = db.Query("SELECT id, head, neck, shoulder, shirt, chest, waist, legs, feet, wrist, hands, ring1, ring2, trinket1, trinket2, back, mainhand, offhand, ranged, tabard FROM am_chars_ref_gear WHERE id > " + m_ArmoryCountRefGear[index].ToString() + " ORDER BY id").ExecuteReaderRpll(); // WhyTF cant I include the counter here?!
            while (dr.Read())
            {
                var _id = dr.GetInt32(0); 
                var rG = m_RefGear[index][_id] = new DB_am_ref_gear(){GearId = _id};
                for (int i = 1; i < 20; ++i)
                    rG.Slots[i - 1] = m_RefGearSlot[index].ContainsKey(dr.GetInt32(i)) ? m_RefGearSlot[index][dr.GetInt32(i)] : m_RefGearSlot[index][0];
                m_ArmoryCountRefGear[index] = _id;
            }
            dr.CloseRpll();
            if (index == 0)
            {
                dr = db.Query("SELECT id, gender, level, race, class, talents FROM am_chars_ref_misc WHERE id > " +
                              m_ArmoryCountRefMisc[index].ToString() + " ORDER BY id").ExecuteReaderRpll();
                while (dr.Read())
                {
                    var _id = dr.GetInt32(0);
                    m_RefMisc[index][_id] = new DB_am_ref_misc()
                    {
                        Gender = dr.GetInt16(1),
                        Level = dr.GetInt16(2),
                        Race = dr.GetInt16(3),
                        Class = dr.GetInt16(4),
                        Talents = dr.GetInt16(5).ToString()
                    };
                    m_ArmoryCountRefMisc[index] = _id;
                }

                dr.CloseRpll();
            }
            else
            {
                dr = db.Query("SELECT id, level, gender, race, class, talents FROM am_chars_ref_misc WHERE id > " +
                              m_ArmoryCountRefMisc[index].ToString() + " ORDER BY id").ExecuteReaderRpll();
                while (dr.Read())
                {
                    var _id = dr.GetInt32(0);
                    m_RefMisc[index][_id] = new DB_am_ref_misc()
                    {
                        Level = dr.GetInt16(1),
                        Gender = dr.GetInt16(2),
                        Race = dr.GetInt16(3),
                        Class = dr.GetInt16(4),
                        Talents = dr.GetString(5),
                    };
                    m_ArmoryCountRefMisc[index] = _id;
                }

                dr.CloseRpll();
            }

            try
            {
                if (index == 0)
                {
                    dr = db.Query(
                        "SELECT id, rank, progress, hk, dk, honor, standing FROM am_chars_ref_honor WHERE id > " +
                        m_ArmoryCountRefHonor[index]).ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        var _id = dr.GetInt32(0);
                        m_RefHonor[index][_id] = new DB_am_ref_honor()
                        {
                            Rank = dr.GetInt16(1),
                            Progress = dr.GetInt32(2),
                            HK = dr.GetInt32(3),
                            DK = dr.GetInt32(4),
                            Honor = dr.GetInt32(5),
                            Standing = dr.GetInt32(6),
                        };
                        m_ArmoryCountRefHonor[index] = _id;
                    }

                    dr.CloseRpll();
                }
                else
                {
                    dr = db.Query("SELECT id, hk, dk, honor FROM am_chars_ref_honor WHERE id > " +
                                  m_ArmoryCountRefHonor[index]).ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        var _id = dr.GetInt32(0);
                        m_RefHonor[index][_id] = new DB_am_ref_honor()
                        {
                            Rank = 0,
                            Progress = 0,
                            HK = dr.GetInt32(1),
                            DK = dr.GetInt32(2),
                            Honor = dr.GetInt32(3),
                            Standing = 0,
                        };
                        m_ArmoryCountRefHonor[index] = _id;
                    }

                    dr.CloseRpll();
                }
            }
            catch
            {
                System.Diagnostics.Debug.WriteLine("Issue at honor retrieving: "+index);
            }

            dr = db.Query("SELECT id, guildid, grankindex, grankname FROM am_chars_ref_guild WHERE id > " + m_ArmoryCountRefGuild[index].ToString() + " ORDER BY id").ExecuteReaderRpll();
            while (dr.Read())
            {
                var _id = dr.GetInt32(0);
                m_RefGuild[index][_id] = new DB_am_ref_guild()
                {
                    GuildID = dr.GetInt32(1),
                    GrankIndex = dr.GetInt16(2),
                    GrankName = dr.GetString(3)
                };
                m_ArmoryCountRefGuild[index] = _id;
            }
            dr.CloseRpll();

            try
            {
                if (index == 0)
                {
                    dr = db.Query(
                        "SELECT a.id, a.charid, b.timestamp, a.ref_misc, a.ref_guild, a.ref_honor, a.ref_gear FROM am_chars_data a JOIN gn_uploader b ON a.uploaderid = b.id WHERE a.id>" +
                        m_ArmoryCount[index].ToString() + " ORDER BY a.id").ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        var _id = dr.GetInt32(0);
                        m_AmData[index][_id] = new DB_am_data()
                        {
                            CharID = dr.GetInt32(1),
                            Uploaded = dr.GetInt64(2),
                            Ref_Misc = dr.GetInt32(3),
                            Ref_Guild = dr.GetInt32(4),
                            Ref_Honor = dr.GetInt32(5),
                            Ref_Gear = dr.GetInt32(6),
                        };
                        m_ArmoryCount[index] = _id;
                    }

                    dr.CloseRpll();
                }
                else
                {
                    dr = db.Query("SELECT id, gem1, gem2, gem3 FROM am_chars_ref_gear_slot_gems WHERE id>" +
                                  m_ArmoryCountRefGearSlotGems[index - 1].ToString() + " ORDER BY id")
                        .ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        var _id = dr.GetInt32(0);
                        m_RefGearSlotGems[index - 1][_id] = new DB_am_ref_gear_slot_gems()
                        {
                            Gem1 = dr.GetInt16(1),
                            Gem2 = dr.GetInt16(2),
                            Gem3 = dr.GetInt16(3),
                            Gem4 = 0,
                        };
                        m_ArmoryCountRefGearSlotGems[index - 1] = _id;
                    }

                    dr.CloseRpll();

                    dr = db.Query(
                        "SELECT a.id, a.charid, b.timestamp, a.ref_misc, a.ref_guild, a.ref_honor, a.ref_gear, a.ref_arena FROM am_chars_data a JOIN gn_uploader b ON a.uploaderid = b.id WHERE a.id>" +
                        m_ArmoryCount[index].ToString() + " ORDER BY a.id").ExecuteReaderRpll();
                    while (dr.Read())
                    {
                        var _id = dr.GetInt32(0);
                        m_AmData[index][_id] = new DB_am_data()
                        {
                            CharID = dr.GetInt32(1),
                            Uploaded = dr.GetInt64(2),
                            Ref_Misc = dr.GetInt32(3),
                            Ref_Guild = dr.GetInt32(4),
                            Ref_Honor = dr.GetInt32(5),
                            Ref_Gear = dr.GetInt32(6),
                            Ref_Arena = dr.GetInt32(7),
                        };
                        m_ArmoryCount[index] = _id;
                    }

                    dr.CloseRpll();
                }
            }
            catch
            {
                System.Diagnostics.Debug.WriteLine("Issue at armory data retrieving: "+index);
            }

            if (id != 0)
            {
                dr = GetDB(0).Query("SELECT id, latestupdate FROM gn_chars").ExecuteReaderRpll();
                while (dr.Read())
                {
                    if (m_Chars.ContainsKey(dr.GetInt32(0)))
                        m_Chars[dr.GetInt32(0)].LatestUpdate = dr.GetInt32(1);
                }
                dr.CloseRpll();
            }

            m_ArmoryLastUpdate[index] = DateTimeOffset.Now.ToUnixTimeSeconds();
            return GetArmoryData(id, index, false);
        }

        private static int[] m_ArenaTeamCount;
        private static int[] m_ArenaDataCount;
        private static int[] m_ArmoryCountRefArena;
        public static int UpdateArenaData(int _index, bool queryDB = true)
        {
            try
            {
                var db = GetDB(2);
                var cmd = db.CreateCommand();
                cmd.CommandText = "SELECT id, type, name, serverid FROM am_chars_arena_team WHERE id > ? ORDER BY id";
                cmd.Parameters.AddWithValue("@id", m_ArenaTeamCount[0]);
                var dr = cmd.ExecuteReaderRpll();
                //var dr = db.Query("SELECT id, type, name, serverid FROM am_chars_arena_team WHERE id > " +
                //                  m_ArenaTeamCount[0].ToString() + " ORDER BY id")
                //    .ExecuteReaderRpll();
                while (dr.HasRows && dr.Read())
                {
                    var id = dr.GetInt32(0);
                    m_ArenaTeams[0].TryAdd(id, new DBArena_Team()
                    {
                        mType = dr.GetInt16(1),
                        mName = dr.GetString(2),
                        mServer = dr.GetInt16(3)
                    });
                    m_ArenaTeamCount[0] = id;
                }

                dr.CloseRpll();
                cmd = db.CreateCommand();
                cmd.CommandText =
                    "SELECT a.id, arenaid, games, wins, ranking, b.timestamp FROM am_chars_arena_data a JOIN gn_uploader b ON a.uploaderid = b.id WHERE a.id > ? ORDER BY a.id";
                cmd.Parameters.AddWithValue("@a.id", m_ArenaDataCount[0]);
                dr = cmd.ExecuteReaderRpll();
                //dr = db.Query(
                //        "SELECT a.id, arenaid, games, wins, ranking, b.timestamp FROM am_chars_arena_data a JOIN gn_uploader b ON a.uploaderid = b.id WHERE a.id > " +
                //        m_ArenaDataCount[0].ToString() + " ORDER BY a.id")
                //    .ExecuteReaderRpll();
                while (dr.HasRows && dr.Read())
                {
                    m_ArenaDataCount[0] = dr.GetInt32(0);
                    m_ArenaData[0].Insert(0, new DBArena_Data()
                    {
                        mArenaId = dr.GetInt32(1),
                        mGames = dr.GetInt16(2),
                        mWins = dr.GetInt16(3),
                        mRanking = dr.GetInt16(4),
                        mUploaded = dr.GetInt64(5)
                    });
                }

                dr.CloseRpll();
                cmd = db.CreateCommand();
                cmd.CommandText = "SELECT id, arena2v2, arena3v3, arena5v5 FROM am_chars_ref_arena WHERE id > ? ORDER BY id";
                cmd.Parameters.AddWithValue("@id", m_ArmoryCountRefArena[0]);
                dr = cmd.ExecuteReaderRpll();
                //dr = db.Query("SELECT id, arena2v2, arena3v3, arena5v5 FROM am_chars_ref_arena WHERE id>" +
                //              m_ArmoryCountRefArena[0].ToString() + " ORDER BY id").ExecuteReaderRpll();
                while (dr.Read())
                {
                    var arId = dr.GetInt32(0);
                    m_RefArena[0].TryAdd(arId, new DB_am_ref_arena()
                    {
                        mArena2v2 = dr.GetInt32(1),
                        mArena3v3 = dr.GetInt32(2),
                        mArena5v5 = dr.GetInt32(3),
                    });
                    m_ArmoryCountRefArena[0] = arId;
                }

                dr.CloseRpll();
            }
            catch (FormatException ex)
            {
                System.Console.WriteLine("ArenaData => " + ex.Message);
            }

            return 1;
        }

        private static int m_UserCount = 0;
        private static long m_UserLastUpdate = 0;
        public static DBUser GetUser(int id, bool queryDb = true)
        {
            if (m_User.ContainsKey(id))
                return m_User[id];
            if (!queryDb || m_UserLastUpdate + 5 > DateTimeOffset.Now.ToUnixTimeSeconds() || id == 0) return m_User[0];
            var db = GetDB(0);
            var dr = db.Query("SELECT id, name, amount, registerd, patreon, level, lastcont, uhash, disableads FROM gn_user WHERE id>" + m_UserCount + " ORDER BY id").ExecuteReaderRpll();
            while (dr.Read())
            {
                var _id = dr.GetInt32(0);
                m_User[_id] = new DBUser()
                {
                    Name = dr.GetString(1),
                    Amount = dr.GetInt32(2),
                    Registerd = (uint)dr.GetInt64(3),
                    Patreon = (uint)dr.GetInt64(4),
                    Level = dr.GetInt16(5),
                    LastContribution = (uint)dr.GetInt64(6),
                    uHash = dr.GetString(7),
                    DisableAds = dr.GetInt16(8) == 1,
                };
                m_UserCount = _id;
            }
            dr.CloseRpll();
            m_UserLastUpdate = DateTimeOffset.Now.ToUnixTimeSeconds();
            return GetUser(id, false);
        }

        private static int[] m_RaidCount;
        private static int[] m_RaidProgressCount;
        private static int[] m_RankingsCount;
        private static int[] m_RankingsBestCount;
        private static int[] m_SpeedKillCount;
        private static int[] m_SpeedKillBestCount;
        private static int[] m_SpeedRunCount;
        private static int[] m_SpeedRunBestCount;

        public static int RetrieveRaidData(int id, int index = 0, bool queryDb = true)
        {
            for (int ii = 0; ii < 2; ++ii)
            {
                var db = GetDB(ii + 1);
                var dr = db.Query(
                    "SELECT a.id, a.instanceid, a.guildid, a.start, a.end, a.saveid, GROUP_CONCAT(b.private) AS prvt, GROUP_CONCAT(b.id) AS uploader, GROUP_CONCAT(c.userid) AS userids FROM rs_instances a JOIN rs_instance_uploader b ON a.`id` = b.`instanceid` JOIN gn_uploader c ON b.uploaderid = c.id WHERE a.rdy = 1 and a.id > " + m_RaidCount[ii].ToString()+ " GROUP BY a.`id`").ExecuteReaderRpll();
                while (dr.Read())
                {
                    mRSInstances[ii].Add(new DBRS_Instances()
                    {
                        mId = dr.GetInt32(0),
                        mInstanceId = dr.GetInt16(1),
                        mGuildId = dr.GetInt32(2),
                        mStart = dr.GetInt64(3),
                        mEnd = dr.GetInt64(4),
                        mSaveId = dr.GetInt32(5),
                        mPrivate = new List<KeyValuePair<int, bool>>() 
                    });

                    var prvts = dr.GetString(6).Split(',');
                    var uploader = dr.GetString(7).Split(',');
                    var users = dr.GetString(8).Split(',');
                    int count = 0;
                    foreach (var val in uploader)
                    {
                        if (!RaidData.m_Uploader.ContainsKey(dr.GetInt32(0)))
                            RaidData.m_Uploader[dr.GetInt32(0)] = new List<KeyValuePair<int, int>>();

                        var kvp = new KeyValuePair<int, int>(int.Parse(val), int.Parse(users[count]));

                        if (!RaidData.m_Uploader[dr.GetInt32(0)].Contains(kvp))
                            RaidData.m_Uploader[dr.GetInt32(0)].Add(kvp);

                        mRSInstances[ii].Last().mPrivate.Add(new KeyValuePair<int, bool>(int.Parse(val), prvts[count] == "1"));
                        ++count;
                    }

                    m_RaidCount[ii] = dr.GetInt32(0);
                }
                dr.CloseRpll();
            }
            return 0;
        }
        public static int UpdateRaidSpecificData(int id = 0, bool queryDb = true)
        {
            string key = "";
            
            // Creating this dictionary in order to save the index and speed up this thing
            int listCount = 0;
            
            for (int ii = 0; ii < 2; ++ii)
            {
                var db = GetDB(ii + 1);
                var dr = db.Query("SELECT guildid, instanceid, npcid, attemptid,id FROM am_guilds_progresshistory WHERE id > "+m_RaidProgressCount[ii].ToString()+" ORDER BY id ASC").ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_GuildProgress.Add(new DB_am_guild_progress()
                    {
                        GuildID = dr.GetInt32(0),
                        InstanceID = dr.GetInt32(1),
                        NpcID = dr.GetInt32(2),
                        AttemptID = dr.GetInt32(3)
                    });
                    m_RaidProgressCount[ii] = dr.GetInt32(4);
                }

                dr.CloseRpll();
                
                listCount = m_Rankings.Count;
                dr = db.Query("SELECT a.`type`, a.`charid`, b.`npcid`, e.instanceid, a.value, (b.end-b.start), ROUND((b.end+e.start)/1000), a.attemptid, a.id " +
                              "FROM `rs_chars_rankings` a JOIN `rs_attempts` b ON a.`attemptid` = b.`id` " +
                              "JOIN `rs_instance_uploader` d ON b.uploaderid = d.id JOIN `rs_instances` e ON d.instanceid = e.id " +
                              "WHERE a.id>"+m_RankingsCount[ii].ToString()+" ORDER BY a.`id` ASC").ExecuteReaderRpll();
                while (dr.Read())
                {
                    key = dr.GetInt16(0)+","+dr.GetInt32(1)+","+dr.GetInt32(2);
                    if (!m_RankingsIndex.ContainsKey(key))
                    {
                        m_Rankings.Add(new DB_Rankings()
                        {
                            Type = dr.GetInt16(0),
                            CharID = dr.GetInt32(1),
                            NpcID = dr.GetInt32(2),
                            InstanceID = dr.GetInt16(3)
                        });
                        m_RankingsIndex[key] = listCount;
                        ++listCount;
                    }
                    dr.GetInt16(3); // To load it anyway
                    //if (!m_RankingsIndex.ContainsKey(key)) continue; // Something went wrong!
                    m_Rankings[m_RankingsIndex[key]].Average.Insert(0, new DB_Ranking()
                    {
                        Value = dr.GetInt32(4),
                        Time = dr.GetInt32(5),
                        Attempt = dr.GetInt32(6),
                        Killed = (uint)dr.GetInt64(7),
                    });
                    if (m_Rankings[m_RankingsIndex[key]].Average.Count > 5)
                        m_Rankings[m_RankingsIndex[key]].Average.RemoveAt(5);
                    m_RankingsCount[ii] = dr.GetInt32(8);
                }
                dr.CloseRpll();
                
                // Note: This will become slower and slower the more entries are added!
                dr = db.Query(
                    "SELECT a.`type`, a.`charid`, b.`npcid`, a.value, b.end-b.start, ROUND((b.end+e.start)/1000), a.attemptid, a.id " +
                    "FROM `rs_chars_rankings_best` a JOIN `rs_attempts` b ON a.`attemptid` = b.`id` " +
                    "JOIN `rs_instance_uploader` d ON b.uploaderid = d.id JOIN `rs_instances` e ON d.instanceid = e.id " +
                    "WHERE a.id>"+m_RankingsBestCount[ii].ToString()+" ORDER BY a.`id` ASC").ExecuteReaderRpll();
                while (dr.Read())
                {
                    key = dr.GetInt16(0) + "," + dr.GetInt32(1) + "," + dr.GetInt32(2);
                    if (!m_RankingsIndex.ContainsKey(key)) continue;

                    m_Rankings[m_RankingsIndex[key]].Best = new DB_Ranking()
                    {
                        Value = dr.GetInt32(3),
                        Time = dr.GetInt32(4),
                        Killed = (uint)dr.GetInt64(5),
                        Attempt = dr.GetInt32(6)
                    };
                    m_RankingsBestCount[ii] = dr.GetInt32(7);
                }
                dr.CloseRpll();
                
            }
            
            listCount = m_SpeedkillRankings.Count;
            for (int ii = 0; ii < 2; ++ii)
            {
                var db = GetDB(ii + 1);
                var dr = db.Query(
                    "SELECT e.`guildid`, b.`npcid`, e.instanceid, (b.end-b.start), (ROUND((b.end+e.start)/1000)), (a.attemptid), a.id " +
                    "FROM `rs_guilds_speedkills` a JOIN `rs_attempts` b ON a.`attemptid` = b.`id` " +
                    "JOIN `rs_instance_uploader` d ON b.uploaderid = d.id JOIN `rs_instances` e ON d.instanceid = e.id " +
                    "WHERE a.id>"+m_SpeedKillCount[ii].ToString()+" ORDER BY a.`id` ASC").ExecuteReaderRpll();
                while (dr.Read())
                {
                    key = dr.GetInt32(0) + "," + dr.GetInt32(1);
                    if (!m_SpeedKillIndex.ContainsKey(key))
                    {
                        m_SpeedkillRankings.Add(new DB_SpeedkillRankings()
                        {
                            GuildID = dr.GetInt32(0),
                            NpcID = dr.GetInt32(1),
                            InstanceID = dr.GetInt16(2),
                        });
                        m_SpeedKillIndex[key] = listCount;
                        ++listCount;
                    }
                    dr.GetInt16(2);
                    //if (!m_SpeedKillIndex.ContainsKey(key)) continue; // Something went wrong!
                    m_SpeedkillRankings[m_SpeedKillIndex[key]].Average.Insert(0, new DB_Ranking()
                    {
                        Value = 0,
                        Time = dr.GetInt32(3),
                        Killed = (uint)dr.GetInt64(4),
                        Attempt = dr.GetInt32(5)
                    });
                    if (m_SpeedkillRankings[m_SpeedKillIndex[key]].Average.Count > 5)
                        m_SpeedkillRankings[m_SpeedKillIndex[key]].Average.RemoveAt(5);
                    m_SpeedKillCount[ii] = dr.GetInt32(6);
                }
                dr.CloseRpll();

                // Note: This will become slower and slower the more entries are added!
                dr = db.Query(
                    "SELECT e.`guildid`, b.`npcid`, b.end-b.start, ROUND((b.end+e.start)/1000), a.attemptid, a.id " +
                    "FROM `rs_guilds_speedkills_best` a JOIN `rs_attempts` b ON a.`attemptid` = b.`id` " +
                    "JOIN `rs_instance_uploader` d ON b.uploaderid = d.id JOIN `rs_instances` e ON d.instanceid = e.id " +
                    "WHERE a.id>"+m_SpeedKillBestCount[ii].ToString()+" ORDER BY a.`id` ASC").ExecuteReaderRpll();
                while (dr.Read())
                {
                    key = dr.GetInt32(0) + "," + dr.GetInt32(1);
                    if (!m_SpeedKillIndex.ContainsKey(key)) continue;
                    m_SpeedkillRankings[m_SpeedKillIndex[key]].Best = new DB_Ranking()
                    {
                        Value = 0,
                        Time = dr.GetInt32(2),
                        Killed = (uint)dr.GetInt64(3),
                        Attempt = dr.GetInt32(4)
                    };
                    m_SpeedKillBestCount[ii] = dr.GetInt32(5);
                }
                dr.CloseRpll();
            }

            listCount = m_SpeedrunRankings.Count;
            for (int ii = 0; ii < 2; ++ii)
            {
                var db = GetDB(ii + 1);
                var dr = db.Query(
                    "SELECT e.`guildid`, e.instanceid, (a.`value`), (e.id), (ROUND((a.value+e.start)/1000)), a.id " +
                    "FROM `rs_guilds_speedruns` a JOIN `rs_guilds_speedruns_best` c ON(a.uploaderid = c.uploaderid) " +
                    "JOIN `rs_instance_uploader` d ON a.uploaderid = d.id JOIN `rs_instances` e ON d.instanceid = e.id " +
                    "WHERE a.id>"+m_SpeedRunCount[ii].ToString()+" ORDER BY a.`id` ASC").ExecuteReaderRpll();
                while (dr.Read())
                {
                    key = dr.GetInt32(0) + "," + dr.GetInt32(1);
                    if (!m_SpeedRunIndex.ContainsKey(key))
                    {
                        m_SpeedrunRankings.Add(new DB_SpeedrunRankings()
                        {
                            GuildID = dr.GetInt32(0),
                            InstanceID = dr.GetInt16(1),
                        });
                        m_SpeedRunIndex[key] = listCount;
                        ++listCount;
                    }
                    //if (!m_SpeedRunIndex.ContainsKey(key)) continue; // Something went wrong!
                    m_SpeedrunRankings[m_SpeedRunIndex[key]].Average.Insert(0, new DB_SpeedRun()
                    {
                        Time = dr.GetInt32(2),
                        InstanceID = dr.GetInt32(3),
                        Killed = (uint)dr.GetInt64(4)
                    });
                    if (m_SpeedrunRankings[m_SpeedRunIndex[key]].Average.Count > 5)
                        m_SpeedrunRankings[m_SpeedRunIndex[key]].Average.RemoveAt(5);
                    m_SpeedRunCount[ii] = dr.GetInt32(5);
                }
                dr.CloseRpll();

                // Note: This will become slower and slower the more entries are added!
                dr = db.Query("SELECT e.`guildid`, e.instanceid, a.`value`, e.id, ROUND((a.value+e.start)/1000), a.id " +
                              "FROM `rs_guilds_speedruns_best` a " +
                              "JOIN `rs_instance_uploader` d ON a.uploaderid = d.id " +
                              "JOIN `rs_instances` e ON d.instanceid = e.id " +
                              "WHERE a.id>"+m_SpeedRunBestCount[ii].ToString()+" ORDER BY a.`id` ASC").ExecuteReaderRpll();
                while (dr.Read())
                {
                    key = dr.GetInt32(0) + "," + dr.GetInt32(1);
                    if (!m_SpeedRunIndex.ContainsKey(key)) continue;
                    m_SpeedrunRankings[m_SpeedRunIndex[key]]
                        .Best = new DB_SpeedRun()
                    {
                        Time = dr.GetInt32(2),
                        InstanceID = dr.GetInt32(3),
                        Killed = (uint)dr.GetInt64(4),
                    };
                    m_SpeedRunBestCount[ii] = dr.GetInt32(5);
                }
                dr.CloseRpll();
            }

            // Updating the rankings
            // App.m_Rankings.Where(x => x.NpcID == NpcID && x.Type==Type).OrderByDescending(x => 1.0*x.Best.Value/x.Best.Time).ToList().IndexOf(this) + 1;
            foreach (var rkgGroup in m_Rankings.GroupBy(x => new {GetChar(x.CharID).ServerID, x.NpcID, x.Type}))
            {
                var rkgArr = rkgGroup.OrderByDescending(x => 1.0 * x.Best.Value / x.Best.Time).ToArray();
                for (int i = 0; i < rkgArr.Length; ++i)
                    rkgArr[i].Rank = i + 1;
            }
            // App.m_Rankings.Where(x => x.NpcID == NpcID && x.Type == Type && App.GetChar(x.CharID).RefMisc.Class == App.GetChar(CharID).RefMisc.Class).OrderByDescending(x => 1.0 * x.Best.Value / x.Best.Time).ToList().IndexOf(this) + 1;
            foreach (var rkgGroup in m_Rankings.GroupBy(x => new { GetChar(x.CharID).ServerID, x.NpcID, x.Type, GetChar(x.CharID).RefMisc.Class }))
            {
                var rkgArr = rkgGroup.OrderByDescending(x => 1.0 * x.Best.Value / x.Best.Time).ToArray();
                for (int i = 0; i < rkgArr.Length; ++i)
                    rkgArr[i].ClassRank = i + 1;
            }
            // App.m_SpeedkillRankings.Where(x => x.NpcID == NpcID).OrderBy(x => x.Best.Time).ToList().IndexOf(this) + 1;
            foreach (var rkgGroup in m_SpeedkillRankings.GroupBy(x => x.NpcID))
            {
                var rkgArr = rkgGroup.OrderByDescending(x => x.Best.Time).ToArray();
                for (int i = 0; i < rkgArr.Length; ++i)
                    rkgArr[i].Rank = i + 1;
            }
            // App.m_SpeedrunRankings.Where(x => x.InstanceID == InstanceID).OrderBy(x => x.Best.Time).ToList().IndexOf(this) + 1;
            foreach (var rkgGroup in m_SpeedrunRankings.GroupBy(x => x.InstanceID))
            {
                var rkgArr = rkgGroup.OrderByDescending(x => x.Best.Time).ToArray();
                for (int i = 0; i < rkgArr.Length; ++i)
                    rkgArr[i].Rank = i + 1;
            }

            return 1;
        }

        public static int UpdateItemQuantity(int id = 0, bool queryDb = true)
        {
            try
            {
                var chVal = m_Chars.Values.Where(x => x != null && x.CharId > 0).GroupBy(x => x.ServerID);
                for (int p = 0; p < 2; ++p)
                {
                    foreach (var item in m_Items[p])
                    {
                        for (short i = 0; i < m_Server.Length; ++i)
                        {
                            m_Items[p][item.Key].QuantityData[i] = 0;
                        }
                    }
                }

                foreach (var srv in chVal)
                {
                    foreach (var chr in srv)
                    {
                        if (chr.RefGear == null) continue;
                        foreach (var item in chr.RefGear.Slots.Select(y => y.ItemID))
                        {
                            if (item <= 0) continue;
                            if (m_Items[m_Server[srv.Key].Expansion].ContainsKey(item))
                                ++m_Items[m_Server[srv.Key].Expansion][item].QuantityData[srv.Key];
                        }
                    }
                }
            }
            catch (NullReferenceException)
            {
                // ?! How does that even occour?!
            }

            return 1;
        }

        private App()
        {
            m_db = GetDB(0);
            m_db_vanilla = GetDB(1);
            m_db_tbc = GetDB(2);

            // Default values
            m_Guilds[0] = new DBGuilds()
            {
                Faction = 0,
                Name = "",
                ServerID = 0,
            };

            m_RefGearSlotGems[0] = new ConcurrentDictionary<int, DB_am_ref_gear_slot_gems>();
            m_RefGearSlotGems[0][0] = new DB_am_ref_gear_slot_gems()
            {
                Gem1 = 0,
                Gem2 = 0,
                Gem3 = 0,
                Gem4 = 0,
            };
            m_ArmoryCountRefGearSlotGems = new int[1] {0};
            m_ArmoryCountRefArena = new int[1] { 0 };
            m_ArenaTeamCount = new int[1] { 0 };
            m_ArenaDataCount = new int[1] { 0 };
            m_ArenaTeams[0] = new ConcurrentDictionary<int, DBArena_Team>();
            m_ArenaTeams[0][0] = new DBArena_Team()
            {
                mName = "Unknown",
                mType = 0,
                mServer = 1
            };
            m_ArenaData[0] = new List<DBArena_Data>();
            m_RefArena[0] = new ConcurrentDictionary<int, DB_am_ref_arena>();
            m_RefArena[0][0] = new DB_am_ref_arena()
            {
                mArena2v2 = 0,
                mArena3v3 = 0,
                mArena5v5 = 0
            };

            // I dont get this!
            m_SpellCount = new int[2] { 0, 0 };
            m_SpellLastUpdate = new long[2] { 0, 0 };
            m_NpcCount = new int[2] { 0, 0 };
            m_NpcLastUpdate = new long[2] { 0, 0 };
            m_ArmoryCount = new int[2] {0, 0};
            m_ArmoryCountRefGear = new int[2] {0, 0};
            m_ArmoryCountRefGearSlot = new int[2] {0, 0};
            m_ArmoryCountRefMisc = new int[2] {0, 0};
            m_ArmoryCountRefHonor = new int[2] {0, 0};
            m_ArmoryCountRefGuild = new int[2] {0, 0};
            m_ArmoryLastUpdate = new long[2] {0, 0};
            m_RaidCount = new int[2] { 0, 0 };
            m_RaidProgressCount = new int[2] { 0, 0 };
            m_RankingsCount = new int[2] { 0, 0 };
            m_RankingsBestCount = new int[2] { 0, 0 };
            m_SpeedKillBestCount = new int[2] { 0, 0 };
            m_SpeedKillCount = new int[2] { 0, 0 };
            m_SpeedRunBestCount = new int[2] { 0, 0 };
            m_SpeedRunCount = new int[2] { 0, 0 };
            for (int i = 0; i < 2; ++i) // For the different expansions!
            {
                m_Items[i] = new ConcurrentDictionary<int, DBItems>();
                m_Items[i][0] = new DBItems()
                {
                    Icon = 0,
                    Quality = -1,
                    Name = "",
                    QuantityData = new ConcurrentDictionary<short, int>()
                };
                m_Spells[i] = new ConcurrentDictionary<int, DBSpells>();
                m_Spells[i][0] = new DBSpells()
                {
                    Name = "Unknown Spell"
                };
                m_Npcs[i] = new ConcurrentDictionary<int, DBNPCS>();
                m_Npcs[i][0] = new DBNPCS()
                {
                    Name = "Unknown",
                };
                m_AmData[i] = new ConcurrentDictionary<int, DB_am_data>();
                m_AmData[i][0] = new DB_am_data()
                {
                    CharID = 0,
                    Ref_Honor = 0,
                    Ref_Gear = 0,
                    Ref_Guild = 0,
                    Ref_Misc = 0,
                    Ref_Arena = 0
                };
                m_RefGearSlot[i] = new ConcurrentDictionary<int, DB_am_ref_gear_slot>();
                m_RefGearSlot[i][0] = new DB_am_ref_gear_slot()
                {
                    ItemID = 0,
                    EnchID = 0,
                    GenEnchID = 0,
                };
                m_RefGear[i] = new ConcurrentDictionary<int, DB_am_ref_gear>();
                m_RefGear[i][0] = new DB_am_ref_gear();
                for (int p = 0; p < 19; ++p)
                    m_RefGear[i][0].Slots[p] = m_RefGearSlot[i][0];
                m_RefGuild[i] = new ConcurrentDictionary<int, DB_am_ref_guild>();
                m_RefGuild[i][0] = new DB_am_ref_guild()
                {
                    GuildID = 0,
                    GrankName = "",
                    GrankIndex = 0,
                };
                m_RefHonor[i] = new ConcurrentDictionary<int, DB_am_ref_honor>();
                m_RefHonor[i][0] = new DB_am_ref_honor()
                {
                    Honor = 0,
                    HK = 0,
                    DK = 0,
                    Progress = 0,
                    Rank = 0,
                    Standing = 0,
                };
                m_RefMisc[i] = new ConcurrentDictionary<int, DB_am_ref_misc>();
                m_RefMisc[i][0] = new DB_am_ref_misc()
                {
                    Level = 1,
                    Class = 0,
                    Gender = 0,
                    Race = 0,
                    Talents = ""
                };
                m_EnchantmentStats[i] = new ConcurrentDictionary<int, DB_enchantmentstats>();
                m_EnchantmentStats[i][0] = new DB_enchantmentstats
                {
                    Name = "",
                    Stats =
                    {
                        [0] = new KeyValuePair<int, int>(0, 0),
                        [1] = new KeyValuePair<int, int>(0, 0),
                        [2] = new KeyValuePair<int, int>(0, 0)
                    }
                };
            }
            m_ItemSets[0] = new DB_ItemSets()
            {
                Name = ""
            };
            m_User[0] = new DBUser()
            {
                Name = "TestUser"
            };
            m_Chars[0] = new DBChars()
            {
                Name = "Unknown"
            };
            
            for (int i=0; i<2; ++i)
                mRSInstances[i] = new List<DBRS_Instances>();

            GetUser(1);

            #region
            // Initializing common arrays
            MySqlDataReader dr = m_db.Query("SELECT id, name FROM db_icon_names").ExecuteReaderRpll();
            while (dr.Read())
                m_Icons[dr.GetInt32(0)] = dr.GetString(1);
            dr.CloseRpll();

            dr = m_db.Query("SELECT id, displayid FROM db_item_displayid").ExecuteReaderRpll();
            while (dr.Read())
                m_ItemDisplayID[dr.GetInt32(0)] = dr.GetInt32(1);
            dr.CloseRpll();

            int serverAmount = 28;
            dr = m_db.Query("SELECT id FROM db_servernames ORDER BY id DESC LIMIT 1").ExecuteReaderRpll();
            if (dr.Read())
                serverAmount = dr.GetInt32(0);
            dr.CloseRpll();
            m_Server = new DBServer[serverAmount+1];
            m_Server[0] = new DBServer()
            {
                Name = "Unknown",
                Expansion = 99,
            };
            dr = m_db.Query("SELECT * FROM db_servernames").ExecuteReaderRpll();
            while (dr.Read())
                m_Server[dr.GetInt16(0)] = new DBServer()
                {
                    ServerId = dr.GetInt16(0),
                    Expansion = dr.GetInt16(1),
                    Name = dr.GetString(2),
                    Type = dr.GetInt16(3),
                    Season = dr.GetInt16(4),
                    PvPReset = dr.GetInt16(5),
                    PvEReset = dr.GetInt16(6),
                };
            dr.CloseRpll();

            dr = m_db.Query("SELECT id, enus, expansion FROM db_instances WHERE israid = 1").ExecuteReaderRpll();
            while (dr.Read())
                m_Instances[dr.GetInt32(0)] = new DBInstance()
                {
                    Name = dr.GetString(1),
                    Expansion = dr.GetInt16(2),
                };
            dr.CloseRpll();

            dr = m_db_vanilla.Query("SELECT * FROM db_vanilla_itemsets").ExecuteReaderRpll();
            while (dr.Read())
                m_ItemSets[dr.GetInt16(0)] = new DB_ItemSets()
                {
                    Name = dr.GetString(1),
                    SetIds = dr.GetString(2),
                    SetNames = dr.GetString(3),
                    SetEffectIds = dr.GetString(4),
                    SetEffectNames = dr.GetString(5)
                };
            dr.CloseRpll();
            dr = m_db_tbc.Query("SELECT * FROM db_tbc_itemsets").ExecuteReaderRpll();
            while (dr.Read())
                if (!m_ItemSets.ContainsKey(dr.GetInt16(0)))
                m_ItemSets[dr.GetInt16(0)] = new DB_ItemSets()
                {
                    Name = dr.GetString(1),
                    SetIds = dr.GetString(2),
                    SetNames = dr.GetString(3),
                    SetEffectIds = dr.GetString(4),
                    SetEffectNames = dr.GetString(5)
                };
            dr.CloseRpll();
            dr = m_db_vanilla.Query("SELECT * FROM db_vanilla_enchantmentstats").ExecuteReaderRpll();
            while (dr.Read())
            {
                m_EnchantmentStats[0][dr.GetInt32(0)] = new DB_enchantmentstats()
                {
                    Name = dr.GetString(1)
                };
                for (int i = 0; i < 3; ++i)
                    m_EnchantmentStats[0][dr.GetInt32(0)].Stats[i] = new KeyValuePair<int, int>(dr.GetInt32(2 + i * 2), dr.GetInt32(3 + i * 2));
            }
            dr.CloseRpll();
            dr = m_db_tbc.Query("SELECT * FROM db_tbc_enchantmentstats").ExecuteReaderRpll();
            while (dr.Read())
            {
                m_EnchantmentStats[1][dr.GetInt32(0)] = new DB_enchantmentstats()
                {
                    Name = dr.GetString(1)
                };
                for (int i = 0; i < 3; ++i)
                    m_EnchantmentStats[1][dr.GetInt32(0)].Stats[i] = new KeyValuePair<int, int>(dr.GetInt32(2 + i * 2), dr.GetInt32(3 + i * 2));
            }
            dr.CloseRpll();
            
            dr = m_db_vanilla.Query("SELECT entry, name, icon, quality" +
                            ", armor, inventorytype, class, subclass, requiredlevel, bonding, sheath, itemset, maxdurability, itemlevel, dmg_min1, dmg_max1, dmg_type1, dmg_min2, dmg_max2, dmg_type2, dmg_min3, dmg_max3, dmg_type3," +
                            "delay, extratooltip" +
                            ", stat_type1, stat_value1, stat_type2, stat_value2, stat_type3, stat_value3, stat_type4, stat_value4, stat_type5, stat_value5, stat_type6, stat_value6, stat_type7, stat_value7, stat_type8, stat_value8, stat_type9, stat_value9, stat_type10, stat_value10" +
                            " FROM db_vanilla_item_template").ExecuteReaderRpll();
            while (dr.Read())
            {
                var item = m_Items[0][dr.GetInt32(0)] = new DBItems()
                {
                    Id = dr.GetInt32(0),
                    Name = dr.GetString(1),
                    Icon = dr.GetInt16(2),
                    Quality = dr.GetInt16(3),
                    Armor = dr.GetInt32(4),
                    InventoryType = dr.GetInt16(5),
                    Class = dr.GetInt16(6),
                    SubClass = dr.GetInt16(7),
                    RequiredLevel = dr.GetInt16(8),
                    Bonding = dr.GetInt16(9),
                    Sheath = dr.GetInt16(10),
                    ItemSetId = dr.GetInt16(11),
                    MaxDurability = dr.GetInt16(12),
                    ItemLevel = dr.GetInt16(13),
                    Dmg = new DB_Item_Dmg[3]
                    {
                        new DB_Item_Dmg()
                        {
                            Min = (int)(1000.0*dr.GetFloat(14)),
                            Max = (int)(1000.0*dr.GetFloat(15)),
                            Type = dr.GetInt16(16)
                        },
                        new DB_Item_Dmg()
                        {
                            Min = (int)(1000.0*dr.GetFloat(17)),
                            Max = (int)(1000.0*dr.GetFloat(18)),
                            Type = dr.GetInt16(19)
                        },
                        new DB_Item_Dmg()
                        {
                            Min = (int)(1000.0*dr.GetFloat(20)),
                            Max = (int)(1000.0*dr.GetFloat(21)),
                            Type = dr.GetInt16(22)
                        },
                    },
                    Delay = dr.GetInt16(23),
                    ExtraTooltip = dr.GetString(24)
                };
                for (int i = 0; i < 10; ++i)
                    item.Stats[i] = new KeyValuePair<int, int>(dr.GetInt32(25 + i*2), dr.GetInt32(26 + i*2));
                item.QuantityData = new ConcurrentDictionary<short, int>();

            }
            dr.CloseRpll();
            dr = m_db_tbc.Query("SELECT entry, name, icon, quality" +
                                    ", armor, inventorytype, class, subclass, requiredlevel, bonding, sheath, itemset, maxdurability, itemlevel, dmg_min1, dmg_max1, dmg_type1, dmg_min2, dmg_max2, dmg_type2, dmg_min3, dmg_max3, dmg_type3," +
                                    "delay, extratooltip" +
                                    ",socket1, socket2, socket3, socketbonus, stat_type1, stat_value1, stat_type2, stat_value2, stat_type3, stat_value3, stat_type4, stat_value4, stat_type5, stat_value5, stat_type6, stat_value6, stat_type7, stat_value7, stat_type8, stat_value8, stat_type9, stat_value9, stat_type10, stat_value10" +
                                    " FROM db_tbc_item_template").ExecuteReaderRpll();
            while (dr.Read())
            {
                var item = m_Items[1][dr.GetInt32(0)] = new DBItems()
                {
                    Id = dr.GetInt32(0),
                    Name = dr.GetString(1),
                    Icon = dr.GetInt16(2),
                    Quality = dr.GetInt16(3),
                    Armor = dr.GetInt32(4),
                    InventoryType = dr.GetInt16(5),
                    Class = dr.GetInt16(6),
                    SubClass = dr.GetInt16(7),
                    RequiredLevel = dr.GetInt16(8),
                    Bonding = dr.GetInt16(9),
                    Sheath = dr.GetInt16(10),
                    ItemSetId = dr.GetInt16(11),
                    MaxDurability = dr.GetInt16(12),
                    ItemLevel = dr.GetInt16(13),
                    Dmg = new DB_Item_Dmg[3]
                    {
                        new DB_Item_Dmg()
                        {
                            Min = (int)(1000.0*dr.GetFloat(14)),
                            Max = (int)(1000.0*dr.GetFloat(15)),
                            Type = dr.GetInt16(16)
                        },
                        new DB_Item_Dmg()
                        {
                            Min = (int)(1000.0*dr.GetFloat(17)),
                            Max = (int)(1000.0*dr.GetFloat(18)),
                            Type = dr.GetInt16(19)
                        },
                        new DB_Item_Dmg()
                        {
                            Min = (int)(1000.0*dr.GetFloat(20)),
                            Max = (int)(1000.0*dr.GetFloat(21)),
                            Type = dr.GetInt16(22)
                        },
                    },
                    Delay = dr.GetInt16(23),
                    ExtraTooltip = dr.GetString(24),
                    Socket1 = dr.GetInt16(25),
                    Socket2 = dr.GetInt16(26),
                    Socket3 = dr.GetInt16(27),
                    SocketBonus = dr.GetInt16(28),
                };
                for (int i = 0; i < 10; ++i)
                    item.Stats[i] = new KeyValuePair<int, int>(dr.GetInt32(29 + i * 2), dr.GetInt32(30 + i * 2));
                item.QuantityData = new ConcurrentDictionary<short, int>();

            }
            dr.CloseRpll();
            
            m_GemProperties[0] = new ConcurrentDictionary<short, DB_item_gemproperties>();
            m_GemProperties[0][0] = new DB_item_gemproperties()
            {
                GemId = 0,
                EnchId = 0,
                Flag = 0,
            };
            dr = m_db_tbc.Query("SELECT enchid, flag, gemid, entry FROM db_tbc_gemproperties").ExecuteReaderRpll();
            while (dr.Read())
                m_GemProperties[0][dr.GetInt16(0)] = new DB_item_gemproperties()
                {
                    EnchId = dr.GetInt16(0),
                    Flag = dr.GetInt16(1),
                    GemId = dr.GetInt16(2),
                    Entry = dr.GetInt32(3)
                };
            dr.CloseRpll();
            #endregion

            // Cleaning up
            GC.Collect();
            GC.WaitForPendingFinalizers();
            loading = false;

            // Making sure that the caching controller runs once!
            dr = m_db.Query("INSERT IGNORE INTO gn_deadlock (id, timestamp) VALUES (1, UNIX_TIMESTAMP())").ExecuteReaderRpll();
            if (dr.HasRows) dr.Read();
            dr.CloseRpll();
            CachingController.MUpdate.Start();
        }
    }
}
