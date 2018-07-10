using System;
using System.Collections.Generic;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Linq;
using System.Web;
using RPLL;

namespace RPLL
{
    public class Tooltip
    {
        private static string SocketColor(short socket)
        {
            if (socket == 8)
                return "Blue";
            if (socket == 4)
                return "Yellow";
            if (socket == 2)
                return "Red";
            if (socket == 1)
                return "Meta";
            return "??Unknown??";
        }
        public static string GetItem(int itemid, string expansion, int charid = 0)
        {
            int expansionid = 0;
            if (charid > 300000)
                expansionid = App.GetChar(charid).Expansion();

            if ((expansion != "vanilla" && charid <= 1) || expansionid == 1)
            {
                expansionid = 1;
            }

            if (!App.m_Items[expansionid].ContainsKey(itemid))
                return "{\"Error\":\"Error retrieving information\"}";

            string json = "{\"Error\":\"None\",\"Type\":0,\"Expansion\":" + expansionid + ",";
            DBItems item = App.m_Items[expansionid][itemid];
            DBChars cr = (charid > 300000) ? App.GetChar(charid) : null;
            json += "\"Quality\":" + item.Quality + ",\"Name\":\"" + item.Name + "\"";
            json += ",\"Bonding\":" + item.Bonding;
            json += ",\"Sheath\":" + (item.InventoryType == 13 || item.InventoryType == 14 ? item.Sheath : 0);
            json += ",\"InventoryType\":" + (!(item.InventoryType == 13 || item.InventoryType == 14) ? item.InventoryType : 29);
            json += ",\"SCWeapon\":" + (item.Class == 2 && item.SubClass < 22 ? item.SubClass : 21);
            json += ",\"SCType\":" + (item.Class == 4 && item.SubClass < 11 ? item.SubClass : 10);
            json += ",\"SCMisc\":" + (item.Class == 7 && item.SubClass < 14 ? item.SubClass : 13);
            json += ",\"Class\":" + item.Class;

            if (item.Class == 2)
            {
                json += ",\"DmgMin1\":" + Math.Round(item.Dmg[0].Min / 1000.0, 1) + ",\"DmgMax1\":" + Math.Round(item.Dmg[0].Max / 1000.0, 1) + ",\"DmgType1\":" + item.Dmg[0].Type + ",\"Delay\":" + Math.Round(item.Delay / 1000.0, 1).ToString("n2");
                json += ",\"DmgMin2\":" + Math.Round(item.Dmg[1].Min / 1000.0, 1) + ",\"DmgMax2\":" + Math.Round(item.Dmg[1].Max / 1000.0, 1) + ",\"DmgType2\":" + item.Dmg[1].Type;
                json += ",\"DmgMin3\":" + Math.Round(item.Dmg[2].Min / 1000.0, 1) + ",\"DmgMax3\":" + Math.Round(item.Dmg[2].Max / 1000.0, 1) + ",\"DmgType3\":" + item.Dmg[2].Type;
            }

            json += ",\"Armor\":" + item.Armor;
            json += ",\"Stats1\": [";
            int added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && item.Stats[i].Key > 25 && item.Stats[i].Key < 31)
                {
                    if (added == 0) json += item.Stats[i].Key;
                    else json += "," + item.Stats[i].Key;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Values1\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && item.Stats[i].Key > 25 && item.Stats[i].Key < 31)
                {
                    if (added == 0) json += item.Stats[i].Value;
                    else json += "," + item.Stats[i].Value;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Stats2\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && item.Stats[i].Key < 6)
                {
                    if (added == 0) json += item.Stats[i].Key;
                    else json += "," + item.Stats[i].Key;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Values2\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && item.Stats[i].Key < 6)
                {
                    if (added == 0) json += item.Stats[i].Value;
                    else json += "," + item.Stats[i].Value;
                    ++added;
                }
            }
            json += "]";

            DB_am_ref_gear_slot[] slot = charid > 300000 ? cr.RefGear.Slots.Where(x => x.ItemID == itemid).Take(1).ToArray() : new DB_am_ref_gear_slot[0];
            json += ",\"EnchStats\":\"" + (charid > 300000 && slot.Length > 0 && slot[0].EnchID > 0 ? App.m_EnchantmentStats[expansionid][slot[0].EnchID].Name : "") + "\"";
            json += ",\"Gems\": [";
            var sb = "";
            var sbq = 0;
            if (slot.Length > 0 && slot[0].GemId > 0)
            {
                var imgType = Utility.GetImageType(HttpContext.Current.Request, "jpg");
                DB_am_ref_gear_slot_gems gems = App.m_RefGearSlotGems[expansionid - 1][slot[0].GemId];

                json += "{\"Icon\":\"" + App.m_Items[expansionid][App.m_GemProperties[expansionid - 1][gems.Gem1].Entry].IconName + "." + imgType + "\",\"Quality\":" + (slot[0].GemMeetsSocket(gems.Gem1, item.Socket1, expansionid) ? 2 : 0) + ",\"Name\":\"" + App.m_EnchantmentStats[expansionid][
                    App.m_GemProperties[expansionid - 1][gems.Gem1].EnchId].Name + "\"}";

                if (gems.Gem1 > 0)
                    json += "{\"Icon\":\"" + App.m_Items[expansionid][App.m_GemProperties[expansionid - 1][gems.Gem1].Entry].IconName + "." + imgType + "\",\"Quality\":" +
                            (slot[0].GemMeetsSocket(gems.Gem1, item.Socket1, expansionid) ? 2 : 0) + ",\"Name\":\"" + SocketColor(item.Socket1) + "\"}";
                else if (item.Socket1 > 0)
                    json += "{\"Icon\":\"" + item.Socket1 + ".gif\",\"Quality\":0,\"Name\":\"" + App.m_EnchantmentStats[expansionid][App.m_GemProperties[expansionid - 1][gems.Gem1].EnchId].Name + "\"}";
                if (gems.Gem2 > 0)
                    json += ",{\"Icon\":\"" + App.m_Items[expansionid][App.m_GemProperties[expansionid - 1][gems.Gem2].Entry].IconName + "." + imgType + "\",\"Quality\":" +
                            (slot[0].GemMeetsSocket(gems.Gem2, item.Socket2, expansionid) ? 2 : 0) + ",\"Name\":\"" + SocketColor(item.Socket2) + "\"}";
                else if (item.Socket2 > 0)
                    json += ",{\"Icon\":\"" + item.Socket2 + ".gif\",\"Quality\":0,\"Name\":\"" + App.m_EnchantmentStats[expansionid][App.m_GemProperties[expansionid - 1][gems.Gem2].EnchId].Name + "\"}";
                if (gems.Gem3 > 0)
                    json += ",{\"Icon\":\"" + App.m_Items[expansionid][App.m_GemProperties[expansionid - 1][gems.Gem3].Entry].IconName + "." + imgType + "\",\"Quality\":" +
                            (slot[0].GemMeetsSocket(gems.Gem3, item.Socket3, expansionid) ? 2 : 0) + ",\"Name\":\"" + SocketColor(item.Socket3) + "\"}";
                else if (item.Socket3 > 0)
                    json += ",{\"Icon\":\"" + item.Socket3 + ".gif\",\"Quality\":0,\"Name\":\"" + App.m_EnchantmentStats[expansionid][App.m_GemProperties[expansionid - 1][gems.Gem3].EnchId].Name + "\"}";

                if (slot[0].HasSocketBonus(expansionid))
                {
                    sb = App.m_EnchantmentStats[expansionid][slot[0].GetSocketBonus(expansionid)].Name;
                    sbq = 2;
                }
                else
                {
                    sb = App.m_EnchantmentStats[expansionid][slot[0].Item(expansionid).SocketBonus].Name;
                    sbq = 0;
                }
            }
            json += "]";
            json += ",\"SocketBonus\":\"" + sb + "\"";
            json += ",\"SocketQuality\":" + sbq;
            json += ",\"MaxDurability\":" + item.MaxDurability;
            json += ",\"ItemLevel\":" + item.ItemLevel;
            json += ",\"RequiredLevel\":" + item.RequiredLevel;

            json += ",\"Stats3\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && ((item.Stats[i].Key >= 6 && item.Stats[i].Key <= 25) || item.Stats[i].Key > 30))
                {
                    if (added == 0) json += item.Stats[i].Key;
                    else json += "," + item.Stats[i].Key;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Values3\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && ((item.Stats[i].Key >= 6 && item.Stats[i].Key <= 25) || item.Stats[i].Key > 30))
                {
                    if (added == 0) json += item.Stats[i].Value;
                    else json += "," + item.Stats[i].Value;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Extra\": [";
            added = 0;
            foreach (string extra in item.ExtraTooltip.Split(new[] { ".," }, StringSplitOptions.None))
            {
                if (extra != "")
                {
                    if (added == 0) json += "\"" + extra + "\"";
                    else json += "," + "\"" + extra + "\"";
                    ++added;
                }
            }
            json += "]";

            var itemSetName = "";
            if (item.ItemSetId > 0)
            {
                itemSetName = item.ItemSet.Name;
                json += ",\"SetItems\": [";
                string[] itemids = item.ItemSet.SetIds.Split(',');
                short counter = 0;
                short amountItems = 0;
                foreach (string itm in item.ItemSet.SetNames.Split(','))
                {
                    bool condition = (charid > 300000) ? cr.RefGear.Slots.Select(x => x.ItemID.ToString() == itemids[counter]).Contains(true) : false;
                    if (condition)
                        ++amountItems;
                    if (counter != 0) json += ",";
                    json += "{\"Quality\":" + (condition ? 2 : 0) + ",\"Name\": \"" + itm + "\"}";
                    ++counter;
                }
                json += "]";
                counter = 0;
                json += ",\"SetEffects\": [";
                foreach (string effect in item.ItemSet.SetEffectNames.Split(new[] { ".," }, StringSplitOptions.None))
                {
                    if (counter != 0) json += ",";
                    short effectnum = 0;
                    json += "{\"Active\":" + ((short.TryParse(effect[1].ToString(), out effectnum) && effectnum <= amountItems) ? 2 : 0) + ",\"Name\": \"" + effect + "\"}";
                    ++counter;
                }
                json += "]";
            }
            json += ",\"ItemSetName\":" + "\"" + itemSetName + "\"";
            json += ",\"Icon\":" + "\"" + item.IconName + "\"}";
            return json;
            //return "{\"icon\":\"" + item.IconName + "\",\"tooltip\":\"" + json.Replace("\"", "\\\"") + "\"}";
        }

