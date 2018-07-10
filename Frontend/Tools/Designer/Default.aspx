<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Tools_Designer_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <!--<script type="text/javascript" src="/Assets/Js/Pages/jquery.js"></script>
    <script type="text/javascript" src="/Assets/Js/Pages/wmmv.js"></script>-->
    <script type="text/javascript" src="/Assets/Js/Pages/suggest.js"></script>
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/designer.min.css" />
<!--<link rel="stylesheet" type="text/css" href="/Assets/Css/main.min.css" />
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Pages/designer.css" />-->
    <style>
        #suggest {
            position: absolute;
            background-color: #FFFFFF;
            border: 1px solid #CCCCFF;
            font-size: 90%;
            width: 330px;
            color: black !important;
            z-index: 10;
        }
        #suggest div {
            display: block;
            width: 330px;
            overflow: hidden;
            white-space: nowrap;
            z-index: 10;
        }
        #suggest div.select{ /* keydown, keyup */
            color: black !important;
            background-color: #3366FF;
            z-index: 10;
        }
        #suggest div.over{ /* mouse over */
            background-color: #99CCFF;
            z-index: 10;
        }
        .inputLabel {
            position: absolute;
            margin-top: 4px;
            margin-left: 290px;
            color: #999999;
            z-index: 2;
        }
    </style>
    <script type="text/javascript">
        function IterateMenu(cur, next, id) {
            document.getElementById(cur).style.display = "none";
            document.getElementById(next).style.display = "table";
            setCookie("Armory_Menu" + id, next, 30);
        }
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <form runat="server" id="generator">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Character Designer
    </div>
    <div id="left-container" class="bgbox">
        <div id="model" class="model">
            <script>
                document.getElementById('model').style.backgroundImage = 'url(/Assets/armory/<%=mGender %>-<%=mRace %>.png)';
            </script>
        </div>
        <div id="playerframe">
            <div id="names-top">
                <input type="hidden" id="shortlink" value="false" name="shortlink" runat="server"/>
                Click <a href="#" onclick="document.getElementById('ctl00_ContentPlaceHolder1_generator').elements['ctl00_ContentPlaceHolder1_shortlink'].value = 'true'; document.getElementById('ctl00_ContentPlaceHolder1_generator').submit();">here</a> to create a short link for this Character
            </div>
            
            <div id="items-left">
                <div class="item-template-64 qe<%=mItemSlots[0].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[0].Icon != "" ? "/Assets/icons/"+mItemSlots[0].Icon + ".jpg" : "/Assets/armory/1.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[0].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[1].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[1].Icon != "" ? "/Assets/icons/"+mItemSlots[1].Icon + ".jpg" : "/Assets/armory/2.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[1].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[2].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[2].Icon != "" ? "/Assets/icons/"+mItemSlots[2].Icon + ".jpg" : "/Assets/armory/3.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[2].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[3].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[3].Icon != "" ? "/Assets/icons/"+mItemSlots[3].Icon + ".jpg" : "/Assets/armory/15.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[3].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[4].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[4].Icon != "" ? "/Assets/icons/"+mItemSlots[4].Icon + ".jpg" : "/Assets/armory/5.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[4].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[5].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[5].Icon != "" ? "/Assets/icons/"+mItemSlots[5].Icon + ".jpg" : "/Assets/armory/4.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[5].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[6].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[6].Icon != "" ? "/Assets/icons/"+mItemSlots[6].Icon + ".jpg" : "/Assets/armory/19.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[6].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[7].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[7].Icon != "" ? "/Assets/icons/"+mItemSlots[7].Icon + ".jpg" : "/Assets/armory/9.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[7].Serialize()+";"+mExpansion) %>',[])"></div></div>
            </div>
            <div id="items-right">
                <div class="item-template-64 qe<%=mItemSlots[8].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[8].Icon != "" ? "/Assets/icons/"+mItemSlots[8].Icon + ".jpg" : "/Assets/armory/10.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[8].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[9].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[9].Icon != "" ? "/Assets/icons/"+mItemSlots[9].Icon + ".jpg" : "/Assets/armory/6.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[9].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[10].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[10].Icon != "" ? "/Assets/icons/"+mItemSlots[10].Icon + ".jpg" : "/Assets/armory/7.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[10].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[11].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[11].Icon != "" ? "/Assets/icons/"+mItemSlots[11].Icon + ".jpg" : "/Assets/armory/8.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[11].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[12].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[12].Icon != "" ? "/Assets/icons/"+mItemSlots[12].Icon + ".jpg" : "/Assets/armory/11.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[12].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[13].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[13].Icon != "" ? "/Assets/icons/"+mItemSlots[13].Icon + ".jpg" : "/Assets/armory/11.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[13].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[14].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[14].Icon != "" ? "/Assets/icons/"+mItemSlots[14].Icon + ".jpg" : "/Assets/armory/13.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[14].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[15].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[15].Icon != "" ? "/Assets/icons/"+mItemSlots[15].Icon + ".jpg" : "/Assets/armory/13.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[15].Serialize()+";"+mExpansion) %>',[])"></div></div>
            </div>
            <div id="items-bottom">
                <div class="item-template-64 qe<%=mItemSlots[16].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[16].Icon != "" ? "/Assets/icons/"+mItemSlots[16].Icon + ".jpg" : "/Assets/armory/16.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[16].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[17].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[17].Icon != "" ? "/Assets/icons/"+mItemSlots[17].Icon + ".jpg" : "/Assets/armory/17.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[17].Serialize()+";"+mExpansion) %>',[])"></div></div>
                <div class="item-template-64 qe<%=mItemSlots[18].Item(mExpansion).Quality %>" style="background-image: url('<%=(mItemSlots[18].Icon != "" ? "/Assets/icons/"+mItemSlots[18].Icon + ".jpg" : "/Assets/armory/18.png") %>');"><div onmouseover="tt_show(this,8,'<%=(mItemSlots[18].Serialize()+";"+mExpansion) %>',[])"></div></div>
            </div>
            <div id="resistances">
                <div><%=GetStatByType(1) %></div>
                <div><%=GetStatByType(2) %></div>
                <div><%=GetStatByType(5) %></div>
                <div><%=GetStatByType(3) %></div>
                <div><%=GetStatByType(4) %></div>
            </div>
            <div class="powerbar bbdesign"><%=GetStatByType(28)*10 + GetStatByType(32) %></div>
            <div class="powerbar bbdesign" id="<%=(mClass==0 ? "rage" : (mClass == 1 ? "energy" : "mana")) %>"><%=(mClass <= 1 ? 100 : GetStatByType(29)*15 + GetStatByType(31)) %></div>
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
                        <td><%=GetStatByType(26) %></td>
                    </tr>
                    <tr>
                        <td>Agility</td>
                        <td><%=GetStatByType(27) %></td>
                    </tr>
                    <tr>
                        <td>Stamina</td>
                        <td><%=GetStatByType(28) %></td>
                    </tr>
                    <tr>
                        <td>Intellect</td>
                        <td><%=GetStatByType(29) %></td>
                    </tr>
                    <tr>
                        <td>Spirit</td>
                        <td><%=GetStatByType(30) %></td>
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
                    <td><%=GetStatByType(8) %></td>
                </tr>
                <tr>
                    <td>Hit</td>
                    <td><%=GetStatByType(6) %></td>
                </tr>
                <tr>
                    <td>Crit</td>
                    <td><%=GetStatByType(7) %></td>
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
                    <td><%=GetStatByType(24) %></td>
                </tr>
                <tr>
                    <td>Hit</td>
                    <td><%=GetStatByType(6) %></td>
                </tr>
                <tr>
                    <td>Crit</td>
                    <td><%=GetStatByType(7) %></td>
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
                    <td><%=GetStatByType(12) %></td>
                </tr>
                <tr>
                    <td>Bonus healing</td>
                    <td><%=GetStatByType(13) %></td>
                </tr>
                <tr>
                    <td>Hit</td>
                    <td><%=GetStatByType(22) %></td>
                </tr>
                <tr>
                    <td>Crit</td>
                    <td><%=GetStatByType(23) %></td>
                </tr>
                <tr>
                    <td>Mana regeneration</td>
                    <td><%=GetStatByType(20) %></td>
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
                <td><%=GetArmor() %></td>
            </tr>
            <tr>
                <td>Defense</td>
                <td><%=GetStatByType(21) %></td>
            </tr>
            <tr>
                <td>Dodge</td>
                <td><%=GetStatByType(9) %></td>
            </tr>
            <tr>
                <td>Parry</td>
                <td><%=GetStatByType(10) %></td>
            </tr>
            <tr>
                <td>Block</td>
                <td><%=GetStatByType(11) %></td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
    <div id="right-container" class="bgbox">
        <h1>Search for Ids:</h1>
        <input id="text" type="text" name="pattern" value="" autocomplete="off" size="10" placeholder="Name..." style="display: block">
        <input type="text" id="itemid" value="" autocomplete="off" size="10" placeholder="Id..." style="display: block">
        <!-- suggestion area -->
        <div id="suggest" style="display:none;"></div>

        <h1>Pattern: ItemId;EnchId;GemId1;GemId2;GemId3</h1>
        <label for="s1" class="inputLabel">Head</label>
        <input type="text" name="s1" id="s1" runat="server" />
        <label for="s2" class="inputLabel">Neck</label>
        <input type="text" name="s2" id="s2" runat="server" />
        <label for="s3" class="inputLabel">Shoulder</label>
        <input type="text" name="s3" id="s3" runat="server" />
        <label for="s4" class="inputLabel">Back</label>
        <input type="text" name="s4" id="s4" runat="server" />
        <label for="s5" class="inputLabel">Chest</label>
        <input type="text" name="s5" id="s5" runat="server" />
        <label for="s6" class="inputLabel">Shirt</label>
        <input type="text" name="s6" id="s6" runat="server" />
        <label for="s7" class="inputLabel">Tabard</label>
        <input type="text" name="s7" id="s7" runat="server" />
        <label for="s8" class="inputLabel">Wrist</label>
        <input type="text" name="s8" id="s8" runat="server" />
        <label for="s9" class="inputLabel">Gloves</label>
        <input type="text" name="s9" id="s9" runat="server" />
        <label for="s10" class="inputLabel">Belt</label>
        <input type="text" name="s10" id="s10" runat="server" />
        <label for="s11" class="inputLabel">Legs</label>
        <input type="text" name="s11" id="s11" runat="server" />
        <label for="s12" class="inputLabel">Feet</label>
        <input type="text" name="s12" id="s12" runat="server" />
        <label for="s13" class="inputLabel">Ring 1</label>
        <input type="text" name="s13" id="s13" runat="server" />
        <label for="s14" class="inputLabel">Ring 2</label>
        <input type="text" name="s14" id="s14" runat="server" />
        <label for="s15" class="inputLabel">Trinket 1</label>
        <input type="text" name="s15" id="s15" runat="server" />
        <label for="s16" class="inputLabel">Trinket 2</label>
        <input type="text" name="s16" id="s16" runat="server" />
        <label for="s17" class="inputLabel">Mainhand</label>
        <input type="text" name="s17" id="s17" runat="server" />
        <label for="s18" class="inputLabel">Offhand</label>
        <input type="text" name="s18" id="s18" runat="server" />
        <label for="s19" class="inputLabel">Ranged</label>
        <input type="text" name="s19" id="s19" runat="server" />
        <script type="text/javascript">
            var list = [<%=mItems %>];
            var idList = [<%=mItemIds %>];
            function startSuggest() {
                new Suggest.Local(
                    "text",    // input element id.
                    "suggest", // suggestion area id.
                    list,      // suggest candidates list
                    { dispMax: 20, interval: 100 }); // options
            }

            function SetItemId(index) {

                document.getElementById("itemid").value = idList[index];
            }
            
            window.addEventListener ?
                window.addEventListener('load', startSuggest, false) :
                window.attachEvent('onload', startSuggest);
        
        </script>
    </div>
    <div id="rightest-container" class="bgbox">
        <select id="pmExpansion" runat="server" onchange="document.getElementById('ctl00_ContentPlaceHolder1_generator').submit();">
            <option value="0">Vanilla</option>
            <option value="1">TBC</option>
            <option value="2">WOTLK</option>
        </select>
        <select id="pmRace" runat="server">
            <option value="0">Human</option>
            <option value="1">Dwarf</option>
            <option value="2">Gnome</option>
            <option value="3">Nightelf</option>
            <option value="4">Draenei</option>
            <option value="5">Orc</option>
            <option value="6">Troll</option>
            <option value="7">Tauren</option>
            <option value="8">Undead</option>
            <option value="9">Bloodelf</option>
        </select>
        <select id="pmGender" runat="server">
            <option value="3">Female</option>
            <option value="1">Male</option>
        </select>
        <select id="pmClass" runat="server">
            <option value="0">Warrior</option>
            <option value="1">Rogue</option>
            <option value="2">Priest</option>
            <option value="3">Hunter</option>
            <option value="4">Druid</option>
            <option value="5">Mage</option>
            <option value="6">Warlock</option>
            <option value="7">Paladin</option>
            <option value="8">Shaman</option>
            <option value="9">Deathknight</option>
        </select>
        <select id="pmSpec" runat="server">
            <option value="0">No specialization</option>
        </select>
        <input type="submit" value="Generate" runat="server" />
    </div>
    </form>
</asp:Content>

