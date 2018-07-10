using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RPLL;

public partial class Armory_GuildList_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    public int m_CurPage = 0;
    public string m_Realm = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Guild List";
        Int32.TryParse(Utility.GetQueryString(Request, "page", "0"), out m_CurPage);
        Utility.GetRealmList(ref pmRealm);
        Utility.GetFactionList(ref pmFaction);
        
        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "GuildList_Realm", pmRealm.Value);
            Utility.SetCookie(Response, Request, "GuildList_Faction", pmFaction.Value);
        }
        else
        {
            pmRealm.Value = Utility.GetCookie(Request, "GuildList_Realm", "0");
            pmFaction.Value = Utility.GetCookie(Request, "GuildList_Faction", "0");
        }

        if (pmRealm.Value != "0")
        {
            short id = 0;
            if (Int16.TryParse(pmRealm.Value, out id))
                m_Realm = App.m_Server[id].Name;
        }
        else
        {
            m_Realm = "Any Realm";
        }

        DBGuilds[] guilds = FilterGuilds();
        var subQuery = App.m_Chars.Values.Where(x => x.ServerID > 0 && guilds.Any(y => y.ID == x.RefGuild.GuildID)).ToArray();
        var subProgressArr = App.m_GuildProgress.Where(x => guilds.Any(y => y.ID == x.GuildID)).ToArray();
        for (int i = 0; i < 20; ++i)
        {
            if (guilds.Length > i)
            {
                var query = subQuery.Where(x => x.RefGuild.GuildID == guilds[i].ID);
                var dbCharses = query as DBChars[] ?? query.ToArray();
                int member = dbCharses.Count();
                int totHK = dbCharses.Sum(x => x.RefHonor.HK);
                int member_60 = dbCharses.Count(x => x.RefMisc.Level == 60);
                m_Table.Append("<tr class=\"tabf"+guilds[i].Faction+"\">");
                m_Table.Append("<td>"+(m_CurPage*20+i+1)+"</td>");
                m_Table.Append("<td><a href=\"/Armory/Guild/?guildid="+ guilds[i].ID + " \" onmouseover=\"tt_show(this, 4, " + guilds[i].ID + ", [])\">" + guilds[i].Name + "</a></td>");
                m_Table.Append("<td>" + GenerateProgress(guilds[i].ID, subProgressArr) + "</td>");
                m_Table.Append("<td>"+member+"</td>");
                m_Table.Append("<td>"+member_60+"</td>");
                m_Table.Append("<td>"+totHK+"</td>");
                m_Table.Append("<td>"+(totHK/(member == 0 ? 1 : member))+"</td>");
                m_Table.Append("<td>0</td></tr>");
            }
        }

    }
    
    private string GenerateProgress(int _GuildID, DB_am_guild_progress[] sProgresses)
    {
        StringBuilder prg = new StringBuilder();
        var imgType = Utility.GetImageType(Request, "png");
        var progress = sProgresses.Where(x => x.GuildID == _GuildID).GroupBy(x => x.InstanceID).OrderBy(x => x.Key).ToArray();
        foreach (IGrouping<int, DB_am_guild_progress> t in progress)
            prg.Append("<div class=\"sp bbdesign\" style=\"background-image: url(/Assets/raids/"+t.Key+"."+imgType+")\"><div class=\""+((t.Count() == Utility.m_NumPerInstance[t.Key]) ? "positive" : "negative")+"\">"+t.Count()+"/"+ Utility.m_NumPerInstance[t.Key] + "</div></div>");
        return prg.ToString();
    }

    private DBGuilds[] FilterGuilds()
    {
        pmRealm.Value = Utility.SecureInput(pmRealm.Value);
        pmFaction.Value = Utility.SecureInput(pmFaction.Value);

        var query = App.m_Guilds.Values.Where(x => x.ServerID > 0 && x.Name != "Pug Raid");
        if (pmRealm.Value != "0")
        {
            short id = 0;
            if (Int16.TryParse(pmRealm.Value, out id))
                query = query.Where(x => x.ServerID == id);
        }
        if (pmFaction.Value != "0")
        {
            short id = 0;
            if (Int16.TryParse(pmFaction.Value, out id))
                query = query.Where(x => x.Faction == id);
        }
        Dictionary<int, int> progressCount = new Dictionary<int, int>();
        var sbQuery = query.ToArray();
        foreach (var guild in sbQuery)
            progressCount[guild.ID] = 0;
        foreach (var prg in App.m_GuildProgress)
        {
            if (!progressCount.ContainsKey(prg.GuildID))
                progressCount[prg.GuildID] = 0;
            ++progressCount[prg.GuildID];
        }
        return sbQuery.OrderByDescending(x => progressCount[x.ID]).Skip(m_CurPage * 20).Take(20).ToArray();
    }
}