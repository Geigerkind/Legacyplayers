<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/home.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div id="cTitle">LegacyPlayers</div>
    <%=(!m_LoggedIn) ? "<div id=\"cSubTitle\"> <a href=\"/Account/SignUp/\"><div class=\"cButton\">Sign Up</div></a> <a href=\"/Account/LogIn/\"><div class=\"cButton\">Log In</div></a> </div>" : "" %>
    
    <div id="supporters">
        <table class="table noborder bbdesign">
            <thead>
                <tr>
                    <td colspan="3">Thanks to all the project supporters!</td>
                </tr>
            </thead>
            <tbody>
                <%=m_Table.ToString() %>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3"><a href="/Donators">Click to view the full list</a></td>
                </tr>
            </tfoot>
        </table>
    </div>
</asp:Content>

