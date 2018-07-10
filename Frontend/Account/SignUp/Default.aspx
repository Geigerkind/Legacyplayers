<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="SignUp_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/main.min.css" />
    <script src='https://www.google.com/recaptcha/api.js'></script>
    <style>
        label { float: none !important; }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Sign Up
    </div>
    <form runat="server">
        <label><div class="foolLH">T</div><input class="cText" type="text" runat="server" id="pmName" placeholder="Your name..." maxlength="51" required/><br /></label>
        <label><div class="foolLH">T</div><input class="cText" type="text" runat="server" id="pmMail" placeholder="Your mail address..." maxlength="120" required/><br /></label>
        <label><div class="foolLH">T</div><input class="cText" type="text" runat="server" id="pmMailCon" placeholder="Confirm your mail address..." maxlength="120" required/><br /></label>
        <label><div class="foolLH">T</div><input class="cText" type="password" runat="server" id="pmPass" placeholder="Your password..." required/><br /></label>
        <label><div class="foolLH">T</div><input class="cText" type="password" runat="server" id="pmPassCon" placeholder="Confirm your password..." required/><br /></label>
        <div class="g-recaptcha" data-theme="dark" data-sitekey="6LfuvjMUAAAAANtr4urRTT0WQoqoOShRHOcjsnk1"></div>
        <label><div class="foolLH">T</div><input type="submit" name="submit" value="Sign Up" /></label>
    </form>
</asp:Content>

