#!/usr/bin/env python3
"""
Network Scanning Script for SecureCorp Security Assessment
Performs comprehensive network scanning and service enumeration
"""

import subprocess
import json
import sys
import argparse
from datetime import datetime

def run_nmap_scan(target, scan_type='basic'):
    """Execute nmap scan based on scan type"""
    
    scans = {
        'basic': ['-sn'],  # Ping scan
        'tcp': ['-sS', '-p-'],  # TCP SYN scan all ports
        'service': ['-sV', '-sC'],  # Service version and default scripts
        'aggressive': ['-A', '-T4'],  # Aggressive scan
        'udp': ['-sU', '--top-ports', '100']  # UDP scan
    }
    
    if scan_type not in scans:
        print(f"Unknown scan type: {scan_type}")
        return None
    
    cmd = ['nmap'] + scans[scan_type] + [target]
    
    print(f"[*] Running {scan_type} scan on {target}...")
    print(f"[*] Command: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=600
        )
        
        return {
            'target': target,
            'scan_type': scan_type,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode,
            'timestamp': datetime.now().isoformat()
        }
    except subprocess.TimeoutExpired:
        print(f"[!] Scan timed out for {target}")
        return None
    except FileNotFoundError:
        print("[!] nmap not found. Please install nmap.")
        return None

def save_results(results, filename):
    """Save scan results to file"""
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"[+] Results saved to {filename}")

def main():
    parser = argparse.ArgumentParser(
        description='Network scanning tool for SecureCorp assessment'
    )
    parser.add_argument('target', help='Target IP address or range')
    parser.add_argument(
        '-t', '--type',
        choices=['basic', 'tcp', 'service', 'aggressive', 'udp'],
        default='service',
        help='Type of scan to perform'
    )
    parser.add_argument(
        '-o', '--output',
        default='scan_results.json',
        help='Output file for results'
    )
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("SecureCorp Network Scanning Tool")
    print("=" * 60)
    
    results = run_nmap_scan(args.target, args.type)
    
    if results:
        save_results(results, args.output)
        print("\n[*] Scan completed successfully!")
        print("\n[+] Summary:")
        print(results['stdout'])
    else:
        print("[!] Scan failed")
        sys.exit(1)

if __name__ == '__main__':
    main()

