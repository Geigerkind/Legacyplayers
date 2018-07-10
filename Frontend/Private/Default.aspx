<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Loading_Default" %>
<%@ Import Namespace="RPLL" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/404.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Private
    </div>
    <div id="ra-content" class="bgbox">
        <h1>Sorry, these logs are private</h1>
        <img src="/Assets/misc/kpout.png" />
        <p>Contact the uploader to retrieve the direct link!</p>
    </div>
</asp:Content>

