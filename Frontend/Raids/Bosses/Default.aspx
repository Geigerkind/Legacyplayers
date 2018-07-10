<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Raids_Bosses_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/bosses.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Raids / Bosses
    </div>
    <div id="ra-navbar">
        <form runat="server">
            <label><div class="foolLH">T</div><select runat="server" id="pmClass" onchange="this.form.submit()">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmFaction" onchange="this.form.submit()">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmExpansion" onchange="this.form.submit()">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmRealm" onchange="this.form.submit()" style="margin-right: 0;">
            </select></label>
            <!--
            <label><div class="foolLH">T</div><input type="submit" value="Filter" /></label>
            -->
        </form>
    </div>
    <table class="table noborder bbdesign">
        <thead>
            <tr>
                <td>Instance</td>
                <td>Boss</td>
                <td>Top DPS</td>
                <td>Top HPS</td>
                <td>Fastest kill</td>
                <td>Kill Count</td>
            </tr>
        </thead>
        <tbody>
            <%=m_Table.ToString() %>
        </tbody>
    </table>
</asp:Content>

