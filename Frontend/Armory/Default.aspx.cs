using System;
using System.Collections.Generic;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using System.Web.UI.WebControls;
using MoreLinq;
using RPLL;

public partial class Armory_Default : System.Web.UI.Page
{
    private int m_CharID = 0;
    private int m_GearID = 0;

    public string mAds = "";

    public DBChars m_Me;
    public DB_am_ref_gear m_Gear;

    public StringBuilder m_GuildHistory = new StringBuilder();
    public StringBuilder m_AttendedRaidsTable = new StringBuilder();
    public StringBuilder m_ItemHistoryTable = new StringBuilder();
    public StringBuilder m_Rankings = new StringBuilder();

    public short m_LifeTimeRank = 0;

    public struct AM_PvPData
    {
        public int HK;
        public int DK;
        public int Honor;
    }

    public AM_PvPData m_Today = new AM_PvPData() { HK = 0, DK = 0, Honor = 0 };
    public AM_PvPData m_Yesterday = new AM_PvPData() { HK = 0, DK = 0, Honor = 0 };
    public AM_PvPData m_ThisWeek = new AM_PvPData() { HK = 0, DK = 0, Honor = 0 };
    public DB_am_ref_honor m_LastWeek = new DB_am_ref_honor() {Honor = 0, Rank = 0, Progress = 0, Standing = 0};
    public int m_LastWeekChange = 0;
    public int m_CurrentWeekChange = 0;
    public string m_ItemDisplayArr = "";

    public string imgType = "png";
    public string imgType2 = "jpg";

    public string mTalents = "";
    public string mProfs = "";
    
    private string SerializeItemSlot(DB_am_ref_gear_slot slot)
    {
        if (m_Me.Expansion() == 0 || slot.GemId == 0)
            return slot.ItemID + ";" + slot.EnchID + ";0;0;0";
        var gems = App.m_RefGearSlotGems[m_Me.Expansion()-1][slot.GemId];
        return slot.ItemID + ";" + slot.EnchID + ";" + gems.Gem1+";"+gems.Gem2+";"+gems.Gem3;
    }

