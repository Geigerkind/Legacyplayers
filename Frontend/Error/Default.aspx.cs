using System;
using System.Net;

namespace RPLL
{
    public partial class Error_Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            this.Title = "LegacyPlayers | Error";

            if (ErrorHandler.MError == null || ErrorHandler.MError.Message == "NONE")
                return;

            ErrorHandler.Execute();
        }
    }
}