using System;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Net.Mail;
using DevOne.Security.Cryptography.BCrypt;
using RPLL;

public partial class Forgot_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        this.Title = "LegacyPlayers | Forgot Password";

        string token = Utility.GetQueryString(Request, "token", "");
        if (!string.IsNullOrEmpty(token))
        {
            byte[] buffer = Base32.Decode(token);
            token = System.Text.Encoding.UTF8.GetString(buffer, 0, buffer.Length);
            var tempDB = App.GetDB();
            MySqlDataReader der = tempDB.Query("SELECT id, name, mail FROM gn_user WHERE requestForgot = 1").ExecuteReaderRpll();
            while (der.Read())
            {
                int id = der.GetInt32(0);
                if (token == BCryptHelper.HashPassword(id.ToString(), "obscurred"))
                {
                    string newPass = Utility.RandomString(12);
                    string username = der.GetString(1);
                    string from = "shino@legacyplayers.com";
                    MailMessage message = new MailMessage(from, der.GetString(2));
                    der.CloseRpll();
                    message.Subject = "Legacyplayers forgot password";
                    message.Body =
                        @"Hey "+username+"!\nThis is your new password: "+newPass+" \nPlease change it in the account panel.";
                    SmtpClient client = new SmtpClient("smtp.legacyplayers.com"); 
                    client.Send(message);

                    newPass = BCryptHelper.HashPassword(newPass, "obscurred");
                    // Setting flag in DB
                    SQLWrapper dbb = App.GetDB();
                    dbb.Query("UPDATE gn_user SET requestforgot=0, pass=\""+ newPass + "\", uhash=\""+ Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(username+newPass, "obscurred"))) + "\" WHERE id=" + id).ExecuteNonQuery();
                    // Updating user data
                    App.m_User[id].uHash =
                        Base32.Encode(System.Text.Encoding.UTF8.GetBytes(
                            BCryptHelper.HashPassword(username + newPass, "obscurred")));
                    //dbb.Kill();
                    (this.Master as RPLL.MasterPage).setNotifaction("Your new password has been send to your mail account!", 3);
                    return;
                }
            }
            der.CloseRpll();
            return;
        }

        if (!IsPostBack)
            return;

        pmMail.Value = Utility.SecureInput(pmMail.Value);

        if (!pmMail.Value.Contains("@") || !pmMail.Value.Contains("."))
            return;

        SQLWrapper db = App.GetDB();
        var exists = db.CreateCommand();
        exists.CommandText = "SELECT id FROM gn_user WHERE mail=?";
        exists.Parameters.AddWithValue("@mail", pmMail.Value);
        MySqlDataReader dr = exists.ExecuteReaderRpll();
        if (!dr.HasRows)
        {
            dr.CloseRpll();
            (this.Master as RPLL.MasterPage).setNotifaction("A mail has been send to " + pmMail.Value + "!", 3);
            return;
        }
        if (dr.Read())
        {
            var id = dr.GetInt32(0);
            dr.CloseRpll();
            Utility.SendMail("shino@legacyplayers.com", pmMail.Value, "Legacyplayers forgot password utility",
                "Hey there! <br />You need to verify your identity before we can reset your password. <br />To do so, please click this link. <br />Link: https://legacyplayers.com/Account/Forgot/?token=" +
                Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(id.ToString(),
                    "obscurred")))+" <br />cheers!");

            // Setting flag in DB
            // TODO: Add DB support
            db.Query("UPDATE gn_user SET requestforgot=1 WHERE id=" + id).ExecuteNonQuery();
            //db.Kill();
            (this.Master as RPLL.MasterPage).setNotifaction("A mail has been send to "+pmMail.Value+"!", 3);
        }
        
    }
}