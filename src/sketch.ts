import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Clock,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  PlaneGeometry,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  PointLight,
  RectAreaLight,
  Vector3,
  SpotLight,
  SpotLightHelper,
  Vector2,
  CameraHelper,
  PCFSoftShadowMap,
  TextureLoader,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import bakedShadowURI from "./textures/bakedShadow.jpg";
import simpleShadowURI from "./textures/simpleShadow.jpg";

const textureLoader = new TextureLoader();
// const bakedShadow = textureLoader.load(bakedShadowURI);
const simpleShadow = textureLoader.load(simpleShadowURI);

/**
 * INIT GUI
 */
const gui = new dat.GUI();

/**
 * SIZE HANDLING
 */
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
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = PCFSoftShadowMap;
export const domElement = renderer.domElement;

/**
 * SETUP: Camera
 */
const aspectRatio = sizes.width / sizes.height;
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.z = 3.5;
camera.position.y = 1;

/**
 * SETUP: Controls
 */
const controls = new OrbitControls(camera, domElement);
controls.enableDamping = true;

/**
 * SETUP: Scene
 */
const scene = new Scene();

const material = new MeshStandardMaterial();
material.roughness = 0.4;

const sphere = new Mesh(
  new SphereGeometry(0.5, 32, 32),
  material,
);
// sphere.position.x = -1.5;
sphere.castShadow = true;
sphere.receiveShadow = true;

// const cube = new Mesh(
//   new BoxGeometry(0.75, 0.75, 0.75),
//   material,
// );
// cube.castShadow = true;
// cube.receiveShadow = true;

// const torus = new Mesh(
//   new TorusGeometry(0.3, 0.2, 32, 64),
//   material,
// )
// torus.position.x = 1.5;
// torus.castShadow = true;
// torus.receiveShadow = true;

const floor = new Mesh(
  new PlaneGeometry(6, 6),
  material,
  // new MeshBasicMaterial({
  //   map: bakedShadow,
  // }),
)
floor.position.y = -0.5;
floor.rotation.x = Math.PI * - 0.5;
floor.receiveShadow = true;

const sphereShadow = new Mesh(
  new PlaneGeometry(1.5, 1.5),
  new MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  }),
);
sphereShadow.rotation.x = Math.PI * -0.5;
sphereShadow.position.y = floor.position.y + 0.01;

scene.add(
  sphere,
  // cube,
  // torus,
  floor,
  sphereShadow,
);

/**
 * LIGHTS
 */
const ambientLight = new AmbientLight(0xffffff, 0.4);

scene.add(ambientLight);

gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);

const directionalLight = new DirectionalLight(0x00fffc, 0.3);
directionalLight.position.set(3, 0.25, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.top = 1.5;
directionalLight.shadow.camera.bottom = -1.5;
directionalLight.shadow.camera.right = 1.5;
directionalLight.shadow.camera.left = -1.5;
// directionalLight.shadow.radius = 10;
// const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);

scene.add(directionalLight);

const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, 0.3);

scene.add(hemisphereLight);

const pointLight = new PointLight(0xff9000, 0.7, 4, 2);
pointLight.position.set(1, 0.5, 1);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

// const pointLightShadowCameraHelper = new CameraHelper(pointLight.shadow.camera);

// scene.add(pointLightShadowCameraHelper);
scene.add(pointLight);

const rectAreaLight = new RectAreaLight(0x4e00ff, 5, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new Vector3());

scene.add(rectAreaLight);

const spotLight = new SpotLight(0x78ff00, 0.3, 7, Math.PI * 0.1, 0.5, 1);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -0.83;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.shadow.camera.fov = 30;
// const spotLightShadowCameraHelper = new CameraHelper(spotLight.shadow.camera);

scene.add(spotLight);
scene.add(spotLight.target);
// scene.add(spotLightShadowCameraHelper);

gui.add(spotLight.target.position, "x").min(-3).max(3).step(0.01);
gui.add(spotLight, "angle").min(0).max(Math.PI * 0.5).step(Math.PI * 0.01);

// const spotLightHelper = new SpotLightHelper(spotLight);
// scene.add(spotLightHelper);


/**
 * ANIMATE
 */
const clock = new Clock();

export const tick = () => {
  const elapsed = clock.getElapsedTime();

  controls.update();

  sphere.position.x = Math.cos(elapsed) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsed * 3));
  sphere.position.z = Math.sin(elapsed) * 1.5;

  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

  // spotLightHelper.update();

  // const xRotation = elapsed * 0.1;
  // sphere.rotation.x = xRotation;
  // cube.rotation.x = xRotation;
  // torus.rotation.x = xRotation;

  // const yRotation = elapsed * 0.15;
  // sphere.rotation.y = yRotation;
  // cube.rotation.y = yRotation;
  // torus.rotation.y = yRotation;

	renderer.render(scene, camera);
	requestAnimationFrame(tick);
}
