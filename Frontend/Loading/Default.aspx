<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Loading_Default" %>
<%@ Import Namespace="RPLL" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/404.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Loading
    </div>
    <div id="ra-content" class="bgbox">
        <h1>This may take a while...</h1>
        <img src="/Assets/Loading/tmtaw.<%=Utility.GetImageType(Request, "png") %>" />
        <p>We are currently loading the database. This might take up to 5 minutes!</p>
    </div>
</asp:Content>