        public static string GetItemDesigner(string _SerializedItemSlot)
        {
            string[] Token = _SerializedItemSlot.Split(';');
            if (Token.Length != 6)
                return "{\"Error\":\"Error retrieving information\"}";

            int expansionid = 0;
            int itemid = 0;
            short enchid = 0;
            short gemid1 = 0;
            short gemid2 = 0;
            short gemid3 = 0;

            int.TryParse(Token[0], out itemid);
            short.TryParse(Token[1], out enchid);
            short.TryParse(Token[2], out gemid1);
            short.TryParse(Token[3], out gemid2);
            short.TryParse(Token[4], out gemid3);
            int.TryParse(Token[5], out expansionid);

            ItemSlot itemSlot = new ItemSlot()
            {
                ItemId = itemid,
                EnchId = enchid,
                GemId1 = gemid1,
                GemId2 = gemid2,
                GemId3 = gemid3
            };



            if (!App.m_Items[expansionid].ContainsKey(itemid))
                return "{\"Error\":\"Error retrieving information\"}";

            string json = "{\"Error\":\"None\",\"Type\":0,\"Expansion\":" + expansionid + ",";
            DBItems item = App.m_Items[expansionid][itemid];
            json += "\"Quality\":" + item.Quality + ",\"Name\":\"" + item.Name + "\"";
            json += ",\"Bonding\":" + item.Bonding;
            json += ",\"Sheath\":" + (item.InventoryType == 13 || item.InventoryType == 14 ? item.Sheath : 0);
            json += ",\"InventoryType\":" + (!(item.InventoryType == 13 || item.InventoryType == 14) ? item.InventoryType : 29);
            json += ",\"SCWeapon\":" + (item.Class == 2 && item.SubClass < 22 ? item.SubClass : 21);
            json += ",\"SCType\":" + (item.Class == 4 && item.SubClass < 11 ? item.SubClass : 10);
            json += ",\"SCMisc\":" + (item.Class == 7 && item.SubClass < 14 ? item.SubClass : 13);
            json += ",\"Class\":" + item.Class;

            if (item.Class == 2)
            {
                json += ",\"DmgMin1\":" + Math.Round(item.Dmg[0].Min / 1000.0, 1) + ",\"DmgMax1\":" + Math.Round(item.Dmg[0].Max / 1000.0, 1) + ",\"DmgType1\":" + item.Dmg[0].Type + ",\"Delay\":" + Math.Round(item.Delay / 1000.0, 1).ToString("n2");
                json += ",\"DmgMin2\":" + Math.Round(item.Dmg[1].Min / 1000.0, 1) + ",\"DmgMax2\":" + Math.Round(item.Dmg[1].Max / 1000.0, 1) + ",\"DmgType2\":" + item.Dmg[1].Type;
                json += ",\"DmgMin3\":" + Math.Round(item.Dmg[2].Min / 1000.0, 1) + ",\"DmgMax3\":" + Math.Round(item.Dmg[2].Max / 1000.0, 1) + ",\"DmgType3\":" + item.Dmg[2].Type;
            }

            json += ",\"Armor\":" + item.Armor;
            json += ",\"Stats1\": [";
            int added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && item.Stats[i].Key > 25 && item.Stats[i].Key < 31)
                {
                    if (added == 0) json += item.Stats[i].Key;
                    else json += "," + item.Stats[i].Key;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Values1\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && item.Stats[i].Key > 25 && item.Stats[i].Key < 31)
                {
                    if (added == 0) json += item.Stats[i].Value;
                    else json += "," + item.Stats[i].Value;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Stats2\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && item.Stats[i].Key < 6)
                {
                    if (added == 0) json += item.Stats[i].Key;
                    else json += "," + item.Stats[i].Key;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Values2\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && item.Stats[i].Key < 6)
                {
                    if (added == 0) json += item.Stats[i].Value;
                    else json += "," + item.Stats[i].Value;
                    ++added;
                }
            }
            json += "]";
            
            json += ",\"EnchStats\":\"" + (enchid > 0 ? App.m_EnchantmentStats[expansionid][enchid].Name : "") + "\"";
            json += ",\"Gems\": [";
            var sb = "";
            var sbq = 0;
            if (expansionid > 0)
            {
                var imgType = Utility.GetImageType(HttpContext.Current.Request, "jpg");

                json += "{\"Icon\":\"" + App.m_Items[expansionid][App.m_GemProperties[expansionid - 1][gemid1].Entry].IconName + "." + imgType + "\",\"Quality\":" + (itemSlot.GemMeetsSocket(gemid1, item.Socket1, expansionid) ? 2 : 0) + ",\"Name\":\"" + App.m_EnchantmentStats[expansionid][
                    App.m_GemProperties[expansionid - 1][gemid1].EnchId].Name + "\"}";

                if (gemid1 > 0)
                    json += "{\"Icon\":\"" + App.m_Items[expansionid][App.m_GemProperties[expansionid - 1][gemid1].Entry].IconName + "." + imgType + "\",\"Quality\":" +
                            (itemSlot.GemMeetsSocket(gemid1, item.Socket1, expansionid) ? 2 : 0) + ",\"Name\":\"" + SocketColor(item.Socket1) + "\"}";
                else if (item.Socket1 > 0)
                    json += "{\"Icon\":\"" + item.Socket1 + ".gif\",\"Quality\":0,\"Name\":\"" + App.m_EnchantmentStats[expansionid][App.m_GemProperties[expansionid - 1][gemid1].EnchId].Name + "\"}";
                if (gemid2 > 0)
                    json += ",{\"Icon\":\"" + App.m_Items[expansionid][App.m_GemProperties[expansionid - 1][gemid2].Entry].IconName + "." + imgType + "\",\"Quality\":" +
                            (itemSlot.GemMeetsSocket(gemid2, item.Socket2, expansionid) ? 2 : 0) + ",\"Name\":\"" + SocketColor(item.Socket2) + "\"}";
                else if (item.Socket2 > 0)
                    json += ",{\"Icon\":\"" + item.Socket2 + ".gif\",\"Quality\":0,\"Name\":\"" + App.m_EnchantmentStats[expansionid][App.m_GemProperties[expansionid - 1][gemid2].EnchId].Name + "\"}";
                if (gemid3 > 0)
                    json += ",{\"Icon\":\"" + App.m_Items[expansionid][App.m_GemProperties[expansionid - 1][gemid3].Entry].IconName + "." + imgType + "\",\"Quality\":" +
                            (itemSlot.GemMeetsSocket(gemid3, item.Socket3, expansionid) ? 2 : 0) + ",\"Name\":\"" + SocketColor(item.Socket3) + "\"}";
                else if (item.Socket3 > 0)
                    json += ",{\"Icon\":\"" + item.Socket3 + ".gif\",\"Quality\":0,\"Name\":\"" + App.m_EnchantmentStats[expansionid][App.m_GemProperties[expansionid - 1][gemid3].EnchId].Name + "\"}";

                if (itemSlot.HasSocketBonus(expansionid))
                {
                    sb = App.m_EnchantmentStats[expansionid][itemSlot.GetSocketBonus(expansionid)].Name;
                    sbq = 2;
                }
                else
                {
                    sb = App.m_EnchantmentStats[expansionid][itemSlot.Item(expansionid).SocketBonus].Name;
                    sbq = 0;
                }
            }
            json += "]";
            json += ",\"SocketBonus\":\"" + sb + "\"";
            json += ",\"SocketQuality\":" + sbq;
            json += ",\"MaxDurability\":" + item.MaxDurability;
            json += ",\"ItemLevel\":" + item.ItemLevel;
            json += ",\"RequiredLevel\":" + item.RequiredLevel;

            json += ",\"Stats3\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && ((item.Stats[i].Key >= 6 && item.Stats[i].Key <= 25) || item.Stats[i].Key > 30))
                {
                    if (added == 0) json += item.Stats[i].Key;
                    else json += "," + item.Stats[i].Key;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Values3\": [";
            added = 0;
            for (int i = 0; i < 10; i++)
            {
                if (item.Stats[i].Value > 0 && ((item.Stats[i].Key >= 6 && item.Stats[i].Key <= 25) || item.Stats[i].Key > 30))
                {
                    if (added == 0) json += item.Stats[i].Value;
                    else json += "," + item.Stats[i].Value;
                    ++added;
                }
            }
            json += "]";
            json += ",\"Extra\": [";
            added = 0;
            foreach (string extra in item.ExtraTooltip.Split(new[] { ".," }, StringSplitOptions.None))
            {
                if (extra != "")
                {
                    if (added == 0) json += "\"" + extra + "\"";
                    else json += "," + "\"" + extra + "\"";
                    ++added;
                }
            }
            json += "]";

            var itemSetName = "";
            if (item.ItemSetId > 0)
            {
                itemSetName = item.ItemSet.Name;
                json += ",\"SetItems\": [";
                string[] itemids = item.ItemSet.SetIds.Split(',');
                short counter = 0;
                short amountItems = 0;
                foreach (string itm in item.ItemSet.SetNames.Split(','))
                {
                    bool condition = false; // For now // TODO
                    if (condition)
                        ++amountItems;
                    if (counter != 0) json += ",";
                    json += "{\"Quality\":" + (condition ? 2 : 0) + ",\"Name\": \"" + itm + "\"}";
                    ++counter;
                }
                json += "]";
                counter = 0;
                json += ",\"SetEffects\": [";
                foreach (string effect in item.ItemSet.SetEffectNames.Split(new[] { ".," }, StringSplitOptions.None))
                {
                    if (counter != 0) json += ",";
                    short effectnum = 0;
                    json += "{\"Active\":" + ((short.TryParse(effect[1].ToString(), out effectnum) && effectnum <= amountItems) ? 2 : 0) + ",\"Name\": \"" + effect + "\"}";
                    ++counter;
                }
                json += "]";
            }
            json += ",\"ItemSetName\":" + "\"" + itemSetName + "\"";
            json += ",\"Icon\":" + "\"" + item.IconName + "\"}";
            return json;
            //return "{\"icon\":\"" + item.IconName + "\",\"tooltip\":\"" + json.Replace("\"", "\\\"") + "\"}";
        }

        public static string GetSpell(int spellid, string expansion)
        {
            try
            {
                MySqlDataReader reader = App.GetDB()
                    .Query("SELECT b.name as icon, tooltip FROM db_" + expansion +
                           "_spells a LEFT JOIN db_icon_names b ON a.icon = b.id WHERE a.id = " + spellid)
                    .ExecuteReaderRpll();
                reader.Read();
                string icon = reader.GetString(0);
                string ttt = reader.GetString(1);
                reader.CloseRpll();
                return "{\"icon\":\"" + icon + "\",\"tooltip\":\"" + ttt.Replace("$8", "<br /></td><th><b class=\"q0\">")
                           .Replace("$7", "</th></tr></table>").Replace("$6", "<table width=\"100%\"><tr><td>")
                           .Replace("$5", "<table><tr><td>").Replace("$4", "</span></td></tr></table>")
                           .Replace("$3", "<table><tr><td><span class=\"q\">").Replace("$2", "</td></tr></table>")
                           .Replace("$1", "<table><tr><td><b>").Replace("\"", "\\\"") + "\"}";
            }
            catch (Exception)
            {
                return "{\"tooltip\":\"Error retrieving information\"}";
            }
        }

        public static string GetGuildProgress(int guildid, int instanceid)
        {
            var expansion = instanceid > 31 && !(instanceid >=84 && instanceid <= 89) ? 1 : 0;
            string json = "";
            try
            {
                json += "{\"Error\":\"None\",\"Type\":2";
                MySqlDataReader reader = App.GetDB(expansion + 1)
                    .Query("SELECT a.npcid, d.start, b.end FROM am_guilds_progresshistory a LEFT JOIN rs_attempts b ON a.attemptid = b.id LEFT JOIN rs_instance_uploader c ON b.uploaderid = c.id LEFT JOIN rs_instances d ON c.instanceid = d.id WHERE a.guildid = " + guildid + " and a.instanceid = " + instanceid).ExecuteReaderRpll();

                json += ",\"Entries\": [";
                var count = 0;
                while (reader.Read())
                {
                    if (count != 0) json += ",";
                    json += "{\"Name\":\"" + App.GetNpc(reader.GetInt32(0), expansion).Name + "\",\"Date\":" + (reader.GetInt64(1) + reader.GetInt32(2)) + "}";
                    ++count;
                }
                reader.CloseRpll();
                json += "], \"Icon\": " + instanceid + "}";
                return json;
            }
            catch (Exception)
            {
                return "{\"Error\":\"Error retrieving information\"}";
            }
        }

        public static string GetGuild(int guildid)
        {
            if (!App.m_Guilds.ContainsKey(guildid))
                return "{\"tooltip\":\"Error retrieving information\"}";

            DBGuilds guild = App.GetGuild(guildid);

            string json = "{\"Error\":\"None\",\"Type\":3,\"Faction\":"+ guild.Faction + ",\"Name\":\""+ guild.Name + "\",\"MemberCount\":" + App.m_Chars.Values.Count(x => x.ServerID > 0 && x.RefGuild.GuildID == guildid);
            json += ",\"Cleared\": [";
            var count = 0;
            foreach (IGrouping<int, DB_am_guild_progress> t in App.m_GuildProgress.Where(x => x.GuildID == guildid)
                .GroupBy(x => x.InstanceID).OrderBy(x => x.Key).ToArray())
            {
                if (count != 0) json += ",";
                json += "{\"Status\":\""+ ((t.Count() == Utility.m_NumPerInstance[t.Key]) ? "positive" : "middle") + "\"";
                json += ",\"Name\":\""+ App.m_Instances[t.Key].Name + "\",\"Count\":"+ t.Count()+",\"Max\":"+ Utility.m_NumPerInstance[t.Key] + "}";
                ++count;
            }

            json += "],\"Icon\":\"faction_"+ guild.Faction + "\"}";
            return json;
        }

        private static readonly string[] m_Gender = new string[4]
        {
            "male",
            "male",
            "male",
            "female"
        };

        private static readonly string[] m_Races = new string[10]
        {
            "human",
            "dwarf",
            "gnome",
            "nightelf",
            "draenei",
            "orc",
            "troll",
            "tauren",
            "undead",
            "bloodelf"
        };
        public static string GetCharacter(int charid)
        {
            if (charid <= 301000 || !App.m_Chars.ContainsKey(charid))
                return "{\"Error\":\"Error retrieving information\"}";

            DBChars cr = App.GetChar(charid);

            if (cr.ServerID <= 0 || cr.ServerID >= App.m_Server.Length)
                return "{\"Error\":\"Error retrieving information\"}";

            var imgType = Utility.GetImageType(HttpContext.Current.Request, "png");
            string json = "{\"Error\":\"None\",\"Type\":4";
            json += ",\"Class\":" + cr.RefMisc.Class;
            json += ",\"CharIcon\":\"c" + cr.RefMisc.Class + "." + imgType + "\"";
            json += ",\"RankName\":\""+ Utility.GetRankName(cr.Faction, cr.RefHonor.Rank) + "\"";
            json += ",\"Name\":\""+ cr.Name + "\"";
            json += ",\"Level\":"+ cr.RefMisc.Level;
            json += ",\"GuildName\":\""+(cr.RefGuild.GuildID > 0 ? App.GetGuild(cr.RefGuild.GuildID).Name : "") +"\"";
            json += ",\"Faction\":" + cr.Faction;
            json += ",\"ServerName\":\""+ App.m_Server[cr.ServerID].Name + "\"";
            json += ",\"Icon\":\"" + (cr.RefMisc.Gender) + "-" + (cr.RefMisc.Race) + "\"";
            json += ",\"Items\":[";
            json += "{\"Quality1\": " + (cr.RefGear.Slots[0] == null ? 0 : cr.RefGear.Slots[0].Item().Quality) +
                    ",\"Name1\":\"" + (cr.RefGear.Slots[0] == null ? "" : cr.RefGear.Slots[0].Item().Name.Replace("\"", "\\\"")) +
                    "\",\"Quality2\":" + (cr.RefGear.Slots[9] == null ? 0 : cr.RefGear.Slots[9].Item().Quality) +
                    ",\"Name2\":\"" + (cr.RefGear.Slots[9] == null ? "" : cr.RefGear.Slots[9].Item().Name.Replace("\"", "\\\"")) + "\"}";

            json += ",{\"Quality1\": " + (cr.RefGear.Slots[1] == null ? 0 : cr.RefGear.Slots[1].Item().Quality) +
                    ",\"Name1\":\"" + (cr.RefGear.Slots[1] == null ? "" : cr.RefGear.Slots[1].Item().Name.Replace("\"", "\\\"")) +
                    "\",\"Quality2\":" + (cr.RefGear.Slots[3] == null ? 0 : cr.RefGear.Slots[3].Item().Quality) +
                    ",\"Name2\":\"" + (cr.RefGear.Slots[3] == null ? "" : cr.RefGear.Slots[3].Item().Name.Replace("\"", "\\\"")) + "\"}";

            json += ",{\"Quality1\": " + (cr.RefGear.Slots[2] == null ? 0 : cr.RefGear.Slots[2].Item().Quality) +
                    ",\"Name1\":\"" + (cr.RefGear.Slots[2] == null ? "" : cr.RefGear.Slots[2].Item().Name.Replace("\"", "\\\"")) +
                    "\",\"Quality2\":" + (cr.RefGear.Slots[6] == null ? 0 : cr.RefGear.Slots[6].Item().Quality) +
                    ",\"Name2\":\"" + (cr.RefGear.Slots[6] == null ? "" : cr.RefGear.Slots[6].Item().Name.Replace("\"", "\\\"")) + "\"}";

            json += ",{\"Quality1\": " + (cr.RefGear.Slots[14] == null ? 0 : cr.RefGear.Slots[14].Item().Quality) +
                    ",\"Name1\":\"" + (cr.RefGear.Slots[14] == null ? "" : cr.RefGear.Slots[14].Item().Name.Replace("\"", "\\\"")) +
                    "\",\"Quality2\":" + (cr.RefGear.Slots[7] == null ? 0 : cr.RefGear.Slots[7].Item().Quality) +
                    ",\"Name2\":\"" + (cr.RefGear.Slots[7] == null ? "" : cr.RefGear.Slots[7].Item().Name.Replace("\"", "\\\"")) + "\"}";

            json += ",{\"Quality1\": " + (cr.RefGear.Slots[4] == null ? 0 : cr.RefGear.Slots[4].Item().Quality) +
                    ",\"Name1\":\"" + (cr.RefGear.Slots[4] == null ? "" : cr.RefGear.Slots[4].Item().Name.Replace("\"", "\\\"")) +
                    "\",\"Quality2\":" + (cr.RefGear.Slots[10] == null ? 0 : cr.RefGear.Slots[10].Item().Quality) +
                    ",\"Name2\":\"" + (cr.RefGear.Slots[10] == null ? "" : cr.RefGear.Slots[10].Item().Name.Replace("\"", "\\\"")) + "\"}";

            json += ",{\"Quality1\": " + (cr.RefGear.Slots[8] == null ? 0 : cr.RefGear.Slots[8].Item().Quality) +
                    ",\"Name1\":\"" + (cr.RefGear.Slots[8] == null ? "" : cr.RefGear.Slots[8].Item().Name.Replace("\"", "\\\"")) +
                    "\",\"Quality2\":" + (cr.RefGear.Slots[11] == null ? 0 : cr.RefGear.Slots[11].Item().Quality) +
                    ",\"Name2\":\"" + (cr.RefGear.Slots[11] == null ? "" : cr.RefGear.Slots[11].Item().Name.Replace("\"", "\\\"")) + "\"}";

            json += ",{\"Quality1\": " + (cr.RefGear.Slots[12] == null ? 0 : cr.RefGear.Slots[12].Item().Quality) +
                    ",\"Name1\":\"" + (cr.RefGear.Slots[12] == null ? "" : cr.RefGear.Slots[12].Item().Name.Replace("\"", "\\\"")) +
                    "\",\"Quality2\":" + (cr.RefGear.Slots[13] == null ? 0 : cr.RefGear.Slots[13].Item().Quality) +
                    ",\"Name2\":\"" + (cr.RefGear.Slots[13] == null ? "" : cr.RefGear.Slots[13].Item().Name.Replace("\"", "\\\"")) + "\"}";

            json += ",{\"Quality1\": " + (cr.RefGear.Slots[15] == null ? 0 : cr.RefGear.Slots[15].Item().Quality) +
                    ",\"Name1\":\"" + (cr.RefGear.Slots[15] == null ? "" : cr.RefGear.Slots[15].Item().Name.Replace("\"", "\\\"")) +
                    "\",\"Quality2\":" + (cr.RefGear.Slots[16] == null ? 0 : cr.RefGear.Slots[16].Item().Quality) +
                    ",\"Name2\":\"" + (cr.RefGear.Slots[16] == null ? "" : cr.RefGear.Slots[16].Item().Name.Replace("\"", "\\\"")) + "\"}";

            json += ",{\"Quality1\": " + (cr.RefGear.Slots[17] == null ? 0 : cr.RefGear.Slots[17].Item().Quality) +
                    ",\"Name1\":\"" + (cr.RefGear.Slots[17] == null ? "" : cr.RefGear.Slots[17].Item().Name.Replace("\"", "\\\"")) +
                    "\",\"Quality2\":0" +
                    ",\"Name2\":\"\"}";
            json += "]}";
            return json;

            // TODO: Once tbc hits
            /*
            AddLine(ref json, true, "<tr><td colspan=\"2\">Arena 2v2: Die Hübschen - 2024 RP (Rank 1)</td></tr>", false);
            AddLine(ref json, true, "<tr><td colspan=\"2\">Arena 3v3: Super Langer Name der nicht Englisch ist - 2024 RP (Rank 1)</td></tr>", false);
            AddLine(ref json, true, "<tr><td colspan=\"2\">Arena 5v5: Natürliche Schönheit - 2024 RP (Rank 1)</td></tr>", false);
            AddLine(ref json, true, "</table>", false);
            */
        }
         
        /*
         * Raidviewer tooltip
         */
        public static string GetRvRowPreview(int id, int instanceid, int uploader, int sourceid, int tarid, int start, int end, int cat, int atmt, string mode, int expansion = 0, bool flg1 = false,
            bool flg2 = false, bool flg3 = false, bool flg4 = false, bool flg5 = false, bool flg6 = false, bool flg7 = false)
        {
            // Getting the raiddata
            RaidData data;
            try
            {
                data = RaidData.GetRaidData(instanceid, uploader, expansion == 1);
            }
            catch
            {
                return "{\"Error\":\"Error retrieving information\"}";
            }

            ulong key = Farmhash.Sharp.Farmhash.Hash64(id+","+sourceid+","+tarid + "," + start + "," + end + "," + cat + "," + atmt + "," + mode+",0" + "," + flg1 + "," + flg2 + "," + flg3 + "," + flg4 + "," + flg5 + "," + flg6 + "," + flg7);
            if (data.mTooltipCache.ContainsKey(key)) // Lets hope we dont have many collisions
                return data.mTooltipCache[key];

            string json = "{\"Error\":\"None\",\"Type\":5";
            if (mode == "Deaths")
            {
                var srcArr = RaidViewerUtility.GetQuery(mode, data, start, end, sourceid, tarid, cat, atmt, expansion, flg1, flg2, flg3, flg4, flg5, flg6, flg7)
                    .Where(x => x.SourceId == id).OrderByDescending(x => x.TimeStamp).Take(10).ToArray();

                if (srcArr.Length <= 0)
                    return "{\"Error\":\"Error retrieving information\"}";


                json += ",\"PreviewType\":0";
                json += ",\"Entries\":[";
                var count = 0;
                foreach (var src in srcArr)
                {
                    if (count != 0) json += ",";
                    json += "{\"Date\":" + (data.m_Start + src.TimeStamp) + ",\"SourceName\":\"" +
                            (src.TargetId >= 300000
                                ? App.m_Chars[src.TargetId].Name
                                : App.GetNpc(src.TargetId, expansion).Name) + "\",\"SpellName\":\"" +
                            App.GetSpell(src.AbilityId, expansion).Name + "\",\"Amount\":" + src.Amount + "}";
                    ++count;
                }
                json += "]}";
            }
            else if (mode == "Aura uptime")
            {
                var srcArr = RaidViewerUtility.GetQuery(mode, data, start, end, sourceid, tarid, cat, atmt, expansion, flg1, flg2, flg3, flg4, flg5, flg6, flg7)
                    .Where(x => x.SourceId == id).GroupBy(x => x.AbilityId).OrderByDescending(x => x.Sum(y => y.TimeStamp)).Take(10).ToArray();

                if (srcArr.Length <= 0)
                    return "{\"Error\":\"Error retrieving information\"}";


                json += ",\"PreviewType\":1";
                json += ",\"Entries\":[";
                int count = 0;
                foreach (var src in srcArr)
                {
                    var srcSum = src.Sum(y => y.TimeStamp);
                    if (count != 0) json += ",";
                    json += "{\"SpellName\":\"" +
                            App.GetSpell(src.Key, expansion).Name + "\",\"Amount\":" + (1.0 * srcSum / (end - start) > 1 ? 100 : Math.Round(100.0 * srcSum / (end - start), 1)) + "}";
                    ++count;
                }
                json += "]}";
            }
            else if (mode == "Healing")
            {
                var srcArr = RaidViewerUtility.GetQuery(mode, data, start, end, sourceid, tarid, cat, atmt, expansion, flg1, flg2, flg3, flg4, flg5, flg6, flg7)
                    .Where(x => x.SourceId == id).GroupBy(x => x.TargetId).OrderByDescending(x => x.Where(y => y.Type == 0).Sum(y => y.Amount)).Take(5).ToArray();

                if (srcArr.Length <= 0)
                    return "{\"Error\":\"Error retrieving information 2\"}";

                json += ",\"PreviewType\":2";
                json += ",\"Entries\":[";
                int count = 0;
                var sum = srcArr.Sum(x => x.Where(y => y.Type == 0).Sum(y => y.Amount));
                foreach (var src in srcArr)
                {
                    if (count != 0) json += ",";
                    var srcSum = src.Where(x => x.Type == 0).Sum(x => x.Amount);
                    json += "{\"SourceEff\":" + srcSum + ",\"SourceName\":\"" +
                            (src.Key >= 300000 ? App.m_Chars[src.Key].Name : App.GetNpc(src.Key, expansion).Name) + "\",\"SourceOverheal\":\"" +
                            src.Where(x => x.Type == 1).Sum(x => x.Amount) + "\",\"Fraction\":" + Math.Round(100.0 * srcSum / sum, 1) + ",\"Abilities\":[";
                    ++count;
                    int p = 0;
                    foreach (var abil in src.GroupBy(x => x.AbilityId).OrderByDescending(x => x.Sum(y => y.Amount)).Take(3))
                    {
                        if (p != 0) json += ",";
                        int abilSum = abil.Where(x => x.Type == 0).Sum(x => x.Amount);
                        json += "{\"Name\":\"" + App.GetSpell(abil.Key, expansion).Name + "\",\"Eff\":"+ abilSum + ",\"Overheal\":"+ abil.Where(x => x.Type == 1).Sum(x => x.Amount) + ",\"Fraction\": " + Math.Round(100.0 * abilSum / srcSum, 1) + "}";
                        ++p;
                    }

                    json += "]}";
                }
                json += "]}";
            }
            else if (mode == "Healing taken")
            {
                var srcArr = RaidViewerUtility.GetQuery(mode, data, start, end, sourceid, tarid, cat, atmt, expansion, flg1, flg2, flg3, flg4, flg5, flg6, flg7)
                    .Where(x => x.SourceId == id).GroupBy(x => x.TargetId).OrderByDescending(x => x.Where(y => y.Type == 0).Sum(y => y.Amount)).Take(5).ToArray();

                if (srcArr.Length <= 0)
                    return "{\"Error\":\"Error retrieving information\"}";


                json += ",\"PreviewType\":3";
                json += ",\"Entries\":[";
                int count = 0;
                var sum = srcArr.Sum(x => x.Where(y => y.Type == 0).Sum(y => y.Amount));
                foreach (var src in srcArr)
                {
                    if (count != 0) json += ",";
                    var srcSum = src.Where(x => x.Type == 0).Sum(x => x.Amount);
                    json += "{\"SourceEff\":" + srcSum + ",\"SourceName\":\"" +
                            (src.Key >= 300000 ? App.m_Chars[src.Key].Name : App.GetNpc(src.Key, expansion).Name) + "\",\"SourceOverheal\":\"" +
                            src.Where(x => x.Type == 1).Sum(x => x.Amount) + "\",\"Fraction\":" + Math.Round(100.0 * srcSum / sum, 1) + ",\"Abilities\":[";
                    ++count;
                    int p = 0;
                    foreach (var abil in src.GroupBy(x => x.AbilityId).OrderByDescending(x => x.Sum(y => y.Amount)).Take(3))
                    {
                        if (p != 0) json += ",";
                        int abilSum = abil.Where(x => x.Type == 0).Sum(x => x.Amount);
                        json += "{\"Name\":\"" + App.GetSpell(abil.Key, expansion).Name + "\",\"Eff\":" + abilSum + ",\"Overheal\":" + abil.Where(x => x.Type == 1).Sum(x => x.Amount) + ",\"Fraction\": " + Math.Round(100.0 * abilSum / srcSum, 1) + "}";
                        ++p;
                    }

                    json += "]}";
                }
                json += "]}";
            }
            else
            {
                var abArr = RaidViewerUtility.GetQuery(mode, data, start, end, sourceid, tarid, cat, atmt, expansion, flg1, flg2, flg3, flg4, flg5, flg6, flg7)
                    .Where(x => x.SourceId == id).GroupBy(x => x.AbilityId).OrderByDescending(x => x.Sum(y => y.Amount)).Take(10).ToArray();

                if (abArr.Length <= 0)
                    return "{\"Error\":\"Error retrieving information 2\"}";


                json += ",\"PreviewType\":4";
                json += ",\"Entries\":[";

                int count = 0;
                var sum = abArr.Sum(x => x.Sum(y => y.Amount));
                bool amCasts = mode == "Damage taken" || mode == "Damage done" || mode == "Threat";
                foreach (var ability in abArr)
                {
                    if (count != 0) json += ",";
                    var abSum = ability.Sum(y => y.Amount);
                    json += "{\"SpellName\":\"" + App.GetSpell(ability.Key, expansion).Name + "\",\"Succ\":" + ability.Count(x => !(x.Type >= 3 && x.Type <= 12) || x.Type == 60) + ",\"NotSucc\":" + ability.Count(x => (x.Type >= 3 && x.Type <= 12)) + ",\"Fraction\": " + Math.Round(100.0 * abSum / sum, 1) + ",\"Amount\":"+ abSum + "}";
                    ++count;
                }
                json += "]}";
            }

            data.mTooltipCache[key] = json;
            return json;
        }

        public static string GetRvRowData(int id, int instanceid, int uploader, int charid, int tarid, int start,
            int end, int cat, int atmt, string mode, int expansion = 0, bool flg1 = false, bool flg2 = false, bool flg3 = false, bool flg4 = false, bool flg5 = false, bool flg6 = false, bool flg7 = false)
        {
            // Getting the raiddata
            RaidData data;
            try
            {
                data = RaidData.GetRaidData(instanceid, uploader, expansion == 1);
            }
            catch
            {
                return "{\"Error\":\"Error retrieving information\"}";
            }

            ulong key = Farmhash.Sharp.Farmhash.Hash64(id + "," + charid + "," + tarid + "," + start + "," + end + "," + cat + "," + atmt + "," + mode + ",1");
            if (data.mTooltipCache.ContainsKey(key)) // Lets hope we dont have many collisions
                return data.mTooltipCache[key];

            string json = "{\"Error\":\"None\",\"Type\":6";
            if (mode == "Damage done")
            {
                // Damage done
                var dmgdone =
                    data.m_Damage.Values.Where(x => data.m_SatReference[x.SatRefId].SourceId == charid && data.m_SatReference[x.SatRefId].AbilityId == id &&
                                                    x.TimeStamp >= start &&
                                                    x.TimeStamp <= end);

                dmgdone = RaidViewerUtility.ApplyTargetCondition(ref dmgdone, data, tarid);
                dmgdone = RaidViewerUtility.ApplyCategoryCondition(ref dmgdone, data, cat, atmt, expansion);

                // First the spell tooltip
                json += ",\"SpellName\":\"" + App.GetSpell(id, expansion).Name + "\",\"RowType\":0";
                string icon = App.m_Icons[App.GetSpell(id, expansion).Icon];
                if (id == 47490)
                    icon = "inv_sword_39";
                if (id == 0)
                    return "{\"Error\":\"Error retrieving information\"}";

                var dmgArr = dmgdone.ToArray();
                var allDmg = dmgArr.Sum(x => x.Amount);
                var allHits = dmgArr.Count();
                var hits = dmgArr.Where(x => x.HitType >= 20 && x.HitType <= 32);
                var hitsArr = hits.ToArray();
                var hitsDmg = hitsArr.Sum(x => x.Amount);
                var crits = dmgArr.Where(x => x.HitType >= 40 && x.HitType <= 52);
                var critsArr = crits.ToArray();
                var critsDmg = critsArr.Sum(x => x.Amount);
                var othersArr = dmgArr.Where(x => x.HitType < 12).ToArray(); // This may not add up :/

                var hitsMin = hitsArr.Length == 0 ? 0 : hitsArr.Where(x => x.Amount > 0).Min(x => x.Amount);
                var hitsMax = hitsArr.Length == 0 ? 0 : hitsArr.Max(x => x.Amount);
                var hitsAverage = hitsArr.Length == 0 ? 0 : hitsArr.Average(x => x.Amount);

                var critsMin = critsArr.Length == 0 ? 0 : critsArr.Min(x => x.Amount);
                var critsMax = critsArr.Length == 0 ? 0 : critsArr.Max(x => x.Amount);
                var critsAverage = critsArr.Length == 0 ? 0 : critsArr.Average(x => x.Amount);

                var totalMin = (hitsMin > critsMin) ? critsMin : hitsMin;
                var totalMax = (hitsMax > critsMax) ? hitsMax : critsMax;
                var totalAverage = dmgArr.Length == 0 ? 0 : dmgArr.Average(x => x.Amount);

                var classid = charid >= 300000 ? App.GetChar(charid).RefMisc.Class : 0;
                // TODO: A better way to classify spells as range or meele attacks!
                //if (othersArr.All(x => x.HitType > 0 && x.HitType < 8 && x.HitType != 25 && x.HitType != 45 && x.HitType != 5) && !(othersArr.All(x => x.HitType != 2 && x.HitType != 3 && x.HitType != 4 && x.HitType != 6 && x.HitType != 7) && (classid == 2 || classid == 4 || classid == 5 || classid == 6 || classid == 8))) // Meele tooltip?

                json += ",\"SpellType\":" + (App.GetSpell(id, expansion).SpellCategory == 0 && othersArr.All(x => x.HitType > 0 && x.HitType < 8 && x.HitType != 25 && x.HitType != 45 && x.HitType != 5) ? 0 : 1);
                if (App.GetSpell(id, expansion).SpellCategory == 0 && othersArr.All(x => x.HitType > 0 && x.HitType < 8 && x.HitType != 25 && x.HitType != 45 && x.HitType != 5)) // 0 => Melee, 2 => Binary Spell, 1 => Non Binary Spell
                {
                    var misses = dmgArr.Count(x => x.HitType == 12);
                    var glance = hitsArr.Where(x => x.HitType == 22).ToArray();
                    var block = hitsArr.Where(x => x.HitType == 26 || x.MitGated[1] > 0).ToArray();
                    var crush = hitsArr.Where(x => x.HitType == 27).ToArray();
                    var normal = hitsArr.Where(x => x.HitType != 22 && x.HitType != 26 && x.HitType != 27).ToArray();
                    var glanceDmg = glance.Sum(x => x.Amount);
                    var blockDmg = block.Sum(x => x.Amount);
                    var crushDmg = crush.Sum(x => x.Amount);
                    var normalDmg = normal.Sum(x => x.Amount);

                    var parry = othersArr.Where(x => x.HitType == 4).ToArray();
                    var dodge = othersArr.Where(x => x.HitType == 3).ToArray();
                    var absorbs = othersArr.Where(x => x.HitType == 8 || x.MitGated[2] > 0).ToArray();
                    var immune = othersArr.Where(x => x.HitType == 11).ToArray();

                    /*
                    var normalMin = normal.Length == 0 ? 0 : normal.Min(x => x.Amount);
                    var normalMax = normal.Length == 0 ? 0 : normal.Max(x => x.Amount);
                    var normalAverage = normal.Length == 0 ? 0 : normal.Average(x => x.Amount);
                    var glanceMin = glance.Length == 0 ? 0 : glance.Min(x => x.Amount);
                    var glanceMax = glance.Length == 0 ? 0 : glance.Max(x => x.Amount);
                    var glanceAverage = glance.Length == 0 ? 0 : glance.Average(x => x.Amount);
                    var blockMin = block.Length == 0 ? 0 : block.Min(x => x.Amount);
                    var blockMax = block.Length == 0 ? 0 : block.Max(x => x.Amount);
                    var blockAverage = block.Length == 0 ? 0 : block.Average(x => x.Amount);
                    var crushMin = crush.Length == 0 ? 0 : crush.Min(x => x.Amount);
                    var crushMax = crush.Length == 0 ? 0 : crush.Max(x => x.Amount);
                    var crushAverage = crush.Length == 0 ? 0 : crush.Average(x => x.Amount);
                    */
                    json += ",\"Hits\":{\"Count\":" + hitsArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * hitsArr.Length / allHits, 1) + ",\"Amount\":" + hitsDmg +
                            ",\"Fraction\":" + Math.Round(100.0 * hitsDmg / allDmg, 1) + ",\"Min\":" + hitsMin + ",\"Max\":" + hitsMax + ",\"Average\":" + Math.Round(hitsAverage, 1) + "}";
                    json += ",\"EID\":" + charid;
                    json += ",\"SpellId\":" + id;
                    json += ",\"Normal\":{\"Count\":" + normal.Length + ",\"CountFraction\":" +
                            (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * normal.Length / hitsArr.Length, 1)) + ",\"Amount\":" + normalDmg +
                            ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * normalDmg / hitsDmg, 1)) + "}";

                    json += ",\"Glance\":{\"Count\":" + glance.Length + ",\"CountFraction\":" +
                            (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * glance.Length / hitsArr.Length, 1)) + ",\"Amount\":" + glanceDmg +
                            ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * glanceDmg / hitsDmg, 1)) + "}";

                    json += ",\"Crush\":{\"Count\":" + crush.Length + ",\"CountFraction\":" +
                            (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * crush.Length / hitsArr.Length, 1)) + ",\"Amount\":" + crushDmg +
                            ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * crushDmg / hitsDmg, 1)) + "}";

                    json += ",\"Block\":{\"Count\":" + block.Length + ",\"CountFraction\":" +
                            (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * block.Length / hitsArr.Length, 1)) + ",\"Amount\":" + blockDmg +
                            ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * blockDmg / hitsDmg, 1)) + ",\"Mitgated\":" + block.Sum(x => x.MitGated[0] + x.MitGated[1]) + "}";

                    json += ",\"Crits\":{\"Count\":" + critsArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * critsArr.Length / allHits, 1) + ",\"Amount\":" + critsDmg +
                            ",\"Fraction\":" + Math.Round(100.0 * critsDmg / allDmg, 1) + ",\"Min\":" + critsMin + ",\"Max\":" + critsMax + ",\"Average\":" + Math.Round(critsAverage, 1) + "}";

                    json += ",\"Misses\":{\"Count\":" + misses + ",\"CountFraction\":" +
                            Math.Round(100.0 * misses / allHits, 1) + "}";

                    json += ",\"Others\":{\"Count\":" + othersArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * othersArr.Length / allHits, 1) + "}";

                    json += ",\"Parry\":{\"Count\":" + parry.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * parry.Length / othersArr.Length, 1)) + "}";

                    json += ",\"Dodge\":{\"Count\":" + dodge.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * dodge.Length / othersArr.Length, 1)) + "}";

                    json += ",\"Absorbs\":{\"Count\":" + absorbs.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * absorbs.Length / othersArr.Length, 1)) + ",\"Mitgated\":" + absorbs.Sum(x => x.MitGated[0] + x.MitGated[2]) + "}";

                    json += ",\"Immune\":{\"Count\":" + immune.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * immune.Length / othersArr.Length, 1)) + "}";
                }
                else
                {
                    othersArr = othersArr.Where(x => x.HitType != 5).ToArray();
                    var resists = dmgArr.Count(x => x.HitType == 5);
                    var reflects = othersArr.Where(x => x.HitType == 99).ToArray(); // TODO
                    var absorbs = othersArr.Where(x => x.HitType == 8 || x.MitGated[2] > 0).ToArray();
                    var interrupts = othersArr.Where(x => x.HitType == 10).ToArray(); // TODO
                    var immune = othersArr.Where(x => x.HitType == 11).ToArray();

                    var hits25 = hitsArr.Where(x => x.HitType == 25 && 1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) < 0.4)
                        .ToArray();
                    var hits50 = hitsArr.Where(x => x.HitType == 25 &&
                                                    1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) >= 0.4 &&
                                                    1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) <= 0.6).ToArray();
                    var hits75 = hitsArr.Where(x => x.HitType == 25 && 1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) > 0.6)
                        .ToArray();
                    var hitsNormal = hitsArr.Where(x => x.MitGated[0] == 0).ToArray();
                    var hits25Dmg = hits25.Sum(x => x.Amount);
                    var hits50Dmg = hits50.Sum(x => x.Amount);
                    var hits75Dmg = hits75.Sum(x => x.Amount);
                    var hitsNormalDmg = hitsNormal.Sum(x => x.Amount);

                    var crits25 = critsArr
                        .Where(x => x.HitType == 45 && 1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) < 0.4).ToArray();
                    var crits50 = critsArr.Where(x => x.HitType == 45 &&
                                                      1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) >= 0.4 &&
                                                      1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) <= 0.6).ToArray();
                    var crits75 = critsArr
                        .Where(x => x.HitType == 45 && 1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) > 0.6).ToArray();
                    var critsNormal = critsArr.Where(x => x.MitGated[0] == 0).ToArray();
                    var crits25Dmg = crits25.Sum(x => x.Amount);
                    var crits50Dmg = crits50.Sum(x => x.Amount);
                    var crits75Dmg = crits75.Sum(x => x.Amount);
                    var critsNormalDmg = critsNormal.Sum(x => x.Amount);

                    /*
                    var hitsNormalMin = hitsNormal.Length == 0 ? 0 : hitsNormal.Min(x => x.Amount);
                    var hitsNormalMax = hitsNormal.Length == 0 ? 0 : hitsNormal.Max(x => x.Amount);
                    var hitsNormalAverage = hitsNormal.Length == 0 ? 0 : hitsNormal.Average(x => x.Amount);
                    var hits25Min = hits25.Length == 0 ? 0 : hits25.Min(x => x.Amount);
                    var hits25Max = hits25.Length == 0 ? 0 : hits25.Max(x => x.Amount);
                    var hits25Average = hits25.Length == 0 ? 0 : hits25.Average(x => x.Amount);
                    var hits50Min = hits50.Length == 0 ? 0 : hits50.Min(x => x.Amount);
                    var hits50Max = hits50.Length == 0 ? 0 : hits50.Max(x => x.Amount);
                    var hits50Average = hits50.Length == 0 ? 0 : hits50.Average(x => x.Amount);
                    var hits75Min = hits75.Length == 0 ? 0 : hits75.Min(x => x.Amount);
                    var hits75Max = hits75.Length == 0 ? 0 : hits75.Max(x => x.Amount);
                    var hits75Average = hits75.Length == 0 ? 0 : hits75.Average(x => x.Amount);
                    
                    var critsNormalMin = critsNormal.Length == 0 ? 0 : critsNormal.Min(x => x.Amount);
                    var critsNormalMax = critsNormal.Length == 0 ? 0 : critsNormal.Max(x => x.Amount);
                    var critsNormalAverage = critsNormal.Length == 0 ? 0 : critsNormal.Average(x => x.Amount);
                    var crits25Min = crits25.Length == 0 ? 0 : crits25.Min(x => x.Amount);
                    var crits25Max = crits25.Length == 0 ? 0 : crits25.Max(x => x.Amount);
                    var crits25Average = crits25.Length == 0 ? 0 : crits25.Average(x => x.Amount);
                    var crits50Min = crits50.Length == 0 ? 0 : crits50.Min(x => x.Amount);
                    var crits50Max = crits50.Length == 0 ? 0 : crits50.Max(x => x.Amount);
                    var crits50Average = crits50.Length == 0 ? 0 : crits50.Average(x => x.Amount);
                    var crits75Min = crits75.Length == 0 ? 0 : crits75.Min(x => x.Amount);
                    var crits75Max = crits75.Length == 0 ? 0 : crits75.Max(x => x.Amount);
                    var crits75Average = crits75.Length == 0 ? 0 : crits75.Average(x => x.Amount);
                    */

                    json += ",\"Hits\":{\"Count\":" + hitsArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * hitsArr.Length / allHits, 1) + ",\"Amount\":" + hitsDmg +
                            ",\"Fraction\":" + Math.Round(100.0 * hitsDmg / allDmg, 1) + ",\"Min\":" + hitsMin + ",\"Max\":" + hitsMax + ",\"Average\":" + Math.Round(hitsAverage, 1);

                    json += ",\"HasPartial\":" +
                            ((App.GetSpell(id, expansion).SpellCategory == 1 &&
                              (hits25.Length != 0 || hits50.Length != 0 || hits75.Length != 0)) ||
                             !(hits25.Length == 0 && hits50.Length == 0 && hits75.Length == 0)
                                ? 1
                                : 0);

                    // Partial box
                    if ((App.GetSpell(id, expansion).SpellCategory == 1 &&
                         (hits25.Length != 0 || hits50.Length != 0 || hits75.Length != 0)) ||
                        !(hits25.Length == 0 && hits50.Length == 0 && hits75.Length == 0))
                    {
                        json += ",\"Normal\":{\"Count\":" + hitsNormal.Length + ",\"CountFraction\":" +
                                (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hitsNormal.Length / hitsArr.Length, 1)) + ",\"Amount\":" + hitsNormalDmg +
                                ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hitsNormalDmg / hitsDmg, 1)) + "}";

                        json += ",\"P25\":{\"Count\":" + hits25.Length + ",\"CountFraction\":" +
                                (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits25.Length / hitsArr.Length, 1)) + ",\"Amount\":" + hits25Dmg +
                                ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits25Dmg / hitsDmg, 1)) + "}";

                        json += ",\"P50\":{\"Count\":" + hits50.Length + ",\"CountFraction\":" +
                                (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits50.Length / hitsArr.Length, 1)) + ",\"Amount\":" + hits50Dmg +
                                ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits50Dmg / hitsDmg, 1)) + "}";

                        json += ",\"P75\":{\"Count\":" + hits75.Length + ",\"CountFraction\":" +
                                (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits75.Length / hitsArr.Length, 1)) + ",\"Amount\":" + hits75Dmg +
                                ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits75Dmg / hitsDmg, 1)) + "}";
                    }
                    json += "}";

                    json += ",\"Crits\":{\"Count\":" + critsArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * critsArr.Length / allHits, 1) + ",\"Amount\":" + critsDmg +
                            ",\"Fraction\":" + Math.Round(100.0 * critsDmg / allDmg, 1) + ",\"Min\":" + critsMin +
                            ",\"Max\":" + critsMax + ",\"Average\":" + Math.Round(critsAverage, 1);

                    json += ",\"HasPartial\":" + ((App.GetSpell(id, expansion).SpellCategory == 1 &&
                                                   (crits25.Length != 0 || crits50.Length != 0 || crits75.Length != 0)) ||
                                                  !(crits25.Length == 0 && crits50.Length == 0 && crits75.Length == 0) ? 1 : 0);
                    // Partial box
                    if ((App.GetSpell(id, expansion).SpellCategory == 1 &&
                         (crits25.Length != 0 || crits50.Length != 0 || crits75.Length != 0)) ||
                        !(crits25.Length == 0 && crits50.Length == 0 && crits75.Length == 0))
                    {
                        json += ",\"Normal\":{\"Count\":" + critsNormal.Length + ",\"CountFraction\":" +
                                (critsArr.Length == 0 ? 0 : Math.Round(100.0 * critsNormal.Length / critsArr.Length, 1)) + ",\"Amount\":" + critsNormalDmg +
                                ",\"Fraction\":" + (critsArr.Length == 0 ? 0 : Math.Round(100.0 * critsNormalDmg / critsDmg, 1)) + "}";

                        json += ",\"P25\":{\"Count\":" + crits25.Length + ",\"CountFraction\":" +
                                (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits25.Length / critsArr.Length, 1)) + ",\"Amount\":" + crits25Dmg +
                                ",\"Fraction\":" + (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits25Dmg / critsDmg, 1)) + "}";

                        json += ",\"P50\":{\"Count\":" + crits50.Length + ",\"CountFraction\":" +
                                (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits50.Length / critsArr.Length, 1)) + ",\"Amount\":" + crits50Dmg +
                                ",\"Fraction\":" + (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits50Dmg / critsDmg, 1)) + "}";

                        json += ",\"P75\":{\"Count\":" + crits75.Length + ",\"CountFraction\":" +
                                (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits75.Length / critsArr.Length, 1)) + ",\"Amount\":" + crits75Dmg +
                                ",\"Fraction\":" + (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits75Dmg / critsDmg, 1)) + "}";
                    }
                    json += "}";

                    json += ",\"Resists\":{\"Count\":" + resists + ",\"CountFraction\":" +
                            Math.Round(100.0 * resists / allHits, 1) + "}";

                    json += ",\"Others\":{\"Count\":" + othersArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * othersArr.Length / allHits, 1) + "}";

                    json += ",\"Reflects\":{\"Count\":" + reflects.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * reflects.Length / othersArr.Length, 1)) + "}";

                    json += ",\"Interrupts\":{\"Count\":" + interrupts.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * interrupts.Length / othersArr.Length, 1)) + "}";

                    json += ",\"Absorbs\":{\"Count\":" + absorbs.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * absorbs.Length / othersArr.Length, 1)) + ",\"Mitgated\":" + absorbs.Sum(x => x.MitGated[0] + x.MitGated[2]) + "}";

                    json += ",\"Immune\":{\"Count\":" + immune.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * immune.Length / othersArr.Length, 1)) + "}";
                }

                json += ",\"Total\":{\"Min\":" + critsMin + ",\"Max\":" + critsMax + ",\"Average\":" +
                        Math.Round(totalAverage, 1) + ",\"Hits\":" + allHits + ",\"Amount\":" + allDmg + "}";
                json += ",\"Icon\":\"" + icon + "\"}";
            }
            else if (mode == "Threat")
            {
                // Damage done
                var threat =
                    data.m_Threat.Where(x => data.m_SatReference[x.SatRefId].SourceId == charid && data.m_SatReference[x.SatRefId].AbilityId == id &&
                                                    x.TimeStamp >= start &&
                                                    x.TimeStamp <= end);

                threat = RaidViewerUtility.ApplyTargetCondition(ref threat, data, tarid);
                threat = RaidViewerUtility.ApplyCategoryCondition(ref threat, data, cat, atmt, expansion);

                // First the spell tooltip
                json += ",\"SpellName\":\"" + App.GetSpell(id, expansion).Name + "\",\"RowType\":6";
                string icon = App.m_Icons[App.GetSpell(id, expansion).Icon];
                if (id == 47490)
                    icon = "inv_sword_39";
                if (id == 0)
                    return "{\"Error\":\"Error retrieving information\"}";

                var dmgArr = threat.ToArray();
                var allDmg = Convert.ToInt32(dmgArr.Sum(x => x.Amount) / 100.0);
                var allHits = dmgArr.Count();
                var hits = dmgArr.Where(x => (x.HitType >= 20 && x.HitType <= 32) || x.HitType == 60);
                var hitsArr = hits.ToArray();
                var hitsDmg = Convert.ToInt32(hitsArr.Sum(x => x.Amount) / 100.0);
                var crits = dmgArr.Where(x => x.HitType >= 40 && x.HitType <= 52);
                var critsArr = crits.ToArray();
                var critsDmg = Convert.ToInt32(critsArr.Sum(x => x.Amount) / 100.0);

                var hitsMin = hitsArr.Length == 0 ? 0 : Convert.ToInt32(hitsArr.Where(x => x.Amount > 0).Min(x => x.Amount) / 100.0);
                var hitsMax = hitsArr.Length == 0 ? 0 : Convert.ToInt32(hitsArr.Max(x => x.Amount) / 100.0);
                var hitsAverage = hitsArr.Length == 0 ? 0 : hitsArr.Average(x => x.Amount);

                var critsMin = critsArr.Length == 0 ? 0 : Convert.ToInt32(critsArr.Min(x => x.Amount) / 100.0);
                var critsMax = critsArr.Length == 0 ? 0 : Convert.ToInt32(critsArr.Max(x => x.Amount) / 100.0);
                var critsAverage = critsArr.Length == 0 ? 0 : critsArr.Average(x => x.Amount);

                var totalMin = (hitsMin > critsMin) ? critsMin : hitsMin;
                var totalMax = (hitsMax > critsMax) ? hitsMax : critsMax;
                var totalAverage = dmgArr.Length == 0 ? 0 : dmgArr.Average(x => x.Amount);

                
                var glance = hitsArr.Where(x => x.HitType == 22).ToArray();
                var block = hitsArr.Where(x => x.HitType == 26).ToArray();
                var crush = hitsArr.Where(x => x.HitType == 27).ToArray();
                var normal = hitsArr.Where(x => x.HitType != 22 && x.HitType != 26 && x.HitType != 27).ToArray();
                var glanceDmg = Convert.ToInt32(glance.Sum(x => x.Amount)/100.0);
                var blockDmg = Convert.ToInt32(block.Sum(x => x.Amount) / 100.0);
                var crushDmg = Convert.ToInt32(crush.Sum(x => x.Amount) / 100.0);
                var normalDmg = Convert.ToInt32(normal.Sum(x => x.Amount) / 100.0);

                json += ",\"Hits\":{\"Count\":" + hitsArr.Length + ",\"CountFraction\":" +
                        Math.Round(100.0 * hitsArr.Length / allHits, 1) + ",\"Amount\":" + hitsDmg +
                        ",\"Fraction\":" + Math.Round(100.0 * hitsDmg / allDmg, 1) + ",\"Min\":" + hitsMin + ",\"Max\":" + hitsMax + ",\"Average\":" + Math.Round(hitsAverage / 100.0, 1) + "}";
                json += ",\"EID\":" + charid;
                json += ",\"SpellId\":" + id;
                json += ",\"Normal\":{\"Count\":" + normal.Length + ",\"CountFraction\":" +
                        (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * normal.Length / hitsArr.Length, 1)) + ",\"Amount\":" + normalDmg +
                        ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * normalDmg / hitsDmg, 1)) + "}";

                json += ",\"Glance\":{\"Count\":" + glance.Length + ",\"CountFraction\":" +
                        (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * glance.Length / hitsArr.Length, 1)) + ",\"Amount\":" + glanceDmg +
                        ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * glanceDmg / hitsDmg, 1)) + "}";

                json += ",\"Crush\":{\"Count\":" + crush.Length + ",\"CountFraction\":" +
                        (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * crush.Length / hitsArr.Length, 1)) + ",\"Amount\":" + crushDmg +
                        ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * crushDmg / hitsDmg, 1)) + "}";

                json += ",\"Block\":{\"Count\":" + block.Length + ",\"CountFraction\":" +
                        (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * block.Length / hitsArr.Length, 1)) + ",\"Amount\":" + blockDmg +
                        ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * blockDmg / hitsDmg, 1)) + "}";

                json += ",\"Crits\":{\"Count\":" + critsArr.Length + ",\"CountFraction\":" +
                        Math.Round(100.0 * critsArr.Length / allHits, 1) + ",\"Amount\":" + critsDmg +
                        ",\"Fraction\":" + Math.Round(100.0 * critsDmg / allDmg, 1) + ",\"Min\":" + critsMin + ",\"Max\":" + critsMax + ",\"Average\":" + Math.Round(critsAverage/100.0, 1) + "}";

                json += ",\"Total\":{\"Min\":" + critsMin + ",\"Max\":" + critsMax + ",\"Average\":" +
                        Math.Round(totalAverage / 100.0, 1) + ",\"Hits\":" + allHits + ",\"Amount\":" + allDmg + "}";
                json += ",\"Icon\":\"" + icon + "\"}";
            }
            else if (mode == "Damage taken")
            {
                // Damage taken
                var dmgdone =
                    data.m_Damage.Values.Where(x => data.m_SatReference[x.SatRefId].TargetId == charid && data.m_SatReference[x.SatRefId].AbilityId == id &&
                                                    x.TimeStamp >= start &&
                                                    x.TimeStamp <= end);

                dmgdone = RaidViewerUtility.ApplyTargetConditionInverted(ref dmgdone, data, tarid);
                dmgdone = RaidViewerUtility.ApplyCategoryCondition(ref dmgdone, data, cat, atmt, expansion);

                // First the spell tooltip
                json += ",\"SpellName\":\"" + App.GetSpell(id, expansion).Name + "\",\"RowType\":1";
                string icon = App.m_Icons[App.GetSpell(id, expansion).Icon];
                if (id == 47490)
                    icon = "inv_sword_39";
                if (id == 0)
                    return "{\"Error\":\"Error retrieving information\"}";

                var dmgArr = dmgdone.ToArray();
                var allDmg = dmgArr.Sum(x => x.Amount);
                var allHits = dmgArr.Count();
                var hits = dmgArr.Where(x => x.HitType >= 20 && x.HitType <= 32);
                var hitsArr = hits.ToArray();
                var hitsDmg = hitsArr.Sum(x => x.Amount);
                var crits = dmgArr.Where(x => x.HitType >= 40 && x.HitType <= 52);
                var critsArr = crits.ToArray();
                var critsDmg = critsArr.Sum(x => x.Amount);
                var othersArr = dmgArr.Where(x => x.HitType < 12).ToArray(); // This may not add up :/

                var hitsMin = hitsArr.Length == 0 ? 0 : hitsArr.Where(x => x.Amount > 0).Min(x => x.Amount);
                var hitsMax = hitsArr.Length == 0 ? 0 : hitsArr.Max(x => x.Amount);
                var hitsAverage = hitsArr.Length == 0 ? 0 : hitsArr.Average(x => x.Amount);

                var critsMin = critsArr.Length == 0 ? 0 : critsArr.Min(x => x.Amount);
                var critsMax = critsArr.Length == 0 ? 0 : critsArr.Max(x => x.Amount);
                var critsAverage = critsArr.Length == 0 ? 0 : critsArr.Average(x => x.Amount);

                var totalMin = (hitsMin > critsMin) ? critsMin : hitsMin;
                var totalMax = (hitsMax > critsMax) ? hitsMax : critsMax;
                var totalAverage = dmgArr.Length == 0 ? 0 : dmgArr.Average(x => x.Amount);

                var classid = charid >= 300000 ? App.GetChar(charid).RefMisc.Class : 0;
                json += ",\"SpellType\":" + (App.GetSpell(id, expansion).SpellCategory == 0 && othersArr.All(x => x.HitType != 5 && x.HitType != 25 && x.HitType != 45) ? 0 : 1);
                // TODO: A better way to classify spells as range or meele attacks!
                //if (othersArr.All(x => x.HitType > 0 && x.HitType < 8 && x.HitType != 25 && x.HitType != 45 && x.HitType != 5) && !(othersArr.All(x => x.HitType != 2 && x.HitType != 3 && x.HitType != 4 && x.HitType != 6 && x.HitType != 7) && (classid == 2 || classid == 4 || classid == 5 || classid == 6 || classid == 8))) // Meele tooltip?
                if (App.GetSpell(id, expansion).SpellCategory == 0 && othersArr.All(x => x.HitType != 5 && x.HitType != 25 && x.HitType != 45)) // 0 => Melee, 2 => Binary Spell, 1 => Non Binary Spell
                {
                    var misses = dmgArr.Count(x => x.HitType == 12);
                    var glance = hitsArr.Where(x => x.HitType == 22).ToArray();
                    var block = hitsArr.Where(x => x.HitType == 26 || x.MitGated[1] > 0).ToArray();
                    var crush = hitsArr.Where(x => x.HitType == 27).ToArray();
                    var normal = hitsArr.Where(x => x.HitType != 22 && x.HitType != 26 && x.HitType != 27).ToArray();
                    var glanceDmg = glance.Sum(x => x.Amount);
                    var blockDmg = block.Sum(x => x.Amount);
                    var crushDmg = crush.Sum(x => x.Amount);
                    var normalDmg = normal.Sum(x => x.Amount);

                    var parry = othersArr.Where(x => x.HitType == 4).ToArray();
                    var dodge = othersArr.Where(x => x.HitType == 3).ToArray();
                    var absorbs = othersArr.Where(x => x.HitType == 8 || x.MitGated[2] > 0).ToArray();
                    var immune = othersArr.Where(x => x.HitType == 11).ToArray();

                    /*
                    var normalMin = normal.Length == 0 ? 0 : normal.Min(x => x.Amount);
                    var normalMax = normal.Length == 0 ? 0 : normal.Max(x => x.Amount);
                    var normalAverage = normal.Length == 0 ? 0 : normal.Average(x => x.Amount);
                    var glanceMin = glance.Length == 0 ? 0 : glance.Min(x => x.Amount);
                    var glanceMax = glance.Length == 0 ? 0 : glance.Max(x => x.Amount);
                    var glanceAverage = glance.Length == 0 ? 0 : glance.Average(x => x.Amount);
                    var blockMin = block.Length == 0 ? 0 : block.Min(x => x.Amount);
                    var blockMax = block.Length == 0 ? 0 : block.Max(x => x.Amount);
                    var blockAverage = block.Length == 0 ? 0 : block.Average(x => x.Amount);
                    var crushMin = crush.Length == 0 ? 0 : crush.Min(x => x.Amount);
                    var crushMax = crush.Length == 0 ? 0 : crush.Max(x => x.Amount);
                    var crushAverage = crush.Length == 0 ? 0 : crush.Average(x => x.Amount);
                    */

                    json += ",\"Hits\":{\"Count\":" + hitsArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * hitsArr.Length / allHits, 1) + ",\"Amount\":" + hitsDmg +
                            ",\"Fraction\":" + Math.Round(100.0 * hitsDmg / allDmg, 1) + ",\"Min\":" + hitsMin + ",\"Max\":" + hitsMax + ",\"Average\":" + Math.Round(hitsAverage, 1) + "}";
                    json += ",\"EID\":" + charid;
                    json += ",\"SpellId\":" + id;
                    json += ",\"Normal\":{\"Count\":" + normal.Length + ",\"CountFraction\":" +
                            (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * normal.Length / hitsArr.Length, 1)) + ",\"Amount\":" + normalDmg +
                            ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * normalDmg / hitsDmg, 1)) + "}";

                    json += ",\"Crush\":{\"Count\":" + crush.Length + ",\"CountFraction\":" +
                            (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * crush.Length / hitsArr.Length, 1)) + ",\"Amount\":" + crushDmg +
                            ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * crushDmg / hitsDmg, 1)) + "}";

                    json += ",\"Block\":{\"Count\":" + block.Length + ",\"CountFraction\":" +
                            (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * block.Length / hitsArr.Length, 1)) + ",\"Amount\":" + blockDmg +
                            ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * blockDmg / hitsDmg, 1)) + ",\"Mitgated\":" + block.Sum(x => x.MitGated[0] + x.MitGated[1]) + "}";

                    json += ",\"Crits\":{\"Count\":" + critsArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * critsArr.Length / allHits, 1) + ",\"Amount\":" + critsDmg +
                            ",\"Fraction\":" + Math.Round(100.0 * critsDmg / allDmg, 1) + ",\"Min\":" + critsMin + ",\"Max\":" + critsMax + ",\"Average\":" + Math.Round(critsAverage, 1) + "}";

                    json += ",\"Misses\":{\"Count\":" + misses + ",\"CountFraction\":" +
                            Math.Round(100.0 * misses / allHits, 1) + "}";

                    json += ",\"Others\":{\"Count\":" + othersArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * othersArr.Length / allHits, 1) + "}";

                    json += ",\"Parry\":{\"Count\":" + parry.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * parry.Length / othersArr.Length, 1)) + "}";

                    json += ",\"Dodge\":{\"Count\":" + dodge.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * dodge.Length / othersArr.Length, 1)) + "}";

                    json += ",\"Absorbs\":{\"Count\":" + absorbs.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * absorbs.Length / othersArr.Length, 1)) + ",\"Mitgated\":" + absorbs.Sum(x => x.MitGated[0] + x.MitGated[2]) + "}";

                    json += ",\"Immune\":{\"Count\":" + immune.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * immune.Length / othersArr.Length, 1)) + "}";
                }
                else
                {
                    othersArr = othersArr.Where(x => x.HitType != 5).ToArray();
                    var resists = dmgArr.Count(x => x.HitType == 5);
                    var reflects = othersArr.Where(x => x.HitType == 99).ToArray(); // TODO
                    var absorbs = othersArr.Where(x => x.HitType == 8 || x.MitGated[2] > 0).ToArray();
                    var interrupts = othersArr.Where(x => x.HitType == 10).ToArray(); // TODO
                    var immune = othersArr.Where(x => x.HitType == 11).ToArray();

                    var hits25 = hitsArr.Where(x => x.HitType == 25 && 1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) < 0.4)
                        .ToArray();
                    var hits50 = hitsArr.Where(x => x.HitType == 25 &&
                                                    1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) >= 0.4 &&
                                                    1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) <= 0.6).ToArray();
                    var hits75 = hitsArr.Where(x => x.HitType == 25 && 1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) > 0.6)
                        .ToArray();
                    var hitsNormal = hitsArr.Where(x => x.MitGated[0] == 0).ToArray();
                    var hits25Dmg = hits25.Sum(x => x.Amount);
                    var hits50Dmg = hits50.Sum(x => x.Amount);
                    var hits75Dmg = hits75.Sum(x => x.Amount);
                    var hitsNormalDmg = hitsNormal.Sum(x => x.Amount);

                    var crits25 = critsArr
                        .Where(x => x.HitType == 45 && 1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) < 0.4).ToArray();
                    var crits50 = critsArr.Where(x => x.HitType == 45 &&
                                                      1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) >= 0.4 &&
                                                      1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) <= 0.6).ToArray();
                    var crits75 = critsArr
                        .Where(x => x.HitType == 45 && 1.0 * x.MitGated[0] / (x.Amount + x.MitGated[0]) > 0.6).ToArray();
                    var critsNormal = critsArr.Where(x => x.MitGated[0] == 0).ToArray();
                    var crits25Dmg = crits25.Sum(x => x.Amount);
                    var crits50Dmg = crits50.Sum(x => x.Amount);
                    var crits75Dmg = crits75.Sum(x => x.Amount);
                    var critsNormalDmg = critsNormal.Sum(x => x.Amount);

                    /*
                    var hitsNormalMin = hitsNormal.Length == 0 ? 0 : hitsNormal.Min(x => x.Amount);
                    var hitsNormalMax = hitsNormal.Length == 0 ? 0 : hitsNormal.Max(x => x.Amount);
                    var hitsNormalAverage = hitsNormal.Length == 0 ? 0 : hitsNormal.Average(x => x.Amount);
                    var hits25Min = hits25.Length == 0 ? 0 : hits25.Min(x => x.Amount);
                    var hits25Max = hits25.Length == 0 ? 0 : hits25.Max(x => x.Amount);
                    var hits25Average = hits25.Length == 0 ? 0 : hits25.Average(x => x.Amount);
                    var hits50Min = hits50.Length == 0 ? 0 : hits50.Min(x => x.Amount);
                    var hits50Max = hits50.Length == 0 ? 0 : hits50.Max(x => x.Amount);
                    var hits50Average = hits50.Length == 0 ? 0 : hits50.Average(x => x.Amount);
                    var hits75Min = hits75.Length == 0 ? 0 : hits75.Min(x => x.Amount);
                    var hits75Max = hits75.Length == 0 ? 0 : hits75.Max(x => x.Amount);
                    var hits75Average = hits75.Length == 0 ? 0 : hits75.Average(x => x.Amount);
                    
                    var critsNormalMin = critsNormal.Length == 0 ? 0 : critsNormal.Min(x => x.Amount);
                    var critsNormalMax = critsNormal.Length == 0 ? 0 : critsNormal.Max(x => x.Amount);
                    var critsNormalAverage = critsNormal.Length == 0 ? 0 : critsNormal.Average(x => x.Amount);
                    var crits25Min = crits25.Length == 0 ? 0 : crits25.Min(x => x.Amount);
                    var crits25Max = crits25.Length == 0 ? 0 : crits25.Max(x => x.Amount);
                    var crits25Average = crits25.Length == 0 ? 0 : crits25.Average(x => x.Amount);
                    var crits50Min = crits50.Length == 0 ? 0 : crits50.Min(x => x.Amount);
                    var crits50Max = crits50.Length == 0 ? 0 : crits50.Max(x => x.Amount);
                    var crits50Average = crits50.Length == 0 ? 0 : crits50.Average(x => x.Amount);
                    var crits75Min = crits75.Length == 0 ? 0 : crits75.Min(x => x.Amount);
                    var crits75Max = crits75.Length == 0 ? 0 : crits75.Max(x => x.Amount);
                    var crits75Average = crits75.Length == 0 ? 0 : crits75.Average(x => x.Amount);
                    */

                    json += ",\"Hits\":{\"Count\":" + hitsArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * hitsArr.Length / allHits, 1) + ",\"Amount\":" + hitsDmg +
                            ",\"Fraction\":" + Math.Round(100.0 * hitsDmg / allDmg, 1) + ",\"Min\":" + hitsMin + ",\"Max\":" + hitsMax + ",\"Average\":" + Math.Round(hitsAverage, 1);

                    json += ",\"HasPartial\":" +
                            ((App.GetSpell(id, expansion).SpellCategory == 1 &&
                              (hits25.Length != 0 || hits50.Length != 0 || hits75.Length != 0)) ||
                             !(hits25.Length == 0 && hits50.Length == 0 && hits75.Length == 0)
                                ? 1
                                : 0);

                    // Partial box
                    if ((App.GetSpell(id, expansion).SpellCategory == 1 &&
                         (hits25.Length != 0 || hits50.Length != 0 || hits75.Length != 0)) ||
                        !(hits25.Length == 0 && hits50.Length == 0 && hits75.Length == 0))
                    {
                        json += ",\"Normal\":{\"Count\":" + hitsNormal.Length + ",\"CountFraction\":" +
                                (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hitsNormal.Length / hitsArr.Length, 1)) + ",\"Amount\":" + hitsNormalDmg +
                                ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hitsNormalDmg / hitsDmg, 1)) + "}";

                        json += ",\"P25\":{\"Count\":" + hits25.Length + ",\"CountFraction\":" +
                                (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits25.Length / hitsArr.Length, 1)) + ",\"Amount\":" + hits25Dmg +
                                ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits25Dmg / hitsDmg, 1)) + "}";

                        json += ",\"P50\":{\"Count\":" + hits50.Length + ",\"CountFraction\":" +
                                (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits50.Length / hitsArr.Length, 1)) + ",\"Amount\":" + hits50Dmg +
                                ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits50Dmg / hitsDmg, 1)) + "}";

                        json += ",\"P75\":{\"Count\":" + hits75.Length + ",\"CountFraction\":" +
                                (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits75.Length / hitsArr.Length, 1)) + ",\"Amount\":" + hits75Dmg +
                                ",\"Fraction\":" + (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hits75Dmg / hitsDmg, 1)) + "}";
                    }
                    json += "}";

                    json += ",\"Crits\":{\"Count\":" + critsArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * critsArr.Length / allHits, 1) + ",\"Amount\":" + critsDmg +
                            ",\"Fraction\":" + Math.Round(100.0 * critsDmg / allDmg, 1) + ",\"Min\":" + critsMin +
                            ",\"Max\":" + critsMax + ",\"Average\":" + Math.Round(critsAverage, 1);

                    json += ",\"HasPartial\":" + ((App.GetSpell(id, expansion).SpellCategory == 1 &&
                                                   (crits25.Length != 0 || crits50.Length != 0 || crits75.Length != 0)) ||
                                                  !(crits25.Length == 0 && crits50.Length == 0 && crits75.Length == 0) ? 1 : 0);
                    // Partial box
                    if ((App.GetSpell(id, expansion).SpellCategory == 1 &&
                         (crits25.Length != 0 || crits50.Length != 0 || crits75.Length != 0)) ||
                        !(crits25.Length == 0 && crits50.Length == 0 && crits75.Length == 0))
                    {
                        json += ",\"Normal\":{\"Count\":" + critsNormal.Length + ",\"CountFraction\":" +
                                (critsArr.Length == 0 ? 0 : Math.Round(100.0 * critsNormal.Length / critsArr.Length, 1)) + ",\"Amount\":" + critsNormalDmg +
                                ",\"Fraction\":" + (critsArr.Length == 0 ? 0 : Math.Round(100.0 * critsNormalDmg / critsDmg, 1)) + "}";

                        json += ",\"P25\":{\"Count\":" + crits25.Length + ",\"CountFraction\":" +
                                (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits25.Length / critsArr.Length, 1)) + ",\"Amount\":" + crits25Dmg +
                                ",\"Fraction\":" + (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits25Dmg / critsDmg, 1)) + "}";

                        json += ",\"P50\":{\"Count\":" + crits50.Length + ",\"CountFraction\":" +
                                (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits50.Length / critsArr.Length, 1)) + ",\"Amount\":" + crits50Dmg +
                                ",\"Fraction\":" + (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits50Dmg / critsDmg, 1)) + "}";

                        json += ",\"P75\":{\"Count\":" + crits75.Length + ",\"CountFraction\":" +
                                (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits75.Length / critsArr.Length, 1)) + ",\"Amount\":" + crits75Dmg +
                                ",\"Fraction\":" + (critsArr.Length == 0 ? 0 : Math.Round(100.0 * crits75Dmg / critsDmg, 1)) + "}";
                    }
                    json += "}";

                    json += ",\"Resists\":{\"Count\":" + resists + ",\"CountFraction\":" +
                            Math.Round(100.0 * resists / allHits, 1) + "}";

                    json += ",\"Others\":{\"Count\":" + othersArr.Length + ",\"CountFraction\":" +
                            Math.Round(100.0 * othersArr.Length / allHits, 1) + "}";

                    json += ",\"Reflects\":{\"Count\":" + reflects.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * reflects.Length / othersArr.Length, 1)) + "}";

                    json += ",\"Interrupts\":{\"Count\":" + interrupts.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * interrupts.Length / othersArr.Length, 1)) + "}";

                    json += ",\"Absorbs\":{\"Count\":" + absorbs.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * absorbs.Length / othersArr.Length, 1)) + ",\"Mitgated\":" + absorbs.Sum(x => x.MitGated[0] + x.MitGated[2]) + "}";

                    json += ",\"Immune\":{\"Count\":" + immune.Length + ",\"CountFraction\":" +
                            (othersArr.Length == 0 ? 0 : Math.Round(100.0 * immune.Length / othersArr.Length, 1)) + "}";

                    // Hits
                    // Header line
                    json += "<tr><td>Hits</td><td>" + hitsArr.Length + "</td><td>" +
                            Math.Round(100.0 * hitsArr.Length / allHits, 1) + "%</td><td>" + hitsDmg + "</td><td>" +
                            Math.Round(100.0 * hitsDmg / allDmg, 1) + "%</td></tr>";
                }
                
                json += ",\"Total\":{\"Min\":" + critsMin + ",\"Max\":" + critsMax + ",\"Average\":" +
                        Math.Round(totalAverage, 1) + ",\"Hits\":" + allHits + ",\"Amount\":" + allDmg + "}";
                json += ",\"Icon\":\"" + icon + "\"}";
            }
            else if (mode == "Healing taken")
            {
                var query = RaidViewerUtility.GetQuery("Healing taken", data, start, end, charid, tarid, cat, atmt, expansion)
                    .Where(x => x.SourceId == charid && x.AbilityId == id).GroupBy(x => x.TargetId).OrderByDescending(x => x.Sum(y => y.Amount)).Take(10)
                    .ToArray();

                json += ",\"RowType\":2,\"Sources\":[";

                var count = 0;
                int totalSum = query.Sum(x => x.Where(y => y.Type == 0).Sum(y => y.Amount));
                for (int i = 0; i < query.Length; ++i)
                {
                    if (count != 0) json += ",";
                    int sum = query[i].Where(x => x.Type == 0).Sum(y => y.Amount);
                    json += "{\"Name\":\"" +
                            (query[i].Key >= 300000 ? App.GetChar(query[i].Key).Name : App.GetNpc(query[i].Key).Name) +
                            "\",\"Eff\":" + sum + ",\"Overheal\":" +
                            query[i].Where(x => x.Type == 1).Sum(x => x.Amount) + ",\"Fraction\":" +
                            Math.Round(100.0 * sum / totalSum, 1) + "}";
                    ++count;
                }

                json += "],\"Icon\":\"" + App.m_Icons[App.GetSpell(id).Icon] + "\"}";
            }
            else if (mode == "Healing")
            {
                var healing =
                    data.m_Healing.Values.Where(x => data.m_SatReference[x.SatRefId].SourceId == charid && data.m_SatReference[x.SatRefId].AbilityId == id &&
                                                    x.TimeStamp >= start &&
                                                    x.TimeStamp <= end);

                healing = RaidViewerUtility.ApplyTargetCondition(ref healing, data, tarid);
                healing = RaidViewerUtility.ApplyCategoryCondition(ref healing, data, cat, atmt, expansion);

                json += ",\"SpellName\":\"" + App.GetSpell(id, expansion).Name + "\",\"RowType\":3";
                string icon = App.m_Icons[App.GetSpell(id, expansion).Icon];
                if (id == 47490)
                    icon = "inv_sword_39";
                if (id == 0)
                    return "{\"Error\":\"Error retrieving information\"}";

                var HealArr = healing.ToArray();
                var allHits = HealArr.GroupBy(x => new{x.HitType, x.TimeStamp, x.SatRefId}).Count();
                var allHeal = HealArr.Sum(x => x.Amount);

                var hitsArr = HealArr.Where(x => x.HitType%10 == 0).ToArray();
                var hitsArrLength = hitsArr.GroupBy(x => new {x.HitType, x.TimeStamp, x.SatRefId}).Count();
                var hitsHeal = hitsArr.Sum(x => x.Amount);
                var hitsEff = hitsArr.Where(x => x.HitType < 10).ToArray();
                var hitsEffHeal = hitsEff.Sum(x => x.Amount);
                var hitsOH = hitsArr.Where(x => x.HitType >= 10).ToArray();
                var hitsOHHeal = hitsOH.Sum(x => x.Amount);

                var critsArr = HealArr.Where(x => x.HitType % 10 == 1).ToArray();
                var critsArrLength = critsArr.GroupBy(x => new { x.HitType, x.TimeStamp, x.SatRefId }).Count();
                var critsHeal = critsArr.Sum(x => x.Amount);
                var critsEff = critsArr.Where(x => x.HitType < 10).ToArray();
                var critsEffHeal = critsEff.Sum(x => x.Amount);
                var critsOH = critsArr.Where(x => x.HitType >= 10).ToArray();
                var critsOHHeal = critsOH.Sum(x => x.Amount);

                json += ",\"Hits\":{\"Count\":" + hitsArrLength + ",\"CountFraction\":" +
                        Math.Round(100.0 * hitsArrLength / allHits, 1) + ",\"Amount\":" + hitsHeal +
                        ",\"Fraction\":" + Math.Round(100.0 * hitsHeal / allHeal, 1) + ",\"Eff\":" + hitsEffHeal +
                        ",\"EffFraction\":" +
                        (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hitsEffHeal / hitsHeal, 1)) + ",\"Overheal\":" +
                        hitsOHHeal + ",\"OverhealFraction\":" +
                        (hitsArr.Length == 0 ? 0 : Math.Round(100.0 * hitsOHHeal / hitsHeal, 1)) + "}";

                json += ",\"Crits\":{\"Count\":" + critsArrLength + ",\"CountFraction\":" +
                        Math.Round(100.0 * critsArrLength / allHits, 1) + ",\"Amount\":" + critsHeal +
                        ",\"Fraction\":" + Math.Round(100.0 * critsHeal / allHeal, 1) + ",\"Eff\":" + critsEffHeal +
                        ",\"EffFraction\":" +
                        (critsArr.Length == 0 ? 0 : Math.Round(100.0 * critsEffHeal / critsHeal, 1)) + ",\"Overheal\":" +
                        critsOHHeal + ",\"OverhealFraction\":" +
                        (critsArr.Length == 0 ? 0 : Math.Round(100.0 * critsOHHeal / critsHeal, 1)) + "}";

                json += ",\"Total\":{\"Eff\":" + (hitsEffHeal + critsEffHeal) + ",\"EffFraction\":" +
                        (allHeal == 0 ? 0 : Math.Round(100.0 * (hitsEffHeal + critsEffHeal) / allHeal, 1)) +
                        ",\"Overheal\":" + (hitsOHHeal + critsOHHeal) + ",\"OverhealFraction\":" +
                        (allHeal == 0 ? 0 : Math.Round(100.0 * (hitsOHHeal + critsOHHeal) / allHeal, 1)) +
                        ",\"Hits\":" + (hitsArrLength + critsArrLength) + "}";
                json += ",\"Icon\":\"" + icon + "\"}";
            }
            else if (mode == "Deaths")
            {
                var dmgdone =
                    data.m_Damage.Values.Where(x => data.m_SatReference[x.SatRefId].TargetId == charid &&
                                                    x.TimeStamp >= start &&
                                                    x.TimeStamp <= id /*&& x.Amount > 0*/);
                var healing =
                    data.m_Healing.Values.Where(x => data.m_SatReference[x.SatRefId].TargetId == charid &&
                                                     x.TimeStamp >= start &&
                                                     x.TimeStamp <= id);

                healing = RaidViewerUtility.ApplyTargetCondition(ref healing, data, tarid);
                healing = RaidViewerUtility.ApplyCategoryCondition(ref healing, data, cat, atmt, expansion);
                dmgdone = RaidViewerUtility.ApplyTargetCondition(ref dmgdone, data, tarid);
                dmgdone = RaidViewerUtility.ApplyCategoryCondition(ref dmgdone, data, cat, atmt, expansion);

                json += ",\"TS\":"+ (id + start) + ",\"RowType\":4";
                
                var dmgDoneArr = dmgdone.OrderByDescending(x => x.TimeStamp).ToArray();
                var healingArr = healing.OrderByDescending(x => x.TimeStamp).ToArray();

                short events = 0;
                short dmgCount = 0;
                short healCount = 0;
                short lastEvent = 0;
                short hardBreak = 0;
                json += ",\"Entries\":[";
                while (events < 15 && hardBreak < 10000)
                {
                    if ((dmgCount + 1 >= dmgDoneArr.Length && healCount + 1 < healingArr.Length) ||
                        (dmgCount + 1 < dmgDoneArr.Length && healCount + 1 < healingArr.Length &&
                         dmgDoneArr[dmgCount].TimeStamp < healingArr[healCount].TimeStamp))
                    {
                        if (events != 0) json += ",";
                        json += "{\"TS\":" + (healingArr[healCount].TimeStamp + start) + ",\"Class\":" +
                                (data.m_SatReference[healingArr[healCount].SatRefId].SourceId >= 300000
                                    ? App.GetChar(data.m_SatReference[healingArr[healCount].SatRefId].SourceId).RefMisc
                                        .Class
                                    : App.GetNpc(data.m_SatReference[healingArr[healCount].SatRefId].SourceId,
                                        expansion).Class) + ",\"Name\":\"" +
                                (data.m_SatReference[healingArr[healCount].SatRefId].SourceId >= 300000
                                    ? App.GetChar(data.m_SatReference[healingArr[healCount].SatRefId].SourceId).Name
                                    : App.GetNpc(data.m_SatReference[healingArr[healCount].SatRefId].SourceId,
                                        expansion).Name) + "\",\"SpellName\":\"" +
                                App.GetSpell(data.m_SatReference[healingArr[healCount].SatRefId].AbilityId, expansion)
                                    .Name + "\"," +
                                "\"SpellType\":" +
                                App.GetSpell(data.m_SatReference[healingArr[healCount].SatRefId].AbilityId, expansion)
                                    .Type + ",\"HitType\":" + (healingArr[healCount].HitType % 10) +
                                ",\"Modifier\":\"positive\",\"Amount\":" + healingArr[healCount].Amount + "}";
                        ++healCount;
                        ++events;
                    }
                    else if ((dmgCount + 1 < dmgDoneArr.Length && healCount + 1 >= healingArr.Length) ||
                             (dmgCount + 1 < dmgDoneArr.Length && healCount + 1 < healingArr.Length &&
                              dmgDoneArr[dmgCount].TimeStamp > healingArr[healCount].TimeStamp))
                    {
                        if (events != 0) json += ",";
                        json += "{\"TS\":" + (dmgDoneArr[dmgCount].TimeStamp + start) + ",\"Class\":" +
                                (data.m_SatReference[dmgDoneArr[dmgCount].SatRefId].SourceId >= 300000
                                    ? App.GetChar(data.m_SatReference[dmgDoneArr[dmgCount].SatRefId].SourceId).RefMisc
                                        .Class
                                    : App.GetNpc(data.m_SatReference[dmgDoneArr[dmgCount].SatRefId].SourceId,
                                        expansion).Class) + ",\"Name\":\"" +
                                (data.m_SatReference[dmgDoneArr[dmgCount].SatRefId].SourceId >= 300000
                                    ? App.GetChar(data.m_SatReference[dmgDoneArr[dmgCount].SatRefId].SourceId).Name
                                    : App.GetNpc(data.m_SatReference[dmgDoneArr[dmgCount].SatRefId].SourceId,
                                        expansion).Name) + "\",\"SpellName\":\"" +
                                App.GetSpell(data.m_SatReference[dmgDoneArr[dmgCount].SatRefId].AbilityId, expansion)
                                    .Name + "\"," +
                                "\"SpellType\":" +
                                App.GetSpell(data.m_SatReference[dmgDoneArr[dmgCount].SatRefId].AbilityId, expansion)
                                    .Type + ",\"HitType\":" + (dmgDoneArr[dmgCount].HitType % 10) +
                                ",\"Modifier\":\"negative\",\"Amount\":" + dmgDoneArr[dmgCount].Amount + "}";
                        ++dmgCount;
                        ++events;
                    }
                    else if ((dmgCount + 1 >= dmgDoneArr.Length && healCount + 1 >= healingArr.Length) || lastEvent == events)
                    {
                        break;
                    }
                    else
                    {
                        lastEvent = events;
                    }
                    ++hardBreak;
                }

                // TODO: Shields
                // Once I figured out how to assign people to the shields
                // TODO: Dispells
                // TODO: Maybe calculate how much health in percent the target had :/ ?

                json += "],\"Icon\":\"inv_misc_bone_skull_02\"}";
            }
            else if (mode == "Aura uptime" || mode.ToLower().Contains("aura"))
            {
                var query = RaidViewerUtility.GetQuery("Aura uptime", data, start, end, charid, tarid, cat, atmt, expansion)
                    .Where(x => x.SourceId == charid && x.AbilityId == id).OrderByDescending(x => x.Amount).Take(15)
                    .ToArray();

                string icon = App.m_Icons[App.GetSpell(id, expansion).Icon];
                if (id == 47490) // ?! o.O
                    icon = "inv_sword_39";
                if (id == 0)
                    return "{\"Error\":\"Error retrieving information\"}";

                json += ",\"RowType\":5,\"Entries\":[";
                var count = 0;
                foreach (var qData in query)
                {
                    if (count != 0) json += ",";
                    json += "{\"Gained\":" + (data.m_Start + qData.Amount) + ",\"Faded\":" +
                            (data.m_Start + qData.Amount + qData.TimeStamp) + ",\"Duration\":" + qData.TimeStamp + "}"; // Faded = Gained + Duration
                    ++count;
                }

                json += "],\"Icon\":\"" + icon + "\"}";
            }
            else
            {
                json = "{\"Error\":\"Error retrieving information\"}";
            }
            data.mTooltipCache.TryAdd(key, json);
            return json;
        }
    }
}