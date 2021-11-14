import { Scene, PerspectiveCamera, WebGLRenderer, TorusKnotGeometry, MeshNormalMaterial, Mesh } from "three";

/**
 * SETUP: Renderer
 */
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
export const domElement = renderer.domElement;

/**
 * SETUP: Camera
 */
const camera = new PerspectiveCamera(
  75, // FOV (degrees)
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near clipping plane
  1000 // far clipping plane
);
camera.position.z = 5;

/**
 * SETUP: Scene
 */
const scene = new Scene();
const geometry = new TorusKnotGeometry();
const material = new MeshNormalMaterial();
const shape = new Mesh(geometry, material);
scene.add(shape);

/**
 * ANIMATE
 */
export function animate() {
	requestAnimationFrame(animate);
  shape.rotation.x += 0.01;
  shape.rotation.y += 0.01;
	renderer.render(scene, camera);
}
