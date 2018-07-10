using System;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using RPLL;

public partial class Raids_Bosses_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    private static readonly string m_QueryArg = string.Join(",", Utility.m_BossList.Values.Select(x => string.Join(",", x.Select(y => y.ToString()))));

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Bosses";
        //App.UpdateRaidSpecificData();
        //App.GetChar(0, true);
        //App.GetGuild(0, true);
        Utility.GetClassList(ref pmClass);
        Utility.GetFactionList(ref pmFaction);
        Utility.GetExpansionList(ref pmExpansion);

        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "Bosses_Class", pmClass.Value);
            Utility.SetCookie(Response, Request, "Bosses_Faction", pmFaction.Value);
            Utility.SetCookie(Response, Request, "Bosses_Realm", pmRealm.Value);
            Utility.SetCookie(Response, Request, "Bosses_Expansion", pmExpansion.Value);
        }
        else
        {
            pmClass.Value = Utility.GetCookie(Request, "Bosses_Class", "0");
            pmFaction.Value = Utility.GetCookie(Request, "Bosses_Faction", "0");
            pmRealm.Value = Utility.GetCookie(Request, "Bosses_Realm", "0");
            pmExpansion.Value = Utility.GetCookie(Request, "Bosses_Expansion", "0");
        }

        int expansion = Int32.Parse(pmExpansion.Value);
        Utility.GetRealmList(ref pmRealm, false, expansion);

        var db = App.GetDB(expansion + 1);
        // TODO improve query
        MySqlDataReader dr = db.Query("SELECT a.npcid, c.instanceid, MIN((a.end-a.start)), MAX(a.id), COUNT(a.id) FROM rs_attempts a JOIN rs_instance_uploader b ON a.uploaderid = b.id JOIN rs_instances c ON b.instanceid = c.id WHERE a.killed=1 GROUP BY a.npcid ORDER BY c.instanceid, a.npcid").ExecuteReaderRpll();
        var query = App.m_Rankings.AsQueryable();
        var skQuery = App.m_SpeedkillRankings.AsQueryable();
        if (pmRealm.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmRealm.Value, out id) && id != 0)
            {
                query = query.Where(x => App.GetChar(x.CharID, false).ServerID == id);
                skQuery = skQuery.Where(x => App.GetGuild(x.GuildID, false).ServerID == id);
            }
        }
        if (pmFaction.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmFaction.Value, out id) && id != 0)
            {
                query = query.Where(x => App.GetChar(x.CharID, false).Faction == id);
                skQuery = skQuery.Where(x => App.GetGuild(x.GuildID, false).Faction == id);
            }
    }
        if (pmClass.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmClass.Value, out id) && id != 0)
                query = query.Where(x => App.GetChar(x.CharID, false).RefMisc.Class == id-1);
        }

        var npcspecific = query.GroupBy(x => x.NpcID).ToDictionary(x => x.Key, x => x.ToArray());
        var spkillspecifc = skQuery.GroupBy(x => x.NpcID).ToDictionary(x => x.Key, x => x.OrderBy(y => y.Best.Time).ToArray());
        while (dr.Read())
        {
            try
            {
                var _id = dr.GetInt32(0);
                if (!npcspecific.ContainsKey(_id)) continue;
                var dpsArr = npcspecific[_id].Where(x => x.Type == 0)
                    .OrderByDescending(x => 1000.0 * x.Best.Value / x.Best.Time);
                var hpsArr = npcspecific[_id].Where(x => x.Type == 1)
                    .OrderByDescending(x => 1000.0 * x.Best.Value / x.Best.Time);

                DB_Rankings dps = dpsArr.Any() ? dpsArr.First() : App.m_Rankings[0];
                DB_Rankings hps = hpsArr.Any() ? hpsArr.First() : App.m_Rankings[0];
                DB_SpeedkillRankings sk = spkillspecifc.ContainsKey(_id) ? spkillspecifc[_id].First() : App.m_SpeedkillRankings[0];
                var imgType = Utility.GetImageType(Request, "png");
                m_Table.Append(
                    "<tr><td><div class=\"sp bbdesign\" style=\"background-image:url(/Assets/raids/"+ dr.GetInt16(1) + "."+imgType+")\"><div>" +
                    App.m_Instances[dr.GetInt16(1)].Name +
                    "</div></div></td><td>" + App.GetNpc(dr.GetInt32(0), expansion).Name + "</td>" +
                    "<td><a href=\"/Raids/Viewer/?atmt=" + dps.Best.Attempt + "&exp=" + expansion + "\" onmouseover=\"tt_show(this, 5, " +
                    dps.CharID + ", [])\" class=\"color-c"+ App.GetChar(dps.CharID, false).RefMisc.Class + "\">" + App.GetChar(dps.CharID, false).Name + " (" +
                    Math.Round(1000.0 * dps.Best.Value / dps.Best.Time, 1) +
                    ")</a></td><td><a href=\"/Raids/Viewer/?atmt=" + hps.Best.Attempt +
                    "&exp=" + expansion + "\" onmouseover=\"tt_show(this, 5, " + hps.CharID + ", [])\" class=\"color-c" + App.GetChar(hps.CharID, false).RefMisc.Class + "\">" +
                    App.GetChar(hps.CharID, false).Name + " (" +
                    Math.Round(1000.0 * hps.Best.Value / hps.Best.Time, 1) + ")</a></td>" +
                    "<td><a href=\"/Raids/Viewer/?atmt=" +
                    sk.Best.Attempt + "&exp=" + expansion + "\">" + Math.Round(sk.Best.Time / 1000.0, 2) +
                    " seconds</a></td><td><a href=\"/Raids/?atmt=" + dr.GetInt32(3) + "&exp=" + expansion + "\">" + dr.GetInt32(4) +
                    "</a></td></tr>");
            }
            catch (ArgumentOutOfRangeException ee)
            {
                Response.Write(ee.Message+"<br /><br />");
            }
        }
        
        dr.CloseRpll();
    }
}