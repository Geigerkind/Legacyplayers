CreateFrame("GameTooltip", "RPLLTT", UIParent, "GameTooltipTemplate")
RPLLTT:SetOwner(UIParent, "ANCHOR_NONE")
local RPLLTT = RPLLTT
local RPLL = RPLL
local cbtevents = RPLL.LOCAL[4]
local translations = RPLL.LOCAL[2]

local string.gmatch = string.gfind
local tinsert = table.insert
local tremove = table.remove
local GetTime = GetTime
local GetSpellName = GetSpellName
local pairs = pairs

local kicks = {
    -- Interrupts
    -- Rogue
    ["Kick"] = true,
    -- Warrior
    ["Pummel"] = true,
    ["Shield Bash"] = true,
    
    -- Mage
    ["Counterspell"] = true,
    ["Counterspell - Silenced"] = true,
    
    -- Shaman
    ["Earth Shock"] = true,
    
    -- Priest
    ["Silence"] = true,
    
    -- Stuns
    -- Rogue
    ["Gouge"] = true,
    ["Kidney Shot"] = true,
    ["Cheap Shot"] = true,
    
    -- Hunter
    ["Scatter Shot"] = true,
    ["Improved Concussive Shot"] = true,
    ["Wyvern Sting"] = true,
    ["Intimidation"] = true,
    
    -- Warrior
    ["Charge Stun"] = true,
    ["Intercept Stun"] = true,
    ["Concussion Blow"] = true,
    
    -- Druid
    ["Feral Charge"] = true,
    ["Feral Charge Effect"] = true,
    ["Bash"] = true,
    ["Pounce"] = true,
    
    -- Mage
    ["Impact"] = true,
    
    -- Paladin
    ["Repentance"] = true,
    ["Hammer of Justice"] = true,
    
    -- Warlock
    ["Pyroclasm"] = true,
    ["Death Coil"] = true,
    
    -- Priest
    ["Blackout"] = true,
    
    -- General
    ["Tidal Charm"] = true,
    ["Reckless Charge"] = true,

    ["Tritt"] = true,
    ["Zuschlagen"] = true,
    ["Schildhieb"] = true,
    ["Gegenzauber"] = true,
    ["Erdschock"] = true,
    ["Stille"] = true,
    ["Solarplexus"] = true,
    ["Nierenhieb"] = true,
    ["Fieser Trick"] = true,
    ["Streuschuss"] = true,
    ["Verbesserter Erschütternder Schuss"] = true,
    ["Stich des Flügeldrachen"] = true,
    ["Einschüchterung"] = true,
    ["Sturmangriffsbetubung"] = true,
    ["Betäubung abfangen"] = true,
    ["Erschütternder Schlag"] = true,
    ["Wilde Attacke"] = true,
    ["Bewegungsunfähig"] = true,
    ["Hieb"] = true,
    ["Anspringen"] = true,
    ["Einschlag"] = true,
    ["Buße"] = true,
    ["Hammer der Gerechtigkeit"] = true,
    ["Feuerschwall"] = true,
    ["Todesmantel"] = true,
    ["Verdunkelung"] = true,
    ["Gezeitenglücksbringer"] = true,
    ["Tollkünes Stürmen"] = true,

    ["Coup de pied"] = true,
    ["Volée de coups"] = true,
    ["Coup de bouclier"] = true,
    ["Contresort"] = true,
    ["Horion de terre"] = true,
    ["Silence"] = true,
    ["Suriner"] = true,
    ["Aiguillon perfide"] = true,
    ["Coup bas"] = true,
    ["Flèche de dispersion"] = true,
    ["Trait de choc amélioré"] = true,
    ["Piqûre de wyverne"] = true,
    ["Intimidation"] = true,
    ["Porteguerre"] = true,
    ["Interception"] = true,
    ["Coup traumatisant"] = true,
    ["Charge sauvage"] = true,
    ["Immobilisé"] = true,
    ["Sonner"] = true,
    ["Traquenard"] = true,
    ["Impact"] = true,
    ["Repentir"] = true,
    ["Marteau de la justice"] = true,
    ["Pyroclasme"] = true,
    ["Voile mortel"] = true,
    ["Aveuglement"] = true,
    ["Charme des flots"] = true,
    ["Charge téméraire"] = true,

    ["Пинок"] = true,
    ["Зуботычина"] = true,
    ["Удар щитом"] = true,
    ["Антимагия"] = true,
    ["Земной шок"] = true,
    ["Безмолвие"] = true,
    ["Парализующий удар"] = true,
    ["Удар по почкам"] = true,
    ["Подлый трюк"] = true,
    ["Дезориентирующий выстрел"] = true,
    ["Улучшенный контузящий выстрел"] = true,
    ["Укус виверны"] = true,
    ["Устрашение"] = true,
    ["Атака-оглушение"] = true,
    ["Перехват оглушение."] = true,
    ["Оглушающий удар"] = true,
    ["Звериная атака"] = true,
    ["Звериная атака - эффект"] = true,
    ["Оглушить"] = true,
    ["Наскок"] = true,
    ["Сотрясение"] = true,
    ["Покаяние"] = true,
    ["Молот правосудия"] = true,
    ["Огнесдвиг"] = true,
    ["Лик смерти"] = true,
    ["Затмение"] = true,
    ["Приливное подчинение"] = true,
    ["Безрассудная атака"] = true,

    ["脚踢"] = true,
    ["拳击"] = true,
    ["盾击"] = true,
    ["法术反制"] = true,
    ["大地震击"] = true,
    ["沉默"] = true,
    ["凿击"] = true,
    ["肾击"] = true,
    ["偷袭"] = true,
    ["驱散射击"] = true,
    ["强化震荡射击"] = true,
    ["翼龙钉刺"] = true,
    ["胁迫"] = true,
    ["战神"] = true,
    ["拦截"] = true,
    ["震荡猛击"] = true,
    ["野性冲锋"] = true,
    ["无法移动"] = true,
    ["猛击"] = true,
    ["突袭"] = true,
    ["Impact"] = true,
    ["忏悔"] = true,
    ["制裁之锤"] = true,
    ["火焰冲撞"] = true,
    ["凋零缠绕"] = true,
    ["眩晕"] = true,
    ["潮汐咒符"] = true,
    ["无畏冲锋"] = true,
}

