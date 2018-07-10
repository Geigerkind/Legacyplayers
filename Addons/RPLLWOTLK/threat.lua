local RPLL = RPLL

local tonumber = tonumber
local strsub = string.sub
local strformat = string.format

--[[
-- Turns out: Its easier to calculate it manually.

local threat = LibStub("Threat-2.0"); 

for cat, val in pairs(threat.threatTargets) do DEFAULT_CHAT_FRAME:AddMessage(cat); for ca, va in pairs(val) do DEFAULT_CHAT_FRAME:AddMessage(ca.."/"..va); end; end
--]]