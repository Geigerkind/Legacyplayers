local RPLL = RPLL

local cbtevents = RPLL.LOCAL[4]

local tinsert = table.insert
local UnitName = UnitName
local UnitHealth = UnitHealth
local UnitHealthMax = UnitHealthMax
local UnitIsPlayer = UnitIsPlayer
local Player = UnitName("player")

RPLL:RegisterEvent("COMBAT_LOG_EVENT_UNFILTERED")

-- earthshield

local EarthShieldByPlayer = {}
local EarthShieldId = {
	[974]=true, -- Earth Shield (rank 1)
	[32593]=true, -- Earth Shield (rank 2)
	[32594]=true, -- Earth Shield (rank 3)
}
function RPLL:RegisterEarthShield(dstName, srcName)
	EarthShieldByPlayer[dstName] = srcName
end

function RPLL:GetEarthShieldOwner(srcName)
	if EarthShieldByPlayer[srcName] then
		return EarthShieldByPlayer[srcName]
	end
	return srcName
end


-- lifebloom

local LifeBloomByPlayer = {}
function RPLL:RegisterLifeBloom(dstName, srcName)
	LifeBloomByPlayer[dstName] = srcName
end

function RPLL:LifeBloomOwner(srcName)
	if LifeBloomByPlayer[srcName] then
		return LifeBloomByPlayer[srcName]
	end
	return srcName
end

local possEvents = {
    [1] = {
        ["SPELL_HEAL"] = true,
        ["SPELL_PERIODIC_HEAL"] = true,
    },
    [2] = {
        ["SPELL_CAST_SUCCESS"] = true,
        ["SPELL_INSTAKILL"] = true,
    }
}

RPLL.COMBAT_LOG_EVENT_UNFILTERED = function(arg1,event,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9,arg10,arg11)
    -- arg1 => ts
    if possEvents[1][event] then
        -- Prayer of Mending: 33110 How do I know if the source is messed up?
        if arg8 == 379 then
            arg3 = this:GetEarthShieldOwner(arg3)
        elseif arg8 == 33763 then
            arg3 = this:LifeBloomOwner(arg3)
        end

        if not arg3 then return end
        this:GetOverHeal(arg9, arg3, arg6, arg11, arg8, arg2, arg5);
    elseif possEvents[2][event] then
        if not arg3 then return end
        --if arg9 == 33110 then
        --    this:POM_Casted(arg4,arg7)
        --    return
        --end
        if EarthShieldId[arg8] then
            this:RegisterEarthShield(arg6, arg3)
            return
        end
        if arg8 == 33763 then
            this:RegisterLifeBloom(arg6, arg3)
            return
        end
    else
        this:AttemptEvents(event,arg1,arg2,arg3,arg4,arg5,arg6)
    end
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

function RPLL:GetOverHeal(ability, cause, target, rawheal, spellid, causeGUID, targetGUID)
    local result, unit_rpll = 0, self:GetUnitByName(target)
	if unit_rpll then 
        result = rawheal-(UnitHealthMax(unit_rpll)-UnitHealth(unit_rpll))
    end
	if result>0 then
        local unitcause = self:GetUnitByName(cause)
        if unitcause then

            self:CreateDummyPlayer(cause)
            if UnitIsPlayer(unit_rpll) then
                self:CreateDummyPlayer(target)
                tinsert(self.Session, "J"..self:formatTimeAlpha().."}"..self:GetCombinedAbidCidTid(self:RegisterAbility(spellid), self.PlayerData[cause][1], self.PlayerData[target][1]).."}"..rawheal.."}"..result)
            else
                tinsert(self.Session, "J"..self:formatTimeAlpha().."}"..self:GetCombinedAbidCidTid(self:RegisterAbility(spellid), self.PlayerData[cause][1], -self:RegisterNPC(self:GetNPCID(targetGUID))).."}"..rawheal.."}"..result)
            end
        end
    end
end

