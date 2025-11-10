@echo off
echo ===========================================
echo 🚀 Automatizando Commit e Push para o Render
echo ===========================================

REM 1. Adiciona todas as alterações
git add .
echo.
echo ✅ Arquivos adicionados (git add .)

REM 2. Pede a mensagem de commit
set /p commit_message="Digite a mensagem do commit (Ex: Fix CORS para Render): "
echo.

REM 3. Confirma o commit com a mensagem digitada
git commit -m "%commit_message%"
echo.
echo ✅ Commit criado: "%commit_message%"

REM 4. Envia as alterações para o GitHub (e aciona o Render)
git push origin main
echo.
echo 🚀 Push enviado para 'main' no GitHub!

echo.
echo ===========================================
echo ⭐ Deploy para o Render iniciado! ⭐
echo ===========================================
pause