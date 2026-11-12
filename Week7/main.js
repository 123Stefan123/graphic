import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x222222) 

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 5, 9)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)

const control = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.GridHelper(20, 20))

scene.add(new THREE.AmbientLight(0xffffff, 0.5))
const sun = new THREE.DirectionalLight(0xffffff, 2.5)
sun.position.set(4, 6, 5)
scene.add(sun)

const pickables = [];

// TODO 1
const geometries = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.6, 32, 16),
    new THREE.ConeGeometry(0.6, 1.2, 32),
    new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    new THREE.TorusGeometry(0.4, 0.15, 16, 100)
];

const colors = [0xFF5733, 0x33FF57, 0x3357FF, 0xF333FF, 0xFFF333];

for (let i = 0; i < geometries.length; i++) {
    const material = new THREE.MeshStandardMaterial({ color: colors[i] })
    const mesh = new THREE.Mesh(geometries[i], material)

 
    mesh.position.set(-6 + i * 3, 0.6, 0)
    

    if (i === 0) mesh.scale.set(1.2, 1.5, 1.2);

    scene.add(mesh)
    pickables.push(mesh)
}

const pointer = new THREE.Vector2()

function updatePointers(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const px = event.clientX - rect.left
    const py = event.clientY - rect.top

    const W = rect.width
    const H = rect.height

    pointer.x = (2 * px) / W - 1
    pointer.y = 1 - (2 * py) / H
}

let selected = null;
let dragging = false;
const rayCaster = new THREE.Raycaster()

renderer.domElement.addEventListener('pointerdown', (event) => {
    updatePointers(event)
    rayCaster.setFromCamera(pointer, camera)
    const hits = rayCaster.intersectObjects(pickables)
    

    if (selected) {
        selected.material.emissive.setHex(0x000000)
    }
    selected = hits.length > 0 ? hits[0].object : null;
    

    if (selected) {
        selected.material.emissive.setHex(0x882200)
        dragging = true
        control.enabled = false
    }
})

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const intersection = new THREE.Vector3()

renderer.domElement.addEventListener('pointermove', (event) => {
    if (!dragging) {
        return
    }
    updatePointers(event)
    rayCaster.setFromCamera(pointer, camera)
    if (rayCaster.ray.intersectPlane(plane, intersection)) {
        selected.position.x = intersection.x
        selected.position.z = intersection.z
    }
})

renderer.domElement.addEventListener('pointerup', (event) => {
    dragging = false;
    control.enabled = true
})

// TODO 2: 
const initialStates = pickables.map((obj) => ({
    position: obj.position.clone(),
    scale: obj.scale.clone()
}));

const guiState = {
    bgColor: '#222222',
    reset() {
        for (let i = 0; i < pickables.length; i++) {
            pickables[i].position.copy(initialStates[i].position)
            pickables[i].scale.copy(initialStates[i].scale)
        }
    }
};

const gui = new GUI()

// TODO 2: 
gui.add(guiState, 'reset').name('Reset All Objects')

// TODO 3: 
gui.addColor(guiState, 'bgColor').name('Background Color').onChange((value) => {
    scene.background.set(value);
});

function animate() {
    requestAnimationFrame(animate)
    control.update()
    renderer.render(scene, camera)
}
animate()