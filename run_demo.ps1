# SecureCorp Security Assessment - Demo Script
# Shows available tools and example usage

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SecureCorp Security Assessment Project" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Project Status: " -NoNewline
Write-Host "RUNNING" -ForegroundColor Green
Write-Host ""

Write-Host "Available Assessment Tools:" -ForegroundColor Yellow
Write-Host ""

# Reconnaissance
Write-Host "1. RECONNAISSANCE" -ForegroundColor White
Write-Host "   Location: reconnaissance/"
Write-Host "   Scripts:"
Write-Host "     - network_scan.py"
Write-Host "       Usage: python network_scan.py <target_ip> -t service -o results.json"
Write-Host "     - dns_enum.py"
Write-Host "       Usage: python dns_enum.py example.com -s -o dns_results.json"
Write-Host ""

# Vulnerability Assessment
Write-Host "2. VULNERABILITY ASSESSMENT" -ForegroundColor White
Write-Host "   Location: vulnerability-assessment/"
Write-Host "   Scripts:"
Write-Host "     - vuln_scan.py"
Write-Host "       Usage: python vuln_scan.py http://target-url -o vuln_report.json"
Write-Host ""

# Web Application Security
Write-Host "3. WEB APPLICATION SECURITY (DVWA)" -ForegroundColor White
Write-Host "   Location: web-application-security/dvwa/"
Write-Host "   Scripts:"
Write-Host "     - sql_injection_dvwa.py"
Write-Host "       Usage: python sql_injection_dvwa.py --url http://localhost/dvwa --session SESSION_COOKIE"
Write-Host ""

# Password Security
Write-Host "4. PASSWORD SECURITY" -ForegroundColor White
Write-Host "   Location: password-security/"
Write-Host "   Scripts:"
Write-Host "     - hash_analyzer.py"
Write-Host "       Usage: python hash_analyzer.py <hash_string> --crack --wordlist wordlist.txt"
Write-Host ""

# Wi-Fi Security
Write-Host "5. WI-FI SECURITY" -ForegroundColor White
Write-Host "   Location: wifi-security/"
Write-Host "   Scripts:"
Write-Host "     - wifi_scanner.py"
Write-Host "       Usage: python wifi_scanner.py -i wlan0 -d 30 -o wifi_scan.json"
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "EXAMPLE: Starting Reconnaissance Phase" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "cd reconnaissance" -ForegroundColor Green
Write-Host "python network_scan.py 127.0.0.1 -t basic -o scan_results.json" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Replace 127.0.0.1 with your authorized target" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

