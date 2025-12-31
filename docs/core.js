// Matrix Rain Effect (Background)
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
const fontSize = 14;
let columns = canvas.width / fontSize;
let drops = [];

function initMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = canvas.width / fontSize;
    drops = [];
    for (let i = 0; i < columns; i++) { drops[i] = 1; }
}

initMatrix();

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) { drops[i] = 0; }
        drops[i]++;
    }
}
setInterval(drawMatrix, 33);
window.addEventListener('resize', initMatrix);


// === UI NAVIGATION LOGIC ===
// === UI NAVIGATION LOGIC ===
function showSection(sectionId) {
    // Only handle dynamic sections that are hidden by default
    const dynamicSections = ['scanInput', 'database', 'privacy', 'accessLogs', 'moduleDetails'];

    // If it's a dynamic section, show it
    if (dynamicSections.includes(sectionId)) {
        const target = document.getElementById(sectionId);
        if (target) {
            target.classList.remove('hidden');
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
    // Note: Main sections (hero, modules, terminal) are always visible now for scrolling
}

// === AUTHENTICATION SYSTEM ===
const Auth = {
    key: 'SecureCorp_Users',

    init: function () {
        if (!localStorage.getItem(this.key)) {
            // Default admin
            this.register('admin', 'secure');
        }
    },

    register: function (user, pass) {
        let users = JSON.parse(localStorage.getItem(this.key) || '{}');
        if (users[user]) return false; // Exists
        users[user] = pass;
        localStorage.setItem(this.key, JSON.stringify(users));
        return true;
    },

    login: function (user, pass) {
        let users = JSON.parse(localStorage.getItem(this.key) || '{}');
        return users[user] === pass;
    }
};
Auth.init();

let isAuthenticated = false;
let currentUser = null;

function authCheck() {
    if (isAuthenticated) {
        showSection('database');
        renderDB();
    } else {
        document.getElementById('authModal').style.display = 'block';
    }
}

function closeModal() { document.getElementById('authModal').style.display = 'none'; }
function closeSignUp() { document.getElementById('signUpModal').style.display = 'none'; }

function showSignUp() {
    closeModal();
    document.getElementById('signUpModal').style.display = 'block';
}

// Login Handler
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (Auth.login(user, pass)) {
        isAuthenticated = true;
        currentUser = user;
        document.getElementById('dbLink').innerHTML = 'DATABASE 🔓';
        document.getElementById('dbLink').classList.remove('locked');
        document.getElementById('dbLink').style.color = '#00ff41';
        closeModal();
        showSection('database');
        renderDB();
        alert(`ACCESS GRANTED. Welcome Agent ${user}.`);
    } else {
        const msg = document.getElementById('loginMsg');
        msg.textContent = 'ACCESS DENIED: Invalid Credentials';
        msg.classList.add('blink');
    }
});

// Sign Up Handler
document.getElementById('signUpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('newUsername').value;
    const pass = document.getElementById('newPassword').value;

    if (user.length < 3 || pass.length < 3) {
        document.getElementById('signUpMsg').innerHTML = "Error: Credentials too short.";
        return;
    }

    if (Auth.register(user, pass)) {
        alert('REGISTRATION SUCCESSFUL. Please Authenticate.');
        closeSignUp();
        document.getElementById('authModal').style.display = 'block';
    } else {
        document.getElementById('signUpMsg').innerHTML = "Error: Agent ID already exists.";
    }
});

function logout() {
    isAuthenticated = false;
    currentUser = null;
    document.getElementById('dbLink').innerHTML = 'DATABASE 🔒';
    document.getElementById('dbLink').classList.add('locked');
    document.getElementById('dbLink').style.color = '';

    // Hide database section and scroll to top
    document.getElementById('database').classList.add('hidden');
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });

    // Optional: Hide scan input if open
    document.getElementById('scanInput').classList.add('hidden');
}


