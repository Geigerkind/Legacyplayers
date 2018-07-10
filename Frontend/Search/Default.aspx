<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Search_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/search.min.css" />
    <style>.cButton{float:left !important}</style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Search
    </div>
    <div id="searchnav">
        <form runat="server" style="float: left;">
            <label><div class="foolLH">T</div><select runat="server" name="realm" id="pmRealm">
                <%=m_RealmList %>
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" name="faction" id="pmFaction">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" name="class" id="pmClass">
            </select></label>
            <label><div class="foolLH">T</div><input runat="server" type="text" name="name" id="pmName" placeholder="Enter a name" /></label>
            <label><div class="foolLH">T</div><input type="submit" value="Filter" /></label>
        </form>
        <div style="float: left;">
            <a href="?page=0"><div class="cButton">First</div></a>
            <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>"><div class="cButton">Previous</div></a>
            <div class="cButton">Page <%=m_CurPage %></div>
            <a href="?page=<%=((m_CurPage<0) ? 0 : ((m_LastPage <= m_CurPage) ? m_LastPage : m_CurPage+1)) %>"><div class="cButton">Next</div></a>
            <a href="?page=<%=m_LastPage %>"><div class="cButton">Last</div></a>
        </div>
    </div>
    <table id="guilds" class="table noborder bbdesign">
        <thead>
            <tr>
                <td colspan="2"><%=m_GuildLength %> guilds found</td>
            </tr>
        </thead>
        <tbody>
            <%=m_TableGuilds.ToString() %>
        </tbody>
    </table>
    <table id="player" class="table noborder bbdesign">
        <thead>
            <tr>
                <td colspan="4"><%=m_CharLength %> player found</td>
            </tr>
        </thead>
        <tbody>
            <%=m_TablePlayer.ToString() %>
        </tbody>
    </table>
</asp:Content>

