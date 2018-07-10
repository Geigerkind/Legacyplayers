var host = location.hostname.includes("localhost") ? location.hostname + ":83" : location.hostname;

var tt;
var tt_icon;
var tt_core;
var tt_chart;
var tt_cache = [];
var xhr;

var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS");

var IE = document.all ? true : false;
if (!IE) document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = getMouseXY;
var tempX = 0;
var tempY = 0;
function getMouseXY(e) {
    if (IE) {
        tempX = event.clientX + document.body.scrollLeft;
        tempY = event.clientY + document.body.scrollTop;
    } else {
        tempX = e.pageX;
        tempY = e.pageY;
    }
    if (tempX < 0) {
        tempX = 0; }
    if (tempY < 0) {
        tempY = 0; }
    if (tt_core && tt_core.style.display === "block") {
        // alert(window.pageYOffset);
        // window.innerHeight
        // tt_core.scrollHeight
        // document.scrollingElement.scrollHeight - document.documentElement.clientHeight => pageYOffsetMax
        if (tempY + tt_core.scrollHeight > window.innerHeight + window.pageYOffset) {
            if (tempY - tt_core.scrollHeight < window.pageYOffset) {
                tt_core.style.left = tempX + 15 + "px";
                tt_core.style.top = tempY - Math.floor(tt_core.scrollHeight/2) + "px";
            } else {
                tt_core.style.left = tempX + 15 + "px";
                tt_core.style.top = tempY - tt_core.scrollHeight + "px";
            }
        } else {
            tt_core.style.left = tempX + 15 + "px";
            tt_core.style.top = tempY - 50 + "px";
        }
    }

    if (!tt_chart) {
        tt_chart = document.getElementById("chartjs-tooltip");
    }
    if (tt_chart && tt_chart.style.opacity === "1") {
        if (tempY + tt_chart.scrollHeight > window.innerHeight + window.pageYOffset) {
            if (tempY - tt_chart.scrollHeight < window.pageYOffset) {
                tt_chart.style.left = tempX + 15 + "px";
                tt_chart.style.top = tempY - floor(tt_chart.scrollHeight / 2) + "px";
            } else {
                tt_chart.style.left = tempX + 15 + "px";
                tt_chart.style.top = tempY - tt_chart.scrollHeight + "px";
            }
        } else {
            tt_chart.style.left = tempX + 15 + "px";
            tt_chart.style.top = tempY - 50 + "px";
        }
    }
    return true;
}

function processRequest(e) {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        //var tthtml = response.tooltip;

        //for (var i = 0; i < xhr.dataArr[2].length; ++i) tthtml += xhr.dataArr[2][i];
        tt_cache.push([xhr.dataArr[0], xhr.dataArr[1], response, xhr.dataArr[3]]);

        if (xhr.dataArr[0] === tt.dataArr[0] && xhr.dataArr[1] === tt.dataArr[1]) {
            tt_load(tt_cache.length-1);
        }
    }else if (xhr.status === 404) {
        tt.innerHTML = "Error retrieving information.";
    }
}

function tt_cache_exists(type, id, mode) {
    for (var i = 0; i < tt_cache.length; ++i) {
        if (tt_cache[i][0] === type && tt_cache[i][1] === id && tt_cache[i][3] === mode) {
            return i;
        }
    }
    return -1;
}

function tt_append(str) {
    tt.innerHTML += str + "<br />";
}

function tt_load(exist) {
    tt.innerHTML = tt_build(tt_cache[exist][2]);
    if (tt_cache[exist][2].Icon !== "" && tt_cache[exist][2].Icon !== undefined) {
        if (tt_cache[exist][0] === 2) {
            if (isChromium || isOpera)
                tt_icon.style.background = "rgb(0,0,0) url('/Assets/raids/" + tt_cache[exist][2].Icon + ".webp') -2px -2px/48px 48px";
            else
                tt_icon.style.background = "rgb(0,0,0) url('/Assets/raids/" + tt_cache[exist][2].Icon + ".png') -2px -2px/48px 48px";
            if (tt_cache[exist][2].Type === 4)
                tt_icon.style.background = "rgb(0,0,0) url('/Assets/icons/" + tt_cache[exist][2].Icon + ".png') -2px -2px/48px 48px";
        } else {
            if (isChromium || isOpera)
                tt_icon.style.background = "rgb(0,0,0) url('/Assets/icons/" + tt_cache[exist][2].Icon + ".webp') -2px -2px/48px 48px";
            else
                tt_icon.style.background = "rgb(0,0,0) url('/Assets/icons/" + tt_cache[exist][2].Icon + ".jpg') -2px -2px/48px 48px";   

            if (tt_cache[exist][2].Type === 4)
                tt_icon.style.background = "rgb(0,0,0) url('/Assets/icons/" + tt_cache[exist][2].Icon + ".png') -2px -2px/48px 48px";
        }
        tt_icon.style.display = "block";
    } else {
        tt_icon.style.display = "none";
    }
}

function tt_AddLineIfNotEmpty(val, linebreak) {
    if (val == "")
        return "";
    if (linebreak)
        return val + "<br />";
    return val;
}

var statTypes = [
    "Holy Resistance",
    "Fire Resistance",
    "Nature Resistance",
    "Frost Resistance",
    "Shadow Resistance",
    "Arcane Resistance",
    "On Equip: Improves your chance to hit by $1%.",
    "On Equip: Improves your chance to get a critical strike by $1%.",
    "On Equip: +$1 Attack Power.",
    "On Equip: Increases your chance to dodge an attack by $1%.",
    "On Equip: Increases your chance to parry an attack by $1%.",
    "On Equip: Increases the block value of your shield by $1.", // Same in tbc and wotlk
    "On Equip: Increases damage done by magical spells and effects by up to $1.",
    "On Equip: Increases healing done by magical spells and effects by up to $1.",
    "On Equip: Increases damage done by Holy spells and effects by up to $1.",
    "On Equip: Increases damage done by Frost spells and effects by up to $1.",
    "On Equip: Increases damage done by Nature spells and effects by up to $1.",
    "On Equip: Increases damage done by Fire spells and effects by up to $1.",
    "On Equip: Increases damage done by Arcane spells and effects by up to $1.",
    "On Equip: Increases damage done by Shadow spells and effects by up to $1.",
    "On Equip: Restores $1 mana per 5 sec.",
    "On Equip: Increased Defense +$1.",
    "On Equip: Improves your chance to hit with spells by $1%.",
    "On Equip: Improves your chance to get a critical strike with spells by $1%.",
    "On Equip: +$1 Ranged Attack Power.",
    "On Equip: Increases your chance to block attacks with a shield by $1%.",
    "Strength",
    "Agility",
    "Stamina",
    "Intellect",
    "Spirit",
    "Mana",
    "Health",
    "Armor",
    "Prismatic Resistance",
    "All Stats",
    "On Equip: Improves haste rating by $1.",
    "On Equip: Increases expertise rating by $1.",
    "On Equip: Improves your resilience rating by $1.",
    "On Equip: Increases your spell penetration by $1.",
    "On Equip: Your attacks ignore $1 of your opponent's armor.", // TBC
    "On Equip: Improves spell haste rating by $1.",
    "On Equip: Increases damage and healing done by magical spells and effects by up to $1.",
    "" // 44
];