// === DATABASE & REPORTING ===
window.renderDB = function () {
    const tbody = document.getElementById('dbBody');
    tbody.innerHTML = '';
    const records = db.getAll();

    records.sort((a, b) => new Date(b.time) - new Date(a.time));

    records.forEach(row => {
        const tr = document.createElement('tr');
        const statusClass = row.status === 'CRITICAL' ? 'error' : (row.status === 'COMPLETED' ? 'success' : 'info');

        tr.innerHTML = `
            <td style="color: #8b949e">${row.id}</td>
            <td>${row.time}</td>
            <td style="color: #fff">${row.target}</td>
            <td>${row.type}</td>
            <td class="${statusClass}">${row.status}</td>
            <td>
                ${row.status === 'COMPLETED'
                ? `<button onclick="downloadReport('${row.id}')" class="btn-small">⬇ DOWNLOAD</button>`
                : '<span style="color:#666">PROCESSING...</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
};

window.downloadReport = function (id) {
    const record = db.getAll().find(r => r.id === id);
    if (!record) return;

    const content = `
SECURECORP SECURITY ASSESSMENT PROTOCOL
=======================================
REPORT ID: ${record.id}
TIMESTAMP: ${record.time}
TARGET:    ${record.target}
TYPE:      ${record.type}
AGENT:     ${currentUser || 'Unknown'}
=======================================

[ ASSESSMENT MODULES ]
${record.modules.map(m => `- [x] ${m}`).join('\n')}

[ EXECUTIVE SUMMARY ]
Status: ${record.status}
Findings: ${record.findings}

[ DETAILED LOGS ]
> Initiating handshake with ${record.target}... [OK]
> Loaded ${record.modules.length} modules... [OK]
${record.modules.includes('Port Scan') ? '> Port Scan: 22(OPEN), 80(OPEN), 443(OPEN)' : ''}
${record.modules.includes('Brute Force') ? '> Auth Testing: No weak credentials found.' : ''}
${record.modules.includes('SQL Injection') ? '> SQLi Check: /login.php is vulnerable (User-Agent).' : ''}
> Analysis completed in 4.2s.

[ RECOMMENDATIONS ]
1. Patch detected vulnerabilities immediately.
2. Review server access logs.
3. Update security headers.

---------------------------------------
CONFIDENTIAL - DO NOT DISTRIBUTE
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Assessment_Report_${record.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};


// === SCAN FORM HANDLING ===
document.getElementById('scanForm').addEventListener('submit', async function (e) {
    if (!isAuthenticated) {
        e.preventDefault();
        alert('AUTHORIZATION REQUIRED. Please Log In.');
        authCheck();
        return;
    }

    e.preventDefault();
    const target = document.getElementById('targetInput').value;
    const type = document.getElementById('scanType').value;

    // Capture Checkboxes
    const checkboxes = document.querySelectorAll('input[name="modules"]:checked');
    let modules = Array.from(checkboxes).map(cb => cb.value);
    if (modules.length === 0) modules = ['Standard Scan']; // Default

    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "OPENING SOCKET...";
    btn.disabled = true;

    // Add to DB using Real Async Scan
    try {
        const record = await db.addRealScan(target, type, modules);
        alert(`ASSESSMENT INITIATED: ${record.id}\nTarget: ${target}\nresult: ${record.findings}`);
    } catch (err) {
        alert("Scan Failed: " + err.message);
    }

    btn.innerText = originalText;
    btn.disabled = false;
    e.target.reset();
    showSection('database');
    renderDB();
});

// Init
if (typeof SecurityDB === 'undefined') {
    const script = document.createElement('script');
    script.src = 'database.js';
    document.head.appendChild(script);
}

// === SPLASH SCREEN & TERMINAL ANIMATION ===
const disclaimerText = `WARNING: AUTHORIZED ACCESS ONLY

This system is protected by advanced cryptographic protocols. 
Unauthorized access, network scanning, or penetration testing is strictly prohibited and tracked.

By entering this system, you agree to:
1. Ethical Hacking Guidelines
2. Non-Disclosure of System Architecture
3. Full Activity Logging

INITIATING SECURE HANDSHAKE...`;

const terminalLogs = [
    "INITIALIZING SECURECORP KERNEL v4.0...",
    "> LOADING MODULES: [ NET_SEC, CRYPTO, INTEL ]",
    "> CHECKING INTEGRITY... [OK]",
    "> ESTABLISHING SECURE CONNECTION...",
    "> BYPASSING FIREWALL... [SUCCESS]",
    "ACCESS GRANTED.",
    "WELCOME, AGENT.",
    "SYSTEM READY. WAITING FOR INPUT..."
];

async function typeText(text, element, speed = 30) {
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        await new Promise(r => setTimeout(r, speed));
    }
}

async function typeLines(lines, element) {
    element.innerHTML = '';
    for (const log of lines) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        element.appendChild(line);
        await typeText(log, line, 10 + Math.random() * 20);
        await new Promise(r => setTimeout(r, 100));
        element.scrollTop = element.scrollHeight;
    }
}

async function runSplashSequence() {
    console.log("Splash sequence started");
    const splash = document.getElementById('splash-screen');
    const disclaimerObj = document.getElementById('disclaimer-text');
    const enterBtn = document.getElementById('enterBtn');

    if (!splash || !disclaimerObj || !enterBtn) {
        console.error("Splash elements missing!");
        return;
    }

    // Check if valid session exists
    if (sessionStorage.getItem('visited')) {
        console.log("Session exists, skipping splash");
        splash.style.display = 'none';
        runTerminalSequence();
        return;
    }

    console.log("Typing disclaimer...");
    // Type Disclaimer
    await typeText(disclaimerText, disclaimerObj, 25);
    await new Promise(r => setTimeout(r, 500));

    console.log("Showing button");
    // Show Button
    enterBtn.classList.remove('hidden');
}

window.enterSite = function () {
    const splash = document.getElementById('splash-screen');
    splash.style.opacity = '0';
    setTimeout(() => {
        splash.style.display = 'none';
        sessionStorage.setItem('visited', 'true');
        runTerminalSequence();
    }, 800);
}

// Terminal Animation (Original, now called after splash)
async function runTerminalSequence() {
    const output = document.getElementById('terminalOutput');
    const inputLine = document.querySelector('.terminal-input-line');

    // Temporarily hide input during init sequence
    if (inputLine) inputLine.style.display = 'none';

    if (!output) return;

    // Create specific container for logs if not exists (to keep input at bottom)
    let logContainer = document.getElementById('terminalLogs');
    if (!logContainer) {
        logContainer = document.createElement('div');
        logContainer.id = 'terminalLogs';
        output.insertBefore(logContainer, inputLine); // Insert before input
    }

    await typeLines(terminalLogs, logContainer);

    // Show input after sequence
    if (inputLine) {
        inputLine.style.display = 'flex';
        document.getElementById('terminalInput').focus();
    }
}

// === INTERACTIVE TERMINAL ===
const termInput = document.getElementById('terminalInput');
if (termInput) {
    termInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const cmd = this.value.trim();
            this.value = '';
            handleCommand(cmd);
        }
    });
}

