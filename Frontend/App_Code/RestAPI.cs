using Newtonsoft.Json;
using System.Linq;

namespace RPLL
{
    public static class RestAPI
    {
        private static string QueryDB(int _DB, string _Table, string[] _Columns, string _Where = "", int _WhereId = -1)
        {
            string TableString = "";
            for (int i=0; i< _Columns.Length; ++i)
            {
                if (i != 0) TableString += ",";
                TableString += "'" + _Columns[i] + "', " + _Columns[i];
            }
            string json = "[";
            var dr = App.GetDB(_DB).Query("SELECT JSON_OBJECT(" + TableString + ") FROM " + _Table + ((_WhereId > 0 && _Where != "") ? " WHERE "+_Where+ "="+_WhereId : "")).ExecuteReaderRpll();
            var count = 0;
            while (dr.Read())
            {
                if (count != 0) json += ",";
                json += dr.GetString(0);
                ++count;
            }
            dr.CloseRpll();
            return json + "]";
        }

        private static string GetCharacterData(int _Id, string _Name = "")
        {
            if (_Id == 0 && _Name != "")
            {
                var filtered = App.m_Chars.Values.Where(x => x.Name == _Name).ToArray();
                if (filtered.Length > 0)
                    _Id = filtered[0].CharId;
            }
            return JsonConvert.SerializeObject(App.GetChar(_Id, true));
        }

        private static string GetGuildData(int _Id, string _Name = "")
        {
            if (_Id == 0 && _Name != "")
            {
                var filtered = App.m_Guilds.Values.Where(x => x.Name == _Name).ToArray();
                if (filtered.Length > 0)
                    _Id = filtered[0].ID;
            }
            return JsonConvert.SerializeObject(App.GetGuild(_Id, true)); ;
        }

        public static string Get(int _Type = 99, int _Arg1 = 0, int _Arg2 = 0, int _Arg3 = 0, int _Arg4 = 0, int _Arg5 = 0, int _Arg6 = 0, int _Arg7 = 0,
            int _Arg8 = 0, int _Arg9 = 0, int _Arg10 = 0, string _StrArg1 = "", string _StrArg2 = "", string _StrArg3 = "")
        {
            switch (_Type)
            {
                case 1:
                    return "{\"Error\":\"Not supported\"}";
                    //Response.Write(Tooltip.GetSpell(Convert.ToInt32(Request.QueryString.Get("id")), "vanilla"));
                    //break;
                case 0:
                    /*
                     * Arg1 = Id
                     * Arg2 = Charid
                     */
                    return Tooltip.GetItem(_Arg1,
                        _Arg2 == 0 ? "vanilla" : "tbc",
                        _Arg2);
                case 2:
                    /*
                     * Arg1 = Id
                     * Arg2 = InstanceId
                     */
                    return Tooltip.GetGuildProgress(_Arg1,
                        _Arg2);
                case 3:
                    /*
                     * Arg1 = GuildId
                     */
                    return Tooltip.GetGuild(_Arg1);
                case 4:
                    /*
                     * Arg1 = CharId
                     */
                    return Tooltip.GetCharacter(_Arg1);
                case 5:
                    /*
                     * Arg1 = AbilityId
                     * Arg2 = Raid Instance Id
                     * Arg3 = Uploader Id
                     * Arg4 = SourceId
                     * Arg5 = TargetId
                     * Arg6 = Start
                     * Arg7 = End
                     * Arg8 = Category Id
                     * Arg9 = Attempt Id
                     * Arg10 = Expansion Id
                     * StrArg1 = Mode
                     */
                    return Tooltip.GetRvRowData(_Arg1,
                        _Arg2,
                        _Arg3,
                        _Arg4,
                        _Arg5,
                        _Arg6,
                        _Arg7,
                        _Arg8,
                        _Arg9,
                        _StrArg1,
                        _Arg10);
                case 6:
                    /*
                     * Arg1 = CharId/NpcId
                     * Arg2 = Raid Instance Id
                     * Arg3 = Uploader Id
                     * Arg4 = SourceId
                     * Arg5 = TargetId
                     * Arg6 = Start
                     * Arg7 = End
                     * Arg8 = Category Id
                     * Arg9 = Attempt Id
                     * Arg10 = Expansion Id
                     * StrArg1 = Mode
                     */
                    return Tooltip.GetRvRowPreview(_Arg1,
                        _Arg2,
                        _Arg3,
                        _Arg4,
                        _Arg5,
                        _Arg6,
                        _Arg7,
                        _Arg8,
                        _Arg9,
                        _StrArg1,
                        _Arg10);
                case 7:
                    return GetCharacterData(_Arg1, _StrArg1);
                case 8:
                    return GetGuildData(_Arg1, _StrArg1);
                case 9:
                    return QueryDB(0, "db_shortlink", new []{"id", "data"}, "id", _Arg1);
                case 10:
                    /*
                     * Arg1 = Expansion
                     * Arg2 = UploaderId
                     */
                    return QueryDB(_Arg1 == 0 ? 1 : 2, "rs_loot", new[] {"targetid", "itemid", "attemptid"},
                        "uploaderid", _Arg2);
                case 11:
                    /*
                     * Arg1 = GuildId
                     */
                    return JsonConvert.SerializeObject(App.m_Chars.Values.Where(x => x.RefGuild.GuildID == _Arg1).Select(x => x.CharId));
                case 12: // Raid composition
                         /*
                          * Arg1 = Expansion
                          * Arg2 = Uploaderid
                          */
                    return QueryDB(_Arg1 + 1, "rs_participants", new[] {"charid"}, "uploaderid", _Arg2);
                case 1337:
                    return QueryDB(0, "db_servernames", new []{"id", "expansion", "name", "logon"});
                case 1338:
                    int Launcher = 4;
                    int Vanilla = 24;
                    int TBC = 125;
                    int WOTLK = 200;
                    int CATA = 300;
                    int MOP = 400;
                    int WOD = 500;
                    return "{\"Launcher\":" + Launcher + ",\"Vanilla\":" + Vanilla + ",\"TBC\":" + TBC + ",\"WOTLK\":" +
                           WOTLK + ",\"CATA\":" + CATA + ",\"MOP\":" + MOP + ",\"WOD\":" + WOD + "}";
            }

            return "{\"Error\":\"Retrieving information\"}";
        }

    }
}