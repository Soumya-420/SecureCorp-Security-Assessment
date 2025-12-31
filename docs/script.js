// Matrix Rain Effect (Background)
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) { drops[i] = 1; }

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
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });


// === UI NAVIGATION LOGIC ===
function showSection(sectionId) {
    // Hide all main sections
    ['hero', 'scanInput', 'database', 'modules', 'terminal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // Show requested
    const target = document.getElementById(sectionId);
    if (target) target.classList.remove('hidden');
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
    showSection('hero');
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
document.getElementById('scanForm').addEventListener('submit', function (e) {
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

    // Add to DB
    const record = db.add({ target: target, type: type, modules: modules });

    alert(`ASSESSMENT INITIATED: ${record.id}\nTarget: ${target}\nModules: ${modules.join(', ')}`);

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

// === TERMINAL ANIMATION ===
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

async function typeText(text, element) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    element.appendChild(line);

    for (let i = 0; i < text.length; i++) {
        line.textContent += text.charAt(i);
        await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
    }
}

async function runTerminalSequence() {
    const output = document.getElementById('terminalOutput');
    if (!output) return;

    output.innerHTML = '';

    for (const log of terminalLogs) {
        await typeText(log, output);
        await new Promise(r => setTimeout(r, 300));
        output.scrollTop = output.scrollHeight;
    }
}

// Start animation when page loads
window.addEventListener('load', runTerminalSequence);
