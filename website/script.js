// Matrix Rain Effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Terminal Typing Effect
const terminalOutput = document.getElementById('terminalOutput');
const commands = [
    { text: "Initializing SecureCorp Assessment Framework...", delay: 500, class: "info" },
    { text: "Loading modules: Reconnaissance, VulnScan, Exploitation...", delay: 1500, class: "info" },
    { text: "[+] Network Interface: eth0 (UP)", delay: 2500, class: "success" },
    { text: "root@securecorp:~$ run assessment --target=all", delay: 3500, class: "cmd" },
    { text: "Scanning target infrastructure...", delay: 4500, class: "info" },
    { text: "[!] VULNERABILITY DETECTED: Critical SQL Injection in /login.php", delay: 6000, class: "error" },
    { text: "[!] VULNERABILITY DETECTED: Outdated Apache Server", delay: 6500, class: "error" },
    { text: "Generating Report... [====================] 100%", delay: 8000, class: "success" },
    { text: "Analysis Complete. System Ready.", delay: 9000, class: "info" }
];

function typeWriter(text, element, className) {
    const line = document.createElement('div');
    line.className = 'line ' + className;
    element.appendChild(line);
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            line.textContent += text.charAt(i);
            element.scrollTop = element.scrollHeight;
            i++;
        } else {
            clearInterval(interval);
        }
    }, 30);
}

let currentTime = 0;
commands.forEach(cmd => {
    setTimeout(() => {
        typeWriter(cmd.text, terminalOutput, cmd.class);
    }, currentTime + cmd.delay);
});

// CSS Injection for dynamic styling
const style = document.createElement('style');
style.innerHTML = `
    .line { margin-bottom: 5px; }
    .success { color: #27c93f; }
    .error { color: #ff5f56; }
    .cmd { color: #f2f2f2; font-weight: bold; }
    .cmd::before { content: "> "; color: #00ff41; }
`;
document.head.appendChild(style);
