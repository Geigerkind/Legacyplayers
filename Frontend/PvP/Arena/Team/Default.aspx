<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PvP_Arena_Team_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/arenateam.min.css" />
    <script type="text/javascript" src="/Assets/Js/Pages/Chart.min.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / PvP / Arena / <%=(m_Me.mType == 0 ? "2v2" : (m_Me.mType == 1) ? "3v3" : "5v5") %> / <%=m_Me.mName %>
    </div>
    <canvas id="graph" class="bbdesign"></canvas>
    <table id="left" class="table noborder bbdesign">
        <thead>
            <tr>
                <td colspan="2">Stats</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Rating:</td>
                <td><%=m_Current.mRanking %></td>
            </tr>
            <tr>
                <td>Games:</td>
                <td><%=m_Current.mGames %></td>
            </tr>
            <tr>
                <td>Wins:</td>
                <td><%=m_Current.mWins %></td>
            </tr>
            <tr>
                <td>Loses:</td>
                <td><%=(m_Current.mGames-m_Current.mWins) %></td>
            </tr>
            <tr>
                <td>Last Update:</td>
                <td><%=DateTimeOffset.FromUnixTimeMilliseconds(m_Current.mUploaded).UtcDateTime %></td>
            </tr>
        </tbody>
    </table>
    <table id="right" class="table noborder bbdesign">
        <thead>
            <tr>
                <td colspan="3">Member</td>
            </tr>
        </thead>
        <tbody>
            <%=mTable %>
        </tbody>
    </table>
    <script type="text/javascript">
        var config = {
            type: 'line',
            data: {
                labels: [<%=mGraphTime %>],
                datasets: [{
                    backgroundColor: "red",
                    borderColor: "red",
                    data: [<%=mGraphValues %>],
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: false,
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                legend: {
                    display: false
                },
                layout: {
                    padding: {
                        top: 30
                    }
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                        },
                        ticks: {
                            callback: function (value, index, values) { return new Date(value).toDateString(); }
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                        }
                    }]
                }
            }
        };
        var ctx = document.getElementById("graph").getContext("2d");
        var chart = new Chart(ctx, config);
    </script>
</asp:Content>

