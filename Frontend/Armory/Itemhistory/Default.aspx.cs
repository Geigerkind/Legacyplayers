using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RPLL;

public partial class Armory_ItemHistory_Default : System.Web.UI.Page
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

        this.Title = "LegacyPlayers | Itemhistory";
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
                m_PageBar.Append("<a href=\"?page=" + i + "&charid=" + m_CharID + "\"><div class=\"bbdesign placeholder\" >" + (i + 1) +
                                 "</div></a>");
            else
                m_PageBar.Append("<a href=\"?page=" + i + "&charid=" + m_CharID + "\"><div class=\"bbdesign placeholder\" style=\"color:#f28f45\">" + (i + 1) +
                                 "</div></a>");
        }

        int expansion = App.GetChar(m_CharID).Expansion();
        Dictionary<int, bool> tempDone = new Dictionary<int, bool>();
        Dictionary<int, bool> tempDone2 = new Dictionary<int, bool>();
        List<string> m_HackItemHistory = new List<string>();
        var amDataAsc = App.m_AmData[expansion].Values.Where(x => x.CharID == m_CharID && x.Ref_Gear > 0).OrderBy(x => x.Uploaded).ToArray();
        foreach (DB_am_data t in amDataAsc)
        {
            if (tempDone.ContainsKey(t.Ref_Gear)) continue;
            var date = DateTimeOffset.FromUnixTimeMilliseconds(t.Uploaded).UtcDateTime;
            string someHackStr = "<tr><td>";
            var imgType = Utility.GetImageType(Request, "jpg");
            for (int p = 0; p < 19; ++p)
            {
                var item = App.m_RefGear[expansion][t.Ref_Gear].Slots[p];
                if (item.ItemID <= 0 || tempDone2.ContainsKey(item.ItemID)) continue;
                someHackStr += "<div class=\"item-template-32 qe" + item.Item(expansion).Quality +
                               "\" style=\"background-image: url('/Assets/icons/" + item.Item(expansion).IconName +
                               "." + imgType + "');\"><a href=\"#\">" +
                               item.Item(expansion).Quantity(App.GetChar(m_CharID).ServerID) +
                               "</a><a href=\"/Armory/Item/?i=" + item.ItemID + "&exp=" + expansion +
                               "\"><div onmouseover=\"tt_show(this, 1, " + item.ItemID + ",[]," + expansion +
                               ")\"></div></a></div>";
                tempDone2[item.ItemID] = true;
            }
            someHackStr += "</td><td>" + date.Month + "/" + date.Day + "/" + date.Year + "</td></tr>";
            m_HackItemHistory.Add(someHackStr);
            tempDone[t.Ref_Gear] = true;
        }
        for (int i = m_HackItemHistory.Count - 1 - m_CurPage*20; i >= 0 && i > m_HackItemHistory.Count - 20 - m_CurPage*20; --i)
            m_Table.Append(m_HackItemHistory[i]);
    }
}