using System;
using System.Linq;
using System.Text;
using RPLL;

public partial class Armory_Item_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    public int m_CurPage = 0;
    public string m_Icon = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Item";
        Int32.TryParse(Utility.GetQueryString(Request, "page", "0"), out m_CurPage);
        Utility.GetClassList(ref pmClass);
        Utility.GetFactionList(ref pmFaction);
        Utility.GetRealmList(ref pmRealm);

        if (Utility.GetQueryString(Request, "i", "") != "" && pmItem.Value == "")
        {
            pmItem.Value = Utility.GetQueryString(Request, "i", "");
        }

        // Save and load cookies
        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "ItemSearch_Itemid", pmItem.Value);
            Utility.SetCookie(Response, Request, "ItemSearch_Realm", pmRealm.Value);
            Utility.SetCookie(Response, Request, "ItemSearch_Faction", pmFaction.Value);
            Utility.SetCookie(Response, Request, "ItemSearch_Class", pmClass.Value);
        }
        else
        {
            if (pmItem.Value == "")
                pmItem.Value = Utility.GetCookie(Request, "ItemSearch_Itemid", "");
            pmRealm.Value = Utility.GetCookie(Request, "ItemSearch_Realm", "0");
            pmFaction.Value = Utility.GetCookie(Request, "ItemSearch_Faction", "0");
            pmClass.Value = Utility.GetCookie(Request, "ItemSearch_Class", "0");
        }

        int expansion = 0;
        Int32.TryParse(Utility.GetQueryString(Request, "exp", "0"), out expansion);

        if (pmItem.Value != "")
        {
            int id = 0;
            if (Int32.TryParse(pmItem.Value, out id) && id > 0)
            {
                m_Icon = "<div id=\"icon-linkbar\" class=\"q" + App.m_Items[expansion][id].Quality + "\" onmouseover=\"tt_show(this, 1, " +id+", [])\" style=\"background-image: url('/Assets/icons/"+App.m_Icons[App.m_Items[expansion][id].Icon]+"."+Utility.GetImageType(Request)+"')\">"+ App.m_Items[expansion][id].Name + "</div>";
            }
        }

        DBChars[] chars = FilterChars(expansion);

        var imgType = Utility.GetImageType(Request, "png");
        for (int i = 0; i < 20; ++i)
        {
            if (chars.Length <= i) continue;
            m_Table.Append("<tr class=\"tabf"+ chars[i].Faction + "\">");
            m_Table.Append("<td><div class=\"sp bbdesign\" style=\"background-image: url(/Assets/racegender/" + chars[i].RefMisc.Gender + "-" + chars[i].RefMisc.Race + "." + imgType + ")\"></div><div class=\"sp bbdesign\" style=\"background-image: url(/Assets/classes/c" + chars[i].RefMisc.Class + "." + imgType + ")\"><div><a href=\"/Armory/?charid=" + chars[i].CharId+"\" class=\"color-c" + chars[i].RefMisc.Class + "\" onmouseover=\"tt_show(this, 5, " + chars[i].CharId + ", [])\">" + chars[i].Name+"</a></div></div></td>");
            m_Table.Append("<td><a href=\"/Armory/Guild/?guildid="+ chars[i].RefGuild.GuildID + "\" onmouseover=\"tt_show(this, 4, " + chars[i].RefGuild.GuildID + ", [])\">" + App.m_Guilds[chars[i].RefGuild.GuildID].Name +"</a></td>");
            m_Table.Append("<td>"+App.m_Server[chars[i].ServerID].Name + "</td>");
            m_Table.Append("<td>"+Utility.GetSeenSince(chars[i].Seen) +"</td></tr>");
        }
    }

    private DBChars[] FilterChars(int expansion = 0)
    {
        pmItem.Value = Utility.SecureInput(pmItem.Value);
        pmRealm.Value = Utility.SecureInput(pmRealm.Value);
        pmFaction.Value = Utility.SecureInput(pmFaction.Value);
        pmClass.Value = Utility.SecureInput(pmClass.Value);

        var query = App.m_Chars.Values.Where(x => x.LatestUpdate > 0 && App.GetArmoryData(x.LatestUpdate, expansion).Ref_Gear > 0);
        
        if (pmItem.Value != "")
        {
            int id = 0;
            if (Int32.TryParse(pmItem.Value, out id))
                query = query.Where(x => App.m_RefGear[expansion][App.GetArmoryData(x.LatestUpdate, expansion).Ref_Gear].Slots
                    .Select(y => y.ItemID).Contains(id));
            else
                return new DBChars[0];
        }
        else
            return new DBChars[0];
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
                query = query.Where(x => x.RefMisc.Class == id - 1);
        }
        return query.Skip(m_CurPage * 20).Take(20).ToArray();
    }
}