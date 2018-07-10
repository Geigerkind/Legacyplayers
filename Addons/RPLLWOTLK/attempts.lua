local RPLL = RPLL

local bN = RPLL.LOCAL[1]
local cbtevents = RPLL.LOCAL[4]

local IsInInstance = IsInInstance
local tinsert = table.insert
local GetNumPartyMembers = GetNumPartyMembers
local GetNumRaidMembers = GetNumRaidMembers
local UnitAffectingCombat = UnitAffectingCombat
local UnitHealth = UnitHealth
local UnitHealthMax = UnitHealthMax

local pendingAttempt = 0
local attempthasboss = false
local unittargetingboss = false
local bosshealth = {}

local strformat = string.format

local bossDied = {}
local possibleEvents = {
    ["SWING_DAMAGE"] = true,
    ["SWING_MISSED"] = true,
    ["SPELL_DAMAGE"] = true,
    ["RANGE_DAMAGE"] = true,
    ["SPELL_PERIODIC_DAMAGE"] = true,
    ["DAMAGE_SHIELD"] = true,
    ["DAMAGE_SPLIT"] = true,
    ["SPELL_MISSED"] = true,
    ["RANGE_MISSED"] = true,
    ["SPELL_PERIODIC_MISSED"] = true,
    ["DAMAGE_SHIELD_MISSED"] = true,
}

function RPLL:AttemptEvents(event, arg1,arg2,arg3,arg4,arg5,arg6)
    if possibleEvents[event] then
        if not self.TargetParty[arg3] then return end -- Not a party member!
        local npcid = self:GetNPCID(arg5)
        self:StartBossAttempt(npcid, arg6)
    elseif event == "UNIT_DIED" or event == "UNIT_DESTROYED" then
        local npcid = self:GetNPCID(arg5)
        if unittargetingboss and bN[npcid] then
            unittargetingboss[arg6] = false
            attempthasboss[arg6] = false
            tinsert(self.Session, "X"..self:formatTimeAlpha().."}"..self:RegisterNPC(npcid).."}"..self:GetInstanceId())
            bossDied[npcid] = GetTime() -- Could be a problem with repeating dieing bosses! In a lower timeframe than 30 seconds!
            -- Sending Boss died event across the addons so we catch all we can!
            SendAddonMessage("RPLL_DEATH", npcid, "RAID")
            this:ZONE_CHANGED_NEW_AREA()
        end
    end
end

RPLL:RegisterEvent("PLAYER_REGEN_DISABLED")
RPLL:RegisterEvent("PLAYER_REGEN_ENABLED")

function RPLL:CHAT_MSG_ADDON_DEATH(arg1, arg2, arg3, arg4)
    if arg1 == "RPLL_DEATH" and arg4 ~= UnitName("player") and arg2 then
        if not bossDied[arg2] or bossDied[arg2] + 30 > GetTime() then
            tinsert(self.Session, "X"..self:formatTimeAlpha().."}"..self:RegisterNPC(arg2).."}"..self:GetInstanceId())
            this:ZONE_CHANGED_NEW_AREA()
        end
    end
end

RPLL.PLAYER_REGEN_DISABLED = function()
    if IsInInstance() then
        tinsert(this.Session, "C"..this:formatTimeAlpha())
    end
end
RPLL.PLAYER_REGEN_ENABLED = function()
    if IsInInstance() then
        tinsert(this.Session, "D"..this:formatTimeAlpha())
    end
end

local bossNameToId = {}
function RPLL:StartBossAttempt(arg2, bossname)
    if bN[arg2] then
        if not attempthasboss then
            attempthasboss = {}
            bosshealth = {}
            unittargetingboss = {}
            bossNameToId = {}
        end
        if not attempthasboss[bossname] then
            attempthasboss[bossname] = true
            bosshealth[bossname] = ""
            unittargetingboss[bossname] = false
            bossNameToId[bossname] = arg2
            tinsert(self.Session, "G"..self:formatTimeAlpha().."}"..self:RegisterNPC(arg2))
        end
    end
end

local atmtupdate = 0
local atmttype, grpnum, atmtincbt, atmtkind
function RPLL:UpdateAttempts(elapsed)
    if atmtupdate>0.5 then
        atmttype = "raid"
        atmtincbt = 0
        grpnum = GetNumRaidMembers()
        if grpnum <= 0 then
            atmttype = "party"
            grpnum = GetNumPartyMembers()
        end
        if grpnum>0 then
            for i=1, grpnum do
                if UnitAffectingCombat(atmttype..i) then
                    atmtincbt = atmtincbt + 1
                end
            end
            if pendingAttempt ~= atmtincbt then
                tinsert(self.Session, "E"..self:formatTimeAlpha().."}"..atmtincbt)
                pendingAttempt = atmtincbt
            end
        else
            pendingAttempt = 0
        end
        atmtupdate = 0
    end
    atmtupdate = atmtupdate + elapsed
end

-- Bosshealth
-- In general if we receive any yell event of a boss, we can start finding a units target
function RPLL:GetUnitTargetingBoss(bossname)
    if unittargetingboss[bossname] and UnitName(unittargetingboss[bossname].."target") == bossname then
        return unittargetingboss[bossname]
    else
        if UnitName("target") == bossname then unittargetingboss[bossname] = "player"; return "player"
        else 
            for i=1, GetNumPartyMembers() do
                if UnitName("party"..i.."target") == bossname then unittargetingboss[bossname] = "party"..i; return "party"..i end 
            end
            for i=1, GetNumRaidMembers() do
                if UnitName("raid"..i.."target") == bossname then unittargetingboss[bossname] = "raid"..i; return "raid"..i end 
            end
        end
    end
end

local bossupdater = 0
local health = 0
function RPLL:CheckBossHealth(elapsed)
    if bossupdater>5 and attempthasboss then
        for cat, val in pairs(attempthasboss) do
            if val then
                local unit = self:GetUnitTargetingBoss(cat)
                if unit then
                    if unit == "player" then
                        health = 100*(UnitHealth("target")/UnitHealthMax("target"))
                        if (UnitHealthMax("target") > 0) then
                            if health and (not bosshealth[cat] or bosshealth[cat]~=health) then
                                tinsert(self.Session, "H"..self:RegisterNPC(bossNameToId[cat]).."}"..self:formatTimeAlpha().."}"..strformat("%.3f", health))
                                bosshealth[cat] = health
                            end
                        end
                    else
                        health = 100*(UnitHealth(unit.."target")/UnitHealthMax(unit.."target"))
                        if UnitHealthMax(unit.."target") then
                            if health and (not bosshealth[cat] or bosshealth[cat]~=health) then
                                tinsert(self.Session, "H"..self:RegisterNPC(bossNameToId[cat]).."}"..self:formatTimeAlpha().."}"..strformat("%.3f", health))
                                bosshealth[cat] = health
                            end
                        end
                    end
                end
                if pendingAttempt<=1 then
                    unittargetingboss[cat] = false
                    attempthasboss[cat] = false
                    bosshealth[cat] = nil
                end
            else
                unittargetingboss[cat] = false
                attempthasboss[cat] = false
                bosshealth[cat] = nil
            end
        end
    end
    bossupdater = bossupdater + elapsed
end