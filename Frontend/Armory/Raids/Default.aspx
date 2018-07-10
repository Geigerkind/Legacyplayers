<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Armory_Raids_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/armoryraids.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Armory / Raids
    </div>
    <table class="table noborder bbdesign">
        <thead>
            <tr>
                <td>Instance</td>
                <td>Guild</td>
                <td>Date</td>
            </tr>
        </thead>
        <tbody>
            <%=m_Table.ToString() %>
        </tbody>
    </table>
    <div id="tableiterator">
        <a href="?page=0&charid=<%=m_CharID %>"><div class="bbdesign">First</div></a>
        <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>&charid=<%=m_CharID %>"><div class="bbdesign">Previous</div></a>
        <%=m_PageBar.ToString() %>
        <a href="?page=<%=((m_CurPage<0) ? 0 : m_CurPage+1) %>&charid=<%=m_CharID %>"><div class="bbdesign">Next</div></a>
    </div>
</asp:Content>

