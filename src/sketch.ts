import {
  Scene,
  PerspectiveCamera,
  // OrthographicCamera,
  WebGLRenderer,
  // BoxGeometry,
  // MeshBasicMaterial,
  // AxesHelper,
  // MeshNormalMaterial,
  Mesh,
  // Clock,
  // BufferAttribute,
  // BufferGeometry,
  TextureLoader,
  LoadingManager,
  // RepeatWrapping,
  // MirroredRepeatWrapping,
  // NearestFilter,
  // SphereGeometry,
  TorusGeometry,
  // PlaneGeometry,
  // DoubleSide,
  MeshMatcapMaterial,
  // MeshDepthMaterial,
  // AmbientLight,
  // PointLight,
  // MeshLambertMaterial,
  // MeshPhongMaterial,
  // Color,
  // MeshToonMaterial,
  // NearestFilter,
  // MeshStandardMaterial,
  // CubeTextureLoader,
  Vector3,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import gsap from "gsap";
// import * as dat from "lil-gui";
// import doorColor from "./textures/door/color.jpg";
// import doorAlpha from "./textures/door/alpha.jpg";
// import doorHeight from "./textures/door/height.jpg";
// import doorNormal from "./textures/door/normal.jpg";
// import doorAmbientOcclusion from "./textures/door/ambientOcclusion.jpg";
// import doorMetalness from "./textures/door/metalness.jpg";
// import doorRoughness from "./textures/door/roughness.jpg";
// import gradient from "./textures/gradients/3.jpg";
import matcap from "./textures/matcaps/9.png";
// import nx from "./textures/environmentMaps/0/nx.jpg";
// import ny from "./textures/environmentMaps/0/ny.jpg";
// import nz from "./textures/environmentMaps/0/nz.jpg";
// import px from "./textures/environmentMaps/0/px.jpg";
// import py from "./textures/environmentMaps/0/py.jpg";
// import pz from "./textures/environmentMaps/0/pz.jpg";
// import { map } from "./util/map";

// const gui = new dat.GUI();

/**
 * Textures
 */
const loadingManager = new LoadingManager();
// loadingManager.onStart = () => console.log("onStart");
// loadingManager.onLoad = () => console.log("onLoad");
// loadingManager.onProgress = () => console.log("onProgress");
// loadingManager.onError = () => console.log("onError");
const textureLoader = new TextureLoader(loadingManager);
// const colorTexture = textureLoader.load(doorColor);
// const alphaTexture = textureLoader.load(doorAlpha);
// const heightTexture = textureLoader.load(doorHeight);
// const normalTexture = textureLoader.load(doorNormal);
// const ambientOcclusionTexture = textureLoader.load(doorAmbientOcclusion);
// const metalnessTexture = textureLoader.load(doorMetalness);
// const roughnessTexture = textureLoader.load(doorRoughness);
// const gradientTexture = textureLoader.load(gradient);
const matcapTexture = textureLoader.load(matcap);

// const cubeTextureLoader = new CubeTextureLoader();
// const environmentMapTexture = cubeTextureLoader.load([
//   px, nx, py, ny, pz, nz,
// ]);

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = MirroredRepeatWrapping;
// colorTexture.wrapT = RepeatWrapping;

// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;
// colorTexture.rotation = Math.PI * 0.25;

// colorTexture.generateMipmaps = false; // if minFilter is NearestFilter, we don't need mipmaps
// colorTexture.minFilter = NearestFilter;
// colorTexture.magFilter = NearestFilter;

/**
 * Fonts
 */
const donuts: Mesh<TorusGeometry, MeshMatcapMaterial>[] = [];
const fontLoader = new FontLoader();
fontLoader.load(
  "/fonts/gb-8x16.json",
  (font) => {
    const textGeometry = new TextGeometry(
      "The World \nIs a Fuck!",
      {
        font,
        size: 0.5,
        height: 0.1,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 2,
      }
    );
    // textGeometry.computeBoundingBox();
    textGeometry.center();
    const material = new MeshMatcapMaterial();
    material.matcap = matcapTexture;
    // material.wireframe = true;
    const text = new Mesh(textGeometry, material);
    scene.add(text);

    const donutGeometry = new TorusGeometry(0.3, 0.2, 20, 45)
    for (let i=0; i < 100; i++) {
      const donut = new Mesh(donutGeometry, material);
      const randomVector = new Vector3().randomDirection().multiplyScalar(Math.random() * 7 + 3);
      donut.position.set(randomVector.x, randomVector.y, randomVector.z);
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      donut.scale.set(scale,scale,scale);
      donuts.push(donut);
    }

    scene.add(...donuts);
  }
);

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

// const cursor = {
//   x: 0,
//   y: 0,
// };
// window.addEventListener("mousemove", (e) => {
//   cursor.x = e.clientX / sizes.width - 0.5;
//   cursor.y = -(e.clientY / sizes.height - 0.5);
// })

// window.addEventListener("dblclick", () => {
//   if (!document.fullscreenElement) {
//     domElement.requestFullscreen();
//   } else {
//     document.exitFullscreen();
//   }
// });

/**
 * SETUP: Renderer
 */
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
export const domElement = renderer.domElement;

/**
 * SETUP: Camera
 */
const aspectRatio = sizes.width / sizes.height;
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
// const camera = new OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
camera.position.z = 2;
// camera.position.y = 2;
// camera.position.x = 2;

/**
 * SETUP: Controls
 */
const controls = new OrbitControls(camera, domElement);
controls.enableDamping = true;

/**
 * SETUP: Scene
 */
const scene = new Scene();

// const count = 540;
// const positionsArray = new Float32Array(count * 3 * 3);
// for (let i=0; i < count * 3 * 3; i++) {
//   positionsArray[i] = Math.random() - 0.5;
// }
// const positionsAttribute = new BufferAttribute(positionsArray, 3);
// const geometry = new BufferGeometry();
// geometry.setAttribute("position", positionsAttribute);

// const geometry = new BoxGeometry(1, 1, 1);
// const material = new MeshBasicMaterial({ color: 0xf0f000, wireframe: false });

// const mesh = new Mesh(
//   geometry,
//   material,
// );
// scene.add(mesh);

// gui.add(material, "wireframe");
// const parameters = {
//   spin: () => {
//     gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 0.5 })
//   },
// }

// const material = new MeshBasicMaterial();
// material.map = colorTexture;
// material.transparent = true;
// material.alphaMap = alphaTexture;
// material.side = DoubleSide;

// const material = new MeshNormalMaterial();
// material.flatShading = false;

// const material = new MeshMatcapMaterial();
// material.matcap = matcapTexture;
// gui.add(material, "flatShading");
// gui.onChange(() => {
//   material.needsUpdate = true;
// })

// const material = new MeshDepthMaterial();

// const material = new MeshLambertMaterial();

// const material = new MeshPhongMaterial();
// material.shininess = 100;
// gui.add(material, "shininess");
// material.specular = new Color(0x00ff00);

// gradientTexture.minFilter = NearestFilter;
// gradientTexture.magFilter = NearestFilter;
// gradientTexture.generateMipmaps = false;
// const material = new MeshToonMaterial();
// material.gradientMap = gradientTexture;

// const material = new MeshStandardMaterial();
// material.metalness = 0.7;
// material.roughness = 0.2;
// material.envMap = environmentMapTexture;
// material.roughnessMap = roughnessTexture;
// material.metalnessMap = metalnessTexture;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.wireframe = false;
// material.displacementScale = 0.05;
// material.normalMap = normalTexture;
// material.alphaMap = alphaTexture;
// material.transparent = true;
// material.side = DoubleSide;

// gui.add(material, "wireframe");
// gui.add(material, "roughness").min(0).max(1).step(0.001);
// gui.add(material, "metalness").min(0).max(1).step(0.001);
// gui.add(material, "aoMapIntensity").min(0).max(2).step(0.0001);
// gui.add(material, "displacementScale").min(0).max(1).step(0.0001);

// const sphere = new Mesh(
//   new SphereGeometry(0.5, 64, 64),
//   material,
// );
// sphere.position.x = -1.5
// const plane = new Mesh(
//   new PlaneGeometry(1, 1, 100, 100),
//   material,
// );
// const torus = new Mesh(
//   new TorusGeometry(0.3, 0.2, 64, 128),
//   material,
// );
// torus.position.x = 1.5;

// sphere.geometry.setAttribute("uv2", new BufferAttribute(sphere.geometry.attributes.uv.array, 2));
// plane.geometry.setAttribute("uv2", new BufferAttribute(plane.geometry.attributes.uv.array, 2));
// torus.geometry.setAttribute("uv2", new BufferAttribute(torus.geometry.attributes.uv.array, 2));

// scene.add(sphere, plane, torus);

// const ambientLight = new AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const pointLight = new PointLight(0xffffff, 0.5);
// pointLight.position.set(2, 3, 4);
// scene.add(pointLight);




/**
 * Debug
 */
// const axesHelper = new AxesHelper(3);
// scene.add(axesHelper);


// gui.add(mesh.position, "y")
//   .min(-3)
//   .max(3)
//   .step(0.01)
//   .name("elevation");

// gui.add(material, "wireframe");
// gui.addColor(material, "color");

// gui.add(parameters, "spin");

/**
 * ANIMATE
 */
// const clock = new Clock();

export const tick = () => {
  // const elapsed = clock.getElapsedTime();

  controls.update();

  // cube.rotation.y = elapsed;
  // camera.position.y = cursor.y * 3;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  // camera.lookAt(cube.position);

  // sphere.rotation.y = 0.1 * elapsed;
  // plane.rotation.y = -0.1 * elapsed;
  // torus.rotation.y = 0.1 * elapsed;

  // sphere.rotation.x = 0.15 * elapsed;
  // plane.rotation.x = -0.15 * elapsed;
  // torus.rotation.x = 0.15 * elapsed;

  // donuts.forEach((donut) => {
  //   donut.position.y += donut.position.y > 10 ? -20 : ((1.1 - donut.scale.x ** 3) * 0.03);
  //   donut.rotation.x += 0.01;
  // })

	renderer.render(scene, camera);
	requestAnimationFrame(tick);
}