    public string GetCharViewer()
    {
        return m_Me.Expansion() + ";" + m_Me.RefMisc.Race + ";" + m_Me.RefMisc.Gender + ";" + m_Me.RefMisc.Class +
               ";0" + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[0]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[1]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[2]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[14]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[4]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[3]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[18]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[8]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[9]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[5]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[6]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[7]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[10]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[11]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[12]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[13]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[15]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[16]) + ";" +
               SerializeItemSlot(m_Me.RefGear.Slots[17]);
    }

    static string[] mSpecs = new string[27]
    {
        "Arms",
        "Fury",
        "Protection",
        "Assassination",
        "Combat",
        "Subtlety",
        "Discipline",
        "Holy",
        "Shadow",
        "Beast Mastery",
        "Marksmanship",
        "Survival",
        "Balance",
        "Feral",
        "Restoration",
        "Arcane",
        "Fire",
        "Frost",
        "Affliction",
        "Demonology",
        "Destruction",
        "Holy",
        "Protection",
        "Retribution",
        "Elemental",
        "Enhancement",
        "Restoration"
    };

    static string[] mSpecIcons = new string[27]
    {
        "ability_warrior_savageblow",
        "ability_warrior_innerrage",
        "inv_shield_06",
        "ability_rogue_eviscerate",
        "ability_marksmanship",
        "ability_stealth",
        "spell_holy_powerwordshield",
        "spell_holy_renew",
        "spell_shadow_shadowwordpain",
        "ability_druid_ferociousbite",
        "inv_spear_07",
        "inv_spear_02",
        "spell_nature_starfall",
        "ability_racial_bearform",
        "spell_nature_magicimmunity",
        "spell_holy_magicalsentry",
        "spell_fire_firebolt02",
        "spell_frost_frostbolt02",
        "spell_shadow_deathcoil",
        "spell_shadow_metamorphosis",
        "spell_shadow_rainoffire",
        "spell_holy_holybolt",
        "inv_shield_06",
        "spell_holy_auraoflight",
        "spell_nature_lightning",
        "spell_nature_lightningshield",
        "spell_nature_magicimmunity",
    };

    static string[] mProfIconList = new string[11]
    {
        "inv_misc_questionmark",
        "trade_mining",
        "inv_misc_pelt_wolf_01",
        "trade_herbalism",
        "trade_blacksmithing",
        "trade_alchemy",
        "trade_engraving",
        "trade_engineering",
        "inv_misc_armorkit_17",
        "trade_tailoring",
        "inv_misc_gem_02",
    };

    static string[] mProfNameList = new string[11]
    {

        "Unknown",
        "Mining",
        "Skinning",
        "Herbalism",
        "Blacksmithing",
        "Alchemy",
        "Enchanting",
        "Engineering",
        "Leatherworking",
        "Tailoring",
        "Juwelcrafting",
    };
    
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        if ((this.Master as MasterPage).ValidForAds()) mAds = "<ins class=\"adsbygoogle\" style=\"display:inline-block;width:336px; height: 280px; margin: 0 auto;\" data-ad-client=\"ca-pub-5192077039791210\" data-ad-slot=\"1818372262\"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>";

        Utility.GetTypeList(ref pmMode);
        imgType = Utility.GetImageType(Request, "png");
        imgType2 = Utility.GetImageType(Request);
        this.Title = "LegacyPlayers | Armory";
        //App.UpdateRaidSpecificData();
        m_CharID = Int32.Parse(Utility.GetQueryString(Request, "charid", "0"));
        //m_GearID = Int32.Parse(Utility.GetQueryString(Request, "gearid", "0"));

        if (!App.m_Chars.ContainsKey(m_CharID))
        {
            Response.Redirect("/404/");
            return;
        }

        m_Me = App.GetChar(m_CharID);
        var preSorted = App.m_AmData[m_Me.Expansion()].Where(x => x.Value.CharID == m_CharID).OrderByDescending(x => x.Value.Uploaded);
        var amData = preSorted.Select(x => x.Value);

        // Professions
        if (m_Me.Expansion() > 0)
        {
            // Current spec
            string[] current = m_Me.RefMisc.Talents.Split(';');
            int specIndex1 = 0;
            if (current.Length >= 4)
            {
                int s1 = 0;
                int s2 = 0;
                int s3 = 0;
                int.TryParse(current[1], out s1);
                int.TryParse(current[2], out s2);
                int.TryParse(current[3], out s3);
                if (s1 > s2 && s1 > s3) specIndex1 = m_Me.RefMisc.Class * 3;
                else if (s2 > s1 && s2 > s3)
                    specIndex1 = m_Me.RefMisc.Class * 3 + 1;
                else if (s3 > s2 && s3 > s1)
                    specIndex1 = m_Me.RefMisc.Class * 3 + 2;
            }

            // Finding a second one that is not the first one
            int specIndex2 = 0;
            string[] lastOne = null;
            if (preSorted.Count() > 1)
            {
                var first = preSorted.First().Key;
                var otherThanCurrent = preSorted.Where(x => x.Key != first);
                if (otherThanCurrent.Any())
                {
                    lastOne = App.m_RefMisc[m_Me.Expansion()][otherThanCurrent.First().Value.Ref_Misc].Talents.Split(';');

                    if (lastOne.Length >= 4)
                    {
                        int l1 = 0;
                        int l2 = 0;
                        int l3 = 0;
                        int.TryParse(lastOne[1], out l1);
                        int.TryParse(lastOne[2], out l2);
                        int.TryParse(lastOne[3], out l3);
                        if (l1 > l2 && l1 > l3) specIndex2 = m_Me.RefMisc.Class * 3;
                        else if (l2 > l1 && l2 > l3)
                            specIndex2 = m_Me.RefMisc.Class * 3 + 1;
                        else if (l3 > l2 && l3 > l1)
                            specIndex2 = m_Me.RefMisc.Class * 3 + 2;
                    }
                }
            }

            mTalents =
                "<table class=\"table noborder bbdesign bigger\"> <thead> <tr>" +
                "<td colspan=\"2\">Talent specialization</td> </tr> </thead> <tbody> <tr> " +
                (current.Length < 4 ? "<td><div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/inv_misc_questionmark.jpg\')\"><div>Unknown</div></div></td>" :
                "<td><a href=\"/Tools/Talents/#"+current[0]+"\"><div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/"+mSpecIcons[specIndex1] +".jpg\')\"><div>"+mSpecs[specIndex1]+" ("+current[1] + "|" + current[2] + "|" + current[3] + ")</div></div></a></td> ") +
                "<td>" +
                (lastOne == null || lastOne.Length < 4 ?
                "<div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/inv_misc_questionmark.jpg\')\"><div>Unknown</div></div>"
                :
                "<a href=\"/Tools/Talents/#" + lastOne[0] + "\"><div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/" + mSpecIcons[specIndex2] + ".jpg\')\"><div>" + mSpecs[specIndex2] + " (" + lastOne[1] + "|" + lastOne[2] + "|" + lastOne[3] + ")</div></div></a>") +
                "</td> </tr> </tbody> </table>";
        }
        else
        {
            int cur = 1;
            int last = 1;
            string current = m_Me.RefMisc.Talents;
            var first = preSorted.First().Key;
            var otherThanCurrent = preSorted.Where(x => x.Key != first);
            string lastOne = "0";
            if (otherThanCurrent.Any())
                lastOne = otherThanCurrent.First().Value.Ref_Misc == 0
                    ? "0"
                    : App.m_RefMisc[m_Me.Expansion()][otherThanCurrent.First().Value.Ref_Misc].Talents;
            int.TryParse(lastOne, out last);
            int.TryParse(current, out cur);
            mTalents =
                "<table class=\"table noborder bbdesign bigger\"> <thead> <tr>" +
                "<td colspan=\"2\">Talent specialization</td> </tr> </thead> <tbody> <tr> " +
                (current == "0" ? "<td><div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/inv_misc_questionmark.jpg\')\"><div>Unknown</div></div></td>" :
                    "<td><div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/" + mSpecIcons[cur-1] + ".jpg\')\"><div>" + mSpecs[cur-1] + "</div></div></td> ") +
                "<td>" +
                (lastOne == "0" ?
                    "<div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/inv_misc_questionmark.jpg\')\"><div>Unknown</div></div>"
                    :
                    "<div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/" + mSpecIcons[last-1] + ".jpg\')\"><div>" + mSpecs[last-1] + "</div></div>") +
                "</td> </tr> </tbody> </table>";
        }


        // Professions
        mProfs =
            "<table class=\"table noborder bbdesign bigger\"> <thead> <tr> " +
            "<td colspan=\"2\">Professions</td> </tr> </thead> <tbody> <tr> " +
            "<td><div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/" + mProfIconList[m_Me.Prof1] + ".jpg\')\"><div>" + mProfNameList[m_Me.Prof1] + "</div></div></td> " +
            "<td><div class=\"sp icon-32 bbdesign\" style=\"background-image: url(\'/Assets/icons/" + mProfIconList[m_Me.Prof2] + ".jpg\')\"><div>" + mProfNameList[m_Me.Prof2] + "</div></div></td> " +
            "</tr> </tbody> </table>";

        m_GearID = m_Me.RefGear.GearId;
        
        // Getting the last 3 itemsets
        int rankingMode = 0;
        if (IsPostBack)
        {
            Int32.TryParse(itemsets.Value, out m_GearID);
            Int32.TryParse(pmMode.Value, out rankingMode);
        }

        itemsets.Items.Clear();
        var sets = amData.GroupBy(x => x.Ref_Gear).Take(5)
            .ToArray();
        for (int i = 0; i < sets.Length; ++i)
            itemsets.Items.Add(new ListItem("Itemset " + i, sets[i].Key.ToString()));
        itemsets.SelectedIndex = itemsets.Items.IndexOf(itemsets.Items.FindByValue(m_GearID.ToString()));

        if (m_GearID == 0 || !App.m_RefGear[m_Me.Expansion()].ContainsKey(m_GearID))
            m_Gear = m_Me.RefGear;
        else
            m_Gear = App.m_RefGear[m_Me.Expansion()][m_GearID];

        int[] itemparts = Utility.GetCookie(Request, "viewhead", "0") != "true" ? new[] { 0, 2, 4, 3, 18, 8, 9, 5, 6, 7, 15, 16 } : new[] { 2, 4, 3, 18, 8, 9, 5, 6, 7, 15, 16 };
        foreach (int i in itemparts)
        {
            if (m_Gear.Slots[i].ItemID <= 0) continue;
            // [3, 58860], [16, 48190], [5, 60895], [19, 58700], [9, 61476], [10, 60915], [6, 61471], [7, 60898], [8, 61473], [13, 30606], [14, 51721]
            if (m_ItemDisplayArr == "")
                m_ItemDisplayArr = "[" + (i+1) + "," + App.m_ItemDisplayID[m_Gear.Slots[i].ItemID] + "]";
            else
                m_ItemDisplayArr += ", [" + (i + 1) + "," + App.m_ItemDisplayID[m_Gear.Slots[i].ItemID] + "]";
        }

        // Guild history
        var guilds = amData.Where(x => x.Ref_Guild>0).GroupBy(x => x.Ref_Guild).Take(5);
        foreach (IGrouping<int, DB_am_data> t in guilds)
        {
            m_GuildHistory.Append("<tr><td><div class=\"sp icon-32\" style=\"background-image: url('/Assets/raids/fac"+App.m_Guilds[App.m_RefGuild[m_Me.Expansion()][t.Key].GuildID].Faction+ "."+imgType+"')\"><div>" + App.m_Guilds[App.m_RefGuild[m_Me.Expansion()][t.Key].GuildID].Name + "</div></div></td>");
            m_GuildHistory.Append("<td>" + App.m_RefGuild[m_Me.Expansion()][t.Key].GrankName + " (" + App.m_RefGuild[m_Me.Expansion()][t.Key].GrankIndex + ")</td></tr>");
        }

        // Attended raids
        SQLWrapper DB = App.GetDB(m_Me.Expansion()+1);
        MySqlDataReader dr =
            DB.Query(
                "SELECT b.instanceid FROM rs_participants a " +
                "LEFT JOIN rs_instance_uploader b ON a.uploaderid = b.id " +
                "WHERE a.charid = " + m_CharID + " GROUP BY b.instanceid ORDER BY b.instanceid DESC LIMIT 5").ExecuteReaderRpll();
        while (dr.Read())
        {
            // Finding the raid
            foreach (var raid in App.mRSInstances[m_Me.Expansion()])
            {
                if (raid.mId != dr.GetInt32(0)) continue;
                m_AttendedRaidsTable.Append("<tr><td>" + App.m_Instances[raid.mInstanceId].Name + "</td>" +
                                            "<td><a href=\"/Raids/Viewer/?id=" + raid.mId + "&exp=" +
                                            m_Me.Expansion() + "\">" +
                                            DateTimeOffset.FromUnixTimeMilliseconds(raid.mEnd).UtcDateTime +
                                            "</a></td></tr>");
                break;
            }
        }
        dr.CloseRpll();

        // Item history
        // This might be very slow the more data gets added, gotta watch this!
        Dictionary<int, bool> tempDone = new Dictionary<int, bool>();
        Dictionary<int, bool> tempDone2 = new Dictionary<int, bool>();
        List<string> m_HackItemHistory = new List<string>();
        var amDataAsc = amData.Where(x => x.Ref_Gear>0).OrderBy(x => x.Uploaded).ToArray();
        foreach (DB_am_data t in amDataAsc) 
        {
            if (tempDone.ContainsKey(t.Ref_Gear)) continue;
            var date = DateTimeOffset.FromUnixTimeMilliseconds(t.Uploaded).UtcDateTime;
            string someHackStr = "";
            for (int p = 0; p < 19; ++p)
            {
                var item = App.m_RefGear[m_Me.Expansion()][t.Ref_Gear].Slots[p];
                if (item.ItemID <= 0 || tempDone2.ContainsKey(item.ItemID)) continue;
                someHackStr += "<div class=\"item-template-32 qe" + item.Item(m_Me.Expansion()).Quality +
                               "\" style=\"background-image: url('/Assets/icons/" + item.Item(m_Me.Expansion()).IconName +
                               "."+imgType2+"');\"><a href=\"/Armory/Item/?i="+item.ItemID+"&exp="+m_Me.Expansion()+"\">" + item.Item(m_Me.Expansion()).Quantity(m_Me.ServerID) + "</a><a href=\"/Raids/Loot/?i=" +
                               item.ItemID + "&exp=" + m_Me.Expansion() + "\"><div onmouseover=\"tt_show(this, 1, " + item.ItemID +
                               ",[],"+m_Me.Expansion()+")\"></div></a></div>";
                tempDone2[item.ItemID] = true;
            }
            if (someHackStr != "")
            {
                someHackStr = "<tr><td>" + someHackStr + "</td><td>" + date.Month + "/" + date.Day + "/" + date.Year + "</td></tr>";
                m_HackItemHistory.Add(someHackStr);
            }
            tempDone[t.Ref_Gear] = true;
        }
        for (int i = m_HackItemHistory.Count-1; i >= 0 && i > m_HackItemHistory.Count - 10; --i)
            m_ItemHistoryTable.Append(m_HackItemHistory[i]);


        // Rankings
        var rankingData = App.m_Rankings.Where(x => x.Type == rankingMode && x.CharID == m_CharID).OrderByDescending(x => x.InstanceID).ThenBy(x => x.NpcID);
        short someInstance = 0;
        foreach (var row in rankingData)
        {
            if (someInstance != row.InstanceID && someInstance != 0)
                m_Rankings.Append("</tbody></table>");
            if (someInstance != row.InstanceID)
                m_Rankings.Append("<table class=\"table noborder bbdesign\"><thead><tr><td colspan=\"6\">"+App.m_Instances[row.InstanceID].Name+"<div class=\"arrowdown\" onclick=\"ToggleRecordMenu('inst" + row.InstanceID + "')\">" +
                              "</div></td></tr><tr><td>All</td><td>Class</td><td>Type</td><td>Best</td><td>Avg</td><td>Encounter</td></tr></thead>" +
                              "<tbody id=\"inst"+row.InstanceID+"\" "+((someInstance==0) ? "style=\"display: table-header-group;\">" : ""));
            someInstance = row.InstanceID;
            if (row.Best.Value > 5000)
                m_Rankings.Append("<tr><td><a href=\"/Raids/Ranking/?npc="+ row.NpcID + "&exp="+m_Me.Expansion()+"\">"+row.GetRank()+ "</a></td><td><a href=\"/Raids/Ranking/?npc=" + row.NpcID + "&class="+m_Me.RefMisc.Class+"&exp=" + m_Me.Expansion() + "\">" + row.GetClassRank()+"</a></td>" +
                    "<td>"+((row.Type==0) ? "DPS" : row.Type == 1 ? "HPS" : "TPS")+ "</td><td><a href=\"/Raids/Viewer/?atmt=" + row.Best.Attempt + "&exp="+m_Me.Expansion()+"\">" + Math.Round(1000.0*row.Best.Value/(row.Best.Time*(row.Type==2 ? 100.0 : 1.0)), 1)+"</a></td>" +
                    "<td>"+Math.Round(row.GetAverage()/(1000.0 * (row.Type == 2 ? 100.0 : 1.0)), 1)+"</td><td>"+App.m_Npcs[m_Me.Expansion()][row.NpcID].Name+"</td></tr>");
        }
        m_Rankings.Append("</tbody></table>");


        // PvP Information
        if (m_Me.RefHonor == null)
            return;
        // Lifetime rank
        m_LifeTimeRank = m_Me.LifeTimeRank;
        // Today
        if (DateTimeOffset.FromUnixTimeMilliseconds(App.GetArmoryData(m_Me.LatestUpdate).Uploaded).Date == DateTime.Today)
        {
            foreach (var data in amData)
            {
                TimeSpan span = DateTime.Today - DateTimeOffset.FromUnixTimeMilliseconds(data.Uploaded).Date;
                if (span == TimeSpan.FromDays(1) && App.m_RefHonor[m_Me.Expansion()].ContainsKey(data.Ref_Honor))
                {
                    m_Today.HK = m_Me.RefHonor.HK - App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].HK;
                    m_Today.DK = m_Me.RefHonor.DK - App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].DK;
                    m_Today.Honor = m_Me.RefHonor.Honor - App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].Honor;
                    break;
                }
                if (span > TimeSpan.FromDays(1))
                    break;
            }
        }
        // Yesterday
        DB_am_data yesterday = null;
        foreach (var data in amData)
        {
            TimeSpan span = DateTime.Today - DateTimeOffset.FromUnixTimeMilliseconds(data.Uploaded).Date;
            if (yesterday == null && span == TimeSpan.FromDays(2))
            {
                yesterday = data;
                continue;
            }
            if (yesterday != null && span == TimeSpan.FromDays(3) && App.m_RefHonor[m_Me.Expansion()].ContainsKey(yesterday.Ref_Honor) && App.m_RefHonor[m_Me.Expansion()].ContainsKey(data.Ref_Honor))
            {
                m_Yesterday.HK = App.m_RefHonor[m_Me.Expansion()][yesterday.Ref_Honor].HK - App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].HK;
                m_Yesterday.DK = App.m_RefHonor[m_Me.Expansion()][yesterday.Ref_Honor].DK - App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].DK;
                m_Yesterday.Honor = App.m_RefHonor[m_Me.Expansion()][yesterday.Ref_Honor].Honor - App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].Honor;
                break;
            }
            if (yesterday == null && span > TimeSpan.FromDays(2))
                break;
        }
        // This week
        long lastReset = Utility.ConvertToTimestamp(DateTime.Today
            .AddDays(-(int) DateTime.Today.DayOfWeek - 7 + App.m_Server[m_Me.ServerID].PvPReset).ToUniversalTime());
        DB_am_data thisWeekMark = null;
        foreach (var data in amData)
        {
            if (data.Uploaded >= lastReset && App.m_RefHonor[m_Me.Expansion()].ContainsKey(data.Ref_Honor))
            {
                m_ThisWeek.HK = m_Me.RefHonor.HK - App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].HK;
                m_ThisWeek.DK = m_Me.RefHonor.DK - App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].DK;
                m_ThisWeek.Honor = m_Me.RefHonor.Honor - App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].Honor;
            }
            else
            {
                thisWeekMark = data;
                break;
            }
        }
        // last week
        if (thisWeekMark != null)
        {
            long lastReset2 = Utility.ConvertToTimestamp(DateTime.Today
                .AddDays(-(int) DateTime.Today.DayOfWeek - 7 + App.m_Server[m_Me.ServerID].PvPReset).ToUniversalTime());
            foreach (var data in amData)
            {
                if (m_LastWeek.Honor==0 && data.Uploaded >= lastReset2 && data.Uploaded < lastReset && App.m_RefHonor[m_Me.Expansion()].ContainsKey(data.Ref_Honor))
                {
                    m_LastWeek = App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor];
                    m_CurrentWeekChange = (int)(m_Me.RefHonor.Rank * 5000.0 + 5000.0 * m_Me.RefHonor.Progress / 1000.0 -
                                                m_LastWeek.Rank * 5000 +
                                                5000.0 * m_LastWeek.Progress / 1000.0);
                    continue;
                }
                if (data.Uploaded < lastReset2 && App.m_RefHonor[m_Me.Expansion()].ContainsKey(data.Ref_Honor))
                {
                    m_LastWeekChange = (int)(m_LastWeek.Rank * 5000.0 + 5000.0 * m_LastWeek.Progress / 1000.0 -
                                       App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].Rank * 5000 +
                                       5000.0 * App.m_RefHonor[m_Me.Expansion()][data.Ref_Honor].Progress / 1000.0);
                    break;
                }
            }
        }
        if (m_CurrentWeekChange == 0)
            m_CurrentWeekChange = (int)(m_Me.RefHonor.Progress/1000.0 * 5000.0);
    }
}