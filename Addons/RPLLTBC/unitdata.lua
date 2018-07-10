local RPLL = RPLL

local UnitIsPlayer = UnitIsPlayer
local pairs = pairs
local GetNumPartyMembers = GetNumPartyMembers
local GetNumRaidMembers = GetNumRaidMembers
local UnitName = UnitName
local UnitLevel = UnitLevel
local UnitSex = UnitSex
local GetTime = GetTime
local strlower = strlower
local GetInspectHonorData = GetInspectHonorData
local GetGuildInfo = GetGuildInfo
local GetInventoryItemLink = GetInventoryItemLink
local GetPVPRankInfo = GetPVPRankInfo
local UnitPVPRank = UnitPVPRank
local strsub = string.sub
local strfind = string.find
local UnitGUID = UnitGUID
local GetArenaTeam = GetArenaTeam

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

local lastRaidUpdate = 0
RPLL.RAID_ROSTER_UPDATE = function()
    if (lastRaidUpdate + 360 > GetTime()) then
        return
    end
    local time = this:formatTimeAlpha()
    for cat, val in pairs(this.PlayerData) do
        if val[52] then
            this.PlayerData[cat][53] = time
        end
    end
    this.TargetParty[UnitName("player")] = "player";
    for i=1, GetNumRaidMembers() do
        if UnitName("raid"..i) then
            this.TargetParty[UnitName("raid"..i)] = "raid"..i
            this:GrabPlayerData("raid"..i, false, true)
        end
    end
    lastRaidUpdate = GetTime()
end
local lastGroupUpdate = 0
RPLL.PARTY_MEMBERS_CHANGED = function()
    if (lastGroupUpdate + 360 > GetTime()) then
        return
    end
    local time = this:formatTimeAlpha()
    for cat, val in pairs(this.PlayerData) do
        if val[52] then
            this.PlayerData[cat][53] = time
        end
    end
    this.TargetParty[UnitName("player")] = "player";
    for i=1, GetNumPartyMembers() do
        if UnitName("party"..i) then
            this.TargetParty[UnitName("party"..i)] = "party"..i
            this:GrabPlayerData("party"..i, false, true)
        end
    end
    lastGroupUpdate = GetTime()
end

local oldLeaveParty = LeaveParty
LeaveParty = function()
    oldLeaveParty();
    local time = RPLL:formatTimeAlpha()
    for cat, val in pairs(RPLL.PlayerData) do
        if val[52] then
            RPLL.PlayerData[cat][53] = time
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
        if self.PlayerData[name] then
            data = self.PlayerData[name]
            local pets
            if data[51] and data[51] ~= 0 then
                for cat, _ in pairs(data[51]) do
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
            for i=1, 40 do -- Armor and Pvp data
                result = result..(data[10+i] or "}").."|"
            end
            result = result..(data[52] or "}").."|"..(data[53] or "}").."|"..(data[54] or "}").."|"..(pets or "}").."|"..(data[55] or "}").."|"..(data[56] or "}")
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

local GetNumTalentTabs = GetNumTalentTabs
local GetNumTalents = GetNumTalents
local GetTalentInfo = GetTalentInfo
function RPLL:GrabPlayerData(unit, bool, bypass)
    local UName = UnitName(unit)
    if UName and UName~=Unknown and UnitIsPlayer(unit) then
        self:CreateDummyPlayer(UName)
        local guildName, guildRankName, guildRankIndex = GetGuildInfo(unit)
        local todayHK, todayHonor, yesterdayHK, yesterdayHonor, lifetimeHK, lifetimeDK = GetInspectHonorData();
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
            for _, iLink in string.gmatch(GetInventoryItemLink(unit, i) or "", "|cff(.-)|Hitem:(.+)|h%[(.+)%]|h|r") do
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
            path[30] = retrieveValue(path[30], todayHK)
            path[31] = retrieveValue(path[31], todayHonor)
            path[32] = retrieveValue(path[32], yesterdayHK)
            path[33] = retrieveValue(path[33], yesterdayHonor)
            path[34] = retrieveValue(path[34], lifetimeHK)
            path[35] = retrieveValue(path[35], lifetimeDK)
            for i=1, 3 do
                local teamName, teamSize, teamRating, seasonPlayed, seasonWins = nil, nil, nil, nil, nil;
                if unit == "player" then
                    teamName, teamSize, teamRating, _, _, seasonPlayed, seasonWins = GetArenaTeam(i);
                else
                    teamName, teamSize, teamRating, seasonPlayed, seasonWins = GetInspectArenaTeamData(i);
                end
                -- ^ Potential to get the emblem!
                path[36 + (i-1)*5] = retrieveValue(path[36 + (i-1)*5], teamName)
                path[37 + (i-1)*5] = retrieveValue(path[37 + (i-1)*5], teamSize)
                path[38 + (i-1)*5] = retrieveValue(path[38 + (i-1)*5], teamRating)
                path[39 + (i-1)*5] = retrieveValue(path[39 + (i-1)*5], seasonPlayed)
                path[40 + (i-1)*5] = retrieveValue(path[40 + (i-1)*5], seasonWins)
            end
        end
        local petName = "";
        if unit == "target" or unit == "player" or unit == "mouseover" then
            if UnitGUID(unit.."pet") then 
                petName = UnitGUID(unit.."pet")
            end
        elseif (strfind(unit, "raid")) then
            if UnitGUID("raidpet"..strsub(unit, 5)) then
                petName = UnitGUID("raidpet"..strsub(unit, 5))
            end
        elseif (strfind(unit, "party")) then
            if UnitGUID("partypet"..strsub(unit, 6)) then
                petName = UnitGUID("partypet"..strsub(unit, 6))
            end
        end
        if not path[51] or path[51] == 0 then
            path[51] = {}
        end
        if petName and petName ~= 0 and petName ~= "" and not path[51][petName] then
            path[51][petName] = true
        end
        if bypass and not bool then
            if not path[52] then
                path[52] = self:formatTimeAlpha()
            end
            path[53] = false
        end
        if bool then
            local numTabs = GetNumTalentTabs();
            local talents = "";
            for t=1, numTabs do
                local numTalents = GetNumTalents(t, unit ~= "player");
                -- Last one is missing?
                for i=1, numTalents do
                    local _, _, _, _, currRank = GetTalentInfo(t,i, unit ~= "player");
                    talents = talents..currRank
                end
                talents = talents.."}"
            end
            if strlen(talents) > 10 then
                path[54] = talents;
            else
                path[54] = "}"
            end
        end
        self:ConvertPlayerToString(UName)
    end
    -- Doing one recursive call because of GetInspectHonorData
    if not bool and UnitIsFriend("player", unit) then
		NotifyInspect(unit)
        GetInspectHonorData()
		RequestInspectHonorData()
		for i=1,3 do
			GetInspectArenaTeamData(i)
		end
        issueNextCheck = {UName, GetTime() + 1, unit}
    end
end

function RPLL:UpdateUnitData()
    if issueNextCheck and GetTime()>issueNextCheck[2] then
        if UnitName(issueNextCheck[3]) == issueNextCheck[1] then
            self:GrabPlayerData(issueNextCheck[3], true, false)
        end
        issueNextCheck = false
    end
end