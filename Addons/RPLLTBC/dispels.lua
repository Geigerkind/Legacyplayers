local RPLL = RPLL

local RPLLTT = RPLLTT
local cbtevents = RPLL.LOCAL[4]
local translations = RPLL.LOCAL[2]

local tinsert = table.insert
local string.gmatch = string.gfind
local UnitIsPlayer = UnitIsPlayer
local UnitName = UnitName
local GetTime = GetTime
local tremove = table.remove
local pairs = pairs
local strlower = strlower
local GetRaidRosterInfo = GetRaidRosterInfo
local GetNumPartyMembers = GetNumPartyMembers
local GetNumRaidMembers = GetNumRaidMembers
local GetSpellName = GetSpellName

local oUnitClass = UnitClass
local function UnitClass(unit)
    local _,eC = oUnitClass(unit)
    return strlower(eC or "")
end
local oUnitFactionGroup = UnitFactionGroup
local function UnitFactionGroup(unit)
    return strlower(oUnitFactionGroup(unit) or "")
end

local LastMouseover = nil
local LastDecursive = nil

RPLL.UPDATE_MOUSEOVER_UNIT = function()
    this:GrabPlayerData("mouseover", false, false)
	LastMouseover = UnitName("mouseover")
end

function RPLL:GetTarget()
    local target = LastDecursive
    if not target then
        if UnitIsPlayer("target") then
            target = UnitName("target")
        else
            target = LastMouseover
        end
    end
    return target
end

local dispels = {
    ["Remove Curse"] = true,
    ["Cleanse"] = true,
    ["Remove Lesser Curse"] = true,
    ["Purify"] = true,
    ["Dispel Magic"] = true,
    ["Abolish Poison"] = true,
    ["Abolish Disease"] = true,
    ["Devour Magic"] = true,
    ["Cure Disease"] = true,
    ["Poison Cleansing Totem"] = true,
    ["Cure Poison"] = true,
    ["Disease Cleansing Totem"] = true,
    ["Purge"] = true,
    -- Potion
    ["Powerful Anti-Venom"] = true,
    ["Restauration Potion"] = true,
    ["Restauration"] = true,
    ["Purification"] = true,
    ["Purification Potion"] = true,
    ["Restorative Potion"] = true,

    ["Fluch aufheben"] = true,
    ["Reinigung des Glaubens"] = true,
    ["Geringen Fluch aufheben"] = true,
    ["Läutern"] = true,
    ["Magiebannung"] = true,
    ["Vergiftung aufheben"] = true,
    ["Krankheit aufheben"] = true,
    ["Magie verschlingen"] = true,
    ["Krankheit heilen"] = true,
    ["Totem der Giftreinigung"] = true,
    ["Vergiftung heilen"] = true,
    ["Totem der Krankheitsreinigung"] = true,
    ["Reinigen"] = true,
    ["Mächtiges Gegengift"] = true,
    ["Wiederherstellung"] = true,
    ["Läuterung"] = true,
    ["Läuterungstrank"] = true,
    ["Regenerationstrank"] = true,

    ["Délivrance de la malédiction"] = true,
    ["Epuration"] = true,
    ["Délivrance de la malédiction mineure"] = true,
    ["Purifier"] = true,
    ["Dissipation de la magie"] = true,
    ["Abolir le poison"] = true,
    ["Abolir maladie"] = true,
    ["Dévorer la magie"] = true,
    ["Guérison des maladies"] = true,
    ["Totem de purification du poison"] = true,
    ["Guérison du poison"] = true,
    ["Totem de Purification des maladies"] = true,
    ["Purge"] = true,
    ["Anti-venin puissant"] = true,
    ["Restauration"] = true,
    ["Purification"] = true,
    ["Potion de purification"] = true,
    ["Potion de restauration"] = true,

    ["Снятие проклятия"] = true,
    ["Очищение"] = true,
    ["Снятие малого проклятия"] = true,
    ["Омовение"] = true,
    ["Рассеивание заклинаний"] = true,
    ["Устранение яда"] = true,
    ["Устранение болезни"] = true,
    ["Пожирание магии"] = true,
    ["Излечение болезни"] = true,
    ["Тотем противоядия"] = true,
    ["Выведение яда"] = true,
    ["Тотем очищения от болезней"] = true,
    ["Развеяние магии"] = true,
    ["Мощное противоядие"] = true,
    ["Восстановление"] = true,
    ["Чистота"] = true,
    ["Зелье очищения"] = true,
    ["Приводящее в сознание зелье"] = true,

    ["解除诅咒"] = true,
    ["清洁术"] = true,
    ["解除次级诅咒"] = true,
    ["净化"] = true,
    ["驱散魔法"] = true,
    ["驱毒术"] = true,
    ["驱除疾病"] = true,
    ["吞噬魔法"] = true,
    ["治愈疾病"] = true,
    ["清毒图腾"] = true,
    ["疗毒"] = true,
    ["祛病图腾"] = true,
    ["净化术"] = true,
    ["特效抗毒药剂"] = true,
    ["恢复"] = true,
    ["净化"] = true,
    ["净化药水"] = true,
    ["滋补药剂"] = true,
}

