$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location -LiteralPath $PSScriptRoot
Write-Host "Starting Rifaq Brand Settings Hub..."
Write-Host "فتح هب إعدادات رفاق..."
Write-Host "Open this URL if the browser does not open automatically: http://localhost:3000"
Start-Process "http://localhost:3000"
& npx --yes pnpm@10.28.1 dev
