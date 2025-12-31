
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SecureCorp Security Assessment - Live Demo" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Setup Environment
$root = (Get-Location).Path
Write-Host "[*] Working Directory: $root"

# 2. Check Python
Write-Host "`n[*] Check 1: Python Connectivity" -ForegroundColor Yellow
try {
    $ver = python --version 2>&1
    Write-Host "    [SUCCESS] Found: $ver" -ForegroundColor Green
} catch {
    Write-Host "    [FAIL] Python not found or error running command." -ForegroundColor Red
    exit
}

# 3. Simulate Reconnaissance
Write-Host "`n[*] Check 2: Running Reconnaissance Demo (dns_enum.py)" -ForegroundColor Yellow
$reconPath = Join-Path $root "reconnaissance"
if (Test-Path $reconPath) {
    Set-Location $reconPath
    if (Test-Path "dns_enum.py") {
        Write-Host "    Running DNS Enumeration on 'example.com'..." -ForegroundColor Gray
        try {
            # Run the python script and capture output
            $output = python dns_enum.py example.com -o demo_result.json 2>&1
            
            # Check if it produced output or file
            if (Test-Path "demo_result.json") {
                Write-Host "    [SUCCESS] Scan completed!" -ForegroundColor Green
                $json = Get-Content "demo_result.json" | ConvertFrom-Json
                Write-Host "    Target Domain: $($json.domain)"
                Write-Host "    Scan Time: $($json.timestamp)"
                Write-Host "    Output saved to: $(Join-Path $reconPath 'demo_result.json')"
            } else {
                 Write-Host "    [!] Script ran but no output file generated." -ForegroundColor Red
                 Write-Host "    Output: $output"
            }
        } catch {
             Write-Host "    [FAIL] Error running script: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "    [FAIL] dns_enum.py not found in reconnaissance folder." -ForegroundColor Red
    }
    Set-Location $root
} else {
    Write-Host "    [FAIL] Reconnaissance folder not found." -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Demo Complete. You are ready to show this to your friend!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