if DPSMate and (DPSMate.RegistredModules["dispels"] or DPSMate.RegistredModules["liftmagic"] or DPSMate.RegistredModules["curedisease"] or DPSMate.RegistredModules["curepoison"] or DPSMate.RegistredModules["decurses"]) then
    DPSMate.DB.oldDispel = DPSMate.DB.Dispels
    function DPSMate.DB:Dispels(cause, Dname, target, ability)
        if dispels[Dname] then
            RPLL:CreateDummyPlayer(cause)
            if RPLL.PlayerData[target] then
                tinsert(RPLL.Session, "M"..RPLL:formatTimeAlpha().."}"..RPLL.PlayerData[cause][1].."}"..RPLL.PlayerData[target][1].."}"..RPLL:RegisterAbility(Dname).."}"..RPLL:RegisterAbility(ability))
            else
                tinsert(RPLL.Session, "M"..RPLL:formatTimeAlpha().."}"..RPLL.PlayerData[cause][1].."}-"..RPLL:RegisterNPC(target).."}"..RPLL:RegisterAbility(Dname).."}"..RPLL:RegisterAbility(ability))
            end
        end
        DPSMate.DB:oldDispel(cause, Dname, target, ability)
    end
else
    RPLL.trackdispels = true

    RPLL.OLD_CHAT_MSG_SPELL_SELF_BUFF = RPLL.CHAT_MSG_SPELL_SELF_BUFF
    RPLL.CHAT_MSG_SPELL_SELF_BUFF = function(arg1)
        for ability, target in string.gmatch(arg1, cbtevents[20]) do
            this:AwaitDispel(ability, "Unknown", Player)
            return
        end
        for ability, target in string.gmatch(arg1, cbtevents[19]) do
            this:AwaitDispel(ability, target, Player)
        end
        this.OLD_CHAT_MSG_SPELL_SELF_BUFF(arg1)
    end
    RPLL.OLD_CHAT_MSG_SPELL_PARTY_BUFF = RPLL.CHAT_MSG_SPELL_PARTY_BUFF
    RPLL.CHAT_MSG_SPELL_PARTY_BUFF = function(arg1)
        for cause, ability, target in string.gmatch(arg1, cbtevents[21]) do
            this:AwaitDispel(ability, target, cause)
            return
        end
        for cause, ability in string.gmatch(arg1, cbtevents[22]) do
            this:AwaitDispel(ability, target, Player)
        end
        this.OLD_CHAT_MSG_SPELL_PARTY_BUFF(arg1)
    end
    RPLL.OLD_CHAT_MSG_SPELL_FRIENDLYPLAYER_BUFF = RPLL.CHAT_MSG_SPELL_FRIENDLYPLAYER_BUFF
    RPLL.CHAT_MSG_SPELL_FRIENDLYPLAYER_BUFF = function(arg1)
        for cause, ability, target in string.gmatch(arg1, cbtevents[21]) do
            this:AwaitDispel(ability, target, cause)
            return
        end
        for cause, ability in string.gmatch(arg1, cbtevents[22]) do
            this:AwaitDispel(ability, target, Player)
        end
        this.OLD_CHAT_MSG_SPELL_FRIENDLYPLAYER_BUFF(arg1)
    end
    RPLL.CHAT_MSG_SPELL_BREAK_AURA = function(arg1)
        for target, ability in string.gmatch(arg1, cbtevents[23]) do
            this:ConfirmRealDispel(ability, target)
            return
        end
        for ability in string.gmatch(arg1, cbtevents[24]) do
            this:ConfirmRealDispel(ability, Player)
        end
    end
    RPLL.OLD_CHAT_MSG_SPELL_PERIODIC_SELF_BUFFS = RPLL.CHAT_MSG_SPELL_PERIODIC_SELF_BUFFS
    RPLL.CHAT_MSG_SPELL_PERIODIC_SELF_BUFFS = function(arg1)
        for ability in string.gmatch(arg1, cbtevents[25]) do
            this:RegisterHotDispel(Player, ability)
        end
        this.OLD_CHAT_MSG_SPELL_PERIODIC_SELF_BUFFS(arg1)
    end
    RPLL.OLD_CHAT_MSG_SPELL_PERIODIC_PARTY_BUFFS = RPLL.CHAT_MSG_SPELL_PERIODIC_PARTY_BUFFS
    RPLL.CHAT_MSG_SPELL_PERIODIC_PARTY_BUFFS = function(arg1)
        for target, ability in string.gmatch(arg1, cbtevents[26]) do
            this:RegisterHotDispel(target, ability)
        end
        this.OLD_CHAT_MSG_SPELL_PERIODIC_PARTY_BUFFS(arg1)
    end
    RPLL.OLD_CHAT_MSG_SPELL_PERIODIC_HOSTILEPLAYER_BUFFS = RPLL.CHAT_MSG_SPELL_PERIODIC_HOSTILEPLAYER_BUFFS
    RPLL.CHAT_MSG_SPELL_PERIODIC_HOSTILEPLAYER_BUFFS = function(arg1)
        for target, ability in string.gmatch(arg1, cbtevents[26]) do
            this:RegisterHotDispel(target, ability)
        end
        this.OLD_CHAT_MSG_SPELL_PERIODIC_HOSTILEPLAYER_BUFFS(arg1)
    end
    RPLL.OLD_CHAT_MSG_SPELL_PERIODIC_FRIENDLYPLAYER_BUFFS = RPLL.CHAT_MSG_SPELL_PERIODIC_FRIENDLYPLAYER_BUFFS
    RPLL.CHAT_MSG_SPELL_PERIODIC_FRIENDLYPLAYER_BUFFS = function(arg1)
        for target, ability in string.gmatch(arg1, cbtevents[26]) do
            this:RegisterHotDispel(target, ability)
        end
        this.OLD_CHAT_MSG_SPELL_PERIODIC_FRIENDLYPLAYER_BUFFS(arg1)
    end
    RPLL.CHAT_MSG_SPELL_AURA_GONE_PARTY = function(arg1)
        for ability, target in string.gmatch(arg1, cbtevents[27]) do
            this:UnregisterHotDispel(target, ability)
        end
    end
    RPLL.CHAT_MSG_SPELL_AURA_GONE_OTHER = function(arg1)
        for ability, target in string.gmatch(arg1, cbtevents[27]) do
            this:UnregisterHotDispel(target, ability)
        end
    end
    RPLL.CHAT_MSG_SPELL_AURA_GONE_SELF = function(arg1)
        for ability in string.gmatch(arg1, cbtevents[28]) do
            this:UnregisterHotDispel(Player, ability)
        end
    end
    RPLL.oldCHAT_MSG_SPELL_HOSTILEPLAYER_BUFF = RPLL.CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF
    RPLL.CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF = function(arg1)
        this.oldCHAT_MSG_SPELL_HOSTILEPLAYER_BUFF(arg1)
        for cause, ability, target in string.gmatch(arg1, cbtevents[21]) do
            this:AwaitDispel(ability, target, cause)
            return
        end
        for cause, ability in string.gmatch(arg1, cbtevents[22]) do
            this:AwaitDispel(ability, target, Player)
        end
    end -- used by kicks and dispels
    RPLL:RegisterEvent("CHAT_MSG_SPELL_SELF_BUFF")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_PARTY_BUFF")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_FRIENDLYPLAYER_BUFF")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_BREAK_AURA")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_PERIODIC_SELF_BUFFS")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_PERIODIC_PARTY_BUFFS")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_PERIODIC_HOSTILEPLAYER_BUFFS")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_PERIODIC_FRIENDLYPLAYER_BUFFS")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_AURA_GONE_PARTY")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_AURA_GONE_OTHER")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_AURA_GONE_SELF")

    if Dcr_Cast_CureSpell then
        local OldDCR_CAST = Dcr_Cast_CureSpell
        local DCR_CAST = function(spellID, Unit, AfflictionType, ClearCurrentTarget)
            LastDecursive = UnitName(Unit)
            OldDCR_CAST(spellID, Unit, AfflictionType, ClearCurrentTarget)
        end
        Dcr_Cast_CureSpell = DCR_CAST
    end

    local oldUseAction = UseAction
    UseAction = function(slot, checkCursor, onSelf)
        RPLLTT:ClearLines()
        RPLLTT:SetAction(slot)
        RPLL:AwaitHotDispel(RPLLTTTextLeft1:GetText())
        oldUseAction(slot, checkCursor, onSelf)
    end

    local oldCastSpellByName = CastSpellByName
    CastSpellByName = function(spellName, onSelf)
        RPLL:AwaitHotDispel(spellName)
        oldCastSpellByName(spellName, onSelf)
    end

    local oldCastSpell = CastSpell
    local GetSpellName = GetSpellName
    CastSpell = function(spellID, spellbooktype)
        RPLL:AwaitHotDispel(GetSpellName(spellID, spellbooktype))
        oldCastSpell(spellID, spellbooktype)
    end

    local AwaitDispel = {}
    local NextTotemDispel = false
    function RPLL:AwaitDispel(ability, target, cause)
        if dispels[ability] and target then
            if not AwaitDispel[target] then AwaitDispel[target] = {} end
            tinsert(AwaitDispel[target], {cause, ability, GetTime(), 2})
            self:EvaluateDispel()
        end
    end

    local AwaitHotDispel = {}
    function RPLL:AwaitHotDispel(ability)
        if dispels[ability] then
            local target, cause, time = self:GetTarget(), Player, GetTime()
            if ability == translations[5] then
                ability = translations[4]
                target = cause
            end
            if ability == translations[7] then
                ability = translations[6]
                target = cause
            end
            tinsert(AwaitHotDispel, {cause, target, ability, time})    
        end
    end

    local ActiveHotDispel = {}
    local lastDispel = nil;
    function RPLL:RemoveActiveHotDispel(target, ability)
        if ActiveHotDispel[target] then
            for ca, va in pairs(ActiveHotDispel[target]) do
                if va[2]==ability then
                    tremove(ActiveHotDispel[target], ca)
                    self:RemoveActiveHotDispel(target, ability)
                    break
                end
            end
        end
    end

    function RPLL:RegisterHotDispel(target, ability)
        if ability and dispels[ability] then
            for cat, val in pairs(AwaitHotDispel) do
                if val and val[2]==target and val[3]==ability then
                    if not ActiveHotDispel[val[2]] then ActiveHotDispel[val[2]] = {} end
                    lastDispel = target;
                    self:RemoveActiveHotDispel(val[2], val[3])
                    tinsert(ActiveHotDispel[val[2]], {val[1], val[3]})
                    self:EvaluateDispel()
                    break
                end
            end
        end
    end

    function RPLL:ClearAwaitHotDispel()
        local time = GetTime()
        for cat, val in pairs(AwaitHotDispel) do
            if (time-val[4])>=10 then
                AwaitHotDispel[cat] = nil
            end
        end
    end

    local ConfirmedDispel = {}
    function RPLL:ConfirmRealDispel(ability, target)
        if ability and dispels[ability] then
            if not ConfirmedDispel[target] then ConfirmedDispel[target] = {} end
            tinsert(ConfirmedDispel[target], {ability, GetTime()})
            lastDispel = target;
            self:EvaluateDispel()
            NextTotemDispel = true
        end
    end

    function RPLL:ApplyRemainingDispels()
        if UnitFactionGroup("player")~="horde" then NextTotemDispel = false; return end
        local num = 0
        local time = GetTime()
        local type = "party"
        local tnum = GetNumPartyMembers()
        if tnum <= 0 then
            type="raid"
            tnum=GetNumRaidMembers()
        end
        local subGRP, PSGRP, c = {}
        for cat, val in pairs(ConfirmedDispel) do
            for ca, va in val do
                num = num + 1
                if (time-va[2])>10 and (time-va[2])<40 then
                    if type=="party" then
                        for i=1, tnum do
                            if UnitClass(type..i)==8 then
                                self:Dispels(UnitName(type..i), translations[3], cat, va[1])
                                tremove(ConfirmedDispel[cat], ca)
                                return
                            end
                        end
                    else
                        subGRP, PSGRP, c = {}
                        for i=1, tnum do
                            _, _, c = GetRaidRosterInfo(i)
                            if UnitClass(type..i)==8 then
                                subGRP[c] = UnitName(type..i)
                            end
                            if UnitName(type..i)==cat then
                                PSGRP = c
                            end
                            if PSGRP and subGRP[PSGRP] then
                                self:Dispels(subGRP[PSGRP], translations[3], cat, va[1])
                                tremove(ConfirmedDispel[cat], ca)
                                return
                            end
                        end
                    end
                end
            end
        end
        if num == 0 then
            NextTotemDispel = false
        end
    end

    function RPLL:EvaluateDispel()
        local time, check = GetTime()
        for cat, val in pairs(ActiveHotDispel) do
            for ca, va in pairs(val) do
                if ConfirmedDispel[cat] then
                    if va[2]~=translations[4] or (va[2]==translations[4] and va[1]==cat) then
                        check = nil
                        for q, t in pairs(ConfirmedDispel[cat]) do
                            if DPSMate.Parser.HotDispels[va[2]] then
                                if not check then
                                    check = t[1]
                                    tremove(ConfirmedDispel[cat], q)
                                end
                            end
                        end
                        if check then
                            self:Dispels(va[1], va[2], cat, check)
                            lastDispel = nil;
                            return
                        end
                    end
                end
            end
        end
        for cat, val in pairs(AwaitDispel) do
            for ca, va in pairs(val) do
                if (time-(va[3] or 0))<=10 then
                    if ConfirmedDispel[cat] then
                        if va[2]~=translations[4] then
                            if ConfirmedDispel[cat][1] then
                                self:Dispels(va[1], va[2], cat, ConfirmedDispel[cat][1][1])
                                tremove(ConfirmedDispel[cat], 1)
                                AwaitDispel[cat][ca][4] = AwaitDispel[cat][ca][4] - 1
                                if AwaitDispel[cat][ca][4]<=0 then
                                    tremove(AwaitDispel[cat], ca)
                                end
                                self:EvaluateDispel()
                                return
                            end
                        end
                    end
                end
            end
        end
    end

    function RPLL:UnregisterHotDispel(target, ability)
        if target and ability then
            if not ActiveHotDispel[target] then return end
            for cat, val in pairs(ActiveHotDispel[target]) do
                if val[2]==ability then
                    tremove(ActiveHotDispel[target], cat)
                    break
                end
            end
        end
    end

    function RPLL:Dispels(cause, Dname, target, ability)
        if dispels[Dname] then
            self:CreateDummyPlayer(cause)
             if self.PlayerData[target] then
                tinsert(self.Session, "M"..self:formatTimeAlpha().."}"..self.PlayerData[cause][1].."}"..self.PlayerData[target][1].."}"..self:RegisterAbility(Dname).."}"..self:RegisterAbility(ability))
            else
                tinsert(self.Session, "M"..self:formatTimeAlpha().."}"..self.PlayerData[cause][1].."}-"..self:RegisterNPC(target).."}"..self:RegisterAbility(Dname).."}"..self:RegisterAbility(ability))
            end
        end
    end
end