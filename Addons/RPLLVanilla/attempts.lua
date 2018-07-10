local RPLL = RPLL

local bN = RPLL.LOCAL[1]
local cbtevents = RPLL.LOCAL[4]

local strgfind = string.gfind
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
-- atmt and bosshealth workaround
RPLL:RegisterEvent("CHAT_MSG_COMBAT_SELF_HITS")
RPLL:RegisterEvent("CHAT_MSG_COMBAT_PARTY_HITS")
RPLL:RegisterEvent("CHAT_MSG_COMBAT_FRIENDLYPLAYER_HITS")

RPLL.CHAT_MSG_COMBAT_SELF_HITS = function(msg)
    for i=30, 33 do
        for target in strgfind(msg, cbtevents[i]) do
            this:StartBossAttempt(target)
            return
        end
    end
end

RPLL.CHAT_MSG_COMBAT_PARTY_HITS = function(msg)
    for i=34, 37 do
        for _, target in strgfind(msg, cbtevents[i]) do
            this:StartBossAttempt(target)
            return
        end
    end
end

RPLL.CHAT_MSG_COMBAT_FRIENDLYPLAYER_HITS = function(msg)
    for i=34, 37 do
        for _, target in strgfind(msg, cbtevents[i]) do
            this:StartBossAttempt(target)
            return
        end
    end
end

RPLL:RegisterEvent("PLAYER_REGEN_DISABLED")
RPLL:RegisterEvent("PLAYER_REGEN_ENABLED")
RPLL:RegisterEvent("CHAT_MSG_COMBAT_HOSTILE_DEATH")

local bossDied = {}
RPLL.CHAT_MSG_COMBAT_HOSTILE_DEATH = function(msg)
    for unit in strgfind(msg, cbtevents[29]) do
        if unittargetingboss and bN[unit] then
            unittargetingboss[unit] = false
            attempthasboss[unit] = false
            tinsert(this.Session, "X"..this:formatTimeAlpha().."}"..this:RegisterNPC(unit).."}"..this:GetInstanceId())
            bossDied[unit] = GetTime() -- Could be a problem with repeating dieing bosses! In a lower timeframe than 30 seconds!
            -- Sending Boss died event across the addons so we catch all we can!
            SendAddonMessage("RPLL_DEATH", unit, "RAID")
            this:ZONE_CHANGED_NEW_AREA()
        end
        if this.MasterTarget and this.MasterTarget == unit then
            this.MasterTarget = nil
        end
    end
end
function RPLL:CHAT_MSG_ADDON_DEATH(arg1, arg2, arg3, arg4)
    if arg1 == "RPLL_DEATH" and arg4 ~= UnitName("player") and arg2 then
        if not bossDied[arg2] or bossDied[arg2] + 30 > GetTime() then
            tinsert(self.Session, "X"..self:formatTimeAlpha().."}"..self:RegisterNPC(arg2).."}"..self:GetInstanceId())
            this:ZONE_CHANGED_NEW_AREA()
        end
        if this.MasterTarget and this.MasterTarget == arg2 then
            this.MasterTarget = nil
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

function RPLL:StartBossAttempt(arg2)
    if bN[arg2] then
        if not attempthasboss then
            attempthasboss = {}
            bosshealth = {}
            unittargetingboss = {}
        end
        if not attempthasboss[arg2] then
            attempthasboss[arg2] = true
            bosshealth[arg2] = ""
            unittargetingboss[arg2] = false
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
                if threatbuffer and pendingAttempt>atmtincbt then
                    -- Threat
                    for cat, val in pairs(threatbuffer) do
                        self:CreateDummyPlayer(cat)
                        tinsert(self.Session, "O"..self.PlayerData[cat][1].."}"..val)
                    end
                    threatbuffer = {}
                    PlayerThreat = 0
                end
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
                                tinsert(self.Session, "H"..self:RegisterNPC(cat).."}"..self:formatTimeAlpha().."}"..strformat("%.3f", health))
                                bosshealth[cat] = health
                            end
                        end
                    else
                        health = 100*(UnitHealth(unit.."target")/UnitHealthMax(unit.."target"))
                        if UnitHealthMax(unit.."target") then
                            if health and (not bosshealth[cat] or bosshealth[cat]~=health) then
                                tinsert(self.Session, "H"..self:RegisterNPC(cat).."}"..self:formatTimeAlpha().."}"..strformat("%.3f", health))
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