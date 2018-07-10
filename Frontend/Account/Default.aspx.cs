using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Mail;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Text;
using DevOne.Security.Cryptography.BCrypt;
using RPLL;

public partial class Account_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();

    public int m_UID = 0;
    public short m_Mode = 0;

    public string m_Name = "";
    private uint m_Patreon = 0;
    private uint m_Registerd = 0;
    private string m_Mail = "";
    public short m_Level = 0;
    private string m_Pass = "";
    private bool m_Private = false;
    private bool m_Ads = false;

    private static readonly string[] m_Levels = new string[7]
    {
        "Basic",
        "Bronze",
        "Silver",
        "Gold",
        "Platin",
        "Titan",
        "Admin"
    };

    protected void Page_Load(object sender, EventArgs e)
    {
        this.Title = "LegacyPlayers | Account";

        if (Utility.GetQueryString(Request, "logout", "0") != "0")
        {
            Utility.SetCookie(Response, Request, "RPLL_username", "");
            Utility.SetCookie(Response, Request, "RPLL_user", "");
            Response.Redirect("/");
            return;
        }

        if (Utility.GetQueryString(Request, "verify", "0") != "0")
        {
            SQLWrapper DB = App.GetDB();
            string token = Utility.GetQueryString(Request, "verify", "0");
            byte[] buffer = Base32.Decode(token);
            token = System.Text.Encoding.UTF8.GetString(buffer, 0, buffer.Length);
            MySqlDataReader der = DB.Query("SELECT name, id, pass FROM gn_user WHERE accepted = 0").ExecuteReaderRpll();
            int id = 0;
            while (der.Read())
            {
                if (BCryptHelper.HashPassword(der.GetString(0), "obscurred") ==
                    token)
                {
                    id = der.GetInt32(1);
                    Utility.SetCookie(Response, Request, "RPLL_username", der.GetString(0));
                    Utility.SetCookie(Response, Request, "RPLL_user", Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(der.GetString(0) + der.GetString(2), "obscurred"))));
                    break;
                }
            }
            der.CloseRpll();
            if (id > 0)
            {

                DB.Query("UPDATE gn_user SET accepted = 1 WHERE id = " + id).ExecuteNonQuery();
                //DB.Kill();
                Response.Redirect("/Account/?uid=" + id);
                return;
            }
            Response.Redirect("/404/");
            return;
        }

        if (Utility.GetQueryString(Request, "verifyMail", "0") != "0")
        {
            SQLWrapper DB = App.GetDB();
            string token = Utility.GetQueryString(Request, "verifyMail", "0");
            byte[] buffer = Base32.Decode(token);
            token = System.Text.Encoding.UTF8.GetString(buffer, 0, buffer.Length);
            MySqlDataReader der = DB.Query("SELECT name, mail, id FROM gn_user WHERE requestmail = 1").ExecuteReaderRpll();
            int id = 0;
            while (der.Read())
            {
                if (BCryptHelper.HashPassword(der.GetString(0)+der.GetString(1), "obscurred") ==
                    token)
                {
                    id = der.GetInt32(2);
                    break;
                }
            }
            der.CloseRpll();
            if (id > 0)
            {
                DB.Query("UPDATE gn_user SET requestmail = 0, mail=requestedmail WHERE id = " + id).ExecuteNonQuery();
                //DB.Kill();
                Response.Redirect("/Account/?uid=" + id);
                return;
            }
            Response.Redirect("/404/");
            return;
        }

        if (!int.TryParse(Utility.GetQueryString(Request, "uid", "0"), out m_UID) || m_UID == 0)
        {
            Response.Redirect("/404/");
            return;
        }

        if (!short.TryParse(Utility.GetQueryString(Request, "mode", "0"), out m_Mode))
        {
            Response.Redirect("/404/");
            return;
        }
        

        SQLWrapper db = App.GetDB();
        MySqlDataReader dr = db.Query("SELECT name, patreon, registerd, mail, level, pass, disableads, defaultpriv FROM gn_user WHERE id="+m_UID).ExecuteReaderRpll();
        if (!dr.HasRows)
        {
            dr.CloseRpll();
            Response.Redirect("/404/");
            return;
        }
        dr.Read();
        m_Name = dr.GetString(0);
        m_Patreon = (uint) dr.GetInt64(1);
        m_Registerd = (uint) dr.GetInt64(2);
        m_Mail = dr.GetString(3);
        m_Level = dr.GetInt16(4);
        m_Pass = dr.GetString(5);
        m_Ads = dr.GetInt16(6) == 1;
        m_Private = dr.GetInt16(7) == 1;
        dr.CloseRpll();
        
        if (Utility.GetCookie(Request, "RPLL_user", "") != Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(m_Name+m_Pass, "obscurred"))))
        {
            Response.Redirect("/404/");
            return;
        }
        
        if (m_Mode == 1 && m_Level < 1) m_Mode = 0;
        if (m_Mode == 4 && m_Level < 6) m_Mode = 0;
        switch (m_Mode)
        {
            case 1:
                if (Request["ads"] != null)
                {
                    db.Query("UPDATE gn_user SET disableads = " + (Request["ads"] == "Disable advertisements" ? "1" : "0") + " WHERE id = " + m_UID + ";").ExecuteNonQuery();
                    m_Ads = Request["ads"] == "Disable advertisements";
                }
                m_Table.Append("<form action=\"\" method=\"post\"><input type=\"submit\" value=\"" + (!m_Ads ? "Disable advertisements" : "Enable advertisements") + "\" name=\"ads\" style=\"width: 200px\" /></form>");
                break;
            case 2:
                if (IsPostBack)
                {
                    string pass = Utility.SecureInput(pmPass.Value);
                    string passCon = Utility.SecureInput(pmPassCon.Value);
                    string oldPass = Utility.SecureInput(pmOldPass.Value);

                    if (pass == "" || passCon == "" || oldPass == "")
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Input is empty!", 2);
                        return;
                    }

                    if (pass != pmPass.Value
                        || passCon != pmPassCon.Value
                        || oldPass != pmOldPass.Value
                    )
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Invalid characters!", 2);
                        return;
                    }

                    if (pmPass.Value != pmPassCon.Value)
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Passwords do not match!", 2);
                        return;
                    }

                    if (BCryptHelper.HashPassword(oldPass, "obscurred") != m_Pass)
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Password incorrect!", 1);
                        return;
                    }

                    string newPass = BCryptHelper.HashPassword(pmPass.Value, "obscurred");
                    db.Query("UPDATE gn_user SET pass = \""+ newPass + "\", uhash=\""+ Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(m_Name+newPass, "obscurred"))) + "\" WHERE id=" + m_UID).ExecuteNonQuery();
                    //db.Kill();
                    (this.Master as RPLL.MasterPage).setNotifaction("Password has been changed! Make sure to redownload the config.txt!", 3);
                }
                break;
            case 3:
                if (IsPostBack)
                {
                    string mail = Utility.SecureInput(pmMail.Value);
                    string mailCon = Utility.SecureInput(pmMailCon.Value);
                    string oldPass = Utility.SecureInput(pmPassMail.Value);

                    if (mail == "" || mailCon == "" || oldPass == "")
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Input is empty!", 2);
                        return;
                    }

                    if (mail != pmMail.Value
                        || mailCon != pmMailCon.Value
                        || oldPass != pmPassMail.Value
                    )
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Invalid characters!", 2);
                        return;
                    }

                    if (mail != mailCon)
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Mails do not match!", 2);
                        return;
                    }

                    if (BCryptHelper.HashPassword(pmPassMail.Value, "obscurred") != m_Pass)
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Password incorrect!", 1);
                        return;
                    }

                    if (!mail.Contains("@") || !mail.Contains("."))
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Invalid mail format!", 2);
                        return;
                    }

                    try
                    {
                        Utility.SendMail("shino@legacyplayers.com", m_Mail, "Legacyplayers account mail verification",
                            "Hey there! <br />In order to verify your identity, you need to click on this link. Once this is done, your mail is changed. <br />Link: https://legacyplayers.com/Account/?verifyMail=" +
                            Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(m_Name + m_Mail,
                                "obscurred"))) + " <br />cheers!");
                    }
                    catch (Exception ex)
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Error sending the mail: "+ex.Message, 1);
                        break;
                    }

                    var cmd = db.CreateCommand();
                    cmd.CommandText = "UPDATE gn_user SET requestmail=1, requestedmail=? WHERE id=" + m_UID;
                    cmd.Parameters.AddWithValue("@requestedmail", mail);
                    cmd.ExecuteNonQuery();
                    //db.Kill();

                    (this.Master as RPLL.MasterPage).setNotifaction("Please verfiy it at your old mail!", 3);
                }
                break;
            case 4:
                m_Table.Append("<table class=\"table noborder bbdesign\"><tbody>");
                dr = db.Query("SELECT name, mail, timestamp, subject, content FROM gn_contact ORDER BY id DESC").ExecuteReaderRpll();
                while(dr.Read())
                    m_Table.Append("<tr><td>"+dr.GetString(0)+"</td><td>"+dr.GetString(1)+"</td><td>"+ DateTimeOffset.FromUnixTimeSeconds(dr.GetInt64(2)).UtcDateTime + "</td></tr>" +
                                    "<tr><td colspan=\"3\">"+dr.GetString(3)+"</td></tr>" +
                                    "<tr><td colspan=\"3\">"+dr.GetString(4)+"</td></tr>" +
                                    "<tr><td colspan=\"3\"></td></tr>");

                m_Table.Append("</tbody></table>");
                dr.CloseRpll();
                break;
            case 5:
                if (IsPostBack)
                {
                    string name = Utility.SecureInput(pmUsername.Value);
                    string nameOld = Utility.SecureInput(pmUsernameOld.Value);
                    string oldPass = Utility.SecureInput(pmOldPassUN.Value);

                    if (name == "" || nameOld == "" || oldPass == "")
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Input is empty!", 2);
                        return;
                    }

                    if (name != pmUsername.Value
                        || nameOld != pmUsernameOld.Value
                        || oldPass != pmOldPassUN.Value
                        || nameOld != m_Name
                    )
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Invalid characters!", 2);
                        return;
                    }

                    if (BCryptHelper.HashPassword(oldPass, "obscurred") != m_Pass)
                    {
                        (this.Master as RPLL.MasterPage).setNotifaction("Password incorrect!", 1);
                        return;
                    }

                    string newPass = BCryptHelper.HashPassword(pmPass.Value, "obscurred");
                    db.Query("UPDATE gn_user SET name = \"" + name + "\", uhash=\"" + Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(name + m_Pass, "obscurred"))) + "\" WHERE id=" + m_UID).ExecuteNonQuery();
                    //db.Kill();
                    if (App.m_User.ContainsKey(m_UID))
                        App.m_User[m_UID].Name = name;
                    (this.Master as RPLL.MasterPage).setNotifaction("Username has been changed! Make sure to redownload the config.txt!", 3);
                }
                break;
            case 6:
                m_Table.Append("<table class=\"table noborder bbdesign\"><thead>" +
                               "<tr>" +
                               "<th>Time</th>" +
                               "<th>Type</th>" +
                               "<th>Link</th>" +
                               "</tr>" +
                               "</thead><tbody>");
                dr = db.Query(
                        "SELECT * FROM (SELECT a.timestamp, IFNULL(c.instanceid, IFNULL(IF(d.uploaderid > 0, 1, 0), 0)), IFNULL(c.id, 0), IFNULL(b.id, 0), (0) AS EXPANSION, a.userid FROM RPLL_VANILLA.gn_uploader a LEFT JOIN RPLL_VANILLA.rs_instance_uploader b ON a.id = b.uploaderid LEFT JOIN RPLL_VANILLA.rs_instances c ON b.instanceid = c.id LEFT JOIN RPLL_VANILLA.rs_progress d ON d.uploaderid = a.id UNION ALL SELECT a.timestamp, IFNULL(c.instanceid, IFNULL(IF(d.uploaderid > 0, 1, 0), 0)), IFNULL(c.id, 0), IFNULL(b.id, 0), (1) AS EXPANSION, a.userid FROM RPLL_TBC.gn_uploader a LEFT JOIN RPLL_TBC.rs_instance_uploader b ON a.id = b.uploaderid LEFT JOIN RPLL_TBC.rs_instances c ON b.instanceid = c.id LEFT JOIN RPLL_TBC.rs_progress d ON d.uploaderid = a.id) qq WHERE qq.userid = "+m_UID+" ORDER BY qq.timestamp DESC LIMIT 50")
                    .ExecuteReaderRpll();
                while (dr.Read())
                {
                    m_Table.Append("<tr>" +
                                   "<td>"+DateTimeOffset.FromUnixTimeMilliseconds(dr.GetInt64(0)).UtcDateTime.ToString()+" ("+dr.GetInt64(0)+")</td>" +
                                   "<td>"+(dr.GetInt16(1) == 0 ? "Dismissed or Armory only" : (dr.GetInt16(1) == 1) ? "Processing" : App.m_Instances[dr.GetInt16(1)].Name)+"</td>" +
                                   "<td>"+ (dr.GetInt32(2) == 0 ? "None" : "<a href=\"/Raids/Viewer/?id="+dr.GetInt32(2)+"&upl="+dr.GetInt32(3)+"&exp="+dr.GetInt16(4)+"\">click</a>")+"</td>" +
                                   "</tr>");
                }
                dr.CloseRpll();
                m_Table.Append("</tbody></table>");
                break;
            case 7:
                if (Request["default"] != null)
                {
                    db.Query("UPDATE gn_user SET defaultpriv = "+ (Request["default"] == "Make private" ? "1" : "0") +" WHERE id = " + m_UID + ";").ExecuteNonQuery();
                    m_Private = Request["default"] == "Make private";
                }
                foreach (string key in Request.Form)
                {
                    if (key == "default") break;
                    var value = Request[key];
                    if (value != null)
                    {
                        var token = key.Split(',');
                        int exp = int.Parse(token[1]);
                        int upid = int.Parse(token[2]);
                        bool result = value == "Make private";
                        KeyValuePair<int, bool> srch = new KeyValuePair<int, bool>(upid, !result);

                        var inst = App.mRSInstances[exp].Where(x => x.mPrivate.Contains(srch)).First();

                        int index = 0;
                        foreach (var upl in inst.mPrivate)
                        {
                            if (upl.Key == srch.Key && upl.Value == srch.Value)
                                break;
                            ++index;
                        }

                        inst.mPrivate[index] = new KeyValuePair<int, bool>(upid, result);

                        db.Query("UPDATE "+ (exp == 0 ? "RPLL_VANILLA" : "RPLL_TBC") +".rs_instance_uploader SET private = "+ (result ? "1" : "0") +" WHERE id = "+ upid +";").ExecuteNonQuery();
                        break;
                    }
                }

                m_Table.Append("<form action=\"\" method=\"post\">");
                // Private logs
                dr = db.Query("SELECT * FROM (SELECT a.id, a.instanceid as inida, (0) as exp, c.instanceid as inidb, c.end, a.private FROM RPLL_VANILLA.rs_instance_uploader a JOIN RPLL_VANILLA.gn_uploader b ON a.uploaderid = b.id JOIN RPLL_VANILLA.rs_instances c ON a.instanceid = c.id WHERE b.userid = " + m_UID +
                              " UNION ALL " +
                              "SELECT d.id, d.instanceid as inidc, (1) as exp, f.instanceid as inidd, f.end, d.private FROM RPLL_TBC.rs_instance_uploader d JOIN RPLL_TBC.gn_uploader e ON d.uploaderid = e.id JOIN RPLL_TBC.rs_instances f ON d.instanceid = f.id WHERE e.userid = " + m_UID+") a ORDER BY a.end DESC").ExecuteReaderRpll();
                m_Table.Append("Default: <input type=\"submit\" value=\""+ (!m_Private ? "Make private" : "Make public") +"\" name=\"default\" /><br /><br />");
                m_Table.Append("<table class=\"table noborder bbdesign\" id=\"privateLogs\">" +
                               "<thead><tr><td>ID</td><td>Instance</td><td>Date</td><td>Toggle</td></tr></thead>" +
                               "<tbody>");

                while (dr.Read())
                    m_Table.Append("<tr><td><a href=\"/Raids/Viewer/?id=" + dr.GetInt32(0) + "&upl=" + dr.GetInt32(1) + "&exp="+dr.GetInt16(2)+"\">" + dr.GetInt32(0)+"</a></td><td>"+ App.m_Instances[dr.GetInt16(3)].Name+"</td><td>"+ DateTimeOffset.FromUnixTimeMilliseconds(dr.GetInt64(4)).UtcDateTime
                                       .ToString(CultureInfo.CurrentCulture)+"</td><td><input type=\"submit\" name=\"t,"+ dr.GetInt32(2) + "," + dr.GetInt32(0) +"\" value=\""+ (dr.GetInt16(5) == 0 ? "Make private" : "Make public") +"\" /></td></tr>");

                m_Table.Append("</tbody></table>");
                m_Table.Append("</form>");
                dr.CloseRpll();
                break;
            case 8:
                // Poll participation
                foreach (string key in Request.Form)
                {
                    var value = Request[key];
                    if (value == null) continue;

                    var token = key.Split(',');
                    int id = int.Parse(token[1]);

                    db.Query("UPDATE gn_user SET pollselection = " + id + " WHERE id=" + m_UID + ";").ExecuteNonQuery();
                    break;
                }

                // Potentially slow
                dr = db.Query("SELECT item, (SELECT COUNT(*) FROM gn_user WHERE pollselection = a.id) AS votes, id FROM gn_poll a").ExecuteReaderRpll();
                m_Table.Append("<form action=\"\" method=\"post\">" +
                               "<h1 style=\"margin-top: 0;\">What should I focus on next?</h1>" +
                               "<table class=\"table noborder bbdesign\" id=\"poll\">" +
                               "<thead><tr><td>Question</td><td>Votes</td><td></td></tr></thead>" +
                               "<tbody>");
                while (dr.Read())
                    m_Table.Append("<tr>" +
                               "<td>"+ dr.GetString(0) +"</td>" +
                               "<td>"+ dr.GetInt32(1) +"</td>" +
                               "<td><input type=\"submit\" name=\"t,"+dr.GetInt32(2)+"\" value=\"Vote\" /></td>" +
                               "</tr>");
                m_Table.Append("</tbody>" +
                               "</table></form>");
                dr.CloseRpll();
                break;
            default:
                m_Table.Append(
                    "<table class=\"noborder\" style=\"font-size: 18px;\"><tbody>" +
                    "<tr><td>Name:</td><td>"+m_Name+"</td></tr> " +
                    "<tr><td>E-Mail:</td><td>"+m_Mail+"</td></tr>" +
                    "<tr><td>Level:</td><td>"+m_Levels[m_Level]+"</td></tr>" +
                    "<tr><td>Registered:</td><td>Since " + DateTimeOffset.FromUnixTimeSeconds(m_Registerd).UtcDateTime + "</td></tr>" +
                    ((m_Patreon > 0) ? "<tr><td>Patreon:</td><td>Since " +DateTimeOffset.FromUnixTimeSeconds(m_Patreon).UtcDateTime+"</td></tr>" : "<tr><td>Patreon:</td><td><a href=\"https://www.patreon.com/legacyplayers\">Become one now</a></td></tr>") +
                    "<tr><td>Launcher-UID:</td><td>"+ m_UID.ToString("X") + "</td></tr>" +
                    "<tr><td><a href=\"?logout=true\">Log Out</a></td><td></td></tr>" +
                    "</tbody></table>");
                break;
        }

    }
}