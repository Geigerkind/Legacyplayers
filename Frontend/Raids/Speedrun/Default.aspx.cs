using System;
using System.Linq;
using System.Text;
using RPLL;

public partial class Raids_SpeedRun_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Speedrun";
        //App.UpdateRaidSpecificData();
        Utility.GetFactionList(ref pmFaction);
        Utility.GetExpansionList(ref pmExpansion);

        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "Speedkills_Faction", pmFaction.Value);
            Utility.SetCookie(Response, Request, "Speedkills_Realm", pmRealm.Value);
            Utility.SetCookie(Response, Request, "Speedkills_Expansion", pmExpansion.Value);
            Utility.SetCookie(Response, Request, "Speedkills_Encounter", pmEncounter.Value);
            Utility.SetCookie(Response, Request, "Speedkills_Selection", pmSelection.Value);
        }
        else
        {
            pmFaction.Value = Utility.GetCookie(Request, "Speedkills_Faction", "0");
            pmRealm.Value = Utility.GetCookie(Request, "Speedkills_Realm", "0");
            pmExpansion.Value = Utility.GetCookie(Request, "Speedkills_Expansion", "0");
            pmSelection.Value = Utility.GetCookie(Request, "Speedkills_Selection", "0");
            pmEncounter.Value = Utility.GetCookie(Request, "Speedkills_Encounter", "25");
        }
        int expansion = int.Parse(pmExpansion.Value);
        Utility.GetRealmList(ref pmRealm, false, expansion);
        Utility.GetRaidList(ref pmEncounter, true, expansion);
        short instanceid = 0;
        if (!short.TryParse(pmEncounter.Value, out instanceid) || instanceid == 0)
            return;
        
        var query = App.m_SpeedrunRankings.Where(x => x.InstanceID == instanceid);
        if (pmRealm.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmRealm.Value, out id) && id != 0)
                query = query.Where(x => App.GetGuild(x.GuildID).ServerID == id);
        }
        if (pmFaction.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmFaction.Value, out id) && id != 0)
                query = query.Where(x => App.GetGuild(x.GuildID).Faction == id);
        }
        
        var searchSpace = (pmSelection.Value == "0")
            ? query.Where(x => x.Average.Count(y => y.Time > 0) >= 5).OrderBy(x => x.GetAverage()).ToArray()
            : query.OrderBy(x => x.Best.Time).ToArray();

        if (searchSpace.Length == 0)
            return;

        int bestValue = (pmSelection.Value == "0") ? searchSpace[0].GetAverage() : searchSpace[0].Best.Time;
        short count = 1;
        foreach (var guild in searchSpace)
        {
            DBGuilds gInfo = App.GetGuild(guild.GuildID);
            if (gInfo.ServerID <= 0 || gInfo.ServerID >= App.m_Server.Length) continue;
            int time, id;
            uint killed = 0;
            time = id = 0;
            if (pmSelection.Value == "0")
            {
                time = guild.GetAverage();
                killed = guild.Average[0].Killed;
                id = guild.Average[0].InstanceID;
            }
            else
            {
                time = guild.Best.Time;
                id = guild.Best.InstanceID;
                killed = guild.Best.Killed;
            }
            m_Table.Append("<tr><td>"+ count++ +"</td><td><div class=\"tstatusbar bgcolor-f"+ gInfo.Faction +"\" style=\"width: "+(100.0*bestValue/time)+"%;\">" +
                           "<div><a href=\"/Armory/Guild/?guildid="+guild.GuildID+ "\" onmouseover=\"tt_show(this, 4, " + guild.GuildID + ",[])\">" + gInfo.Name+" ("+App.m_Server[gInfo.ServerID].Name+")</a></div>" +
                           "<div>"+TimeSpan.FromMilliseconds(time*100).ToString(@"hh\:mm\:ss") +" hours</div></div></td>" +
                           "<td><a href=\"/Raids/Viewer/?id="+id+"&exp="+ expansion + "\">"+DateTimeOffset.FromUnixTimeSeconds(killed).UtcDateTime+"</a></td></tr>");
        }
    }
}