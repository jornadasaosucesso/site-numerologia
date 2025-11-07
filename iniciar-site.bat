@echo off
title SITE NUMEROLOGIA - Servidor Local
color 0a
echo ==========================================
echo 🚀 INICIANDO SERVIDOR SITE-NUMEROLOGIA...
echo ==========================================

REM Ir para o diretório do projeto
cd /d "C:\site-numerologia"

REM Inicia o servidor Node (server.js)
start cmd /k "node server.js"

REM Aguarda 2 segundos para garantir que o servidor subiu
timeout /t 2 >nul

REM Abre o navegador padrão no localhost:8000
start http://localhost:8000

echo ==========================================
echo ✅ Servidor iniciado com sucesso!
echo ==========================================
pause
