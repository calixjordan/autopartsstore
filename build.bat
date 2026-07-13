@echo off
set PATH=C:\Program Files\nodejs;%PATH%

echo Linking GitHub repo to Netlify site...
npx netlify build --context production 2>&1
