import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#webGl');
const boxes = [];

// settings
const width = canvas.clientWidth;
const height = canvas.clientHeight;
const columns = 20;
const rows = 10;

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();

// カメラ設定
const dist = 11.521; //職人技によるカメラの距離,何故この数値になるのかは不明
const camera = new THREE.PerspectiveCamera(
  75,
  width / height,
  0.1,
  dist * 1000
);
camera.position.set(0, 0, dist);

// レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(width, height);
renderer.setPixelRatio(devicePixelRatio);

const boxGeometry = new THREE.BoxGeometry(1, 1, 10);
for (let i = 0; i < rows * columns; i++) {
  const num = ('000' + (i + 1)).slice(-3);
  const material = [
    new THREE.MeshBasicMaterial({
      map: loader.load('./assets/images/hero_pieces/000.jpg'),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load('./assets/images/hero_pieces/000.jpg'),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load('./assets/images/hero_pieces/000.jpg'),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load('./assets/images/hero_pieces/000.jpg'),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load(`./assets/images/hero_pieces/${num}.jpg`),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load('./assets/images/hero_pieces/000.jpg'),
    }),
  ];
  boxes[i] = new THREE.Mesh(boxGeometry, material);
}
let i = 0;
for (let y = rows; y > 0; y--) {
  for (let x = 0; x < columns; x++) {
    boxes[i].position.set(x - (columns - 1) / 2, y - (rows + 1) / 2, 0);
    scene.add(boxes[i]);
    i++;
  }
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// sinカーブでZ軸を波立たせる
const effectType = [
  'blockWave',
  'flagWave',
  'mosaicWave',
  'rowWave',
  'columnWave',
  'noWave',
];
let count = 1;
const effectFuncs = {
  blockWave(elapsedTime) {
    this.zoomOut(1);
    for (let i = 0; i < count; i++) {
      boxes[i].position.z = Math.sin(elapsedTime - i);
    }
    count = count < columns * rows ? (count = count + 1) : columns * rows;
  },
  flagWave(elapsedTime) {
    this.zoomOut(1);
    for (let i = 0; i < count; i++) {
      boxes[i].position.z = Math.sin(elapsedTime + i * 6);
    }
    count = count < columns * rows ? (count = count + 1) : columns * rows;
  },
  mosaicWave(elapsedTime) {
    this.zoomOut(1);
    for (let i = 0; i < count; i++) {
      boxes[i].position.z = Math.sin(elapsedTime + i * 3);
    }
    count = count < columns * rows ? (count = count + 1) : columns * rows;
  },
  rowWave(elapsedTime) {
    this.zoomOut(1);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        boxes[j + columns * i].position.z = Math.sin(elapsedTime - i);
      }
    }
  },
  columnWave(elapsedTime) {
    this.zoomOut(1);
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        boxes[i + columns * j].position.z = Math.sin(elapsedTime - i);
      }
    }
  },
  zoomOut(z) {
    camera.position.z =
      camera.position.z < dist + z ? (camera.position.z += 0.05) : dist + z;
  },
  zoomIn() {
    camera.position.z > dist ? (camera.position.z -= 0.05) : dist;
  },
  noWave() {
    this.zoomIn();
    for (let i = 0; i < columns * rows; i++) {
      boxes[i].position.z = boxes[i].position.z * 0.97;
    }
  },
};

// 10秒ごとにエフェクトを変更
const noWaveNum = effectType.length - 1;
let select = noWaveNum;
setInterval(() => {
  count = 1;
  select =
    select === noWaveNum ? Math.floor(Math.random() * noWaveNum) : noWaveNum;
}, 10000);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  effectFuncs[effectType[select]](elapsedTime);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

//ブラウザのリサイズ対応
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

tick();
