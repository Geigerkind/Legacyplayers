local RPLL = RPLL

local UnitIsPlayer = UnitIsPlayer
local pairs = pairs
local GetNumPartyMembers = GetNumPartyMembers
local GetNumRaidMembers = GetNumRaidMembers
local UnitName = UnitName
local UnitLevel = UnitLevel
local strgfind = string.gfind
local UnitSex = UnitSex
local GetTime = GetTime
local strlower = strlower
local GetInspectHonorData = GetInspectHonorData
local GetGuildInfo = GetGuildInfo
local GetInspectPVPRankProgress = GetInspectPVPRankProgress
local GetInventoryItemLink = GetInventoryItemLink
local GetPVPRankInfo = GetPVPRankInfo
local UnitPVPRank = UnitPVPRank
local strsub = string.sub
local strfind = string.find

local classToId = {
    ["}"] = "}",
    ["warrior"] = 0,
    ["rogue"] = 1,
    ["priest"] = 2,
    ["hunter"] = 3,
    ["druid"] = 4,
    ["mage"] = 5,
    ["warlock"] = 6,
    ["paladin"] = 7,
    ["shaman"] = 8,
    ["deathknight"] = 9
}

local raceToId = {
    ["}"] = "}",
    ["human"] = 0,
    ["dwarf"] = 1,
    ["gnome"] = 2,
    ["nightelf"] = 3,
    ["draenei"] = 4,
    ["orc"] = 5,
    ["troll"] = 6,
    ["tauren"] = 7,
    ["undead"] = 8,
    ["forsaken"] = 8,
    ["bloodelf"] = 9
}

local factionToId = {
    ["}"] = "}",
    ["neutral"] = 0,
    ["alliance"] = 1,
    ["horde"] = 2
}

local oUnitClass = UnitClass
local function UnitClass(unit)
    local _,eC = oUnitClass(unit)
    return classToId[strlower(eC or "}")]
end
local oUnitRace = UnitRace
local function UnitRace(unit)
    local _,eR = oUnitRace(unit)
    return raceToId[strlower(eR or "}")]
end
local oUnitFactionGroup = UnitFactionGroup
local function UnitFactionGroup(unit)
    return factionToId[strlower(oUnitFactionGroup(unit) or "}")]
end

local playertablelength = 0
local Unknown = UNKNOWN
local issueNextCheck = false

RPLL.PLAYER_TARGET_CHANGED = function() 
    if UnitIsPlayer("target") then
        this:GrabPlayerData("target", false, false)
    end
end

RPLL.RAID_ROSTER_UPDATE = function()
    local time = this:formatTimeAlpha()
    for cat, val in pairs(this.PlayerData) do
        if val[44] then
            this.PlayerData[cat][45] = time
        end
    end
    for i=1, GetNumRaidMembers() do
        if UnitName("raid"..i) then
            this.TargetParty[UnitName("raid"..i)] = "raid"..i
            this:GrabPlayerData("raid"..i, false, true)
        end
    end
end
RPLL.PARTY_MEMBERS_CHANGED = function()
    local time = this:formatTimeAlpha()
    for cat, val in pairs(this.PlayerData) do
        if val[44] then
            this.PlayerData[cat][45] = time
        end
    end
    for i=1, GetNumPartyMembers() do
        if UnitName("party"..i) then
            this.TargetParty[UnitName("party"..i)] = "party"..i
            this:GrabPlayerData("party"..i, false, true)
        end
    end
end

local oldLeaveParty = LeaveParty
LeaveParty = function()
    oldLeaveParty();
    local time = RPLL:formatTimeAlpha()
    for cat, val in pairs(RPLL.PlayerData) do
        if val[44] then
            RPLL.PlayerData[cat][45] = time
        end
    end
end

function RPLL:CreateDummyPlayer(name)
    if not self.PlayerData[name] then
        self.PlayerData[name] = {}
        playertablelength = playertablelength + 1
        self.PlayerData[name][1] = playertablelength
    end
end

-- Completly wrong format etc
function RPLL:CreateOrUpdatePlayer(name, class, race, faction, rank)
    if not self.PlayerData[name] then
        playertablelength = playertablelength + 1
        self.PlayerData[name] = {}
        self.PlayerData[name][1] = playertablelength
        self.PlayerData[name][4] = strlower(class) -- loc. one?
        self.PlayerData[name][5] = strlower(race) -- loc. one?
        if faction == 0 then
            self.PlayerData[name][5] = self.PlayerData[name][5].."2"
        else
            self.PlayerData[name][5] = self.PlayerData[name][5].."1"
        end
        self.PlayerData[name][5] = self.PlayerData[name][5]..","..rank
    end
end

