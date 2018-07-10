<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="RPLL.Error_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/404.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Error
    </div>
    <div id="ra-content" class="bgbox">
        <h1>Something went wrong :/</h1>
        <img src="/Assets/404/oops.jpg" />
        <p>Some unknown error occoured! If this bug keeps appearing, contact Shino please.</p>
    </div>
</asp:Content>

