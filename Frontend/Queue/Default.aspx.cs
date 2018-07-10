using System;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Globalization;
using System.Text;
using RPLL;

public partial class Queue_Default : System.Web.UI.Page
{
    public StringBuilder sb = new StringBuilder();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Queue";

        SQLWrapper db = App.GetDB(1);

        MySqlDataReader dr = db.Query("SELECT b.userid, a.timestamp, a.instanceid, a.progress FROM `RPLL_VANILLA`.rs_progress a LEFT JOIN `RPLL_VANILLA`.gn_uploader b ON a.uploaderid = b.id " +
                                      "UNION " +
                                      "SELECT d.userid, c.timestamp, c.instanceid, c.progress FROM `RPLL_TBC`.rs_progress c LEFT JOIN `RPLL_TBC`.gn_uploader d ON c.uploaderid = d.id").ExecuteReaderRpll();
        
        int count = 1;
        var imgType = Utility.GetImageType(Request, "png");
        while (dr.Read())
        {
            sb.Append("<tr><td class=\"tnum tsmallvalue\">" + count + "</td><td>Normal</td><td>" + App.GetUser(dr.GetInt32(0)).Name +
                      "</td><td>" +
                      DateTimeOffset.FromUnixTimeSeconds(dr.GetInt32(1)).UtcDateTime
                          .ToString(CultureInfo.CurrentCulture) + "</td><td><div class=\"sp" +
                      " bbdesign\" style=\"background-image:url(/Assets/raids/" + dr.GetInt32(2) + "." + imgType + ")\"><div>" + (dr.GetInt32(2)== 0 ? "Armory" : App.m_Instances[dr.GetInt32(2)].Name) +
                      "</div></div></td><td><div class=\"tstatusbar bgcolor-\" style=\"width: " + dr.GetInt16(3) +
                      "%;\"><div>" + dr.GetInt16(3) + "%</div><div></div></div></td></tr>");
            ++count;
        }
        dr.CloseRpll();
    }
}