function RPLL:ConvertPlayerToString(name)
    if name then
        if self.PlayerData[name] and self.PlayerData[name][1] then
            if not RPLLPlayerData[1] then
                RPLLPlayerData[1] = {}
            end

            data = self.PlayerData[name]
            local pets
            if data[43] then
                for cat, _ in pairs(data[43]) do
                    if pets then
                        pets = pets..","..cat
                    else
                        pets = cat
                    end
                end
            end
            local result = (name or "}").."|";
            result = result..(data[2] or "}").."|"..(data[3] or "}")
            result = result..(data[4] or "}").."|"..(data[5] or "}").."|"..(data[6] or "}").."|"
            result = result..(data[7] or "}")..(data[8] or "}")..(data[9] or "}")..(data[10] or "}").."|"
            -- NOTE: TODO: Armor and pvp data now each have a "}" as placeholder if they werent collected!
            for i=1, 32 do -- Armor and Pvp data
                result = result..(data[10+i] or "}").."|"
            end
            result = result..(data[44] or "}").."|"..(data[45] or "}").."|"..(pets or "}").."|"..(data[46] or "}").."|"..(data[47] or "}")
            RPLLPlayerData[1][data[1]] = result;
        end
    end
end

local function retrieveValue(cur, next)
    if cur then
        if next then
            return next
        end
        return cur
    end
    if next then
        return next
    end
    return "}"
end

function RPLL:GrabPlayerData(unit, bool, bypass)
    local UName = UnitName(unit)
    if UName and UName~=Unknown and UnitIsPlayer(unit) then
        self:CreateDummyPlayer(UName)
        local guildName, guildRankName, guildRankIndex = GetGuildInfo(unit)
        local sessionHK, sessionDK, yesterdayHK, yesterdayHonor, thisweekHK, thisweekHonor, lastweekHK, lastweekHonor, lastweekStanding, lifetimeHK, lifetimeDK, lifetimeRank = GetInspectHonorData();
        local progress = GetInspectPVPRankProgress();
        local faction = UnitFactionGroup(unit)
        local _, rankNumber = GetPVPRankInfo(UnitPVPRank(unit), unit);
        local path = self.PlayerData[UName]
        path[2] = retrieveValue(path[2], UnitLevel(unit))
        path[3] = retrieveValue(path[3], UnitSex(unit))

        -- Guildrank index seems to be 0 sometimes
        -- This wont work if the guild master rank was renamed
        if (guildRankIndex == 0 and guildRankName ~= "Guild Master") then
            guildRankIndex = nil
            guildRankName = nil
        end

        path[4] = retrieveValue(path[4], guildName)
        path[5] = retrieveValue(path[5], guildRankIndex)
        path[6] = retrieveValue(path[6], guildRankName)
        path[7] = retrieveValue(path[7], UnitClass(unit))
        path[8] = retrieveValue(path[8], UnitRace(unit))
        path[9] = retrieveValue(path[9], UnitFactionGroup(unit))
        path[10] = retrieveValue(path[10], rankNumber)
        for i=1, 19 do
            for _, iLink in strgfind(GetInventoryItemLink(unit, i) or "", "|cff(.-)|Hitem:(.+)|h%[(.+)%]|h|r") do
                path[10+i] = retrieveValue(path[10+i], iLink)
            end
        end
        -- Checking if player was "found" to insert unknown values!
        local allUkn = true
        for i=1, 19 do
            if path[10+i] ~= "}" then
                allUkn = false
                break
            end
        end
        if not allUkn then
            if path[4] == "{" and path[5] == "}" and path[6] == "}" then
                path[4] = "!RPLL!EPTY!"
            end
        end

        if (lifetimeHK or 0)>0 and bool and not bypass then
            path[30] = retrieveValue(path[30], sessionHK)
            path[31] = retrieveValue(path[31], sessionDK)
            path[32] = retrieveValue(path[32], yesterdayHK)
            -- yesterdayDK not used!
            path[33] = retrieveValue(path[33], yesterdayHonor)
            path[34] = retrieveValue(path[34], thisweekHK)
            path[35] = retrieveValue(path[35], thisweekHonor)
            path[36] = retrieveValue(path[36], lastweekHK)
            path[37] = retrieveValue(path[37], lastweekHonor)
            path[38] = retrieveValue(path[38], lastweekStanding)
            path[39] = retrieveValue(path[39], lifetimeHK)
            path[40] = retrieveValue(path[40], lifetimeDK)
            path[41] = retrieveValue(path[41], lifetimeRank)
            path[42] = retrieveValue(path[42], progress)
        end
        local petName = "";
        if unit == "target" or unit == "player" or unit == "mouseover" then
            petName = UnitName(unit.."pet") or ""
        elseif (strfind(unit, "raid")) then
            petName = UnitName("raidpet"..strsub(unit, 5)) or ""
        elseif (strfind(unit, "party")) then
            petName = UnitName("partypet"..strsub(unit, 6)) or ""
        end
        if not path[43] then
            path[43] = {}
        end
        if petName and petName ~= "" and not path[43][petName] then
            path[43][petName] = true
        end
        if bypass and not bool then
            if not path[44] then
                path[44] = self:formatTimeAlpha()
            end
            path[45] = false
        end
        self:ConvertPlayerToString(UName)
    end
    -- Doing one recursive call because of GetInspectHonorData
    if unit=="target" and not bool and not bypass and UnitIsFriend("player", "target") then
		NotifyInspect(unit)
        GetInspectHonorData()
		RequestInspectHonorData()
        issueNextCheck = {UName, GetTime() + 1}
    end
end

function RPLL:UpdateUnitData()
    if issueNextCheck and GetTime()>issueNextCheck[2] then
        if UnitName("target") == issueNextCheck[1] then
            self:GrabPlayerData("target", true, false)
        end
        issueNextCheck = false
    end
end