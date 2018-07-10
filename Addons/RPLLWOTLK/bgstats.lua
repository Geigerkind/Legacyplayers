local RPLL = RPLL

local translations = RPLL.LOCAL[2]
local battlefieldzones = RPLL.LOCAL[3]

local GetBattlefieldWinner = GetBattlefieldWinner
local GetNumWorldStateUI = GetNumWorldStateUI
local GetWorldStateUIInfo = GetWorldStateUIInfo
local GetNumBattlefieldScores = GetNumBattlefieldScores
local GetBattlefieldScore = GetBattlefieldScore
local GetBattlefieldStatData = GetBattlefieldStatData
local RequestBattlefieldScoreData = RequestBattlefieldScoreData
local pairs = pairs
local strlower = strlower
local tinsert = table.insert
local GetZoneText = GetZoneText

local inBG = nil
local lastbgupdate = 0
local nextupdatetime = 0

RPLL.UPDATE_BATTLEFIELD_SCORE = function()
    --[[
    local bfwinner = GetBattlefieldWinner()
    if bfwinner then -- nil also means draw?
        if bfwinner == 0 then
            -- Horde wins!
        else
            -- Alliance wins!
        end
    else
        local worldState = {};
        local numUI = GetNumWorldStateUI();
        for i=1, numUI do
            local state, text, icon, dynamicIcon, tooltip, dynamicTooltip, extendedUI, extendedUIState1, extendedUIState2, extendedUIState3 = GetWorldStateUIInfo(i);
            if(state > 0) then
                if ( extendedUI ~= "" ) then
                    -- ??
                else
                    worldState[state] = text;
                end
            end
        end
        for faction, score in pairs(worldState) do
            if(faction == 1) then
                -- Score Alliance
            elseif(faction == 2) then
                -- Score Horde
            end
        end
    end

    local totalsResult = ""

    local name, killingBlows, honorableKills, deaths, honorGained, faction, rank, race, class
    local deltaKB, deltaHK, deltaDeaths, deltaHonor, deltaStat1, deltaStat2, deltaStat3, deltaStat4, zone
    for i=1, GetNumBattlefieldScores() do
        name, killingBlows, honorableKills, deaths, honorGained, faction, rank, race, class = GetBattlefieldScore(i);
        this:CreateOrUpdatePlayer(name, class, race, faction, rank)
        deltaKB = this:DeltaUnitDataChange(name, 1, killingBlows);
        deltaHK = this:DeltaUnitDataChange(name, 2, honorableKills);
        deltaDeaths = this:DeltaUnitDataChange(name, 3, deaths);
        deltaHonor = this:DeltaUnitDataChange(name, 4, honorGained);
        
        deltaStat1 = "";
        deltaStat2 = "";
        deltaStat3 = "";
        deltaStat4 = "";

        -- Unfinished I guess
        zone = translations[8]; 
        if(zone == translations[8]) then
            local flagCaptures = GetBattlefieldStatData(i, 1);
            local flagReturns = GetBattlefieldStatData(i, 2);

            deltaStat1 = this:DeltaUnitDataChange(name, 5, flagCaptures);
            deltaStat2 = this:DeltaUnitDataChange(name, 6, flagReturns);
        elseif(zone == translations[9]) then
            local basesAssaulted = GetBattlefieldStatData(i, 1);
            local basesDefended = GetBattlefieldStatData(i, 2);

            deltaStat1 = this:DeltaUnitDataChange(name, 5, basesAssaulted);
            deltaStat2 = this:DeltaUnitDataChange(name, 6, basesDefended);
        elseif(zone == translations[10]) then
            local gyAssaulted = GetBattlefieldStatData(i, 1);
            local gyDefended = GetBattlefieldStatData(i, 2);
            local towerAssaulted = GetBattlefieldStatData(i, 3);
            local towerDefended = GetBattlefieldStatData(i, 4);
            local minesCaptured = GetBattlefieldStatData(i, 5); --"always" 0
            local leadersKilled = GetBattlefieldStatData(i, 6); --"always" 0
            local secondaryObjectives = GetBattlefieldStatData(i, 7); --"always" 0

            deltaStat1 = this:DeltaUnitDataChange(name, 5, gyAssaulted);
            deltaStat2 = this:DeltaUnitDataChange(name, 6, gyDefended);
            deltaStat3 = this:DeltaUnitDataChange(name, 7, towerAssaulted);
            deltaStat4 = this:DeltaUnitDataChange(name, 8, towerDefended);
        end
        -- TODO: Nil error
        --if(deltaKB ~= "" or deltaHK ~= "" or deltaDeaths ~= "" or deltaHonor ~= "" or deltaStat1 ~= "" or deltaStat2 ~= "" or deltaStat3 ~= "" or deltaStat4 ~= "") then
        --    totalsResult = totalsResult..RPLLPlayerData[name][1].." "..killingBlows.." "..honorableKills.." "..deaths.." "..honorGained.." "..deltaStat1.." "..deltaStat2.." "..deltaStat3.." "..deltaStat4..",";
        --end
    end
    if(totalsResult ~= "") then
        tinsert(this.Session, "P"..this:formatTimeAlpha().."}"..totalsResult);
    end
    --]]
