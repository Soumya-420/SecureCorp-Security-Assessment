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

    add(record) {
        const data = this.getAll();
        const newRecord = {
            id: 'SC-' + Math.floor(Math.random() * 9000 + 1000),
            time: new Date().toLocaleString(),
            target: record.target,
            type: record.type,
            modules: record.modules || ['Standard Scan'], // Store selected modules
            status: 'PENDING',
            findings: 'Initializing scan...'
        };
        data.push(newRecord);
        localStorage.setItem(this.dbName, JSON.stringify(data));

        // Simulate processing time then update results
        setTimeout(() => {
            const result = this.generateMockFindings(newRecord.target, newRecord.modules);
            this.updateStatus(newRecord.id, 'COMPLETED', result);
        }, 4000);

        return newRecord;
    }

    updateStatus(id, status, findings) {
        const data = this.getAll();
        const index = data.findIndex(r => r.id === id);
        if (index !== -1) {
            data[index].status = status;
            if (findings) data[index].findings = findings;
            localStorage.setItem(this.dbName, JSON.stringify(data));
            // Trigger UI update if visible
            if (window.renderDB) window.renderDB();
        }
    }

    generateMockFindings(target, modules) {
        const vulns = [
            "SQL Injection in /login parameter",
            "XSS Reflected in search bar",
            "Open Port 22 (SSH) - Weak Cipher",
            "Missing Security Headers (HSTS)",
            "Outdated Apache Version 2.4.49",
            "Default Credentials (admin/admin)"
        ];

        // Randomly pick findings based on "complexity"
        if (modules.includes('All') || modules.length > 3) {
            return `CRITICAL: ${vulns[Math.floor(Math.random() * 3)]} detected.`;
        } else {
            return `INFO: Scan completed. ${Math.floor(Math.random() * 5)} minor issues found.`;
        }
    }
}

const db = new SecurityDB();
