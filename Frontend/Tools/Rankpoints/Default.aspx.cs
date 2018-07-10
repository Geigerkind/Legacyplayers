using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Tools_Rankpoints_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    public StringBuilder m_Chart = new StringBuilder();
    public string defaultState = "none";

    private double rpw = 0;
    private double srp = 0;
    private Dictionary<int, double> rparr = new Dictionary<int, double>();

    private double CalculateRp(int week)
    {
        int lastWeek = week - 1;
        double rp = srp;
        if (rparr.ContainsKey(lastWeek)) return Math.Ceiling(rparr[lastWeek] - rparr[lastWeek] * 0.2 + rpw);
        for (int i = 0; i <= lastWeek; ++i)
            rp = rp - rp * 0.2 + rpw;
        rparr[lastWeek] = rp;
        return Math.Ceiling(rparr[lastWeek]-rparr[lastWeek]*0.2+rpw);
    }

    private double CalcProg(int week)
    {
        if (week == 0)
            return Math.Ceiling(srp - srp * 0.2 + rpw) - srp;
        return Math.Ceiling(CalculateRp(week)-CalculateRp(week-1));
    }

    private string CalculateProgress(int week)
    {
        return Math.Round(100 * (CalcProg(week) / 5000.0), 1).ToString();
    }

    private string CalculateTotalProgress(int week)
    {
        return Math.Round(100 * (CalcProg(week) / 60000.0), 1).ToString();
    }

    private string CalculateRank(double rp)
    {
        return Math.Floor((rp/5000.0)+1).ToString(); // Floor or ceil?
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        this.Title = "Legacy Players | Rankpoints Calculator";

        if (!IsPostBack)
            return;
        defaultState = "block";

        double.TryParse(rppw.Value, out rpw);
        double.TryParse(ccrp.Value, out srp);

        if (rpw > 15000)
            rpw = 15000;
        if (rpw < 0)
            rpw = 0;
        if (srp < 0)
            srp = 0;
        if (srp > 65000)
            srp = 65000;

        m_Chart.Append(CalculateRp(0));
        for (int i = 0; i < 10; ++i)
        {
            var rp = CalculateRp(i);
            m_Table.Append("<tr>");
            m_Table.Append("<td>"+(i+1)+"</td>");
            m_Table.Append("<td>"+CalculateRank(rp)+"</td>");
            m_Table.Append("<td>"+rp+"</td>");
            m_Table.Append("<td>"+CalcProg(i)+"</td>");
            m_Table.Append("<td>" + CalculateProgress(i) + "%</td>");
            m_Table.Append("<td>" + CalculateTotalProgress(i) + "%</td>");
            m_Table.Append("</tr>");
            if (i>0)
                m_Chart.Append(","+rp);
        }
    }
}