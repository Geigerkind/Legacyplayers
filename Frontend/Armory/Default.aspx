<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Armory_Default" %>
<%@ Import Namespace="RPLL" %>
<%@ Import Namespace="System.Linq" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/armory.min.css" />
    <script type="text/javascript" src="/Assets/Js/Pages/jquery.js"></script>
    <script type="text/javascript" src="/Assets/Js/Pages/wmmv.js"></script>
    <script type="text/javascript">
        function IterateMenu(cur, next, id) {
            document.getElementById(cur).style.display = "none";
            document.getElementById(next).style.display = "table";
            setCookie("Armory_Menu" + id, next, 30);
        }
        function ToggleRecordMenu(table) {
            if (document.getElementById(table).style.display !== "table-header-group")
                document.getElementById(table).style.display = "table-header-group";
            else
                document.getElementById(table).style.display = "none";
        }
        function LoadUp() {
            if (getCookie("Armory_Menu1") !== "")
                IterateMenu("meele", getCookie("Armory_Menu1"), 1);
            if (getCookie("Armory_Menu2") !== "")
                IterateMenu("lifetime", getCookie("Armory_Menu2"), 2);
        }
    </script>
    <style>
        .arrowleft, .arrowright, .arrowdown {
            background-image: url('/Assets/armory/Glue-LeftArrow-Button-Up.<%=imgType %>');
        }
        .arrowright {
            background-image: url('/Assets/armory/Glue-RightArrow-Button-Up.<%=imgType %>');
        }
        .arrowdown, .arrowdown:hover {
            background-image: url('/Assets/armory/UI-ScrollBar-ScrollDownButton-Up.<%=imgType %>');
        }
        #chardesigner {
            background: url('/Assets/armory/Inspect.png');
        }
        #names-top { background-image: url('/Assets/armory/sidebar-bg-alliance.<%=imgType %>'); }
        #resistances {
            background-image: url('/Assets/armory/UI-Character-ResistanceIcons.<%=imgType %>');
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / Armory
    </div>
    <form runat="server">
    <div id="left-container" class="bgbox">
        <div id="model" class="model">
            <script>
                var viewer;
                var charactermodel = {
                    type: ModelViewer.WOW,
                    contentPath: "//cdn.warmane.com/wmmv/",
                    background: "background.png",
                    container: $('.model'),
                    hd: true,
                    aspect: 0.74,
                    sk: 4,
                    ha: 7,
                    hc: 1,
                    fa: 7,
                    fh: 6,
                    fc: 0,
                    ep: 0,
                    ho: 0,
                    ta: 0,
                    cls: 2,
                    items: [<%=m_ItemDisplayArr %>],
                    models: {
                        type: ModelViewer.Wow.Types.CHARACTER,
                        id: 'humanfemale'
                    }
                };
                
                $(function () {
                    <%
                if (Request.Cookies.Get("viewthreedmodel") == null || Request.Cookies["viewthreedmodel"].Value == "false")
                    Response.Write("document.getElementById('model').style.backgroundImage = 'url(/Assets/armory/"+ m_Me.RefMisc.Gender+"-"+m_Me.RefMisc.Race + "."+imgType+")';");
                else
                    Response.Write("viewer = new ModelViewer(charactermodel);");
                    %>
                });
            </script>
        </div>
        <div id="playerframe">
            <a href="/Tools/Designer/?data=<%=GetCharViewer() %>"><div id="chardesigner" onmouseover="tt_show(this,3,0,['View this character in the character designer.'])"></div></a>
            <div id="achievements" style="background-image:url(/Assets/armory/achiev.<%=imgType %>)"><div>0</div></div>
            <div id="names-top">
                <div class="pvprankimage" style="background: url(/Assets/armory/rk<%=m_Me.RefHonor.Rank+"."+imgType %>)"></div>
                <div class="icon-32 bbdesign" style="margin-right: 5px;background-image: url('/Assets/racegender/<%=m_Me.RefMisc.Gender+"-"+m_Me.RefMisc.Race + "." + imgType%>')"></div>
                <div class="sp bbdesign" style="height: 32px; width: 32px; background-size: 32px 32px; background-image:url(/Assets/classes/cc<%=m_Me.RefMisc.Class+"."+imgType %>)"><div><%=m_Me.Name + " " + m_Me.RefMisc.Level %></div></div><br />
                <span style="font-size: 20px !important">
                <%=((m_Me.RefGuild.GuildID>0) ? m_Me.RefGuild.GrankName+" of <a href=\"/Armory/Guild/?guildid="+m_Me.RefGuild.GuildID+"\" class=\"tf"+m_Me.Faction+"\" onmouseover=\"tt_show(this,4,"+m_Me.RefGuild.GuildID+",[]);\" style=\"pointer-events: all;\">"+ App.GetGuild(m_Me.RefGuild.GuildID).Name +"</a>" : "")%>
                </span>
            </div>
            
            <div id="items-left">
                <div class="item-template-64 qe<%=m_Gear.Slots[0].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[0].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[0].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/1."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[0].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[0].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[0].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[0].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[1].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[1].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[1].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/2."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[1].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[1].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[1].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[1].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[2].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[2].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[2].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/3."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[2].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[2].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[2].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[2].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[14].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[14].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[14].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/15."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[14].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[14].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[14].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[14].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[4].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[4].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[4].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/5."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[4].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[4].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[4].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[4].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[3].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[3].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[3].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/4."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[3].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[3].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[3].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[3].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[18].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[18].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[18].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/19."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[18].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[18].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[18].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[18].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[8].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[8].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[8].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/9."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[8].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[8].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[8].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[8].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
            </div>
            <div id="items-right">
                <div class="item-template-64 qe<%=m_Gear.Slots[9].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[9].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[9].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/10."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[9].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[9].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[9].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[9].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[5].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[5].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[5].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/6."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[5].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[5].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[5].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[5].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[6].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[6].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[6].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/7."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[6].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[6].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[6].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[6].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[7].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[7].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[7].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/8."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[7].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[7].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[7].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[7].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[10].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[10].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[10].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/11."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[10].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[10].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[10].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[10].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[11].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[11].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[11].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/11."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[11].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[11].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[11].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[11].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[12].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[12].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[12].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/13."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[12].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[12].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[12].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[12].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[13].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[13].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[13].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/13."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[13].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[13].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[13].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[13].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
            </div>
            <div id="items-bottom">
                <div class="item-template-64 qe<%=m_Gear.Slots[15].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[15].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[15].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/16."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[15].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[15].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[15].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[15].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[16].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[16].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[16].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/17."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[16].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[16].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[16].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[16].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
                <div class="item-template-64 qe<%=m_Gear.Slots[17].Item(m_Me.Expansion()).Quality %>" style="background-image: url('<%=((m_Gear.Slots[17].ItemID > 0) ? "/Assets/icons/"+m_Gear.Slots[17].Item(m_Me.Expansion()).IconName+"."+imgType2 : "/Assets/armory/18."+imgType) %>');"><a href="#"><%=((m_Gear.Slots[17].Item(m_Me.Expansion()).Quantity(m_Me.ServerID)>0) ? m_Gear.Slots[17].Item(m_Me.Expansion()).Quantity(m_Me.ServerID).ToString() : "") %></a><a href="/Armory/Item/?i=<%=m_Gear.Slots[17].ItemID %>"><div onmouseover="tt_show(this,1,<%=m_Gear.Slots[17].ItemID %>,[], <%=m_Me.CharId %>)"></div></a></div>
            </div>
            <div id="resistances">
                <div><%=m_Gear.GetStatByType(1, m_Me.Expansion()) %></div>
                <div><%=m_Gear.GetStatByType(2, m_Me.Expansion()) %></div>
                <div><%=m_Gear.GetStatByType(5, m_Me.Expansion()) %></div>
                <div><%=m_Gear.GetStatByType(3, m_Me.Expansion()) %></div>
                <div><%=m_Gear.GetStatByType(4, m_Me.Expansion()) %></div>
            </div>
            <div class="powerbar bbdesign"><%=m_Gear.GetStatByType(28, m_Me.Expansion())*10 + m_Gear.GetStatByType(32, m_Me.Expansion()) %></div>
            <div class="powerbar bbdesign" id="<%=((new[]{2,3,4,5,6,7,8}).Contains(m_Me.RefMisc.Class) ? "mana" : (m_Me.RefMisc.Class == 1) ? "energy" : "rage") %>"><%=((new[]{2,3,4,5,6,7,8}).Contains(m_Me.RefMisc.Class) ? m_Gear.GetStatByType(29, m_Me.Expansion())*15 + m_Gear.GetStatByType(31, m_Me.Expansion()) : 100) %></div>
            <div id="modeloptions">
                <label><div class="foolLH">T</div><input type="checkbox" id="omodel" onclick="toggleCookie('viewthreedmodel'); location.reload();" <% if (Request.Cookies.Get("viewthreedmodel") != null && Request.Cookies["viewthreedmodel"].Value == "true"){ Response.Write("checked"); } %>/><label style="float:none" for="omodel">View 3D Model</label></label><br />
                <label><div class="foolLH">T</div><input type="checkbox" id="ohead" onclick="toggleCookie('viewhead'); location.reload();" <% if (Request.Cookies.Get("viewhead") != null && Request.Cookies["viewhead"].Value != "true"){ Response.Write("checked"); } %>/></label><label style="float:none" for="ohead">Hide Head</label>
            </div>
            <label><div class="foolLH">T</div><select runat="server" id="itemsets" onchange="this.form.submit()"></select></label>
        </div>
        <div id="stats">
            <table class="table noborder bbdesign">
                <thead>
                    <tr>
                        <td colspan="2">
                            Attributes
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Strength</td>
                        <td><%=m_Gear.GetStatByType(26, m_Me.Expansion()) %></td>
                    </tr>
                    <tr>
                        <td>Agility</td>
                        <td><%=m_Gear.GetStatByType(27, m_Me.Expansion()) %></td>
                    </tr>
                    <tr>
                        <td>Stamina</td>
                        <td><%=m_Gear.GetStatByType(28, m_Me.Expansion()) %></td>
                    </tr>
                    <tr>
                        <td>Intellect</td>
                        <td><%=m_Gear.GetStatByType(29, m_Me.Expansion()) %></td>
                    </tr>
                    <tr>
                        <td>Spirit</td>
                        <td><%=m_Gear.GetStatByType(30, m_Me.Expansion()) %></td>
                    </tr>
                </tbody>
            </table>
            <table class="table noborder bbdesign" id="meele">
                <thead>
                <tr>
                    <td colspan="2">
                        Melee
                        <div class="arrowright" onclick="IterateMenu('meele', 'ranged', 1)"></div>
                        <div class="arrowleft" onclick="IterateMenu('meele', 'defense', 1)"></div>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Attackpower</td>
                    <td><%=m_Gear.GetStatByType(8, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td>Hit</td>
                    <td><%=m_Gear.GetStatByType(6, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td>Crit</td>
                    <td><%=m_Gear.GetStatByType(7, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
            <table class="table noborder bbdesign" id="ranged" style="display: none;">
                <thead>
                <tr>
                    <td colspan="2">
                        Ranged
                        <div class="arrowright" onclick="IterateMenu('ranged', 'spells', 1)"></div>
                        <div class="arrowleft" onclick="IterateMenu('ranged', 'meele', 1)"></div>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Attackpower</td>
                    <td><%=m_Gear.GetStatByType(24, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td>Hit</td>
                    <td><%=m_Gear.GetStatByType(6, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td>Crit</td>
                    <td><%=m_Gear.GetStatByType(7, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
            <table class="table noborder bbdesign" id="spells" style="display: none;">
                <thead>
                <tr>
                    <td colspan="2">
                        Spell
                        <div class="arrowright" onclick="IterateMenu('spells', 'defense', 1)"></div>
                        <div class="arrowleft" onclick="IterateMenu('spells', 'ranged', 1)"></div>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Spellpower</td>
                    <td><%=m_Gear.GetStatByType(12, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td>Bonus healing</td>
                    <td><%=m_Gear.GetStatByType(13, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td>Hit</td>
                    <td><%=m_Gear.GetStatByType(22, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td>Crit</td>
                    <td><%=m_Gear.GetStatByType(23, m_Me.Expansion()) %></td>
                </tr>
                <tr>
                    <td>Mana regeneration</td>
                    <td><%=m_Gear.GetStatByType(20, m_Me.Expansion()) %></td>
                </tr>
                </tbody>
            </table>
        <table class="table noborder bbdesign" id="defense" style="display: none;">
            <thead>
            <tr>
                <td colspan="2">
                    Defense
                    <div class="arrowright" onclick="IterateMenu('defense', 'meele', 1)"></div>
                    <div class="arrowleft" onclick="IterateMenu('defense', 'spells', 1)"></div>
                </td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Armor</td>
                <td><%=m_Gear.GetArmor(m_Me.Expansion()) %></td>
            </tr>
            <tr>
                <td>Defense</td>
                <td><%=m_Gear.GetStatByType(21, m_Me.Expansion()) %></td>
            </tr>
            <tr>
                <td>Dodge</td>
                <td><%=m_Gear.GetStatByType(9, m_Me.Expansion()) %></td>
            </tr>
            <tr>
                <td>Parry</td>
                <td><%=m_Gear.GetStatByType(10, m_Me.Expansion()) %></td>
            </tr>
            <tr>
                <td>Block</td>
                <td><%=m_Gear.GetStatByType(11, m_Me.Expansion()) %></td>
            </tr>
            </tbody>
        </table>
            <table class="table noborder bbdesign">
                <thead>
                    <tr>
                        <td colspan="2">
                            PvP: Current
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Rank</td>
                        <td><%=Utility.GetRankName(m_Me.Faction, m_Me.RefHonor.Rank) %> (<%=m_Me.RefHonor.Rank %>)</td>
                    </tr>
                    <tr>
                        <td>Rank Progress</td>
                        <td><%=Math.Round(m_Me.RefHonor.Progress/1000.0, 1) %>%</td>
                    </tr>
                    <tr>
                        <td>Standing</td>
                        <td><%=m_Me.RefHonor.Standing %></td>
                    </tr>
                    <tr>
                        <td>Rank Change</td>
                        <td><%=Math.Round(m_CurrentWeekChange/5000.0, 1) %>%</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        <table class="table noborder bbdesign" id="lifetime">
            <thead>
            <tr>
                <td colspan="2">
                    PvP: Lifetime
                    <div class="arrowright" onclick="IterateMenu('lifetime', 'today', 2)"></div>
                    <div class="arrowleft" onclick="IterateMenu('lifetime', 'lastweek', 2)"></div>
                </td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Highest Rank</td>
                <td><%=Utility.GetRankName(m_Me.Faction, m_LifeTimeRank) %> (<%=m_LifeTimeRank %>)</td>
            </tr>
            <tr>
                <td>Honorable Kills</td>
                <td><%=m_Me.RefHonor.HK %></td>
            </tr>
            <tr>
                <td>Dishonorable Kills</td>
                <td><%=m_Me.RefHonor.DK %></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            </tbody>
        </table>
        <table class="table noborder bbdesign" id="today" style="display: none;">
            <thead>
            <tr>
                <td colspan="2">
                    PvP: Today
                    <div class="arrowright" onclick="IterateMenu('today', 'yesterday', 2)"></div>
                    <div class="arrowleft" onclick="IterateMenu('today', 'lifetime', 2)"></div>
                </td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Honorable Kills</td>
                <td><%=m_Today.HK %></td>
            </tr>
            <tr>
                <td>Dishonorable Kills</td>
                <td><%=m_Today.DK %></td>
            </tr>
            <tr>
                <td>Honor</td>
                <td><%=m_Today.Honor %></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            </tbody>
        </table>
        <table class="table noborder bbdesign" id="yesterday" style="display: none;">
            <thead>
            <tr>
                <td colspan="2">
                    PvP: Yesterday
                    <div class="arrowright" onclick="IterateMenu('yesterday', 'thisweek', 2)"></div>
                    <div class="arrowleft" onclick="IterateMenu('yesterday', 'today', 2)"></div>
                </td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Honorable Kills</td>
                <td><%=m_Yesterday.HK %></td>
            </tr>
            <tr>
                <td>Dishonorable Kills</td>
                <td><%=m_Yesterday.DK %></td>
            </tr>
            <tr>
                <td>Honor</td>
                <td><%=m_Yesterday.Honor %></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            </tbody>
        </table>
        <table class="table noborder bbdesign" id="thisweek" style="display: none;">
            <thead>
            <tr>
                <td colspan="2">
                    PvP: This week
                    <div class="arrowright" onclick="IterateMenu('thisweek', 'lastweek', 2)"></div>
                    <div class="arrowleft" onclick="IterateMenu('thisweek', 'yesterday', 2)"></div>
                </td>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Honorable Kills</td>
                <td><%=m_ThisWeek.HK %></td>
            </tr>
            <tr>
                <td>Dishonorable Kills</td>
                <td><%=m_ThisWeek.DK %></td>
            </tr>
            <tr>
                <td>Honor</td>
                <td><%=m_ThisWeek.Honor %></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
            </tr>
            </tbody>
        </table>
        <table class="table noborder bbdesign" id="lastweek" style="display: none;">
            <thead>
            <tr>
                <td colspan="2">
                    PvP: Last week
                    <div class="arrowright" onclick="IterateMenu('lastweek', 'lifetime', 2)"></div>
                    <div class="arrowleft" onclick="IterateMenu('lastweek', 'thisweek', 2)"></div>
                </td>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Rank</td>
                    <td><%=Utility.GetRankName(m_Me.Faction, m_LastWeek.Rank) %> (<%=m_LastWeek.Rank %>)</td>
                </tr>
                <tr>
                    <td>Rank Progress</td>
                    <td><%=Math.Round(m_LastWeek.Progress/1000.0, 1) %>%</td>
                </tr>
                <tr>
                    <td>Standing</td>
                    <td><%=m_LastWeek.Standing %></td>
                </tr>
                <tr>
                    <td>Honor</td>
                    <td><%=m_LastWeek.Honor %></td>
                </tr>
                <tr>
                    <td>Rank Change</td>
                    <td><%=Math.Round(m_LastWeekChange/5000.0,1) %>%</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>   
    <div id="middle-container" class="bgbox">
        
        <%=mTalents %>
        <%=mProfs %>
        <table class="table noborder bbdesign bigger" id="guildhistory">
            <thead>
                <tr>
                    <td colspan="2">Guildhistory</td>
                </tr>
            </thead>
            <tbody>
                <%=m_GuildHistory.ToString() %>
            </tbody>
        </table>
        <table id="latestraids" class="table noborder bbdesign">
            <thead>
                <tr>
                    <td colspan="2">Attended raids</td>
                </tr>
            </thead>
            <tbody>
                <%=m_AttendedRaidsTable.ToString() %>
            </tbody>
            <tfoot>
                <td colspan="2"><a href="/Armory/Raids/?charid=<%=m_Me.CharId %>">View earlier</a></td>
            </tfoot>
        </table>
        <table id="itemhistory" class="table noborder bbdesign">
            <thead>
                <tr>
                    <td colspan="2">Itemhistory</td>
                </tr>
            </thead>
            <tbody>
                <%=m_ItemHistoryTable.ToString() %>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2"><a href="/Armory/Itemhistory/?charid=<%=m_Me.CharId %>">View earlier</a></td>
                </tr>
            </tfoot>
        </table>
    </div>
    <div id="right-container" class="bgbox">
        
        <!-- Armory -->
        <%=mAds %>

        <select runat="server" id="pmMode" style="width: 410px; position: relative; margin: 0 0 5px 0;" onchange="this.form.submit()">
        </select>

        <%=m_Rankings.ToString() %>
    </div>
    <script type="text/javascript">
    LoadUp();</script>
    </form>
</asp:Content>

