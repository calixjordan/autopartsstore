@echo off
set PATH=C:\Program Files\nodejs;%PATH%
echo Deploying compiled site to production...
call npx netlify deploy --prod