if DPSMate and DPSMate.RegistredModules["interrupts"] then
    DPSMate.DB.oldKick = DPSMate.DB.Kick
    function DPSMate.DB:Kick(cause, target, causeAbility, targetAbility)
        if kicks[causeAbility] then
            RPLL:CreateDummyPlayer(cause)
            if RPLL.PlayerData[target] then
                tinsert(RPLL.Session, "L"..RPLL:formatTimeAlpha().."}"..RPLL.PlayerData[cause][1].."}"..RPLL.PlayerData[target][1].."}"..RPLL:RegisterAbility(causeAbility).."}"..RPLL:RegisterAbility(targetAbility))
            else
                tinsert(RPLL.Session, "L"..RPLL:formatTimeAlpha().."}"..RPLL.PlayerData[cause][1].."}-"..RPLL.RegisterNPC(target).."}"..RPLL:RegisterAbility(causeAbility).."}"..RPLL:RegisterAbility(targetAbility))
            end
        end
        DPSMate.DB:oldKick(cause, target, causeAbility, targetAbility)
    end
else

    RPLL.trackkicks = true
    RPLL.CHAT_MSG_SPELL_PERIODIC_CREATURE_DAMAGE = function(arg1)
        for target, ability in string.gmatch(arg1, cbtevents[5]) do
            this:ConfirmAfflicted(target, ability)
        end
    end
    RPLL.CHAT_MSG_SPELL_CREATURE_VS_CREATURE_DAMAGE = function(arg1)
        for cause, ability in string.gmatch(arg1, cbtevents[6]) do
            this:RegisterPotentialKick(cause, ability)
            return
        end
        for cause, ability in string.gmatch(arg1, cbtevents[7]) do
            this:RegisterPotentialKick(cause, ability)
        end
    end
    RPLL.CHAT_MSG_SPELL_CREATURE_VS_SELF_DAMAGE = function(arg1)
        for i=8, 11 do
            for cause, ability in string.gmatch(arg1, cbtevents[i]) do
                this:UnregisterPotentialKick(cause, ability, GetTime())
                return
            end
        end
    end
    RPLL.CHAT_MSG_SPELL_CREATURE_VS_PARTY_DAMAGE = function(arg1)
        for i=12, 15 do
            for cause, ability in string.gmatch(arg1, cbtevents[i]) do
                this:UnregisterPotentialKick(cause, ability, GetTime())
                return
            end
        end
    end
    RPLL.CHAT_MSG_SPELL_HOSTILEPLAYER_DAMAGE = function(arg1)
        local causeAbility = translations[1]
        for cause, target, ability in string.gmatch(arg1, cbtevents[16]) do
            if this.PlayerData[cause] and this.PlayerData[cause][4] == "priest" then
                causeAbility = translations[2]
            end
            this:Kick(cause, target, causeAbility, ability)
            return
        end
        for cause, ability in string.gmatch(arg1, cbtevents[17]) do
            if this.PlayerData[cause] and this.PlayerData[cause][4] == "priest" then
                causeAbility = translations[2]
            end
            this:Kick(cause, Player, causeAbility, ability)
            return
        end
    end
    RPLL.CHAT_MSG_SPELL_FRIENDLYPLAYER_DAMAGE = function(arg1)
        local causeAbility = translations[1]
        for cause, target, ability in string.gmatch(arg1, cbtevents[16]) do
            if this.PlayerData[cause] and this.PlayerData[cause][4] == "priest" then
                causeAbility = translations[2]
            end
            this:Kick(cause, target, causeAbility, ability)
            return
        end
        for cause, ability in string.gmatch(arg1, cbtevents[17]) do
            if this.PlayerData[cause] and this.PlayerData[cause][4] == "priest" then
                causeAbility = translations[2]
            end
            this:Kick(cause, Player, causeAbility, ability)
            return
        end
    end
    RPLL.CHAT_MSG_SPELL_SELF_DAMAGE = function(arg1)
        local causeAbility = translations[1]
        for target, ability in string.gmatch(arg1, cbtevents[18]) do
            if this.PlayerData[Player] and this.PlayerData[Player][4] == "priest" then
                causeAbility = translations[2]
            end
            this:Kick(Player, target, causeAbility, ability)
        end
    end
    RPLL.CHAT_MSG_SPELL_PARTY_DAMAGE = function()
        local causeAbility = translations[1]
        for cause, target, ability in string.gmatch(arg1, cbtevents[16]) do
            if this.PlayerData[cause] and this.PlayerData[cause][4] == "priest" then
                causeAbility = translations[2]
            end
            this:Kick(cause, target, causeAbility, ability)
            return
        end
        for cause, ability in string.gmatch(arg1, cbtevents[17]) do
            if this.PlayerData[cause] and this.PlayerData[cause][4] == "priest" then
                causeAbility = translations[2]
            end
            this:Kick(cause, Player, causeAbility, ability)
            return
        end
    end -- cbt and kicks
    RPLL.OLD_CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF = RPLL.CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF
    RPLL.CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF = function(arg1)
        for cause, ability in string.gmatch(arg1, cbtevents[6]) do
            this:RegisterPotentialKick(cause, ability)
            return
        end
        for cause, ability in string.gmatch(arg1, cbtevents[7]) do
            this:RegisterPotentialKick(cause, ability)
        end
        this.OLD_CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF(arg1)
    end
    RPLL:RegisterEvent("CHAT_MSG_SPELL_PERIODIC_CREATURE_DAMAGE") 
    RPLL:RegisterEvent("CHAT_MSG_SPELL_CREATURE_VS_CREATURE_DAMAGE")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_CREATURE_VS_SELF_DAMAGE")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_CREATURE_VS_PARTY_DAMAGE")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_HOSTILEPLAYER_DAMAGE")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_PARTY_DAMAGE")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_FRIENDLYPLAYER_DAMAGE")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_SELF_DAMAGE")
    RPLL:RegisterEvent("CHAT_MSG_SPELL_PARTY_DAMAGE")

    local oldUseAction = UseAction
    UseAction = function(slot, checkCursor, onSelf)
        RPLLTT:ClearLines()
        RPLLTT:SetAction(slot)
        RPLL:AwaitAfflicted(RPLLTTTextLeft1:GetText())
        oldUseAction(slot, checkCursor, onSelf)
    end

    local oldCastSpellByName = CastSpellByName
    CastSpellByName = function(spellName, onSelf)
        RPLL:AwaitAfflicted(spellName)
        oldCastSpellByName(spellName, onSelf)
    end

    local oldCastSpell = CastSpell
    local GetSpellName = GetSpellName
    CastSpell = function(spellID, spellbooktype)
        RPLL:AwaitAfflicted(GetSpellName(spellID, spellbooktype))
        oldCastSpell(spellID, spellbooktype)
    end

    local AwaitKick = {}
    local AfflictedStun = {}
    function RPLL:AwaitAfflicted(ability)
        if kicks[ability] then
            local time = GetTime()
            for cat, val in pairs(AfflictedStun) do
                if ((val[3]+0.5)<=time or (val[3]-0.5)>=time) then
                    return
                end
            end
            tinsert(AfflictedStun, {ability,self:GetTarget(),time})
        end
    end

    function RPLL:ConfirmAfflicted(target, ability)
        if target and ability then
            local time = GetTime()
            for cat, val in pairs(AfflictedStun) do	
                if val[1]==ability and val[2]==target and val[3]<=time then
                    if kicks[ability] then self:AssignPotentialKick(val[1], val[2], time) end
                    tremove(AfflictedStun, cat)
                    return 
                end
            end
        end
    end

    function RPLL:RegisterPotentialKick(cause, ability)
        if cause and ability and kicks[ability] then
            tinsert(AwaitKick, {cause, ability, GetTime()})
        end
    end

    function RPLL:UnregisterPotentialKick(cause, ability, time)
        for cat, val in pairs(AwaitKick) do
            if val[1]==cause and val[2]==ability and val[3]<=time then
                tremove(AwaitKick, cat)
                break
            end
        end
    end

    function RPLL:AssignPotentialKick(ability, target, time)
        for cat, val in pairs(AwaitKick) do
            if val[3]<=time then
                if not val[4] and val[1]==target then
                    val[4] = ability
                end
            end
        end
    end

    function RPLL:UpdateKicks()
        local time = GetTime()
        for cat, val in pairs(AwaitKick) do
            if (time-val[3])>=2.5 then
                if val[4] then
                    self:Kick(Player, val[1], val[4], val[2])
                end
                tremove(AwaitKick, cat)
                return
            end
        end
    end

    function RPLL:Kick(cause, target, causeAbility, targetAbility)
        if kicks[causeAbility] then
            self:CreateDummyPlayer(cause)
            if self.PlayerData[target] then
                tinsert(self.Session, "L"..self:formatTimeAlpha().."}"..self.PlayerData[cause][1].."}"..self.PlayerData[target][1].."}"..self:RegisterAbility(causeAbility).."}"..self:RegisterAbility(targetAbility))
            else
                tinsert(self.Session, "L"..self:formatTimeAlpha().."}"..self.PlayerData[cause][1].."}-"..self:RegisterNPC(target).."}"..self:RegisterAbility(causeAbility).."}"..self:RegisterAbility(targetAbility))
            end
        end
    end
end