<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="About_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/infotext.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / About
    </div>
    <div class="bgbox infobox">
        <h1>About LegacyPlayers</h1>
        <p>
            LegacyPlayers is a merge project of RealmPlayers.com and Legacy-Logs.com, which were developed by Dilatazu and Shino.<br />
            We decided to work together and unite our strengths.<br />
            LegacyPlayers provides an Armory, Raid and PvP stats for every World of Warcraft non funserver like private server.<br />
            Our goals lie on stability, performance and utility, and yet to show every information possible in an readable manner.<br />
            By this we attempt to unite the Legacy-WoW community.
        </p>
        <h2>How does it work</h2>
        <p>
            Contributors are required to install a client and an ingame addon, which will collect and upload the data to our servers.<br />
            Once it is uploaded, the data is being processed and made visible in the respective overview.<br />
            This might take a few minutes though, when the server is under much stress.<br />
            <a href="/Contribute/">Click here for more information.</a>
        </p>
        <h2>Extra thanks</h2>
        <p>
            <b>LegacyPlayers-Project:</b><br /><br />

            <b>Former RealmPlayers-Project:</b><br />
            <b>Sethzer</b> - Alpha/Beta tester and general supporter with great data contributions since day one<br />
            <b>Ateni</b> - Help with website design template<br />
            <b>Sixt</b> - Thanks for converting those tables of Enchant and Suffix IDs to something useful!<br />
            <b>Medelane</b> - Thanks for the great idea of making donations more visible!<br />
            <br />
            <b>Former Legacy-Logs-Project:</b><br />
            <b>Weasel</b> - Thank you for providing the name "Legacy Logs".<br />
            <b>Dalloway</b> - Thank you for testing the page, correcting my bad english and telling me useful features. <br />
            <b>Terrorpuschl </b>- Thank you for a lot of suggestions, test logs and help to test DPSMate and this site. <br />
            <b>Epia</b> - Thank you for a lot of bugreports and logs. <br />
            <b>Kryptik</b> - Thank you for a lot of bugreports and logs. <br />
            <b>Badorr</b> - Thank you for a lot of bugreports and logs. <br />
            <b>Inheritance </b>- Thank you guys for providing me with the logs!<br />
            <b>Neo</b> - Thanks you for providing this awesome design! <br />
            <b>Nether</b> - Thank you for helping me with pretty much anything. Without you I could't have released TBC so early! <br />
            <b>Bandyto</b> - Thank you for answering stupid questions and providing me with logs and suggestions! <br />
            <b>Dreamstate</b> - Thank you guys for beta testing DPSMate and providing me with test logs I can use! <br />
            <br />
            <b>All Donators</b> - Thanks a lot for all the donations! We appreciate the support a lot :)
            <br />
            TODO: List of all Contributors in the Discord pre alpha
        </p>
    </div>
    <div class="bgbox infobox">
        <h1>About everything</h1>
        <h2>Existing projects</h2>
        <p>
            LegacyPlayers - Armory and Raid/BG stats. (Started 21.03.2017)<br />
            RPLLCollector - Ingame support addon for LegacyPlayers. (Started 6.03.2017)<br />
            RPLLLauncher - Client to send data to LegacyPlayers. (Started 01.10.2017)
        </p>
        <h2>Changelog</h2>
        <p>
            You can find the project changelog <a href="/Service/Changelog/">here</a>.
        </p>
        <h2>Contact and Bug reports</h2>
        <p>
            If you want to submit a bugreport please use <a href="https://github.com/Geigerkind/RPLL/issues">this formular</a>.<br />
            Otherwise use the <a href="/Service/Contact/">contact formular</a>.
        </p>
        <h2>Donate</h2>
        <p>
            If you like this project, we would be very happy for any donations.<br />
            Donations help us to keep improving this project and keeps us motivated. It also supports us to pay the server cost.<br />
            DONATE BUTTON
        </p>
    </div>
</asp:Content>

