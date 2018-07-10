using System;
using System.Linq;
using System.Text;
using RPLL;

public partial class PvP_Standings_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    public int m_CurPage = 0;

    private DBChars[] FilterChars()
    {
        pmRealm.Value = Utility.SecureInput(pmRealm.Value);
        pmFaction.Value = Utility.SecureInput(pmFaction.Value);
        pmClass.Value = Utility.SecureInput(pmClass.Value);

        short id = 1;
        Int16.TryParse(pmRealm.Value, out id);
        var query = App.m_Chars.Values.Where(x => x.ServerID == id && x.CharId >= 301000).Where(x => x.RefHonor.Standing > 0).Where(x => x.Seen >= Utility.ConvertToTimestamp(DateTime.Today.AddDays(-(int)DateTime.Today.DayOfWeek - 7 + App.m_Server[x.ServerID].PvPReset).ToUniversalTime())); // TODO time function?
        if (pmFaction.Value != "0")
        {
            id = 0;
            if (Int16.TryParse(pmFaction.Value, out id))
                query = query.Where(x => x.Faction == id);
        }
        if (pmClass.Value != "0")
        {
            id = 0;
            if (Int16.TryParse(pmClass.Value, out id))
                query = query.Where(x => x.RefMisc.Class == id - 1);
        }
        return query.OrderBy(x => x.RefHonor.Standing).Skip(m_CurPage*20).Take(20).ToArray();
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Standings";
        Int32.TryParse(Utility.GetQueryString(Request, "page", "0"), out m_CurPage);
        Utility.GetRealmList(ref pmRealm, true, 0);
        Utility.GetFactionList(ref pmFaction);
        Utility.GetClassList(ref pmClass);

        // Save and load cookies
        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "Standing_Realm", pmRealm.Value);
            Utility.SetCookie(Response, Request, "Standing_Faction", pmFaction.Value);
            Utility.SetCookie(Response, Request, "Standing_Class", pmClass.Value);
        }
        else
        {
            pmRealm.Value = Utility.GetCookie(Request, "Standing_Realm", "1");
            pmFaction.Value = Utility.GetCookie(Request, "Standing_Faction", "0");
            pmClass.Value = Utility.GetCookie(Request, "Standing_Class", "0");
        }

        DBChars[] chars = FilterChars();
        var imgType = Utility.GetImageType(Request, "png");

        for (int i = 0; i < 20; ++i)
        {
            if (chars.Length > i)
            {
                m_Table.Append("<tr class=\"tabf" + chars[i].Faction + "\">");
                m_Table.Append("<td>" + chars[i].RefHonor.Standing + "</td>");
                m_Table.Append("<td><div class=\"pvprankimage\" style=\"background: url(/Assets/armory/rk" + chars[i].RefHonor.Rank + "." + imgType + ")\"></div></td>");
                m_Table.Append(
                    "<td><div class=\"sp"+
                    " bbdesign\" style=\"background-image:url(/Assets/racegender/"+ chars[i].RefMisc.Gender + "-" + chars[i].RefMisc.Race + "."+imgType+")\"></div><div class=\"sp bbdesign\" style=\"background-image:url(/Assets/classes/ccc"+ chars[i].RefMisc.Class + "."+imgType+")\"><div><a href=\"/Armory/?charid=" + chars[i].CharId + "\" class=\"color-c" +
                    chars[i].RefMisc.Class + "\" onmouseover=\"tt_show(this, 5, " + chars[i].CharId + ", [])\">" + chars[i].Name + "</a></div></div></td>");
                m_Table.Append("<td><div class=\"sp\" style=\"background-image:url(/Assets/raids/fac"+ chars[i].Faction + "."+imgType+")\"><div><a href=\"/Armory/Guild/?guildid=" + chars[i].RefGuild.GuildID + "\" onmouseover=\"tt_show(this, 4, " + chars[i].RefGuild.GuildID + ", [])\">" +
                               App.m_Guilds[chars[i].RefGuild.GuildID].Name + "</a></div></div></td>");
                m_Table.Append("<td>" + chars[i].RefHonor.HK + "</td>");
                //m_Table.Append("<td>" + chars[i].Honor + "</td>");
                m_Table.Append("<td>" + chars[i].RefHonor.DK + "</td>");
                m_Table.Append("<td>" + Utility.GetSeenSince(chars[i].Seen) + "</td>");
                m_Table.Append("</tr>");
            }
        }
    }
}