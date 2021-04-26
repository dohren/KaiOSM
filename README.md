# KaiOSM

This is a KaiOS App for [OpenStreetMap ](https://www.openstreetmap.org). You can record and add tracks to your phone. 

## Tools you will need

In order to build it and upload it on your phone you need

- Android SDK
- Nodejs
- KaiOS Phone
- Pale Moon with WebIDE

## Getting started

All Infos at [Bananahackers](https://sites.google.com/view/bananahackers/home)

1. Download [NodeJs](https://nodejs.org/en/download/)
2. npm install --global yarn
3. npm i
4. yarn build (yarn serve for lacal test)
5. Download [Android SDK](https://developer.android.com/studio) 
6. Add "Android/Sdk/platform-tools" directory to the system path
7. Download [PaleMoon 28.6.1](http://archive.palemoon.org/palemoon/28.x/28.6.1/) and delete all update files in the directory to avoid auto updates
8. Start phone in debug mode: eg. *#*#33284#*#*
9. Call "adb forward tcp:6000 localfilesystem:/data/local/debugger-socket" in command line to connect your phone
10. Open Palemoon -> Tools -> WebIDE (newer versions don't have it anymore)
11. Connect to Remote 
12. Open Packaged App and ignore version failure
13. Upload Software

