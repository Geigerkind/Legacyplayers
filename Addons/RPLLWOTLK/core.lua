local RPLL = RPLL
RPLL.VERSION = 201
RPLL.TargetParty = {}
RPLL:RegisterEvent("PLAYER_TARGET_CHANGED")
RPLL:RegisterEvent("VARIABLES_LOADED")
RPLL:RegisterEvent("RAID_ROSTER_UPDATE")
RPLL:RegisterEvent("PARTY_MEMBERS_CHANGED")
RPLL:RegisterEvent("PLAYER_LOGOUT")
RPLL:RegisterEvent("ZONE_CHANGED_NEW_AREA")
RPLL:RegisterEvent("UPDATE_INSTANCE_INFO")

RPLL:RegisterEvent("CHAT_MSG_LOOT")
RPLL:RegisterEvent("CHAT_MSG_MONSTER_YELL")
RPLL:RegisterEvent("CHAT_MSG_MONSTER_SAY")
RPLL:RegisterEvent("CHAT_MSG_MONSTER_EMOTE")

RPLL:RegisterEvent("UPDATE_MOUSEOVER_UNIT")
RPLL:RegisterEvent("PLAYER_ENTERING_WORLD")

RPLL:RegisterEvent("UNIT_PET")
RPLL:RegisterEvent("PLAYER_PET_CHANGED")
RPLL:RegisterEvent("PET_STABLE_CLOSED")

local cbtevents = RPLL.LOCAL[4]

local tinsert = table.insert
local strformat = string.format
local GetTime = GetTime
local UnitName = UnitName
local strsub = string.sub
local GetZoneText = GetZoneText
local GetRealZoneText = GetRealZoneText
local GetNumSavedInstances = GetNumSavedInstances
local GetSavedInstanceInfo = GetSavedInstanceInfo
local IsInInstance = IsInInstance
local UnitName = UnitName
local pairs = pairs
local GetNumPartyMembers = GetNumPartyMembers
local GetNumRaidMembers = GetNumRaidMembers
local UnitHealth = UnitHealth

local function TimeString()
    local hours, minutes = GetGameTime()
    return hours..":"..minutes..","..date("%m-%d %H:%M:%S")
end

local majorupdate = 0
local genupdate = 0
local hasSWFixLogStrings = false

local npcTable, yellTable, abilityTable = {}, {}, {}
local npccount, yellcount, abilitycount = 0, 0, 0
function RPLL:RegisterNPC(key)
    if key then
        if not npcTable[key] then
            npccount = npccount + 1
            npcTable[key] = npccount
            tinsert(self.Session, "F"..key)
        end
        return npcTable[key]
    end
    return 0
end
function RPLL:RegisterSpeech(key)
    if key then
        if not yellTable[key] then
            yellcount = yellcount + 1
            yellTable[key] = yellcount
            tinsert(self.Session, "T"..key)
        end
        return yellTable[key]
    end
    return 0
end
function RPLL:RegisterAbility(key)
    if not abilityTable[key] then
        abilitycount = abilitycount + 1
        abilityTable[key] = abilitycount
        tinsert(self.Session, "I"..key)
    end
    return abilityTable[key]
end

local StartTime = GetTime()
function RPLL:formatTimeAlpha()
    return strformat("%.3f", GetTime()-StartTime)
end

function RPLL:GetNPCID(guid)
	return tonumber(guid:sub(-10, -7), 16)
end

RPLL.UNIT_PET = function(unit)
    if unit then
        this:GrabPlayerData(unit, false, false)
    end
end

RPLL.PLAYER_PET_CHANGED = function()
    this:GrabPlayerData("player", false, false)
end

RPLL.PET_STABLE_CLOSED = function()
    this:GrabPlayerData("player", false, false)
end

