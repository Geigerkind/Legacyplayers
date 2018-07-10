using System;

namespace RPLL
{
    public partial class Ajax : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var queryString = Utility.GetQueryString(Request, "data", "null");
            if (queryString == "talents")
            {
                Response.Clear();
                Response.ContentType = "application/x-javascript";
                if (Request.QueryString.Get("class") == "1")
                {
                    Response.Write(TalentCalculator.TalentInfo_Warrior);
                }
                else if (Request.QueryString.Get("class") == "2")
                {
                    Response.Write(TalentCalculator.TalentInfo_Paladin);
                }
                else if (Request.QueryString.Get("class") == "3")
                {
                    Response.Write(TalentCalculator.TalentInfo_Hunter);
                }
                else if (Request.QueryString.Get("class") == "4")
                {
                    Response.Write(TalentCalculator.TalentInfo_Rogue);
                }
                else if (Request.QueryString.Get("class") == "5")
                {
                    Response.Write(TalentCalculator.TalentInfo_Priest);
                }
                else if (Request.QueryString.Get("class") == "6")
                {
                    Response.Write("");
                }
                else if (Request.QueryString.Get("class") == "7")
                {
                    Response.Write(TalentCalculator.TalentInfo_Shaman);
                }
                else if (Request.QueryString.Get("class") == "8")
                {
                    Response.Write(TalentCalculator.TalentInfo_Mage);
                }
                else if (Request.QueryString.Get("class") == "9")
                {
                    Response.Write(TalentCalculator.TalentInfo_Warlock);
                }
                else if (Request.QueryString.Get("class") == "10")
                {
                    Response.Write("");
                }
                else if (Request.QueryString.Get("class") == "11")
                {
                    Response.Write(TalentCalculator.TalentInfo_Druid);
                }
                else if (Request.QueryString.Get("class") == "21")
                {
                    Response.Write(TalentCalculator.TalentInfoTBC_Warrior);
                }
                else if (Request.QueryString.Get("class") == "22")
                {
                    Response.Write(TalentCalculator.TalentInfoTBC_Paladin);
                }
                else if (Request.QueryString.Get("class") == "23")
                {
                    Response.Write(TalentCalculator.TalentInfoTBC_Hunter);
                }
                else if (Request.QueryString.Get("class") == "24")
                {
                    Response.Write(TalentCalculator.TalentInfoTBC_Rogue);
                }
                else if (Request.QueryString.Get("class") == "25")
                {
                    Response.Write(TalentCalculator.TalentInfoTBC_Priest);
                }
                else if (Request.QueryString.Get("class") == "26")
                {
                    Response.Write("");
                }
                else if (Request.QueryString.Get("class") == "27")
                {
                    Response.Write(TalentCalculator.TalentInfoTBC_Shaman);
                }
                else if (Request.QueryString.Get("class") == "28")
                {
                    Response.Write(TalentCalculator.TalentInfoTBC_Mage);
                }
                else if (Request.QueryString.Get("class") == "29")
                {
                    Response.Write(TalentCalculator.TalentInfoTBC_Warlock);
                }
                else if (Request.QueryString.Get("class") == "30")
                {
                    Response.Write("");
                }
                else if (Request.QueryString.Get("class") == "31")
                {
                    Response.Write(TalentCalculator.TalentInfoTBC_Druid);
                }
                Response.End();
                return;
            }
            else if (queryString == "tooltip")
            {
                Response.Clear();
                Response.ContentType = "application/json; charset=utf-8";

                string flags = Request.QueryString.Get("flags");
                bool flg1 = false;
                bool flg2 = false;
                bool flg3 = false;
                bool flg4 = false;
                bool flg5 = false;
                bool flg6 = false;
                bool flg7 = false;
                if (flags != null && flags.Length > 2)
                {
                    flg1 = flags[0] == '1';
                    flg2 = flags[1] == '1';
                    flg3 = flags[2] == '1';
                    flg4 = flags[3] == '1';
                    flg5 = flags[4] == '1';
                    flg6 = flags[5] == '1';
                    flg7 = flags[6] == '1';
                }

                switch (Request.QueryString.Get("type"))
                {
                    case "0":
                        Response.Write(Tooltip.GetSpell(Convert.ToInt32(Request.QueryString.Get("id")), "vanilla"));
                        break;
                    case "1":
                        Response.Write(Tooltip.GetItem(Convert.ToInt32(Request.QueryString.Get("id")), Request.QueryString.Get("charid") == "0" ? "vanilla" : "tbc", Convert.ToInt32(Request.QueryString.Get("charid"))));
                        break;
                    case "2":
                        Response.Write(Tooltip.GetGuildProgress(Convert.ToInt32(Request.QueryString.Get("id")), Convert.ToInt32(Request.QueryString.Get("charid")))); // charid => Instanceid
                        break;
                    case "4":
                        Response.Write(Tooltip.GetGuild(Convert.ToInt32(Request.QueryString.Get("id"))));
                        break;
                    case "5":
                        Response.Write(Tooltip.GetCharacter(Convert.ToInt32(Request.QueryString.Get("id"))));
                        break;
                    case "6":
                        Response.Write(Tooltip.GetRvRowData(Convert.ToInt32(Request.QueryString.Get("id")),
                            Convert.ToInt32(Request.QueryString.Get("instanceid")),
                            Convert.ToInt32(Request.QueryString.Get("upl")),
                            Convert.ToInt32(Request.QueryString.Get("charid")),
                            Convert.ToInt32(Request.QueryString.Get("tarid")),
                            Convert.ToInt32(Request.QueryString.Get("start")),
                            Convert.ToInt32(Request.QueryString.Get("end")),
                            Convert.ToInt32(Request.QueryString.Get("cat")),
                            Convert.ToInt32(Request.QueryString.Get("atmt")),
                            Request.QueryString.Get("mode"),
                            Convert.ToInt32(Request.QueryString.Get("exp")), flg1, flg2, flg3, flg4, flg5, flg6, flg7));
                        break;
                    case "7":
                        Response.Write(Tooltip.GetRvRowPreview(Convert.ToInt32(Request.QueryString.Get("id")),
                            Convert.ToInt32(Request.QueryString.Get("instanceid")),
                            Convert.ToInt32(Request.QueryString.Get("upl")),
                            Convert.ToInt32(Request.QueryString.Get("charid")),
                            Convert.ToInt32(Request.QueryString.Get("tarid")),
                            Convert.ToInt32(Request.QueryString.Get("start")),
                            Convert.ToInt32(Request.QueryString.Get("end")),
                            Convert.ToInt32(Request.QueryString.Get("cat")),
                            Convert.ToInt32(Request.QueryString.Get("atmt")),
                            Request.QueryString.Get("mode"),
                            Convert.ToInt32(Request.QueryString.Get("exp")), flg1, flg2, flg3, flg4, flg5, flg6, flg7));
                        break;
                    case "8":
                        Response.Write(Tooltip.GetItemDesigner(Request.QueryString.Get("id")));
                        break;
                    default:
                        Response.Write("{\"Error\":\"Error retrieving information\"}");
                        break;
                }
                Response.End();
            }
            return;
        }
    }
}