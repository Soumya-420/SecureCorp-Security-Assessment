# Quick Start Guide

## Overview
This guide will help you get started with the SecureCorp Security Assessment project.

## Prerequisites

### System Requirements
- **Operating System**: Kali Linux (recommended) or similar penetration testing distribution
- **Python**: Python 3.8 or higher
- **Permissions**: Root/sudo access for some tools (network scanning, Wi-Fi testing)

### Required Tools
Install the following tools on your system:

```bash
# Update package manager
sudo apt update

# Install network scanning tools
sudo apt install nmap nikto

# Install vulnerability scanners
# Nuclei: https://github.com/projectdiscovery/nuclei
# wget -qL https://github.com/projectdiscovery/nuclei/releases/latest/download/nuclei_3.0.0_linux_amd64.zip

# Install password cracking tools
sudo apt install john hashcat

# Install Wi-Fi tools (Linux only)
sudo apt install aircrack-ng

# Install DNS tools
sudo apt install dnsutils

# Install Python dependencies
pip install -r requirements.txt
```

### DVWA Setup
For web application security testing:

1. Download DVWA from: https://github.com/digininja/DVWA
2. Set up on a local web server (XAMPP, LAMP, etc.)
3. Configure database and security settings
4. Note the URL and session cookie for testing

## Project Structure

```
SecureCorp-Security-Assessment/
├── README.md                    # Main project documentation
├── PROJECT_PLAN.md              # Detailed project plan
├── QUICK_START.md              # This file
├── requirements.txt            # Python dependencies
├── reconnaissance/             # Information gathering
├── vulnerability-assessment/   # Vulnerability scanning
├── penetration-testing/        # Ethical hacking
├── web-application-security/   # Web app security (DVWA)
├── client-side-attacks/        # Client-side security
├── password-security/          # Password analysis
├── malware-analytics/          # Malware analysis
├── social-engineering/         # Social engineering tests
├── mobile-security/            # Mobile app security
├── wifi-security/              # Wireless security
└── reports/                    # Assessment reports
```

## Getting Started

### 1. Initial Setup

```bash
# Clone or navigate to project directory
cd SecureCorp-Security-Assessment

# Install Python dependencies
pip install -r requirements.txt

# Verify tools are installed
nmap --version
nikto -Version
python --version
```

### 2. Reconnaissance Phase

```bash
# Network scanning
cd reconnaissance
python network_scan.py <target_ip> -t service -o scan_results.json

# DNS enumeration
python dns_enum.py example.com -s -o dns_results.json
```

### 3. Vulnerability Assessment

```bash
cd vulnerability-assessment
python vuln_scan.py http://target-url -o vuln_report.json
```

### 4. Web Application Security (DVWA)

```bash
cd web-application-security/dvwa
# First, log in to DVWA and get your session cookie
python sql_injection_dvwa.py --url http://localhost/dvwa --session YOUR_SESSION_COOKIE --security-level low
```

### 5. Password Security

```bash
cd password-security
python hash_analyzer.py <hash_string> --crack --wordlist /usr/share/wordlists/rockyou.txt
```

### 6. Wi-Fi Security (Linux only, requires root)

```bash
cd wifi-security
sudo python wifi_scanner.py -i wlan0 -d 30 --monitor-mode -o wifi_scan.json
```

## Testing Workflow

### Recommended Order

1. **Reconnaissance** - Gather information about the target
2. **Vulnerability Assessment** - Identify security weaknesses
3. **Penetration Testing** - Validate and exploit vulnerabilities
4. **Domain-Specific Testing**:
   - Web Application Security (DVWA)
   - Client-Side Attacks
   - Password Security
   - Mobile Security
   - Wi-Fi Security
5. **Specialized Testing**:
   - Malware Analytics
   - Social Engineering
6. **Reporting** - Compile findings and recommendations

## Important Notes

### Ethical and Legal Considerations

⚠️ **CRITICAL WARNINGS**:

1. **Authorization Required**: Only test systems you own or have explicit written permission to test
2. **Legal Compliance**: Unauthorized testing is illegal and may result in criminal charges
3. **Scope Definition**: Always define and document the scope of testing
4. **Data Privacy**: Ensure compliance with data protection regulations
5. **Responsible Disclosure**: Report findings through proper channels

### Best Practices

- Always work in isolated test environments
- Use snapshots for VMs to enable easy restoration
- Document all activities and findings
- Maintain detailed logs
- Follow responsible disclosure practices
- Keep tools and systems updated

## Troubleshooting

### Common Issues

**"Command not found" errors**
- Ensure tools are installed and in PATH
- Use `which <command>` to verify installation
- Some tools may require full path

**Permission denied errors**
- Some operations require root/sudo access
- Use `sudo` for network scanning and Wi-Fi operations
- Check file permissions for output files

**Python import errors**
- Run `pip install -r requirements.txt`
- Verify Python version: `python --version`
- Check virtual environment activation if used

**DVWA connection errors**
- Verify DVWA is running and accessible
- Check URL and session cookie
- Ensure database is properly configured

## Next Steps

1. Review the `PROJECT_PLAN.md` for detailed methodology
2. Read individual README files in each module directory
3. Customize scripts for your specific testing environment
4. Begin systematic assessment following the workflow
5. Document findings as you progress
6. Generate comprehensive reports

## Support and Resources

- **DVWA Documentation**: https://github.com/digininja/DVWA
- **OWASP Testing Guide**: https://owasp.org/www-project-web-security-testing-guide/
- **Kali Linux Documentation**: https://www.kali.org/docs/
- **Nmap Reference**: https://nmap.org/book/

## Contributing

This is an educational project. Feel free to:
- Customize scripts for your needs
- Add additional tools and tests
- Improve documentation
- Share findings and improvements

## License

Educational use only. Use responsibly and ethically.

