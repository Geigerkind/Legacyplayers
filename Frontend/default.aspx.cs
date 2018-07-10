using System;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Globalization;
using System.Text;
using RPLL;

public partial class Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    public bool m_LoggedIn = false;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Home";
        if (Utility.GetCookie(Request, "RPLL_user") != "")
            m_LoggedIn = true;

        
        MySqlDataReader dr = App.GetDB().Query(@"SELECT name, amount, date FROM gn_supporters ORDER BY id DESC LIMIT 5").ExecuteReaderRpll();
        while (dr.Read())
        {
            m_Table.Append("<tr><td>"+dr.GetString(0)+"</td><td>"+(dr.GetInt32(1)/100.0)+ "$</td><td>" + DateTimeOffset.FromUnixTimeSeconds(dr.GetInt32(2)).UtcDateTime.ToShortDateString() + "</td></tr>");
        }
        dr.CloseRpll();
        
    }
}