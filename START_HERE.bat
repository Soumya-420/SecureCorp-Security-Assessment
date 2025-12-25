@echo off
echo ================================================================
echo.
echo     SecureCorp Security Assessment Project
echo.
echo     Comprehensive Cybersecurity Assessment Framework
echo.
echo ================================================================
echo.

echo [*] Checking Python installation...
python --version
if errorlevel 1 (
    echo [!] Python not found! Please install Python 3.8+
    pause
    exit /b 1
)

echo.
echo [*] Checking dependencies...
python -m pip show requests >nul 2>&1
if errorlevel 1 (
    echo [!] Installing dependencies...
    python -m pip install -r requirements.txt
) else (
    echo [+] Dependencies already installed
)

echo.
echo ================================================================
echo WARNING: ETHICAL AND LEGAL WARNING
echo ================================================================
echo This project is for EDUCATIONAL PURPOSES ONLY.
echo Only test systems you OWN or have EXPLICIT WRITTEN
echo permission to test. Unauthorized testing is ILLEGAL
echo and may result in CRIMINAL CHARGES.
echo ================================================================
echo.

echo [*] Project Status:
echo.
echo     [+] Project structure: Ready
echo     [+] Python dependencies: Installed
echo     [+] Documentation: Available
echo.

echo ================================================================
echo ASSESSMENT PHASES
echo ================================================================
echo.
echo  1. Reconnaissance - cd reconnaissance
echo  2. Vulnerability Assessment - cd vulnerability-assessment
echo  3. Penetration Testing - cd penetration-testing
echo  4. Web Application Security (DVWA) - cd web-application-security\dvwa
echo  5. Client-Side Attacks - cd client-side-attacks
echo  6. Password Security - cd password-security
echo  7. Malware Analytics - cd malware-analytics
echo  8. Social Engineering - cd social-engineering
echo  9. Mobile Security - cd mobile-security
echo 10. Wi-Fi Security - cd wifi-security
echo.

echo ================================================================
echo QUICK START
echo ================================================================
echo.
echo  1. Read the documentation:
echo     - README.md - Project overview
echo     - QUICK_START.md - Getting started guide
echo     - PROJECT_PLAN.md - Detailed methodology
echo.
echo  2. Review each phase README:
echo     - Each directory contains a README.md with instructions
echo.
echo  3. Begin with Reconnaissance phase:
echo     cd reconnaissance
echo     type README.md
echo.
echo ================================================================
echo.

pause

