using System;
using RPLL;

public partial class Contribute_Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // ADD LOGIN PARAMETER!
        if (Utility.GetQueryString(Request, "config", "0") != "0")
        {
            var uname = Utility.GetCookie(Request, "RPLL_username", "");
            string text = "PATH=;UID=";
            if (uname == "" || Utility.GetCookie(Request, "RPLL_user", "") == "")
                return;

            var cmd = App.GetDB(0).CreateCommand();
            cmd.CommandText = "SELECT id FROM gn_user WHERE uhash=?";
            cmd.Parameters.AddWithValue("@uhash", Utility.SecureInput(Utility.GetCookie(Request, "RPLL_user", "")));
            var dr = cmd.ExecuteReaderRpll();
            if (!dr.HasRows)
            {
                dr.CloseRpll();
                return;
            }
            if (!dr.Read())
            {
                dr.CloseRpll();
                return;
            }

            var id = dr.GetInt32(0);
            dr.CloseRpll();

            text += id.ToString("X") + ";";

            Response.Clear();
            Response.ClearHeaders();

            Response.AddHeader("Content-Length", text.Length.ToString());
            Response.ContentType = "text/plain";
            Response.AppendHeader("content-disposition", "attachment;filename=\"config.txt\"");

            Response.Write(text);
            Response.End();
            return;
        }

        this.Title = "LegacyPlayers | Contribute";
    }
}