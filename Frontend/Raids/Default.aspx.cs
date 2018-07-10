using System;
using System.Collections.Generic;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
using RPLL;

public partial class Raids_Default : System.Web.UI.Page
{
    public StringBuilder m_PageBar = new StringBuilder();
    public StringBuilder m_RaidTable = new StringBuilder();
    public int m_CurPage = 0;

    private string GetDuration(long duration)
    {
        long hours = duration / 3600000;
        long minutes = (duration - hours * 3600000) / 60000;
        long seconds = (duration - hours * 3600000 - minutes * 60000) / 1000;
        return hours.ToString().PadLeft(2, '0') + ":" + minutes.ToString().PadLeft(2, '0') + ":" + seconds.ToString().PadLeft(2, '0');
    }

    private List<DBRS_Instances> GetQueriedList()
    {
        var query = App.mRSInstances[Int32.Parse(pmExpansion.Value)].AsQueryable();
        if (pmName.Value != "")
            query = query.Where(x => App.GetGuild(x.mGuildId, true).Name.ToLower().Contains(pmName.Value.ToLower()));
        if (pmDate.Value != "")
        {
            long ts = 0;
            try
            {
                ts = (DateTime.ParseExact(pmDate.Value, "MM/dd/yyyy", null).ToUniversalTime().Ticks -
                        621355968000000000) / 10000; // Commented out 000 to use milliseconds
            }
            catch (Exception)
            {
                // Do nothing
            }
            if (ts > 0)
                query = query.Where(x => x.mStart >= ts && x.mStart <= ts + 86400000);
        }
        if (pmDuration.Value != "")
        {
            if ((pmDuration.Value[0] == '<' || pmDuration.Value[0] == '>') && pmDuration.Value[1] >= 48 &&
                pmDuration.Value[1] <= 57)
            {
                string durVal = "";
                for (int i = 1;
                    i < pmDuration.Value.Length && pmDuration.Value[i] >= 48 && pmDuration.Value[i] <= 57;
                    ++i)
                    durVal += pmDuration.Value[i];
                var dur = (Int32.Parse(durVal) * 60 * 1000);
                if (pmDuration.Value[0] == '<')
                    query = query.Where(x => (x.mEnd - x.mStart) < dur);
                else
                    query = query.Where(x => (x.mEnd - x.mStart) > dur);
            }
        }
        if (pmServer.Value != "0")
        {
            short serverid = 0;
            if (Int16.TryParse(pmServer.Value, out serverid))
                query = query.Where(x => App.GetGuild(x.mGuildId, true).ServerID == serverid);
        }
        if (pmFaction.Value != "0")
        {
            short factionid = 0;
            if (Int16.TryParse(pmFaction.Value, out factionid))
                query = query.Where(x => App.GetGuild(x.mGuildId, true).Faction == factionid);
        }
        if (pmRaids.Value != "0")
        {
            short raidid = 0;
            if (Int16.TryParse(pmRaids.Value, out raidid))
                query = query.Where(x => x.mInstanceId == raidid);
        }

        // Filter complete private raids
        // TODO: Specify non private raid then that has to be loaded?
        query = query.Where(x => x.mPrivate.Sum(y => y.Value ? 0 : 1) > 0);

        return query.OrderByDescending(x => x.mEnd).Skip(m_CurPage * 20).Take(20).ToList();
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        int expansion = 0;
        int.TryParse(pmExpansion.Value, out expansion);

        this.Title = "LegacyPlayers | Raids";
        Utility.GetRealmList(ref pmServer, false, expansion);
        Utility.GetFactionList(ref pmFaction);
        Utility.GetRaidList(ref pmRaids, false, expansion);
        Utility.GetExpansionList(ref pmExpansion);

        m_CurPage = Int32.Parse(Utility.GetQueryString(Request, "page", "0"));

        if (m_CurPage < 0)
            m_CurPage = 0;
        if (m_CurPage > 10000)
            m_CurPage = 10000;

        int toLeft = 0;
        if (m_CurPage >= 10)
            toLeft = m_CurPage - 10;
        for (int i = toLeft; i < toLeft + 22; ++i) // Sometimes there may not that many pages
        {
            if (i!=m_CurPage)
                m_PageBar.Append("<a href=\"?page=" + i + "\"><div class=\"bbdesign placeholder\" >" + (i + 1) +
                             "</div></a>");
            else
                m_PageBar.Append("<a href=\"?page=" + i + "\"><div class=\"bbdesign placeholder\" style=\"color:#f28f45\">" + (i + 1) +
                                 "</div></a>");
        }
        
        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "RaidSearch_Name", Utility.SecureInput(pmName.Value));
            Utility.SetCookie(Response, Request, "RaidSearch_Date", Utility.SecureInput(pmDate.Value));
            Utility.SetCookie(Response, Request, "RaidSearch_Duration", Utility.SecureInput(pmDuration.Value));
            Utility.SetCookie(Response, Request, "RaidSearch_Realm", Utility.SecureInput(pmServer.Value));
            Utility.SetCookie(Response, Request, "RaidSearch_Faction", Utility.SecureInput(pmFaction.Value));
            Utility.SetCookie(Response, Request, "RaidSearch_Raid", Utility.SecureInput(pmRaids.Value));
            Utility.SetCookie(Response, Request, "RaidSearch_Expansion", Utility.SecureInput(pmExpansion.Value));
        }
        else
        {
            pmName.Value = Utility.SecureInput(Utility.GetCookie(Request, "RaidSearch_Name", ""));
            pmDate.Value = Utility.SecureInput(Utility.GetCookie(Request, "RaidSearch_Date", ""));
            pmDuration.Value = Utility.SecureInput(Utility.GetCookie(Request, "RaidSearch_Duration", ""));
            pmServer.Value = Utility.SecureInput(Utility.GetCookie(Request, "RaidSearch_Realm", "0"));
            pmFaction.Value = Utility.SecureInput(Utility.GetCookie(Request, "RaidSearch_Faction", "0"));
            pmRaids.Value = Utility.SecureInput(Utility.GetCookie(Request, "RaidSearch_Raid", "0"));
            pmExpansion.Value = Utility.SecureInput(Utility.GetCookie(Request, "RaidSearch_Expansion", "0"));
        }

        var queryName = Utility.GetQueryString(Request, "name", "");
        if (queryName != "" && !IsPostBack)
        {
            pmName.Value = Utility.SecureInput(queryName);
            Utility.SetCookie(Response, Request, "RaidSearch_Name", Utility.SecureInput(pmName.Value));
        }
        var queryExp = Utility.GetQueryString(Request, "exp", "");
        if (queryExp != "" && !IsPostBack)
        {
            pmExpansion.Value = Utility.SecureInput(queryExp);
            Utility.SetCookie(Response, Request, "RaidSearch_Expansion", Utility.SecureInput(pmExpansion.Value));
        }

            var imgType = Utility.GetImageType(Request, "png");
        foreach (var raid in GetQueriedList())
        {
            m_RaidTable.Append("<tr><td>" + raid.mId + "</td>");
            m_RaidTable.Append("<td><div class=\"sp\" style=\"background: url(/Assets/raids/fac" +
                                App.GetGuild(raid.mGuildId).Faction + "." + imgType +
                                ")\"><div onmouseover=\"tt_show(this, 4, " + raid.mGuildId +
                                ", [])\"><a href=\"/Armory/Guild/?guildid=" + raid.mGuildId + "\">" +
                                App.GetGuild(raid.mGuildId).Name + "</a></div></div></td>");
            m_RaidTable.Append("<td><div class=\"sp bbdesign\" style=\"background: url(/Assets/raids/" +
                                raid.mInstanceId + "." + imgType + ")\"><div><a href=\"/Raids/Viewer/?id=" +
                                raid.mId + "&exp="+pmExpansion.Value+"\">" + App.m_Instances[raid.mInstanceId].Name +
                                "</a></div></div></td>");
            m_RaidTable.Append("<td>" + DateTimeOffset.FromUnixTimeMilliseconds(raid.mStart).UtcDateTime
                                    .ToString(CultureInfo.CurrentCulture) + "</td>");
            m_RaidTable.Append("<td>" + DateTimeOffset.FromUnixTimeMilliseconds(raid.mEnd).UtcDateTime
                                    .ToString(CultureInfo.CurrentCulture) + "</td>");
            m_RaidTable.Append("<td>" + GetDuration(raid.mEnd - raid.mStart) + "</td>");
            m_RaidTable.Append("<td>" + App.m_Server[App.GetGuild(raid.mGuildId).ServerID].Name +
                                "</td></tr>");
        }
    }
}