<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PvP_LifeTimeKills_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/standings.min.css" />
    <style>
        .table tbody td:nth-child(3), .table tbody td:nth-child(4){
            width: 36%;
            text-align: left;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / PvP / Lifetime Kills
    </div>
    <div id="ra-navbar">
        <form runat="server">
            <label><div class="foolLH">T</div><select runat="server" id="pmFaction">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmRealm">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmClass">
            </select></label>
            <label><div class="foolLH">T</div><input type="submit" value="Filter" /></label>
        </form>
        <a href="/Tools/Rankpoints/"><div class="cButton">RP-Calculator</div></a>
        <a href="?page=0"><div class="cButton">First</div></a>
        <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>"><div class="cButton">Previous</div></a>
        <div class="cButton">Page <%=m_CurPage %></div>
        <a href="?page=<%=((m_CurPage<0) ? 0 : m_CurPage+1) %>"><div class="cButton">Next</div></a>
    </div>
    <table class="table noborder bbdesign">
        <thead>
            <tr>
                <td>#Nr</td>
                <td>Rank</td>
                <td>Name</td>
                <td>Guild</td>
                <td>HKs</td>
                <td>Seen</td>
            </tr>
        </thead>
        <tbody>
            <%=m_Table.ToString() %>
        </tbody>
    </table>
</asp:Content>

