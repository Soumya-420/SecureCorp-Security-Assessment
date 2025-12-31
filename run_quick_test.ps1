# Quick Test Script - Copy and paste into Cursor AI Terminal
# Tests the project setup and shows available commands

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SecureCorp Security Assessment" -ForegroundColor Green
Write-Host "Quick Test & Status Check" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Navigate to project directory
$projectPath = (Get-Location).Path
Write-Host "[✓] Project directory found" -ForegroundColor Green
Write-Host "    Location: $projectPath`n"

# Check Python
Write-Host "[*] Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "    [✓] $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "    [!] Python not found" -ForegroundColor Red
}

# Check dependencies
Write-Host "`n[*] Checking dependencies..." -ForegroundColor Yellow
$deps = @("requests", "dnspython", "python-nmap")
foreach ($dep in $deps) {
    $result = python -m pip show $dep 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    [✓] $dep installed" -ForegroundColor Green
    } else {
        Write-Host "    [!] $dep not found" -ForegroundColor Red
    }
}

# Show project structure
Write-Host "`n[*] Project Structure:" -ForegroundColor Yellow
$modules = Get-ChildItem -Directory | Where-Object { $_.Name -notin @(".git", "__pycache__") }
Write-Host "    Modules: $($modules.Count)"
foreach ($module in $modules) {
    $fileCount = (Get-ChildItem -Path $module.FullName -File -Recurse -ErrorAction SilentlyContinue).Count
    Write-Host "      - $($module.Name) ($fileCount files)"
}

# Count Python scripts
$scripts = Get-ChildItem -Recurse -Filter *.py
Write-Host "`n[*] Python Scripts: $($scripts.Count)" -ForegroundColor Yellow
foreach ($script in $scripts) {
    $relativePath = $script.FullName.Replace($projectPath + "\", "")
    Write-Host "      - $relativePath"
}

# Quick test - DNS Enumeration
Write-Host "`n[*] Running Quick Test (DNS Enumeration)..." -ForegroundColor Yellow
Set-Location "$projectPath\reconnaissance"
if (Test-Path "dns_enum.py") {
    try {
        python dns_enum.py google.com -o quick_test.json 2>&1 | Out-Null
        if (Test-Path "quick_test.json") {
            Write-Host "    [✓] DNS enumeration test passed" -ForegroundColor Green
            $result = Get-Content "quick_test.json" | ConvertFrom-Json
            Write-Host "    Domain: $($result.domain)"
            Write-Host "    Timestamp: $($result.timestamp)"
            Remove-Item "quick_test.json" -ErrorAction SilentlyContinue
        }
    } catch {
        Write-Host "    [!] Test failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "    [!] dns_enum.py not found" -ForegroundColor Red
}

# Return to project root
Set-Location $projectPath

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Quick Test Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. View documentation: type README.md"
Write-Host "  2. Start reconnaissance: cd reconnaissance"
Write-Host "  3. View all commands: type TERMINAL_COMMANDS.md"
Write-Host ""

