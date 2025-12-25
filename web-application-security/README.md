# Web Application Security Module

## Overview
This module focuses on assessing web application security, with special emphasis on DVWA (Damn Vulnerable Web Application) as the primary testing platform.

## Testing Areas

### 1. SQL Injection (SQLi)
- Union-based injection
- Boolean-based blind injection
- Time-based blind injection
- Error-based injection

### 2. Cross-Site Scripting (XSS)
- Reflected XSS
- Stored XSS
- DOM-based XSS

### 3. Command Injection
- OS command injection
- Code injection
- LDAP injection

### 4. File Upload Vulnerabilities
- Unrestricted file upload
- Malicious file execution
- File type validation bypass

### 5. Authentication & Session Management
- Weak authentication
- Session fixation
- Session hijacking
- Password policies

### 6. Access Control
- Broken access control
- Insecure direct object references
- Missing function level access control

## DVWA Testing

The `dvwa/` directory contains specific tests and exploits for DVWA vulnerabilities.

## Tools

- **Burp Suite** - Intercepting proxy and web app scanner
- **OWASP ZAP** - Web application security scanner
- **SQLMap** - SQL injection tool
- **XSSer** - XSS exploitation tool

## Scripts

- `sql_injection_test.py` - SQL injection testing
- `xss_test.py` - Cross-site scripting tests
- `command_injection_test.py` - Command injection assessment
- `file_upload_test.py` - File upload vulnerability testing

## Deliverables

- Web application security report
- Vulnerability findings
- Exploitation proof of concepts
- Remediation recommendations

