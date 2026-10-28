import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a1a)

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100)
camera.position.set(3, 2, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

const control = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const directionalLight1 = new THREE.DirectionalLight(0x00ffff, 3.0)
directionalLight1.position.set(5, 5, 5)
scene.add(directionalLight1)

const directionalLight2 = new THREE.DirectionalLight(0xff00ff, 2.0)
directionalLight2.position.set(-5, -5, -5)
scene.add(directionalLight2)

const positions = new Float32Array([
     0.0,  2.0,  0.0,
     1.0,  1.0,  0.0,
     0.5,  1.0,  0.87,
    -0.5,  1.0,  0.87,
    -1.0,  1.0,  0.0,
    -0.5,  1.0, -0.87,
     0.5,  1.0, -0.87,

     1.0, -1.0,  0.0,
     0.5, -1.0,  0.87,
    -0.5, -1.0,  0.87,
    -1.0, -1.0,  0.0,
    -0.5, -1.0, -0.87,
     0.5, -1.0, -0.87,

     0.0, -2.0,  0.0
]);

const index = [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5,
    0, 5, 6,
    0, 6, 1,

    1, 7, 8,    1, 8, 2,
    2, 8, 9,    2, 9, 3,
    3, 9, 10,   3, 10, 4,
    4, 10, 11,  4, 11, 5,
    5, 11, 12,  5, 12, 6,
    6, 12, 7,   6, 7, 1,

    13, 8, 7,
    13, 9, 8,
    13, 10, 9,
    13, 11, 10,
    13, 12, 11,
    13, 7, 12
];

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setIndex(index);
geometry.computeVertexNormals();

const material = new THREE.MeshPhysicalMaterial({ 
    color: 0x88ccff, 
    roughness: 0.1, 
    metalness: 0.1,
    transmission: 0.6,
    thickness: 1.2,
    wireframe: false 
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

console.log('Crystal Vertices count: ', geometry.attributes.position.count);
console.log('Crystal Faces count: ', index.length / 3);

window.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        material.wireframe = !material.wireframe;
        console.log('Wireframe mode:', material.wireframe);
    }
});

function animate() {
    requestAnimationFrame(animate)
    control.update()
    mesh.rotation.y += 0.005;
    mesh.rotation.x += 0.002;
    renderer.render(scene, camera)
}
animate()

window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});