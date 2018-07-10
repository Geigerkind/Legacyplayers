<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Raids_Ranking_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/bossranking.min.css" />
    <style>#ra-navbar select{ width: 172.8px;}.cButton{ float: left !important;margin: 0 0 0 5px;}</style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Raids / Ranking
    </div>
    <div id="ra-navbar">
        <form runat="server">
            <label><div class="foolLH">T</div>  <select runat="server" id="pmSelection" onchange="this.form.submit()">
                <option value="0">Best 4 of 5 last raids</option>
                <option value="1">Best overall</option>
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmFaction" onchange="this.form.submit()">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmClass" onchange="this.form.submit()">
            </select></label>
            <!--
            <select runat="server" id="pmType">
            </select>
            -->
            <label><div class="foolLH">T</div> <select runat="server" id="pmExpansion" onchange="this.form.submit()">
            </select></label>
            <label><div class="foolLH">T</div> <select runat="server" id="pmRealm" onchange="this.form.submit()">
            </select></label>
            <label><div class="foolLH">T</div> <select runat="server" id="pmEncounter" onchange="this.form.submit()" style="margin-right: 0;">
            </select></label>
            <div style="float: left;">
                <a href="?page=0"><div class="cButton">First</div></a>
                <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>"><div class="cButton">Previous</div></a>
                <div class="cButton">Page <%=m_CurPage %></div>
                <a href="?page=<%=((m_CurPage<0) ? 0 :  m_CurPage+1) %>"><div class="cButton">Next</div></a>
            </div>
            <!--
            <label><div class="foolLH">T</div><input type="submit" value="Filter" /></label>
            -->
        </form>
    </div>
    <table class="table noborder bbdesign halfIt">
        <thead>
        <tr>
            <td>#Rank</td>
            <td>Character (Server) DPS</td>
        </tr>
        </thead>
        <tbody>
        <%=m_Table.ToString() %>
        
        <tr><td></td><td></td></tr>
        </tbody>
        <thead>
        <tr>
            <td>#Rank</td>
            <td>Character (Server) TPS</td>
        </tr>
        </thead>
        <tbody>
        <%=m_Table3.ToString() %>
        </tbody>
    </table>
    <table class="table noborder bbdesign halfIt">
        <thead>
        <tr>
            <td>#Rank</td>
            <td>Character (Server) HPS</td>
        </tr>
        </thead>
        <tbody>
        <%=m_Table2.ToString() %>
        </tbody>
    </table>
</asp:Content>

