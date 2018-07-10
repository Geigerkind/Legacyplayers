<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="RPLL.Contact_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/main.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Contact
    </div>
    <form runat="server">
        <label><div class="foolLH">T</div><input runat="server" class="cText" type="text" id="namebox" placeholder="Your name..." required/><br /></label>
        <label><div class="foolLH">T</div><input runat="server" class="cText" type="text" id="mail" placeholder="Your mail address..." required/><br /></label>
        <label><div class="foolLH">T</div><input runat="server" class="cText" type="text" id="subject" placeholder="Subject" required/><br /></label>
        <label><div class="foolLH">T</div><textarea runat="server" class="text" id="text" placeholder="Your message..." required></textarea><br /></label>
        <label><div class="foolLH">T</div><input type="submit" name="submit" value="Send message" /></label>
    </form>
</asp:Content>

