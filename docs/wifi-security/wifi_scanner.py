#!/usr/bin/env python3
"""
Wi-Fi Network Scanner for SecureCorp Security Assessment
Scans for wireless networks and analyzes their security
"""

import subprocess
import re
import json
import argparse
from datetime import datetime

class WiFiScanner:
    def __init__(self, interface=None):
        self.interface = interface or self.find_wireless_interface()
        self.networks = []
    
    def find_wireless_interface(self):
        """Find available wireless interface"""
        try:
            result = subprocess.run(
                ['iwconfig'],
                capture_output=True,
                text=True
            )
            # Parse interfaces from iwconfig output
            matches = re.findall(r'^(\w+)\s+IEEE', result.stdout, re.MULTILINE)
            if matches:
                return matches[0]
        except FileNotFoundError:
            print("[!] iwconfig not found")
        except Exception as e:
            print(f"[!] Error finding interface: {e}")
        
        return None
    
    def enable_monitor_mode(self):
        """Enable monitor mode on wireless interface"""
        if not self.interface:
            print("[!] No wireless interface found")
            return False
        
        print(f"[*] Enabling monitor mode on {self.interface}...")
        
        try:
            # Stop interface
            subprocess.run(['ifconfig', self.interface, 'down'], check=False)
            # Enable monitor mode
            subprocess.run(['iwconfig', self.interface, 'mode', 'monitor'], check=True)
            # Start interface
            subprocess.run(['ifconfig', self.interface, 'up'], check=True)
            print(f"[+] Monitor mode enabled on {self.interface}")
            return True
        except subprocess.CalledProcessError as e:
            print(f"[!] Failed to enable monitor mode: {e}")
            return False
        except FileNotFoundError:
            print("[!] Required tools (ifconfig/iwconfig) not found")
            return False
    
    def scan_networks(self, duration=10):
        """Scan for wireless networks"""
        if not self.interface:
            print("[!] No wireless interface specified")
            return []
        
        print(f"[*] Scanning for wireless networks (duration: {duration}s)...")
        
        try:
            # Use airodump-ng if available, otherwise use iwlist
            result = subprocess.run(
                ['iwlist', self.interface, 'scan'],
                capture_output=True,
                text=True,
                timeout=duration + 5
            )
            
            if result.returncode == 0:
                return self.parse_iwlist_output(result.stdout)
            else:
                print("[!] Scan failed")
                return []
        except FileNotFoundError:
            print("[!] iwlist not found. Please install wireless tools.")
            return []
        except subprocess.TimeoutExpired:
            print("[!] Scan timed out")
            return []
    
    def parse_iwlist_output(self, output):
        """Parse iwlist scan output"""
        networks = []
        current_network = {}
        
        lines = output.split('\n')
        
        for line in lines:
            line = line.strip()
            
            # Cell identifier
            if 'Cell' in line:
                if current_network:
                    networks.append(current_network)
                current_network = {}
            
            # ESSID
            if 'ESSID:' in line:
                essid = re.search(r'ESSID:"([^"]*)"', line)
                if essid:
                    current_network['essid'] = essid.group(1)
                else:
                    essid = re.search(r'ESSID:(\S+)', line)
                    if essid:
                        current_network['essid'] = essid.group(1)
            
            # MAC Address
            if 'Address:' in line:
                mac = re.search(r'Address: ([0-9A-Fa-f:]{17})', line)
                if mac:
                    current_network['mac'] = mac.group(1)
            
            # Encryption
            if 'Encryption key:' in line:
                encrypted = 'on' in line.lower()
                current_network['encrypted'] = encrypted
            
            # Encryption type
            if 'IE:' in line:
                if 'WPA2' in line:
                    current_network['encryption'] = 'WPA2'
                elif 'WPA' in line:
                    current_network['encryption'] = 'WPA'
                elif 'WEP' in line:
                    current_network['encryption'] = 'WEP'
            
            # Signal level
            if 'Signal level=' in line:
                signal = re.search(r'Signal level=(-?\d+)', line)
                if signal:
                    current_network['signal'] = int(signal.group(1))
            
            # Channel
            if 'Channel:' in line:
                channel = re.search(r'Channel:(\d+)', line)
                if channel:
                    current_network['channel'] = int(channel.group(1))
        
        if current_network:
            networks.append(current_network)
        
        return networks
    
    def analyze_security(self, networks):
        """Analyze security of discovered networks"""
        print("\n[*] Analyzing network security...")
        
        for network in networks:
            security_score = 10  # Start with perfect score
            
            # Check encryption
            if not network.get('encrypted'):
                network['security_issues'] = network.get('security_issues', [])
                network['security_issues'].append('No encryption')
                security_score -= 5
            
            # Check encryption type
            encryption = network.get('encryption', '')
            if encryption == 'WEP':
                network['security_issues'] = network.get('security_issues', [])
                network['security_issues'].append('WEP encryption (easily crackable)')
                security_score -= 4
            elif encryption == 'WPA':
                network['security_issues'] = network.get('security_issues', [])
                network['security_issues'].append('WPA encryption (consider upgrading to WPA2/WPA3)')
                security_score -= 1
            
            network['security_score'] = max(0, security_score)
            
            # Determine risk level
            if security_score >= 8:
                network['risk_level'] = 'Low'
            elif security_score >= 5:
                network['risk_level'] = 'Medium'
            else:
                network['risk_level'] = 'High'
        
        return networks
    
    def generate_report(self, networks, output_file):
        """Generate security assessment report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'interface': self.interface,
            'total_networks': len(networks),
            'networks': networks,
            'summary': {
                'open_networks': len([n for n in networks if not n.get('encrypted')]),
                'wep_networks': len([n for n in networks if n.get('encryption') == 'WEP']),
                'wpa_networks': len([n for n in networks if n.get('encryption') == 'WPA']),
                'wpa2_networks': len([n for n in networks if n.get('encryption') == 'WPA2']),
                'high_risk': len([n for n in networks if n.get('risk_level') == 'High']),
                'medium_risk': len([n for n in networks if n.get('risk_level') == 'Medium']),
                'low_risk': len([n for n in networks if n.get('risk_level') == 'Low'])
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print("\n" + "=" * 60)
        print("WI-FI SECURITY ASSESSMENT SUMMARY")
        print("=" * 60)
        print(f"Total Networks Found: {report['summary']['total_networks']}")
        print(f"Open Networks: {report['summary']['open_networks']}")
        print(f"WEP Networks: {report['summary']['wep_networks']}")
        print(f"WPA Networks: {report['summary']['wpa_networks']}")
        print(f"WPA2 Networks: {report['summary']['wpa2_networks']}")
        print(f"\nRisk Distribution:")
        print(f"  High Risk: {report['summary']['high_risk']}")
        print(f"  Medium Risk: {report['summary']['medium_risk']}")
        print(f"  Low Risk: {report['summary']['low_risk']}")
        print("=" * 60)
        
        print(f"\n[+] Report saved to {output_file}")

def main():
    parser = argparse.ArgumentParser(
        description='Wi-Fi network scanner for SecureCorp assessment'
    )
    parser.add_argument(
        '-i', '--interface',
        help='Wireless interface to use'
    )
    parser.add_argument(
        '-d', '--duration',
        type=int,
        default=10,
        help='Scan duration in seconds'
    )
    parser.add_argument(
        '-o', '--output',
        default='wifi_scan_results.json',
        help='Output file for scan results'
    )
    parser.add_argument(
        '--monitor-mode',
        action='store_true',
        help='Enable monitor mode (requires root)'
    )
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("SecureCorp Wi-Fi Security Scanner")
    print("=" * 60)
    print("\n[!] LEGAL WARNING: Only scan networks you own or have")
    print("    explicit written permission to scan. Unauthorized")
    print("    scanning may be illegal in your jurisdiction.\n")
    
    scanner = WiFiScanner(args.interface)
    
    if not scanner.interface:
        print("[!] No wireless interface found")
        return
    
    print(f"[+] Using interface: {scanner.interface}")
    
    if args.monitor_mode:
        scanner.enable_monitor_mode()
    
    networks = scanner.scan_networks(args.duration)
    
    if networks:
        print(f"\n[+] Found {len(networks)} networks")
        networks = scanner.analyze_security(networks)
        scanner.generate_report(networks, args.output)
        
        # Print network list
        print("\n[+] Discovered Networks:")
        for network in networks:
            print(f"\n  ESSID: {network.get('essid', 'Hidden')}")
            print(f"    MAC: {network.get('mac', 'Unknown')}")
            print(f"    Encryption: {network.get('encryption', 'None')}")
            print(f"    Signal: {network.get('signal', 'Unknown')} dBm")
            print(f"    Channel: {network.get('channel', 'Unknown')}")
            print(f"    Risk Level: {network.get('risk_level', 'Unknown')}")
            if network.get('security_issues'):
                print(f"    Issues: {', '.join(network['security_issues'])}")
    else:
        print("[!] No networks found")

if __name__ == '__main__':
    main()

