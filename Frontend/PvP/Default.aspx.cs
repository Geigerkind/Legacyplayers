using System;

public partial class PvP_Default : System.Web.UI.Page
{
    public String _PLACEHOLDER = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        for (int i = 1; i < 21; i++)
            _PLACEHOLDER += "<a href=\"\"><div class=\"bbdesign placeholder\" >" + i + "</div></a>";

        this.Title = "LegacyPlayers | Battlegrounds";

    }
}