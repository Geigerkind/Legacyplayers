<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="PvP_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/raidoverview.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar" style="margin-bottom: 20px;">
        <a href="/">Home</a> / PvP
    </div>
    <form action="" method="post">
        <label><div class="foolLH">T</div><input class="rText" type="text" name="name" placeholder="Enter a guild"/></label>
        <label><div class="foolLH">T</div><input class="rText" type="text" name="date" placeholder="Date: (Format dd-mm-yyyy)"/></label>
        <label><div class="foolLH">T</div><input class="rText" type="text" name="duration" placeholder="Duration in minutes (e.g. </>30)"/></label>
        <label><div class="foolLH">T</div><select name="server" class="rSelect">
            <option>All server</option>
        </select></label>
        <label><div class="foolLH">T</div><select name="faction" class="rSelect">
            <option>All factions</option>
        </select></label>
        <label><div class="foolLH">T</div><select name="raids" class="rSelect">
            <option>All battlegrounds</option>
        </select></label>
        <label><div class="foolLH">T</div><input id="submit" type="submit" value="Search" /></label>
    </form>
    <table class="table noborder bbdesign" id="overview">
        <thead>
            <tr>
                <td>#Nr</td>
                <td>Guild</td>
                <td>Raid Instance</td>
                <td>Start Date</td>
                <td>End Date</td>
                <td>Duration</td>
                <td>Realm</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>65342</td>
                <td><div class="sp sp-alliance"><div>Synced</div></div></td>
                <td><div class="sp sp-1 bbdesign"><div>Molten Core</div></div></td>
                <td>2017-03-23 14:42:02</td>
                <td>2017-03-23 16:10:51</td>
                <td>02:53:53</td>
                <td>Nefarian</td>
            </tr>
            <tr>
                <td>2</td>
                <td><div class="sp sp-alliance"><div>Synced</div></div></td>
                <td><div class="sp sp-2 bbdesign"><div>Onyxia's Liar</div></div></td>
                <td>2017-03-23 14:42:02</td>
                <td>2017-03-23 16:10:51</td>
                <td>02:53:53</td>
                <td>Nefarian</td>
            </tr>
            <tr>
                <td>1</td>
                <td><div class="sp sp-alliance"><div>Synced</div></div></td>
                <td><div class="sp sp-3 bbdesign"><div>Blackwing Lair</div></div></td>
                <td>2017-03-23 14:42:02</td>
                <td>2017-03-23 16:10:51</td>
                <td>02:53:53</td>
                <td>Nefarian</td>
            </tr>
        </tbody>
    </table>
    <div id="tableiterator">
        <a href=""><div class="bbdesign">First</div></a>
        <a href=""><div class="bbdesign">Previous</div></a>
        <%=_PLACEHOLDER %>
        <a href=""><div class="bbdesign">Next</div></a>
        <a href=""><div class="bbdesign" style="margin:0;">Last</div></a>
    </div>
</asp:Content>

