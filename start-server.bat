@echo off
title ExamTrack Server
echo Starting ExamTrack local web server on http://localhost:8080 ...
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
