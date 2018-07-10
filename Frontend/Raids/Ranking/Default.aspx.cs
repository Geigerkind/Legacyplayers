using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using MoreLinq;
using RPLL;

public partial class Raids_Ranking_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    public StringBuilder m_Table2 = new StringBuilder();
    public StringBuilder m_Table3 = new StringBuilder();

    private string m_EncounterVal = "00000000000000000001111111111";
    private int expansion = 0;

    public int m_CurPage = 0;

    private void GetEncounterList(ref HtmlSelect select)
    {
        pmEncounter.Items.Clear();
        var bosses = expansion == 0
            ? Utility.m_BossList.Where(x => x.Key < 32 && !(x.Key >= 1 && x.Key <= 10) /*|| (x.Key >= 84 && x.Key <= 89)*/).ToDictionary()
            : Utility.m_BossList.Where(x => x.Key >= 32 && !(x.Key >= 84 && x.Key <= 89)).ToDictionary();
        var count = 0;
        foreach (var instance in bosses)
        {
            if (instance.Key == 31)
            {
                pmEncounter.Items.Add(new ListItem("Naxx - Construct Quarter", "0000000000000000000000000000000000000000000000000000111100000000000"));
                pmEncounter.Items.Add(new ListItem("Naxx - Arachnid Quarter", "0000000000000000000000000000000000000000000000000000000011100000000"));
                pmEncounter.Items.Add(new ListItem("Naxx - Military Quarter", "0000000000000000000000000000000000000000000000000000000000011100000"));
                pmEncounter.Items.Add(new ListItem("Naxx - Plague Quarter", "0000000000000000000000000000000000000000000000000000000000000011100"));
                pmEncounter.Items.Add(new ListItem("Naxx - Frostwyrm Lair", "00000000000000000000000000000000000000000000000000000000000000011"));
            }
            pmEncounter.Items.Add(instance.Key == 0
                ? new ListItem("Single bosses", "1111111")
                : new ListItem(App.m_Instances[instance.Key].Name,
                    "".PadLeft(count, '0').PadRight(instance.Value.Count + count, '1')));
            foreach (var npc in instance.Value)
            {
                ++count;
            }
        }
        if (expansion == 0)
        {
            pmEncounter.Items.Add(new ListItem("MC + BWL", "0000000000000000000111111111111111111"));
            pmEncounter.Items.Add(new ListItem("MC + BWL + AQ40", "0000000000000000000111111111111111111000000111111111"));
            pmEncounter.Items.Add(new ListItem("MC + BWL + AQ40 + Naxx", "0000000000000000000111111111111111111000000111111111111111111111111"));
            pmEncounter.Items.Add(new ListItem("BWL + AQ40", "0000000000000000000000000000011111111000000111111111"));
            pmEncounter.Items.Add(new ListItem("AQ40 + Naxx", "0000000000000000000000000000000000000000000111111111111111111111111"));
        }
        else if (expansion == 1)
        {
            pmEncounter.Items.Add(new ListItem("Kara + Mag", "0000011111111111"));
            pmEncounter.Items.Add(new ListItem("Kara + Mag + SSC", "0000011111111111111111"));
            pmEncounter.Items.Add(new ListItem("Kara + Mag + SSC + TK", "00000111111111111111111111"));
            pmEncounter.Items.Add(new ListItem("SSC + TK", "00000000000000001111111111"));
            pmEncounter.Items.Add(new ListItem("Hyjal + BT + SW", "1111100000000000000000000011111111100000000111111"));
        }
        count = 0;
        foreach (var instance in bosses)
        {
            foreach (var npc in instance.Value)
            {
                pmEncounter.Items.Add(new ListItem(App.GetNpc(npc, expansion).Name, "".PadLeft(count, '0')+"1")); 
                ++count;
            }
        }
        if (pmEncounter.Items.FindByValue(m_EncounterVal) == null)
            pmEncounter.Items.Add(new ListItem("Custom", m_EncounterVal));
        pmEncounter.Items.FindByValue(m_EncounterVal).Selected = true;
    }

    private List<int> GetSelectedNpcs(string key)
    {
        List<int> selected = new List<int>();
        var flattenedList = (expansion == 0
            ? Utility.m_BossList.Where(x => x.Key < 32 && !(x.Key >= 1 && x.Key <= 10) /*|| (x.Key >= 84 && x.Key <= 89)*/).ToDictionary()
            : Utility.m_BossList.Where(x => x.Key >= 32 && !(x.Key >= 84 && x.Key <= 89)).ToDictionary()).Values.SelectMany(x => x).ToArray();
        for (int i = 0; i < key.Length; ++i)
        {
            if (i > flattenedList.Length) break;
            if (key[i] == '1')
                selected.Add(flattenedList[i]);
        }
        return selected;
    }

    private string GetEncounterValue(string npcid)
    {
        var bosses = expansion == 0
            ? Utility.m_BossList.Where(x => x.Key < 32 && !(x.Key >= 1 && x.Key <= 10) /*|| (x.Key >= 84 && x.Key <= 89)*/).ToDictionary()
            : Utility.m_BossList.Where(x => x.Key >= 32 && !(x.Key >= 84 && x.Key <= 89)).ToDictionary();
        var count = 0;
        foreach (var instance in bosses)
        {
            foreach (var npc in instance.Value)
            {
                if (npc.ToString() == npcid)
                    return "".PadLeft(count, '0') + "1";
                ++count;
            }
        }
        return "00000000000000000001111111111";
    }

    private IEnumerable<DB_Rankings> GetSearchSpace(short type)
    {
        //short.TryParse(pmType.Value, out type);
        List<int> selected = GetSelectedNpcs(m_EncounterVal);
        var query = App.m_Rankings.Where(x => x.Type == type && selected.Contains(x.NpcID) && x.CharID >= 301000);
        if (pmRealm.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmRealm.Value, out id) && id != 0)
                query = query.Where(x => App.GetChar(x.CharID).ServerID == id);
        }
        if (pmFaction.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmFaction.Value, out id) && id != 0)
                query = query.Where(x => App.GetChar(x.CharID).Faction == id);
        }
        if (pmClass.Value != "0")
        {
            short id = 0;
            if (short.TryParse(pmClass.Value, out id) && id != 0)
                query = query.Where(x => App.GetChar(x.CharID).RefMisc.Class == id-1); // This might not be changed everywhere xD
        }

        if (pmSelection.Value == "0")
            query = query.Where(x => x.Average.Count(y => y.Time > 0) >= 5);

        if (selected.Count <= 1)
            return query;
        
        List<DB_Rankings> newList = new List<DB_Rankings>();
        foreach (var grp in query.GroupBy(x => new{x.CharID, x.Type})) // Is that correct grouping?
        {
            DB_Rankings temp = new DB_Rankings();
            int value, time, attempt;
            uint killed = 0;
            value = time = attempt = 0;
            int count = grp.Count();
            temp.Average = new List<DB_Ranking>();

            // Checking if all selected bosses have been killed by this character
            if ((grp.Count() < selected.Count)
                && (grp.FirstOrDefault().InstanceID != 0)
            )
            {
                if (grp.FirstOrDefault().InstanceID == 19)
                {
                    if (grp.Count() < selected.Count - 3)
                        continue;
                }
                else continue;
            }

            foreach (var item in grp)
            {
                temp.CharID = item.CharID;
                temp.InstanceID = item.InstanceID;
                temp.NpcID = item.NpcID;
                temp.Type = item.Type;
                temp.Average.Add(new DB_Ranking()
                {
                    Value = (int)item.Average.Average(x => x.Value),
                    Time = (int)item.Average.Average(x => x.Time),
                    Killed = item.Average[0].Killed,
                    Attempt = item.Average[0].Attempt
                });
                value += item.Best.Value;
                time += item.Best.Time;
                if (killed >= item.Best.Killed) continue;
                killed = item.Best.Killed;
                attempt = item.Best.Attempt;
            }
            value /= count;
            time /= count;
            temp.Best = new DB_Ranking()
            {
                Attempt = attempt,
                Killed = killed,
                Time = time,
                Value = value,
            };
            newList.Add(temp);
        }
        return newList;
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Ranking";
        Int32.TryParse(Utility.GetQueryString(Request, "page", "0"), out m_CurPage);
        //App.UpdateRaidSpecificData();
        Utility.GetFactionList(ref pmFaction);
        Utility.GetClassList(ref pmClass);
        Utility.GetExpansionList(ref pmExpansion);

        if (IsPostBack)
        {
            Utility.SetCookie(Response, Request, "Ranking_Selection", Utility.SecureInput(pmSelection.Value));
            Utility.SetCookie(Response, Request, "Ranking_Faction", Utility.SecureInput(pmFaction.Value));
            Utility.SetCookie(Response, Request, "Ranking_Class", Utility.SecureInput(pmClass.Value));
            //Utility.SetCookie(Response, Request, "Ranking_Type", Utility.SecureInput(pmType.Value));
            Utility.SetCookie(Response, Request, "Ranking_Realm", Utility.SecureInput(pmRealm.Value));
            Utility.SetCookie(Response, Request, "Ranking_Expansion", Utility.SecureInput(pmExpansion.Value));
            Utility.SetCookie(Response, Request, "Ranking_Encounter", Utility.SecureInput(pmEncounter.Value));
            m_EncounterVal = Utility.SecureInput(pmEncounter.Value);
        }
        else
        {
            pmSelection.Value = Utility.SecureInput(Utility.GetCookie(Request, "Ranking_Selection", "0"));
            pmFaction.Value = Utility.SecureInput(Utility.GetCookie(Request, "Ranking_Faction", "0"));
            pmClass.Value = Utility.SecureInput(Utility.GetCookie(Request, "Ranking_Class", "0"));
            //pmType.Value = Utility.SecureInput(Utility.GetCookie(Request, "Ranking_Type", "0"));
            pmRealm.Value = Utility.SecureInput(Utility.GetCookie(Request, "Ranking_Realm", "0"));
            pmExpansion.Value = Utility.SecureInput(Utility.GetCookie(Request, "Ranking_Expansion", "0"));
            m_EncounterVal = Utility.SecureInput(Utility.GetCookie(Request, "Ranking_Encounter", "00000000000000000001111111111"));
        }

        expansion = int.Parse(Utility.GetQueryString(Request, "exp", "") == "" ? pmExpansion.Value : Utility.GetQueryString(Request, "exp", "0"));

        Utility.GetRealmList(ref pmRealm, false, expansion);

        if (Utility.GetQueryString(Request, "exp", "") != "")
            pmExpansion.Value = Utility.GetQueryString(Request, "exp", "0");

        GetEncounterList(ref pmEncounter);
        
        var getNPCId = Utility.GetQueryString(Request, "npcid", "");
        if (getNPCId != "")
        {
            pmSelection.Value = "1";
            if (!IsPostBack) Utility.SetCookie(Response, Request, "Ranking_Selection", "1");
            pmEncounter.Value = GetEncounterValue(Utility.SecureInput(getNPCId));
            if (!IsPostBack) Utility.SetCookie(Response, Request, "Ranking_Encounter", Utility.SecureInput(pmEncounter.Value));
        }
        var getClassId = Utility.GetQueryString(Request, "class", "");
        if (getClassId != "")
        {
            pmClass.Value = (Int32.Parse(Utility.SecureInput(getClassId)) + 1).ToString();
            if (!IsPostBack) Utility.SetCookie(Response, Request, "Ranking_Class", Utility.SecureInput(pmClass.Value));
        }

        var searchSpace = (pmSelection.Value == "1")
            ? GetSearchSpace(0).OrderByDescending(x => 1000.0 * x.Best.Value / (x.Best.Time / 1000.0)).ToArray()
            : GetSearchSpace(0).OrderByDescending(x => x.GetAverage()).ToArray();
        var imgType = Utility.GetImageType(Request, "png");
        if (searchSpace.Length > 0)
        {
            var bestValue = (pmSelection.Value == "1")
                ? 1000000.0 * searchSpace[0].Best.Value / searchSpace[0].Best.Time
                : searchSpace[0].GetAverage();
            int count = m_CurPage * 30;
            foreach (var entry in searchSpace.Skip(m_CurPage * 30).Take(30))
            {
                DBChars user = App.GetChar(entry.CharID);
                int value, time, attempt;
                uint killed;
                if (pmSelection.Value == "0")
                {
                    value = entry.GetAverage();
                    time = (int) entry.Average.Average(x => x.Time);
                    killed = entry.Average[0].Killed;
                    attempt = entry.Average[0].Attempt;
                }
                else
                {
                    value = (int) (1000.0 * entry.Best.Value / (entry.Best.Time / 1000.0));
                    time = entry.Best.Time;
                    killed = entry.Best.Killed;
                    attempt = entry.Best.Attempt;
                }

                m_Table.Append("<tr class=\"tabf" + user.Faction + "\"><td>" + ++count +
                               "</td><td><div class=\"sp\" style=\"background-image:url(/Assets/racegender/" +
                               user.RefMisc.Gender + "-" + user.RefMisc.Race + "." + imgType +
                               ")\"></div><div class=\"sp\" style=\"background-image:url(/Assets/classes/ccc" +
                               user.RefMisc.Class + "." + imgType + ")\"></div>" +
                               "<div class=\"tstatusbar bgcolor-c" + user.RefMisc.Class + "\" style=\"width: " +
                               (92.5 * value / bestValue) + "%;\">" +
                               "<div onmouseover=\"tt_show(this, 5, " + user.CharId +
                               ", [])\"><a href=\"/Armory/?charid=" + user.CharId + "\">" + user.Name + "</a> (" +
                               Math.Round(time / 1000.0, 2) + " seconds) (" + App.m_Server[user.ServerID].Name +
                               ") </div>" +
                               "<div><a href=\"/Raids/Viewer/?atmt=" + attempt + "&exp=" + expansion + "\">" +
                               Math.Round(value / 1000.0, 1) + "/s</a></div></div></td>" +
                               //"<td><a href=\"/Raids/Viewer/?atmt="+attempt+"\">"+DateTimeOffset.FromUnixTimeSeconds(killed).UtcDateTime+"</a></td>" +
                               "</tr>");
            }
        }

        // HPS
        searchSpace = (pmSelection.Value == "1")
            ? GetSearchSpace(1).OrderByDescending(x => 1000.0 * x.Best.Value / (x.Best.Time / 1000.0)).ToArray()
            : GetSearchSpace(1).OrderByDescending(x => x.GetAverage()).ToArray();
        if (searchSpace.Length > 0)
        {
            var bestValue = (pmSelection.Value == "1")
                ? 1000000.0 * searchSpace[0].Best.Value / searchSpace[0].Best.Time
                : searchSpace[0].GetAverage();
            var count = m_CurPage * 30;
            foreach (var entry in searchSpace.Skip(m_CurPage * 30).Take(30))
            {
                DBChars user = App.GetChar(entry.CharID);
                int value, time, attempt;
                uint killed;
                if (pmSelection.Value == "0")
                {
                    value = entry.GetAverage();
                    time = (int) entry.Average.Average(x => x.Time);
                    killed = entry.Average[0].Killed;
                    attempt = entry.Average[0].Attempt;
                }
                else
                {
                    value = (int) (1000.0 * entry.Best.Value / (entry.Best.Time / 1000.0));
                    time = entry.Best.Time;
                    killed = entry.Best.Killed;
                    attempt = entry.Best.Attempt;
                }

                m_Table2.Append("<tr class=\"tabf" + user.Faction + "\"><td>" + ++count +
                                "</td><td><div class=\"sp\" style=\"background-image:url(/Assets/racegender/" +
                                user.RefMisc.Gender + "-" + user.RefMisc.Race + "." + imgType +
                                ")\"></div><div class=\"sp\" style=\"background-image:url(/Assets/classes/ccc" +
                                user.RefMisc.Class + "." + imgType + ")\"></div>" +
                                "<div class=\"tstatusbar bgcolor-c" + user.RefMisc.Class + "\" style=\"width: " +
                                (92.5 * value / bestValue) + "%;\">" +
                                "<div onmouseover=\"tt_show(this, 5, " + user.CharId +
                                ", [])\"><a href=\"/Armory/?charid=" + user.CharId + "\">" + user.Name + "</a> (" +
                                Math.Round(time / 1000.0, 2) + " seconds) (" + App.m_Server[user.ServerID].Name +
                                ") </div>" +
                                "<div><a href=\"/Raids/Viewer/?atmt=" + attempt + "\">" +
                                Math.Round(value / 1000.0, 1) + "/s</a></div></div></td>" +
                                //"<td><a href=\"/Raids/Viewer/?atmt="+attempt+"\">"+DateTimeOffset.FromUnixTimeSeconds(killed).UtcDateTime+"</a></td>" +
                                "</tr>");
            }
        }

        // TPS
        searchSpace = (pmSelection.Value == "1")
            ? GetSearchSpace(2).OrderByDescending(x => 1000.0 * x.Best.Value / (x.Best.Time / 1000.0)).ToArray()
            : GetSearchSpace(2).OrderByDescending(x => x.GetAverage()).ToArray();
        if (searchSpace.Length > 0)
        {
            var bestValue = (pmSelection.Value == "1")
                ? 1000000.0 * searchSpace[0].Best.Value / searchSpace[0].Best.Time
                : searchSpace[0].GetAverage();
            var count = m_CurPage * 30;
            foreach (var entry in searchSpace.Skip(m_CurPage * 30).Take(30))
            {
                DBChars user = App.GetChar(entry.CharID);
                int value, time, attempt;
                uint killed;
                if (pmSelection.Value == "0")
                {
                    value = entry.GetAverage();
                    time = (int) entry.Average.Average(x => x.Time);
                    killed = entry.Average[0].Killed;
                    attempt = entry.Average[0].Attempt;
                }
                else
                {
                    value = (int) (1000.0 * entry.Best.Value / (entry.Best.Time / 1000.0));
                    time = entry.Best.Time;
                    killed = entry.Best.Killed;
                    attempt = entry.Best.Attempt;
                }

                m_Table3.Append("<tr class=\"tabf" + user.Faction + "\"><td>" + ++count +
                                "</td><td><div class=\"sp\" style=\"background-image:url(/Assets/racegender/" +
                                user.RefMisc.Gender + "-" + user.RefMisc.Race + "." + imgType +
                                ")\"></div><div class=\"sp\" style=\"background-image:url(/Assets/classes/ccc" +
                                user.RefMisc.Class + "." + imgType + ")\"></div>" +
                                "<div class=\"tstatusbar bgcolor-c" + user.RefMisc.Class + "\" style=\"width: " +
                                (92.5 * value / bestValue) + "%;\">" +
                                "<div onmouseover=\"tt_show(this, 5, " + user.CharId +
                                ", [])\"><a href=\"/Armory/?charid=" + user.CharId + "\">" + user.Name + "</a> (" +
                                Math.Round(time / 1000.0, 2) + " seconds) (" + App.m_Server[user.ServerID].Name +
                                ") </div>" +
                                "<div><a href=\"/Raids/Viewer/?atmt=" + attempt + "\">" +
                                Math.Round(value / 100000.0, 1) + "/s</a></div></div></td>" +
                                //"<td><a href=\"/Raids/Viewer/?atmt="+attempt+"\">"+DateTimeOffset.FromUnixTimeSeconds(killed).UtcDateTime+"</a></td>" +
                                "</tr>");
            }
        }
    }
}