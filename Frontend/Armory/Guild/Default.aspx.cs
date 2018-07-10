using System;
using System.Collections.Generic;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using RPLL;

public partial class Armory_Guild_Default : System.Web.UI.Page
{
    public int m_GuildID = 0;
    private Dictionary<short, List<short>> m_Schedule;

    public string mAds = "";

    public DBGuilds m_Me;
    public StringBuilder m_PageBar = new StringBuilder();
    public StringBuilder m_RecentRaids = new StringBuilder();
    public StringBuilder m_ScheduleTable = new StringBuilder();
    public StringBuilder m_ProgressTable = new StringBuilder();
    public StringBuilder m_ItemHistoryTable = new StringBuilder();
    public StringBuilder m_Table = new StringBuilder();
    public int m_CurPage = 0;
    public int expansion = 0;

    public String _TABLEITERATOR = "";

    private Dictionary<short, string> m_ShortInstanceName = new Dictionary<short, string>()
    {
        {16, "ONY"},
        {19, "ZG"},
        {23, "MC"},
        {25, "BWL"},
        {27, "AQ20"},
        {29, "AQ40"},
        {31, "NAXX"},
        { 84, "NMD" },
        { 85, "NMD" },
        { 86, "NMD" },
        { 87, "NMD" },
        { 88, "AZU" },
        { 89, "KZK" },
        { 32, "HYJAL" },
        { 33, "KARA" },
        { 36, "MAG" },
        { 40, "SSC" },
        { 41, "TK" },
        { 52, "BT" },
        { 53, "GL" },
        { 55, "ZA" },
        { 61, "SW" },
        { 90, "KZK" },
    };

