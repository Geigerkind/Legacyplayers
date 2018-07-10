using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Octokit;
using RPLL;

public partial class Changelog_Default : System.Web.UI.Page
{
    public StringBuilder m_Table = new StringBuilder();
    public StringBuilder m_PageBar = new StringBuilder();
    public int m_CurPage = 0;
    public int m_LastPage = 0;

    private static GitHubCommit[] m_Commits;
    private static int m_CommitCount = 0;
    private static long m_LastUpdate = 0;

    private async Task RequestCommits()
    {
        if (DateTimeOffset.Now.ToUnixTimeSeconds() - m_LastUpdate > 3600)
        {
            var tokenAuth = new Credentials("obscurred");
            var github = new GitHubClient(new ProductHeaderValue("RPLL"));
            github.Connection.Credentials = tokenAuth;
            var repo = await github.Repository.Commit.GetAll("Geigerkind", "RPLL");
            m_Commits = repo.ToArray();
            m_CommitCount = repo.Count;
            m_LastUpdate = DateTimeOffset.Now.ToUnixTimeSeconds();
        }
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        Task.Run(async () => { await RequestCommits(); }).Wait(10000);

        m_CurPage = Int32.Parse(Utility.GetQueryString(Request, "page", "0"));

        int toLeft = 0;
        if (m_CurPage >= 10)
            toLeft = m_CurPage - 10;
        for (int i = toLeft; i < toLeft + 22; ++i) // Sometimes there may not that many pages
        {
            if (i != m_CurPage)
                m_PageBar.Append("<a href=\"?page=" + i + "\"><div class=\"bbdesign placeholder\" >" + (i + 1) +
                                 "</div></a>");
            else
                m_PageBar.Append("<a href=\"?page=" + i + "\"><div class=\"bbdesign placeholder\" style=\"color:#f28f45\">" + (i + 1) +
                                 "</div></a>");
        }
        m_LastPage = m_CommitCount / 20;

        int count = m_CurPage * 20;
        for (int i = 0; i < 20; ++i)
        {
            if (count < m_CommitCount)
            {
                m_Table.Append("<tr><td class=\"tnum tsmallvalue\">" + (m_CommitCount-count) + "</td><td>"+m_Commits[count].Commit.Committer.Name+"</td>");
                m_Table.Append("<td>"+ m_Commits[count].Commit.Message+ "</td><td>"+ m_Commits[count].Commit.Committer.Date.UtcDateTime.Month + "/"+ m_Commits[count].Commit.Committer.Date.UtcDateTime.Day + "/"+ m_Commits[count].Commit.Committer.Date.UtcDateTime.Year + "</td></tr>");
            }
            ++count;
        }
        
        this.Title = "LegacyPlayers | Changelog";
    }
}