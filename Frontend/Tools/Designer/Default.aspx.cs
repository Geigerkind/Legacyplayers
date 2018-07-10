using System;
using System.Linq;
using RPLL;


public partial class Tools_Designer_Default : System.Web.UI.Page
{
    public string mItems = "";
    public string mItemIds = "";

    public int mExpansion = 0;
    public int mRace = 0;
    public int mGender = 3;
    public int mClass = 0;
    public int mSpec = 0;

    public ItemSlot[] mItemSlots = new ItemSlot[19];

    private void ParseSlot(ref ItemSlot _Slot, string _Text)
    {
        string[] Token = _Text.Split(';');
        if (Token.Length >= 1)
        {
            int id = 0;
            int.TryParse(Token[0], out id);
            _Slot.ItemId = id;
        }

        if (Token.Length >= 2)
        {
            short id = 0;
            short.TryParse(Token[1], out id);
            _Slot.EnchId = id;
        }

        if (Token.Length >= 3)
        {
            short id = 0;
            short.TryParse(Token[2], out id);
            _Slot.GemId1 = id;
        }

        if (Token.Length >= 4)
        {
            short id = 0;
            short.TryParse(Token[3], out id);
            _Slot.GemId2 = id;
        }

        if (Token.Length >= 5)
        {
            short id = 0;
            short.TryParse(Token[4], out id);
            _Slot.GemId3 = id;
        }
    }

    private string GetData(int _Expansion, int _Race, int _Gender, int _Class, int _Spec, ItemSlot[] _ItemSlots)
    {
        return string.Concat(_Expansion, ";", _Race, ";", _Gender, ";", _Class, ";", _Spec, ";",
            string.Join(";", _ItemSlots.Select(x => x.Serialize())));
    }

    public int GetStatByType(int type)
    {
        return mItemSlots.Sum(x => x.Item(mExpansion).Stats.Where(y => y.Key == type).Sum(y => y.Value) +
                                    App.m_EnchantmentStats[mExpansion][x.EnchId].Stats.Where(y => y.Key == type)
                                        .Sum(y => y.Value) +
                                    (mExpansion > 0
                                        ? App.m_EnchantmentStats[mExpansion][
                                                    App.m_GemProperties[mExpansion - 1][x.GemId1].EnchId].Stats
                                                .Where(y => y.Key == type).Sum(y => y.Value) +
                                            App.m_EnchantmentStats[mExpansion][
                                                    App.m_GemProperties[mExpansion - 1][x.GemId2].EnchId].Stats
                                                .Where(y => y.Key == type).Sum(y => y.Value) +
                                            App.m_EnchantmentStats[mExpansion][
                                                    App.m_GemProperties[mExpansion - 1][x.GemId3].EnchId].Stats
                                                .Where(y => y.Key == type).Sum(y => y.Value)
                                        : 0)
                                    + App.m_EnchantmentStats[mExpansion][x.GetSocketBonus(mExpansion)].Stats
                                        .Where(y => y.Key == type).Sum(y => y.Value)
        );
    }

    public int GetArmor()
    {
        return mItemSlots.Sum(x => x.Item(mExpansion).Armor) + GetStatByType(33);
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!App.loaded && !Server.MapPath(".").ToLower().Contains("loading"))
        {
            try { Response.Redirect("/Loading/", false); Context.ApplicationInstance.CompleteRequest(); } catch (System.Threading.ThreadAbortException) { }
            return;
        }

        this.Title = "LegacyPlayers | Character Designer";

