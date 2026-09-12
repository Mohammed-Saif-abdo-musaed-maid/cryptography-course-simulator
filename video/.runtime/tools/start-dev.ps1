# start-dev.ps1 — Launches the Cryptography Course Simulator on Windows.
#
# Why this file exists:
#   On Windows, `npm` is a .cmd shim (npm.cmd), not a Win32 executable, so
#   `Start-Process -FilePath npm` fails with "%1 is not a valid Win32 application".
#   This script launches npm through `cmd.exe /c` and python through the
#   interpreter directly. It never touches application source code.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\start-dev.ps1            # start both
#   powershell -ExecutionPolicy Bypass -File .\start-dev.ps1 -FrontendOnly
#   powershell -ExecutionPolicy Bypass -File .\start-dev.ps1 -BackendOnly
#
# URLs:
#   Backend  -> http://127.0.0.1:8000/api/health  (Swagger: /docs)
#   Frontend -> http://127.0.0.1:5173

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$BackendDir  = Join-Path $ProjectRoot 'backend'
$FrontendDir = Join-Path $ProjectRoot 'frontend'
$LogDir      = Join-Path $ProjectRoot '.runtime'
$LogDir      = Join-Path $LogDir 'logs'
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Test-Port($Port) {
    $c = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return [bool]$c
}

function Wait-Url($Url, $TimeoutSec = 60) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    while ($sw.Elapsed.TotalSeconds -lt $TimeoutSec) {
        try {
            $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { return $true }
        } catch { Start-Sleep -Milliseconds 500 }
    }
    return $false
}

function Start-Backend {
    $backendLog  = Join-Path $LogDir 'backend.log'
    $backendErr  = Join-Path $LogDir 'backend.err'
    if (Test-Port 8000) {
        Write-Host '[BACKEND] Port 8000 already in use — reusing the running service.' -ForegroundColor Yellow
        if (Wait-Url 'http://127.0.0.1:8000/api/health' 5) { return } 
    }
    Start-Process -FilePath 'python' -ArgumentList '-m','uvicorn','app.main:app','--reload','--port','8000' `
        -WorkingDirectory $BackendDir `
        -RedirectStandardOutput $backendLog -RedirectStandardError $backendErr -WindowStyle Hidden
}

function Start-Frontend {
    $frontendLog = Join-Path $LogDir 'frontend.log'
    $frontendErr = Join-Path $LogDir 'frontend.err'
    if (Test-Port 5173) {
        Write-Host '[FRONTEND] Port 5173 already in use — reusing the running service.' -ForegroundColor Yellow
        if (Wait-Url 'http://127.0.0.1:5173' 5) { return }
    }
    # npm on Windows is npm.cmd — must be invoked through cmd.exe.
    Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npm run dev' `
        -WorkingDirectory $FrontendDir `
        -RedirectStandardOutput $frontendLog -RedirectStandardError $frontendErr -WindowStyle Hidden
}

Write-Host '====================================================' -ForegroundColor Cyan
Write-Host ' Cryptography Course Simulator — Development Launcher' -ForegroundColor Cyan
Write-Host '====================================================' -ForegroundColor Cyan

if (-not $BackendOnly) { Start-Frontend }
if (-not $FrontendOnly) { Start-Backend }

Start-Sleep -Seconds 4

$backendOk = Test-Port 8000
$frontendOk = Test-Port 5173

if ($backendOk) {
    $health = if (Wait-Url 'http://127.0.0.1:8000/api/health' 30) { 'RUNNING' } else { 'UNKNOWN' }
    Write-Host "BACKEND: $health  ->  http://127.0.0.1:8000  (docs: http://127.0.0.1:8000/docs)" -ForegroundColor Green
} else {
    Write-Host 'BACKEND: FAILED — port 8000 is not listening.' -ForegroundColor Red
    Write-Host "  Backend log: $LogDir\backend.log" -ForegroundColor Red
    Write-Host "  Backend err: $LogDir\backend.err" -ForegroundColor Red
}

if ($frontendOk) {
    $ui = if (Wait-Url 'http://127.0.0.1:5173' 60) { 'RUNNING' } else { 'UNKNOWN' }
    Write-Host "FRONTEND: $ui  ->  http://127.0.0.1:5173" -ForegroundColor Green
} else {
    Write-Host 'FRONTEND: FAILED — port 5173 is not listening.' -ForegroundColor Red
    Write-Host "  Frontend log: $LogDir\frontend.log" -ForegroundColor Red
    Write-Host "  Frontend err: $LogDir\frontend.err" -ForegroundColor Red
}

Write-Host ''
Write-Host 'Logs: ' -ForegroundColor Cyan -NoNewline; Write-Host $LogDir

if (-not $backendOk -or -not $frontendOk) { exit 1 }
exit 0