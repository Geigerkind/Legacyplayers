<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Armory_GuildList_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/guildlist.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Armory / Guild List / <%=m_Realm %>
    </div>
    <form runat="server" style="float:left">
        <label><div class="foolLH">T</div><select runat="server" id="pmRealm"></select></label>
        <label><div class="foolLH">T</div><select runat="server" id="pmFaction"></select></label>
        <label><div class="foolLH">T</div><input type="submit" value="Filter" style="width: 118px;" /></label>
    </form>
    <div style="float: left; margin-left: 5.5px; margin-bottom: 5px;">
        <a href="?page=0"><div class="cButton">First</div></a>
        <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>"><div class="cButton">Previous</div></a>
        <div class="cButton">Page <%=m_CurPage %></div>
        <a href="?page=<%=((m_CurPage<0) ? 0 : m_CurPage+1) %>"><div class="cButton">Next</div></a>
    </div>
    <table class="table noborder bbdesign">
        <thead>
            <tr>
                <td>#Nr</td>
                <td>Guild</td>
                <td>Progress</td>
                <td>#Member</td>
                <td>#60</td>
                <td>Total HKs</td>
                <td>Average HKs</td>
                <td>Achievements</td>
            </tr>
        </thead>
        <tbody>
            <%=m_Table.ToString() %>
        </tbody>
    </table>
</asp:Content>