async function handleCommand(cmd) {
    const output = document.getElementById('terminalLogs') || document.getElementById('terminalOutput');
    const line = document.createElement('div');
    line.innerHTML = `<span style="color: #008F11">root@securecorp:~#</span> ${cmd}`;
    output.appendChild(line);

    let response = '';
    const lowerCmd = cmd.toLowerCase().split(' ')[0];
    const args = cmd.split(' ').slice(1);

    switch (lowerCmd) {
        case 'help':
            response = "AVAILABLE COMMANDS: help, clear, apt-get, nmap [target], scan [target], date, whoami, status, login, reboot, capture";
            break;
        case 'clear':
            output.innerHTML = '';
            return; // Exit early
        case 'date':
            response = new Date().toString();
            break;
        case 'whoami':
            response = "Identifying agent node...";
            appendResponse(output, response);
            try {
                const res = await fetch('https://api.ipify.org?format=json');
                const data = await res.json();
                response = `[+] PUBLIC NODE IDENTIFIED: ${data.ip}\n[+] AGENT: ${currentUser || 'GUEST_USER'}\n[+] ORG: SECURECORP_REMOTE_ACCESS`;
            } catch (e) {
                response = "[-] CONNECTION FAILED: " + e.message;
            }
            // Update last line instead of appending new? For simplicity, just append result distinct from status
            appendResponse(output, response, true);
            return; // Async handled
        case 'status':
            response = "SYSTEM INTEGRITY: 100% | THREAT LEVEL: LOW | ENCRYPTION: AES-256";
            break;
        case 'scan':
        case 'nmap':
            if (!isAuthenticated) {
                document.getElementById('authModal').style.display = 'block';
                response = "⛔ ACCESS DENIED: Security Clearance Required for Active Scanning.\n[!] Please login to authorize this action.";
                appendResponse(output, response, false);
                return;
            }

            executeNmap(args, output);
            return;
        case 'login':
            document.getElementById('authModal').style.display = 'block';
            response = "Launching Authentication Protocol...";
            break;
        case 'reboot':
            location.reload();
            break;
        case 'capture':
            if (args.length > 0) {
                const file = args[0];
                response = `[+] CAPTURING ARTIFACT: ${file}...\n[+] VERIFYING CHECKSUM... [OK]\n[+] SAVED TO LOCAL STORAGE.`;
            } else {
                response = "Usage: capture <filename>";
            }
            break;
        case 'apt-get':
        case 'install':
            if (args.length > 0) {
                if (args[0] === 'install') {
                    const pkg = args[1];
                    if (!pkg) {
                        response = "Usage: apt-get install <package_name>";
                    } else {
                        response = `Reading package lists... Done\nBuilding dependency tree... Done\nReading state information... Done\n\nPackage '${pkg}' is being installed...\n[####################] 100%\n\n${pkg} is now installed.`;
                    }
                } else {
                    response = "Usage: apt-get install <package_name>";
                }
            } else {
                response = "Usage: apt-get install <package_name>";
            }
            break;
        case '':
            return;
        default:
            response = `COMMAND NOT FOUND: ${cmd}. Type 'help' for available commands.`;
    }

    appendResponse(output, response);
}

