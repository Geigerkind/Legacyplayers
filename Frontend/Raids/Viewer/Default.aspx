<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="RPLL.Raids_Viewer_Default" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="RPLL" %>

<asp:Content ContentPlaceHolderID="head" Runat="Server">
<link rel="stylesheet" type="text/css" href="/Assets/Css/main.min.css" />
<script type="text/javascript" src="/Assets/Js/Pages/Chart.min.js"></script>
<script type="text/javascript" src="/Assets/Js/Pages/chartjs-plugin-annotation.min.js"></script>
<script type="text/javascript" src="/Assets/Js/Pages/chartjs-plugin-zoom.min.js"></script>
    <!--
<script type="text/javascript" src="/Assets/Js/Pages/chartjs-plugin-deferred.min.js"></script>
    -->
<style>
    label {
        float: right;
    }
    #info {
         height: 60px;
         padding: 5px 10px;
         margin-bottom: 20px;
     }
    #info div {
        width: 50%;
        float: left;
        font-size: 24px;
    }
    #info div:nth-child(even) {
        text-align: right;
    }
    #info div:nth-child(3), #info div:nth-child(4) {
        font-size: 14px;
    }
    .grayish {
        font-weight: 100;
        color: #999;
    }

    select {
        background-color: rgba(0, 0, 0, 0);
        border: none;
        box-shadow: none;
    }
    select:hover {
        cursor: pointer;
    }
    option {
        background-color: rgba(0, 0, 0, .85);
    }
    .chartjsLegend {
        width: 100%;
    }
    .chartjsLegend ul {
        width: 360px;
        margin: 0 auto;
        line-height: 0;
    }
    .chartjsLegend ul li {
        float: left;
        list-style: none;
        font-size: 18px;
        height: 40px;
        width: 180px;
        text-align: center;
        margin: 0;
        margin-top: -18px;
        padding: 0;
    }
    .chartjsLegend ul li:first-child {
        color: rgb(196, 30, 59);
    }
    .chartjsLegend ul li:last-child {
        color: rgb(171,212,115);
    }

    select.minimal {   
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 150px;
        height: 33px;
        font-size: 16px;
        overflow: hidden;
        padding-right: 30px !important;
        text-overflow: ellipsis;

        background-image:linear-gradient(45deg, transparent 50%, gray 50%),linear-gradient(135deg, gray 50%, transparent 50%);
        background-position:calc(100% - 20px) calc(1em - 4px),calc(100% - 9px) calc(1em - 4px),calc(100% - 2.5em) 0.5em;
        background-size: 12px 12px,12px 12px,1px 1.5em;
        background-repeat: no-repeat;
    }
    .tableMin {
        width: auto !important;
        height: 35px !important;
        float: left;
        margin-left: 200px;
    }
    select.minimal:focus {
        background-image:
                        linear-gradient(45deg, transparent 50%, green 50%),
                        linear-gradient(135deg, green 50%, transparent 50%);
        border-color: green;
        outline: 0;
    }
    select:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 #000;
    }

    #selector {
        min-height: 50px;
        margin-bottom: 20px;
        padding: 10px 5px 5px 5px;
        width: calc(100% - 10px);
        overflow: hidden;
    }
    #selector input[type=text] {
        height: 33px;
        width: 180px;
    }
    #selector input[type=text] {
        height: 31px;
    }
    #selector input[type=submit] {
        height: 35px;
        width: 100px;
    }
    #selector canvas {
        margin-top: 30px;
        height: 500px !important;
    }

    #rs_container {
        min-height: 40px;
        padding: 5px 10px;
        overflow: hidden;
    }

    .table thead td {
        text-align: left;
        font-size: 18px;
    }

    .dataTable {
        width: 100%;
    }

    .dataTable tbody {
        display: block;
        overflow: hidden;
    }
    .dataTable tfoot {
        text-align: center;
    }
    .dataTable td {
        height: 18px;
        padding-bottom: 0;
        line-height: 0;
    }
    .dataTable tbody td:first-child, .dataTable tbody td:last-child {
        width: 5%;
        text-align: right;
    }
    .dataTable tbody td:nth-child(2) {
        width: 90%;
    }
    .tstatusbar {
        z-index: 2;
        white-space: nowrap;
        display: inline-block;
        height: 20px !important;
        line-height: 20px !important;
        margin-bottom: 0;
        cursor: pointer;
    }
    .tstatusbar:hover div:first-child, .tstatusbar:hover div:last-child {
        background-color: rgba(255, 255, 255, 0.4);
    }
    .tstatusbar div:first-child {
        background-color: rgba(255, 255, 255, 0.15);
        z-index: 1;
        display: table-cell;
        width: 100%;
        white-space: nowrap;
        padding-right: 5px;
        padding-left: 5px;
        height: 20px;
    }
    .tstatusbar div:last-child, .healingbar div:first-child div:last-child {
        background-color: rgba(255, 255, 255, 0.15);
        display: table-cell;
        white-space: nowrap;
        height: 20px;
        padding-right: 5px;
        width: 100%;
    }
    .healingbar {
        display: table !important;
    }
    .healingbar div:first-child div {
        background-color: rgba(0,0,0,0) !important;
    }
    .healingbarsep {
        background-color: rgba(55, 55, 55, 0.7) !important;
        float: right;
        border-left: 1px solid black;
        height: 20px;
        cursor: pointer;
    }
    .tstatusbar, .tstatusbar a {
        color: black;
        z-index: 3;
    }

    .deathbar div, .intdisbar div {
        height: 18px;
        line-height: 18px;
        width: 50%;
        float: left;
        overflow: hidden;
    }
    .intdisbar div:first-child, .intdisbar div:nth-child(2) {
        width: 30%;
    }
    .intdisbar div:nth-child(3) {
        width: 39%;
    }

    .halfit {
        float: left;
        width: 49%;
    }
    .halfit:nth-child(odd) {
        margin-left: 2%;
    }

    .halfit .bgbox {
        padding: 5px 5px 5px 5px;
        margin-bottom: 10px;
        overflow: hidden;
    }
    a:hover {
        cursor: pointer;
    }

    .cogwheel {
        width: 36px;
        height: 36px;
        background-image: url(/Assets/viewer/config.<%=Utility.GetImageType(Request, "png") %>);
        background-repeat: no-repeat;
        background-position: center center;
        opacity: 0.9;
        float: right;
    }
    .cogwheel:hover {
        opacity: 1;
        cursor: pointer;
    }
    .cogwheel:hover ul {
        display: block;
    }
    .cogwheel ul {
        position: absolute;
        border: 1px solid #ccc;
        background: black;
        margin: 0;
        padding: 0;
        margin: 36px 0 0 -82px;
        display: none;
    }
    .cogwheel ul li {
        list-style: none;
        width: 190px;
        height: 30px;
        padding-left: 10px;
    }
    .cogwheel ul li:hover {
        color: #f28f45;
    }
