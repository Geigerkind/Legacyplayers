DELETE FROM gn_guilds;
DELETE FROM gn_chars;

INSERT INTO gn_chars (id, serverid, faction, name, latestupdate) VALUES
(300000, 1, 0, "Unknown", 0),
(300001, 2, 0, "Unknown", 0),
(300002, 3, 0, "Unknown", 0),
(300003, 4, 0, "Unknown", 0),
(300004, 5, 0, "Unknown", 0),
(300005, 6, 0, "Unknown", 0),
(300006, 7, 0, "Unknown", 0),
(300007, 8, 0, "Unknown", 0),
(300008, 9, 0, "Unknown", 0),
(300009, 10, 0, "Unknown", 0),
(300010, 11, 0, "Unknown", 0),
(300011, 12, 0, "Unknown", 0),
(300012, 13, 0, "Unknown", 0),
(300013, 14, 0, "Unknown", 0),
(300014, 15, 0, "Unknown", 0),
(300015, 16, 0, "Unknown", 0),
(300016, 17, 0, "Unknown", 0),
(300017, 18, 0, "Unknown", 0),
(300018, 19, 0, "Unknown", 0),
(300019, 20, 0, "Unknown", 0),
(300020, 21, 0, "Unknown", 0),
(300021, 22, 0, "Unknown", 0),
(300022, 23, 0, "Unknown", 0);

-- Reserving first 1000 for comming servers!
ALTER TABLE gn_chars AUTO_INCREMENT = 301000;
ALTER TABLE gn_guilds AUTO_INCREMENT = 1;