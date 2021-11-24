import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Clock,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

const gui = new dat.GUI();
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * SETUP: Renderer
 */
const renderer = new WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
export const domElement = renderer.domElement;

/**
 * SETUP: Camera
 */
const aspectRatio = sizes.width / sizes.height;
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 2;

/**
 * SETUP: Controls
 */
const controls = new OrbitControls(camera, domElement);
controls.enableDamping = true;

/**
 * SETUP: Scene
 */
const scene = new Scene();

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color: 0xf0f000, wireframe: false });

const mesh = new Mesh(
  geometry,
  material,
);
scene.add(mesh);

gui.add(material, "wireframe");

/**
 * ANIMATE
 */
const clock = new Clock();

export const tick = () => {
  const elapsed = clock.getElapsedTime();

  controls.update();

	renderer.render(scene, camera);
	requestAnimationFrame(tick);
}