function appendResponse(container, text, isResult = false) {
    const respLine = document.createElement('div');
    respLine.style.color = isResult ? '#00ff41' : '#e0e0e0';
    respLine.style.marginBottom = '10px';
    respLine.style.whiteSpace = 'pre-wrap';
    respLine.textContent = text;
    container.appendChild(respLine);
    document.getElementById('terminalOutput').scrollTop = document.getElementById('terminalOutput').scrollHeight;
}

// === ACCESS LOGS ===
window.renderAccessLogs = function () {
    const logBody = document.getElementById('accessLogsBody');
    if (!logBody) return;

    logBody.innerHTML = '';
    const logs = [
        `[${new Date().toISOString()}] SYSTEM_INIT: Secure Core Loaded`,
        `[${new Date().toISOString()}] AUTH_CHECK: User 'Guest' connected`,
        `[${new Date().toISOString()}] SECURITY_SCAN: No active threats detected`,
        `[${new Date().toISOString()}] ENCRYPTION: AES-256 handshake complete`
    ];

    // Add some random historical logs
    for (let i = 0; i < 5; i++) {
        const time = new Date(Date.now() - Math.random() * 10000000).toISOString();
        logs.push(`[${time}] SYSTEM_AUDIT: Integrity Check Passed`);
    }

    logs.sort().reverse(); // Newest first

    logs.forEach(log => {
        const div = document.createElement('div');
        div.textContent = log;
        div.style.marginBottom = '5px';
        div.style.borderBottom = '1px dashed #333';
        div.style.paddingBottom = '2px';
        logBody.appendChild(div);
    });
}