var bondingTypes = [
    "",
    "Binds when picked up",
    "Binds when equipped",
    "Binds when used"
];

var sheathTypes = [
    "",
    "One Handed",
    "Staff",
    "Two Handed Weapon",
    "Off hand",
    "Enchanter’s Rod",
    "Off hand"
];

var inventoryTypes = [
    "Non equipable",
    "Head",
    "Neck",
    "Shoulder",
    "Shirt", // 4
    "Chest",
    "Waist",
    "Legs",
    "Feet",
    "Wrists",
    "Hands",
    "Finger",
    "Trinket",
    "Weapon",
    "Shield",
    "Ranged",
    "Back",
    "Two-Hand",
    "Bag",
    "Tabard", // 19
    "Robe",
    "Main hand",
    "Off hand",
    "Off hand",
    "Ammo",
    "Thrown",
    "Ranged",
    "Quiver",
    "Relic",
    "" // 30
];

var subClassWeapon = [
    "Axe",
    "Axe",
    "Bow",
    "Gun",
    "Mace",
    "Mace",
    "Polearm",
    "Sword",
    "Sword",
    "Obsolete",
    "Staff",
    "Exotic",
    "Exotic",
    "Fist Weapon",
    "Miscellaneous",
    "Dagger",
    "Thrown",
    "Spear",
    "Crossbow",
    "Wand",
    "Fishing Pole",
    "" // 22
];

var subClassType = [
    "Miscellaneous",
    "Cloth",
    "Leather",
    "Mail",
    "Plate",
    "Buckler(OBSOLETE)",
    "Shield",
    "Libram",
    "Idol",
    "Totem",
    "" // 11
];

var subClassMisc = [
    "Trade Goods",
    "Parts",
    "Explosives",
    "Devices",
    "Jewelcrafting",
    "Cloth",
    "Leather",
    "Metal & Stone",
    "Meat",
    "Herb",
    "Elemental",
    "Other",
    "Enchanting",
    "" // 14
];

var dmgTypes = [
    "",
    "Holy",
    "Fire",
    "Nature",
    "Frost",
    "Shadow",
    "Arcane"
];

function ExtraModToString(mod)
{
    switch (mod) {
        case 0:
            return "Hit";
        case 1:
            return "Crit";
        case 2:
            return "Glancing";
        case 3:
            return "Dodged";
        case 4:
            return "Parried";
        case 5:
            return "Resisted";
        case 6:
            return "Blocked";
        case 7:
            return "Crushing";
        case 8:
            return "Absorbed";
        case 9:
            return "Evaded";
        case 10:
            return "Interrupted";
        case 11:
            return "Immune";
        case 12:
            return "Missed";

        case 20:
            return "Hit";
        case 25:
            return "Hit (Partial)";
        case 40:
            return "Crit";
        case 45:
            return "Crit (Partial)";

    }
    return "Unknown";
}

Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    return "".concat(yyyy).concat("/").concat(mm).concat("/").concat(dd);
};

Date.prototype.yyyymmddhhmm = function () {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    return "".concat(yyyy).concat("/").concat(mm).concat("/").concat(dd).concat(" ").concat(hh).concat(":").concat(min);
};

Date.prototype.yyyymmddhhmmss = function () {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    return "".concat(yyyy).concat("/").concat(mm).concat("/").concat(dd).concat(" ").concat(hh).concat(":").concat(min).concat(":").concat(ss);
};

Date.prototype.hhmmss = function () {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    return "".concat(hh).concat(":").concat(min).concat(":").concat(ss);
};

Date.prototype.hhmmssfff = function () {
    var yyyy = this.getFullYear();
    var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    var fff = this.getUTCMilliseconds() < 100 ? (this.getUTCMilliseconds() < 10 ? "00" + this.getUTCMilliseconds() : "0" + this.getUTCMilliseconds()) : this.getUTCMilliseconds();
    return "".concat(hh).concat(":").concat(min).concat(":").concat(ss).concat(":").concat(fff);
};

