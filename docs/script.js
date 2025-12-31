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

// === AUTHENTICATION LOGIC ===
let isAuthenticated = false;

function authCheck() {
    if (isAuthenticated) {
        showSection('database');
        renderDB();
    } else {
        document.getElementById('authModal').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('authModal').style.display = 'none';
}

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Mock Auth Check
    if (user === 'admin' && pass === 'secure') {
        isAuthenticated = true;
        document.getElementById('dbLink').innerHTML = 'DATABASE 🔓';
        document.getElementById('dbLink').classList.remove('locked');
        document.getElementById('dbLink').style.color = '#00ff41'; // Green unlock
        closeModal();
        showSection('database');
        renderDB();
    } else {
        const msg = document.getElementById('loginMsg');
        msg.textContent = 'ACCESS DENIED: Invalid Credentials';
        msg.classList.add('blink');
    }
});

function logout() {
    isAuthenticated = false;
    document.getElementById('dbLink').innerHTML = 'DATABASE 🔒';
    document.getElementById('dbLink').classList.add('locked');
    document.getElementById('dbLink').style.color = '';
    showSection('hero');
}


// === DATABASE RENDERING ===
window.renderDB = function () {
    const tbody = document.getElementById('dbBody');
    tbody.innerHTML = '';
    const records = db.getAll();

    records.sort((a, b) => new Date(b.time) - new Date(a.time)); // Newest first

    records.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color: #8b949e">${row.id}</td>
            <td>${row.time}</td>
            <td style="color: #fff">${row.target}</td>
            <td>${row.type}</td>
            <td class="${row.status === 'CRITICAL' ? 'error' : 'success'}">${row.status}</td>
            <td>${row.findings || '---'}</td>
        `;
        tbody.appendChild(tr);
    });
};


// === SCAN FORM HANDLING ===
document.getElementById('scanForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const target = document.getElementById('targetInput').value;
    const type = document.getElementById('scanType').value;

    // Add to DB
    const record = db.add({ target: target, type: type, findings: 'Scanning...' });

    // Feedback
    alert(`ASSESSMENT INITIATED: ${record.id}\nTarget: ${target}\n\nResults will be saved to the secure database.`);

    // Reset and redirect if auth
    e.target.reset();
    if (isAuthenticated) {
        showSection('database');
        renderDB();
    } else {
        showSection('hero');
    }
});

// Init
// Load database script dynamically if not present (simple hack for single file edit)
if (typeof SecurityDB === 'undefined') {
    const script = document.createElement('script');
    script.src = 'database.js';
    document.head.appendChild(script);
}

