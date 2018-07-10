using System;
using System.Collections.Generic;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using RPLL;

public partial class Armory_Raids_Default : System.Web.UI.Page
{

    public StringBuilder m_Table = new StringBuilder();
    public StringBuilder m_PageBar = new StringBuilder();
    public int m_CurPage = 0;

    public int m_CharID = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Raids";

        m_CurPage = Int32.Parse(Utility.GetQueryString(Request, "page", "0"));
        m_CharID = Int32.Parse(Utility.GetQueryString(Request, "charid", "0"));

        if (!App.m_Chars.ContainsKey(m_CharID))
        {
            Response.Redirect("/404/");
            return;
        }

        int toLeft = 0;
        if (m_CurPage >= 10)
            toLeft = m_CurPage - 10;
        for (int i = toLeft; i < toLeft + 22; ++i) // Sometimes there may not that many pages
        {
            if (i != m_CurPage)
                m_PageBar.Append("<a href=\"?page=" + i + "&charid="+m_CharID+"\"><div class=\"bbdesign placeholder\" >" + (i + 1) +
                                 "</div></a>");
            else
                m_PageBar.Append("<a href=\"?page=" + i + "&charid="+m_CharID+"\"><div class=\"bbdesign placeholder\" style=\"color:#f28f45\">" + (i + 1) +
                                 "</div></a>");
        }

        var expansion = App.GetChar(m_CharID).Expansion();
        SQLWrapper DB = App.GetDB(expansion +1);
        MySqlDataReader dr =
            DB.Query(
                "SELECT b.instanceid FROM rs_participants a " +
                "LEFT JOIN rs_instance_uploader b ON a.uploaderid = b.id " +
                "WHERE a.charid = " + m_CharID + " GROUP BY b.instanceid ORDER BY b.instanceid DESC LIMIT "+(m_CurPage*20)+", 20").ExecuteReaderRpll();
        var imgType = Utility.GetImageType(Request, "png");
        while (dr.Read())
        {
            // Finding the raid
            // Note: I could also have used linq and removed the loop :/
            foreach (var raid in App.mRSInstances[expansion])
            {
                if (raid.mId != dr.GetInt32(0)) continue;
                m_Table.Append("<tr><td><div class=\"sp bbdesign\" style=\"background:url(/Assets/raids/" + raid.mInstanceId +
                               "." + imgType + ")\"><div><a href=\"/Raids/Viewer/?id=" + raid.mId + "&exp=" +
                               expansion + "\">" + App.m_Instances[raid.mInstanceId].Name + "</a></div></div></td>" +
                               "<td><div class=\"sp\" style=\"background:url(/Assets/general/fac" +
                               App.GetChar(m_CharID).Faction + "_32." + imgType + ")\"><div>" +
                               App.GetGuild(raid.mGuildId).Name + "</div></div></td>" +
                               "<td>" + DateTimeOffset.FromUnixTimeMilliseconds(raid.mEnd).UtcDateTime +
                               "</td></tr>");
                break;
            }
        }
        dr.CloseRpll();
    }
}