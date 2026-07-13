@echo off
set PATH=C:\Program Files\nodejs;%PATH%
set SITE_ID=c70cba9c-fb59-4ea4-a9e1-3b75198b94e7

echo Setting DATABASE_URL...
npx netlify env:set DATABASE_URL "postgresql://neondb_owner:npg_xh2JOC9dFTwB@ep-flat-pine-atrvayta.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"

echo Done! Verifying all env vars...
npx netlify env:list
