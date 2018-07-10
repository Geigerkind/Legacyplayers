using System;
using System.IO;
using System.Web;
using RPLL;

public partial class Upload : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        HttpPostedFile file = Request.Files["file"];
        var exp = Utility.GetQueryString(Request, "exp", "99");

        if (file != null)
        {
            string fname = Path.GetFileName(file.FileName);

            if (exp == "0")
            {
                file.SaveAs(Server.MapPath(Path.Combine("Vanilla", fname)));
                Response.Write("Vanilla Uploaded");
            }
            else if (exp == "1")
            {
                file.SaveAs(Server.MapPath(Path.Combine("TBC", fname)));
                Response.Write("TBC Uploaded");
            }
            else if (exp == "2")
            {
                file.SaveAs(Server.MapPath(Path.Combine("WOTLK", fname)));
                Response.Write("WOTLK Uploaded");
            }
        }
    }
}