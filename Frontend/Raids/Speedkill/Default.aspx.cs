using System;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using MoreLinq;
using RPLL;

public partial class Raids_Speedkill_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();

    private string m_EncounterVal = "12118";
    private int expansion = 0;

    private static void GetEncounterList(ref HtmlSelect select, string encounter, int expansion)
    {
        select.Items.Clear();
        var bosses = (expansion == 0
            ? Utility.m_BossList.Where(x => (x.Key < 32 && !(x.Key >= 1 && x.Key <= 10)) || (x.Key >= 84 && x.Key <= 89)).ToDictionary()
            : Utility.m_BossList.Where(x => x.Key >= 32 && !(x.Key >= 84 && x.Key <= 89)).ToDictionary());
        foreach (var instance in bosses)
        {
            foreach (var npc in instance.Value)
            {
                select.Items.Add(new ListItem(App.GetNpc(npc, expansion).Name, npc.ToString()));
            }
        }
        if (encounter != "None")
        {
            if (select.Items.FindByValue(encounter) == null)
                select.Items.Add(new ListItem("Custom", encounter));
            select.Items.FindByValue(encounter).Selected = true;
        }
    }

    private DB_SpeedkillRankings[] FilterGuilds()
    {
        int enc = 0;
        if (!int.TryParse(m_EncounterVal, out enc) || enc == 0)
            return new DB_SpeedkillRankings[0];

        var query = App.m_SpeedkillRankings.Where(x => x.NpcID == enc);

        if (pmFaction.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmFaction.Value, out id) && id != 0)
                query = query.Where(x => App.GetGuild(x.GuildID).Faction == id);
        }
        if (pmRealm.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmRealm.Value, out id) && id != 0)
                query = query.Where(x => App.GetGuild(x.GuildID).ServerID == id);
        }
        if (pmSelection.Value == "0")
            return query.OrderBy(x => x.GetAverage()).ToArray();
        return query.OrderBy(x => x.Best.Time).ToArray();
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Speedkill";
        //App.UpdateRaidSpecificData();
        Utility.GetExpansionList(ref pmExpansion);
        Utility.GetFactionList(ref pmFaction);

        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "Speedkills_Faction", pmFaction.Value);
            Utility.SetCookie(Response, Request, "Speedkills_Realm", pmRealm.Value);
            Utility.SetCookie(Response, Request, "Speedkills_Expansion", pmExpansion.Value);
            Utility.SetCookie(Response, Request, "Speedkills_Encounter", pmEncounter.Value);
            Utility.SetCookie(Response, Request, "Speedkills_Selection", pmSelection.Value);
            m_EncounterVal = pmEncounter.Value;
        }
        else
        {
            pmFaction.Value = Utility.GetCookie(Request, "Speedkills_Faction", "0");
            pmRealm.Value = Utility.GetCookie(Request, "Speedkills_Realm", "0");
            pmSelection.Value = Utility.GetCookie(Request, "Speedkills_Selection", "0");
            pmExpansion.Value = Utility.GetCookie(Request, "Speedkills_Expansion", "0");
            GetEncounterList(ref pmEncounter, "None", expansion);
            pmEncounter.Value = Utility.GetCookie(Request, "Speedkills_Encounter", "12118");
            m_EncounterVal = pmEncounter.Value;
            
        }
        
        if (Utility.GetQueryString(Request, "exp", "") != "")
            pmExpansion.Value = Utility.GetQueryString(Request, "exp", "0");

        expansion = int.Parse(pmExpansion.Value);
        Utility.GetRealmList(ref pmRealm, false, expansion);
        var bosses = (expansion == 0
            ? Utility.m_BossList.Where(x => (x.Key < 32 && !(x.Key >= 1 && x.Key <= 10)) || (x.Key >= 84 && x.Key <= 89)).ToDictionary()
            : Utility.m_BossList.Where(x => x.Key >= 32 && !(x.Key >= 84 && x.Key <= 89)).ToDictionary());
        bool foundNpc = bosses.Any(instance => instance.Value.Any(npc => m_EncounterVal == npc.ToString()));
        if (!foundNpc)
            m_EncounterVal = bosses.First().Value[0].ToString();
        
        GetEncounterList(ref pmEncounter, "None", expansion);
        GetEncounterList(ref pmEncounter, m_EncounterVal, expansion);

        short counter = 1;
        var searchspace = FilterGuilds();

        if (searchspace.Length == 0)
            return;

        searchspace = (pmSelection.Value == "1") ? searchspace : searchspace.Where(x => x.Average.Count(y => y.Time > 0) >= 5).ToArray();
        int bestTime = (searchspace[0] == null) ? 1 : (pmSelection.Value == "0")
            ? searchspace[0].GetAverage()
            : searchspace[0].Best.Time;
        foreach (var guild in searchspace)
        {
            DBGuilds gInfo = App.GetGuild(guild.GuildID);
            if (gInfo.ServerID <= 0 || gInfo.ServerID >= App.m_Server.Length) continue;
            int time, atmt;
            uint killed = 0;
            time = atmt = 0;
            if (pmSelection.Value == "0")
            {
                time = guild.GetAverage();
                atmt = guild.Average[0].Attempt;
                killed = guild.Average[0].Killed;
            }
            else
            {
                time = guild.Best.Time;
                atmt = guild.Best.Attempt;
                killed = guild.Best.Killed;
            }

            m_Table.Append("<tr><td>"+ (counter++) +"</td><td><div class=\"tstatusbar bgcolor-f"+gInfo.Faction+"\" style=\"width: "+(100.0*bestTime/time)+"%;\">" +
                           "<div><a href=\"/Armory/Guild/?guildid="+guild.GuildID+"\" onmouseover=\"tt_show(this, 4, "+guild.GuildID+",[])\">"+gInfo.Name+" ("+App.m_Server[gInfo.ServerID].Name+")</a></div>" +
                           "<div>"+Math.Round(time/1000.0, 2)+" seconds</div></div></td>" +
                           "<td><a href=\"/Raids/Viewer/?atmt="+atmt+"&exp="+ expansion + "\">"+DateTimeOffset.FromUnixTimeSeconds(killed).UtcDateTime+"</a></td></tr>");
        }

    }
}