RPLL.VARIABLES_LOADED = function()
    Player = UnitName("player")

    if not RPLLSession then
        RPLLSession = {}
    end
    if not RPLLPlayerData then
        RPLLPlayerData = {}
    end
    tinsert(RPLLSession, 1, "")
    tinsert(RPLLPlayerData, 1, {})
    -- Timestring is -1:-1 for some reason
    tinsert(this.Session, "A"..this:formatTimeAlpha().."}"..TimeString().."}"..GetRealmName().."}"..GetLocale().."}"..this.VERSION)
    this:GrabPlayerData("player", false, false)
    RPLLSession[1] = this.Session[1].."&"

    -- Clearing old data
    local cday, cmonth
    for a,b in string.gmatch(date("!%d-%m"), "(%d+)-(%d+)") do
        cday, cmonth = tonumber(a),tonumber(b)
    end
    local function compareToCurrentDate(str)
        for _, month, day in string.gmatch(","..str, "(.*[^0-9])(%d+)-(%d+)([^0-9].*)") do
            day, month = tonumber(day), tonumber(month)
            if month>cmonth then
                return ((30-day)+cday)>2
            else
                return (cday-day)>2
            end
        end
    end
    for cat, val in pairs(RPLLSession) do
        if compareToCurrentDate(strsub(val, 1, 100)) then
            RPLLSession[cat] = nil
            --RPLLPlayerData[cat] = nil
            RPLLPlayerData[cat] = nil
        end
    end

    SLASH_rpll1 = "/rpll"
    SLASH_rpll2 = "/RPLL"
    SlashCmdList["rpll"] = function(msg)
        if msg == "nuke" then
            RPLLSession = {}
            RPLLPlayerData = {}
            RPLL.Session = {}
            npcTable, yellTable, abilityTable = {}, {}, {}
            npccount, yellcount, abilitycount = 0, 0, 0
            RPLL:ResetCacheCounter()
            tinsert(RPLLSession, 1, "")
            tinsert(RPLLPlayerData, 1, {})
            tinsert(RPLL.Session, "A"..RPLL:formatTimeAlpha().."}"..TimeString().."}"..GetRealmName().."}"..GetLocale().."}"..RPLL.VERSION)
            RPLL:GrabPlayerData("player", false, false)
            RPLLSession[1] = RPLL.Session[1].."&"
            DEFAULT_CHAT_FRAME:AddMessage("Log nuked");
        else
            DEFAULT_CHAT_FRAME:AddMessage("RPLL: To nuke a log type: /rpll nuke!");
        end
    end

    LoggingCombat(true)
    this.loaded = true
    DEFAULT_CHAT_FRAME:AddMessage("RPLLCollector v."..this.VERSION.." has been loaded!")
end

RPLL.PLAYER_ENTERING_WORLD = function()
    if this.loaded then
        this.RAID_ROSTER_UPDATE()
        this.PARTY_MEMBERS_CHANGED()
        this:GrabPlayerData("player", false, false)
    end
end

local hackFix = true
local initTimer = 0
RPLL.PLAYER_LOGOUT = function()
    if hackFix then
        this.Session[1] = "A"..this:formatTimeAlpha().."}"..TimeString().."}"..GetRealmName().."}"..GetLocale().."}"..this.VERSION;
    end
    this:DumpSessions()
end

local initSecond = nil;
function RPLL:GetFirstEvent()
    if not initSecond then
        initSecond = date("%S");
    end
    if date("%S") ~= initSecond then
        local TS = TimeString()
        self.Session[1] = "A"..self:formatTimeAlpha().."}"..TS.."}"..GetRealmName().."}"..GetLocale().."}"..this.VERSION;
        hackFix = false
    end
end

local tconcat = table.concat
local RPLL_key = "&"
function RPLL:DumpSessions()
    if not hasSWFixLogStrings then
        RPLLSession[1] = (RPLLSession[1] or "")..tconcat(self.Session, RPLL_key).."&"
        self.Session = {} -- Nuke sessions to prevent lag!
    else
        RPLLSession[1] = self.Session[1].."&"
    end
end

function RPLL:DeepSubString(str1, str2)
    str1 = strlower(str1)
    str2 = strlower(str2)
    if (strfind(str1, str2) or strfind(str2, str1)) then
        return true;
    end
    for cat, val in pairs({strsplit(" ", str1)}) do
        if val ~= "the" then
            if (strfind(val, str2) or strfind(str2, val)) then
                return true;
            end
        end
    end
    return false;
end

function RPLL:GetInstanceId()
    local zone, zone2, id, nombre, numero = GetRealZoneText(), GetZoneText(), "?"
    for i=1, GetNumSavedInstances() do
        nombre, numero = GetSavedInstanceInfo(i)
        if zone == nombre or zone2 == nombre or self:DeepSubString(zone, nombre) or self:DeepSubString(zone2, nombre) or self:DeepSubString(nombre, zone) or self:DeepSubString(nombre, zone2) then
            id = numero
            break
        end
    end
    return id
end

local oldResetInstances = ResetInstances
function ResetInstances()
    tinsert(RPLL.Session, "U"..RPLL:formatTimeAlpha())
    oldResetInstances()
end

local function strsplit(pString, pPattern)
	local Table = {}
	local fpat = "(.-)" .. pPattern
	local last_end = 1
	local s, e, cap = strfind(pString, fpat, 1)
	while s do
		if s ~= 1 or cap ~= "" then
			table.insert(Table,cap)
		end
		last_end = e+1
		s, e, cap = strfind(pString, fpat, last_end)
	end
	if last_end <= strlen(pString) then
		cap = strfind(pString, last_end)
		table.insert(Table, cap)
	end
	return Table
end