        if (IsPostBack)
        {
            int.TryParse(pmExpansion.Value, out mExpansion);
            int.TryParse(pmClass.Value, out mClass);
            int.TryParse(pmGender.Value, out mGender);
            int.TryParse(pmRace.Value, out mRace);
            int.TryParse(pmSpec.Value, out mSpec);

            ParseSlot(ref mItemSlots[0], s1.Value);
            ParseSlot(ref mItemSlots[1], s2.Value);
            ParseSlot(ref mItemSlots[2], s3.Value);
            ParseSlot(ref mItemSlots[3], s4.Value);
            ParseSlot(ref mItemSlots[4], s5.Value);
            ParseSlot(ref mItemSlots[5], s6.Value);
            ParseSlot(ref mItemSlots[6], s7.Value);
            ParseSlot(ref mItemSlots[7], s8.Value);
            ParseSlot(ref mItemSlots[8], s9.Value);
            ParseSlot(ref mItemSlots[9], s10.Value);
            ParseSlot(ref mItemSlots[10], s11.Value);
            ParseSlot(ref mItemSlots[11], s12.Value);
            ParseSlot(ref mItemSlots[12], s13.Value);
            ParseSlot(ref mItemSlots[13], s14.Value);
            ParseSlot(ref mItemSlots[14], s15.Value);
            ParseSlot(ref mItemSlots[15], s16.Value);
            ParseSlot(ref mItemSlots[16], s17.Value);
            ParseSlot(ref mItemSlots[17], s18.Value);
            ParseSlot(ref mItemSlots[18], s19.Value);
        }
        else
        {
            string data = Utility.GetQueryString(Request, "data", "");
            int url = 0;
            int.TryParse(Utility.GetQueryString(Request, "s", "0"), out url); // Short Link
            if (url != 0)
            {
                var dr = App.GetDB().Query("SELECT data FROM db_shortlink WHERE id = " + url).ExecuteReaderRpll();
                if (dr.HasRows && dr.Read()) data = dr.GetString(0);
                dr.CloseRpll();
            }

            if (data != "")
            {
                string[] Token = data.Split(';');
                if (Token.Length >= 99)
                {
                    int.TryParse(Token[0], out mExpansion);
                    pmExpansion.Value = mExpansion.ToString();
                    int.TryParse(Token[1], out mRace);
                    pmRace.Value = mRace.ToString();
                    int.TryParse(Token[2], out mGender);
                    pmGender.Value = mGender.ToString();
                    int.TryParse(Token[3], out mClass);
                    pmClass.Value = mClass.ToString();
                    int.TryParse(Token[4], out mSpec);
                    pmSpec.Value = mSpec.ToString();

                    for (int i = 0; i < 19; ++i)
                        ParseSlot(ref mItemSlots[i],
                            string.Concat(Token[5 + i * 5], ";", Token[6 + i * 5],
                                ";" + Token[7 + i * 5] + ";" + Token[8 + i * 5], ";", Token[9 + i * 5], ";"));
                    s1.Value = mItemSlots[0].Serialize();
                    s2.Value = mItemSlots[1].Serialize();
                    s3.Value = mItemSlots[2].Serialize();
                    s4.Value = mItemSlots[3].Serialize();
                    s5.Value = mItemSlots[4].Serialize();
                    s6.Value = mItemSlots[5].Serialize();
                    s7.Value = mItemSlots[6].Serialize();
                    s8.Value = mItemSlots[7].Serialize();
                    s9.Value = mItemSlots[8].Serialize();
                    s10.Value = mItemSlots[9].Serialize();
                    s11.Value = mItemSlots[10].Serialize();
                    s12.Value = mItemSlots[11].Serialize();
                    s13.Value = mItemSlots[12].Serialize();
                    s14.Value = mItemSlots[13].Serialize();
                    s15.Value = mItemSlots[14].Serialize();
                    s16.Value = mItemSlots[15].Serialize();
                    s17.Value = mItemSlots[16].Serialize();
                    s18.Value = mItemSlots[17].Serialize();
                    s19.Value = mItemSlots[18].Serialize();
                }
            }
        }

        if (IsPostBack && shortlink.Value == "true")
        {
            var db = App.GetDB();
            string data = GetData(mExpansion, mRace, mGender, mClass, mSpec, mItemSlots);
            db.Query("INSERT INTO db_shortlink (data) VALUES (\"" + data + "\")").ExecuteScalar();
            var dr = db.Query("SELECT id FROM db_shortlink WHERE data = \"" + data + "\" ORDER BY id DESC LIMIT 1")
                .ExecuteReaderRpll();
            int s = 0;
            if (dr.HasRows && dr.Read()) s = dr.GetInt32(0);
            dr.CloseRpll();
            shortlink.Value = "false";
            Response.Redirect("/Tools/Designer/?s=" + s);
            return;
        }

        if (mExpansion >= 2) mExpansion = 1; // wotlk not supporeted yet

        mItems = string.Join(",",
            App.m_Items[mExpansion].Values
                .Where(x => x.InventoryType > 1 && (x.ItemLevel > 40 || x.InventoryType == 4 || x.InventoryType == 19))
                .Select(x => "\"" + x.Name.Replace("\"", "\\\"") + "\""));
        mItems += "," + string.Join(",",
                        App.m_EnchantmentStats[mExpansion].Values
                            .Select(x => "\"" + x.Name.Replace("\"", "\\\"") + "\""));
        mItemIds = string.Join(",",
            App.m_Items[mExpansion]
                .Where(x => x.Value.InventoryType > 1 && (x.Value.ItemLevel > 40 || x.Value.InventoryType == 4 || x.Value.InventoryType == 19))
                .Select(x => "\"" + x.Key + "\""));
        mItemIds += "," + string.Join(",", App.m_EnchantmentStats[mExpansion].Keys.Select(x => x));
        if (mExpansion >= 1)
        {
            mItems += "," + string.Join(",",
                            App.m_GemProperties[mExpansion - 1].Values.Select(x =>
                                "\"" + App.m_Items[mExpansion][x.Entry].Name.Replace("\"", "\\\"") + "\""));
            mItemIds += "," + string.Join(",", App.m_GemProperties[mExpansion - 1].Values.Select(x => x.EnchId));
        }
    }
}
