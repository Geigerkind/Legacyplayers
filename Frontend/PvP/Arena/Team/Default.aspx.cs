using System;
using System.Linq;
using RPLL;

public partial class PvP_Arena_Team_Default : System.Web.UI.Page
{
    public int mTeamId = 0;
    public DBArena_Team m_Me;
    public DBArena_Data m_Current;

    public string mGraphTime;
    public string mGraphValues;

    public string mTable = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        Int32.TryParse(Utility.GetQueryString(Request, "id", "0"), out mTeamId);
        
        var graphData = App.m_ArenaData[0].Where(x => x.mArenaId == mTeamId).ToArray();
        if (graphData.Length <= 0 || !App.m_ArenaTeams[0].ContainsKey(mTeamId))
        {
            Response.Redirect("/404/");
            return;
        }

        m_Me = App.m_ArenaTeams[0][mTeamId];
        m_Current = graphData[0];
        this.Title = "LegacyPlayers | Team@"+m_Me.mName;

        mGraphTime = string.Join(",", graphData.Select(x => x.mUploaded));
        mGraphValues = string.Join(",", graphData.Select(x => x.mRanking));

        DBChars[] participants;
        if (m_Me.mType == 0)
            participants = App.m_Chars.Values.Where(x => x.ServerID >= 13 && x.RefArena.mArena2v2 == mTeamId).ToArray();
        else if (m_Me.mType == 1)
            participants = App.m_Chars.Values.Where(x => x.ServerID >= 13 && x.RefArena.mArena3v3 == mTeamId).ToArray();
        else
            participants = App.m_Chars.Values.Where(x => x.ServerID >= 13 && x.RefArena.mArena5v5 == mTeamId).ToArray();

        var imgType = Utility.GetImageType(Request, "png");
        foreach (var member in participants)
        {
            var refMisc = member.RefMisc;
            mTable +=
                "<tr> <td><div class=\"sp bbdesign\" style=\"background-image:url(/Assets/racegender/" + refMisc.Gender + "-" + refMisc.Race + "." + imgType + ")\" " +
                "onmouseover=\"tt_show(this, 5," + member.CharId + " ,[])\"><div class=\"sp bbdesign\" style=\"background-image:url(/Assets/classes/c" + refMisc.Class + "." + imgType + ")\"><div class=\"color-c"+refMisc.Class+"\">" +
                member.Name+ "</div></div></td><td><div class=\"sp\" style=\"background-image:url(/Assets/general/fac" + member.Faction + "_32." + imgType + ")\">" +
                "<div>"+App.GetGuild(member.RefGuild.GuildID).Name+"</div></div></td> <td>"+Utility.GetSeenSince(member.Seen)+"</td> </tr>";
        }
    }
}