-- Loot
local linkQuality = {
	["0070dd"] = true,
	["a335ee"] = true,
    ["ff8000"] = true,
}
local lootCollected = {}
RPLL.CHAT_MSG_LOOT = function(msg)
    if IsInInstance() then
        local function insertValues(who, itemstr)
            if who and itemstr then
                this:CreateDummyPlayer(who)
                for quallity,itemid in string.gmatch(itemstr, "|cff(.-)|Hitem:(%d+)(.+)%[(.+)%]|h|r") do
                    if linkQuality[quallity] then
                        if not lootCollected[who] then
                            lootCollected[who] = {}
                        end
                        if not lootCollected[who][itemid] then
                            lootCollected[who][itemid] = true -- Fuzzy collection of loot
                            tinsert(this.Session, "V"..this:formatTimeAlpha().."}"..this.PlayerData[who][1].."}"..itemid)
                            SendAddonMessage("RPLL_LOOT", who.."}"..itemid.."}", "RAID")
                        end
                        return
                    end
                end
            end
        end
        -- Other
        local who, itemstr
        for i=1, 2 do
            for who, itemstr in string.gmatch(msg, cbtevents[i]) do
                insertValues(who, itemstr)
            end
        end
        -- Self
        for i=3, 4 do
            for itemstr in string.gmatch(msg, cbtevents[i]) do
                insertValues(Player, itemstr)
            end
        end
    end
end

function RPLL:CHAT_MSG_ADDON_LOOT(arg1, arg2, arg3, arg4)
    if arg1 == "RPLL_LOOT" and arg4 ~= UnitName("player") and arg2 then
        local result = strsplit(arg2, "}")
        if not lootCollected[result[1]] then
            lootCollected[result[1]] = {}
        end
        if not lootCollected[result[1]][result[2]] then
            lootCollected[result[1]][result[2]] = true
            self:CreateDummyPlayer(result[1])
            tinsert(self.Session, "V"..self:formatTimeAlpha().."}"..self.PlayerData[result[1]][1].."}"..result[2])
        end
    end
end

-- Speech
function RPLL:Monster_Speech(arg1,arg2,prefix)    
    tinsert(self.Session, "W"..prefix.."}"..self:formatTimeAlpha().."}"..self:RegisterNPC(arg2).."}"..self:RegisterSpeech(arg1))
    self:StartBossAttempt(arg2)
end

RPLL.CHAT_MSG_MONSTER_YELL = function(arg1, arg2)
    this:Monster_Speech(arg1,arg2,"1") -- Yell
end

RPLL.CHAT_MSG_MONSTER_SAY = function(arg1, arg2)
    this:Monster_Speech(arg1,arg2,"2") -- SAY
end

RPLL.CHAT_MSG_MONSTER_EMOTE = function(arg1, arg2)
    this:Monster_Speech(arg1,arg2,"3") -- EMOTE
end

-- Zone changed
RPLL.ZONE_CHANGED_NEW_AREA = function()
    local _, _, _, diffName= GetInstanceInfo();
    tinsert(this.Session, "B"..this:formatTimeAlpha().."}"..GetRealZoneText().."}"..this:GetInstanceId().."}"..(diffName or "?"))
end

RPLL.UPDATE_INSTANCE_INFO = function()
    this:ZONE_CHANGED_NEW_AREA()
end

local dumpTimer = 0
local hackNotification = false;
function RPLL:OnUpdate(elapsed)
    if hackFix then
        initTimer = initTimer + elapsed
        if initTimer > 3 then
            self:GetFirstEvent()
            self:ParseProfession()
        end
    end
    if genupdate>0.5 then
        dumpTimer = dumpTimer + genupdate
        if dumpTimer>15 then
            self:DumpSessions()
            dumpTimer = 0
        end
        self:UpdateUnitData()
        genupdate = 0

        CombatLogClearEntries()
    end
    self:CheckBossHealth(elapsed)
    self:UpdateAttempts(elapsed)
    --self:BGOnUpdate(elapsed)
    genupdate = genupdate + elapsed
end

RPLL.UPDATE_MOUSEOVER_UNIT = function()
    this:GrabPlayerData("mouseover", false, false)
end

local professions = {
    ["Smelting"] = 1,
    ["Skinning"] = 2,
    ["Find Herbs"] = 3,
    ["Blacksmithing"] = 4,
    ["Alchemy"] = 5,
    ["Enchanting"] = 6,
    ["Engineering"] = 7,
    ["Leatherworking"] = 8,
    ["Tailoring"] = 9,
    ["Juwelcrafting"] = 10,
}

function RPLL:ParseProfession()
    local player = self.PlayerData[UnitName("player")]
    local found = 0
    for i=1, 100 do
        local name = GetSpellName(i, "spell")
        if not name then break end
        if professions[name] and professions[name] > 0 and found < 2 then
            player[55+found] = professions[name]
            found = found + 1
        end
    end
end