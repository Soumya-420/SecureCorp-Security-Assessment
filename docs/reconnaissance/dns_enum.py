#!/usr/bin/env python3
"""
DNS Enumeration Script for SecureCorp Security Assessment
Discovers DNS records, subdomains, and related information
"""

import dns.resolver
import dns.reversename
import argparse
import json
from datetime import datetime

def dns_enum(domain, record_type='A'):
    """Enumerate DNS records for a domain"""
    results = []
    
    try:
        answers = dns.resolver.resolve(domain, record_type)
        for rdata in answers:
            results.append(str(rdata))
    except dns.resolver.NoAnswer:
        print(f"[!] No {record_type} record found for {domain}")
    except dns.resolver.NXDOMAIN:
        print(f"[!] Domain {domain} does not exist")
    except Exception as e:
        print(f"[!] Error querying {record_type} record: {e}")
    
    return results

def get_all_records(domain):
    """Get common DNS records for a domain"""
    records = {}
    record_types = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'SOA', 'CNAME']
    
    print(f"[*] Enumerating DNS records for {domain}...")
    
    for record_type in record_types:
        records[record_type] = dns_enum(domain, record_type)
        if records[record_type]:
            print(f"[+] {record_type}: {', '.join(records[record_type])}")
    
    return records

def reverse_dns_lookup(ip):
    """Perform reverse DNS lookup"""
    try:
        rev_name = dns.reversename.from_address(ip)
        answers = dns.resolver.resolve(rev_name, 'PTR')
        return [str(rdata) for rdata in answers]
    except Exception as e:
        print(f"[!] Reverse DNS lookup failed for {ip}: {e}")
        return []

def subdomain_bruteforce(domain, wordlist=None):
    """Attempt to find subdomains using common names"""
    common_subdomains = [
        'www', 'mail', 'ftp', 'localhost', 'webmail', 'smtp', 'pop', 'ns1',
        'webdisk', 'www2', 'ns2', 'cpanel', 'whm', 'autodiscover', 'autoconfig',
        'm', 'imap', 'test', 'ns', 'blog', 'pop3', 'dev', 'www1', 'ftp2',
        'admin', 'news', 'vpn', 'ns3', 'mail2', 'new', 'mysql', 'old',
        'lists', 'support', 'mobile', 'mx', 'static', 'docs', 'beta',
        'web2', 'www3', 'api', 'blogs', 'backup', 'shop', 'sql', 'secure',
        'demo', 'cp', 'calendar', 'wiki', 'web', 'media', 'email', 'images',
        'img', 'www-int', 'portal', 'video', 'sip', 'dns2', 'api-dev',
        'dns1', 'server', 'mx2', 'chat', 'owa', 'db', 'forums', 'store',
        'sms', 'proxy', 'banner', 'adserver', 'ads', 'ads1', 'files', 'ssl',
        'ads2', 'feed', 'feeds', 'rss', 'crm', 'cms', 'backups', 'mysql',
        'localhost', 'ftp1', 'club', 'forums', 'archive', 'imap2', 'test1',
        'mp3', 'dns', 'ns4', 'mail3', 'ser', 'smtp2', 'panel', 'blog',
        'pop3', 'mk', 'pop3', 'imap3', 'git', 'pay', 'ssl2', 'vpn2'
    ]
    
    if wordlist:
        with open(wordlist, 'r') as f:
            common_subdomains.extend([line.strip() for line in f])
    
    found_subdomains = []
    
    print(f"[*] Brute-forcing subdomains for {domain}...")
    
    for subdomain in common_subdomains:
        full_domain = f"{subdomain}.{domain}"
        try:
            answers = dns.resolver.resolve(full_domain, 'A', lifetime=1)
            found_subdomains.append({
                'subdomain': full_domain,
                'ip': [str(rdata) for rdata in answers]
            })
            print(f"[+] Found: {full_domain} -> {found_subdomains[-1]['ip']}")
        except:
            pass
    
    return found_subdomains

def main():
    parser = argparse.ArgumentParser(
        description='DNS enumeration tool for SecureCorp assessment'
    )
    parser.add_argument('domain', help='Target domain')
    parser.add_argument(
        '-r', '--reverse',
        help='IP address for reverse DNS lookup'
    )
    parser.add_argument(
        '-s', '--subdomain',
        action='store_true',
        help='Perform subdomain brute-force'
    )
    parser.add_argument(
        '-w', '--wordlist',
        help='Wordlist file for subdomain brute-force'
    )
    parser.add_argument(
        '-o', '--output',
        default='dns_results.json',
        help='Output file for results'
    )
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("SecureCorp DNS Enumeration Tool")
    print("=" * 60)
    
    results = {
        'domain': args.domain,
        'timestamp': datetime.now().isoformat(),
        'dns_records': get_all_records(args.domain)
    }
    
    if args.reverse:
        results['reverse_dns'] = reverse_dns_lookup(args.reverse)
        print(f"[+] Reverse DNS for {args.reverse}: {results['reverse_dns']}")
    
    if args.subdomain:
        results['subdomains'] = subdomain_bruteforce(args.domain, args.wordlist)
    
    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n[+] Results saved to {args.output}")

if __name__ == '__main__':
    try:
        import dns.resolver
        main()
    except ImportError:
        print("[!] Please install dnspython: pip install dnspython")

