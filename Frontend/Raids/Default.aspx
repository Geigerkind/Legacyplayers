<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Raids_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/raidoverview.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Raids
    </div>
    <form runat="server" name="form">
        <label><div class="foolLH">T</div><input runat="server" class="rText" type="text" name="name" id="pmName" placeholder="Enter a guild" maxlength="36" /></label>
        <label><div class="foolLH">T</div><input runat="server" class="rText" type="text" name="date" id="pmDate" placeholder="Date: (Format mm/dd/yyyy)" maxlength="11"/></label>
        <label><div class="foolLH">T</div><input runat="server" class="rText" type="text" name="duration" id="pmDuration" placeholder="Duration in minutes (e.g. </>30)" maxlength="6"/></label>
        <label><div class="foolLH">T</div><select runat="server" name="server" class="rSelect" id="pmExpansion" onchange="this.form.submit()">
        </select></label>
        <label><div class="foolLH">T</div><select runat="server" name="server" class="rSelect" id="pmServer">
        </select></label>
        <label><div class="foolLH">T</div><select runat="server" name="faction" class="rSelect" id="pmFaction">
        </select></label>
        <label><div class="foolLH">T</div><select runat="server" name="raids" class="rSelect" id="pmRaids">
        </select></label>
        <label><div class="foolLH">T</div><input id="submitt" type="submit" value="Search" /></label>
    </form>

    <table class="table noborder bbdesign" id="overview">
        <thead>
            <tr>
                <td>#Nr</td>
                <td>Guild</td>
                <td>Raid Instance</td>
                <td>Start Date</td>
                <td>End Date</td>
                <td>Duration</td>
                <td>Realm</td>
            </tr>
        </thead>
        <tbody>
            <%=m_RaidTable.ToString() %>
        </tbody>
    </table>
    <div id="tableiterator">
        <a href="?page=0"><div class="bbdesign">First</div></a>
        <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>"><div class="bbdesign">Previous</div></a>
        <%=m_PageBar.ToString() %>
        <a href="?page=<%=((m_CurPage<0) ? 0 : m_CurPage+1) %>"><div class="bbdesign">Next</div></a>
    </div>
</asp:Content>

