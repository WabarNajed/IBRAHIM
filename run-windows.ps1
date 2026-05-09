$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location -LiteralPath $PSScriptRoot

Write-Host ""
Write-Host "============================================================"
Write-Host "Rifaq / Dclean verification for Windows"
Write-Host "مشروع رفاق / دكلين - تشغيل التحقق على ويندوز"
Write-Host "============================================================"
Write-Host ""
Write-Host "Project folder: $(Get-Location)"
Write-Host ""

$commands = @(
  @{ Step = "[1/5] Installing workspace dependencies with pnpm 10.28.1"; Args = @("--yes", "pnpm@10.28.1", "install") },
  @{ Step = "[2/5] Running typecheck"; Args = @("--yes", "pnpm@10.28.1", "typecheck") },
  @{ Step = "[3/5] Running build"; Args = @("--yes", "pnpm@10.28.1", "build") },
  @{ Step = "[4/5] Running tests"; Args = @("--yes", "pnpm@10.28.1", "test") },
  @{ Step = "[5/5] Running lint"; Args = @("--yes", "pnpm@10.28.1", "lint") }
)

foreach ($command in $commands) {
  Write-Host ""
  Write-Host $command.Step
  & npx @($command.Args)
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: npx $($command.Args -join ' ')"
  }
}

Write-Host ""
Write-Host "============================================================"
Write-Host "Success! All checks passed."
Write-Host "تم بنجاح! كل الفحوصات نجحت."
Write-Host "============================================================"
