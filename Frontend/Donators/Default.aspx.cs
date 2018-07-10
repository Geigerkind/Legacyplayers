using System;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Globalization;
using System.Text;
using RPLL;

public partial class Donators_Default : System.Web.UI.Page
{
    public StringBuilder m_PageBar = new StringBuilder();
    public StringBuilder m_Table = new StringBuilder();
    public int m_CurPage = 0;
    private readonly SQLWrapper DB = App.GetDB();

    protected void Page_Load(object sender, EventArgs e)
    {
        Int32.TryParse(Utility.GetQueryString(Request, "page", "0"), out m_CurPage);
        int toLeft = 0;
        if (m_CurPage >= 10)
            toLeft = m_CurPage - 10;
        for (int i = toLeft; i < toLeft + 22; ++i) // Sometimes there may not that many pages
        {
            if (i != m_CurPage)
                m_PageBar.Append("<a href=\"?page=" + i + "\"><div class=\"bbdesign placeholder\" >" + (i + 1) +
                                 "</div></a>");
            else
                m_PageBar.Append("<a href=\"?page=" + i + "\"><div class=\"bbdesign placeholder\" style=\"color:#f28f45\">" + (i + 1) +
                                 "</div></a>");
        }

        MySqlDataReader dr = DB.Query("SELECT name, type, date, amount, id FROM gn_supporters ORDER BY id DESC LIMIT " + (m_CurPage * 20) + ", 20").ExecuteReaderRpll();
        int Count = 1 + m_CurPage * 20;
        while (dr.Read())
        {
            m_Table.Append("<tr><td class=\"tnum tsmallvalue\">" + Count + "</td><td>" + dr.GetString(0) + "</td><td class=\"ttinytext\">" + ((dr.GetInt16(1) == 0) ? "Donation" : "Patreon") + "</td>" +
                           "<td class=\"tsmalltext\">" + DateTimeOffset.FromUnixTimeSeconds(dr.GetInt32(2)).UtcDateTime.ToString(CultureInfo.CurrentCulture) + "</td><td class=\"tnum tmiddlevalue\">" + (dr.GetInt32(3)/100.0) + "$</td></tr>");
            ++Count;
        }
        dr.CloseRpll();
        this.Title = "LegacyPlayers | Donators";
    }
}