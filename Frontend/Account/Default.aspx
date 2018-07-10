<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Account_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/account.min.css" />
    <style>
        label { float: none !important; }
        #left-menu{ height: 390px;}
        #privateLogs thead tr td, #poll thead tr td {
            text-align: left !important;
        }
        #privateLogs td:last-child {
            text-align: center !important;
        }
        #privateLogs td:last-child input, #poll td:last-child input {
            width: 100%;
        }
        #privateLogs tr td:first-child, #privateLogs tr td:nth-child(4) {
            width: 80px;
        }
        #privateLogs tr td:nth-child(2), #privateLogs tr td:nth-child(2) {
            width: 385px;
        }
        #poll tr td:first-child {
            width: 85%;
        }
        #poll tr td:nth-child(2) {
            width: 7%;
            text-align: center !important;
        }
        #poll tr td:nth-child(2) {
            width: 8%;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Account / <%=m_Name %>
    </div>
    <div id="left-menu" class="">
        <table class="table noborder bbdesign">
            <thead>
                <tr>
                    <td>Menu</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><a <%=(m_Mode==0) ? "class=\"selected\"" : "" %> href="/Account/?uid=<%=m_UID %>&mode=0">Summary</a></td>
                </tr>
                <tr>
                    <td><a <%=(m_Mode==2) ? "class=\"selected\"" : "" %> href="/Account/?uid=<%=m_UID %>&mode=2">Change Password</a></td>
                </tr>
                <tr>
                    <td><a <%=(m_Mode==3) ? "class=\"selected\"" : "" %> href="/Account/?uid=<%=m_UID %>&mode=3">Change E-Mail</a></td>
                </tr>
                <tr>
                    <td><a <%=(m_Mode==5) ? "class=\"selected\"" : "" %> href="/Account/?uid=<%=m_UID %>&mode=5">Change Username</a></td>
                </tr>
                <tr>
                    <td><a <%=(m_Mode==6) ? "class=\"selected\"" : "" %> href="/Account/?uid=<%=m_UID %>&mode=6">Proccessing log</a></td>
                </tr>
                <tr <%=(m_Level<1 ? "style=\"display:none\"" : "")%>>
                    <td><a <%=(m_Mode==1) ? "class=\"selected\"" : "" %> href="/Account/?uid=<%=m_UID %>&mode=1">Patreon: Bronze</a></td>
                </tr>
                <tr <%=(m_Level<2 ? "style=\"display:none\"" : "")%>>
                    <td><a <%=(m_Mode==7) ? "class=\"selected\"" : "" %> href="/Account/?uid=<%=m_UID %>&mode=7">Patreon: Silver</a></td>
                </tr>
                <tr <%=(m_Level<3 ? "style=\"display:none\"" : "")%>>
                    <td><a <%=(m_Mode==8) ? "class=\"selected\"" : "" %> href="/Account/?uid=<%=m_UID %>&mode=8">Patreon: Gold</a></td>
                </tr>
                <tr <%=(m_Level<6 ? "style=\"display:none\"" : "")%>>
                    <td><a <%=(m_Mode==4) ? "class=\"selected\"" : "" %> href="/Account/?uid=<%=m_UID %>&mode=4">Admin: Contact</a></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div id="right-content" class="bgbox">
        <%=m_Table.ToString() %>
        <form runat="server">
            <div <%=(m_Mode!=2 ? "style=\"display:none\"" : "")%>>
                <label><div class="foolLH">T</div><input class="cText" type="password" runat="server" id="pmPass" placeholder="Enter the new password"/><br /></label>
                <label><div class="foolLH">T</div><input class="cText" type="password" runat="server" id="pmPassCon" placeholder="Confirm the password"/><br /></label>
                <label><div class="foolLH">T</div><input class="cText" type="password" runat="server" id="pmOldPass" placeholder="Enter the old password"/><br /></label>
            </div>
            <div <%=(m_Mode!=3 ? "style=\"display:none\"" : "")%>>
                <label><div class="foolLH">T</div><input class="cText" type="text" runat="server" id="pmMail" placeholder="Enter the new mail"/><br /></label>
                <label><div class="foolLH">T</div><input class="cText" type="text" runat="server" id="pmMailCon" placeholder="Confirm the mail"/><br /></label>
                <label><div class="foolLH">T</div><input class="cText" type="password" runat="server" id="pmPassMail" placeholder="Enter your password"/><br /></label>
            </div>
            <div <%=(m_Mode!=5 ? "style=\"display:none\"" : "")%>>
                <label><div class="foolLH">T</div><input class="cText" type="text" runat="server" id="pmUsername" placeholder="Enter the new username"/><br /></label>
                <label><div class="foolLH">T</div><input class="cText" type="text" runat="server" id="pmUsernameOld" placeholder="Enter the old username"/><br /></label>
                <label><div class="foolLH">T</div><input class="cText" type="password" runat="server" id="pmOldPassUN" placeholder="Enter your password"/><br /></label>
            </div>
            <label><div class="foolLH">T</div><input type="submit" value="Change" <%=(m_Mode!=2 && m_Mode!=3 && m_Mode!=5 ? "style=\"display:none\"" : "")%> /></label>
        </form>
    </div>
</asp:Content>