// === ADVANCED NMAP LOGIC ===
async function executeNmap(args, output) {
    // 1. Parse Arguments (Handle flags with values)
    const options = {
        scanFlags: [],
        version: false,
        os: false,
        agg: false,
        ports: 'default',
        targets: [],
        script: null
    };

    // Argument Parser
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('-')) {
            // Timing Templates (Check FIRST to avoid conflicts)
            if (/^-T[0-5]$/.test(arg)) {
                options.timing = parseInt(arg.replace('-T', ''));
                const tNames = ['Paranoid', 'Sneaky', 'Polite', 'Normal', 'Aggressive', 'Insane'];
                appendResponse(output, `[+] Timing template set to ${arg} (${tNames[options.timing]})`);
                continue; // Skip other checks for this arg
            }

            // Bool Flags
            if (['-sS', '-sT', '-sU', '-sA', '-sW', '-sM', '-sN', '-sF', '-sX', '-sI', '-sY', '-sZ', '-Pn', '--traceroute'].includes(arg)) {
                options.scanFlags.push(arg);
            }
            if (arg === '-O' || arg === '--osscan-guess') options.os = true;
            if (arg === '-sV' || arg === '--version-all') options.version = true;
            if (arg === '-A') { options.os = true; options.version = true; options.agg = true; }

            // Value Flags
            if (arg === '-p' && args[i + 1]) { options.ports = args[i + 1]; i++; }
            if (arg === '--script' && args[i + 1]) { options.script = args[i + 1]; i++; }
            if (arg === '-iL' && args[i + 1]) {
                appendResponse(output, `[+] Reading targets from ${args[i + 1]}...`);
                options.targets.push("192.168.1.10"); // Sim from file
                options.targets.push("192.168.1.11");
                i++;
            }
            // Timing Templates
            if (/^-T[0-5]$/.test(arg)) {
                options.timing = parseInt(arg.replace('-T', ''));
                const tNames = ['Paranoid', 'Sneaky', 'Polite', 'Normal', 'Aggressive', 'Insane'];
                appendResponse(output, `[+] Timing template set to ${arg} (${tNames[options.timing]})`);
            }
        } else {
            // CIDR / Range Parsing Simulation
            if (arg.includes('/')) {
                // CIDR
                options.targets.push(arg.split('/')[0]); // Just scan base
                options.targets.push(arg.split('/')[0].replace(/\d+$/, '254')); // And one more
            } else if (arg.includes('-') && !arg.startsWith('-')) {
                // Range: 192.168.1.1-50
                const [start, endStr] = arg.split('-');
                const end = parseInt(endStr);
                if (start.match(/^\d+\.\d+\.\d+\.\d+$/) && !isNaN(end)) {
                    const parts = start.split('.').map(Number);
                    const lastOctet = parts[3];
                    // Add sequence
                    for (let k = lastOctet; k <= end; k++) {
                        options.targets.push(`${parts[0]}.${parts[1]}.${parts[2]}.${k}`);
                    }
                } else {
                    // Fallback for domains with dashes
                    options.targets.push(arg);
                }
            } else {
                options.targets.push(arg);
            }
        }
    }

    if (options.targets.length === 0 && options.scanFlags.length === 0) {
        appendResponse(output, "nmap: No target specified. Try -h.");
        return;
    }

    // Help/Ver
    if (args.includes('-V')) {
        appendResponse(output, "Nmap version 7.94 ( https://nmap.org )");
        return;
    }
    if (args.includes('-h') || args.includes('--help')) {
        appendResponse(output, "Nmap 7.94 ( https://nmap.org )\nUsage: nmap [Scan Type(s)] [Options] {target specification}");
        return;
    }

    // Execution
    appendResponse(output, `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().replace('T', ' ').split('.')[0]}`);

    // Status Lines
    // Status Lines
    options.scanFlags.forEach(flag => {
        const map = {
            '-sS': 'SYN Stealth Scan', '-sT': 'TCP Connect Scan', '-sU': 'UDP Scan',
            '-sX': 'Xmas Scan', '-sF': 'FIN Scan', '-sN': 'Null Scan',
            '-sI': 'Idle Scan', '-Pn': 'No Ping / Host Discovery Disabled'
        };
        if (map[flag]) appendResponse(output, `[+] Initiating ${map[flag]}...`);
    });

    if (options.os) appendResponse(output, `[+] Enabling OS Detection...`);
    if (options.version) appendResponse(output, `[+] Enabling Version Detection...`);
    if (options.script) appendResponse(output, `[+] NSE: Loaded 146 scripts for scanning.`);

    // Loop Targets
    for (const target of options.targets) {
        // Delay Logic based on Timing
        let delay = 800; // T3 (Normal)
        if (options.timing !== undefined) {
            if (options.timing === 0) delay = 2000;
            if (options.timing === 1) delay = 1500;
            if (options.timing === 2) delay = 1000;
            if (options.timing === 4) delay = 500;
            if (options.timing === 5) delay = 100;
        }
        // Adaptive override for large ranges unless specific T set
        if (options.targets.length > 5 && options.timing === undefined) delay = 150;

        if (options.targets.length > 1) await new Promise(r => setTimeout(r, delay)); // Delay between multiple

        // Handle Real Data Fetch
        let ip = target;
        let hostname = target;
        let findings = [];

        try {
            const isIp = /^[0-9.]+$|^[a-fA-F0-9:]+$/.test(target);
            if (isIp && !target.startsWith('192.168')) {
                // Real IP
                const res = await fetch(`https://ipapi.co/${target}/json/`);
                const data = await res.json();
                hostname = data.org || "Unknown";
            } else if (!target.startsWith('192.168')) {
                // Real DNS
                const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${target}&type=A`, {
                    headers: { 'Accept': 'application/dns-json' }
                });
                const data = await res.json();
                if (data.Answer) ip = data.Answer[0].data;
                logActivity(`DNS_QUERY: Resolved ${target} -> ${ip}`);
            }
        } catch (e) { /* Ignore fetch errors for cleaner output */ }

        appendResponse(output, `Nmap scan report for ${target} (${ip})`);
        appendResponse(output, `Host is up (0.00${Math.floor(Math.random() * 9)}s latency).`);
        if (options.targets.length > 1) appendResponse(output, `[+] Processing ${target}...`);

        // Generate Port Table based on Flags
        let tableHeader = "PORT      STATE SERVICE";
        if (options.version) tableHeader += "    VERSION";

        // Dynamic Ports based on -p
        let portsToShow = [22, 80, 443, 8080];
        if (options.ports !== 'default') {
            if (options.ports === '80') portsToShow = [80];
            if (options.ports.includes(',')) portsToShow = options.ports.split(',').map(Number);
            if (options.ports === '-') portsToShow = [21, 22, 23, 25, 53, 80, 110, 139, 443, 445, 3306, 3389, 8080]; // Top ports
        }

        let tableContent = "";
        portsToShow.forEach(p => {
            // Randomize state: 50% open/closed for better demo visibility
            const state = (Math.random() > 0.5) ? 'open  ' : 'closed';

            // Logic: Always show the port, regardless of state

            let service = 'unknown';
            let version = '';
            if (p === 22) { service = 'ssh   '; version = 'OpenSSH 8.2p1'; }
            if (p === 80) { service = 'http  '; version = 'Apache httpd 2.4.41'; }
            if (p === 443) { service = 'https '; version = 'nginx 1.18.0'; }
            if (p === 53) { service = 'domain'; version = 'ISC BIND 9.16.1'; }

            let line = `${p}/tcp`.padEnd(10) + state + " " + service;
            if (options.version && state.includes('open')) line += "   " + version;
            tableContent += line + "\n";
        });

        if (tableContent === "") tableContent = "All 1000 scanned ports on " + target + " are filtered\n";

        appendResponse(output, tableHeader + "\n" + tableContent.trim());

        // Extra details
        if (options.os) appendResponse(output, `OS details: Linux 4.15 - 5.6 (95%)`);
        if (options.script && options.script.includes('vuln')) {
            appendResponse(output, `| vulners:\n|   cpe:/a:apache:httpd:2.4.41: \n|     	CVE-2021-41773 7.5 https://vulners.com/cve/CVE-2021-41773`);
        }
        if (args.includes('--traceroute')) {
            appendResponse(output, `TRACEROUTE (using port 80/tcp)\nHOP RTT     ADDRESS\n1   2.10 ms 192.168.1.1\n2   ...`);
        }
    }

    appendResponse(output, `Nmap done: ${options.targets.length} IP addresses (${options.targets.length} hosts up) scanned in ${Math.random().toFixed(2)} seconds`);
}

