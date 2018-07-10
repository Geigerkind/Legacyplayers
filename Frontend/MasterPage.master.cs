using System;
using System.Collections.Generic;
using System.Linq;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using DevOne.Security.Cryptography.BCrypt;

namespace RPLL
{
    public partial class MasterPage : System.Web.UI.MasterPage
    {
        public string _COOKIE;
        public string m_Account = "<li class=\"fright\"><a href=\"/Account/LogIn/\">Log In</a></li>";

        public string mAds0 = "";
        public string mAds1 = "";
        public string mAds2 = "";
        public string mAds3 = "";

        public bool ValidForAds()
        {
            var disableads = false;
            var uname = Utility.GetCookie(Request, "RPLL_username", "");
            var users = App.m_User.Where(x => x.Value.Name == uname);
            var user = users.FirstOrDefault();
            if (uname != "" && users.Any() && Utility.GetCookie(Request, "RPLL_user", "") == user.Value.uHash)
                disableads = user.Value.DisableAds;

            string currentPage = Server.MapPath(".").ToLower();
            return !(currentPage.Contains("login")) && !disableads;
        }

        public int AdLevel()
        {
            string currentPage = Server.MapPath(".").ToLower();
            if (currentPage.Contains("armory") && !(currentPage.Contains("guildlist") || currentPage.Contains("item") || currentPage.Contains("raids")))
                return 2;
            return 3;
        }

        public void setNotifaction(String str, int level)
        {
            if (str.Length > 1) {
                switch (level)
                {
                    case 1:
                        notification.Style.Value = "color:red;display:block;";
                        break;
                    case 2:
                        notification.Style.Value = "color:yellow;display:block;";
                        break;
                    default:
                        notification.Style.Value = "color:lime;display:block;";
                        break;
                }
                notification.InnerText = str;
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Charset = "utf-8";

            if (ValidForAds())
            {
                mAds0 = "<script async src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script> <script> (adsbygoogle = window.adsbygoogle || []).push({ google_ad_client: \"ca-pub-5192077039791210\", enable_page_level_ads: true }); </script>";
                if (AdLevel() > 1) mAds1 = "<ins class=\"adsbygoogle\" id=\"AdOne\" style=\"display:inline-block;width:120px; height: 600px;\" data-ad-client=\"ca-pub-5192077039791210\" data-ad-slot=\"2323681449\"></ins> <script> document.getElementById(\'MainSection\').style.width = window.SectionWidth + \"px\"; document.getElementById(\'AdOne\').style.width = window.AdWidth + \"px\"; document.getElementById(\'AdOne\').style.height = window.AdHeight + \"px\"; document.getElementById(\'AdOneFrame\').style.width = window.AdWidth + \"px\"; document.getElementById(\'AdOneFrame\').style.height = window.AdHeight + \"px\"; if (window.AdWidth === 300) { document.getElementById(\'AdOne\').setAttribute(\"data-ad-slot\", \"7905049299\"); (adsbygoogle = window.adsbygoogle || []).push({}); } else if (window.AdWidth === 160) { document.getElementById(\'AdOne\').setAttribute(\"data-ad-slot\", \"5426622396\"); (adsbygoogle = window.adsbygoogle || []).push({}); } else if (window.AdWidth === 120) { document.getElementById(\'AdOne\').setAttribute(\"data-ad-slot\", \"2323681449\"); (adsbygoogle = window.adsbygoogle || []).push({}); } else { document.getElementById(\'AdOneFrame\').style[\"margin-right\"] = \"0\"; } </script>";
                if (AdLevel() > 2) mAds2 = "<ins class=\"adsbygoogle\" id=\"AdTwo\" style=\"display:inline-block;width:120px;height:600px\" data-ad-client=\"ca-pub-5192077039791210\" data-ad-slot=\"2428102156\"></ins> <script> document.getElementById(\'AdTwo\').style.width = window.AdWidth + \"px\"; document.getElementById(\'AdTwo\').style.height = window.AdHeight + \"px\"; document.getElementById(\'AdTwoFrame\').style.width = window.AdWidth + \"px\"; document.getElementById(\'AdTwoFrame\').style.height = window.AdHeight + \"px\"; if (window.AdWidth === 300 && false) { document.getElementById(\'AdTwo\').setAttribute(\"data-ad-slot\", \"1778624645\"); (adsbygoogle = window.adsbygoogle || []).push({}); } else if (window.AdWidth >= 120) { document.getElementById(\'AdTwo\').setAttribute(\"data-ad-slot\", \"2428102156\"); document.getElementById(\'AdTwo\').style.width = \"120px\"; document.getElementById(\'AdTwo\').style.height = \"600px\"; (adsbygoogle = window.adsbygoogle || []).push({}); } else { document.getElementById(\'AdTwoFrame\').style[\"margin-left\"] = \"0\"; } </script>";
                if (AdLevel() > 0) mAds3 = "<ins class=\"adsbygoogle\" style=\"display:block;width:728px; height: 90px; margin: 10px auto;\" data-ad-client=\"ca-pub-5192077039791210\" data-ad-slot=\"2920658803\"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script>";
            }

            if (Request.Cookies.Get("cookielaw2") == null)
            {
                _COOKIE = "<div id=\"cookielaw\" style=\"z-index: 15; background: rgb(0,0,0); width: 100%; position: fixed; bottom: 0; left: 0; height: 100px; line-height: 25px; padding-top: 25px; padding-left: 10px; font-size: 17px;\">LegacyPlayers or its third party tools use cookies, which are necessary to its functioning.<br /> Also General Data Protection Regulation (EU) 2016/679 has gone into life by May 25th, 2018." +
                          "That's why we need your consent to process your personal data that you share within our services." +
                          "You'll find details about it within the <a href=\"/Privacy\">privacy</a>. In case you don't agree on that, you cannot use the website. If you continue browsing this website, we'll assume that you agree.<button style=\"position: fixed; right: 20px; bottom: 10px; width: 80px;\" onclick=\"document.getElementById('cookielaw2').style.display='none';\">Got it!</button></div>";
                Response.Cookies["cookieLaw2"].Value = "set";
                Response.Cookies["cookieLaw2"].Expires = DateTime.Now.AddDays(90);
            }

            var uname = Utility.GetCookie(Request, "RPLL_username", "");
            if (uname == "" || Utility.GetCookie(Request, "RPLL_user", "") == "")
                return;

            var users = App.m_User.Where(x => x.Value.Name == uname);
            if (!users.Any())
                return;

            var user = users.FirstOrDefault();
            if (Utility.GetCookie(Request, "RPLL_user", "") == user.Value.uHash)
            {
                m_Account = "<li class=\"fright\"><a href=\"/Account/?uid=" + user.Key + "\">Account Panel</a></li>";
                return;
            }
        }
    }
}
