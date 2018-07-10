
-- Very likely that these are not all bosses!
local bN = {
    [15550] = true,
    [15687] = true,
    [15688] = true,
    [15689] = true,
    [15690] = true,
    [15691] = true,
    [16151] = true,
    [16457] = true,
    [16524] = true,
    [17225] = true,
    [17257] = true,
    [17521] = true,
    [17533] = true,
    [17534] = true,
    [17535] = true,
    [17711] = true,
    [17767] = true,
    [17808] = true,
    [17842] = true,
    [17888] = true,
    [17968] = true,
    [18168] = true,
    [18728] = true,
    [18805] = true,
    [18831] = true,
    [18832] = true,
    [18834] = true,
    [18835] = true,
    [19044] = true,
    [19514] = true,
    [19516] = true,
    [19622] = true,
    [20060] = true,
    [20062] = true,
    [20063] = true,
    [20064] = true,
    [21212] = true,
    [21213] = true,
    [21214] = true,
    [21215] = true,
    [21216] = true,
    [21217] = true,
    [21875] = true,
    [22841] = true,
    [22887] = true,
    [22898] = true,
    [22917] = true,
    [22947] = true,
    [22948] = true,
    [22949] = true,
    [22950] = true,
    [22951] = true,
    [22952] = true,
    [23418] = true,
    [23419] = true,
    [23420] = true,
    [23574] = true,
    [23576] = true,
    [23577] = true,
    [23578] = true,
    [23863] = true,
    [24143] = true,
    [24239] = true,
    [24882] = true,
    [24892] = true,
    [25038] = true,
    [25165] = true,
    [25166] = true,
    [25315] = true,
    [25741] = true,
    [25960] = true,

    -- Test npc
    --[21854] = true,

    -- Group Boss Npcs
    -- Magtheridon's Lair
    [17257] = true,
    [17256] = true,
    [17454] = true,

    -- Black temple
    -- High Warlord Najentus
    [22887] = true,
    [22878] = true,
    -- Akama
    [22841] = true,
    [23216] = true,
    [23523] = true,
    [23318] = true,
    [23524] = true,
    [23421] = true,
    [23215] = true,
    -- Reliquary of Souls
    [23418] = true,
    [23419] = true,
    [23420] = true,
    [23469] = true,
    -- Illidary Council
    [22951] = true,
    [22950] = true,
    [22949] = true,
    [22952] = true,
    -- Illidan
    [22917] = true,
    [22997] = true,
    [23498] = true,
    -- Teron
    [21867] = true,
    [22871] = true,

    -- SSC
    -- Hydross the unstable
    [21216] = true,
    [22035] = true,
    [22036] = true,
    -- Lurker below
    [21217] = true,
    [21873] = true,
    [21856] = true,
    -- Leotheras the Blind
    [21215] = true,
    [21875] = true,
    [21857] = true,
    -- Fathom-Lord Karathress
    [21214] = true,
    [21964] = true,
    [21965] = true,
    [21966] = true,
    -- Lady Vashj
    [21212] = true,
    [22055] = true,
    [22056] = true,
    [22009] = true,
    [21958] = true,
    [22140] = true,
    -- Kara
    -- Attumen
    [15550] = true,
    [16151] = true,
    [16152] = true,
    -- Moroes
    [15687] = true,
    [19875] = true,
    [19872] = true,
    [17007] = true,
    [19874] = true,
    [19876] = true,
    [19873] = true,
    -- Opera Event
    [17521] = true,
    [17535] = true,
    [17548] = true,
    [17543] = true,
    [17546] = true,
    [18168] = true,
    [17533] = true,
    [17534] = true,
    [17547] = true,

    -- Gruul
    -- High King Maulgar
    [18831] = true,
    [18832] = true,
    [18834] = true,
    [18835] = true,
    [18836] = true,
    [18847] = true,

    -- Zul Aman
    -- Jan'alai
    [23578] = true,
    --[23918] = true,
    [23598] = true,
    --[23834] = true,
    --[25867] = true,

    -- Halazzi
    [23577] = true,
    [24143] = true,

    -- Hex Lord Malacrass
    [24239] = true,
    [24241] = true,
    [24240] = true,
    [24243] = true,
    [24242] = true,
    [24244] = true,
    [24245] = true,
    [24246] = true,
    [24247] = true,

    -- Tempest Keep
    -- Al'ar
    [19514] = true,
    [19551] = true,
    -- High Astromancer Solarian
    [18805] = true,
    [18806] = true,
    [18925] = true,
    -- Kael'thas Sunstrider
    [19622] = true,
    [20064] = true,
    [20060] = true,
    [20062] = true,
    [20063] = true,
    [21362] = true,
    [21364] = true,
    [21268] = true,
    [21274] = true,
    [21270] = true,
    [21271] = true,
    [21272] = true,
    [21269] = true,
    [21273] = true,

    -- Sunwell
    -- Kalecgos
    [24844] = true,
    [24892] = true,
    [24850] = true,
    [25319] = true,
    -- Eredar Twins
    [25165] = true,
    [25166] = true,
    -- Mu'ru
    [25741] = true,
    [25960] = true,
    -- Kil'jeaden
    [25315] = true,
    [25608] = true,
    

}
-- Theoretically not used anymore!
local translations = {
    "Counterspell",
    "Silence",
    "Poison Cleansing Totem",
    "Restoration",
    "Restorative Potion",
    "Purification",
    "Purification Potion",
    "Warsong Gulch",
    "Arathi Basin",
    "Alterac Valley"
}
local battlefieldzones = {
    ["Alterac Valley"] = 3,
	["Arathi Basin"] = 2,
    ["Warsong Gulch"] = 1,
}

