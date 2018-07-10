<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="RestAPI_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/infotext.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / RestAPI
    </div>
    <div class="bgbox infobox">
        <h1>Information</h1>
        <p>
            Legacyplayers provides a few ways for developers to extract data using its RestAPI. <br />
            Please contact Shino on Discord if more options are required.
        </p>
        <h1>Usage</h1>
        <p>
            Use the following string in order to pass your query to the server: <br />
            https://legacyplayers.com/API.aspx?type=X&Arg1=X&Arg2=X...&Arg10=X&StrArg1=X...&StrArg3
            <br />
            <b>Type 0: Tooltip Item</b><br />
            Arg1 => ItemId <br />
            Arg2 => CharId (Optional) <br />
            <br />
            <b>Type 1: Tooltip Spell</b><br />
            Not supported yet. <br />
            <br />
            <b>Type 2: Tooltip Guild progress</b><br />
            Arg1 => GuildId<br />
            Arg2 => InstanceId*<br />
            <br />
            <b>Type 3: Tooltip Guild</b><br />
            Arg1 => GuildId <br />
            <br />
            <b>Type 4: Tooltip Character</b><br />
            Arg1 => CharId <br />
            <br />
            <b>Type 5: Tooltip Row data</b><br />
            Arg1 => AbilityId<br />
            Arg2 => Raid Instance Id<br />
            Arg3 => Uploader Id<br />
            Arg4 => SourceId<br />
            Arg5 => TargetId<br />
            Arg6 => Start in ms relative to literal Start<br />
            Arg7 => End in ms relative to literal Start<br />
            Arg8 => Category Id<br />
            Arg9 => Attempt Id<br />
            Arg10 => Expansion Id<br />
            StrArg1 => Mode**<br />
            <br />
            <b>Type 6: Tooltip Row data preview</b><br />
            Arg1 => CharId/NpcId<br />
            Arg2 => Raid Instance Id<br />
            Arg3 => Uploader Id<br />
            Arg4 => SourceId<br />
            Arg5 => TargetId<br />
            Arg6 => Start in ms relative to literal Start<br />
            Arg7 => End in ms relative to literal Start<br />
            Arg8 => Category Id<br />
            Arg9 => Attempt Id<br />
            Arg10 => Expansion Id<br />
            StrArg1 => Mode**<br />
            <br />
            <b>Type 7: Character data</b><br />
            Arg1 => CharId <br />
            StrArg1 => Charname (Optional, Set Arg1 to 0) <br />
            <br />
            <b>Type 8: Guild data </b><br />
            Arg1 => GuildId <br />
            StrArg1 => Guildname (Optional, Set Arg1 to 0) <br />
            <br />
            <b>Type 9: Shortlink </b><br />
            Arg1 => Shortlink Id <br />
            Returns data in the following format: Expansion;Race;Gender;Class;Spec;ItemId1;EnchId1;GemId1_1;GemId1_2;GemId1_3;ItemId2;.... <br />
            <br />
            <b>Type 10: Loot Data </b><br />
            Arg1 => Expansion Id: 0 => Vanilla, 1 => TBC, etc.<br />
            Arg2 => UploaderId: Can be retrieved when selecting the PoV of a raid. <br />
            <br />
            <b>Type 11: Guild member </b><br />
            Arg1 => GuildId <br />
            <br />
            <b>Type 12: Raid composition </b><br />
            Arg1 => Expansion <br />
            Arg2 => Uploaderid <br />
            <br />
            <br />
            <br />
            *Instance Ids: <br />
            16 => Ony <br />
            19 => ZG <br />
            23 => MC <br />
            25 => BWL <br />
            27 => AQ20 <br />
            29 => AQ40 <br />
            31 => Naxx <br />
            32 => Hyjal <br />
            33 => Kara <br />
            36 => Mag <br />
            40 => SSC <br />
            41 => TK <br />
            52 => BT <br />
            53 => Gruul <br />
            55 => ZA <br />
            61 => Sunwell <br />
            
            <br />
            <br />
            **Modes: Basically the strings of the modes listed in the raidviewer (To be changed to ids in the future)
        </p>
    </div>
</asp:Content>

