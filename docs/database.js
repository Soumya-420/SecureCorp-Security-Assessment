// LocalSimulation DB
// Logic to mock a persistent database using LocalStorage

class SecurityDB {
    constructor() {
        this.dbName = 'SecureCorp_DB_v1';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.dbName)) {
            // Seed default data
            const initialData = [
                { id: 'SC-1024', time: '2025-10-12 14:30', target: '10.0.0.15', type: 'Reconnaissance', status: 'COMPLETED', findings: 'Open Ports: 22, 80' },
                { id: 'SC-1025', time: '2025-10-12 15:45', target: 'vpn.securecorp.local', type: 'VulnScan', status: 'CRITICAL', findings: 'CVE-2021-41773' }
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
            ...record,
            status: 'PENDING'
        };
        data.push(newRecord);
        localStorage.setItem(this.dbName, JSON.stringify(data));

        // Simulate processing time then update results
        setTimeout(() => {
            this.updateStatus(newRecord.id, 'COMPLETED', 'Analysis Finished. View Report.');
        }, 5000); // 5 sec "scan"

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
}

const db = new SecurityDB();
