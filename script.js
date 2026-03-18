// Page navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageName).classList.add('active');
    
    // Add active class to clicked button
    event.currentTarget.classList.add('active');
}

// Three.js Solar System
const container = document.getElementById('solar-system');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Create sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshPhongMaterial({
    color: 0xff6600,
    emissive: 0xff8800,
    emissiveIntensity: 0.8,
    shininess: 30
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Sun wireframe
const sunWireframeGeometry = new THREE.SphereGeometry(2.05, 16, 16);
const sunWireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    wireframe: true,
    transparent: true,
    opacity: 0.6
});
const sunWireframe = new THREE.Mesh(sunWireframeGeometry, sunWireframeMaterial);
sun.add(sunWireframe);

// Create planet 1
const planet1Geometry = new THREE.SphereGeometry(0.4, 16, 16);
const planet1Material = new THREE.MeshPhongMaterial({
    color: 0x4488ff,
    emissive: 0x2244aa,
    emissiveIntensity: 0.3
});
const planet1 = new THREE.Mesh(planet1Geometry, planet1Material);
scene.add(planet1);

const p1WireframeGeo = new THREE.SphereGeometry(0.42, 8, 8);
const p1WireframeMat = new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    wireframe: true,
    transparent: true,
    opacity: 0.7
});
const p1Wireframe = new THREE.Mesh(p1WireframeGeo, p1WireframeMat);
planet1.add(p1Wireframe);

// Create planet 2
const planet2Geometry = new THREE.SphereGeometry(0.5, 16, 16);
const planet2Material = new THREE.MeshPhongMaterial({
    color: 0xff4444,
    emissive: 0xaa2222,
    emissiveIntensity: 0.3
});
const planet2 = new THREE.Mesh(planet2Geometry, planet2Material);
scene.add(planet2);

const p2WireframeGeo = new THREE.SphereGeometry(0.52, 8, 8);
const p2WireframeMat = new THREE.MeshBasicMaterial({
    color: 0xff8888,
    wireframe: true,
    transparent: true,
    opacity: 0.7
});
const p2Wireframe = new THREE.Mesh(p2WireframeGeo, p2WireframeMat);
planet2.add(p2Wireframe);

// Create planet 3
const planet3Geometry = new THREE.SphereGeometry(0.35, 16, 16);
const planet3Material = new THREE.MeshPhongMaterial({
    color: 0x44ff88,
    emissive: 0x22aa44,
    emissiveIntensity: 0.3
});
const planet3 = new THREE.Mesh(planet3Geometry, planet3Material);
scene.add(planet3);

const p3WireframeGeo = new THREE.SphereGeometry(0.37, 8, 8);
const p3WireframeMat = new THREE.MeshBasicMaterial({
    color: 0x88ffaa,
    wireframe: true,
    transparent: true,
    opacity: 0.7
});
const p3Wireframe = new THREE.Mesh(p3WireframeGeo, p3WireframeMat);
planet3.add(p3Wireframe);

// Create orbit rings
function createOrbitRing(radius) {
    const points = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        ));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0xff8800,
        transparent: true,
        opacity: 0.4
    });
    return new THREE.Line(geometry, material);
}

scene.add(createOrbitRing(4));
scene.add(createOrbitRing(6));
scene.add(createOrbitRing(8));

// Create orbit grid lines
function createOrbitGrid(radius) {
    const segments = 8;
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            )
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xff8800,
            transparent: true,
            opacity: 0.15
        });
        scene.add(new THREE.Line(geometry, material));
    }
}

createOrbitGrid(4);
createOrbitGrid(6);
createOrbitGrid(8);

// Lights
const ambientLight = new THREE.AmbientLight(0xffa500, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffaa00, 2, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

// Animation
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    
    time += 0.016;
    
    sun.rotation.y += 0.005;
    
    const orbit1Speed = (Math.PI * 2) / (5 / 0.016);
    planet1.position.x = Math.cos(time * orbit1Speed) * 4;
    planet1.position.z = Math.sin(time * orbit1Speed) * 4;
    planet1.rotation.y += 0.02;
    
    const orbit2Speed = (Math.PI * 2) / (5 / 0.016);
    planet2.position.x = Math.cos(time * orbit2Speed + Math.PI * 0.66) * 6;
    planet2.position.z = Math.sin(time * orbit2Speed + Math.PI * 0.66) * 6;
    planet2.rotation.y += 0.015;
    
    const orbit3Speed = (Math.PI * 2) / (5 / 0.016);
    planet3.position.x = Math.cos(time * orbit3Speed + Math.PI * 1.33) * 8;
    planet3.position.z = Math.sin(time * orbit3Speed + Math.PI * 1.33) * 8;
    planet3.rotation.y += 0.025;
    
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});