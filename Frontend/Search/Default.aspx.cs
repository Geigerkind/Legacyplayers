using System;
using System.Linq;
using System.Text;
using RPLL;

public partial class Search_Default : System.Web.UI.Page
{
    public StringBuilder m_TableGuilds = new StringBuilder();
    public StringBuilder m_TablePlayer = new StringBuilder();
    public int m_CurPage = 0;
    public int m_LastPage = 0;

    public int m_CharLength = 0;
    public int m_GuildLength = 0;

    public string m_RealmList = "";
    
    private DBChars[] FilterPlayer()
    {
        if (true || IsPostBack)
        {
            pmRealm.Value = Utility.SecureInput(pmRealm.Value);
            pmFaction.Value = Utility.SecureInput(pmFaction.Value);
            pmClass.Value = Utility.SecureInput(pmClass.Value);
            pmName.Value = Utility.SecureInput(pmName.Value);
            var query = App.m_Chars.Values.Where(x => x.LatestUpdate > 0 && x.OwnerId == 0 && x.CharId >= 301000); // Dummy to be able to recycle the query
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
            if (pmClass.Value != "0")
            {
                short id = 0;
                if (Int16.TryParse(pmClass.Value, out id))
                    query = query.Where(x => x.RefMisc.Class == id-1);
            }
            if (pmName.Value != "")
            {
                string fil = pmName.Value.ToLower();
                query = query.Where(x => x.Name.ToLower().Contains(fil)).OrderByDescending(x => x.Name.ToLower().StartsWith(fil));
            }
            return query.ToArray();
            //return query.Take(m_CurPage * 20 + 21).ToArray();
        }
        return new DBChars[0];
    }

    private DBGuilds[] FilterGuilds()
    {
        if (true || IsPostBack)
        {
            pmFaction.Value = Utility.SecureInput(pmFaction.Value);
            pmName.Value = Utility.SecureInput(pmName.Value);
            var query = App.m_Guilds.Values.Where(x => x.ServerID > 0); // Dummy to be able to recycle the query
            if (pmFaction.Value != "0")
            {
                short id = 0;
                if (Int16.TryParse(pmFaction.Value, out id))
                    query = query.Where(x => x.Faction == id);
            }
            if (pmName.Value != "")
            {
                string fil = pmName.Value.ToLower();
                query = query.Where(x => x.Name.ToLower().Contains(fil)).OrderByDescending(x => x.Name.ToLower().StartsWith(fil));
            }
            return query.ToArray();
            //return query.Take(m_CurPage * 20 + 21).ToArray();
        }
        return new DBGuilds[0];
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        Int32.TryParse(Utility.GetQueryString(Request, "page", "0"), out m_CurPage);
        //App.GetGuild(999999999);
        //App.GetChar(999999999);
        Utility.GetRealmList(ref pmRealm, false, 0, true);
        Utility.GetClassList(ref pmClass);
        Utility.GetFactionList(ref pmFaction);

        // Search
        if (Utility.GetQueryString(Request, "search", "") != "" && pmName.Value == "")
        {
            pmName.Value = Utility.GetQueryString(Request, "search", "");
        }

        // Save and load cookies
        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "Search_Name", pmName.Value);
            Utility.SetCookie(Response, Request, "Search_Realm", pmRealm.Value);
            Utility.SetCookie(Response, Request, "Search_Faction", pmFaction.Value);
            Utility.SetCookie(Response, Request, "Search_Class", pmClass.Value);
        }
        else
        {
            if (pmName.Value == "")
                pmName.Value = Utility.GetCookie(Request, "Search_Name", "");
            pmRealm.Value = Utility.GetCookie(Request, "Search_Realm", "0");
            pmFaction.Value = Utility.GetCookie(Request, "Search_Faction", "0");
            pmClass.Value = Utility.GetCookie(Request, "Search_Class", "0");
        }

        DBChars[] chars = FilterPlayer();
        DBGuilds[] guilds = FilterGuilds();

        m_LastPage = (((chars.Length > guilds.Length) ? chars.Length : guilds.Length) - 1) / 20;

        m_CharLength = chars.Length;
        m_GuildLength = guilds.Length;

        // TODO: Properly size images!
        var imgType = Utility.GetImageType(Request, "png");
        for (int i = m_CurPage * 20; i < m_CurPage * 20 + 20; ++i)
        {
            
            if (m_CharLength > i)
            {
                m_TablePlayer.Append(
                    "<tr class=\"tabf"+chars[i].Faction+"\"><td><div class=\"sp bbdesign\" style=\"background-image: url(/Assets/racegender/"+ chars[i].RefMisc.Gender + "-" + chars[i].RefMisc.Race + "."+imgType+")\"></div><div class=\"sp bbdesign\" style=\"background-image: url(/Assets/classes/ccc"+ chars[i].RefMisc.Class + "."+imgType+")\">" +
                    "<div><a href=\"/Armory/?charid="+chars[i].CharId+ "\" class=\"color-c" + chars[i].RefMisc.Class + "\" onmouseover=\"tt_show(this, 5, " + chars[i].CharId + ", [])\">" + chars[i].Name + "</a></div></div></td>" +
                    "<td><a href=\"/Armory/Guild/?guildid="+ chars[i].RefGuild.GuildID + "\" onmouseover=\"tt_show(this, 4, " + chars[i].RefGuild.GuildID + ", [])\">" +
                    App.GetGuild(chars[i].RefGuild.GuildID).Name + 
                    "</td><td>" + App.m_Server[chars[i].ServerID].Name +
                    "</td><td>" + Utility.GetSeenSince(chars[i].Seen) +
                    "</td></tr>");
            }
            if (m_GuildLength > i)
            {
                m_TableGuilds.Append(
                    "<tr class=\"tabf" + guilds[i].Faction +
                    "\"><td><div class=\"sp\" style=\"background: url(/Assets/raids/fac"+ guilds[i].Faction + "."+imgType+")\">" +
                    "<div><a href=\"/Armory/Guild/?guildid=" + guilds[i].ID + "\" onmouseover=\"tt_show(this, 4, " +
                    guilds[i].ID + ", [])\">" + guilds[i].Name +
                    "</a></div></div></td><td>" + App.m_Server[guilds[i].ServerID].Name +
                    "</td></tr>");
            }
        }

        this.Title = "LegacyPlayers | Search";
    }
}