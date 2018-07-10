<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Changelog_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/changelog.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Service / Changelog
    </div>
    <table class="table noborder bbdesign" style="margin-top: 20px;">
        <thead>
            <tr>
                <td class="tsmallvalue">#</td>
                <td>Author</td>
                <td>Note</td>
                <td>Date</td>
            </tr>
        </thead>
        <tbody>
            <%=m_Table %>
        </tbody>
    </table>
    <div id="tableiterator">
        <a href="?page=0"><div class="bbdesign">First</div></a>
        <a href="?page=<%=((m_CurPage<=0) ? 0 : m_CurPage-1) %>"><div class="bbdesign">Previous</div></a>
        <%=m_PageBar.ToString() %>
        <a href="?page=<%=((m_CurPage<0) ? 0 : m_CurPage+1) %>"><div class="bbdesign">Next</div></a>
    </div>
</asp:Content>

