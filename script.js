/* ============================================================
   SAADA Sofiane // Terminal Portfolio - behaviour
   ============================================================ */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Boot sequence (typewriter) ---------- */
const bootEl = document.getElementById('boot');
const bootLines = [
    'Booting SofianeOS v2.3.0 ...',
    'Loading kernel modules ......... [ OK ]',
    'Mounting /dev/portfolio ........ [ OK ]',
    'Starting game-dev services ..... [ OK ]',
    'Welcome. Type "help" to interact.',
];

function renderBoot(text) {
    bootEl.innerHTML = text.replace(/\[ OK \]/g, '[ <span class="ok">OK</span> ]');
}

function hideBoot() {
    if (!bootEl) return;
    bootEl.classList.add('done');
    setTimeout(() => { if (bootEl) bootEl.remove(); }, 220);
}

function typeBoot(i = 0) {
    if (i >= bootLines.length) {
        revealSections();
        setTimeout(hideBoot, reduceMotion ? 0 : 250);
        return;
    }
    if (reduceMotion) {
        renderBoot(bootLines.join('\n'));
        revealSections();
        hideBoot();
        return;
    }
    const full = bootLines.slice(0, i).join('\n') + (i > 0 ? '\n' : '');
    let c = 0;
    const line = bootLines[i];
    const tick = setInterval(() => {
        c++;
        renderBoot(full + line.slice(0, c));
        if (c >= line.length) {
            clearInterval(tick);
            setTimeout(() => typeBoot(i + 1), 180);
        }
    }, 14);
}

/* ---------- Reveal sections on scroll ---------- */
function revealSections() {
    const blocks = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        blocks.forEach(b => b.classList.add('shown'));
        fillMeters();
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('shown');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    blocks.forEach(b => io.observe(b));
    // first block visible immediately
    setTimeout(fillMeters, 300);
}

/* ---------- Language meters ---------- */
function fillMeters() {
    document.querySelectorAll('.lang-meter').forEach(meter => {
        if (meter.dataset.built) return;
        meter.dataset.built = '1';
        const level = parseInt(meter.dataset.level, 10) || 0;
        for (let i = 1; i <= 5; i++) {
            const seg = document.createElement('span');
            if (i <= level) {
                if (reduceMotion) seg.classList.add('on');
                else setTimeout(() => seg.classList.add('on'), i * 120);
            }
            meter.appendChild(seg);
        }
    });
}

/* ---------- Interactive CLI ---------- */
const form = document.getElementById('cli-form');
const input = document.getElementById('cli-input');
const log = document.getElementById('cli-log');

const links = {
    github: 'https://github.com/SofianeSaada',
    linkedin: 'https://www.linkedin.com/in/sofiane-saada-304a63298/',
    email: 'mailto:s.sofiane2309@gmail.com',
};

const commands = {
    help() {
        return `Available commands:
  about      - who is Sofiane
  skills     - list skills
  projects   - jump to projects
  contact    - contact info
  github     - open GitHub profile
  linkedin   - open LinkedIn profile
  email      - send an email
  neofetch   - system info
  clear      - clear this log`;
    },
    about()    { scrollToId('about');   return 'Opening about.txt ...'; },
    skills()   { scrollToId('skills');  return 'Listing skills/ ...'; },
    projects() { scrollToId('projects');return 'Loading projects/ ...'; },
    contact()  { scrollToId('contact'); return 'Reading contact.txt ...'; },
    github()   { window.open(links.github, '_blank');   return 'Opening GitHub ...'; },
    linkedin() { window.open(links.linkedin, '_blank'); return 'Opening LinkedIn ...'; },
    email()    { window.location.href = links.email;    return 'Opening mail client ...'; },
    neofetch() {
        return `sofiane@portfolio
-----------------
OS:      SofianeOS v2.3.0
Role:    Game Developer
Engines: Unity, Unreal Engine
Langs:   C#, C++, Blender
School:  Gaming Campus
Uptime:  always learning`;
    },
    clear()    { log.innerHTML = ''; return null; },
};

function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function appendLine(text, cls) {
    const div = document.createElement('div');
    div.className = 'line ' + (cls || '');
    div.textContent = text;
    log.appendChild(div);
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const raw = input.value.trim();
        input.value = '';
        if (!raw) return;
        appendLine('sofiane@portfolio:~$ ' + raw, 'echo');
        const cmd = raw.toLowerCase().split(/\s+/)[0];
        if (cmd in commands) {
            const out = commands[cmd]();
            if (out) appendLine(out, 'res');
        } else if (cmd === 'sudo') {
            appendLine("Nice try. You don't have permission to do that. :)", 'err');
        } else if (cmd === 'ls') {
            appendLine('about.txt  skills/  projects/  contact.txt', 'res');
        } else {
            appendLine(`command not found: ${cmd}. Type "help".`, 'err');
        }
        log.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });

    // keep the input focused when clicking anywhere in the interactive area
    document.getElementById('interactive').addEventListener('click', () => input.focus());
}

/* ---------- Boot on load ---------- */
typeBoot();

/* ============================================================
   Three.js solar-system background
   ============================================================ */
(function initBackground() {
    const container = document.getElementById('solar-system');
    if (!container || typeof THREE === 'undefined') {
        // three.js loaded with `defer`; retry shortly if not ready
        if (typeof THREE === 'undefined') return void setTimeout(initBackground, 200);
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const sun = new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshPhongMaterial({ color: 0xff6600, emissive: 0xff8800, emissiveIntensity: 0.8, shininess: 30 })
    );
    scene.add(sun);
    sun.add(new THREE.Mesh(
        new THREE.SphereGeometry(2.05, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true, transparent: true, opacity: 0.6 })
    ));

    function makePlanet(r, color, emissive) {
        const p = new THREE.Mesh(
            new THREE.SphereGeometry(r, 16, 16),
            new THREE.MeshPhongMaterial({ color, emissive, emissiveIntensity: 0.3 })
        );
        p.add(new THREE.Mesh(
            new THREE.SphereGeometry(r + 0.02, 8, 8),
            new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.7 })
        ));
        scene.add(p);
        return p;
    }
    const planet1 = makePlanet(0.4, 0x4488ff, 0x2244aa);
    const planet2 = makePlanet(0.5, 0xff4444, 0xaa2222);
    const planet3 = makePlanet(0.35, 0x44ff88, 0x22aa44);

    function orbitRing(radius) {
        const points = [];
        for (let i = 0; i <= 64; i++) {
            const a = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
        }
        return new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.4 })
        );
    }
    [4, 6, 8].forEach(r => scene.add(orbitRing(r)));

    scene.add(new THREE.AmbientLight(0xffa500, 0.5));
    const point = new THREE.PointLight(0xffaa00, 2, 100);
    scene.add(point);

    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    let time = 0;
    let running = true;
    document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) animate(); });

    function animate() {
        if (!running) return;
        requestAnimationFrame(animate);
        time += 0.016;
        sun.rotation.y += 0.005;
        const s = (Math.PI * 2) / (5 / 0.016);
        planet1.position.set(Math.cos(time * s) * 4, 0, Math.sin(time * s) * 4);
        planet2.position.set(Math.cos(time * s + Math.PI * 0.66) * 6, 0, Math.sin(time * s + Math.PI * 0.66) * 6);
        planet3.position.set(Math.cos(time * s + Math.PI * 1.33) * 8, 0, Math.sin(time * s + Math.PI * 1.33) * 8);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
