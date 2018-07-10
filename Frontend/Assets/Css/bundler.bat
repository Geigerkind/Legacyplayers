for /r %%i in (*.scss) do call sass --sourcemap=none %%~pi%%~ni.scss %%~pi%%~ni.css
call cleancss -O2 -o main.min.css atemplate.css utility.css links.css classes.css input.css items.css tables.css tooltip.css
call cleancss -O2 -o Bundles/home.min.css main.min.css Pages/home.css
call cleancss -O2 -o Bundles/404.min.css main.min.css Pages/404.css
call cleancss -O2 -o Bundles/infotext.min.css main.min.css Pages/infotext.css
call cleancss -O2 -o Bundles/account.min.css main.min.css Pages/account.css
call cleancss -O2 -o Bundles/armory.min.css main.min.css Pages/armory.css
call cleancss -O2 -o Bundles/guild.min.css main.min.css Pages/guild.css Pages/raidsprites.css Pages/searchsprites.css
call cleancss -O2 -o Bundles/guildlist.min.css main.min.css Pages/guildlist.css Pages/raidsprites.css
call cleancss -O2 -o Bundles/item.min.css main.min.css Pages/item.css Pages/searchsprites.css Pages/search.css
call cleancss -O2 -o Bundles/itemhistory.min.css main.min.css Pages/itemhistory.css
call cleancss -O2 -o Bundles/armoryraids.min.css main.min.css Pages/armoryraids.css Pages/raidsprites.css
call cleancss -O2 -o Bundles/raidoverview.min.css main.min.css Pages/raidoverview.css Pages/raidsprites.css
call cleancss -O2 -o Bundles/arena.min.css main.min.css Pages/arena.css Pages/searchsprites.css
call cleancss -O2 -o Bundles/arenateam.min.css main.min.css Pages/arenateam.css Pages/searchsprites.css
call cleancss -O2 -o Bundles/standings.min.css main.min.css Pages/standings.css Pages/searchsprites.css
call cleancss -O2 -o Bundles/queue.min.css main.min.css Pages/queue.css Pages/raidsprites.css
call cleancss -O2 -o Bundles/bosses.min.css main.min.css Pages/bosses.css Pages/raidsprites.css
call cleancss -O2 -o Bundles/loot.min.css main.min.css Pages/loot.css
call cleancss -O2 -o Bundles/lootitem.min.css main.min.css Pages/lootitem.css Pages/raidsprites.css Pages/searchsprites.css
call cleancss -O2 -o Bundles/ranking.min.css main.min.css Pages/ranking.css
call cleancss -O2 -o Bundles/bossranking.min.css main.min.css Pages/ranking.css Pages/bossranking.css
call cleancss -O2 -o Bundles/search.min.css main.min.css Pages/search.css Pages/searchsprites.css
call cleancss -O2 -o Bundles/changelog.min.css main.min.css Pages/changelog.css
call cleancss -O2 -o Bundles/designer.min.css main.min.css Pages/designer.css
call cleancss -O2 -o Bundles/rankpoints.min.css main.min.css Pages/rankpoints.css
call cleancss -O2 -o Bundles/talentcalc.min.css main.min.css Pages/talentcalc.css
