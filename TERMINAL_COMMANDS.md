# Terminal Commands for Cursor AI

Quick reference guide with ready-to-use commands for the SecureCorp Security Assessment project.

## 📋 Quick Navigation Commands

```powershell
# Navigate to project directory
cd C:\Users\soumy\SecureCorp-Security-Assessment

# View project structure
Get-ChildItem -Recurse -Directory | Select-Object FullName

# List all Python scripts
Get-ChildItem -Recurse -Filter *.py | Select-Object FullName
```

## 🚀 Startup Commands

```powershell
# Run the startup script
cd C:\Users\soumy\SecureCorp-Security-Assessment
.\START_HERE.bat

# Or run the demo script
powershell -ExecutionPolicy Bypass -File .\run_demo.ps1

# View main documentation
type README.md

# View getting started guide
type GET_STARTED.md
```

## 🔍 Reconnaissance Phase

```powershell
# Navigate to reconnaissance
cd C:\Users\soumy\SecureCorp-Security-Assessment\reconnaissance

# View README
type README.md

# Test DNS enumeration (works without external tools)
python dns_enum.py google.com -o dns_results.json

# Test DNS with subdomain brute-force
python dns_enum.py example.com -s -o dns_results.json

# Network scan (requires nmap - will show error if not installed)
python network_scan.py 127.0.0.1 -t basic -o scan_results.json

# View script help
python network_scan.py --help
python dns_enum.py --help
```

## 🔒 Vulnerability Assessment

```powershell
# Navigate to vulnerability assessment
cd C:\Users\soumy\SecureCorp-Security-Assessment\vulnerability-assessment

# View README
type README.md

# Run vulnerability scan (requires nikto/nuclei)
python vuln_scan.py http://target-url -o vuln_report.json

# View script help
python vuln_scan.py --help
```

## 🌐 Web Application Security (DVWA)

```powershell
# Navigate to DVWA directory
cd C:\Users\soumy\SecureCorp-Security-Assessment\web-application-security\dvwa

# View README
type README.md

# Run SQL injection test (requires DVWA setup and session cookie)
python sql_injection_dvwa.py --url http://localhost/dvwa --session YOUR_SESSION_COOKIE --security-level low

# View script help
python sql_injection_dvwa.py --help
```

## 🔑 Password Security

```powershell
# Navigate to password security
cd C:\Users\soumy\SecureCorp-Security-Assessment\password-security

# View README
type README.md

# Analyze a hash (MD5 example: "password")
python hash_analyzer.py 5f4dcc3b5aa765d61d8327deb882cf99

# Analyze with cracking attempt (requires wordlist)
python hash_analyzer.py 5f4dcc3b5aa765d61d8327deb882cf99 --crack --wordlist wordlist.txt

# View script help
python hash_analyzer.py --help
```

## 📡 Wi-Fi Security

```powershell
# Navigate to Wi-Fi security
cd C:\Users\soumy\SecureCorp-Security-Assessment\wifi-security

# View README
type README.md

# Run Wi-Fi scanner (requires aircrack-ng, Linux/WSL recommended)
python wifi_scanner.py -i wlan0 -d 30 -o wifi_scan.json

# View script help
python wifi_scanner.py --help
```

## 📊 Project Status Commands

```powershell
# Check Python version
python --version

# Check installed dependencies
python -m pip list | Select-String "requests|dnspython|nmap"

# View assessment log
type assessment_log.json

# Count total files in project
Get-ChildItem -Recurse -File | Measure-Object | Select-Object -ExpandProperty Count

# List all README files
Get-ChildItem -Recurse -Filter README.md | Select-Object FullName
```

## 🧪 Testing Commands

```powershell
# Test DNS enumeration with a real domain
cd C:\Users\soumy\SecureCorp-Security-Assessment\reconnaissance
python dns_enum.py microsoft.com -o test_dns.json
type test_dns.json

# Test hash analyzer with common MD5 hash
cd C:\Users\soumy\SecureCorp-Security-Assessment\password-security
python hash_analyzer.py e10adc3949ba59abbe56e057f20f883e  # "123456"

# View all available scripts
cd C:\Users\soumy\SecureCorp-Security-Assessment
Get-ChildItem -Recurse -Filter *.py | ForEach-Object { Write-Host $_.FullName }
```

## 📝 Documentation Commands

```powershell
# View all documentation files
cd C:\Users\soumy\SecureCorp-Security-Assessment
Get-ChildItem -Filter *.md | Select-Object Name

# View specific documentation
type README.md
type PROJECT_PLAN.md
type QUICK_START.md
type ASSESSMENT_SUMMARY.md
type GET_STARTED.md
type PROJECT_STATUS.md
```

## 🔧 Utility Commands

```powershell
# Create a test directory for results
cd C:\Users\soumy\SecureCorp-Security-Assessment
New-Item -ItemType Directory -Force -Path "test_results"

# View file contents in a readable format
Get-Content assessment_log.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Check if a specific tool is available
where.exe nmap
where.exe python
where.exe pip
```

## 🎯 One-Line Quick Start

```powershell
# Complete project overview
cd C:\Users\soumy\SecureCorp-Security-Assessment; Write-Host "Project Directory: $(Get-Location)"; Write-Host "`nFiles: $(Get-ChildItem -Recurse -File | Measure-Object | Select-Object -ExpandProperty Count)"; Write-Host "Python Scripts: $(Get-ChildItem -Recurse -Filter *.py | Measure-Object | Select-Object -ExpandProperty Count)"; Write-Host "`nAvailable Phases:"; Get-ChildItem -Directory | Select-Object Name
```

## 📋 Copy-Paste Ready Command Block

Copy this entire block to quickly explore the project:

```powershell
# Navigate to project
cd C:\Users\soumy\SecureCorp-Security-Assessment

# Show project status
Write-Host "`n=== SecureCorp Security Assessment ===" -ForegroundColor Cyan
Write-Host "Location: $(Get-Location)"
Write-Host "Python: $(python --version)"
Write-Host "`nAvailable Modules:" -ForegroundColor Yellow
Get-ChildItem -Directory | ForEach-Object { Write-Host "  - $($_.Name)" }

# Test DNS enumeration
Write-Host "`n=== Testing DNS Enumeration ===" -ForegroundColor Cyan
cd reconnaissance
python dns_enum.py google.com -o test_output.json
if (Test-Path test_output.json) {
    Write-Host "✓ DNS enumeration test completed" -ForegroundColor Green
    Get-Content test_output.json | ConvertFrom-Json | Select-Object domain, timestamp
}
```

## 🚨 Important Reminders

Before running any assessment commands:

```powershell
# Always verify you're testing authorized targets only
Write-Host "⚠️ REMEMBER: Only test systems you own or have permission to test!" -ForegroundColor Red
```

---

**Pro Tip**: Bookmark this file (`TERMINAL_COMMANDS.md`) for quick reference while working on your assessment!

