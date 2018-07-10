using System;
using RPLL;

public partial class API : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        int type = 99;
        int[] args = new int[10] {0,0,0,0,0,0,0,0,0,0};
        string[] strArgs = new String[3] {"", "", ""};

        if (!int.TryParse(Utility.GetQueryString(Request, "type", "99"), out type))
            return;

        for (int i = 0; i < 10; ++i)
        {
            if (!int.TryParse(Utility.GetQueryString(Request, "Arg"+(i+1), "99"), out args[i]))
                return;
        }

        for (int i = 0; i < 3; ++i)
        {
            strArgs[i] = Utility.SecureInput(Utility.GetQueryString(Request, "StrArg" + (i + 1), ""));
        }

        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(RestAPI.Get(type, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], strArgs[0], strArgs[1], strArgs[2]));
        Response.End();
    }
}