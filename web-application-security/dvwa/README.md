# DVWA (Damn Vulnerable Web Application) Testing

## Overview
This directory contains specific security tests and exploits for DVWA, which serves as the central reference point for web application security assessment.

## DVWA Security Levels

DVWA offers multiple security levels:
- **Low** - No security measures
- **Medium** - Some basic protections
- **High** - Stronger protections
- **Impossible** - Best practices implemented

## Testing Modules

### 1. SQL Injection
- File: `sql_injection_dvwa.py`
- Tests all security levels
- Demonstrates various injection techniques

### 2. Cross-Site Scripting (XSS)
- File: `xss_dvwa.py`
- Reflected and stored XSS
- Cookie stealing demonstrations

### 3. Command Injection
- File: `command_injection_dvwa.py`
- OS command execution
- Blind command injection

### 4. File Upload
- File: `file_upload_dvwa.py`
- Malicious file upload
- Execution verification

### 5. Brute Force
- File: `brute_force_dvwa.py`
- Password brute-forcing
- Account lockout testing

### 6. CSRF
- File: `csrf_dvwa.py`
- Cross-site request forgery
- Token validation testing

## Usage

1. Ensure DVWA is installed and running
2. Set security level in DVWA settings
3. Log in to DVWA
4. Run appropriate test script:
   ```bash
   python sql_injection_dvwa.py --url http://localhost/dvwa --security-level low
   ```

## Ethical Notice

These scripts are for educational purposes only. Only test against DVWA instances you own or have explicit permission to test.

