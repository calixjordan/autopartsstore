@echo off
set PATH=C:\Program Files\nodejs;%PATH%
npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts
