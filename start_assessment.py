#!/usr/bin/env python3
"""
SecureCorp Security Assessment - Interactive Startup Script
Helps initiate the security assessment process
"""

import os
import sys
import json
from datetime import datetime

def print_banner():
    """Print project banner"""
    banner = """
    ================================================================
    
            SecureCorp Security Assessment Project
            
            Comprehensive Cybersecurity Assessment Framework
    
    ================================================================
    """
    print(banner)

def check_dependencies():
    """Check if required Python packages are installed"""
    required_packages = {
        'requests': 'requests',
        'dns': 'dnspython',
        'nmap': 'python-nmap'
    }
    
    missing_packages = []
    
    print("\n[*] Checking Python dependencies...")
    for module, package in required_packages.items():
        try:
            __import__(module)
            print(f"    [+] {package} - Installed")
        except ImportError:
            print(f"    [!] {package} - Missing")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n[!] Missing packages: {', '.join(missing_packages)}")
        print("[*] Install with: pip install " + " ".join(missing_packages))
        return False
    
    print("\n[+] All Python dependencies are installed!")
    return True

def create_assessment_log():
    """Create initial assessment log file"""
    log_data = {
        'project': 'SecureCorp Security Assessment',
        'start_date': datetime.now().isoformat(),
        'status': 'In Progress',
        'phases': {
            'reconnaissance': {'status': 'Pending', 'started': None},
            'vulnerability_assessment': {'status': 'Pending', 'started': None},
            'penetration_testing': {'status': 'Pending', 'started': None},
            'web_application_security': {'status': 'Pending', 'started': None},
            'client_side_attacks': {'status': 'Pending', 'started': None},
            'password_security': {'status': 'Pending', 'started': None},
            'malware_analytics': {'status': 'Pending', 'started': None},
            'social_engineering': {'status': 'Pending', 'started': None},
            'mobile_security': {'status': 'Pending', 'started': None},
            'wifi_security': {'status': 'Pending', 'started': None}
        },
        'findings': [],
        'targets': []
    }
    
    log_file = 'assessment_log.json'
    with open(log_file, 'w') as f:
        json.dump(log_data, f, indent=2)
    
    print(f"\n[+] Assessment log created: {log_file}")
    return log_file

def show_menu():
    """Display main menu"""
    menu = """
    ================================================================
    ASSESSMENT MENU
    ================================================================
    
    1. Reconnaissance & Information Gathering
    2. Vulnerability Assessment
    3. Penetration Testing
    4. Web Application Security (DVWA)
    5. Client-Side Attacks
    6. Password Security
    7. Malware Analytics
    8. Social Engineering
    9. Mobile Application Security
    10. Wi-Fi Network Security
    
    0. View Project Documentation
    Q. Quit
    
    ================================================================
    """
    print(menu)

def get_target_info():
    """Get target information from user"""
    print("\n[*] Target Information Required")
    print("[!] IMPORTANT: Only enter targets you own or have permission to test!")
    
    targets = {}
    
    target_type = input("\nEnter target type (domain/ip/url) or 'skip': ").strip().lower()
    
    if target_type == 'skip':
        return None
    
    target_value = input(f"Enter {target_type}: ").strip()
    
    if target_value:
        targets[target_type] = target_value
        print(f"\n[+] Target recorded: {target_type} = {target_value}")
    
    return targets

def show_phase_info(phase_number):
    """Show information about a specific phase"""
    phases = {
        '1': {
            'name': 'Reconnaissance',
            'dir': 'reconnaissance',
            'scripts': ['network_scan.py', 'dns_enum.py'],
            'description': 'Information gathering and network discovery'
        },
        '2': {
            'name': 'Vulnerability Assessment',
            'dir': 'vulnerability-assessment',
            'scripts': ['vuln_scan.py'],
            'description': 'Systematic identification of security weaknesses'
        },
        '3': {
            'name': 'Penetration Testing',
            'dir': 'penetration-testing',
            'description': 'Ethical hacking and exploitation validation'
        },
        '4': {
            'name': 'Web Application Security (DVWA)',
            'dir': 'web-application-security/dvwa',
            'scripts': ['sql_injection_dvwa.py'],
            'description': 'Web application security testing using DVWA'
        },
        '5': {
            'name': 'Client-Side Attacks',
            'dir': 'client-side-attacks',
            'description': 'Browser and client-side vulnerability analysis'
        },
        '6': {
            'name': 'Password Security',
            'dir': 'password-security',
            'scripts': ['hash_analyzer.py'],
            'description': 'Password security and hash analysis'
        },
        '7': {
            'name': 'Malware Analytics',
            'dir': 'malware-analytics',
            'description': 'Malware analysis and detection'
        },
        '8': {
            'name': 'Social Engineering',
            'dir': 'social-engineering',
            'description': 'Phishing and social engineering assessment'
        },
        '9': {
            'name': 'Mobile Application Security',
            'dir': 'mobile-security',
            'description': 'Mobile app security testing'
        },
        '10': {
            'name': 'Wi-Fi Network Security',
            'dir': 'wifi-security',
            'scripts': ['wifi_scanner.py'],
            'description': 'Wireless network security assessment'
        }
    }
    
    phase = phases.get(phase_number)
    if not phase:
        print("[!] Invalid phase number")
        return
    
    print(f"\n{'='*60}")
    print(f"Phase: {phase['name']}")
    print(f"{'='*60}")
    print(f"Description: {phase['description']}")
    print(f"Directory: {phase['dir']}/")
    
    if 'scripts' in phase:
        print(f"\nAvailable Scripts:")
        for script in phase['scripts']:
            script_path = os.path.join(phase['dir'], script)
            if os.path.exists(script_path):
                print(f"  [+] {script_path}")
            else:
                print(f"  [-] {script_path} (not found)")
    
    readme_path = os.path.join(phase['dir'], 'README.md')
    if os.path.exists(readme_path):
        print(f"\n[+] Documentation available: {readme_path}")
        print(f"    View with: type {readme_path}")

def main():
    """Main function"""
    print_banner()
    
    # Check dependencies
    deps_ok = check_dependencies()
    
    # Create assessment log
    log_file = create_assessment_log()
    
    # Show ethical warning
    print("\n" + "="*60)
    print("WARNING: ETHICAL AND LEGAL WARNING")
    print("="*60)
    print("This project is for EDUCATIONAL PURPOSES ONLY.")
    print("Only test systems you OWN or have EXPLICIT WRITTEN")
    print("permission to test. Unauthorized testing is ILLEGAL")
    print("and may result in CRIMINAL CHARGES.")
    print("="*60)
    
    consent = input("\nDo you understand and agree to test only authorized targets? (yes/no): ").strip().lower()
    if consent != 'yes':
        print("\n[!] Assessment cancelled. Please review ethical guidelines.")
        sys.exit(0)
    
    # Get target information
    targets = get_target_info()
    if targets:
        with open(log_file, 'r') as f:
            log_data = json.load(f)
        log_data['targets'].append(targets)
        with open(log_file, 'w') as f:
            json.dump(log_data, f, indent=2)
    
    # Main menu loop
    while True:
        show_menu()
        choice = input("\nSelect an option (0-10, Q to quit): ").strip().upper()
        
        if choice == 'Q':
            print("\n[+] Assessment session ended. Good luck with your assessment!")
            break
        elif choice == '0':
            print("\n[*] Available Documentation:")
            docs = [
                'README.md',
                'PROJECT_PLAN.md',
                'QUICK_START.md',
                'ASSESSMENT_SUMMARY.md'
            ]
            for doc in docs:
                if os.path.exists(doc):
                    print(f"  [+] {doc}")
                else:
                    print(f"  [-] {doc}")
        elif choice in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']:
            show_phase_info(choice)
            proceed = input("\nProceed with this phase? (yes/no): ").strip().lower()
            if proceed == 'yes':
                phase = {
                    '1': 'reconnaissance',
                    '2': 'vulnerability-assessment',
                    '3': 'penetration-testing',
                    '4': 'web-application-security/dvwa',
                    '5': 'client-side-attacks',
                    '6': 'password-security',
                    '7': 'malware-analytics',
                    '8': 'social-engineering',
                    '9': 'mobile-security',
                    '10': 'wifi-security'
                }[choice]
                
                print(f"\n[+] Navigate to: cd {phase}")
                print(f"[+] Read README: type {phase}/README.md")
                print(f"[*] Follow the instructions in the README file")
        else:
            print("\n[!] Invalid option. Please try again.")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[!] Assessment interrupted by user.")
        sys.exit(0)

