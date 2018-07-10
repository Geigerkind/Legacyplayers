<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Armory_Guild_Default" %>
<%@ Import Namespace="RPLL" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/guild.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <div><a href="/">Home</a> / Armory / Guild / </div><div class="sp" style="margin: 5px 0 0 5px;background-image:url(/Assets/raids/fac<%=m_Me.Faction+"."+Utility.GetImageType(Request, "png") %>)"><div class="tf<%=m_Me.Faction %>"><%=m_Me.Name %></div></div>
        <div id="achievements" style="background-image:url(/Assets/armory/achiev.<%=Utility.GetImageType(Request, "png") %>)">0</div>
    </div>
    <div id="left-container" class="bgbox">
        <table id="recentraids" class="table noborder bbdesign">
            <thead>
                <tr>
                    <td>Recent Raids</td>
                    <td><a href="/Raids/?name=<%=m_Me.Name %>&exp=<%=expansion.ToString() %>">Full List</a></td>
                </tr>
            </thead>
            <tbody>
                <%=m_RecentRaids.ToString() %>
            </tbody>
        </table>
        <table class="table noborder bbdesign">
            <thead>
                <tr>
                    <td colspan="2">Progress</td>
                </tr>
            </thead>
            <tbody>
                <%=m_ProgressTable.ToString() %>
            </tbody>
        </table>
        <table class="table noborder bbdesign">
            <thead>
                <tr>
                    <td colspan="2">Raid Schedule</td>
                </tr>
            </thead>
            <tbody>
                <%=m_ScheduleTable.ToString() %>
            </tbody>
        </table>
    </div>
    <div id="middle-container" class="bgbox">
        <table id="tableNavBar" class="table noborder bbdesign">
            <thead>
                <tr>
                    <td <%=((Utility.GetCookie(Request, "Guild_Table", "0") == "0") ? "class=\"selected\" " : "") %>onclick="setCookie('Guild_Table', '0', 30); location.reload();">View Member</td>
                    <td <%=((Utility.GetCookie(Request, "Guild_Table", "0") == "1") ? "class=\"selected\" " : "") %> onclick="setCookie('Guild_Table', '1', 30); location.reload();">View Top Ranked</td>
                    <td <%=((Utility.GetCookie(Request, "Guild_Table", "0") == "2") ? "class=\"selected\" " : "") %> onclick="setCookie('Guild_Table', '2', 30); location.reload();">View Latest Changes</td>
                </tr>
            </thead>
        </table>
        <%=m_Table.ToString() %>
        <div id="tableiterator">
            <a href="?page=0&guildid=<%=m_GuildID %>"><div class="cButton">First</div></a>
            <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>&guildid=<%=m_GuildID %>"><div class="cButton">Previous</div></a>
            <%=m_PageBar.ToString() %>
            <a href="?page=<%=((m_CurPage<0) ? 0 : m_CurPage+1) %>&guildid=<%=m_GuildID %>"><div class="cButton" style="margin-right: 0;">Next</div></a>
        </div>
    </div>
    <div id="right-container" class="bgbox">
        <!-- Guild -->
        <%=mAds %>

        <table class="table noborder bbdesign">
            <thead>
                <tr>
                    <td colspan="2">Itemhistory</td>
                </tr>
            </thead>
            <tbody>
                <%=m_ItemHistoryTable.ToString() %>
                
            </tbody>
        </table>
    </div>
</asp:Content>