function tt_build(jA) {
    if (jA.Error && jA.Error !== "" && jA.Error !== "None")
        return jA.Error;
    
    switch (jA.Type) {
        case 0: // Items
            if (jA.expansion === 1) {
                statTypes[6] = "On Equip: Increases your hit rating by $1.";
                statTypes[7] = "On Equip: Increases your critical strike rating by $1.";
                statTypes[8] = "On Equip: Increases attack power by $1.";
                statTypes[9] = "On Equip: Increases your dodge rating by $1.";
                statTypes[10] = "On Equip: Increases your parry rating by $1.";
                statTypes[25] = "On Equip: Increases your block rating by $1.";
                statTypes[21] = "On Equip: Increases defense rating by $1.";
            }
            else {
                statTypes[6] = "On Equip: Improves your chance to hit by $1%.";
                statTypes[7] = "On Equip: Improves your chance to get a critical strike by $1%.";
                statTypes[8] = "On Equip: +$1 Attack Power.";
                statTypes[9] = "On Equip: Increases your chance to dodge an attack by $1%.";
                statTypes[10] = "On Equip: Increases your chance to parry an attack by $1%.";
                statTypes[25] = "On Equip: Increases your chance to block attacks with a shield by $1%.";
                statTypes[21] = "On Equip: Increased Defense +$1.";
            }

            if (jA.SlotEmpty)
                return "<table>Empty Slot</table>";
            var a = "<table><tr><td><b class=\"q" + jA.Quality + "\">" + jA.Name + "</b><br />" +
                tt_AddLineIfNotEmpty(bondingTypes[jA.Bonding], true) + "<table width=\"100%\"><tr><td>" +
                tt_AddLineIfNotEmpty(sheathTypes[jA.Sheath], false) +
                tt_AddLineIfNotEmpty(inventoryTypes[jA.InventoryType], false) + "</td><th>" +
                tt_AddLineIfNotEmpty(subClassWeapon[jA.SCWeapon], false) +
                tt_AddLineIfNotEmpty(subClassType[jA.SCType], false) +
                tt_AddLineIfNotEmpty(subClassMisc[jA.SCMisc], false) + "</th></tr></table>" +
                (jA.Class == 2 ?
                    "<table width=\"100%\"><tr><td>" + jA.DmgMin1 + " - " + jA.DmgMax1 + " " + dmgTypes[jA.DmgType1] + " Damage</td></th>" +
                    "Speed: " + jA.Delay + "</th></tr></table>" +
                    (jA.DmgMin2 > 0 ? "+" + jA.DmgMin2 + " - " + jA.DmgMax2 + " " + dmgTypes[jA.DmgType2] + " Damage<br />"
                        : "") +
                    (jA.DmgMin3 > 0 ? "+" + jA.DmgMin3 + " - " + jA.DmgMax3 + " " + dmgTypes[jA.DmgType3] + " Damage<br />"
                        : "")
                    : "") +
                tt_AddLineIfNotEmpty(jA.Armor, true);
            var count = 0;
            jA.Stats1.forEach(function (key) {
                a += "+" + jA.Values1[count] + " " + statTypes[key] + "<br />";
                ++count;
            });
            count = 0;
            jA.Stats2.forEach(function (key) {
                a += "+" + jA.Values2[count] + " " + statTypes[key] + "<br />";
                ++count;
            });
            if (jA.EnchStats != "")
                a += "<span class=\"q2\"> " + jA.EnchStats + "</span><br />";
            jA.Gems.forEach(function (gem) {
                a += "<img height=\"14px\" width=\"14px\" src=\"/Assets/icons/" + gem.Icon + "\"/>" +
                    "<span class=\"q" + gem.Quality + "\"> " + gem.Name + "</span><br />";
            });
            if (jA.SocketBonus !== "")
                a += "<span class=\"q" + jA.SocketBonusQuality +"\">Socket Bonus: " + jA.SocketBonus + "</span><br />";
            
            if (jA.MaxDurability > 0) a += "Durability " + jA.MaxDurability + "/" + jA.MaxDurability + "<br />";
            if (jA.ItemLevel > 0) a += "Item Level " + jA.ItemLevel + "<br />";
            if (jA.RequiredLevel > 0) a += "Requires Level " + jA.RequiredLevel + "<br />";
            count = 0;
            jA.Stats3.forEach(function (key) {
                a += "<span class=\"q2\"> " + statTypes[key].replace("$1", jA.Values3[count]) + "</span><br />";
                ++count;
            });
            jA.Extra.forEach(function (ext) {
                a += "<span class=\"q2\"> " + ext + "</span><br />";
            });
            a += "</td></tr></table>";

            if (jA.ItemSetName != "") {
                a += "<table><tr><td><span class=\"q\">" + jA.ItemSetName + "</span><br />";
                jA.SetItems.forEach(function (item) {
                    a += "<span class=\"q" + item.Quality + "\">" + item.Name + "</span><br />";
                });
                jA.SetEffects.forEach(function (effect) {
                    a += "<br /><span class=\"q" + effect.Active + "\">" + effect.Name + "</span>";
                });
                a += "</td></tr></table>";
            }
            return a;
        case 1: // Spells
            var b = "";
            // Not used currently!
            return b;
        case 2: // Guild Progress
            var c = "<table style=\"width: 280px;\">";
            jA.Entries.forEach(function (entry) {
                c += "<tr><td>";
                c += entry.Name + "</td><td style=\"text-align:right\">";
                var date = new Date(entry.Date);
                c += date.yyyymmddhhmmss() + "</tr></td>";
            });
            return c + "</table>";
        case 3: // Guild
            var d = "<table width=\"100%\"><tr><td><b class=\"tf" + jA.Faction + "\">" + jA.Name + " (" + jA.MemberCount + " members)</b></td></tr>";
            jA.Cleared.forEach(function (instance) {
                d += "<tr><td><span class=\"" + instance.Status + "\">" + instance.Name + " (" + instance.Count + "/" + instance.Max + ")</span></td></tr>";
            });
            return d + "</table>";
        case 4: // Character
            var e = "<table style=\"width: 430px;\"><tr><td><div class=\"bbdesign color-c" + jA.Class + "\" style=\"background:url(/Assets/classes/" + jA.CharIcon + ") no-repeat; height: 20px;\">" +
                "<div style=\"position:absolute; padding-left: 21px; font-weight: 900;\">" +
                "<span style=\"color:white;\">" + jA.RankName + "</span> " + jA.Name + " " + jA.Level + " " +
                ((jA.GuildName != "") ? "<span class=\"tf" + jA.Faction + "\">&lt;" + jA.GuildName + "&gt;</span>" : "") +
                "<span style=\"color:white;\"> - " + jA.ServerName + "</span></div></div></td></tr>";
            jA.Items.forEach(function (pair) {
                e += "<tr><td><span class=\"q" + pair.Quality1 + "\">" +
                    ((pair.Name1 != "") ? "[" + pair.Name1 + "]" : "") + "</span></td>" +
                    "<td><span class=\"q" + pair.Quality2 + "\">" +
                    ((pair.Name2 != "") ? "[" + pair.Name2 + "]" : "") + "</span></td></tr>";
            });
            return e;
        case 5: // Row preview
            var f = "";
            switch (jA.PreviewType) {
                case 0: // Deaths
                    f += "<div class=\"rvDataClear\"><span class=\"rvBig\">Top 10 killer</span>" +
                        "<table class=\"rvDataTT\">";
                    jA.Entries.forEach(function (entry) {
                        f += "<tr>";
                        var date = new Date(entry.Date);
                        f += "<td>" + date.hhmmss() + "</td>";
                        f += "<td>" + entry.SourceName + "</td>";
                        f += "<td>" + entry.SpellName + "</td>";
                        f += "<td>" + entry.Amount + "</td>";
                        f += "</tr>";
                    });
                    f += "</table></div>";
                    break;
                case 1: // Aura uptime
                    f += "<div class=\"rvDataClear\"><span class=\"rvBig\">Top 10 abilities</span>" +
                        "<table class=\"rvDataTT preview\">";
                    var c1 = 1;
                    jA.Entries.forEach(function (entry) {
                        f += "<tr>";
                        f += "<td>" + c1 + ".</td>";
                        f += "<td>" + entry.SpellName + "</td>";
                        f += "<td></td>";
                        f += "<td>" + entry.Amount + "%</td>";
                        f += "</tr>";
                        ++c1;
                    });
                    f += "</table></div>";
                    break;
                case 2: // Healing
                    f += "<div class=\"rvDataClear\"><span class=\"rvBig\">Top 5 healed</span>" +
                        "<table class=\"rvDataTT preview\">";
                    var c2 = 1;
                    jA.Entries.forEach(function (entry) {
                        f += "<tr>";
                        f += "<td>" + c2 + "</td>";
                        f += "<td>" + entry.SourceName + "</td>";
                        f += "<td>" + entry.SourceEff + " (" + entry.SourceOverheal + ")</td>";
                        f += "<td>" + entry.Fraction + "%</td>";
                        f += "</tr>";
                        ++c2;
                        var c3 = 1;
                        entry.Abilities.forEach(function (ability) {
                            f += "<tr><td></td>";
                            f += "<td style=\"color:rgb(130,130,130) !important\">" + c3 + ". " + ability.Name + "</td>";
                            f += "<td style=\"color:rgb(130,130,130) !important\">" + ability.Eff + " (" + ability.Overheal + ")</td>" +
                                "<td style=\"color:rgb(130,130,130) !important\">" + ability.Fraction + "%</td></tr>";
                            ++c3;
                        });
                    });
                    f += "</table></div>";
                    break;
                case 3: // Healing taken
                    f += "<div class=\"rvDataClear\"><span class=\"rvBig\">Top 5 healer</span>" +
                        "<table class=\"rvDataTT preview\">";
                    var c4 = 1;
                    jA.Entries.forEach(function (entry) {
                        f += "<tr>";
                        f += "<td>" + c4 + "</td>";
                        f += "<td>" + entry.SourceName + "</td>";
                        f += "<td>" + entry.SourceEff + " (" + entry.SourceOverheal + ")</td>";
                        f += "<td>" + entry.Fraction + "%</td>";
                        f += "</tr>";
                        ++c4;
                        var c5 = 1;
                        entry.Abilities.forEach(function (ability) {
                            f += "<tr><td></td>";
                            f += "<td style=\"color:rgb(130,130,130) !important\">" + c5 + ". " + ability.Name + "</td>";
                            f += "<td style=\"color:rgb(130,130,130) !important\">" + ability.Eff + " (" + ability.Overheal + ")</td>" +
                                "<td style=\"color:rgb(130,130,130) !important\">" + ability.Fraction + "%</td></tr>";
                            ++c5;
                        });
                    });
                    f += "</table></div>";
                    break;
                default: // Rest
                    f = "<div class=\"rvDataClear\"><span class=\"rvBig\">Top 10 abilities</span>" +
                        "<table class=\"rvDataTT preview\">";
                    var c6 = 1;
                    jA.Entries.forEach(function (entry) {
                        f += "<tr>";
                        f += "<td>" + c6 + ".</td>";
                        f += "<td>" + entry.SpellName + "</td>";
                        f += "<td>" + (entry.Succ > 0 ? "(" + entry.Succ + "/" + entry.NotSucc + ")" : "") + "</td>";
                        f += "<td>" + entry.Amount + "</td>";
                        f += "<td>" + entry.Fraction + "%</td>";
                        f += "</tr>";
                        ++c6;
                    });
                    f += "</table></div>";
                    break;
            }
            return f;
        case 6: // Row data
            var g = "";
            switch (jA.RowType) {
                case 0: // Damage done 
                    g += "<div class=\"rvDataClear\"><table class=\"rvDataTT\"><tr><td colspan=\"5\">" +
                        "<span class=\"rvBig\">" + jA.SpellName + "</span>" +
                        "</td></tr><tr class=\"rvBig\"><td>Events</td><td></td><td>%</td><td>Damage</td><td>%</td></tr>";

                    if (jA.SpellType === 0) {

                        g += "<tr><td>Hits</td><td>" + jA.Hits.Count + "</td><td>" +
                            jA.Hits.CountFraction + "%</td><td>" + jA.Hits.Amount + "</td><td>" +
                            jA.Hits.Fraction + "%</td></tr>";
                        if (jA.EID < 300000 || jA.SpellId === 47490 || jA.Block.Count > 0) { // wasnt autoshot meant
                            g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                                "<table>" +
                                "<tr><td>Normal</td><td>" + jA.Normal.Count + "</td><td>" +
                                jA.Normal.CountFraction +
                                "%</td><td>" + jA.Normal.Amount + "</td><td>" +
                                jA.Normal.Fraction + "%</td></tr>" +
                                ((jA.EID >= 300000) ?
                                    "<tr><td style=\"text-align:left\">Glance</td><td>" + jA.Glance.Count + "</td><td>" +
                                    jA.Glance.CountFraction +
                                    "%</td><td>" + jA.Glance.Amount + "</td><td>" +
                                    jA.Glance.Fraction + "%</td></tr>"
                                    :
                                    "<tr><td style=\"text-align:left\">Crush</td><td>" + jA.Crush.Count + "</td><td>" +
                                    jA.Crush.CountFraction +
                                    "%</td><td>" + jA.CrushAmount + "</td><td>" +
                                    jA.Crush.Fraction + "%</td></tr>"
                                ) +

                                "<tr><td style=\"text-align:left\">Block</td><td>" + jA.Block.Count + "</td><td>" +
                                jA.Block.CountFraction +
                                "%</td><td>" + jA.Block.Amount + "</td><td>" +
                                jA.Block.Fraction + "%</td></tr>" + // TODO!

                                "</table>" +
                                "</div></td></tr>";
                        }

                        // Crits
                        // Header line
                        g += "<tr><td>Crits</td><td>" + jA.Crits.Count + "</td><td>" +
                            jA.Crits.CountFraction + "%</td><td>" + jA.Crits.Amount + "</td><td>" +
                            jA.Crits.Fraction + "%</td></tr>";

                        // Misses
                        g += "<tr><td>Misses</td><td>" + jA.Misses.Count + "</td><td>" + jA.Misses.CountFraction +
                            "%</td><td></td><td></td></tr>";

                        // Others
                        // Header line
                        g += "<tr><td>Others</td><td>" + jA.Others.Count + "</td><td>" +
                            jA.Others.CountFraction + "%</td><td></td><td></td></tr>";

                        // Partial box
                        g += "<tr><td colspan=\"8\"><div class=\"bgbox\">" +
                            "<table class=\"rvDataOther\">" +
                            "<tr><td>Parry</td><td>" + jA.Parry.Count + "</td><td>" +
                            jA.Parry.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "<tr><td>Dodge</td><td>" + jA.Dodge.Count + "</td><td>" +
                            jA.Dodge.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "<tr><td>Absorbs</td><td>" + jA.Absorbs.Count + "</td><td>" +
                            jA.Absorbs.CountFraction +
                            "%</td><td>" + jA.Absorbs.Mitgated + "</td><td></td></tr>" +

                            "<tr><td>Blocks</td><td>" + jA.Block.Count + "</td><td></td><td>" + jA.Block.Mitgated + "</td><td></td></tr>" +

                            "<tr><td>Immune</td><td>" + jA.Immune.Count + "</td><td>" +
                            jA.Immune.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "</table>" +
                            "</div></td></tr>";
                    }
                    else {
                        // Hits
                        // Header line
                        g += "<tr><td>Hits</td><td>" + jA.Hits.Count + "</td><td>" +
                            jA.Hits.CountFraction + "%</td><td>" + jA.Hits.Amount + "</td><td>" +
                            jA.Hits.Fraction + "%</td></tr>";

                        // Partial box
                        if (jA.Hits.HasPartial === 1)
                            g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                                "<table>" +
                                "<tr><td>Normal</td><td>" + jA.Hits.Normal.Count + "</td><td>" +
                                jA.Hits.Normal.CountFraction +
                                "%</td><td>" + jA.Hits.Normal.Amount + "</td><td>" +
                                jA.Hits.Normal.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (25%)</td><td>" + jA.Hits.P25.Count + "</td><td>" +
                                jA.Hits.P25.CountFraction +
                                "%</td><td>" + jA.Hits.P25.Amount + "</td><td>" +
                                jA.Hits.P25.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (50%)</td><td>" + jA.Hits.P50.Count + "</td><td>" +
                                jA.Hits.P50.CountFraction +
                                "%</td><td>" + jA.Hits.P50.Amount + "</td><td>" +
                                jA.Hits.P50.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (75%)</td><td>" + jA.Hits.P75.Count + "</td><td>" +
                                jA.Hits.P75.CountFraction +
                                "%</td><td>" + jA.Hits.P75.Amount + "</td><td>" +
                                jA.Hits.P75.Fraction + "%</td></tr>" +
                                "</table>" +
                                "</div></td></tr>";

                        // Crits
                        // Header line
                        g += "<tr><td>Crits</td><td>" + jA.Crits.Count + "</td><td>" +
                            jA.Crits.CountFraction + "%</td><td>" + jA.Crits.Amount + "</td><td>" +
                            jA.Crits.Fraction + "%</td></tr>";

                        if (jA.Crits.HasPartial)
                            g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                                "<table>" +
                                "<tr><td>Normal</td><td>" + jA.Crits.Normal.Count + "</td><td>" +
                                jA.Crits.Normal.CountFraction +
                                "%</td><td>" + jA.Crits.Normal.Amount + "</td><td>" +
                                jA.Crits.Normal.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (25%)</td><td>" + jA.Crits.P25.Count + "</td><td>" +
                                jA.Crits.P25.CountFraction +
                                "%</td><td>" + jA.Crits.P25.Amount + "</td><td>" +
                                jA.Crits.P25.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (50%)</td><td>" + jA.Crits.P50.Count + "</td><td>" +
                                jA.Crits.P50.CountFraction +
                                "%</td><td>" + jA.Crits.P50.Amount + "</td><td>" +
                                jA.Crits.P50.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (75%)</td><td>" + jA.Crits.P75.Count + "</td><td>" +
                                jA.Crits.P75.CountFraction +
                                "%</td><td>" + jA.Crits.P75.Amount + "</td><td>" +
                                jA.Crits.P75.Fraction + "%</td></tr>" +
                                "</table>" +
                                "</div></td></tr>";

                        // Resists
                        g += "<tr><td>Resists</td><td>" + jA.Resists.Count + "</td><td>" +
                            jA.Resists.CountFraction +
                            "%</td><td></td><td></td></tr>";

                        // Others
                        // Header line
                        g += "<tr><td>Others</td><td>" + jA.Others.Count + "</td><td>" +
                            jA.Others.CountFraction + "%</td><td></td><td></td></tr>";

                        // Partial box
                        g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                            "<table class=\"rvDataOther\">" +
                            "<tr><td>Reflects</td><td>" + jA.Reflects.Count + "</td><td>" +
                            jA.Reflects.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "<tr><td>Absorbs</td><td>" + jA.Absorbs.Count + "</td><td>" +
                            jA.Absorbs.CountFraction +
                            "%</td><td>" + jA.Absorbs.Mitgated + "</td><td></td></tr>" + 
                            "<tr><td>Interrupts</td><td>" + jA.Interrupts.Count + "</td><td>" +
                            jA.Interrupts.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "<tr><td>Immune</td><td>" + jA.Immune.Count + "</td><td>" +
                            jA.Immune.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "</table>" +
                            "</div></td></tr>";
                    }
                    // Average Bar
                    // Header line
                    g += "<tr><td></td><td>Min</td><td>Max</td><td>Average</td><td></td></tr>";

                    // Partial box
                    g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                        "<table class=\"rvDataOther\">" +
                        "<tr><td>Hits</td><td>" + jA.Hits.Min + "</td><td>" + jA.Hits.Max + "</td><td>" + jA.Hits.Average + "</td><td></td></tr>" +
                        "<tr><td>Crits</td><td>" + jA.Crits.Min + "</td><td>" + jA.Crits.Max + "</td><td>" + jA.Crits.Average + "</td><td></td></tr>" +
                        "<tr><td>Total</td><td>" + jA.Total.Min + "</td><td>" + jA.Total.Max + "</td><td>" + jA.Total.Average + "</td><td></td></tr>" +
                        "</table>" +
                        "</div></td></tr>";

                    // Total bar
                    g += "<tr class=\"rvBig\"><td>Total</td><td>" + jA.Total.Hits + "</td><td></td><td>" + jA.Total.Amount +
                        "</td><td></td></tr>";
                    g += "</table></div>";
                    break;
                case 6: // Threat 
                    g += "<div class=\"rvDataClear\"><table class=\"rvDataTT\"><tr><td colspan=\"5\">" +
                        "<span class=\"rvBig\">" + jA.SpellName + "</span>" +
                        "</td></tr><tr class=\"rvBig\"><td>Events</td><td></td><td>%</td><td>Damage</td><td>%</td></tr>";

                    g += "<tr><td>Hits</td><td>" + jA.Hits.Count + "</td><td>" +
                        jA.Hits.CountFraction + "%</td><td>" + jA.Hits.Amount + "</td><td>" +
                        jA.Hits.Fraction + "%</td></tr>";
                    if (jA.EID < 300000 || jA.SpellId === 47490 || jA.Block.Count > 0) { // wasnt autoshot meant
                        g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                            "<table>" +
                            "<tr><td>Normal</td><td>" + jA.Normal.Count + "</td><td>" +
                            jA.Normal.CountFraction +
                            "%</td><td>" + jA.Normal.Amount + "</td><td>" +
                            jA.Normal.Fraction + "%</td></tr>" +
                            ((jA.EID >= 300000) ?
                                "<tr><td style=\"text-align:left\">Glance</td><td>" + jA.Glance.Count + "</td><td>" +
                                jA.Glance.CountFraction +
                                "%</td><td>" + jA.Glance.Amount + "</td><td>" +
                                jA.Glance.Fraction + "%</td></tr>"
                                :
                                "<tr><td style=\"text-align:left\">Crush</td><td>" + jA.Crush.Count + "</td><td>" +
                                jA.Crush.CountFraction +
                                "%</td><td>" + jA.CrushAmount + "</td><td>" +
                                jA.Crush.Fraction + "%</td></tr>"
                            ) +

                            "<tr><td style=\"text-align:left\">Block</td><td>" + jA.Block.Count + "</td><td>" +
                            jA.Block.CountFraction +
                            "%</td><td>" + jA.Block.Amount + "</td><td>" +
                            jA.Block.Fraction + "%</td></tr>" + // TODO!

                            "</table>" +
                            "</div></td></tr>";
                    }

                    // Crits
                    // Header line
                    g += "<tr><td>Crits</td><td>" + jA.Crits.Count + "</td><td>" +
                        jA.Crits.CountFraction + "%</td><td>" + jA.Crits.Amount + "</td><td>" +
                        jA.Crits.Fraction + "%</td></tr>";

                    // Average Bar
                    // Header line
                    g += "<tr><td></td><td>Min</td><td>Max</td><td>Average</td><td></td></tr>";

                    // Partial box
                    g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                        "<table class=\"rvDataOther\">" +
                        "<tr><td>Hits</td><td>" + jA.Hits.Min + "</td><td>" + jA.Hits.Max + "</td><td>" + jA.Hits.Average + "</td><td></td></tr>" +
                        "<tr><td>Crits</td><td>" + jA.Crits.Min + "</td><td>" + jA.Crits.Max + "</td><td>" + jA.Crits.Average + "</td><td></td></tr>" +
                        "<tr><td>Total</td><td>" + jA.Total.Min + "</td><td>" + jA.Total.Max + "</td><td>" + jA.Total.Average + "</td><td></td></tr>" +
                        "</table>" +
                        "</div></td></tr>";

                    // Total bar
                    g += "<tr class=\"rvBig\"><td>Total</td><td>" + jA.Total.Hits + "</td><td></td><td>" + jA.Total.Amount +
                        "</td><td></td></tr>";
                    g += "</table></div>";
                    break;
                case 1: // Damage taken
                    g += "<div class=\"rvDataClear\"><table class=\"rvDataTT\"><tr><td colspan=\"5\">" +
                        "<span class=\"rvBig\">" + jA.SpellName + "</span>" +
                        "</td></tr><tr class=\"rvBig\"><td>Events</td><td></td><td>%</td><td>Damage</td><td>%</td></tr>";

                    if (jA.SpellType === 0) {

                        g += "<tr><td>Hits</td><td>" + jA.Hits.Count + "</td><td>" +
                            jA.Hits.CountFraction + "%</td><td>" + jA.Hits.Amount + "</td><td>" +
                            jA.Hits.Fraction + "%</td></tr>";
                        if (jA.EID < 300000 || jA.SpellName === "AutoAttack" || jA.Block.Count > 0) { // wasnt autoshot meant
                            g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                                "<table>" +
                                "<tr><td>Normal</td><td>" + jA.Normal.Count + "</td><td>" +
                                jA.Normal.CountFraction +
                                "%</td><td>" + jA.Normal.Amount + "</td><td>" +
                                jA.Normal.Fraction + "%</td></tr>" +
                                "<tr><td style=\"text-align:left\">Crush</td><td>" + jA.Crush.Count + "</td><td>" +
                                jA.Crush.CountFraction +
                                "%</td><td>" + jA.CrushAmount + "</td><td>" +
                                jA.Crush.Fraction + "%</td></tr>" +
                                "<tr><td style=\"text-align:left\">Block</td><td>" + jA.Block.Count + "</td><td>" +
                                jA.Block.CountFraction +
                                "%</td><td>" + jA.Block.Amount + "</td><td>" +
                                jA.Block.Fraction + "%</td></tr>" + // TODO!

                                "</table>" +
                                "</div></td></tr>";
                        }

                        // Crits
                        // Header line
                        g += "<tr><td>Crits</td><td>" + jA.Crits.Count + "</td><td>" +
                            jA.Crits.CountFraction + "%</td><td>" + jA.Crits.Amount + "</td><td>" +
                            jA.Crits.Fraction + "%</td></tr>";

                        // Misses
                        g += "<tr><td>Misses</td><td>" + jA.Misses.Count + "</td><td>" + jA.Misses.CountFraction +
                            "%</td><td></td><td></td></tr>";

                        // Others
                        // Header line
                        g += "<tr><td>Others</td><td>" + jA.Others.Count + "</td><td>" +
                            jA.Others.CountFraction + "%</td><td></td><td></td></tr>";

                        // Partial box
                        g += "<tr><td colspan=\"8\"><div class=\"bgbox\">" +
                            "<table class=\"rvDataOther\">" +
                            "<tr><td>Parry</td><td>" + jA.Parry.Count + "</td><td>" +
                            jA.Parry.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "<tr><td>Dodge</td><td>" + jA.Dodge.Count + "</td><td>" +
                            jA.Dodge.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "<tr><td>Absorbs</td><td>" + jA.Absorbs.Count + "</td><td>" +
                            jA.Absorbs.CountFraction +
                            "%</td><td>" + jA.Absorbs.Mitgated + "</td><td></td></tr>" +

                            "<tr><td>Blocks</td><td>" + jA.Block.Count + "</td><td></td><td>" + jA.Block.Mitgated + "</td><td></td></tr>" +

                            "<tr><td>Immune</td><td>" + jA.Immune.Count + "</td><td>" +
                            jA.Immune.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "</table>" +
                            "</div></td></tr>";
                    }
                    else {
                        // Hits
                        // Header line
                        g += "<tr><td>Hits</td><td>" + jA.Hits.Count + "</td><td>" +
                            jA.Hits.CountFraction + "%</td><td>" + jA.Hits.Amount + "</td><td>" +
                            jA.Hits.Fraction + "%</td></tr>";

                        // Partial box
                        if (jA.Hits.HasPartial)
                            g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                                "<table>" +
                                "<tr><td>Normal</td><td>" + jA.Hits.Normal.Count + "</td><td>" +
                                jA.Hits.Normal.CountFraction +
                                "%</td><td>" + jA.Hits.Normal.Amount + "</td><td>" +
                                jA.Hits.Normal.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (25%)</td><td>" + jA.Hits.P25.Count + "</td><td>" +
                                jA.Hits.P25.CountFraction +
                                "%</td><td>" + jA.Hits.P25.Amount + "</td><td>" +
                                jA.Hits.P25.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (50%)</td><td>" + jA.Hits.P50.Count + "</td><td>" +
                                jA.Hits.P50.CountFraction +
                                "%</td><td>" + jA.Hits.P50.Amount + "</td><td>" +
                                jA.Hits.P50.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (75%)</td><td>" + jA.Hits.P75.Count + "</td><td>" +
                                jA.Hits.P75.CountFraction +
                                "%</td><td>" + jA.Hits.P75.Amount + "</td><td>" +
                                jA.Hits.P75.Fraction + "%</td></tr>" +
                                "</table>" +
                                "</div></td></tr>";

                        // Crits
                        // Header line
                        g += "<tr><td>Crits</td><td>" + jA.Crits.Count + "</td><td>" +
                            jA.Crits.CountFraction + "%</td><td>" + jA.Crits.Amount + "</td><td>" +
                            jA.Crits.Fraction + "%</td></tr>";

                        if (jA.Crits.HasPartial)
                            g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                                "<table>" +
                                "<tr><td>Normal</td><td>" + jA.Crits.Normal.Count + "</td><td>" +
                                jA.Crits.Normal.CountFraction +
                                "%</td><td>" + jA.Crits.Normal.Amount + "</td><td>" +
                                jA.Crits.Normal.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (25%)</td><td>" + jA.Crits.P25.Count + "</td><td>" +
                                jA.Crits.P25.CountFraction +
                                "%</td><td>" + jA.Crits.P25.Amount + "</td><td>" +
                                jA.Crits.P25.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (50%)</td><td>" + jA.Crits.P50.Count + "</td><td>" +
                                jA.Crits.P50.CountFraction +
                                "%</td><td>" + jA.Crits.P50.Amount + "</td><td>" +
                                jA.Crits.P50.Fraction + "%</td></tr>" +
                                "<tr><td>Partial (75%)</td><td>" + jA.Crits.P75.Count + "</td><td>" +
                                jA.Crits.P75.CountFraction +
                                "%</td><td>" + jA.Crits.P75.Amount + "</td><td>" +
                                jA.Crits.P75.Fraction + "%</td></tr>" +
                                "</table>" +
                                "</div></td></tr>";

                        // Resists
                        g += "<tr><td>Resists</td><td>" + jA.Resists.Count + "</td><td>" +
                            jA.Resists.CountFraction +
                            "%</td><td></td><td></td></tr>";

                        // Others
                        // Header line
                        g += "<tr><td>Others</td><td>" + jA.Others.Count + "</td><td>" +
                            jA.Others.CountFraction + "%</td><td></td><td></td></tr>";

                        // Partial box
                        g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                            "<table class=\"rvDataOther\">" +
                            "<tr><td>Reflects</td><td>" + jA.Reflects.Count + "</td><td>" +
                            jA.Reflects.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "<tr><td>Absorbs</td><td>" + jA.Absorbs.Count + "</td><td>" +
                            jA.Absorbs.CountFraction +
                            "%</td><td>" + jA.Absorbs.Mitgated + "</td><td></td></tr>" + // In vanilla everything is saved in 0, tbc saves it at the index 2
                            "<tr><td>Interrupts</td><td>" + jA.Interrupts.Count + "</td><td>" +
                            jA.Interrupts.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "<tr><td>Immune</td><td>" + jA.Immune.Count + "</td><td>" +
                            jA.Immune.CountFraction +
                            "%</td><td></td><td></td></tr>" +
                            "</table>" +
                            "</div></td></tr>";
                    }
                    // Average Bar
                    // Header line
                    g += "<tr><td></td><td>Min</td><td>Max</td><td>Average</td><td></td></tr>";

                    // Partial box
                    g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                        "<table class=\"rvDataOther\">" +
                        "<tr><td>Hits</td><td>" + jA.Hits.Min + "</td><td>" + jA.Hits.Max + "</td><td>" + jA.Hits.Average + "</td><td></td></tr>" +
                        "<tr><td>Crits</td><td>" + jA.Crits.Min + "</td><td>" + jA.Crits.Max + "</td><td>" + jA.Crits.Average + "</td><td></td></tr>" +
                        "<tr><td>Total</td><td>" + jA.Total.Min + "</td><td>" + jA.Total.Max + "</td><td>" + jA.Total.Average + "</td><td></td></tr>" +
                        "</table>" +
                        "</div></td></tr>";

                    // Total bar
                    g += "<tr class=\"rvBig\"><td>Total</td><td>" + jA.Total.Hits + "</td><td></td><td>" + jA.Total.Amount +
                        "</td><td></td></tr>";
                    g += "</table></div>";
                    break;
                case 2: // Healing taken
                    g += "<div class=\"rvDataClear\"><span class=\"rvBig\">Top 10 healer</span>" +
                        "<table class=\"rvDataTT preview\">";

                    var c8 = 1;
                    jA.Sources.forEach(function (src) {
                        g += "<tr><td>" + c8 + ".</td>";
                        g += "<td>" + src.Name + "</td>";
                        g += "<td>" + src.Eff + " (" + src.Overheal + ")</td>";
                        g += "<td>" + src.Fraction + "%</td></tr>";
                        ++c8;
                    });

                    g += "</table></div>";
                    break;
                case 3: // Healing
                    g += "<div class=\"rvDataClear\"><table class=\"rvDataTT\"><tr><td colspan=\"5\">" +
                        "<span class=\"rvBig\">" + jA.SpellName + "</span>" +
                        "</td></tr><tr class=\"rvBig\"><td>Events</td><td></td><td>%</td><td>Healing</td><td>%</td></tr>";

                    // Normal
                    // Header line
                    g += "<tr><td>Normal</td><td>" + jA.Hits.Count + "</td><td>" +
                        jA.Hits.CountFraction + "%</td><td>" + jA.Hits.Amount + "</td><td>" +
                        jA.Hits.Fraction + "%</td></tr>";

                    // Partial box
                    g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                        "<table>" +
                        "<tr><td>Efficient</td><td></td><td></td><td>" + jA.Hits.Eff + "</td><td>" +
                        jA.Hits.EffFraction + "%</td></tr>" +
                        "<tr><td style=\"text-align:left\">Overheal</td><td></td><td></td><td>" + jA.Hits.Overheal + "</td><td>" +
                        jA.Hits.OverhealFraction + "%</td></tr>" +
                        "</table>" +
                        "</div></td></tr>";

                    // Crits
                    // Header line
                    g += "<tr><td>Normal</td><td>" + jA.Crits.Count + "</td><td>" +
                        jA.Crits.CountFraction + "%</td><td>" + jA.Crits.Amount + "</td><td>" +
                        jA.Crits.Fraction + "%</td></tr>";

                    // Partial box
                    g += "<tr><td colspan=\"5\"><div class=\"bgbox\">" +
                        "<table>" +
                        "<tr><td>Efficient</td><td></td><td></td><td>" + jA.Crits.Eff + "</td><td>" +
                        jA.Crits.EffFraction + "%</td></tr>" +
                        "<tr><td style=\"text-align:left\">Overheal</td><td></td><td></td><td>" + jA.Crits.Overheal + "</td><td>" +
                        jA.Crits.OverhealFraction + "%</td></tr>" +
                        "</table>" +
                        "</div></td></tr>";

                    // Total bar
                    g += "<tr><td>Efficient</td><td></td><td></td><td>" + jA.Total.Eff +
                        "</td><td>" + jA.Total.EffFraction + "%</td></tr>";
                    g += "<tr><td>Overheal</td><td></td><td></td><td>" + jA.Total.Overheal +
                        "</td><td>" + jA.Total.OverhealFraction + "%</td></tr>";
                    g += "<tr class=\"rvBig\"><td>Total</td><td>" + jA.Total.Hits + "</td><td>100%</td><td>" + (jA.Total.Eff + jA.Total.Overheal) +
                        "</td><td>100%</td></tr>";
                    g += "</table></div>";
                    break;
                case 4: // Deaths
                    var d = new date(jA.TS);
                    g = "<div class=\"rvDataClear\"><table class=\"rvDataTT deathTT\"><tr><td colspan=\"5\">" +
                        "<span class=\"rvBig\">Deathhistory at " + d.ToString("hh:mm:ss") + "</span>" +
                        "</td></tr><tr class=\"rvBig\"><td>CBT</td><td>Cause</td><td>Ability</td><td>Type</td><td>Value</td></tr>";
                    jA.Entries.forEach(function (entry) {
                        d = new Date(entry.TS);
                        g += "<tr><td>" +
                            d.hhmmssfff() +
                        "</td><td class=\"color-c" +
                        entry.Class + "\">" +
                        entry.Name + "</td><td class=\"color-at" + entry.SpellType + "\">" +
                        entry.SpellName + "</td><td>" +
                        ExtraModToString(entry.HitType) + "</td><td class=\""+entry.Modifier+"\">+" + entry.Amount +
                        "</td></tr>";
                    });
                    g += "</table></div>";
                    break;
                case 5: // Aura
                    g = "<div class=\"rvDataClear\"><table class=\"rvDataTT\">";
                    g += "<tr><td>Gained</td><td>Faded</td><td>hh:mm::ss</td></tr>";

                    jA.Entries.forEach(function (entry)
                    {
                        var a = new Date(entry.Gained);
                        var b = new Date(entry.Faded);
                        var d = new Date(entry.Duration);
                        g += "<tr>";
                        g += "<td>" + a.hhmmss() + "</td>";
                        g += "<td>" + b.hhmmss() + "</td>";
                        g += "<td>" + d.hhmmss() + "</td>";
                        g += "</tr>";
                    });

                    g += "</table></div>";
                    break;
                default: // Rest
                    g += "Error retrieving information";
                    break;
            }
            return g;
        default:
            break;
    }
    return "Error retrieving information";
}

