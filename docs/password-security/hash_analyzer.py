#!/usr/bin/env python3
"""
Hash Analysis Script for SecureCorp Security Assessment
Identifies hash types and analyzes password hashes
"""

import hashlib
import re
import argparse
import subprocess

class HashAnalyzer:
    def __init__(self):
        self.hash_patterns = {
            'MD5': r'^[a-fA-F0-9]{32}$',
            'SHA1': r'^[a-fA-F0-9]{40}$',
            'SHA256': r'^[a-fA-F0-9]{64}$',
            'SHA512': r'^[a-fA-F0-9]{128}$',
            'bcrypt': r'^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$',
            'NTLM': r'^[a-fA-F0-9]{32}$',
            'LM': r'^[a-fA-F0-9]{32}$'
        }
    
    def identify_hash_type(self, hash_string):
        """Identify hash type based on pattern"""
        hash_string = hash_string.strip()
        
        for hash_type, pattern in self.hash_patterns.items():
            if re.match(pattern, hash_string):
                return hash_type
        
        # Additional checks
        if hash_string.startswith('$1$'):
            return 'MD5 Crypt'
        elif hash_string.startswith('$5$'):
            return 'SHA-256 Crypt'
        elif hash_string.startswith('$6$'):
            return 'SHA-512 Crypt'
        elif hash_string.startswith('$argon2'):
            return 'Argon2'
        elif ':' in hash_string:
            parts = hash_string.split(':')
            if len(parts) == 2:
                return self.identify_hash_type(parts[1])
        
        return 'Unknown'
    
    def analyze_hash_strength(self, hash_type, hash_string):
        """Analyze hash strength and security"""
        analysis = {
            'hash_type': hash_type,
            'length': len(hash_string),
            'strength': 'Unknown',
            'recommendations': []
        }
        
        weak_hashes = ['MD5', 'LM', 'NTLM', 'MD5 Crypt']
        moderate_hashes = ['SHA1', 'SHA-256 Crypt']
        strong_hashes = ['SHA256', 'SHA512', 'SHA-512 Crypt', 'bcrypt', 'Argon2']
        
        if hash_type in weak_hashes:
            analysis['strength'] = 'Weak'
            analysis['recommendations'].append('Consider migrating to stronger hash algorithms')
            analysis['recommendations'].append('Use bcrypt, Argon2, or PBKDF2 for password hashing')
        elif hash_type in moderate_hashes:
            analysis['strength'] = 'Moderate'
            analysis['recommendations'].append('Consider upgrading to stronger algorithms')
        elif hash_type in strong_hashes:
            analysis['strength'] = 'Strong'
            analysis['recommendations'].append('Current hash algorithm is secure')
        
        # Check for salt
        if ':' in hash_string:
            parts = hash_string.split(':')
            if len(parts) >= 2:
                analysis['salt_detected'] = True
        elif hash_type in ['bcrypt', 'MD5 Crypt', 'SHA-256 Crypt', 'SHA-512 Crypt']:
            analysis['salt_detected'] = True
        else:
            analysis['salt_detected'] = False
            if hash_type not in weak_hashes:
                analysis['recommendations'].append('Consider using salted hashes')
        
        return analysis
    
    def crack_with_hashcat(self, hash_string, wordlist, hash_mode=None):
        """Attempt to crack hash using hashcat"""
        hash_type = self.identify_hash_type(hash_string)
        
        hash_modes = {
            'MD5': '0',
            'SHA1': '100',
            'SHA256': '1400',
            'SHA512': '1700',
            'NTLM': '1000',
            'LM': '3000'
        }
        
        if not hash_mode:
            hash_mode = hash_modes.get(hash_type, '0')
        
        cmd = [
            'hashcat',
            '-m', hash_mode,
            '-a', '0',  # Dictionary attack
            hash_string,
            wordlist
        ]
        
        print(f"[*] Attempting to crack {hash_type} hash with hashcat...")
        print(f"[*] Command: {' '.join(cmd)}")
        
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=3600
            )
            return result
        except FileNotFoundError:
            print("[!] hashcat not found. Please install hashcat.")
            return None
        except subprocess.TimeoutExpired:
            print("[!] Hash cracking timed out")
            return None
    
    def crack_with_john(self, hash_string, wordlist):
        """Attempt to crack hash using John the Ripper"""
        print(f"[*] Attempting to crack hash with John the Ripper...")
        
        # Save hash to temporary file
        with open('hash_temp.txt', 'w') as f:
            f.write(hash_string)
        
        cmd = ['john', '--wordlist=' + wordlist, 'hash_temp.txt']
        
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=3600
            )
            return result
        except FileNotFoundError:
            print("[!] john not found. Please install John the Ripper.")
            return None
        except subprocess.TimeoutExpired:
            print("[!] Hash cracking timed out")
            return None

def main():
    parser = argparse.ArgumentParser(
        description='Hash analysis tool for SecureCorp assessment'
    )
    parser.add_argument('hash', help='Hash string to analyze')
    parser.add_argument(
        '--crack',
        action='store_true',
        help='Attempt to crack the hash'
    )
    parser.add_argument(
        '--wordlist',
        help='Wordlist file for cracking'
    )
    parser.add_argument(
        '--tool',
        choices=['hashcat', 'john'],
        default='hashcat',
        help='Tool to use for cracking'
    )
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("SecureCorp Hash Analysis Tool")
    print("=" * 60)
    
    analyzer = HashAnalyzer()
    
    # Identify hash type
    hash_type = analyzer.identify_hash_type(args.hash)
    print(f"\n[*] Hash Type: {hash_type}")
    
    # Analyze hash strength
    analysis = analyzer.analyze_hash_strength(hash_type, args.hash)
    print(f"[*] Hash Strength: {analysis['strength']}")
    print(f"[*] Salt Detected: {analysis.get('salt_detected', False)}")
    
    if analysis['recommendations']:
        print("\n[+] Recommendations:")
        for rec in analysis['recommendations']:
            print(f"    - {rec}")
    
    # Attempt to crack if requested
    if args.crack:
        if not args.wordlist:
            print("\n[!] Wordlist required for cracking. Use --wordlist option.")
        else:
            if args.tool == 'hashcat':
                result = analyzer.crack_with_hashcat(args.hash, args.wordlist)
            else:
                result = analyzer.crack_with_john(args.hash, args.wordlist)
            
            if result:
                print("\n[+] Cracking attempt completed")
                if result.stdout:
                    print(result.stdout)

if __name__ == '__main__':
    main()

