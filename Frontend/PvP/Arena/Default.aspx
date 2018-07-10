<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PvP_Arena_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/arena.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / PvP / Arena / <%=(pmArena.Value == "0" ? "2v2" : (pmArena.Value == "1") ? "3v3" : "5v5") %>
    </div>
    <div id="ra-navbar">
        <form runat="server">
            <label><div class="foolLH">T</div><select runat="server" id="pmArena">
                <option value="0">2 vs 2</option>
                <option value="1">3 vs 3</option>
                <option value="2">5 vs 5</option>
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmFaction">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmRealm">
            </select></label>
            <label><div class="foolLH">T</div><input type="submit" value="Filter" /></label>
        </form>
        <a href="/PvP/Arena/?page=0"><div class="cButton">First</div></a>
        <a href="/PvP/Arena/?page=<%=(m_Curpage == 0 ? 0 : m_Curpage-1) %>"><div class="cButton">Previous</div></a>
        <div class="cButton">Page <%=m_Curpage %></div>
        <a href="/PvP/Arena/?page=<%=(m_Curpage+1) %>"><div class="cButton">Next</div></a>
    </div>
    <table class="table noborder bbdesign">
        <thead>
            <tr>
                <td>#Nr</td>
                <td>Teamname</td>
                <td>Member</td>
                <td>Rating</td>
                <td>Games</td>
                <td>Wins</td>
                <td>Loses</td>
                <td>Seen</td>
            </tr>
        </thead>
        <tbody>
            <%=m_Table.ToString() %>
        </tbody>
    </table>
</asp:Content>

