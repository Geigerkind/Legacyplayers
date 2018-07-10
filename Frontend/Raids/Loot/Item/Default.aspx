<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Loot_Item_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/lootitem.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / <a href="/Raids/Loot/">Loot</a> / Item
    </div>
    <table id="guild" class="table noborder bbdesign">
        <thead>
            <tr>
                <td colspan="3">Recent drops</td>
            </tr>
        </thead>
        <tbody>
            <%=m_RecentTable.ToString() %>
        </tbody>
    </table>
    <table id="player" class="table noborder bbdesign" style="margin-left: 5px">
        <thead>
            <tr>
                <td colspan="4">Player received</td>
            </tr>
        </thead>
        <tbody>
            <%=m_PlayerTable.ToString() %>
        </tbody>
    </table>
    <div id="tableiterator" style="float: left;">
        <a href="?page=0"><div class="bbdesign">First</div></a>
        <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>"><div class="bbdesign">Previous</div></a>
        <%=m_PageBar.ToString() %>
        <a href="?page=<%=((m_CurPage<0) ? 0 : m_CurPage+1) %>"><div class="bbdesign">Next</div></a>
    </div>
</asp:Content>