// Global Activity Logger for Real Events
window.logActivity = function (message) {
    const logBody = document.getElementById('accessLogsBody');
    if (logBody) {
        const div = document.createElement('div');
        div.textContent = `[${new Date().toISOString()}] ${message}`;
        div.style.marginBottom = '5px';
        div.style.borderBottom = '1px dashed #333';
        div.style.paddingBottom = '2px';
        div.style.color = '#00ff41'; // Highlight real events
        // Insert at top
        if (logBody.firstChild) {
            logBody.insertBefore(div, logBody.firstChild);
        } else {
            logBody.appendChild(div);
        }
    }
};

// === MODULE DETAILS & ANIMATION ===
const moduleData = {
    'recon': {
        title: 'RECONNAISSANCE_UNIT',
        ascii: `
    .       .
    |\\_---_/|
   /   o_o   \\
  |    (_)    | 
   \\   ---   /
    |/  |  \\|
        `,
        points: [
            "> MAPPING NETWORK TOPOLOGY...",
            "> IDENTIFYING OPERATING SYSTEMS (OS FINGERPRINTING)",
            "> HARVESTING DNS RECORDS & SUBDOMAINS",
            "> ANALYZING OPEN PORTS & SERVICES"
        ],
        file: "NetMap_Global_Extraction.pdf"
    },
    'vuln': {
        title: 'VULNERABILITY_SCANNER',
        ascii: `
      .--.
     /    \\
    |  !!  |
     \\    /
      '--'
    [TARGET]
        `,
        points: [
            "> CROSS-REFERENCING NIST CVE DATABASE",
            "> DETECTING UNPATCHED SERVICES",
            "> CALCULATING CVSS RISK SCORES",
            "> VERIFYING PATCH INTEGRITY"
        ],
        file: "CVE_Critical_Report.json"
    },
    'web': {
        title: 'WEB_SECURITY_AUDIT',
        ascii: `
   _______
  /       \\
 |  LOCK   |
 |   [#]   |
  \\_______/
     | |
        `,
        points: [
            "> INJECTING SQL PAYLOADS (SQLi TEST)",
            "> FUZZING API ENDPOINTS FOR INPUT VALIDATION",
            "> SIMULATING XSS & CSRF ATTACKS",
            "> CHECKING SSL/TLS CONFIGURATION"
        ],
        file: "Payload_Injection_List.txt"
    },
    'auth': {
        title: 'AUTH_CRACKER_SUITE',
        ascii: `
  [#####]
  | 123 |
  | 456 |
  | 789 |
  |_*0_#|
        `,
        points: [
            "> PERFORMING DICTIONARY ATTACKS",
            "> HASH COLLISION ANALYSIS (RAINBOW TABLES)",
            "> TESTING MULTI-FACTOR BYPASS",
            "> AUDITING PASSWORD COMPLEXITY POLICIES"
        ],
        file: "Hash_Analysis_Dump.bin"
    }
};

