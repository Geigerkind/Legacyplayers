using System;
//using System.Data.Odbc;
using MySql.Data.MySqlClient;

namespace RPLL
{
    public partial class Contact_Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack)
            {
                if (mail.Value.Contains("@") && mail.Value.Contains("."))
                {
                    try
                    {
                        SQLWrapper DB = App.GetDB(0);
                        MySqlCommand cmd = DB.CreateCommand();
                        cmd.CommandText = "INSERT INTO gn_contact (name, mail, subject, content) VALUES (?,?,?,?)";
                        cmd.Parameters.AddWithValue("@name", Utility.SecureInput(namebox.Value));
                        cmd.Parameters.AddWithValue("@mail", Utility.SecureInput(mail.Value));
                        cmd.Parameters.AddWithValue("@subject", Utility.SecureInput(subject.Value));
                        cmd.Parameters.AddWithValue("@content", Utility.SecureInput(text.Value));
                        cmd.ExecuteNonQuery();
                        //DB.Kill();

                        namebox.Value = "";
                        mail.Value = "";
                        subject.Value = "";
                        text.Value = "";
                        (this.Master as MasterPage).setNotifaction("Success!", 0);
                    }
                    catch (Exception)
                    {
                        (this.Master as MasterPage).setNotifaction("Some error occured, please try it later again!", 2);
                    }
                }
                else
                {
                    (this.Master as MasterPage).setNotifaction("Invalid mail adress!", 1);
                }
            }

            this.Title = "LegacyPlayers | Contact";
        }
    }
}