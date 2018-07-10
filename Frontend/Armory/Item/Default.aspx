<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Armory_Item_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/item.min.css" />
    <style>.cButton{width: 103px}</style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Armory / Item / <%=m_Icon %>
    </div>
    <div id="searchnav" style="margin-bottom: 20px;">
        <form runat="server" style="float: left;">
            <label><div class="foolLH">T</div><select runat="server" id="pmRealm">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmFaction">
            </select></label>
            <label><div class="foolLH">T</div><select runat="server" id="pmClass">
            </select></label>
            <label><div class="foolLH">T</div><input type="text" runat="server" id="pmItem" placeholder="Enter an ItemID" /></label>
            <label><div class="foolLH">T</div><input type="submit" value="Filter" /></label>
        </form>
        <div style="float: left; margin-top: 2px;">
            <a href="?page=0"><div class="cButton">First</div></a>
            <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>"><div class="cButton">Previous</div></a>
            <div class="cButton">Page <%=m_CurPage %></div>
            <a href="?page=<%=((m_CurPage<0) ? 0 : m_CurPage+1) %>"><div class="cButton">Next</div></a>
        </div>
    </div>
    <table class="table noborder bbdesign">
        <thead>
            <tr>
                <td>Name</td>
                <td>Guild</td>
                <td>Server</td>
                <td>Seen</td>
            </tr>
        </thead>
        <tbody>
            <%=m_Table.ToString() %>
        </tbody>
    </table>
</asp:Content>