    protected void Page_Load(object sender, EventArgs e)
    {
        
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        if ((this.Master as MasterPage).ValidForAds()) mAds = "<ins class=\"adsbygoogle\" style=\"display:inline-block;width:300px;height:250px\" data-ad-client=\"ca-pub-5192077039791210\" data-ad-slot=\"2928397668\"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>";

        var imgType = Utility.GetImageType(Request, "png");
        var imgType2 = Utility.GetImageType(Request, "jpg");
        this.Title = "LegacyPlayers | Guild";
        m_GuildID = Int32.Parse(Utility.GetQueryString(Request, "guildid", "0"));
        m_CurPage = Int32.Parse(Utility.GetQueryString(Request, "page", "0"));
        var guildMem = App.m_Chars.Values.Where(x => x.ServerID > 0 && x.RefGuild.GuildID == m_GuildID).Where(x => x.Seen >= Utility.GetUnixTimeStamp()*1000 - 1000*60*60*24*14);
        var guildMember = guildMem.Select(x => x.CharId).ToDictionary(x => x, x => true);

        int toLeft = 0;
        if (m_CurPage >= 5)
            toLeft = m_CurPage - 5;
        for (int i = toLeft; i < toLeft + 7; ++i) // Sometimes there may not that many pages
        {
            if (i != m_CurPage)
                m_PageBar.Append("<a href=\"?page=" + i + "&guildid=" + m_GuildID +
                                 "\"><div class=\"bbdesign placeholder\" >" + (i + 1) +
                                 "</div></a>");
            else
                m_PageBar.Append("<a href=\"?page=" + i + "&guildid=" + m_GuildID +
                                 "\"><div class=\"bbdesign placeholder\" style=\"color:#f28f45\">" + (i + 1) +
                                 "</div></a>");
        }
        if (!App.m_Guilds.ContainsKey(m_GuildID))
        {
            Response.Redirect("/404/");
            return;
        }
        m_Me = App.GetGuild(m_GuildID);
        expansion = App.m_Server[m_Me.ServerID].Expansion;
        
        // Recent raid list
        m_Schedule = new Dictionary<short, List<short>>();
        foreach (var raid in App.mRSInstances[expansion].Where(x => x.mGuildId == m_GuildID).OrderByDescending(x => x.mEnd).Take(10))
        {
            m_RecentRaids.Append("<tr><td><div class=\"sp bbdesign\" style=\"background:url(/Assets/raids/"+ raid.mInstanceId + "."+imgType+")\"><div>" +
                                 App.m_Instances[raid.mInstanceId].Name + "</div></div></td>" +
                                 "<td><a href=\"/Raids/Viewer/?id=" + raid.mId + "&exp="+expansion+"\">" +
                                 Utility.GetTimeFromMillisecondsWithoutSeconds(raid.mEnd) + "</a></td></tr>");

            short dow = (short) DateTimeOffset.FromUnixTimeMilliseconds(raid.mEnd).UtcDateTime.DayOfWeek;
            if (m_Schedule.ContainsKey(dow))
            {
                if (!m_Schedule[dow].Contains(raid.mInstanceId))
                    m_Schedule[dow].Add(raid.mInstanceId);
            }
            else
            {
                m_Schedule.Add(dow, new List<short>() {raid.mInstanceId});
            }
        }
        
        // Loading the schedule
        short p = 0;
        var weekDays = new[] {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
        foreach (string day in weekDays)
        {
            string instances = "";
            if (m_Schedule.ContainsKey(p))
            {
                for (int i = 0; i < m_Schedule[p].Count; ++i)
                {
                    if (instances == "")
                        instances = m_ShortInstanceName[m_Schedule[p][i]];
                    else
                        instances += ", " + m_ShortInstanceName[m_Schedule[p][i]];
                }
            }

            m_ScheduleTable.Append("<tr><td>" + day + "</td><td>" + instances + "</td></tr>");
            ++p;
        }

        
        // Progress
        // Todo: Handle worldbosses
        foreach (IGrouping<int, DB_am_guild_progress> t in App.m_GuildProgress.Where(x => x.GuildID == m_GuildID)
            .GroupBy(x => x.InstanceID).OrderBy(x => x.Key).ToArray())
            m_ProgressTable.Append("<tr class=\"" +
                                   ((t.Count() == Utility.m_NumPerInstance[t.Key]) ? "positive" : "middle") +
                                   "\" onmouseover=\"tt_show(this, 2, " + m_GuildID + ", [], "+t.Key+")\"><td><div class=\"sp bbdesign\" style=\"background:url(/Assets/raids/" + t.Key + "." + imgType + ")\"><div>" + App.m_Instances[t.Key].Name +
                                   "</div></div></td><td>" + t.Count() + "/" + Utility.m_NumPerInstance[t.Key] +
                                   "</td></tr>");

        // Itemhistory
        Dictionary<int, Dictionary<int, bool>> tempDone = new Dictionary<int, Dictionary<int, bool>>();
        Dictionary<int, Dictionary<int, bool>> tempDone2 = new Dictionary<int, Dictionary<int, bool>>();
        
        var amDataDesc = App.m_AmData[expansion].Values.Where(x => guildMember.ContainsKey(x.CharID) && x.Ref_Gear > 0)
            .OrderByDescending(x => x.Uploaded).Take(20).ToArray();
        string date = "";
        string someHackStr = "";
        int maxLimitItems = 100;
        int curItemsCount = 0;
        int maxLimitRows = 10;
        int curRowsCount = 0;
        for (int i=0; i<amDataDesc.Length; ++i)
        {
            if (curRowsCount >= maxLimitRows) break;

            if (!tempDone.ContainsKey(amDataDesc[i].CharID))
            {
                tempDone[amDataDesc[i].CharID] = new Dictionary<int, bool>();
                tempDone2[amDataDesc[i].CharID] = new Dictionary<int, bool>();
            }
            if (tempDone[amDataDesc[i].CharID].ContainsKey(amDataDesc[i].Ref_Gear)) continue;

            string newDate = DateTimeOffset.FromUnixTimeMilliseconds(amDataDesc[i].Uploaded).UtcDateTime.ToShortDateString();
            if (date != newDate)
            {
                if (date != "" && someHackStr != "")
                {
                    someHackStr = "<tr><td>" + someHackStr + "</td><td>" + date + "</td></tr>";
                    m_ItemHistoryTable.Append(someHackStr);
                }
                someHackStr = "";
                date = newDate;
                ++curRowsCount;
            }

            for (int q = 0; q < 19; ++q)
            {
                if (curItemsCount >= maxLimitItems) break;
                var item = App.m_RefGear[expansion][amDataDesc[i].Ref_Gear].Slots[q];
                if (item.ItemID <= 0 || item.Item(expansion).Quality <= 3 ||
                    tempDone2[amDataDesc[i].CharID].ContainsKey(item.ItemID)) continue;
                someHackStr += "<div class=\"item-template-32 qe" + item.Item(expansion).Quality +
                               "\" style=\"background-image: url('/Assets/icons/" + item.Item(expansion).IconName +
                               "."+imgType2+"');\"><a href=\"#\">" + item.Item(expansion).Quantity(App.GetGuild(m_GuildID).ServerID) + "</a><a href=\"/Armory/Item/?i=" +
                               item.ItemID + "\"><div onmouseover=\"tt_show(this, 1, " + item.ItemID +
                               ",[],"+expansion+")\"></div></a><a href=\"/Armory/?charid=" + amDataDesc[i].CharID + "\">" +
                               App.GetChar(amDataDesc[i].CharID).Name + "</a></div>";
                tempDone2[amDataDesc[i].CharID][item.ItemID] = true;
                ++curItemsCount;
            }

            tempDone[amDataDesc[i].CharID][amDataDesc[i].Ref_Gear] = true;
        }
            
        if (someHackStr != "")
        {
            someHackStr = "<tr><td>" + someHackStr + "</td><td>" + date + "</td></tr>";
            m_ItemHistoryTable.Append(someHackStr);
        }

        switch (Utility.GetCookie(Request, "Guild_Table", "0"))
        {
            case "0":
                // Member
                m_Table.Append("<table id=\"member\" class=\"table noborder bbdesign\"><thead><tr><td>Rank</td><td>Name</td><td>Guild Rank</td><td>Level</td><td>Seen</td></tr></thead><tbody>");
                
                foreach (var member in guildMem.OrderBy(x => x.RefGuild.GrankIndex).Skip(m_CurPage * 20).Take(20))
                {
                    m_Table.Append("<tr><td><div class=\"pvprankimage\" style=\"background:url(/Assets/armory/rk"+ member.RefHonor.Rank + "."+imgType+")\"></div></td><td><div class=\"sp bbdesign\" style=\"background-image:url(/Assets/racegender/"+ member.RefMisc.Gender + "-" +
                                   member.RefMisc.Race + "."+imgType+")\"></div>" +
                                         "<div class=\"sp" +
                                         " bbdesign\" style=\"background-image:url(/Assets/classes/ccc"+ member.RefMisc.Class + "."+imgType+")\"><div>" +
                                         "<a class=\"color-c" + member.RefMisc.Class + "\" href=\"/Armory/?charid=" + member.CharId + "\" onmouseover=\"tt_show(this, 5, " + member.CharId + ", [])\">" + member.Name + "</a></div></div></td>" +
                                         "<td>" + member.RefGuild.GrankName + "</td><td>" + member.RefMisc.Level +
                                         "</td><td>" + Utility.GetSeenSince(member.Seen) + "</td></tr>");
                }
                
                break;
            case "1":
                // Top Ranked
                m_Table.Append("<table id=\"topranked\" class=\"table noborder bbdesign\"><thead><tr><td>Server</td><td>Class</td><td>Name</td><td>Type</td><td>Best</td><td>Average</td><td>Encounter</td></tr></thead><tbody>");
                
                foreach (var member in App.m_Rankings.Where(x => guildMember.ContainsKey(x.CharID))
                    .OrderBy(x => x.GetRank()).ThenBy(x => x.GetClassRank()).Skip(m_CurPage * 20).Take(20))
                {
                    m_Table.Append("<tr><td>" + member.GetRank() + "</td><td>" + member.GetClassRank() +
                                            "</td><td>" +
                                            "<div class=\"sp" +
                                            " bbdesign\" style=\"background-image:url(/Assets/racegender/"+ App.GetChar(member.CharID).RefMisc.Gender + "-" +
                                   App.GetChar(member.CharID).RefMisc.Race + "."+imgType+")\"></div><div class=\"sp" +
                                            " bbdesign\" style=\"background-image:url(/Assets/classes/ccc"+ App.GetChar(member.CharID).RefMisc.Class + "."+imgType+")\"><div>" +
                                            "<a class=\"color-c" + App.GetChar(member.CharID).RefMisc.Class + "\" href=\"/Armory/?charid=" + member.CharID + "\" onmouseover=\"tt_show(this, 5, " + member.CharID + ", [])\">" + App.GetChar(member.CharID).Name + "</a></div></div></td>" +
                                            "<td>" + ((member.Type == 0) ? "DPS" : "HPS") + "</td><td>" +
                                            Math.Round(1000.0 * member.Best.Value / member.Best.Time, 1) + "</td><td>" +
                                            Math.Round(member.GetAverage() / 1000.0, 1) + "</td>" +
                                            "<td><div class=\"sp" +
                                            " bbdesign\" style=\"background:url(/Assets/raids/"+ member.InstanceID + "."+imgType+")\"><div><a href=\"/Raids/Viewer/?atmt=" + member.Best.Attempt +
                                            "&exp="+expansion+"\">" + App.GetNpc(member.NpcID, expansion).Name + "</a></div></div></td></tr>");
                }
                
                break;
            case "2":
                // Latest changes
                // !! Going through the whole list here! This may be slow in the future!
                // TODO: Requires good armory filtering to prevent many join/leave events
                m_Table.Append("<table id=\"changes\" class=\"table noborder bbdesign\"><thead><tr><td>Player</td><td>Status Change</td><td>Date</td></tr></thead><tbody>");
                
                var amChanges = App.m_RefGuild[expansion].Where(x => x.Value.GuildID == m_GuildID).Join(App.m_AmData[expansion].Values, x => x.Key, y => y.Ref_Guild, (x, y) => y)
                    .OrderBy(x => x.Uploaded);
                Dictionary<int, int> lastRef = new Dictionary<int, int>();
                List<string> m_HackHistory = new List<string>();
                m_HackHistory.Clear();
                foreach (var change in amChanges)
                {
                    if (!lastRef.ContainsKey(change.CharID))
                        lastRef[change.CharID] = 0;
                    if (lastRef[change.CharID] == change.Ref_Guild) continue;

                    string message = "";
                    DB_am_ref_guild refOG = App.m_RefGuild[expansion][lastRef[change.CharID]];
                    DB_am_ref_guild refNG = App.m_RefGuild[expansion][change.Ref_Guild];
                    if (refOG.GuildID != refNG.GuildID)
                    {
                        if (refOG.GuildID == m_GuildID)
                            message = "Removed from the guild.";
                        else if (refNG.GuildID == m_GuildID)
                            message = "Joined the guild.";
                    }
                    else
                    {
                        if (refOG.GrankIndex != refNG.GrankIndex && refOG.GrankName != refNG.GrankName)
                            message = "Changed Rank From \"" + refOG.GrankName + "\" to \"" + refNG.GrankName + "\"";
                    }

                    if (message != "")
                        m_HackHistory.Add("<tr><td><div class=\"bbdesign\" style=\"background-image:url(/Assets/racegender/"+ App.GetChar(change.CharID).RefMisc.Gender + "-" +
                                          App.GetChar(change.CharID).RefMisc.Race + "."+imgType+")\"></div><div class=\"sp" +
                                          " bbdesign\" style=\"background-image:url(/Assets/classes/ccc"+ App.GetChar(change.CharID).RefMisc.Class + "."+imgType+")\"><div><a class=\"color-c" +
                                          App.GetChar(change.CharID).RefMisc.Class + "\" href=\"/Armory/?charid=" + change.CharID+ "\" onmouseover=\"tt_show(this, 5, " + change.CharID + ", [])\">" + App.GetChar(change.CharID).Name +
                                          "</a></div></div></td>" +
                                          "<td>" + message + "</td>" +
                                          "<td>" + DateTimeOffset.FromUnixTimeMilliseconds(change.Uploaded).UtcDateTime
                                              .ToShortDateString() + "</td></tr>");
                    lastRef[change.CharID] = change.Ref_Guild;
                }

                for (int i = m_HackHistory.Count - 1 - m_CurPage*20; i >= 0 && i > m_HackHistory.Count - 20 - m_CurPage*20; --i)
                    m_Table.Append(m_HackHistory[i]);
                    
                break;
        }
        m_Table.Append("</tbody></table>");
        
    }
}