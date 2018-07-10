local RPLL = RPLL

local cbtevents = RPLL.LOCAL[4]

local tinsert = table.insert
local strgfind = string.gfind
local UnitName = UnitName
local UnitHealth = UnitHealth
local UnitHealthMax = UnitHealthMax
local UnitIsPlayer = UnitIsPlayer
local Player = UnitName("player")

RPLL:RegisterEvent("CHAT_MSG_SPELL_SELF_BUFF")

RPLL:RegisterEvent("CHAT_MSG_SPELL_PERIODIC_SELF_BUFFS")

RPLL:RegisterEvent("CHAT_MSG_SPELL_PERIODIC_FRIENDLYPLAYER_BUFFS")
RPLL:RegisterEvent("CHAT_MSG_SPELL_PERIODIC_HOSTILEPLAYER_BUFFS ")
RPLL:RegisterEvent("CHAT_MSG_SPELL_PERIODIC_PARTY_BUFFS")

RPLL:RegisterEvent("CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF")
RPLL:RegisterEvent("CHAT_MSG_SPELL_PARTY_BUFF")
RPLL:RegisterEvent("CHAT_MSG_SPELL_FRIENDLYPLAYER_BUFF")


RPLL.CHAT_MSG_SPELL_SELF_BUFF = function(msg)
    this:RemoveHook(msg)    
    for i=44, 45 do -- selfself
        for ability, amount in strgfind(msg, cbtevents[i]) do
            this:GetOverHeal(ability, Player, Player, amount)
            return
        end
    end
    for i=42, 43 do -- selfother
        for ability, target, amount in strgfind(msg, cbtevents[i]) do
            this:GetOverHeal(ability, Player, target, amount)
            return
        end
    end
end

RPLL.CHAT_MSG_SPELL_PERIODIC_SELF_BUFFS = function(msg)
    this:RemoveHook(msg)    
    for amount, cause, ability in strgfind(msg, cbtevents[49]) do -- otherself
        this:GetOverHeal(ability, cause, Player, amount)
        return
    end
    for amount, ability in strgfind(msg, cbtevents[47]) do -- selfself
        this:GetOverHeal(ability, Player, Player, amount)
        return
    end
end

RPLL.CHAT_MSG_SPELL_PERIODIC_FRIENDLYPLAYER_BUFFS = function(msg)
    this:RemoveHook(msg)    
    for target, amount, ability in strgfind(msg, cbtevents[46]) do -- selfother
        this:GetOverHeal(ability, Player, target, amount)
        return
    end
    for target, amount, cause, ability in strgfind(msg, cbtevents[48]) do -- otherother
        this:GetOverHeal(ability, cause, target, amount)
        return
    end
end

RPLL.CHAT_MSG_SPELL_PERIODIC_HOSTILEPLAYER_BUFFS = function(msg)
    this.CHAT_MSG_SPELL_PERIODIC_FRIENDLYPLAYER_BUFFS(msg)
end

RPLL.CHAT_MSG_SPELL_PERIODIC_PARTY_BUFFS = function(msg)
    this.CHAT_MSG_SPELL_PERIODIC_FRIENDLYPLAYER_BUFFS(msg)
end

RPLL.CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF = function(msg)
    this:RemoveHook(msg)    
    for i=40,41 do -- otherself
        for cause, ability, amount in strgfind(msg, cbtevents[i]) do
            this:GetOverHeal(ability, cause, Player, amount)
            return
        end
    end 
    for i=38,39 do -- otherother
        for cause, ability, target, amount in strgfind(msg, cbtevents[i]) do
            this:GetOverHeal(ability, cause, target, amount)
            return
        end
    end 
end

RPLL.CHAT_MSG_SPELL_PARTY_BUFF = function(msg)
    this.CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF(msg)
end

RPLL.CHAT_MSG_SPELL_FRIENDLYPLAYER_BUFF = function(msg)
    this.CHAT_MSG_SPELL_HOSTILEPLAYER_BUFF(msg)
end

function RPLL:GetUnitByName(target)
	local rpll_unit = self.TargetParty[target]
	if not rpll_unit then
		if target==UnitName("player") then
			rpll_unit="player"
		elseif target==UnitName("target") then
			rpll_unit="target"
		end
	end
	return rpll_unit
end

-- keeping it as string permutation
local combinedCache = {}
local cacheCounter = 1
function RPLL:ResetCacheCounter()
    combinedCache = {}
    cacheCounter = 1
end

function RPLL:GetCombinedAbidCidTid(abid, cid, tid)
    local perm = abid..","..cid..","..tid
    if not combinedCache[perm] then
        combinedCache[perm] = cacheCounter
        tinsert(self.Session, "K"..abid.."}"..cid.."}"..tid)
        cacheCounter = cacheCounter + 1
    end
    return combinedCache[perm]
end

function RPLL:GetOverHeal(ability, cause, target, rawheal)
    local result, unit_rpll = 0, self:GetUnitByName(target)
	if unit_rpll then 
        result = rawheal-(UnitHealthMax(unit_rpll)-UnitHealth(unit_rpll))
    end
	if result>0 then
        --[[
        DEFAULT_CHAT_FRAME:AddMessage("------------------------------------")
        DEFAULT_CHAT_FRAME:AddMessage("Raw heal: "..rawheal)
        DEFAULT_CHAT_FRAME:AddMessage("Overheal: "..result)
        DEFAULT_CHAT_FRAME:AddMessage("Cause: "..cause)
        DEFAULT_CHAT_FRAME:AddMessage("Target: "..target)
        DEFAULT_CHAT_FRAME:AddMessage("Ability: "..ability)
        DEFAULT_CHAT_FRAME:AddMessage("Unit: "..unit_rpll)
        DEFAULT_CHAT_FRAME:AddMessage("UnitHealthMax: "..UnitHealthMax(unit_rpll).." AND UnitHealth: "..UnitHealth(unit_rpll))
        DEFAULT_CHAT_FRAME:AddMessage("------------------------------------")
        ]]--
        local unitcause = self:GetUnitByName(cause)
        if unitcause then
            self:CreateDummyPlayer(cause)
            if UnitIsPlayer(unit_rpll) then
                self:CreateDummyPlayer(target)
                tinsert(self.Session, "J"..self:formatTimeAlpha().."}"..self:GetCombinedAbidCidTid(self:RegisterAbility(ability), self.PlayerData[cause][1], self.PlayerData[target][1]).."}"..rawheal.."}"..result)
            else
                tinsert(self.Session, "J"..self:formatTimeAlpha().."}"..self:GetCombinedAbidCidTid(self:RegisterAbility(ability), self.PlayerData[cause][1], -self:RegisterNPC(target)).."}"..rawheal.."}"..result)
            end
        end
    end
end

