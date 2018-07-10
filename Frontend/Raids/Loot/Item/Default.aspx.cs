using System;
using System.Collections.Generic;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using RPLL;

public partial class Loot_Item_Default : System.Web.UI.Page
{
    public StringBuilder m_PageBar = new StringBuilder();
    public StringBuilder m_RecentTable = new StringBuilder();
    public StringBuilder m_PlayerTable = new StringBuilder();

    public int m_CurPage = 0;
    private int m_ItemID = 0;

    private struct DB_Loot
    {
        public int CharID;
        public int GuildID;
        public int NpcID;
        public uint TimeStamp;
        public int AttemptID;
        public short InstanceID;
    }
    private List<DB_Loot> m_Loot = new List<DB_Loot>();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Loot: Item";
        var imgType = Utility.GetImageType(Request, "png");

        m_CurPage = Int32.Parse(Utility.GetQueryString(Request, "page", "0"));
        int.TryParse(Utility.GetQueryString(Request, "item", "0"), out m_ItemID);

        int toLeft = 0;
        if (m_CurPage >= 10)
            toLeft = m_CurPage - 10;
        for (int i = toLeft; i < toLeft + 22; ++i) // Sometimes there may not that many pages
        {
            if (i != m_CurPage)
                m_PageBar.Append("<a href=\"?page=" + i + "&item="+m_ItemID+"\"><div class=\"bbdesign placeholder\" >" + (i + 1) +
                                 "</div></a>");
            else
                m_PageBar.Append("<a href=\"?page=" + i + "&item=" + m_ItemID + "\"><div class=\"bbdesign placeholder\" style=\"color:#f28f45\">" + (i + 1) +
                                 "</div></a>");
        }

        if (m_ItemID == 0)
            return;

        for (int i = 0; i < 2; ++i)
        {
            SQLWrapper db = App.GetDB(i + 1);
            MySqlDataReader dr = db
                .Query(
                    "SELECT a.targetid, d.`guildid`, b.`npcid`, ROUND((d.start + b.end)/1000), a.`attemptid`, d.instanceid FROM rs_loot a " +
                    "LEFT JOIN rs_attempts b ON a.`attemptid` = b.`id` " +
                    "LEFT JOIN rs_instance_uploader c ON a.`uploaderid` = b.`uploaderid` " +
                    "LEFT JOIN rs_instances d ON c.`instanceid` = d.`id`" +
                    "WHERE a.itemid = " + m_ItemID).ExecuteReaderRpll();
            while (dr.Read())
                m_Loot.Add(new DB_Loot()
                {
                    CharID = dr.GetInt32(0),
                    GuildID = dr.GetInt32(1),
                    NpcID = dr.GetInt32(2),
                    TimeStamp = (uint) dr.GetInt64(3),
                    AttemptID = dr.GetInt32(4),
                    InstanceID = dr.GetInt16(5)
                });
            dr.CloseRpll();
        }

        var query = m_Loot.OrderByDescending(x => x.TimeStamp).Skip(m_CurPage * 20).Take(20);
        foreach (var recent in query)
        {
            DBChars cr = App.GetChar(recent.CharID);
            m_RecentTable.Append("<tr class=\"tabf"+App.GetGuild(recent.GuildID).Faction+"\"><td><div class=\"sp bbdesign\" style=\"background-image:url(/Assets/raids/"+ recent.InstanceID + "."+imgType+")\">" +
                                 "<div>"+App.GetNpc(recent.NpcID, recent.InstanceID > 31 ? 1 : 0).Name+"</div></div></td>" +
                                 "<td><a href=\"/Armory/Guild/?guilid=" + recent.GuildID + "\" onmouseover=\"tt_show(this, 4, " + recent.GuildID + ",[])\">" + App.GetGuild(recent.GuildID).Name+"</a></td>" +
                                 "<td><a href=\"/Raids/?atmt=" + recent.AttemptID + "\">" + DateTimeOffset.FromUnixTimeSeconds(recent.TimeStamp).UtcDateTime+"</a></td></tr>");

            m_PlayerTable.Append("<tr class=\"tabf" + App.GetGuild(recent.GuildID).Faction + "\"><td><div class=\"sp bbdesign\" style=\"background-image:url(/Assets/racegender/"+ cr.RefMisc.Gender + "-" + cr.RefMisc.Race + "."+imgType+")\"></div><div class=\"sp bbdesign\" style=\"background-image:url(/Assets/classes/ccc"+ cr.RefMisc.Class + "."+imgType+")\">" +
                                 "<div><a href=\"/Armory/?charid=" + recent.CharID + "\" class=\"color-c" + cr.RefMisc.Class + "\" onmouseover=\"tt_show(this, 5, " + recent.CharID + ",[])\">" + cr.Name+"</div></div></td>" +
                                 "<td><a href=\"/Armory/Guild/?guilid=" + cr.RefGuild.GuildID + "\" onmouseover=\"tt_show(this, 4, "+cr.RefGuild.GuildID+",[])\">" + App.GetGuild(cr.RefGuild.GuildID).Name+"</a></td>" +
                                 "<td>"+App.m_Server[cr.ServerID].Name + "</td>" +
                                 "<td><a href=\"/Raids/?atmt="+recent.AttemptID+"\">"+ DateTimeOffset.FromUnixTimeSeconds(recent.TimeStamp).UtcDateTime + "</a></td></tr>");
        }
    }
}