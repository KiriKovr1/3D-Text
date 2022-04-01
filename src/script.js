import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const parametrs = {
    color: '#e6b4f9'
}

gui.addColor(parametrs, 'color').onChange((event) => {
    scene.background = new THREE.Color(event)
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(parametrs.color)

// Axes

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 *  Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/font/helvetiker_regular.typeface.json',
    (loadedFont) => {
        const textGeometry = new TextGeometry(
            'KiriKovr',
            {
                font: loadedFont,
                size: 0.5,
                height: 0.2,
                curveSegments: 20,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 100,
            }
        )
        textGeometry.computeBoundingBox()
        textGeometry.translate(
            (- textGeometry.boundingBox.max.x - 0.2) * 0.5,
            (- textGeometry.boundingBox.max.y - 0.2) * 0.5,
            (- textGeometry.boundingBox.max.z - 0.3) * 0.5,
        )
        const material = new THREE.MeshNormalMaterial()
        const text = new THREE.Mesh(textGeometry, material)

        const torusGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

        for (let i = 0; i < 200; i++) {
            const torus = new THREE.Mesh(torusGeometry, material)

            torus.position.x = (Math.random() - 0.5) * 10
            torus.position.y = (Math.random() - 0.5) * 10
            torus.position.z = (Math.random() - 0.5) * 10

            torus.rotation.x = Math.random() * Math.PI
            torus.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            torus.scale.x = scale
            torus.scale.y = scale
            torus.scale.z = scale

            scene.add(text, torus)

        }
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const axes = new THREE.AxesHelper(1, 1, 1)


window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if(!fullscreenElement){
        if (canvas.requestFullscreen){
            canvas.requestFullscreen()
        } else if(canvas.webkitRequestFullScreen){
            canvas.webkitRequestFullScreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen){
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()