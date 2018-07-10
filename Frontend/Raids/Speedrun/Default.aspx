<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Raids_SpeedRun_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/ranking.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Raids / Speedrun
    </div>
    <div id="ra-navbar">
        <form runat="server">
            <label><div class="foolLH">T</div> <select runat="server" id="pmSelection" onchange="this.form.submit()">
                <option value="0">Best 4 of 5 last raids</option>
                <option value="1">Best overall</option>
            </select></label>
            <label><div class="foolLH">T</div> <select runat="server" id="pmFaction" onchange="this.form.submit()">
            </select></label>
            <label><div class="foolLH">T</div> <select runat="server" id="pmRealm" onchange="this.form.submit()">
            </select></label>
            <label><div class="foolLH">T</div> <select runat="server" id="pmExpansion" onchange="this.form.submit()">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmEncounter" onchange="this.form.submit()" style="margin-right: 0;">
            </select></label>
            <!--
            <label><div class="foolLH">T</div><input type="submit" value="Filter" /></label>
            -->
        </form>
    </div>
    <table class="table noborder bbdesign">
        <thead>
            <tr>
                <td>#Rank</td>
                <td>Guild (Server)</td>
                <td>Date</td>
            </tr>
        </thead>
        <tbody>
            <%=m_Table.ToString() %>
        </tbody>
    </table>
</asp:Content>

