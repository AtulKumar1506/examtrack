@echo off
title Push ExamTrack to GitHub
powershell -ExecutionPolicy Bypass -File "%~dp0push-to-github.ps1"
pause
