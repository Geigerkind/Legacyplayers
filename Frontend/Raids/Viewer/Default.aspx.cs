using System;
using System.Activities.Expressions;
using System.Activities.Statements;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Globalization;
using MySql.Data.MySqlClient;

namespace RPLL
{
    public static class BoolExtensions
    {
        public static string ToString(this bool? v, string trueString, string falseString, string nullString = "Undefined")
        {
            return v == null ? nullString : v.Value ? trueString : falseString;
        }
        public static string ToString(this bool v, string trueString, string falseString)
        {
            return ToString(v, trueString, falseString, null);
        }
    }

    public partial class Raids_Viewer_Default : System.Web.UI.Page
    {
        public string mDEBUG = !App.mDebug ? "'ctl00_'" : "''";

        public ViewerData m_Data;
        public StringBuilder m_Loot = new StringBuilder();
        public StringBuilder m_Participants = new StringBuilder();
        public string m_Table1;
        public string m_Table2;

        public bool m_MergePets = true;
        public bool m_DistIgnite = false;
        public bool m_FilterIgnite = false;
        public bool m_DistJudgement = false;
        public bool m_FilterJudgement = false;
        public bool m_FilterWorldRaidBuffs = false;
        public bool m_Annotations = true;
        public bool m_FriendlyFire = false;
        public short m_GraphHeal = 0;

        public bool m_PostVanilla = false;
        public int m_Expansion = 0;

        public int[] m_ChartTime;
        public KeyValuePair<int, int>[] m_ChartDamage;
        public KeyValuePair<int, int>[] m_ChartHeal;

        public string MChartConfig = "";
        public string MChartColoring = "";

        public DBRS_Instances LogInfo;
        
        private static readonly List<string> mColors = new List<string>()
        {
            "196,30,59",
            "199, 156, 110",
            "255, 245, 105",
            "250, 250, 250",
            "171, 212, 115",
            "255, 125, 0",
            "105, 204, 240",
            "148, 130, 201",
            "245, 140, 186",
            "0, 112, 222",
            "171,212,115",

            "166,90,79",
            "169, 126, 110",
            "225, 245, 75",
            "225, 225, 255",
            "141, 152, 115",
            "225, 125, 0",
            "75, 204, 120",
            "118, 170, 151",
            "215, 145, 146",
            "0, 112, 222",
            "141,172,115",
        };

        private static readonly List<int> m_FilteredItems = new List<int>()
        {
            // Jujus
            19707,
            19708,
            19709,
            19710,
            19711,
            19712,
            19713,
            19714,
            19715,

            18335, // prestine diamond
            20725, // Nexus crystal
            14344, // Large Brilliant shard
            15410, // Scale of Onyxia

            // Naxxramas scraps
            22374,
            22376,
            22373,
            22375,
            22682,

            // MC cores
            17010,
            17011,

            // Rag
            5266,
            12720,
            18265,
            10605,
            9402,
            13091,
            7991,


            // BWL
            18562,
            22393,
            13072,
            13085,


            // AQ
            20879,
            21321,
            20874,
            20882,
            20878,
            20877,
            21218,
            21324,
            20881,
            20876,
            21323,
            20875,
            20730,
            20726,
            20735, 
            20728,
            17683,
            20736,
            20869,
            20866,
            21287,
            21300,
            21283,
            21293,
            21304,
            21297,
            21298,
            21306,
            21291,
            21292,

            // Ony
            13125,

            // Darkmoon cards
            19227,
            19230,
            19231,
            19232,
            19233,
            19234,
            19235,
            19236,
            19258,
            19259,
            19260,
            19261,
            19262,
            19263,
            19264,
            19265,
            19268,
            19269,
            19270,
            19271,
            19272,
            19273,
            19274,
            19275,
            19276,
            19278,
            19279,
            19280,
            19281,
            19282,
            19283,
            19284,

            // TBC
            22450,
            32229,
            32249,
            32227,
            32228,
            31837,
            31293,
            22449,
            31877,
            29732,
            21903,
            29434,
            30183,
            30311,
            30312,
            30313,
            30314,
            30315,
            30316,
            30317,
            30318,
            30319,
            24213,
            32744,
            32428,
            31304,
            31303,
            32753,
            32231,
            30307,
        };
        public static bool IsAFilteredItem(int itemid)
        {
            return m_FilteredItems.Contains(itemid);
        }

        private int ParseNumber(string token)
        {
            int num = 0;
            if (int.TryParse(token, out num)) return num;
            Response.Redirect("/404/");
            return 0;
        }

        public string SerializeFlags()
        {
            return "'" + m_MergePets.ToString("1", "0") +
                   m_DistIgnite.ToString("1", "0") +
                   m_FilterIgnite.ToString("1", "0") +
                   m_DistJudgement.ToString("1", "0") +
                   m_FilterJudgement.ToString("1", "0") +
                   m_FilterWorldRaidBuffs.ToString("1", "0") +
                   m_FriendlyFire.ToString("1", "0") + "'";
        }

        public void Import()
        {
            string exportString = Utility.GetQueryString(Request, "data", "0");
            if (exportString == "0")
                return;
            exportString = EncryptionHelper.Decrypt(System.Text.Encoding.UTF8.GetString(Base32.Decode(exportString)));

            // Setting format for the string here:
            // id&upl&category&atmt&charid&tarid&start&end

            string[] tokens = exportString.Split('&');

            /*
            if (tokens.Length < 8)
            {
                Response.Redirect("/404/");
                return;
            }*/

            int id = ParseNumber(tokens[0]);
            int upl = ParseNumber(tokens[1]);
            int category = ParseNumber(tokens[2]);
            int atmt = ParseNumber(tokens[3]);
            int charid = ParseNumber(tokens[4]);
            int tarid = ParseNumber(tokens[5]);
            int start = ParseNumber(tokens[6]);
            int end = ParseNumber(tokens[7]);
            int exp = 0;
            if (tokens.Length >= 11)
                exp = ParseNumber(tokens[10]);

            Utility.SetCookie(Response, Request, "Viewer" + id + "," + upl + "_Category", category.ToString(), 300);
            Utility.SetCookie(Response, Request, "Viewer" + id + "," + upl + "_Attempt", atmt.ToString(), 300);
            Utility.SetCookie(Response, Request, "Viewer" + id + "," + upl + "_Target", tarid.ToString(), 300);
            Utility.SetCookie(Response, Request, "Viewer" + id + "," + upl + "_Source", charid.ToString(), 300);
            Utility.SetCookie(Response, Request, "Viewer" + id + "," + upl + "_Lower", start.ToString(), 300);
            Utility.SetCookie(Response, Request, "Viewer" + id + "," + upl + "_Upper", end.ToString(), 300);
            Utility.SetCookie(Response, Request, "Viewer" + id + "," + upl + "_Table1", tokens[8], 300);
            Utility.SetCookie(Response, Request, "Viewer" + id + "," + upl + "_Table2", tokens[9], 300);
            m_Expansion = exp;

            if (upl == 0)
                Response.Redirect("/Raids/Viewer/?id=" + id + "&exp="+exp);
            else
                Response.Redirect("/Raids/Viewer/?id=" + id + "&upl=" + upl + "&exp=" + exp);
        }

        public static string Export(ref ViewerData _data, string mode1, string mode2, int expansion)
        {
            // id&upl&category&atmt&charid&tarid&start&end
            return "https://legacyplayers.com/Raids/Viewer/?data=" +
                   Base32.Encode(System.Text.Encoding.UTF8.GetBytes(EncryptionHelper.Encrypt(_data.Id + "&" + _data.Uploader + "&" + _data.Category + "&" +
                                                                                             _data.Attempt + "&" + _data.Source + "&" + _data.Target + "&" +
                                                                                             _data.Lower + "&" + _data.Upper + "&" + mode1 + "&" + mode2 +"&" + expansion)));
        }
        
        public ViewerData GetViewerData(bool validateFilter = false)
        {
            ViewerData vd = new ViewerData();
            var vdId = 0;
            if (!int.TryParse(Utility.GetQueryString(Request, "id", "0"), out vdId) || vdId == 0)
                Response.Redirect("/404/");
            var vdUploader = 0;
            int.TryParse(Utility.GetQueryString(Request, "upl", "0"), out vdUploader);
            vd.Id = vdId;
            vd.Uploader = vdUploader;
           
            if (IsPostBack)
            {
                Utility.SetCookie(Response, Request, "Viewer" + vd.Id + ","+vd.Uploader+"_Category", pmCategory.Value, 300);
                Utility.SetCookie(Response, Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Attempt", pmAttempt.Value, 300);
                Utility.SetCookie(Response, Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Target", pmTarget.Value, 300);
                Utility.SetCookie(Response, Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Source", pmSource.Value, 300);
                try
                {
                    Utility.SetCookie(Response, Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Lower", ((int)(TimeSpan.Parse(pmLower.Value).TotalMilliseconds)).ToString(), 300);
                    Utility.SetCookie(Response, Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Upper", ((int)(TimeSpan.Parse(pmUpper.Value).TotalMilliseconds)).ToString(), 300);
                }
                catch {}
                var vdCategory = 0;
                int.TryParse(pmCategory.Value, out vdCategory);
                vd.Category = vdCategory;
                var vdAttempt = 0;
                int.TryParse(pmAttempt.Value, out vdAttempt);
                vd.Attempt = vdAttempt;
                var vdTarget = 0;
                int.TryParse(pmTarget.Value, out vdTarget);
                vd.Target = vdTarget;
                var vdSource = 0;
                int.TryParse(pmSource.Value, out vdSource);
                vd.Source = vdSource;
            }
            else
            {
                var vdCategory = 1;
                int.TryParse(Utility.GetCookie(Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Category", "1"), out vdCategory);
                vd.Category = vdCategory;
                var vdAttempt = 0;
                int.TryParse(Utility.GetCookie(Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Attempt", "0"), out vdAttempt);
                vd.Attempt = vdAttempt;
                var vdTarget = 0;
                int.TryParse(Utility.GetCookie(Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Target", "0"), out vdTarget);
                vd.Target = vdTarget;
                var vdSource = 1;
                int.TryParse(Utility.GetCookie(Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Source", "1"), out vdSource);
                vd.Source = vdSource;
                pmLower.Value = TimeSpan.FromMilliseconds(int.Parse(Utility.GetCookie(Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Lower", "0"))).ToString(@"hh\:mm\:ss");
                pmUpper.Value = TimeSpan.FromMilliseconds(int.Parse(Utility.GetCookie(Request, "Viewer" + vd.Id + "," + vd.Uploader + "_Upper", "0"))).ToString(@"hh\:mm\:ss");
                pmCategory.Value = vd.Category.ToString();
                pmAttempt.Value = vd.Attempt.ToString();
                pmTarget.Value = vd.Target.ToString();
                pmSource.Value = vd.Source.ToString();


                if (Request.Form["pmAttempt"] != "" && int.TryParse(Request.Form["pmAttempt"], out vdAttempt) && vdAttempt != 0)
                {
                    vd.Attempt = vdAttempt;
                    pmAttempt.Value = Request.Form["pmAttempt"];
                }

            }

            int uploader = 0;
            int.TryParse(Utility.GetQueryString(Request, "upl", "0"), out uploader);
            vd.Uploader = uploader;
            vd.m_RaidData = RaidData.GetRaidData(vd.Id, uploader, m_PostVanilla);
            var vdLower = 0;
            vdLower = ((int)(TimeSpan.Parse(pmLower.Value).TotalMilliseconds));
            vd.Lower = vdLower;
            var vdUpper = 0;
            vdUpper = ((int)(TimeSpan.Parse(pmUpper.Value).TotalMilliseconds));
            vd.End = vd.Category == 0
                ? (int)(vd.m_RaidData.m_End - vd.m_RaidData.m_Start)
                : vd.Category == 1
                    ? (vd.m_RaidData.m_Attempts.Values.Any(x => App.GetNpc(x.NpcId,m_Expansion).Type == 1)
                        ? vd.m_RaidData.m_Attempts.Values.Where(x => App.GetNpc(x.NpcId,m_Expansion).Type == 1).Max(x => x.End)
                        : (int)(vd.m_RaidData.m_End - vd.m_RaidData.m_Start))
                    : (vd.m_RaidData.m_Attempts.Values.Any(x => App.GetNpc(x.NpcId,m_Expansion).ID == vd.Category)
                        ? vd.m_RaidData.m_Attempts.Values.Where(x => App.GetNpc(x.NpcId,m_Expansion).ID == vd.Category).Max(x => x.End)
                        : (int)(vd.m_RaidData.m_End - vd.m_RaidData.m_Start));
            vd.Upper = vdUpper == 0 ? vd.End : vdUpper;
            
            if (vd.Attempt != 0 && (pmUpper.Value == "0" || pmUpper.Value == "00:00:00") && (pmLower.Value == "0" || pmLower.Value == "00:00:00"))
            {
                vd.Lower = vd.m_RaidData.m_Attempts[vd.Attempt].Start;
                vd.Upper = vd.m_RaidData.m_Attempts[vd.Attempt].End;
            }
            vd.Duration = vd.Upper - vd.Lower;

            if ((pmUpper.Value == "0" || pmUpper.Value == "00:00:00"))
                pmUpper.Value = TimeSpan.FromMilliseconds(vd.Upper).ToString(@"hh\:mm\:ss");
            if ((pmLower.Value == "0" || pmLower.Value == "00:00:00"))
                pmLower.Value = TimeSpan.FromMilliseconds(vd.Lower).ToString(@"hh\:mm\:ss");

            return vd;
        }

        /*
         * It will merge two points beside to each other, using the meanvalue of the timestamp and the sum of the amount
         * This will be done so long, until the limit is surpassed
         */
        public KeyValuePair<int, int>[] DeminishChartData(KeyValuePair<int, int>[] data, int limit)
        {
            while (true)
            {
                if (data.Length <= limit) return data;
                List<KeyValuePair<int, int>> newData = new List<KeyValuePair<int, int>>();

                int i = 1;
                for (; i < data.Length; i += 2)
                {
                    // If the distance between two points is higher than 10 min we need to add another point
                    int extraPoints = (int)((data[i].Key-data[i-1].Key)/600000);
                    for (int p = 0; p < extraPoints / 2; ++p)
                    {
                        newData.Add(new KeyValuePair<int, int>(data[i - 1].Key + (p + 1) * 600000, 0));
                    }
                    for (int p = 0; p < extraPoints/2; ++p)
                    {
                        newData.Add(new KeyValuePair<int, int>((int)Math.Floor((data[i].Key + data[i - 1].Key) / 2.0) + (p+1)*600000, 0));
                    }

                    newData.Add(new KeyValuePair<int, int>((int) Math.Floor((data[i].Key + data[i - 1].Key) / 2.0),
                        data[i].Value + data[i - 1].Value));
                }

                if (i==data.Length)
                    newData.Add(new KeyValuePair<int, int>(data[i - 1].Key, data[i - 1].Value));

                data = newData.ToArray();
            }
        }

        public KeyValuePair<int, int>[] AddChartDataSet(int[] timeStamp, KeyValuePair<int, int>[] data)
        {
            int tsCount = 0;
            int[] newData = new int[timeStamp.Length];

            if (timeStamp.Length <= 1)
                return newData.Select(x => new KeyValuePair<int, int>(x, x)).ToArray();

            int amountSum = 0;
            int curThreshold = (timeStamp[1] - timeStamp[0]) / 2;
            foreach (var point in data)
            {
                tryAgain:
                if (tsCount + 1 < timeStamp.Length)
                {
                    if (curThreshold + timeStamp[tsCount] - point.Key >= 0)
                    {
                        amountSum += point.Value;
                    }
                    else
                    {
                        if (timeStamp[tsCount + 1] + curThreshold - point.Key >= 0)
                        {
                            newData[tsCount] = amountSum;
                            amountSum = point.Value;
                            ++tsCount;
                            if (tsCount + 1 < timeStamp.Length)
                                curThreshold = (timeStamp[tsCount + 1] - timeStamp[tsCount]) / 2;
                        }
                        else
                        {
                            newData[tsCount] = amountSum;
                            amountSum = 0;
                            ++tsCount;
                            if (tsCount + 1 < timeStamp.Length)
                                curThreshold = (timeStamp[tsCount + 1] - timeStamp[tsCount]) / 2;
                            goto tryAgain;
                        }
                    }
                }
                else
                {
                    amountSum += point.Value;
                }
            }
            if (tsCount != 0)
                newData[tsCount] = amountSum;
            if (tsCount + 1 < timeStamp.Length)
            {
                // Fill it up with 0
                for (int i = tsCount + 1; i < timeStamp.Length; ++i)
                    newData[i] = 0;
            }
            return newData.Select(x => new KeyValuePair<int, int>(x, x)).ToArray(); // TODO: workaround for now!
        }

        public string SetElementHider(string element)
        {
            return Utility.GetCookie(Request, "rwel_" + element, "0") != "true" ? "" : " style=\"display:none;\"";
        }

        public string GetElementHider(string element)
        {
            return "<a class=\"grayish\" style=\"float:right\" onclick=\"ToggleElement(this,'" + element + "');\">" + ((Utility.GetCookie(Request, "rwel_" + element, "0") != "true") ? "Hide&nbsp;" : "Show&nbsp;") + "</a>";
        }


        private string GetPlayerName(int charid)
        {
            var chr = App.GetChar(charid);
            if (chr.OwnerId > 0)
                return chr.Name + " (" + App.GetChar(chr.OwnerId, false).Name + ")";
            return chr.Name;
        }

        private int GetSourceColor(int sourceid)
        {
            if (sourceid >= 300000)
            {
                var chr = App.GetChar(sourceid);
                if (chr.OwnerId > 0)
                    return 99;
                return chr.RefMisc.Class;
            }
            return App.GetNpc(sourceid, m_Expansion).Class;
        }
        public string CreateDataTable(DataTableRow[] _Data, short _Type, int _Duration, ref ViewerData _rvData, string mode = "")
        {
            string table = "";
            if (_Type == 0)
            {
                int completeSum = _Data.Sum(x => x.Amount);
                // TODO
                // Npc classes
                for (int i = 0; i < _Data.Length; ++i)
                    table += "<tr><td>" + (i + 1) + "</td><td><div class=\"tstatusbar bgcolor-c" +
                             GetSourceColor(_Data[i].SourceId) +
                             "\" style=\"width: " + Math.Round(100.0 * _Data[i].Amount / _Data[0].Amount, 1) + "%;\">" +
                             "<div onmouseover=\"tt_show(this, 7, " + _Data[i].SourceId + ", [], " + _rvData.Source +
                             ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " +
                             _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt +
                             ", '" + mode + "',"+m_Expansion+","+ SerializeFlags() + ")\" onclick=\"SetSelection('pmSource', '" + _Data[i].SourceId + "')\">" +
                             (_Data[i].SourceId >= 300000
                                 ? GetPlayerName(_Data[i].SourceId)
                                 : App.GetNpc(_Data[i].SourceId, m_Expansion).Name) + " (" + _Data[i].Amount + ")</div>" +
                             "<div>" + Math.Round(1000.0 * _Data[i].Amount / _Duration, 1) + "/s</div></div><td>" + Math
                                 .Round(100.0 * _Data[i].Amount / completeSum, 1)
                                 .ToString("#.0", CultureInfo.InvariantCulture) + "%</td></tr>";
            }
            else if (_Type == 1)
            {
                int completeSum = _Data.Sum(x => x.Amount);
                for (int i = 0; i < _Data.Length; ++i)
                    table += "<tr><td>" + (i + 1) + "</td><td><div class=\"tstatusbar bgcolor-at" +
                             App.GetSpell(_Data[i].SourceId, m_Expansion).Type + "\" style=\"width: " +
                             Math.Round(100.0 * _Data[i].Amount / _Data[0].Amount, 1) + "%;\">" +
                             "<div onmouseover=\"tt_show(this, 6, " + _Data[i].SourceId + ", [], " + _rvData.Source +
                             ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " +
                             _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt +
                             ", '" + mode + "',"+m_Expansion + "," + SerializeFlags()+")\">" + App.GetSpell(_Data[i].SourceId, m_Expansion).Name + " (" + _Data[i].Amount +
                             ")</div>" +
                             "<div>" + Math.Round(1000.0 * _Data[i].Amount / _Duration, 1) + "/s</div></div><td>" + Math
                                 .Round(100.0 * _Data[i].Amount / completeSum, 1)
                                 .ToString("#.0", CultureInfo.InvariantCulture) + "%</td></tr>";
            }
            else if (_Type == 2)
            {
                int completeSum = _Data.Sum(x => x.Amount);
                // TODO
                // Npc classes
                for (int i = 0; i < _Data.Length; ++i)
                    table += "<tr><td>" + (i + 1) + "</td><td><div class=\"tstatusbar bgcolor-c" +
                             GetSourceColor(_Data[i].SourceId) +
                             "\" style=\"width: " + Math.Round(100.0 * _Data[i].Amount / _Data[0].Amount, 1) + "%;\">" +
                             "<div onmouseover=\"tt_show(this, 7, " + _Data[i].SourceId + ", [], " + _rvData.Source +
                             ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " +
                             _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt +
                             ", '" + mode + "',"+m_Expansion + "," + SerializeFlags() + ")\" onclick=\"SetSelection('pmSource', '" + _Data[i].SourceId + "')\">" +
                             (_Data[i].SourceId >= 300000
                                 ? GetPlayerName(_Data[i].SourceId)
                                 : App.GetNpc(_Data[i].SourceId, m_Expansion).Name) + "</div>" +
                             "<div>" + _Data[i].Amount + "</div></div><td>" +
                             Math.Round(100.0 * _Data[i].Amount / completeSum, 1)
                                 .ToString("#.0", CultureInfo.InvariantCulture) + "%</td></tr>";
            }
            else if (_Type == 3)
            {
                int completeSum = _Data.Sum(x => x.Amount);
                for (int i = 0; i < _Data.Length; ++i)
                    table += "<tr><td>" + (i + 1) + "</td><td class=\"deathbar color-at" +
                             App.GetSpell(_Data[i].QueryData.AbilityId, m_Expansion).Type + "\" onmouseover=\"tt_show(this, 6, " + _Data[i].QueryData.TimeStamp + ", [], " + _rvData.Source + ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " + _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt + ", '" + mode + "',"+m_Expansion + "," + SerializeFlags() + ")\"><div>" +
                             App.GetSpell(_Data[i].QueryData.AbilityId, m_Expansion).Name + " (" + _Data[i].QueryData.Amount +
                             ")</div><div class=\"color-c" +
                             GetSourceColor(_Data[i].QueryData.TargetId) + "\">" +
                             (_Data[i].QueryData.TargetId >= 300000
                                 ? GetPlayerName(_Data[i].QueryData.TargetId)
                                 : App.GetNpc(_Data[i].QueryData.TargetId, m_Expansion).Name) + "</div></td><td>" +
                             TimeSpan.FromMilliseconds(_Data[i].QueryData.TimeStamp).ToString(@"hh\:mm\:ss") +
                             "</td></tr>";

            }
            else if (_Type == 4)
            {
                int completeSum = _Data.Sum(x => x.Amount);
                // TODO:
                // Tooltip
                for (int i = 0; i < _Data.Length; ++i)
                    table += "<tr><td>" + (i + 1) + "</td><td class=\"intdisbar\"><div color=\"color-at" +
                             App.GetSpell(_Data[i].QueryData.AbilityId, m_Expansion).Type + "\">" +
                             App.GetSpell(_Data[i].QueryData.AbilityId, m_Expansion).Name + "</div><div class=\"color-c" +
                             GetSourceColor(_Data[i].QueryData.TargetId) + "\">" +
                             (_Data[i].QueryData.TargetId >= 300000
                                 ? GetPlayerName(_Data[i].QueryData.TargetId)
                                 : App.GetNpc(_Data[i].QueryData.TargetId, m_Expansion).Name) + "</div><div color=\"color-at" +
                             App.GetSpell(_Data[i].QueryData.TargetAbilityId, m_Expansion).Type + "\">" +
                             App.GetSpell(_Data[i].QueryData.TargetAbilityId, m_Expansion).Name + "</div></td><td>" + TimeSpan
                                 .FromMilliseconds(_Data[i].QueryData.TimeStamp).ToString(@"hh\:mm\:ss") + "</td></tr>";
            }
            // Healing bar
            else if (_Type == 5)
            {
                if (_Data.Length > 0)
                {
                    // TODO: Minimize this html!
                    // Note: AbilityId is here overhealing amount
                    int completeSum = _Data.Sum(x => x.Amount);
                    // Cause its sorted differently now, we need to look for the highest sum
                    int maxAmount = _Data.Max(x => x.Amount);

                    for (int i = 0; i < _Data.Length; ++i)
                        table += "<tr><td>" + (i + 1) + "</td><td>" +
                                 "<div onmouseover=\"tt_show(this, 7, " + _Data[i].SourceId + ", [], " + _rvData.Source +
                                 ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " +
                                 _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt +
                                 ", '" + mode + "',"+m_Expansion + "," + SerializeFlags() + ")\" onclick=\"SetSelection('pmSource', '" + _Data[i].SourceId +
                                 "')\" class=\"bgcolor-c" +
                                 GetSourceColor(_Data[i].SourceId) +
                                 "\" style=\"display: table; height: 20px; width: " +
                                 Math.Round(100.0 * _Data[i].Amount / maxAmount, 1) + "%;\">" +
                                 "<div class=\"healingbarsep\" style=\"width: " +
                                 Math.Round(100.0 * (_Data[i].QueryData.AbilityId) / _Data[i].Amount, 1) +
                                 "%;\"></div></div>" +
                                 "<div onmouseover=\"tt_show(this, 7, " + _Data[i].SourceId + ", [], " + _rvData.Source +
                                 ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " +
                                 _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt +
                                 ", '" + mode + "',"+m_Expansion + "," + SerializeFlags() + ")\" onclick=\"SetSelection('pmSource', '" + _Data[i].SourceId +
                                 "')\" class=\"tstatusbar healingbar\"  style=\"margin-top: -20px; width: " +
                                 Math.Round(100.0 * _Data[i].Amount / maxAmount, 1) + "%;\">" +
                                 "<div style=\"width: " +
                                 Math.Round(100.0 * (_Data[i].QueryData.Amount) / _Data[i].Amount, 1) + "%;\">" +
                                 "<div>" +
                                 (_Data[i].SourceId >= 300000
                                     ? GetPlayerName(_Data[i].SourceId)
                                     : App.GetNpc(_Data[i].SourceId, m_Expansion).Name) + " (" + _Data[i].QueryData.Amount +
                                 ")</div>" +
                                 "<div> " + Math.Round(1000.0 * _Data[i].QueryData.Amount / _Duration, 1) +
                                 "/s</div></div>" +
                                 "<div style=\"text-align:right\">(" + _Data[i].QueryData.AbilityId + ") " +
                                 Math.Round(1000.0 * _Data[i].QueryData.AbilityId / _Duration, 1) + "/s</div></div>" +
                                 "<td>" + Math
                                     .Round(100.0 * _Data[i].Amount / completeSum, 1)
                                     .ToString("#.0", CultureInfo.InvariantCulture) + "%</td></tr>";
                }
            }
            // Healing bar abilities
            else if (_Type == 6)
            {
                if (_Data.Length > 0)
                {
                    // TODO: Minimize this html!
                    // Note: Querydata.AbilityId is here overhealing amount
                    int completeSum = _Data.Sum(x => x.Amount);
                    // Cause its sorted differently now, we need to look for the highest sum
                    int maxAmount = _Data.Max(x => x.Amount);

                    for (int i = 0; i < _Data.Length; ++i)
                    {
                        var spell = App.GetSpell(_Data[i].SourceId, m_Expansion);
                        table += "<tr><td>" + (i + 1) + "</td><td>" +
                                 "<div onmouseover=\"tt_show(this, 6, " + _Data[i].SourceId + ", [], " + _rvData.Source +
                                 ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " +
                                 _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt +
                                 ", '" + mode + "',"+m_Expansion + "," + SerializeFlags() + ")\" class=\"bgcolor-at" +
                                 spell.Type
                                 + "\" style=\"display: table; height: 20px; width: " +
                                 Math.Round(100.0 * _Data[i].Amount / maxAmount, 1) + "%;\">" +
                                 "<div class=\"healingbarsep\" style=\"width: " +
                                 Math.Round(100.0 * (_Data[i].QueryData.AbilityId) / _Data[i].Amount, 1) +
                                 "%;\"></div></div>" +
                                 "<div onmouseover=\"tt_show(this, 6, " + _Data[i].SourceId + ", [], " + _rvData.Source +
                                 ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " +
                                 _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt +
                                 ", '" + mode + "',"+m_Expansion + "," + SerializeFlags() + ")\" class=\"tstatusbar healingbar\"  style=\"margin-top: -20px; width: " +
                                 Math.Round(100.0 * _Data[i].Amount / maxAmount, 1) + "%;\">" +
                                 "<div style=\"width: " +
                                 Math.Round(100.0 * (_Data[i].QueryData.Amount) / _Data[i].Amount, 1) + "%;\">" +
                                 "<div>" + spell.Name + " (" + _Data[i].QueryData.Amount +
                                 ")</div>" +
                                 "<div> " + Math.Round(1000.0 * _Data[i].QueryData.Amount / _Duration, 1) +
                                 "/s</div></div>" +
                                 "<div style=\"text-align:right\">(" + _Data[i].QueryData.AbilityId + ") " +
                                 Math.Round(1000.0 * _Data[i].QueryData.AbilityId / _Duration, 1) +
                                 "/s</div></div>" +
                                 "<td>" + Math
                                     .Round(100.0 * _Data[i].Amount / completeSum, 1)
                                     .ToString("#.0", CultureInfo.InvariantCulture) + "%</td></tr>";
                    }
                }
            }
            else if (_Type == 7)
            {
                int completeSum = _Data.Length;
                // TODO
                // Npc classes
                for (int i = 0; i < _Data.Length; ++i)
                    table += "<tr><td>" + (i + 1) + "</td><td><div class=\"tstatusbar bgcolor-c" +
                             GetSourceColor(_Data[i].SourceId) +
                             "\" style=\"width: " + Math.Round(_Data[i].Amount/10.0, 1) + "%;\">" +
                             "<div onmouseover=\"tt_show(this, 7, " + _Data[i].SourceId + ", [], " + _rvData.Source +
                             ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " +
                             _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt +
                             ", '" + mode + "',"+m_Expansion + "," + SerializeFlags() + ")\" onclick=\"SetSelection('pmSource', '" + _Data[i].SourceId + "')\">" +
                             (_Data[i].SourceId >= 300000
                                 ? GetPlayerName(_Data[i].SourceId)
                                 : App.GetNpc(_Data[i].SourceId, m_Expansion).Name) + "</div>" +
                             "<div>" + Math.Round(_Data[i].Amount / 10.0, 2) + "%</div></div><td>" +
                             Math.Round(100.0 / completeSum, 1)
                                 .ToString("#.0", CultureInfo.InvariantCulture) + "%</td></tr>";
            }
            else if (_Type == 8)
            {
                int completeSum = _Data.Sum(x => x.Amount);
                // TODO:
                // Tooltip
                for (int i = 0; i < _Data.Length; ++i)
                    table += "<tr><td>" + (i + 1) + "</td><td><div class=\"tstatusbar bgcolor-at" +
                             App.GetSpell(_Data[i].SourceId, m_Expansion).Type + "\" style=\"width: " +
                             Math.Round(_Data[i].Amount / 10.0, 1) + "%;\">" +
                             "<div onmouseover=\"tt_show(this, 6, " + _Data[i].SourceId + ", [], " + _rvData.Source +
                             ", " + _rvData.Target + ", " + _rvData.Lower + ", " + _rvData.Upper + ", " +
                             _rvData.Uploader + ", " + _rvData.Id + ", " + _rvData.Category + ", " + _rvData.Attempt +
                             ", '" + mode + "',"+m_Expansion + "," + SerializeFlags() + ")\">" + App.GetSpell(_Data[i].SourceId, m_Expansion).Name +"</div>" +
                             "<div>" + Math.Round(_Data[i].Amount / 10.0, 2) + "%</div></div><td>" + Math
                                 .Round(100.0 / completeSum, 1)
                                 .ToString("#.0", CultureInfo.InvariantCulture) + "%</td></tr>";
            }
            else if (_Type == 9)
            {
                int completeSum = _Data.Sum(x => x.Amount);
                for (int i = 0; i < _Data.Length; ++i)
                    table += "<tr><td>" + (i + 1) + "</td><td><div class=\"tstatusbar bgcolor-at" +
                             App.GetSpell(_Data[i].SourceId, m_Expansion).Type + "\" style=\"width: " +
                             Math.Round(100.0 * _Data[i].Amount / _Data[0].Amount, 1) + "%;\">" +
                             "<div>" + App.GetSpell(_Data[i].SourceId, m_Expansion).Name + "</div>" +
                             "<div>"+ _Data[i].Amount + "</div></div><td>" + Math
                                 .Round(100.0 * _Data[i].Amount / completeSum, 1)
                                 .ToString("#.0", CultureInfo.InvariantCulture) + "%</td></tr>";
            }
            return table;
        }

        private void GetCategoryAttemptDropDown()
        {
            pmCategory.Items.Clear();
            pmAttempt.Items.Clear();
            pmAttempt.Items.Add(new ListItem("All attempts", "0"));
            pmCategory.Items.Add(new ListItem("Boss & Trash", "0"));
            pmCategory.Items.Add(new ListItem("Boss only", "1"));
            pmCategory.Items.Add(new ListItem("Boss kills only", "2"));

            // Only count time during these attempts
            if (m_Data.Attempt == 0)
                m_Data.Duration = 0;

            Dictionary<int, int> catDur = new Dictionary<int, int>();
            catDur[0] = 0;
            catDur[1] = 0;
            catDur[2] = 0;
            catDur[3] = 0;
            catDur[4] = 0;
            catDur[5] = 0;
            foreach (var group in m_Data.m_RaidData.m_Attempts.OrderBy(x => x.Value.Start).GroupBy(x => App.GetNpc(x.Value.NpcId, m_Expansion)))
            {
                if (!catDur.ContainsKey(group.Key.ID))
                    catDur[group.Key.ID] = 0;

                if (group.Key.ID > 4)
                    pmCategory.Items.Add(new ListItem(group.Key.Name, group.Key.ID.ToString()));

                if (m_Data.Category != 0
                    && m_Data.Category != group.Key.ID
                    && (m_Data.Category != 1 || group.Key.Type != 1)
                    && (m_Data.Category != 2 || group.Key.Type != 1)
                )
                {
                    foreach (var atmt in group.OrderBy(x => x.Value.Start))
                    {
                        catDur[group.Key.ID] += atmt.Value.End - atmt.Value.Start;
                        if (atmt.Value.Killed)
                            catDur[5] += atmt.Value.End - atmt.Value.Start;
                    }
                        continue;
                }
                foreach (var atmt in group.OrderBy(x => x.Value.Start))
                {
                    catDur[group.Key.ID] += atmt.Value.End - atmt.Value.Start;
                    if (atmt.Value.Killed)
                        catDur[5] += atmt.Value.End - atmt.Value.Start;
                    if (m_Data.Category == 2 && !atmt.Value.Killed) continue;
                    if (m_Data.Attempt == 0 && (m_Data.Category <= 4 || m_Data.Category == atmt.Value.NpcId))
                    {
                        //!! THIS ONLY WORKS IF ATTEMPTS DONT OVERLAP!
                        m_Data.Start = m_Data.Start == 0 || m_Data.Start > atmt.Value.Start
                            ? atmt.Value.Start
                            : m_Data.Start;
                        m_Data.End = Math.Max(m_Data.End, atmt.Value.End);
                        m_Data.Duration += atmt.Value.End - atmt.Value.Start;

                        m_Data.Lower = m_Data.Start;
                        m_Data.Upper = m_Data.End;
                    }
                    pmAttempt.Items.Add(new ListItem(
                        App.GetNpc(atmt.Value.NpcId,m_Expansion).Name + " - " +
                        TimeSpan.FromMilliseconds(atmt.Value.End - atmt.Value.Start).ToString(@"mm\:ss") +
                        (App.GetNpc(atmt.Value.NpcId,m_Expansion).ID != 3 && App.GetNpc(atmt.Value.NpcId,m_Expansion).ID != 4 ? (atmt.Value.Killed ? " - Kill" : " - Attempt") : "") + " - " + DateTimeOffset.FromUnixTimeMilliseconds(atmt.Value.Start + m_Data.m_RaidData.m_Start).DateTime.ToShortTimeString(),
                        atmt.Key.ToString()));
                }

                if (group.Key.ID > 4)
                    pmCategory.Items[pmCategory.Items.Count - 1].Text =
                        group.Key.Name + " - " + TimeSpan.FromMilliseconds(catDur[group.Key.ID]).ToString(@"mm\:ss");
            }
            pmCategory.Items.Add(new ListItem("Trash" + " - " + TimeSpan.FromMilliseconds(catDur[3]).ToString(@"hh\:mm\:ss"), "3"));
            pmCategory.Items.Add(new ListItem("Out of combat Time" + " - " + TimeSpan.FromMilliseconds(catDur[4]).ToString(@"hh\:mm\:ss"), "4"));
            
            pmCategory.Items[0].Text = "Boss & Trash - " + TimeSpan.FromMilliseconds(catDur.Where(x => x.Key != 4).Sum(x => x.Value)).ToString(@"hh\:mm\:ss");
            pmCategory.Items[1].Text = "Boss only - " + TimeSpan.FromMilliseconds(catDur.Where(x => x.Key > 4).Sum(x => x.Value)).ToString(@"hh\:mm\:ss");
            pmCategory.Items[2].Text = "Boss kills only - " + TimeSpan.FromMilliseconds(catDur[5]).ToString(@"hh\:mm\:ss");

            pmCategory.SelectedIndex =
                pmCategory.Items.IndexOf(pmCategory.Items.FindByValue(m_Data.Category.ToString()));
            pmAttempt.SelectedIndex =
                pmAttempt.Items.IndexOf(pmAttempt.Items.FindByValue(m_Data.Attempt.ToString()));
            if (pmAttempt.Items.FindByValue(m_Data.Attempt.ToString()) == null)
                m_Data.Attempt = 0;

            if (pmUpper.Value == "0")
                pmUpper.Value = TimeSpan.FromMilliseconds(m_Data.Upper).ToString(@"hh\:mm\:ss");
            if (pmLower.Value == "0")
                pmLower.Value = TimeSpan.FromMilliseconds(m_Data.Lower).ToString(@"hh\:mm\:ss");

        }

        //Override access ?
        public void GetTargetSourceDropDown()
        {
            // First retrieve from/to timestamps
            // Must probably be changed later to a list solution once I figured out how to make a good multiselect
            IGrouping<int, RS_Auras>[] gainedArr;
            IGrouping<int, RS_Damage>[] dmgArr;
            if (m_Data.Attempt == 0)
            {
                // Getting the categorys delta
                if (m_Data.Category == 0)
                {
                    m_Data.Start = 0;
                    m_Data.End = (int)(m_Data.m_RaidData.m_End - m_Data.m_RaidData.m_Start);
                    gainedArr = m_Data.m_RaidData.m_Auras.Values.GroupBy(x => m_Data.m_RaidData.m_SaReference[x.SaRefId].SourceId).ToArray();
                    dmgArr = m_Data.m_RaidData.m_Damage.Values.GroupBy(x => m_Data.m_RaidData.m_SatReference[x.SatRefId].TargetId).ToArray();
                }
                else
                {
                    RS_Attempts[] atmts = m_Data.m_RaidData.GetFilterAttempts(m_Expansion, m_Data.Category);
                    int count = 0;
                    int length = atmts.Length - 1;
                    gainedArr = m_Data.m_RaidData.m_Auras.Values.Where(x => RaidViewerUtility.IsInAttempt(ref atmts, x.Gained, length, ref count)).GroupBy(x => m_Data.m_RaidData.m_SaReference[x.SaRefId].SourceId).ToArray();
                    count = 0;
                    dmgArr = m_Data.m_RaidData.m_Damage.Values.Where(x => RaidViewerUtility.IsInAttempt(ref atmts, x.TimeStamp, length, ref count)).GroupBy(x => m_Data.m_RaidData.m_SatReference[x.SatRefId].TargetId).ToArray();
                }
            }
            else
            {
                m_Data.Start = m_Data.m_RaidData.m_Attempts[m_Data.Attempt].Start;
                m_Data.End = m_Data.m_RaidData.m_Attempts[m_Data.Attempt].End;
                gainedArr = m_Data.m_RaidData.m_Auras.Values.GroupBy(x => m_Data.m_RaidData.m_SaReference[x.SaRefId].SourceId).Where(x => x.Any(y => y.Gained >= m_Data.Start && y.Gained <= m_Data.End)).ToArray();
                dmgArr = m_Data.m_RaidData.m_Damage.Values.GroupBy(x => m_Data.m_RaidData.m_SatReference[x.SatRefId].TargetId).Where(x => x.Any(y => y.TimeStamp >= m_Data.Start && y.TimeStamp <= m_Data.End)).ToArray();
            }
            
            pmSource.Items.Clear();
            pmTarget.Items.Clear();
            pmSource.Items.Add(new ListItem("All sources", "0"));
            pmTarget.Items.Add(new ListItem("All targets", "0"));
            pmSource.Items.Add(new ListItem("All player", "1"));
            pmSource.Items.Add(new ListItem("All npcs", "2"));
            pmTarget.Items.Add(new ListItem("All player", "1"));
            pmTarget.Items.Add(new ListItem("All npcs", "2"));
            Dictionary<int, bool> done = new Dictionary<int, bool>();
            List<int> player = new List<int>();
            List<int> npc = new List<int>();

            foreach (var group in gainedArr)
            {
                if (group.Key >= 300000)
                {
                    DBChars entry = App.GetChar(group.Key);
                    if (done.ContainsKey(entry.CharId)) continue;
                    player.Add(entry.CharId);
                    done[entry.CharId] = true;
                }
                else
                {
                    DBNPCS entry = App.GetNpc(group.Key, m_Expansion);
                    if (done.ContainsKey(entry.ID)) continue;
                    npc.Add(entry.ID);
                    done[entry.ID] = true;
                }
            }
            foreach (var group in dmgArr)
            {
                if (group.Key >= 300000)
                {
                    DBChars entry = App.GetChar(group.Key);
                    if (done.ContainsKey(entry.CharId)) continue;
                    player.Add(entry.CharId);
                    done[entry.CharId] = true;
                }
                else
                {
                    DBNPCS entry = App.GetNpc(group.Key, m_Expansion);
                    if (done.ContainsKey(entry.ID)) continue;
                    npc.Add(entry.ID);
                    done[entry.ID] = true;
                }
            }
            player = player.OrderBy(x => App.GetChar(x).RefMisc.Class).ThenBy(x => App.GetChar(x).Name).ToList();
            npc = npc.OrderBy(x => App.GetNpc(x, m_Expansion).Class).ThenByDescending(x => App.GetNpc(x, m_Expansion).Type).ThenBy(x => App.GetNpc(x, m_Expansion).Name).ToList();
            foreach (var pl in player)
            {
                pmSource.Items.Add(new ListItem(App.GetChar(pl).Name, pl.ToString()));
                pmTarget.Items.Add(new ListItem(App.GetChar(pl).Name, pl.ToString()));
                pmSource.Items[pmSource.Items.Count - 1].Attributes.Add("class", "color-c" + App.GetChar(pl).RefMisc.Class);
                pmTarget.Items[pmTarget.Items.Count - 1].Attributes.Add("class", "color-c" + App.GetChar(pl).RefMisc.Class);
            }
            foreach (var pl in npc)
            {
                pmSource.Items.Add(new ListItem(App.GetNpc(pl, m_Expansion).Name, pl.ToString()));
                pmTarget.Items.Add(new ListItem(App.GetNpc(pl, m_Expansion).Name, pl.ToString()));
                pmSource.Items[pmSource.Items.Count - 1].Attributes.Add("class", "color-c" + App.GetNpc(pl, m_Expansion).Class);
                pmTarget.Items[pmTarget.Items.Count - 1].Attributes.Add("class", "color-c" + App.GetNpc(pl, m_Expansion).Class);
            }
            pmSource.SelectedIndex =
                pmSource.Items.IndexOf(pmSource.Items.FindByValue(m_Data.Source.ToString()));
            pmTarget.SelectedIndex =
                pmTarget.Items.IndexOf(pmTarget.Items.FindByValue(m_Data.Target.ToString()));

            if (pmSource.Items.FindByValue(m_Data.Source.ToString()) == null)
                m_Data.Source = 0;
            if (pmTarget.Items.FindByValue(m_Data.Target.ToString()) == null)
                m_Data.Target = 0;
                
        }
        
        private static readonly string[] m_Modes = new string[14]
        {
            "Damage done",
            "Damage taken",
            "Healing",
            "Healing taken",
            "Effective Healing Output",
            //"Raw healing",
            //"Raw healing taken",
            //"Overhealing",
            //"Overhealing taken",
            "Deaths",
            "Threat",
            //"Absorbs",
            //"Absorbs taken",
            //"Healing and Absorbs",
            "Interrupts",
            "Dispels",
            "Dispels received",
            "Auras gained",
            "Auras faded",
            "Aura uptime",
            //"Procs",
            "Casts",
            //"CCBreaker",
            //"Activity"
        };
        
        private string CreateDataTable(string _Table, ref QueryData[] _Query)
        {
            if (m_Data.Source < 3)
            {
                if (_Table == "Deaths" || _Table == "Interrupts" || _Table == "Dispels" || _Table == "Dispels received" || _Table == "Auras gained" || _Table == "Auras lost" || _Table == "Casts")
                    return CreateDataTable(_Query.GroupBy(x => x.SourceId).Select(x => new DataTableRow()
                    {
                        SourceId = x.Key,
                        Amount = x.Count()
                    }).OrderByDescending(x => x.Amount).ToArray(), 2, m_Data.Duration, ref m_Data, _Table);
                if (_Table == "Aura uptime")
                    return CreateDataTable(_Query.GroupBy(x => x.SourceId).Select(x => new DataTableRow()
                    {
                        SourceId = x.Key,
                        Amount = (int)x.GroupBy(y => y.AbilityId).Average(abGrp => abGrp.Sum(y => y.TimeStamp) >= m_Data.Duration
                            ? 1000
                            : (int)Math.Ceiling(1000.0 * abGrp.Sum(y => y.TimeStamp) /
                                                m_Data.Duration)), // TODO: Room for optimization!
                    }).OrderByDescending(x => x.Amount).ToArray(), 7, m_Data.Duration, ref m_Data, _Table);
                if (_Table == "Healing" || _Table == "Healing taken")
                    return CreateDataTable(_Query.GroupBy(x => x.SourceId).Select(x => new DataTableRow()
                    {
                        SourceId = x.Key,
                        Amount = x.Sum(y => y.Amount),
                        QueryData = new QueryData() {AbilityId = x.Where(y => y.Type == 1).Sum(y => y.Amount), Amount = x.Where(y => y.Type == 0).Sum(y => y.Amount), SourceId = x.Key}
                    }).OrderByDescending(x => x.QueryData.Amount).ToArray(), 5, m_Data.Duration, ref m_Data, _Table);

                return CreateDataTable(_Query.GroupBy(x => x.SourceId).Select(x => new DataTableRow()
                {
                    SourceId = x.Key,
                    Amount = x.Sum(y => y.Amount)
                }).OrderByDescending(x => x.Amount).ToArray(), 0, m_Data.Duration, ref m_Data, _Table);
            }
            if (_Table == "Deaths")
                return CreateDataTable(_Query.Select(x => new DataTableRow()
                {
                    QueryData = x
                }).OrderByDescending(x => x.Amount).ToArray(), 3, m_Data.Duration, ref m_Data, _Table);
            if (_Table == "Interrupts" || _Table == "Dispels" || _Table == "Dispels received")
                return CreateDataTable(_Query.Select(x => new DataTableRow()
                {
                    QueryData = x
                }).OrderByDescending(x => x.Amount).ToArray(), 4, m_Data.Duration, ref m_Data, _Table);
            if (_Table == "Healing" || _Table == "Healing taken")
            {
                return CreateDataTable(_Query.GroupBy(x => x.AbilityId).Select(x => new DataTableRow()
                {
                    SourceId = x.Key,
                    Amount = x.Sum(y => y.Amount),
                    QueryData = new QueryData()
                    {
                        AbilityId = x.Where(y => y.Type == 1).Sum(y => y.Amount),
                        Amount = x.Where(y => y.Type == 0).Sum(y => y.Amount),
                        SourceId = x.Key
                    }
                }).OrderByDescending(x => x.QueryData.Amount).ToArray(), 6, m_Data.Duration, ref m_Data, _Table);
            }
            if (_Table == "Aura uptime")
                return CreateDataTable(_Query.GroupBy(x => x.AbilityId).Select(x => new DataTableRow()
                {
                    SourceId = x.Key,
                    Amount = x.Sum(y => y.TimeStamp) >= m_Data.Duration
                        ? 1000
                        : (int)Math.Ceiling(1000.0 * x.Sum(y => y.TimeStamp) /
                                            m_Data.Duration), // TODO: Room for optimization!
                }).OrderByDescending(x => x.Amount).ToArray(), 8, m_Data.Duration, ref m_Data, _Table);
            if (_Table == "Casts")
                return CreateDataTable(_Query.GroupBy(x => x.AbilityId).Select(x => new DataTableRow()
                {
                    SourceId = x.Key,
                    Amount = x.Sum(y => y.Amount)
                }).OrderByDescending(x => x.Amount).ToArray(), 9, m_Data.Duration, ref m_Data, _Table); // TODO!
            return CreateDataTable(_Query.GroupBy(x => x.AbilityId).Select(x => new DataTableRow()
            {
                SourceId = x.Key,
                Amount = x.Sum(y => y.Amount)
            }).OrderByDescending(x => x.Amount).ToArray(), 1, m_Data.Duration, ref m_Data, _Table);
        }

        private void SetTables() 
        {
            var query = RaidViewerUtility.GetQuery(pmTable1.Value, m_Data.m_RaidData, m_Data.Lower, m_Data.Upper, m_Data.Source, m_Data.Target, m_Data.Category, m_Data.Attempt, m_Expansion, 
                m_MergePets, m_DistIgnite, m_FilterIgnite, m_DistJudgement, m_FilterJudgement, m_FilterWorldRaidBuffs, m_FriendlyFire).ToArray();
            var query2 = RaidViewerUtility.GetQuery(pmTable2.Value, m_Data.m_RaidData, m_Data.Lower, m_Data.Upper, m_Data.Source, m_Data.Target, m_Data.Category, m_Data.Attempt, m_Expansion, 
                m_MergePets, m_DistIgnite, m_FilterIgnite, m_DistJudgement, m_FilterJudgement, m_FilterWorldRaidBuffs, m_FriendlyFire).ToArray();
            m_Table1 = CreateDataTable(pmTable1.Value, ref query);
            m_Table2 = CreateDataTable(pmTable2.Value, ref query2);
            MChartConfig = GetChart(query, query2);
        }

        private void FillModes(HtmlSelect _Select)
        {
            if (_Select.Items.Count == m_Modes.Length)
                return;
            _Select.Items.Clear();
            foreach (var mode in m_Modes)
            {
                _Select.Items.Add(new ListItem(mode, mode));
            }
            _Select.SelectedIndex =
                _Select.Items.IndexOf(_Select.Items.FindByValue(_Select.Value));
        }

        public string GetTotal(string mode, KeyValuePair<int, int>[] data)
        {
            if (data == null)
                return "";
            var value = data.Sum(x => x.Value);

            if (mode == "Deaths" || mode == "Dispels" || mode == "Dispels received" || mode == "Interrupts" || mode == "Auras gained" || mode == "Auras lost" || mode == "Casts")
                return value.ToString();
            if (mode == "Aura uptime")
                return ""; // Cant really get the data I need easily
            return value + " (" +
                   Math.Round(1000.0 * value / m_Data.Duration, 1) + "/s)";
        }

        private string ExtraPrefix()
        {
            if (m_Data.Source > 3)
            {
                if (pmTable1.Value == "Deaths" || pmTable2.Value == "Deaths")
                    return "Death by ";
                if (pmTable1.Value == "Interrupts" || pmTable2.Value == "Interrupts")
                    return "Interrupted ";
                if (pmTable1.Value == "Dispels" || pmTable2.Value == "Dispels")
                    return "Dispeled ";
                if (pmTable1.Value == "Dispels received" || pmTable2.Value == "Dispels received")
                    return "Dispeled by ";
                if (pmTable1.Value == "Auras gained" || pmTable2.Value == "Auras gained")
                    return "Gained ";
                if (pmTable1.Value == "Auras faded" || pmTable2.Value == "Auras faded")
                    return "Faded ";
                // Aura uptime is already included in dmg graph etc!
            }
            else
            {
                if (pmTable1.Value == "Deaths" || pmTable2.Value == "Deaths")
                    return "Death of ";
                if(pmTable1.Value == "Interrupts" || pmTable2.Value == "Interrupts")
                    return "Interrupt of ";
                if (pmTable1.Value == "Dispels" || pmTable2.Value == "Dispels")
                    return "Dispel of ";
                if (pmTable1.Value == "Dispels received" || pmTable2.Value == "Dispels received")
                    return "Dispel on ";
                // Auras dont make sense there!
            }
            return "??";
        }

        public string GetTableNote(int type)
        {
            if ((type == 0 && pmTable1.Value == "Threat") || (type == 1 && pmTable2.Value == "Threat"))
                return "<tr><td>Note: Threat and #sunders are estimated.</td></tr>";
            return "";
        }

        // TODO: This needs so much optimization, dont even know where to start
        // This is just a hack, should be rewritten tbh!
        private string GetChart(QueryData[] query, QueryData[] query2)
        {
            // Workaround for now for certain modes
            string[] specialSnowflakes = new string[]
            {
                "Interrupts",
                "Dispels",
                "Aura uptime"
            };
            if (specialSnowflakes.Contains(pmTable1.Value))
                for (int i = 0; i < query.Length; ++i) query[i].Amount = 1;
            if (specialSnowflakes.Contains(pmTable2.Value))
                for (int i = 0; i < query2.Length; ++i) query2[i].Amount = 1;

            // Will change depending on selected mode
            // => Add workaround for total to always display eff heal total
            if (m_GraphHeal < 2)
            {
                if (pmTable1.Value.ToLower().Contains("heal"))
                    query = query.Where(x => x.Type == m_GraphHeal).ToArray();
                if (pmTable2.Value.ToLower().Contains("heal"))
                    query2 = query2.Where(x => x.Type == m_GraphHeal).ToArray();
            }

            if (query2.Count() <= query.Count())
            {
                var stepSize = 0;
                if (query.Any())
                    stepSize = query.GroupBy(x => x.AbilityId).Max(x => x.Count());
                for (; stepSize > 150;)
                    stepSize /= 2;

                m_ChartDamage = DeminishChartData(
                    query.Select(x => new KeyValuePair<int, int>(x.TimeStamp, x.Amount)).ToArray(), stepSize + (int)(stepSize*0.5));
                
                m_ChartTime = m_ChartDamage.Select(x => x.Key).ToArray();
            }
            else
            {
                var stepSize = query2.GroupBy(x => x.AbilityId).Max(x => x.Count());
                for (; stepSize > 150;)
                    stepSize /= 2;
                m_ChartHeal = DeminishChartData(
                    query2.Select(x => new KeyValuePair<int, int>(x.TimeStamp, x.Amount)).ToArray(), stepSize + (int)(stepSize * 0.5));
                
                m_ChartTime = m_ChartHeal.Select(x => x.Key).ToArray();
            }

            m_ChartDamage = AddChartDataSet(
                m_ChartTime, query
                    .Select(x => new KeyValuePair<int, int>(x.TimeStamp, x.Amount)).ToArray());


            m_ChartHeal = AddChartDataSet(
                m_ChartTime, query2
                    .Select(x => new KeyValuePair<int, int>(x.TimeStamp, x.Amount)).ToArray());

            // Determines if left or right is a mode that requires points
            bool switchedSites = pmTable1.Value == "Deaths" || pmTable1.Value.ToLower().Contains("aura") || pmTable1.Value.ToLower().Contains("dispel") || pmTable1.Value == "Interrupts";
            bool both = switchedSites && (pmTable2.Value == "Deaths" || pmTable2.Value.ToLower().Contains("aura") ||
                                          pmTable2.Value.ToLower().Contains("dispel") ||
                                          pmTable2.Value == "Interrupts");
            if (both)
            {
                return "document.getElementById('chartContainer').style.opacity='0';" +
                          "document.getElementById('chartContainer').parentElement.style.height='0';";
            }
            // For now just hide the graph then
            string result = "";
            
            if (m_Data.Source > 3)
            {

                var query3 = RaidViewerUtility.GetQuery("Aura active", m_Data.m_RaidData, m_Data.Lower, m_Data.Upper,
                        m_Data.Source, m_Data.Target, m_Data.Category, m_Data.Attempt, m_Expansion, m_MergePets, m_DistIgnite, m_FilterIgnite, m_DistJudgement, m_FilterJudgement, m_FilterWorldRaidBuffs, m_FriendlyFire)
                    .GroupBy(x => x.AbilityId).ToArray();

                // TODO: Do not use this silly map for it, but use regex or so instead!
                result += "var typee = 0; " +
                         "var extraPrefix = '" + ExtraPrefix() + "'; " +
                                "var TSLabels = [" + string.Join(", ", m_ChartTime) + "]; " +
                                "var extraPoints = [" +
                                (ExtraPrefix() != "??" ?
                                string.Join(",",
                                    query2.Select(x => "{a:" + x.TimeStamp + ",b:'" +
                                                       (ExtraPrefix() == "Gained " || ExtraPrefix() == "Faded "
                                                           ? App.GetSpell(x.AbilityId, m_Expansion).Name.Replace("'", "\\'")
                                                           : (x.TargetId >= 300000
                                                               ? App.GetChar(x.TargetId).Name.Replace("'", "\\'")
                                                               : App.GetNpc(x.TargetId, m_Expansion).Name.Replace("'", "\\'"))) +
                                                       "'}")) : "") + "];" +
                                "var timeMap = {}; " +
                                "var auras = [";
                foreach (var auras in query3)
                    result += "{label:'" + App.GetSpell(auras.Key, m_Expansion).Name.Replace("'", "\\'") + "', data: [" +
                              string.Join(",", auras.Select(x => "{b:" + x.Amount + ",c:" + x.TimeStamp + "}")) + "]},";
                result += "]; " +
                          "var ctx = document.getElementById('chartContainer').getContext('2d'); " +
                          "var myLineChart = new Chart(ctx,{ " +
                          "type: 'bar', " +
                          "data:{labels: TSLabels,datasets: [";
                short cunt = 0;
                short wrap = 0;
                foreach (var ability in (switchedSites ? query2 : query).GroupBy(x => x.AbilityId))
                {
                    var data = AddChartDataSet(m_ChartTime,
                        ability.Select(x => new KeyValuePair<int, int>(x.TimeStamp, x.Amount)).ToArray());
                    result += "{type:'bar',label: '" + App.GetSpell(ability.Key, m_Expansion).Name.Replace("'", "\\'") + "',fill: false, " +
                              "data: [" + string.Join(", ", data.Select(x => x.Value)) + "]," +
                              "backgroundColor: 'rgb(" + mColors[cunt] + ")',borderColor: 'rgb(" + mColors[cunt] +
                              ")'},";

                    MChartColoring += ".chartjsLegend ul li:nth-child(" + (cunt + wrap * mColors.Count + 1) +
                                      "){color:rgb(" + mColors[cunt] + ")} ";

                    ++cunt;
                    if (cunt < mColors.Count) continue;
                    cunt = 0;
                    ++wrap;
                }

                if (ExtraPrefix() != "??")
                    result += "{type:'line', borderColor: 'rgb(255,255,255)', borderWidth: 2, fille: false, showLine: false, pointRadius: 5, pointHoverRadius: 7, data:[" +
                        string.Join(",", (switchedSites ? m_ChartDamage : m_ChartHeal).Select(x => x.Value > 0 ? 10001 : 0)).Replace(",0", ",null").Replace("0,", "null,") + "]}";

                result += "]},";

            }
            else
            {
                result += "var typee = 1;" +
                          "var auras = [];" +
                          "var timeMap = {};" +
                          "var extraPrefix = '" + ExtraPrefix() + "';" +
                          "var extraPoints = [" +
                          (ExtraPrefix() != "??" ?
                          string.Join(",",
                              query2.Select(x => "{a:" + x.TimeStamp + ",b:'" +
                                                 (ExtraPrefix() == "Gained " || ExtraPrefix() == "Faded "
                                                     ? App.GetSpell(x.AbilityId, m_Expansion).Name.Replace("'", "\\'")
                                                     : (x.SourceId >= 300000
                                                         ? App.GetChar(x.SourceId).Name.Replace("'", "\\'")
                                                         : App.GetNpc(x.SourceId, m_Expansion).Name.Replace("'", "\\'"))) +
                                                 "'}")) : "") + "];" +
                          "var TSLabels = [" + string.Join(", ", m_ChartTime) + "];" +
                          "var ctx = document.getElementById('chartContainer').getContext('2d'); " +
                          "var myLineChart = new Chart(ctx,{ " +
                          "type: 'line', " +
                          "data:{labels: TSLabels,datasets: [{type:'line', label: '" + pmTable1.Value + "',fill: false, " +
                          "data: [" + string.Join(", ", (!switchedSites ? m_ChartDamage : m_ChartHeal).Select(x => x.Value)) +
                          "],"+(switchedSites ? "backgroundColor: 'rgb(171,212,115)',borderColor: 'rgb(171,212,115)'" : "backgroundColor: 'rgb(196,30,59)',borderColor: 'rgb(196,30,59)'")+"},{type:'line', "+(ExtraPrefix() == "??" ? "backgroundColor: 'rgb(171,212,115)',borderColor: 'rgb(171,212,115)'," : "borderColor: 'rgb(255,255,255)', borderWidth: 2, fille: false, showLine: false, pointRadius: 5, pointHoverRadius: 7,") +
                          "label: '" + pmTable2.Value + "', " +
                          "fill: false,data: [" + (ExtraPrefix() == "??" ? 
                          string.Join(",", (switchedSites ? m_ChartDamage : m_ChartHeal).Select(x => x.Value)) : 
                          string.Join(",", (switchedSites ? m_ChartDamage : m_ChartHeal).Select(x => x.Value > 0 ? 350001 : 0)).Replace(",0", ",null").Replace("0,", "null,")) + "] " +
                          "}]}, ";
            }

            result += "options:{elements:{point:{pointStyle:'star'}}," +
                      "annotation: {events: ['click'], annotations: [";
            if (m_Data.Category < 3 && m_Data.Attempt == 0 && m_Annotations)
            {
                //int maxQ1 = m_ChartDamage.Max(x => x.Value);
                //int maxQ2 = m_ChartHeal.Max(x => x.Value);
                //int maxValue = (int)((maxQ1 > maxQ2 ? maxQ1 : maxQ2)*1.12);
                //int minValue = -10000;
                foreach (var atmt in m_Data.m_RaidData.m_Attempts)
                {
                    if (atmt.Value.NpcId == 3 || atmt.Value.NpcId == 4) continue;
                    var timeFrame = m_ChartTime.Where(x => x >= atmt.Value.Start - 30000 && x <= atmt.Value.End + 30000);
                    if (!timeFrame.Any()) continue;
                    int xMin = timeFrame.FirstOrDefault();
                    int xMax = timeFrame.LastOrDefault();
                    result +=
                        "{drawTime: 'afterDatasetsDraw',type: 'box',xScaleID: 'x-axis-0',yScaleID: 'y-axis-1'," +
                        "xMin: "+xMin+",xMax: "+xMax+",yMin: -1,yMax: 1," +
                        "backgroundColor: 'rgba(101, 33, 171, 0)',borderColor: 'rgb(255, 255, 255)',borderWidth: 0.5," +
                        "label: {content: \""+App.GetNpc(atmt.Value.NpcId, m_Expansion).Name+ "\",enabled: true}, " +
                        "onClick: function(e){document.getElementById('ctl00_ContentPlaceHolder1_pmUpper').value='0';" +
                        "document.getElementById('ctl00_ContentPlaceHolder1_pmLower').value='0';" +
                        "document.getElementById('ctl00_ContentPlaceHolder1_pmAttempt').value='" + atmt.Key+ "';" +
                        "document.getElementById('ctl00_ContentPlaceHolder1_navForm').submit()}},";
                }
            }
            result += "]}," +
            (m_Data.Attempt != 0 ? "zoom: {enabled: true,drag:true,mode: 'x',sensitivity: 1}," : "") +
            "animation:{duration: 0},hover:{animationDuration: 0},legend:{display: false},scales:{ "+
            "xAxes: [{display: true," + (m_Data.Source > 3 ? "stacked:true," : "") + "scaleLabel:{display: false}," +
            "ticks:{fontColor: '#FFF',callback: function(value, index, values) {var dt = new Date(value).toISOString().slice(-13, -5); timeMap[dt]=index; return dt;},maxTicksLimit: 8,maxRotation: 0,minRotation: 0}," +
            "gridLines:{color: 'rgba(153, 153, 153, 0.2)'}}]," +
            "yAxes: [{display: true, "+ (m_Data.Source > 3 ? "stacked:true," : "") +"scaleLabel:{display: false},ticks:{fontColor: '#FFF'},gridLines:{color: 'rgba(153, 153, 153, 0.2)'}}]},"+
            "responsiveAnimationDuration: 0," +
            "tooltips:{enabled:false,custom:function(tooltipModel){var tooltipEl = document.getElementById('chartjs-tooltip'); if (!tooltipEl){tooltipEl = document.createElement('div');tooltipEl.id = 'chartjs-tooltip';tooltipEl.innerHTML = '<table></table>'; document.body.appendChild(tooltipEl);} if (tooltipModel.opacity === 0){tooltipEl.style.opacity = 0;return;} tooltipEl.classList.remove('above', 'below', 'no-transform'); if (tooltipModel.yAlign) {tooltipEl.classList.add(tooltipModel.yAlign);}else{tooltipEl.classList.add('no-transform');} function getBody(bodyItem) {return bodyItem.lines;} if (tooltipModel.body) {var titleLines = tooltipModel.title || []; var bodyLines = tooltipModel.body.map(getBody); var innerHtml = '<thead>'; titleLines.forEach(function(title) {innerHtml += '<tr><th>' + title + '</th></tr>';}); innerHtml += '</thead><tbody>'; " +
            "var detectedPoint=false;" +
            "bodyLines.forEach(function(body, i) {var colors = tooltipModel.labelColors[i]; if (colors.borderColor=='rgb(230, 230, 230)' || colors.borderColor=='rgb(255,255,255)'){detectedPoint=true;} if (!detectedPoint){ var style = 'background:' + colors.backgroundColor; style += '; border-color:' + colors.borderColor; var span = '<div class=\"chartjs-tooltip-key\" style=\"' + style + '\"></div>'; innerHtml += '<tr><td>' + span + body + '</td></tr>';} });" +
            "if (detectedPoint){var prevPoint=0; var TS = TSLabels[timeMap[titleLines[0]]]; var TS2 = TSLabels[timeMap[titleLines[0]]+1]; var eCount = 0; extraPoints.forEach(function(pt){if ((pt.a >= TS && prevPoint <= TS) || (pt.a <= TS2 && pt.a >= TS)){ if (eCount==20){innerHtml += '...';} if(eCount < 20){innerHtml += '<tr><td>'+extraPrefix+pt.b+'</td></tr>'; prevPoint=pt.a;} eCount+=1; } });}else{ if (typee==0){ " +
            "innerHtml += '<tr></tr><tr><td>Active auras:</td></tr>'; " +
            "var TS = TSLabels[timeMap[titleLines[0]]]; auras.forEach(function(el){var done=false; el.data.forEach(function(elIn){if (elIn.b<=TS && elIn.c>=TS && !done){innerHtml += '<tr><td>'+el.label+'</td></tr>'; done=true; }}); });}} " +
            " innerHtml += '</tbody>'; var tableRoot = tooltipEl.querySelector('table'); tableRoot.innerHTML = innerHtml; } tooltipEl.style.opacity = 1; }}" +
            "}}); document.getElementById('chartjsLegend').innerHTML = myLineChart.generateLegend();";
            
            return result;
        }
        
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
            {
                try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
                return;
            }

            Import();
            
            m_PostVanilla = Utility.GetQueryString(Request, "exp", "0") == "1";
            m_Expansion = m_PostVanilla ? 1 : 0;
            
            // MASTER START
            int reqAtmt = 0;
            if (Utility.GetQueryString(Request, "atmt", "0") != "0" && int.TryParse(Utility.GetQueryString(Request, "atmt", "0"), out reqAtmt) && reqAtmt != 0)
            {
                var tempDB = App.GetDB(m_Expansion + 1);
                MySqlDataReader dr = tempDB.Query("SELECT b.private, b.instanceid, b.id FROM rs_attempts a LEFT JOIN rs_instance_uploader b ON a.uploaderid = b.id WHERE a.id=" + reqAtmt).ExecuteReaderRpll();
                if (dr.Read())
                {
                    if (dr.GetInt16(0) == 1)
                    {
                        try { Response.Redirect("/Private/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
                        return;
                    }
                   
                    Response.Clear();
                    StringBuilder sb = new StringBuilder();
                    sb.Append("<html>");
                    sb.AppendFormat(@"<body onload='document.forms[""form""].submit()'>");
                    sb.AppendFormat("<form name='form' action='{0}' method='post'>", "/Raids/Viewer/?id=" + dr.GetInt32(1) + "&upl=" + dr.GetInt32(2)+"&exp="+m_Expansion);
                    sb.AppendFormat("<input type='hidden' name=\"pmAttempt\" value='{0}'>", reqAtmt);
                    // Other params go here
                    sb.Append("</form>");
                    sb.Append("</body>");
                    sb.Append("</html>");
                    dr.CloseRpll();

                    Response.Write(sb.ToString());

                    Response.End();
                    return;
                }
                dr.CloseRpll();
            }

            m_MergePets = Utility.GetCookie(Request, "RaidViewer_MergePets", "true") == "true";
            m_DistIgnite = Utility.GetCookie(Request, "RaidViewer_DistIgnite", "false") == "true";
            m_FriendlyFire = Utility.GetCookie(Request, "RaidViewer_FriendlyFire", "false") == "true";
            m_FilterIgnite = Utility.GetCookie(Request, "RaidViewer_FilterIgnite", "false") == "true";
            m_DistJudgement = Utility.GetCookie(Request, "RaidViewer_DistJudgement", "false") == "true";
            m_FilterJudgement = Utility.GetCookie(Request, "RaidViewer_FilterJudgement", "false") == "true";
            m_FilterWorldRaidBuffs = Utility.GetCookie(Request, "RaidViewer_FilterWorldRaidBuffs", "false") == "true";
            m_Annotations = Utility.GetCookie(Request, "RaidViewer_Annotations", "true") == "true";
            short.TryParse(Utility.GetCookie(Request, "RaidViewer_Graph_Heal", "0"), out m_GraphHeal);

            m_Data = GetViewerData();
            GetCategoryAttemptDropDown();
            GetTargetSourceDropDown();

            //Response.Write(m_Data.m_RaidData.m_SatReference.Count);

            LogInfo = App.mRSInstances[m_Expansion].Where(x => x.mId == m_Data.Id).First();

            if (m_Data.m_RaidData.Error != "") Response.Write(m_Data.m_RaidData.Error);

            // MASTER END

            var imgType2 = Utility.GetImageType(Request);

            try
            {
                this.Title = "Legacyplayers | Viewer";

                //m_Data = this.Master.GetViewerData(true);

                FillModes(pmTable1);
                FillModes(pmTable2);

                if (IsPostBack)
                {
                    Utility.SetCookie(Response, Request, "Viewer" + m_Data.Id + "," + m_Data.Uploader + "_Table1", pmTable1.Value, 300);
                    Utility.SetCookie(Response, Request, "Viewer" + m_Data.Id + "," + m_Data.Uploader + "_Table2", pmTable2.Value, 300);
                }
                else
                {
                    pmTable1.Value = Utility.GetCookie(Request, "Viewer" + m_Data.Id + "," + m_Data.Uploader + "_Table1", "Damage done");
                    pmTable2.Value = Utility.GetCookie(Request, "Viewer" + m_Data.Id + "," + m_Data.Uploader + "_Table2", "Healing");
                    pmTable1.SelectedIndex = pmTable1.Items.IndexOf(pmTable1.Items.FindByValue(pmTable1.Value));
                    pmTable2.SelectedIndex = pmTable2.Items.IndexOf(pmTable2.Items.FindByValue(pmTable2.Value)); // Why does this not work?!
                }

                // Retrieving Loot
                var lootData = m_Data.m_RaidData.m_Loot.Values.OrderByDescending(x => m_Data.m_RaidData.m_Attempts[x.AttemptId].NpcId);
                foreach (var group in (Utility.GetCookie(Request, "Viewer_Loot", "false") == "false" ? lootData.Where(x => !IsAFilteredItem(x.ItemId)) : lootData).GroupBy(x => m_Data.m_RaidData.m_Attempts[x.AttemptId].NpcId))
                {
                    m_Loot.Append("<tr><td>"+App.GetNpc(group.Key, m_Expansion).Name+"</td><td>");
                    foreach (var item in group)
                    {
                        var it = App.m_Items[m_Expansion].ContainsKey(item.ItemId) ? App.m_Items[m_Expansion][item.ItemId] : App.m_Items[m_Expansion][0];
                        m_Loot.Append("<div class=\"item-template-64 qe" + it.Quality +
                                        "\" style=\"background-image: url('/Assets/icons/" + it.IconName +
                                        "."+imgType2+"')\">" +
                                        "<a href=\"/Armory/Items/?i="+ item.ItemId + "\">" + it.Quantity(m_Data.m_RaidData.m_Server.ServerId) + "</a><a href=\"/Raids/Loot/?i=" +
                                        item.ItemId + "\"><div onmouseover=\"tt_show(this, 1, " + item.ItemId +
                                        ",[], "+m_Expansion+")\"></div>" +
                                        "</a><a class=\"color-c" + App.GetChar(item.TargetId).RefMisc.Class + "\" href=\"/Armory/?charid=" +
                                        item.TargetId + "\">" + App.GetChar(item.TargetId).Name + "</a></div>");
                    }
                    m_Loot.Append("</td></tr>");
                }

                // Retrieving participants

                foreach (var part in m_Data.m_RaidData.m_Participants.Where(x => x.OwnerId == 0).OrderBy(x => x.RefMisc.Class).GroupBy(x => x.RefMisc.Class))
                {
                    if (part.Any())
                        m_Participants.Append("<tr class=\"color-c" + part.First().RefMisc.Class + "\"><td>("+ part.Count() + ") "+string.Join(", ", part.Select(x => "<a href=\"/Armory/?charid="+x.CharId+ "\" onmouseover=\"tt_show(this, 5, " + x.CharId + ", [])\">" + x.Name+ "</a>"))+ "</td></tr>");
                }
                var pets = m_Data.m_RaidData.m_Participants.Where(x => x.OwnerId > 0).ToArray();
                if (pets.Length > 0)
                    m_Participants.Append("<tr class=\"color-c" + pets.First().RefMisc.Class + "\"><td>(" + pets.Count() + ") " + string.Join(", ", pets.Select(x => x.Name)) + "</td></tr>");


                // This will get very hacky now!
                // Needs cleanup... a lot of it


                // Building tables
                SetTables();


            }
            catch (NullReferenceException ee)
            {
                Response.Write("Error: Nullreference: "+ee.Message + " // " + ee.Data.Keys.ToString());
            }
            catch (KeyNotFoundException ee)
            {
                Response.Write("Error: KeyNotFoundException: " + ee.Message + " // " + ee.Data.Keys.ToString());
            }
        }
    }
}