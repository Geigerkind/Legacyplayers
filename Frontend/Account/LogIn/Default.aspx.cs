using RPLL;
using System;
using DevOne.Security.Cryptography.BCrypt;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;

public partial class LogIn_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        this.Title = "LegacyPlayers | Log In";

        if (!IsPostBack) return;
        try
        {
            string Username = Utility.SecureInput(pmName.Value);
            string Password = Utility.SecureInput(pmPass.Value);

            if (pmName.Value != Username || Password != pmPass.Value)
            {
                (this.Master as RPLL.MasterPage).setNotifaction("The username or password may be wrong.", 2);
                return;
            }

            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password))
            {
                (this.Master as RPLL.MasterPage).setNotifaction("The username or password may be wrong.", 2);
                return;
            }
            
            Password = BCryptHelper.HashPassword(Password,
                "obscurred");
            
            SQLWrapper db = App.GetDB();
            
            var cmd = db.CreateCommand();
            cmd.CommandText = "SELECT accepted, id FROM gn_user WHERE BINARY name=? AND BINARY pass = ?";
            cmd.Parameters.AddWithValue("@name", Username);
            cmd.Parameters.AddWithValue("@pass", Password);
            MySqlDataReader dr = cmd.ExecuteReaderRpll();
            
            if (dr.Read())
            {
                if (dr.GetInt16(0) == 0)
                {
                    (this.Master as RPLL.MasterPage).setNotifaction("Please check your mail for a verification link!.", 2);
                    return;
                }
                Utility.SetCookie(Response, Request, "RPLL_username", Username);
                Utility.SetCookie(Response, Request, "RPLL_user", Base32.Encode(System.Text.Encoding.UTF8.GetBytes(BCryptHelper.HashPassword(Username+Password, "obscurred"))));

                // Redirect to account page
                int uid = dr.GetInt32(1);
                dr.CloseRpll();
                Response.Redirect("/Account/?uid="+uid); // Should we really reveal this kind of data?
                return;
            }
            dr.CloseRpll();
            // Didnt find someone!
            (this.Master as RPLL.MasterPage).setNotifaction("The username or password may be wrong.", 2);
            return;
        }
        catch (Exception)
        {
            (this.Master as RPLL.MasterPage).setNotifaction("Some error occured, please try it later again!", 1);
            return;
        }
    }
}