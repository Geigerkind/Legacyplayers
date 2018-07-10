<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Tools_Rankpoints_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/rankpoints.min.css" />
    <script type="text/javascript" src="/Assets/Js/Pages/Chart.min.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Tools / Rankpoints Calculator
    </div>
    <div id="ra-navbar">
        <form runat="server">
            <label><div class="foolLH">T</div><input type="text" id="rppw" name="rppw" runat="server" placeholder="Estimated rankpoints per week" /></label>
            <label><div class="foolLH">T</div><input type="text" id="ccrp" name="crp" runat="server" placeholder="Current rankpoints" /></label>
            <label><div class="foolLH">T</div><input type="submit" value="Calculate" /></label>
        </form>
    </div>
    <!-- Hidden by default -->
    <div style="display:<%=defaultState %>">
    <canvas id="graph" class="bbdesign"></canvas>
    <table class="table noborder bbdesign">
        <thead>
            <tr>
                <td>Week</td>
                <td>Rank</td>
                <td>Rankpoints</td>
                <td>Progress</td>
                <td>Progress %</td>
                <td>Total Progress</td>
            </tr>
        </thead>
        <tbody>
            <%=m_Table.ToString() %>
        </tbody>
    </table>
    <script>
        var ctx = document.getElementById("graph").getContext('2d');
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [1,2,3,4,5,6,7,8,9,10],
                datasets: [
                    {
                        label: "Rankpoints",
                        fill: false,
                        data: [<%=m_Chart.ToString() %>],
                        backgroundColor: 'rgb(196,30,59)',
                        borderColor: 'rgb(196,30,59)',
                    }
                ]
            },
            options: {
                animation: {
                    duration: 0, // general animation time
                },
                hover: {
                    animationDuration: 0, // duration of animations when hovering an item
                },
                legend: {
                    display: false,
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: false,
                        },
                        ticks: {
                            fontColor: "#FFF",
                            callback: function (value, index, values) {
                                return value;
                            },
                            maxTicksLimit: 8,
                            maxRotation: 0,
                            minRotation: 0,
                        },
                        gridLines: {
                            color: "rgba(153, 153, 153, 0.2)",
                        },
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: false,
                        },
                        ticks: {
                            fontColor: "#FFF",
                        },
                        gridLines: {
                            color: "rgba(153, 153, 153, 0.2)"
                        },
                    }]
                },
                responsiveAnimationDuration: 0, // animation duration after a resize
            }
        });
        document.getElementById('chartjsLegend').innerHTML = myLineChart.generateLegend();
    </script>
    </div>
</asp:Content>

