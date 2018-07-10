using System;
using System.Linq;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;
using System.Net.Mail;
using DevOne.Security.Cryptography.BCrypt;
using RPLL;

public partial class SignUp_Default : System.Web.UI.Page
{

    protected void Page_Load(object sender, EventArgs e)
    {
        this.Title = "LegacyPlayers | Sign Up";
        
        if (!IsPostBack) return;
        try
        {
            string Username = Utility.SecureInput(pmName.Value);
            string Password = Utility.SecureInput(pmPass.Value);
            string PasswordCon = Utility.SecureInput(pmPassCon.Value);
            string Mail = Utility.SecureInput(pmMail.Value);
            string MailCon = Utility.SecureInput(pmMailCon.Value);

            if (Username != pmName.Value
                || Password != pmPass.Value
                || PasswordCon != pmPassCon.Value
                || Mail != pmMail.Value
                || MailCon != pmMailCon.Value
            )
            {
                (this.Master as RPLL.MasterPage).setNotifaction("Invalid input!", 2);
                return;
            }

            if (Password != PasswordCon)
            {
                (this.Master as RPLL.MasterPage).setNotifaction("Passwords do not match!", 1);
                return;
            }

            if (Mail != MailCon)
            {
                (this.Master as RPLL.MasterPage).setNotifaction("Mails do not match!", 1);
                return;
            }

            if (!Mail.Contains("@") || !Mail.Contains("."))
            {
                (this.Master as RPLL.MasterPage).setNotifaction("Invalid email format!", 1);
                return;
            }

            if (Username.Length > 51)
            {
                (this.Master as RPLL.MasterPage).setNotifaction("Username is too long!", 2);
                return;
            }

            if (Mail.Length > 120)
            {
                (this.Master as RPLL.MasterPage).setNotifaction("Mail is too long!", 2);
                return;
            }

            var encodedResponse = Request.Form["g-recaptcha-response"];
            var isCaptchaValid = ReCaptcha.Validate(encodedResponse);
            if (!isCaptchaValid)
            {
                (this.Master as RPLL.MasterPage).setNotifaction("Invalid capture!", 2);
                return;
            }

            Password = BCryptHelper.HashPassword(Password,
                "obscurred");
            SQLWrapper db = App.GetDB();

            var exists = db.CreateCommand();
            exists.CommandText = "SELECT id FROM gn_user WHERE LOWER(name)=? OR LOWER(mail)=?";
            exists.Parameters.AddWithValue("@name", Username.ToLower());
            exists.Parameters.AddWithValue("@mail", Mail.ToLower());
            MySqlDataReader dr = exists.ExecuteReaderRpll();
            if (dr.HasRows)
            {
                dr.CloseRpll();
                (this.Master as RPLL.MasterPage).setNotifaction("Username or Mail is already in use!", 2);
                return;
            }
            dr.CloseRpll();

            Utility.SendMail("shino@legacyplayers.com", Mail, "Legacyplayers account verification",
                "Hello there! <br /> In order to verify your account now, you are required to click this link. <br /> You will be automatically redirected to your accountpanel then! <br /> Link: https://legacyplayers.com/Account/?verify=" +
                Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(Username, "obscurred"))) + "<br /> cheers!");

            var cmd = db.CreateCommand();
            cmd.CommandText = "INSERT INTO gn_user (name, pass, mail, registerd, uhash) VALUES (?,?,?,UNIX_TIMESTAMP(),?)";
            cmd.Parameters.AddWithValue("@name", Username);
            cmd.Parameters.AddWithValue("@pass", Password);
            cmd.Parameters.AddWithValue("@mail", Mail);
            cmd.Parameters.AddWithValue("@uhash", Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(Username+Password,
                "obscurred"))));
            cmd.ExecuteNonQuery();
            //db.Kill();

            // Inserting user into the table
            DBUser usr = new DBUser()
            {
                Name = Username,
                Amount = 0,
                LastContribution = 0,
                Level = 0,
                Patreon = 0,
                Registerd = 0,
                uHash = Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(Username + Password,
                    "obscurred")))
            };
            App.m_User.TryAdd(App.m_User.Max(x => x.Key) + 1, usr);

            (this.Master as RPLL.MasterPage).setNotifaction("Success! A mail has been send to you!", 3);
            return;
        }
        catch (Exception ex)
        {
            (this.Master as RPLL.MasterPage).setNotifaction("Something went wrong, please try again later!\n Error: "+ex.Message, 1);
            return;
        }
    }
}