<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Forgot_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/main.min.css" />
    <style>
        label { float: none !important; }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Account / Forgot Password
    </div>
    <form runat="server">
        <label><div class="foolLH">T</div><input class="cText" type="text" runat="server" id="pmMail" placeholder="Enter your E-Mail" required/><br /></label>
        <label><div class="foolLH">T</div><input type="submit" name="submit" value="Send Mail" /></label>
    </form>
</asp:Content>