local cbtevents = {
    LOOT_ITEM, -- "%s receives loot: %s."
    LOOT_ITEM_MULTIPLE, -- "%s receives loot: %sx%d."
    LOOT_ITEM_SELF, -- "You receive loot: %s."
    LOOT_ITEM_SELF_MULTIPLE, -- "You receive loot: %sx%d."
    AURAADDEDOTHERHARMFUL,
    SPELLCASTOTHERSTART,
    SPELLPERFORMOTHERSTART,
    SPELLLOGCRITSCHOOLOTHEROTHER,
    SPELLLOGCRITOTHEROTHER,
    SPELLLOGSCHOOLOTHEROTHER,
    SPELLLOGOTHEROTHER,
    SPELLLOGCRITSCHOOLOTHERSELF,
    SPELLLOGCRITOTHERSELF,
    SPELLLOGSCHOOLOTHERSELF,
    SPELLLOGOTHERSELF,
    SPELLINTERRUPTOTHEROTHER,
    SPELLINTERRUPTOTHERSELF,
    SPELLINTERRUPTSELFOTHER,
    SIMPLECASTSELFOTHER,
    SIMPLECASTSELFSELF,
    SIMPLECASTOTHEROTHER,
    SIMPLECASTOTHERSELF,
    AURADISPELOTHER,
    AURADISPELSELF,
    AURAADDEDSELFHELPFUL,
    AURAADDEDOTHERHELPFUL,
    AURAREMOVEDOTHER,
    AURAREMOVEDSELF,
    UNITDIESOTHER,
    COMBATHITSELFOTHER,
    COMBATHITSCHOOLSELFOTHER,
    COMBATHITCRITSELFOTHER,
    COMBATHITCRITSCHOOLSELFOTHER,
    COMBATHITCRITOTHEROTHER,
    COMBATHITCRITSCHOOLOTHEROTHER,
    COMBATHITOTHEROTHER,
    COMBATHITSCHOOLOTHEROTHER,
    HEALEDCRITOTHEROTHER, -- 38
    HEALEDOTHEROTHER,
    HEALEDCRITOTHERSELF,
    HEALEDOTHERSELF,
    HEALEDCRITSELFOTHER, -- 42
    HEALEDSELFOTHER,
    HEALEDCRITSELFSELF,
    HEALEDSELFSELF, -- 45
    PERIODICAURAHEALSELFOTHER,
    PERIODICAURAHEALSELFSELF,
    PERIODICAURAHEALOTHEROTHER,
    PERIODICAURAHEALOTHERSELF -- 49
}

for i=1, 49 do
    cbtevents[i] = string.gsub(cbtevents[i], "%(", "%%%(")
    cbtevents[i] = string.gsub(cbtevents[i], "%)", "%%%)")
    cbtevents[i] = string.gsub(cbtevents[i], "%%s", "%(%.+%)")
    cbtevents[i] = string.gsub(cbtevents[i], "%%d", "%(%%d+%)")
end

RPLL.LOCAL = {
    bN,
    translations,
    battlefieldzones,
    cbtevents
}

RPLL.Session = {}
RPLL.PlayerData = {}