function tt_show(elem, type, id, comments, charid, tarid, start, end, uploader, instanceid, category, attempt, mode, expansion, flags) {
    if (!charid)
        charid = 0;
    if (!tarid)
        tarid = 0;
    if (!start)
        start = 0;
    if (!end)
        end = 0;
    if (!uploader)
        uploader = 0;
    if (!instanceid)
        instanceid = 0;
    if (!category)
        category = 0;
    if (!attempt)
        attempt = 0;
    if (!mode)
        mode = "";
    if (!expansion)
        expansion = 0;
    if (!flags)
        flags = "0";
    if (type === 2 || type === 1)
        mode = charid; // instanceid rly

    tt = document.getElementById("tooltip");
    tt_icon = document.getElementById("tticon");
    tt_core = document.getElementById("ttcore");
    tt_icon.style.display = "none";

    tt.dataArr = [type, id, comments];
    tt_core.style.display = "block";
    elem.addEventListener("mouseout", tt_hide);
    var exist = tt_cache_exists(type, id, mode);
    if (exist >= 0) {
        tt_load(exist);
    } else {
        if (type === 3) {
            tt.innerHTML = "";
            for (var i = 0; i < comments.length; ++i) tt_append(comments[i]);
            tt_cache.push([type, id, tt.innerHTML]);
        } else {
            if (type !== null && id !== null) {
                xhr = new XMLHttpRequest();
                if (type >= 6)
                    xhr.open("GET",
                        "//" +
                        host +
                        "/Ajax.aspx?data=tooltip&type=" +
                        type +
                        "&id=" +
                        id +
                        "&instanceid=" +
                        instanceid +
                        "&charid=" +
                        charid +
                        "&tarid=" +
                        tarid +
                        "&upl=" +
                        uploader +
                        "&start=" +
                        start +
                        "&end=" +
                        end +
                        "&cat=" +
                        category +
                        "&atmt=" +
                        attempt +
                        "&mode=" +
                        mode +
                        "&exp=" +
                        expansion +
                        "&flags=" +
                        flags,
                        true);
                else
                    xhr.open("GET", "//" + host + "/Ajax.aspx?data=tooltip&type=" + type + "&id=" + id + "&charid=" + charid, true);
                xhr.send();
                tt.innerHTML = "Loading...";
                xhr.dataArr = [type, id, comments, mode];
                xhr.onreadystatechange = processRequest;
            }
        }
    }
}

function tt_hide() {
    tt_core.style.display = "none";
}