end
RPLL.CHAT_MSG_BG_SYSTEM_ALLIANCE = function(msg)
    tinsert(this.Session, "Q"..this:formatTimeAlpha().."}"..(msg or "SYSTEM_ALLIANCE"))
end
RPLL.CHAT_MSG_BG_SYSTEM_HORDE = function(msg)
    tinsert(this.Session, "Q"..this:formatTimeAlpha().."}"..(msg or "SYSTEM_HORDE"))
end
RPLL.CHAT_MSG_BG_SYSTEM_NEUTRAL = function(msg)
    tinsert(this.Session, "Q"..this:formatTimeAlpha().."}"..(msg or "SYSTEM_NEUTRAL"))
end

-- PvP Statistics
-- Ported from VF_BGStats addon
RPLL:RegisterEvent("UPDATE_BATTLEFIELD_SCORE")
RPLL:RegisterEvent("CHAT_MSG_BG_SYSTEM_ALLIANCE")
RPLL:RegisterEvent("CHAT_MSG_BG_SYSTEM_HORDE")
RPLL:RegisterEvent("CHAT_MSG_BG_SYSTEM_NEUTRAL")

-- Unsused time component
function RPLL:DeltaUnitDataChange(name, _DataIndex, _Value)
    if not self.PlayerData[name]["bgstat".._DataIndex] then
        self.PlayerData[name]["bgstat".._DataIndex] = _Value
        if(_Value == 0) then
            return "";
        end
        return _Value;
    end
    local deltaValue = _Value - self.PlayerData[name]["bgstat".._DataIndex];
    if deltaValue ~= 0 then
        self.PlayerData[name]["bgstat".._DataIndex] = _Value
    end
    if deltaValue == 0 then
        return "";
    end
    return deltaValue;
end

function RPLL:BGOnUpdate(elapsed)
    if lastbgupdate>2 then
        local zone = GetZoneText()
        if inBG and inBG ~= zone then
            tinsert(self.Session, "R"..self:formatTimeAlpha().."}"..battlefieldzones[inBG])
            inBG = nil
        end 
        if battlefieldzones[zone] then
            if inBG ~= zone then
                inBG = zone
                tinsert(self.Session, "S"..self:formatTimeAlpha().."}"..battlefieldzones[inBG])
            end
            if nextupdatetime>5 then
                RequestBattlefieldScoreData()
                nextupdatetime = 0
            end
        end
        lastbgupdate = 0
    end
    nextupdatetime = nextupdatetime + elapsed
    lastbgupdate = lastbgupdate + elapsed
end