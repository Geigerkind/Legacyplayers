using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using RPLL;

public partial class PvP_Arena_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    public int m_Curpage = 0;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        m_Curpage = Int32.Parse(Utility.GetQueryString(Request, "page", "0"));

        if (m_Curpage < 0)
            m_Curpage = 0;
        if (m_Curpage > 10000)
            m_Curpage = 10000;

        this.Title = "LegacyPlayers | Arena";
        Utility.GetRealmList(ref pmRealm, false, 1);
        Utility.GetFactionList(ref pmFaction);

        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "Arena_Type", Utility.SecureInput(pmArena.Value));
            Utility.SetCookie(Response, Request, "Arena_Faction", Utility.SecureInput(pmFaction.Value));
            Utility.SetCookie(Response, Request, "Arena_Realm", Utility.SecureInput(pmRealm.Value));
        }
        else
        {
            pmArena.Value = Utility.SecureInput(Utility.GetCookie(Request, "Arena_Type", "0"));
            pmFaction.Value = Utility.SecureInput(Utility.GetCookie(Request, "Arena_Faction", "0"));
            pmRealm.Value = Utility.SecureInput(Utility.GetCookie(Request, "Arena_Realm", "0"));
        }

        // Filtering the teams now
        var data = App.m_ArenaTeams[0].Where(x => x.Key > 0);
        if (pmRealm.Value != "0")
        {
            short realmid = 0;
            if (short.TryParse(pmRealm.Value, out realmid) && realmid != 0)
                data = data.Where(x => x.Value.mServer == realmid);
        }
        short arenaid = 0;
        short.TryParse(pmArena.Value, out arenaid);
        data = data.Where(x => x.Value.mType == arenaid);

        var arenaParticipants = App.m_Chars.Values.Where(x => x.ServerID >= 13);
        if (pmFaction.Value != "0")
        {
            short factionid = 0;
            if (short.TryParse(pmFaction.Value, out factionid) && factionid != 0)
                arenaParticipants = arenaParticipants.Where(x => x.Faction == factionid);
        }
        Tuple<int, int>[] arenaParticipantKeys;
        if (arenaid == 0) arenaParticipantKeys = arenaParticipants.Select(x => new Tuple<int, int>(x.CharId, x.RefArena.mArena2v2)).ToArray();
        else if (arenaid == 1) arenaParticipantKeys = arenaParticipants.Select(x => new Tuple<int, int>(x.CharId, x.RefArena.mArena3v3)).ToArray();
        else arenaParticipantKeys = arenaParticipants.Select(x => new Tuple<int, int>(x.CharId, x.RefArena.mArena5v5)).ToArray();

        data = data.Where(x => arenaParticipantKeys.Any(y => y.Item2 == x.Key));
        Dictionary<int, DBArena_Data> rating = new Dictionary<int, DBArena_Data>();
        foreach (var arenaData in App.m_ArenaData[0])
        {
            if (!rating.ContainsKey(arenaData.mArenaId) && data.Any(x => x.Key == arenaData.mArenaId)) // Second check can be removed Performance vs memory!
                rating[arenaData.mArenaId] = arenaData;
        }
        var dataKeys = data.OrderByDescending(x => rating[x.Key].mRanking).Select(x => x.Key).Skip(m_Curpage * 20).Take(20).ToArray();
        var imgType = Utility.GetImageType(Request, "png");
        for (int i = 0; i < dataKeys.Length; ++i)
        {
            int teamId = dataKeys[i];
            var team = App.m_ArenaTeams[0][teamId];
            var participants = arenaParticipantKeys.Where(x => x.Item2 == teamId).Select(x => x.Item1).ToArray();
            int faction = App.GetChar(participants[0], false).Faction;

            m_Table.Append("<tr class=\"tabf"+ faction + "\">");
            m_Table.Append("<td>"+(i+1)+"</td>");
            m_Table.Append("<td><div class=\"sp\" style=\"background-image:url(/Assets/general/fac" + faction + "_32." + imgType + ")\"><div><a href=\"/PvP/Arena/Team/?id="+teamId+"\">" + team.mName +"</a></div></div></td>");
            m_Table.Append("<td>");
            foreach (int t in participants)
            {
                var refMisc = App.GetChar(t, false).RefMisc;
                m_Table.Append("<div class=\"sp bbdesign\" style=\"background-image:url(/Assets/racegender/"+refMisc.Gender+"-"+refMisc.Race+"."+imgType+ ")\" onmouseover=\"tt_show(this, 5,"+t+" ,[])\"><div class=\"sp bbdesign\" style=\"background-image:url(/Assets/classes/c" + refMisc.Class + "." + imgType + ")\"></div></div>");
            }
            m_Table.Append("</td>");
            m_Table.Append("<td>"+rating[teamId].mRanking+"</td>" +
                           "<td>" + rating[teamId].mGames + "</td>" +
                           "<td>" + rating[teamId].mWins + "</td>" +
                           "<td>" + (rating[teamId].mGames-rating[teamId].mWins) + "</td>" +
                           "<td>" + Utility.GetSeenSince(rating[teamId].mUploaded) + "</td> </tr>");
        }
    }
}