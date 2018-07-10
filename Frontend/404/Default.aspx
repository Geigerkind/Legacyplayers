<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_404_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/404.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / 404
    </div>
    <div id="ra-content" class="bgbox">
        <h1><%=_PAGES[_RND,1] %></h1>
        <img src="/Assets/404/<%=_PAGES[_RND,0] %>" />
        <p><%=_PAGES[_RND,2] %></p>
    </div>
</asp:Content>

