using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Web;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace RPLL
{
    public static class Utility
    {
        public static readonly Dictionary<int, List<int>> m_BossList = new Dictionary<int, List<int>>
        {
            
            {0,new List<int>() // Singlebosses
            {
                10184,
                14889,
                14887,
                14888,
                14890,
                6109,
                12397,
            }},
            {1, new List<int>() // Naxx Arachnid Quarter
                {
                    15956,
                    15953,
                    15952
                }
            },
            {2, new List<int>() // Naxx Plague Quarter
                {
                    15954,
                    15936,
                    16011
                }
            },
            {3, new List<int>() // Naxx Military Quarter
                {
                    16061,
                    16060,
                    200003
                }
            },
            {4, new List<int>() // Naxx Construct Quarter
                {
                    16028,
                    15931,
                    15932,
                    15928,
                }
            },
            {5, new List<int>() // Naxx Frostwyrm Lair
                {
                    15989,
                    15990
                }
            },
            {6, new List<int>() // MC + BWL
            {
                // MC
                12118,
                11982,
                12259,
                12057,
                12056,
                12264,
                12098,
                11988,
                12018,
                11502,

                // BWL
                12435,
                13020,
                12017,
                11983,
                14601,
                11981,
                14020,
                11583
            }},
            {7, new List<int>() // MC + BWL + AQ40
            {
                // MC
                12118,
                11982,
                12259,
                12057,
                12056,
                12264,
                12098,
                11988,
                12018,
                11502,

                // BWL
                12435,
                13020,
                12017,
                11983,
                14601,
                11981,
                14020,
                11583,

                // AQ40
                15263,
                15516,
                15510,
                15509,
                200005,
                15517,
                15727,
                15299,
                200004
            }},
            { 8, new List<int>() // BWL + AQ40
            {
                // BWL
                12435,
                13020,
                12017,
                11983,
                14601,
                11981,
                14020,
                11583,

                // AQ40
                15263,
                15516,
                15510,
                15509,
                200005,
                15517,
                15727,
                15299,
                200004
            }},
            { 9, new List<int>() // AQ40 + Naxx
            {
                // AQ40
                15263,
                15516,
                15510,
                15509,
                200005,
                15517,
                15727,
                15299,
                200004,

                // Naxx
                16028,
                15931,
                15932,
                15928,
                15956,
                15953,
                15952,
                16061,
                16060,
                200003,
                15954,
                15936,
                16011,
                15989,
                15990
            }},
            {10, new List<int>() // MC + BWL + AQ40 + Naxx
            {
                // MC
                12118,
                11982,
                12259,
                12057,
                12056,
                12264,
                12098,
                11988,
                12018,
                11502,

                // BWL
                12435,
                13020,
                12017,
                11983,
                14601,
                11981,
                14020,
                11583,

                // AQ40
                15263,
                15516,
                15510,
                15509,
                200005,
                15517,
                15727,
                15299,
                200004,

                // Naxx
                16028,
                15931,
                15932,
                15928,
                15956,
                15953,
                15952,
                16061,
                16060,
                200003,
                15954,
                15936,
                16011,
                15989,
                15990
            }},
            {19, new List<int>() // ZG
            {
                14517,
                14507,
                14510,
                11382,
                15082,
                15083,
                15085,
                15114,
                14509,
                14515,
                11380,
                14834
            }},
            {23, new List<int>() // Mc
            {
                12118,
                11982,
                12259,
                12057,
                12056,
                12264,
                12098,
                11988,
                12018,
                11502
            }},
            {25, new List<int>() // BWL
            {
                12435,
                13020,
                12017,
                11983,
                14601,
                11981,
                14020,
                11583
            }},
            {27, new List<int>() // AQ20
            {
                15348,
                15341,
                15340,
                15370,
                15369,
                15339
            }},
            {29, new List<int>() // AQ40
            {
                15263,
                15516,
                15510,
                15509,
                200005,
                15517,
                15727,
                15299,
                200004
            }},
            {31, new List<int>() // Naxx
            {
                16028,
                15931,
                15932,
                15928,
                15956,
                15953,
                15952,
                16061,
                16060,
                200003,
                15954,
                15936,
                16011,
                15989,
                15990
            }},
            {84, new List<int>()
            {
                14887,
                14888,
                14889,
                14890,
            }},
            {85, new List<int>()
            {
                14887,
                14888,
                14889,
                14890,
            }},
            {86, new List<int>()
            {
                14887,
                14888,
                14889,
                14890,
            }},
            {87, new List<int>()
            {
                14887,
                14888,
                14889,
                14890,
            }},
            {88, new List<int>()
            {
                6109,
            }},
            {89, new List<int>()
            {
                12397,
            }},
            {32, new List<int>() // Hyjal
                {
                    17767,
                    17808,
                    17842,
                    17888,
                    17968
                }
            },
            {33, new List<int>() // Kara
                {
                    15550,
                    15687,
                    15688,
                    15689,
                    15690,
                    15691,
                    16457,
                    16524,
                    17225,
                    100002,
                }
            },
            {36, new List<int>() // Mag
                {
                    17257,
                }
            },
            {40, new List<int>() // SSC
                {
                    21212,
                    21213,
                    21214,
                    21215,
                    21216,
                    21217,
                }
            },
            {41, new List<int>() // Tempest Keep
                {
                    18805, // ?
                    19514,
                    19516,
                    19622,
                }
            },
            {52, new List<int>() // Black Temple
                {
                    22841,
                    22887,
                    22898,
                    22917,
                    22947,
                    22948,
                    22871,
                    100000,
                    100001,
                }
            },
            {53, new List<int>() // Gruuls Lair
                {
                    18831,
                    19044,
                }
            },
            {55, new List<int>() // Zul'Aman
                {
                    23574,
                    23576,
                    23577,
                    23578,
                    23863,
                    24239
                }
            },
            {61, new List<int>() // Sunwell
                {
                    24882,
                    24844, // Kalecgos
                    25038,
                    100003,
                    25741, // 25960 M'uru
                    25315
                }
            },
            {90, new List<int>()
            {
                18728,
            }},

        };

        public static Dictionary<int, int> m_NumPerInstance = new Dictionary<int, int>()
        {
            {16,1}, // Ony
            {19,12}, // ZG
            {23,10}, // MC
            {25,8}, // BWL
            {27,6}, // AQ20
            {29,9}, // AQ40
            {31,15}, // Naxx
            {84,4 }, // NM dragons... TODO
            {85,4 },
            {86,4 },
            {87,4 },
            {88,1 },
            {89,1 },

            // TBC
            { 41, 4 }, // TK
            { 36, 1 }, // Mag
            { 32, 5 }, // Hyjal
            { 53, 2 }, // Gruul
            { 55, 6 }, // ZA
            { 61, 6 }, // Sunnwell
            { 40, 6 }, // SSC
            { 52, 9 }, // BT
            { 33, 8 }, // Kara
            {90,1 },
        };


        private static string[] m_PvPRankName = new string[30]
        {
            "None",
            "Private",
            "Corporal",
            "Sergeant",
            "Master Sergeant",
            "Seargeant Major",
            "Knight",
            "Knight-Lieutenant",
            "Knight-Captain",
            "Knight-Champion",
            "Lieutenant Commander",
            "Commander",
            "Marshal",
            "Field Marshal",
            "Grand Marshal",
            "None",
            "Scout",
            "Grunt",
            "Sergeant",
            "Senior Sergeant",
            "First Sergeant",
            "Stone Guard",
            "Blood Guard",
            "Legionnaire",
            "Centurion",
            "Champion",
            "Lieutenant General",
            "General",
            "Warlord",
            "High Warlord"
        };

        public static string GetRankName(short faction, short rank)
        {
            if (faction == 2)
                return m_PvPRankName[15 + rank];
            return m_PvPRankName[rank];
        }

        public static String toTableRow(this object[] row)
        {
            String r = "<tr>";
            foreach (object i in row)
                r += "<td>" + i.ToString() + "</td>";
            return r + "</tr>";
        }

        public static string GetQueryString(System.Web.HttpRequest _RequestObject, string _QueryName, string _DefaultValue = "null")
        {
            string request = _RequestObject.QueryString.Get(_QueryName);
            return !string.IsNullOrEmpty(request) ? SecureInput(request) : _DefaultValue;
        }

        private static string[] m_MalInput = new String[14]
        {
            "--",
            //";",
            "\\",
            "DROP",
            "drop",
            "delete",
            "DELETE",
            "reset",
            "RESET",
            "`",
            "\"",
            "'",
            "<",
            ">",
            "SELECT"
        };

        public static string SecureInput(string str)
        {
            return m_MalInput.Aggregate(str, (current, t) => current.Replace(t, ""));
        }

        public static string GetCookie(HttpRequest _Request, string _Name, string _Default = "")
        {
            HttpCookie myCookie = _Request.Cookies[_Name];
            if (myCookie == null)
                return _Default;
            return SecureInput(myCookie.Value);
        }

        public static void SetCookie(HttpResponse _Response, HttpRequest _Request, string _Name, string _Value, int _Time = 0)
        {
            //_Value = SecureInput(_Value);
            HttpCookie myCookie = _Request.Cookies[_Name];
            DateTime now = DateTime.Now;
            if (myCookie == null)
                myCookie = new HttpCookie(_Name);

            myCookie.Value = _Value;
            if (_Time == 0)
                myCookie.Expires = now.AddYears(50);
            else
                myCookie.Expires = now.AddSeconds(_Time);
            _Response.Cookies.Add(myCookie);
        }

        public static void GetRealmList(ref HtmlSelect select, bool _IgnoreAny = false, int expansion = 0, bool _AllExpansion = false)
        {
            if (_AllExpansion)
            {
                int count = App.m_Server.Length + 1;
                if ((!_IgnoreAny && select.Items.Count == count)
                    || (_IgnoreAny && select.Items.Count == count - 1))
                    return;
            }
            else
            {
                int count = App.m_Server.Count(x => x.Expansion == expansion) + 1;
                if ((!_IgnoreAny && select.Items.Count == count)
                    || (_IgnoreAny && select.Items.Count == count - 1))
                    return;
            }
            select.Items.Clear();
            if (!_IgnoreAny)
                select.Items.Add(new ListItem("Any realm", "0"));

            for (int i = 1; i < App.m_Server.Length; ++i)
            {
                if (App.m_Server[i].Expansion == expansion)
                    select.Items.Add(new ListItem(App.m_Server[i].Name, i.ToString()));
            }
        }

        public static string[] m_ClassList = new string[13]
        {
            "Any class",
            "Warrior",
            "Rogue",
            "Priest",
            "Hunter",
            "Druid",
            "Mage",
            "Warlock",
            "Paladin",
            "Shaman",
            "Deathknight",
            "Monk",
            "Demonhunter"
        };
        public static void GetClassList(ref HtmlSelect select)
        {
            if (select.Items.Count == m_ClassList.Length)
                return;
            select.Items.Clear();
            for (int i = 0; i < m_ClassList.Length; ++i)
                select.Items.Add(new ListItem(m_ClassList[i], i.ToString()));
        }

        public static void GetFactionList(ref HtmlSelect select)
        {
            if (select.Items.Count == 3)
                return;
            select.Items.Clear();
            select.Items.Add(new ListItem("Any faction", "0"));
            select.Items.Add(new ListItem("Alliance", "1"));
            select.Items.Add(new ListItem("Horde", "2"));
        }
        
        public static void GetRaidList(ref HtmlSelect select, bool ignoreAny = false, int expansion = 0)
        {
            if (ignoreAny && select.Items.Count == App.m_Instances.Where(x => x.Value.Expansion == expansion).Count() + (expansion == 2 ? 1 : 0))
                return;
            if (!ignoreAny && select.Items.Count == App.m_Instances.Where(x => x.Value.Expansion == expansion).Count() + 1 + (expansion == 2 ? 1 : 0))
                return;
            select.Items.Clear();
            if (!ignoreAny)
                select.Items.Add(new ListItem("Any raid", "0"));
            foreach (var instance in App.m_Instances.Where(x => x.Value.Expansion == expansion || (expansion == 2 && x.Value.Name == "Naxxramas")).ToArray())
            {
                //if (instance.Value.Expansion == expansion)
                select.Items.Add(new ListItem(instance.Value.Name, instance.Key.ToString()));
            }
        }

        public static void GetTypeList(ref HtmlSelect select)
        {
            if (select.Items.Count == 3)
                return;
            select.Items.Clear();
            select.Items.Add(new ListItem("DPS", "0"));
            select.Items.Add(new ListItem("HPS", "1"));
            select.Items.Add(new ListItem("TPS", "2"));
        }

        public static void GetExpansionList(ref HtmlSelect select)
        {
            if (select.Items.Count == 2)
                return;
            select.Items.Clear();
            select.Items.Add(new ListItem("Vanilla", "0"));
            select.Items.Add(new ListItem("TBC", "1"));
        }

        public static string GetSeenSince(long ts)
        {
            DateTime when = DateTimeOffset.FromUnixTimeMilliseconds(ts).UtcDateTime;
            TimeSpan since = DateTime.Now.ToUniversalTime().Subtract(when);
            if (since.TotalMinutes < 60)
                return $"{(int)since.TotalMinutes} minutes";
            if (since.TotalHours < 24)
                return $"{(int)since.TotalHours} hours";
            if (since.TotalDays < 365)
                return $"{(int)since.TotalDays} days";
            return $"{(int)(since.TotalDays / 365)} days";
        }

        private static readonly DateTime Epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        public static long ConvertToTimestamp(DateTime value)
        {
            TimeSpan elapsedTime = value - Epoch;
            return (long)elapsedTime.TotalSeconds;
        }

        public static string GetTimeFromMillisecondsWithoutSeconds(long ts)
        {
            DateTime time = DateTimeOffset.FromUnixTimeMilliseconds(ts).UtcDateTime;
            return (time.Month < 10 ? "0" + time.Month : time.Month.ToString()) + "/" +
                   (time.Day < 10 ? "0" + time.Day : time.Day.ToString()) + "/" + time.Year + " " +
                   (time.Hour < 10 ? "0" + time.Hour : time.Hour.ToString()) + ":" +
                   (time.Minute < 10 ? "0" + time.Minute : time.Minute.ToString());
        }

        public static string GetIPAddress(HttpRequest _Request)
        {
            string ipAddress = _Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

            if (!string.IsNullOrEmpty(ipAddress))
            {
                string[] addresses = ipAddress.Split(',');
                if (addresses.Length != 0)
                {
                    return addresses[0];
                }
            }

            return _Request.ServerVariables["REMOTE_ADDR"];
        }

        private static readonly Random Random = new Random();
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[Random.Next(s.Length)]).ToArray());
        }

        public static uint GetUnixTimeStamp()
        {
            return (uint)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
        }

        public static int FindIndex<T>(IEnumerable<T> items, Func<T, bool> predicate)
        {
            if (items == null) throw new ArgumentNullException("items");
            if (predicate == null) throw new ArgumentNullException("predicate");

            int retVal = 0;
            foreach (var item in items.ToList())
            {
                if (predicate(item)) return retVal;
                retVal++;
            }
            return -1;
        }

        public static void SendMail(string FromAddress, string ToAddress, string Subject, string BodyText)
        {
            try
            {
                
                SmtpClient mySmtpClient = new SmtpClient("smtp.legacyplayers.com");
                // set smtp-client with basicAuthentication

                mySmtpClient.UseDefaultCredentials = false;
                System.Net.NetworkCredential basicAuthenticationInfo = new
                    System.Net.NetworkCredential("shino", "obscurred");
                mySmtpClient.Credentials = basicAuthenticationInfo;
                
                mySmtpClient.EnableSsl = true;


                // add from,to mailaddresses
                MailAddress from = new MailAddress(FromAddress);
                MailAddress to = new MailAddress(ToAddress);
                MailMessage myMail = new System.Net.Mail.MailMessage(from, to);

                // add ReplyTo
                MailAddress replyto = new MailAddress("shino@legacyplayers.com");
                myMail.ReplyToList.Add(replyto);

                // set subject and encoding
                myMail.Subject = Subject;
                myMail.SubjectEncoding = System.Text.Encoding.UTF8;

                // set body-message and encoding
                myMail.Body = BodyText;
                myMail.BodyEncoding = System.Text.Encoding.UTF8;
                // text or html
                myMail.IsBodyHtml = true;

                mySmtpClient.Send(myMail);
            }
            catch (SmtpException ex)
            {
                throw new ApplicationException
                    ("SmtpException has occured: " + ex.Message);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static string[] mobileDevices = new string[] {"iphone","ppc",
            "windows ce","blackberry",
            "opera mini","mobile","palm",
            "portable","opera mobi", "ipod", "android", "windows phone os", "ie mobile", "fennec" };
        public static bool IsMobileDevice(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent))
                return false;
            userAgent = userAgent.ToLower();
            return mobileDevices.Any(x => userAgent.Contains(x));
        }

        public static string GetImageType(HttpRequest _Request, string _Default = "jpg")
        {
            string type = _Request.Browser.Type.ToLower();
            if (type.Contains("opera") || type.Contains("chrome") || type.Contains("google"))
                return "webp";
            type = _Request.UserAgent?.ToString().ToLower();
            if (type.Contains("opera") || type.Contains("chrome") || type.Contains("google"))
                return "webp";
            type = _Request.Browser.Browser.ToString().ToLower();
            if (type.Contains("opera") || type.Contains("chrome") || type.Contains("google"))
                return "webp";
            return _Default;
        }
    }
}