let currentModId = null;

window.showModuleDetails = async function (id) {
    const data = moduleData[id];
    console.log("Showing details for:", id, data); // Debug Log
    if (!data) return;

    // Security Check REMOVED per user request
    // if (!isAuthenticated) { ... }

    currentModId = id;
    showSection('moduleDetails');

    document.getElementById('modName').textContent = data.title;
    document.getElementById('modAscii').textContent = data.ascii;
    document.getElementById('fetchBtn').innerHTML = `⬇ FETCH ${data.file.split('_')[0]}_DOCS`;
    document.getElementById('fetchBtn').disabled = false;

    // Animate Points
    const container = document.getElementById('modPoints');
    container.innerHTML = ''; // Clear previous

    for (const point of data.points) {
        const p = document.createElement('div');
        p.style.marginBottom = '8px';
        p.style.opacity = '0'; // Start hidden
        p.style.color = '#fff';
        container.appendChild(p);

        // Typing effect for list
        p.style.opacity = '1';
        await typeText(point, p, 15);
        await new Promise(r => setTimeout(r, 200));
    }
};

window.fetchModuleArgs = function () {
    const btn = document.getElementById('fetchBtn');
    const data = moduleData[currentModId];

    btn.disabled = true;
    btn.innerHTML = "⌛ DOWNLOADING...";

    // Simulate network delay
    setTimeout(() => {
        btn.innerHTML = "✅ DOWNLOAD COMPLETE";
        btn.style.borderColor = "#00ff41";

        // Generate Dummy File Content
        const content = `
SECURECORP DEFENSE SYSTEMS
MODULE SPECIFICATION DOCUMENT
================================
MODULE: ${data.title}
FILE:   ${data.file}
DATE:   ${new Date().toISOString()}
================================

[ TECHNICAL MANIFEST ]
> ALGORITHM: AES-256-GCM
> COMPLIANCE: ISO/IEC 27001
> VERSION: v4.5.2-stable

[ CAPABILITIES ]
${data.points.join('\n')}

[ USAGE INSTRUCTION ]
Run this module via terminal using:
> scan --module ${currentModId} <target_ip>

--------------------------------
CONFIDENTIAL - DO NOT DISTRIBUTE
        `.trim();

        // Trigger Download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.file.replace('.pdf', '.txt').replace('.json', '.txt').replace('.bin', '.txt'); // Ensure text format for demo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Terminal Feedback
        handleCommand(`capture ${a.download}`);

        setTimeout(() => {
            btn.style.borderColor = "";
            btn.innerHTML = `⬇ FETCH ${data.file.split('_')[0]}_DOCS`; // Reset text
            btn.disabled = false;
        }, 3000);
    }, 1500);
};

// Start sequence on load
window.addEventListener('load', runSplashSequence);
