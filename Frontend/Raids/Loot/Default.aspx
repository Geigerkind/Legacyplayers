<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Loot_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/loot.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Loot
    </div>
    <div id="item-nav">
        <form runat="server">
            <label><div class="foolLH">T</div><input type="text" runat="server" id="pmItem" placeholder="Press enter to search" /></label>
        </form>
        <a href="?page=0"><div class="cButton">First</div></a>
        <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>"><div class="cButton">Previous</div></a>
        <div class="cButton">Page <%=m_CurPage %></div>
        <a href="?page=<%=((m_CurPage<0) ? 0 : m_CurPage+1) %>"><div class="cButton">Next</div></a>
    </div>
    <table class="table noborder bbdesign">
        <tbody>
            <%=m_Table.ToString() %>
        </tbody>
    </table>
</asp:Content>

