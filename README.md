# Legacyplayers

This repository contains the Backend and Frontend of the project https://legacyplayers.com  

## General ##  
Recently I had less and less time for the project, as university and other things keep using more of my time.  
In order to not let this project die, because I just couldn't give it as much love as it requires, I decided to make it open source!  
I will still provide the server infrastructure and host the service with all care. But I would love to see some active development to finally address a lot of tiny issues.
I will apply fixes in this repository regularily to the live server.

## Goal ##  
Providing Armory and Raid logs for all expansions and servers.  
Providing useful tools that make the everyday life easier.  
Providing all services for free.  

## Installing Instructions ##  
The project runs with ASP.NET (C#).  
The Backend is written in C++, requiring clang to compile it. The compiler can be changed in the Makefile though.
The Database build onto a MySQL 5.7 InnoDB environment. Its not tested for other versions.

Notes:  
I have removed most assets, because I have no licence to publish them.

Required libraries:
MySql.Data

1. Install the database and create ODBC links
2. Add uid and pwd parameters for the frontend in the DBHandler file
3. Configure your webserver (nginx etc.) to support mono, or use IIS
4. You may need to download a few packages, but Visual Studio should help you out with that. Again, I cant just upload them for you.

This should get you running.

