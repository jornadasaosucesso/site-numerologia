# ============================================
# DEPLOY AUTOMÁTICO SITE-NUMEROLOGIA (LOG EXPANDIDO)
# ============================================
# COMANDO PARA RODAR P DEPLY
# .\deploy-vercel.ps1


<#
  COMPATIBILIDADE E NOTAS:
  - Este script é compatível com PowerShell 5.x (Windows 10) e 7.x (Core).
  - Caso o parâmetro "-Encoding utf8NoBOM" não exista, o script usa
    [System.Text.Encoding]::UTF8.GetBytes() para gerar UTF-8 puro.
  - Isso evita o erro: "Couldn't parse JSON file ... vercel.json".
  - Recomendado: salvar este arquivo sempre em UTF-8 (sem BOM).
#>

Write-Host "=== INICIANDO SEQUÊNCIA DE DEPLOY DO SITE-NUMEROLOGIA ===" -ForegroundColor Cyan

# Caminho base do projeto
$projectPath = "C:\site-numerologia"
Set-Location $projectPath

# Caminho do log
$logFile = "$projectPath\deploy-log.txt"

# Marca o tempo inicial da operação
$startTime = Get-Date

# ======== 1. Verifica o token =========
if (-not $env:VERCEL_TOKEN) {
    Write-Host "ERRO: Variável de ambiente VERCEL_TOKEN não encontrada!" -ForegroundColor Red
    Write-Host "Configure com: setx VERCEL_TOKEN \"seu_token_aqui\" e reinicie o PowerShell."
    exit 1
}

# ======== 2. Recria o vercel.json =========
$vercelJson = @'
{
  "version": 2,
  "builds": [
    { "src": "entrada.html", "use": "@vercel/static" },
    { "src": "**/*", "use": "@vercel/static" }
  ],
  "redirects": [
    {
      "source": "/",
      "destination": "/entrada.html",
      "permanent": false
    }
  ]
}
'@

# Criação compatível com qualquer versão do PowerShell
try {
    $vercelJson | Out-File -FilePath "$projectPath\vercel.json" -Encoding utf8NoBOM -ErrorAction Stop
}
catch {
    # Fallback para versões antigas
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($vercelJson)
    [System.IO.File]::WriteAllBytes("$projectPath\vercel.json", $bytes)
    Write-Host "Aviso: vercel.json gravado em UTF-8 puro (modo compatibilidade PowerShell 5.x)." -ForegroundColor Yellow
}
Write-Host "Arquivo vercel.json criado/revisado com sucesso." -ForegroundColor Green

# ======== 3. Verifica o CLI =========
$vercelCLI = "C:\Users\Jorge\AppData\Roaming\npm\vercel.cmd"
if (-not (Test-Path $vercelCLI)) {
    Write-Host "ERRO: Vercel CLI não encontrado. Instale com: npm install -g vercel" -ForegroundColor Red
    exit 1
}

# ======== 4. Informações do ambiente =========
$nodeVersion = (& node -v) -replace "`n",""
$vercelVersion = (& $vercelCLI --version) -replace "`n",""
$machineName = $env:COMPUTERNAME
$userName = $env:USERNAME
$osVersion = (Get-CimInstance Win32_OperatingSystem).Caption
$projectSize = (Get-ChildItem $projectPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
$projectSize = "{0:N2}" -f $projectSize

Write-Host "AMBIENTE DETECTADO:" -ForegroundColor Cyan
Write-Host "   Maquina: $machineName ($userName)"
Write-Host "   SO: $osVersion"
Write-Host "   Node.js: $nodeVersion"
Write-Host "   Vercel CLI: $vercelVersion"
Write-Host "   Tamanho do projeto: $projectSize MB"
Write-Host ""

# ======== 5. Executa o deploy =========
Write-Host "Iniciando deploy de producao..." -ForegroundColor Yellow
$output = & $vercelCLI --prod --cwd $projectPath --token $env:VERCEL_TOKEN 2>&1
Write-Host $output

# ======== 6. Extrai a URL do deploy =========
$match = $output | Select-String -Pattern "https://[^\s]+\.vercel\.app"
if ($match) {
    $url = $match.Matches[0].Value
    Write-Host "Site publicado em: $url" -ForegroundColor Green
    Start-Process $url
} else {
    $url = "URL não identificada"
    Write-Host "Aviso: Não foi possível identificar a URL automaticamente." -ForegroundColor Yellow
}

# ======== 7. Cálculo da duração =========
$endTime = Get-Date
$duration = New-TimeSpan -Start $startTime -End $endTime
$durationFormatted = "{0:D2}:{1:D2}:{2:D2}" -f $duration.Hours, $duration.Minutes, $duration.Seconds

# ======== 8. Registro detalhado no log =========
$timestamp = $startTime.ToString("dd/MM/yyyy HH:mm:ss")
$logEntry = @"
============================================================
DEPLOY REGISTRADO EM $timestamp
------------------------------------------------------------
Usuario:     $userName
Maquina:     $machineName
Sistema:     $osVersion
Node.js:     $nodeVersion
Vercel CLI:  $vercelVersion
Projeto:     SITE-NUMEROLOGIA
Tamanho:     $projectSize MB
Duracao:     $durationFormatted
URL:         $url
============================================================

"@
Add-Content -Path $logFile -Value $logEntry

# ======== 9. Limita o log a 100 registros =========
$maxEntries = 100
if (Test-Path $logFile) {
    $content = Get-Content -Path $logFile -Raw -Encoding UTF8
    $entries = $content -split "============================================================"
    if ($entries.Count -gt $maxEntries) {
        $trimmed = $entries[-$maxEntries..-1] -join "============================================================"
        $trimmed | Out-File -FilePath $logFile -Encoding UTF8
        Write-Host "Log truncado para manter os ultimos $maxEntries registros." -ForegroundColor DarkGray
    }
}

# ======== 10. Conclusão =========
Write-Host ""
Write-Host "Deploy concluido com sucesso!" -ForegroundColor Cyan
Write-Host "Log salvo em: $logFile" -ForegroundColor DarkCyan
