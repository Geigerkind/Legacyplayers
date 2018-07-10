local RPLL = RPLL

local tonumber = tonumber
local strsub = string.sub
local strformat = string.format
local tinsert = table.insert

-- Let's track threat
-- Hooking KTM

RPLL:RegisterEvent("CHAT_MSG_ADDON")

local lastValue = {}
RPLL.MasterTarget = nil
local Unknown = UNKNOWN
RPLL.CHAT_MSG_ADDON = function(arg1, arg2, arg3, arg4) 
    if arg1 == "KLHTM" then
        if (arg2 == "cleartarget") then
            -- Master target cleared
            this.MasterTarget = nil
        elseif (arg2 == "clear") then
            -- Reset
        else
            local prefix = strsub(arg2, 0, 2)
            if (prefix == "ta") then
                -- Master target set: "target NAME"
                this.MasterTarget = strsub(arg2, 7)
            elseif (prefix == "t ") then
                local num = tonumber(strsub(arg2, 2))
                this:CreateDummyPlayer(arg4)
                local last = lastValue[this.PlayerData[arg4][1]] or 0
                local grad = num;
                if (last <= num) then
                    grad = num - last
                end

                -- Filtering for the Raid Target
                local target = this.MasterTarget
                if not target then
                    if UnitIsPlayer("target") then
                        local mem = GetNumPartyMembers()
                        local type = "party"
                        if (mem <= 0) then
                            mem = GetNumRaidMembers()
                            type = "raid"
                        end
                        for i=1,mem do
                            if not UnitIsPlayer(type..i.."target") then
                                local potTarget = UnitName(type..i.."target")
                                if potTarget and potTarget ~= Unknown then
                                    target = potTarget
                                    break
                                end
                            end
                        end
                    else
                        target = UnitName("target")
                    end
                end
                if not target then
                    target = "Unknown" -- We gotta think about sth :/
                end

                tinsert(this.Session, "Z"..this:formatTimeAlpha().."}"..this.PlayerData[arg4][1].."}"..this:RegisterNPC(target).."}"..grad)
                lastValue[this.PlayerData[arg4][1]] = num
            end
        end
    end
    this:CHAT_MSG_ADDON_LOOT(arg1, arg2, arg3, arg4)
    this:CHAT_MSG_ADDON_DEATH(arg1, arg2, arg3, arg4)
end