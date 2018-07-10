using System;
using System.Collections.Generic;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Text;
using RPLL;

public partial class Loot_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    public int m_CurPage = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Loot";

        if (Utility.GetQueryString(Request, "i", "") != "" && pmItem.Value == "")
        {
            pmItem.Value = Utility.GetQueryString(Request, "i", "");
        }

        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "Loot_Item", pmItem.Value);
        }
        else
        {
            if (pmItem.Value == "")
                pmItem.Value = Utility.GetCookie(Request, "Loot_Item", "");
        }
        
        if (pmItem.Value == "")
            return;

        for (int i = 0; i < 2; ++i)
        {
            List<int> ItemIds = App.m_Items[i].Where(x => x.Value.Name.Contains(pmItem.Value))
                .Select(x => x.Key).ToList();

            if (ItemIds.Count == 0)
                return;

            SQLWrapper db = App.GetDB(i+1);
            m_CurPage = int.Parse(Utility.GetQueryString(Request, "page", "0"));
            var imgType2 = Utility.GetImageType(Request);
            MySqlDataReader dr = db.Query("SELECT itemid FROM rs_loot WHERE itemid IN (" + string.Join(",", ItemIds) +
                                          ") GROUP BY itemid LIMIT " + m_CurPage * 10 + ", 10").ExecuteReaderRpll();
            while (dr.Read())
            {
                DBItems item = App.m_Items[i][dr.GetInt32(0)];
                m_Table.Append(
                    "<tr><td><div class=\"icon-26 bbdesign qe" + item.Quality +
                    "\" style=\"background-image: url(\'/Assets/icons/" + item.IconName + "." + imgType2 + "\')\">" +
                    "<div><a href=\"/Raids/Loot/Item/?item=" + dr.GetInt32(0) + "\" class=\"q" + item.Quality +
                    "\" onmouseover=\"tt_show(this, 1," + dr.GetInt32(0) + ",[])\">[" + item.Name +
                    "]</a></div></div></td></tr>");
            }
            dr.CloseRpll();
        }
    }
}