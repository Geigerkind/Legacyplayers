<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="LogIn_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/main.min.css" />
    <style>
        label { float: none !important; }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Log In
    </div>
    <form runat="server">
        <label><div class="foolLH">T</div><input class="cText" type="text" runat="server" id="pmName" placeholder="Your nickname (not mail)..." required/><br /></label>
        <label><div class="foolLH">T</div><input class="cText" type="password" runat="server" id="pmPass" placeholder="Your password..." required/><br /></label>
        <label><div class="foolLH">T</div><input type="submit" name="submit" value="Log In" style="float: left; width: 99px" /></label>
        <div class="cButton" style="float: left; margin-left: 5px; width: 140px; height: 28px;"><a href="/Account/SignUp/">Sign Up instead</a></div>
        <div class="cButton" style="float: left; width: 140px; height: 28px;"><a href="/Account/Forgot/">Forgot my password</a></div>
    </form>
</asp:Content>

