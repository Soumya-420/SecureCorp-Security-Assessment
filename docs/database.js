// LocalSimulation DB
// Logic to mock a persistent database using LocalStorage

class SecurityDB {
    constructor() {
        this.dbName = 'SecureCorp_DB_v2';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.dbName)) {
            // Seed default data
            const initialData = [
                { id: 'SC-1024', time: '2025-10-12 14:30', target: '10.0.0.15', type: 'Reconnaissance', status: 'COMPLETED', modules: ['Port Scan'], findings: 'Open Ports: 22, 80' },
                { id: 'SC-1025', time: '2025-10-12 15:45', target: 'vpn.securecorp.local', type: 'VulnScan', status: 'CRITICAL', modules: ['All'], findings: 'CVE-2021-41773' }
            ];
            localStorage.setItem(this.dbName, JSON.stringify(initialData));
        }
    }

    getAll() {
        return JSON.parse(localStorage.getItem(this.dbName) || '[]');
    }

    async addRealScan(target, type, modules) {
        let findings = "Analyzing...";
        let status = "PROCESSING";

        try {
            const isIp = /^[0-9.]+$|^[a-fA-F0-9:]+$/.test(target);
            if (isIp) {
                const res = await fetch(`https://ipapi.co/${target}/json/`);
                const data = await res.json();
                findings = `IP: ${data.ip} | Loc: ${data.city}, ${data.country_name} | Org: ${data.org}`;
                status = "COMPLETED";
            } else {
                const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${target}&type=A`, {
                    headers: { 'Accept': 'application/dns-json' }
                });
                const data = await res.json();
                if (data.Answer) {
                    const ips = data.Answer.map(r => r.data).join(', ');
                    findings = `Host: ${target} | Resolved: ${ips} | DNS Status: ${data.Status === 0 ? 'NOERROR' : 'ERROR'}`;
                    status = "COMPLETED";
                } else {
                    findings = "DNS Resolution Failed: No Records";
                    status = "FAILED";
                }
            }
        } catch (e) {
            findings = "Scan Error: " + e.message;
            status = "ERROR";
        }

        const data = this.getAll();
        const newRecord = {
            id: 'SC-' + Math.floor(Math.random() * 9000 + 1000),
            time: new Date().toLocaleString(),
            target: target,
            type: type,
            modules: modules,
            status: status,
            findings: findings
        };
        data.push(newRecord);
        localStorage.setItem(this.dbName, JSON.stringify(data));

        if (window.renderDB) window.renderDB();
        return newRecord;
    }

    // Legacy Mock Method (Kept for fallback if needed, but primary is now addRealScan)
    add(record) {
        // Redirect to async logic if possible, but this is sync. 
        // We will update the UI to call addRealScan instead.
        return this.addRealScan(record.target, record.type, record.modules || ['Standard']);
    }

    updateStatus(id, status, findings) {
        const data = this.getAll();
        const index = data.findIndex(r => r.id === id);
        if (index !== -1) {
            data[index].status = status;
            if (findings) data[index].findings = findings;
            localStorage.setItem(this.dbName, JSON.stringify(data));
            if (window.renderDB) window.renderDB();
        }
    }
}

const db = new SecurityDB();