</style>
<script type="text/javascript">
    function ExpandDataTable(table) {
        var tbody = document.getElementById(table).getElementsByTagName('tbody')[0];
        var tfoot = document.getElementById(table).getElementsByTagName('tfoot')[0].getElementsByTagName('tr')[0].getElementsByTagName('td')[0].getElementsByTagName('a')[0];
        if (tbody.style.maxHeight === "545px") {
            tbody.style.maxHeight = "9999px";
            tfoot.textContent = "Show less";
        } else {
            tbody.style.maxHeight = "545px";
            tfoot.textContent = "Show more";
        }
    }
    function ToggleElement(self, element) {
        var el = document.getElementById(element);
        if (el.tagName === "TABLE") {
            el = el.getElementsByTagName('tbody')[0];
        }
        if (el.style.display === "none") {
            el.style.display = "block";
            self.innerHTML = "Hide&nbsp;";
        } else {
            el.style.display = "none";
            self.innerHTML = "Show&nbsp;";
        }
        toggleCookie("rwel_" + element);
    }
    var mDEBUG = <%=mDEBUG %>;
    function SetSelection(select, value) {
        document.getElementById(mDEBUG+"ContentPlaceHolder1_" + select).value = value;
        document.getElementById(mDEBUG === '' ? 'navForm' : mDEBUG+'ContentPlaceHolder1_navForm').submit();
    }
