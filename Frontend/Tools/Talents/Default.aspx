<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="Tools_Talents_Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
    <link rel="stylesheet" type="text/css" href="/Assets/Css/Bundles/talentcalc.min.css" />
    <script type="text/javascript" src="/Assets/Js/Pages/talentCon.js"></script>
    <script type="text/javascript">
		g_locale = { id: 0, name: 'enus' };
		g_glyphs = [];
		ss_conf = 3;
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
     <div class="bgbox linkbar">
        <a href="/">Home</a> / Tools / Talent Calculator
    </div>
    <div class="talentcontainer">
        <div id="con1" style="min-width:135px;max-width:135px">
			<div id="tc-classes-inner"></div>
        </div>
        <div id="con2" style="min-width:650px;max-width:650px;margin-left: 35px;">
            <div class="blackframe" style="margin-top: 3px;">
                <div id="tc-itself"></div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        tc_init();
	</script>
</asp:Content>

