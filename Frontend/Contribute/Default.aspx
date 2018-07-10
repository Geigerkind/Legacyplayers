<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Contribute_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/infotext.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Contribute
    </div>
    <div class="bgbox infobox">
        <h1>Contribute</h1>
        <p>
            LegacyPlayers relies on data that is uploaded by you. Every private server is a black box for us. <br />
            Which is why we need you to open this black box for us and provide us with a stream of data that let's us know what is going on in there.<br />
        </p>
        <h2>How does it work</h2>
        <p>
            Contributors are required to install a client and an ingame addon, which will collect and upload the data to our servers.<br />
            Once it is uploaded, the data is being processed and made visible in the respective overview.<br />
            This might take a few minutes though, when the server is under much stress.<br />
        </p>
        <h2>Contribute</h2>
        <p>
            Setting everything up in order to contribute data takes no time.<br />
            -8. <b>Note: Check in your Account Panel, if the log has been uploaded!</b> <br />
            -7. <b>Note: Always make sure that your Addon Version is up-to-date!</b> <br />
            -6. <b>Note: Always make sure that your UID in your config.txt matches with a freshly downloaded one!</b> <br />
            -5. <b>Note: Disable SwStatsFixLogStrings addon, the collector addon is not compatable with it!</b> <br />
            -4. <b>Note: You can only use ONE client at a time when using the launcher!</b> <br />
            -3. <b>Note: Changing the account during an record session is not possible, you need to do a full restart for that.</b> <br />
            -2. <b>Note: Only the english client is supported currently! </b><br />
            -1 Note: Multi Clienting is not supported currently! If you want to change the account, close the client and upload the log! <br />
            0. The launcher requires JRE 8 or higher. Make sure you have installed <a href="http://www.oracle.com/technetwork/java/javase/downloads/jre10-downloads-4417026.html" target="_blank" rel="noopener">this</a>.<br />
            1. Download the Launcher (<a href="/RPLLLauncher.jar">jar</a> / <a href="/RPLLLauncher(64bit).exe">64 bit exe</a> / <a href="/RPLLLauncher(32bit).exe">32 bit exe</a>) and the Ingame-AddOn (<a href="/RPLLVanilla.zip">Vanilla</a> / <a href="/RPLLTBC.zip">TBC</a> / <a href="/RPLLWOTLK.zip">WOTLK</a>).<br />
            2. Put the RPLLLauncher into your WoW folder (Where your wow.exe is located) <br />
            3. Put the AddOn into your Interface/AddOn/ folder.<br />
            4. <a href="/Account/LogIn/">Log into your account</a> on Legacyplayers. <br />
            5. Go into your account panel and retrieve the launcher uid. Enter it in the launcher. <br />
            6. Launch the game.<br />
        </p>
        <h2>Top Data Contributors each realm</h2>
        <p>
            You can find <a href="/Contributors/">here a list</a> of the top data contributors of each realm.
        </p>
    </div>
</asp:Content>