</script>
    <style>
        #rs_loot, #rs_participants {
            width: 100%;
        }
        
        .item-template-64, .item-template-64:hover {
            height: 39px;
            width: 39px;
            text-align: right;
            padding: 8px 4px 0 0;
            margin: 5px 5px 5px 0;
            float: left;
        }

        #rs_participants tbody td {
            height: 20px;
        }
        #rs_participants tbody td a {
            color: inherit;
        }
        
        .rvDataClear {
            background: #303030;
            margin: -5px -5px -5px -5px;
            padding: 5px 5px 5px 5px;
        }

        .rvBig {
            font-weight: 500;
            font-size: 16px;
        }
        .rvMiddle {
            font-weight: 900;
        }
        
        .rvDataTT {
            width: 400px !important;
        }
        .rvDataTT td {
            height: 20px !important;
        }

        .rvDataTT .bgbox {
            padding: 2px 2px 2px 2px;
        }
        
        .rvDataTT .bgbox table tr td {
            color: #999999 !important;
        }

        .rvDataTT td table tr:first-child td:first-child, .rvDataOther tr td:first-child {
            text-align: left !important;
        }
        .rvDataTT td:first-child {
            width: 100px !important;
        }
        .rvDataTT td:nth-child(4) {
            width: 55px !important;
            text-align: right;
        }
        .rvDataTT td:nth-child(2), .rvDataTT td:nth-child(3) {
            width: 150px !important;
        }
        .deathTT {
            width: 450px !important;
        }
        .deathTT td:nth-child(4) {
            width: 80px !important;
            text-align: left;
        }
        .deathTT td:nth-child(2), .deathTT td:nth-child(3) {
            width: 120px !important;
            text-align: left;
        }
        .deathTT td:last-child {
            width: 30px !important;
        }

        .deathTT tr:nth-child(even){
            background-color: rgba(0,0,0,0.3) !important;
        }

        .deathTT tr:nth-child(odd){
            background-color: rgba(0,0,0,0.05) !important;
        }

        .preview tr:nth-child(even) {
            background-color: rgba(0,0,0,0.3);
        }
        .preview tr:nth-child(odd) {
            background-color: rgba(0,0,0,0.05);
        }

        .preview td:first-child, .preview td:last-child {
            width: 55px !important;
            text-align: right;
            padding-right: 5px;
        }

        .preview td:first-child {
            width: 35px !important;
        }

        .preview td:nth-child(2) {
            width: 220px !important;
            text-align: left;
        }

        .preview td:nth-child(3) {
            width: 180px !important;
            text-align: right;
        }

        #chartjs-tooltip {
            position: absolute;
            padding: 3px 3px;
            background: black;
            border-radius: 2px 2px 2px 2px;
        }

        .chartjs-tooltip-key {
            border-width: 2px;
            height: 12px;
            width: 12px;
            margin-right: 3px;
            display: inline-block;
        }

        #chartjs-tooltip th {
            text-align: left;
        }

        <%=MChartColoring %>
    </style> 
</asp:Content>   

