@echo off
title 🚀 Deploy Automático - SITE NUMEROLOGIA
color 0A

echo ===============================================
echo       INICIANDO CICLO DE DEPLOY COMPLETO
echo ===============================================
echo.

powershell -ExecutionPolicy Bypass -File "C:\site-numerologia\deploy-vercel.ps1"
echo.
timeout /t 5 >nul

powershell -ExecutionPolicy Bypass -File "C:\site-numerologia\verificar-status-pos-deploy.ps1"

echo.
echo ===============================================
echo            CICLO CONCLUÍDO COM SUCESSO
echo ===============================================
pause
