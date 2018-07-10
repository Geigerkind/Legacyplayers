<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Queue_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/queue.min.css" />
    <style>
        .sp {
            width: 25px;
            height: 25px;
            background-size: 25px 25px;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Queue
    </div>
    <table class="table noborder bbdesign" style="margin-top: 20px;">
        <thead>
            <tr>
                <td class="tsmallvalue">#</td>
                <td>Type</td>
                <td>Uploader</td>
                <td>Date</td>
                <td>Processing</td>
                <td>Progress</td>
            </tr>
        </thead>
        <tbody>
            <%=sb.ToString() %>
        </tbody>
    </table>
</asp:Content>