<asp:Content ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <form runat="server" id="navForm" name="navigationForm">
    <div class="bgbox linkbar" style="margin-bottom: 20px;"> 
        <a href="/">Home</a> / <a href="/Raids/">Raids</a> / <a href="/Armory/Guild/?guildid=<%=m_Data.m_RaidData.m_Guild.ID %>"><%=m_Data.m_RaidData.m_Guild.Name %></a> / <%=m_Data.m_RaidData.m_Instance %>
        <div class="cogwheel">
            <ul>
                <li <%=(m_MergePets ? "class=\"selected\"" : "") %> onclick="toggleCookie('RaidViewer_MergePets');location.reload();">Merge pets</li>
                <li <%=(m_DistIgnite ? "class=\"selected\"" : "") %> onclick="toggleCookie('RaidViewer_DistIgnite');location.reload();">Distribute ignite</li>
                <li <%=(m_FilterIgnite ? "class=\"selected\"" : "") %> onclick="toggleCookie('RaidViewer_FilterIgnite');location.reload();">Filter ignite</li>
                <li <%=(m_DistJudgement ? "class=\"selected\"" : "") %> onclick="toggleCookie('RaidViewer_DistJudgement');location.reload();">Distribute JoL</li>
                <li <%=(m_FilterJudgement ? "class=\"selected\"" : "") %> onclick="toggleCookie('RaidViewer_FilterJudgement');location.reload();">Filter JoL</li>
                <li <%=(m_FilterWorldRaidBuffs ? "class=\"selected\"" : "") %> onclick="toggleCookie('RaidViewer_FilterWorldRaidBuffs');location.reload();">Filter World/Raid buffs</li>
                <li <%=(m_Annotations ? "class=\"selected\"" : "") %> onclick="toggleCookie('RaidViewer_Annotations');location.reload();">Annoations</li>
                <li <%=(m_FriendlyFire ? "class=\"selected\"" : "") %> onclick="toggleCookie('RaidViewer_FriendlyFire');location.reload();">Friendly Fire</li>
                <li <%=(m_GraphHeal == 0 ? "class=\"selected\"" : "") %> onclick="setCookie('RaidViewer_Graph_Heal', '0', 365);location.reload();">Graph: Effective heal</li>
                <li <%=(m_GraphHeal == 1 ? "class=\"selected\"" : "") %> onclick="setCookie('RaidViewer_Graph_Heal', '1', 365);location.reload();">Graph: Overheal</li>
                <li <%=(m_GraphHeal == 2 ? "class=\"selected\"" : "") %> onclick="setCookie('RaidViewer_Graph_Heal', '2', 365);location.reload();">Graph: Raw heal</li>
                <!--
                <li>Compare</li>
                <li>Detailed Tooltip</li>
                -->
            </ul>
        </div>
        <label><div class="foolLH">T</div><input type="text" style="height: 20px; float: right; margin-top: 5px;" value="<%=Export(ref m_Data, Utility.GetCookie(Request, "Viewer"+m_Data.Id+"_Table1", "Damage done"), Utility.GetCookie(Request, "Viewer"+m_Data.Id+"_Table2", "Effient healing"), m_Expansion) %>" onclick="this.select()"/></label><span style="float: right; margin-right: 5px; margin-left: 10px;">Export: </span>
        
        <label><div class="foolLH">T</div><input type="submit" style="height: 25px; float: right; margin-top: 5px;" value="Filter" /></label>
        <label><div class="foolLH">T</div><input type="text" style="height: 20px; float: right; margin-top: 5px;" runat="server" id="pmUpper" placeholder="Upper TS bound in ms"/></label>
        <label><div class="foolLH">T</div><input type="text" style="height: 20px; float: right; margin-top: 5px;" runat="server" id="pmLower" placeholder="Lower TS bound in ms"/></label>
    </div>
    <div class="bgbox" id="info">
        <div><%=m_Data.m_RaidData.m_Instance + " <span class=\"grayish\">(" + DateTimeOffset.FromUnixTimeMilliseconds(m_Data.m_RaidData.m_Start).UtcDateTime.ToShortDateString() + " " + DateTimeOffset.FromUnixTimeMilliseconds(m_Data.m_RaidData.m_Start).UtcDateTime.ToShortTimeString() + ")</span>"%>
        </div>
        <div><%="<a class=\"tf"+m_Data.m_RaidData.m_Guild.Faction+"\" href=\"/Armory/Guild/?guildid="+m_Data.m_RaidData.m_Guild.ID+"\">&lt;" + m_Data.m_RaidData.m_Guild.Name+"&gt;</a>"%></div>
        <div>Uploaded by <%=string.Join(", ", RaidData.m_Uploader[m_Data.Id].Where(x => LogInfo.mPrivate.Where(y => !y.Value && y.Key == x.Key).Count() >= 1 || m_Data.Uploader == x.Key).Select(x => "<a href=\"/Raids/Viewer/?id="+m_Data.Id+"&upl="+x.Key+"&exp="+m_Expansion+"\">"+App.GetUser(x.Value).Name+"</a>")) %>. (<%=TimeSpan.FromMilliseconds(m_Data.m_RaidData.m_End-m_Data.m_RaidData.m_Start).ToString(@"hh\:mm\:ss") %> hours)</div>
        <div><%=m_Data.m_RaidData.m_Server.Name %></div>
    </div>
    <div class="bgbox" id="selector">
        <select class="minimal" runat="server" id="pmCategory" onchange="document.getElementById(mDEBUG + 'ContentPlaceHolder1_pmUpper').value='0';document.getElementById(mDEBUG +'ContentPlaceHolder1_pmLower').value='0';this.form.submit()"></select>
        <select class="minimal" runat="server" id="pmAttempt" onchange="document.getElementById(mDEBUG + 'ContentPlaceHolder1_pmUpper').value='0';document.getElementById(mDEBUG +'ContentPlaceHolder1_pmLower').value='0';this.form.submit()"></select>
        <select class="minimal" runat="server" id="pmTarget" style="float: right" onchange="this.form.submit()"></select>
        <select class="minimal" runat="server" id="pmSource" style="float: right" onchange="this.form.submit()"></select>
        <div id="chartjsLegend" class="chartjsLegend"></div>
            
            
        
        <label><div class="foolLH">T</div><input type="hidden" runat="server" id="pmID" /></label>

        <canvas id="chartContainer" <%=SetElementHider("chartContainer") %>></canvas>
        
        <%=GetElementHider("chartContainer") %>
    </div>
    <script> <%=MChartConfig %> </script>
    
    <div class="halfit">
        <div class="bgbox">
            <table class="bbdesign table noborder dataTable" id="rs_table1"><thead><tr><td colspan="3">
            <select class="minimal tableMin" runat="server" id="pmTable1" onchange="this.form.submit()">
            </select><span style="float: right; margin-top: 18px;"><%=GetTotal(pmTable1.Value, m_ChartDamage) %></span>
            </td></tr></thead><tbody style="max-height:545px;<%=(Utility.GetCookie(Request, "rwel_rs_table1", "0") != "true" ? "" : "display:none;")%>">
                <%=m_Table1 %>
            </tbody><tfoot><tr><td colspan="3"><a href="javascript:ExpandDataTable('rs_table1');">Show more</a></td></tr><%=GetTableNote(0) %></tfoot></table>
            <%=GetElementHider("rs_table1") %>
        </div>
        <div class="bgbox">
            <table class="bbdesign table noborder" id="rs_loot">
                <thead>
                <tr>
                    <td colspan="2">
                        Loot
                        <label><div class="foolLH">T</div><input type="checkbox" id="sigloot" style="float: right; margin-top: 5px;" onclick="toggleCookie('Viewer_Loot'); this.form.submit()" <% if (Request.Cookies.Get("Viewer_Loot") != null && Request.Cookies["Viewer_Loot"].Value == "true"){ Response.Write("checked"); } %>/></label>
                        <label style="float: right; margin-right: 5px;" for="sigloot">Show insignificant</label>
                    </td>
                </tr>
                </thead>
                <tbody <%=SetElementHider("rs_loot") %>>
                <%=m_Loot.ToString() %>
                </tbody>
            </table>
            <%=GetElementHider("rs_loot") %>
        </div>
    </div>
    <div class="halfit">
        <div class="bgbox">
            <table class="bbdesign table noborder dataTable" id="rs_table2"><thead><tr><td colspan="3">
            <select class="minimal tableMin" runat="server" id="pmTable2" onchange="this.form.submit()">
            </select><span style="float: right; margin-top: 18px;"><%=GetTotal(pmTable2.Value, m_ChartHeal) %></span>
            </td></tr></thead><tbody style="max-height:545px;<%=(Utility.GetCookie(Request, "rwel_rs_table2", "0") != "true" ? "" : "display:none;")%>">
                <%=m_Table2 %>
            </tbody><tfoot><tr><td colspan="3"><a href="javascript:ExpandDataTable('rs_table2');">Show more</a></td></tr><%=GetTableNote(1) %></tfoot></table>
            <%=GetElementHider("rs_table2") %>
        </div>
        <div class="bgbox">
            <table class="bbdesign table noborder" id="rs_participants">
                <thead>
                <tr>
                    <td>Raidcomposition (<%=m_Data.m_RaidData.m_Participants.Count %>)</td>
                </tr>
                </thead>
                <tbody <%=SetElementHider("rs_participants") %>>
                <%=m_Participants.ToString() %>
                </tbody>
            </table>
            <%=GetElementHider("rs_participants") %>
        </div>
    </div>
    </form>
</asp:Content>

