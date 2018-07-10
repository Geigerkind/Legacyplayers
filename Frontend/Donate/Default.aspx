<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Donate_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/infotext.min.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="bgbox linkbar">
        <a href="/">Home</a> / Donate
    </div>
    <div class="bgbox infobox">
        <h1>Donate for stability and improvement</h1>
        <p>
            Please consider donating if you like the projects we develop and want to support and help make them even better. Leave a comment as either anonymous or with your ingame name to be listed on the <a href="/Donators">Donators page</a>
        </p>
        PAYPAL BUTTON PLACEHOLDER
        <h2>Donations will go towards the following:</h2>
        <h3>Server costs</h3>
        <p>
            The server is hosted at OVH. Currently it costs monthly ~10€. This amount might increase though with increasing interest for this website. Donations help us being able to continue hosting the website with as good, reliable and stable service as possible.
        </p>
        <h3>Working</h3>
        <p>
            The start of the project goes back in august 2013 where Dilatazu started realmplayers.com and and april 2016 where Shino started legacy-logs.com.<br />
            At the 21th March 2017 Dilatzu and Shino decided to merge their experience and began to rewrite the project as a whole in order to build up this project.<br />
            Donations are a big motivator for us to continue improving the service with new features, solving stability issues, adding contributors and other things related to the project.
        </p>
        <h2>For more information on what we work on you can take a look at the <a href="/Service/Changelog/">changelog</a></h2>
    </div>
</asp:Content>

