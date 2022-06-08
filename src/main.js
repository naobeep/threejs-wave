import './style.css';
import * as THREE from 'three';

const canvas = document.querySelector('#webGl');
const h2 = document.querySelector('#h2');
const dummyTexture = './assets/images/hero_pieces/000.jpg';
const boxes = [];
const mag = 1;
let resistor = mag;
let interval = 3000;
let select = 'calmDown';

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

// テクスチャ設定
const boxGeometry = new THREE.BoxGeometry(1, 1, 10);
for (let i = 0; i < rows * columns; i++) {
  const num = ('000' + (i + 1)).slice(-3);
  const material = [
    new THREE.MeshBasicMaterial({
      map: loader.load(dummyTexture),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load(dummyTexture),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load(dummyTexture),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load(dummyTexture),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load(`./assets/images/hero_pieces/${num}.jpg`),
    }),
    new THREE.MeshBasicMaterial({
      map: loader.load(dummyTexture),
    }),
  ];
  boxes[i] = new THREE.Mesh(boxGeometry, material);
}

// ボックスを格子状に敷き詰める処理
let i = 0;
for (let y = rows; y > 0; y--) {
  for (let x = 0; x < columns; x++) {
    boxes[i].position.set(x - (columns - 1) / 2, y - (rows + 1) / 2, 0);
    scene.add(boxes[i]);
    i++;
  }
}

// 光源設定
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// zoom設定
const zoom = {
  reset() {
    camera.position.z > dist ? (camera.position.z -= 0.05) : dist;
  },
  out(z) {
    camera.position.z =
      camera.position.z < dist + z ? (camera.position.z += 0.05) : dist + z;
  },
};

// effectオブジェクト
const effectFuncs = {
  defaultWave(elapsedTime) {
    zoom.out(1);
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].position.z = Math.sin(elapsedTime - i) * (mag - resistor);
    }
  },
  checkWave(elapsedTime) {
    zoom.out(1);
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].position.z = Math.sin(elapsedTime + i * 3) * (mag - resistor);
    }
  },
  shredderWave(elapsedTime) {
    zoom.out(1);
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].position.z = Math.sin(elapsedTime + i * 5) * (mag - resistor);
    }
  },
  flagWave(elapsedTime) {
    zoom.out(1);
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].position.z = Math.sin(elapsedTime + i * 6) * (mag - resistor);
    }
  },
  stratumWave(elapsedTime) {
    zoom.out(1);
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].position.z = Math.sin(elapsedTime + i * 13) * (mag - resistor);
    }
  },
  sliceWave(elapsedTime) {
    zoom.out(1);
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].position.z = Math.sin(elapsedTime + i * 19) * (mag - resistor);
    }
  },
  scissorsWave(elapsedTime) {
    zoom.out(1);
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].position.z = Math.sin(elapsedTime + i * 22) * (mag - resistor);
    }
  },
  rowWave(elapsedTime) {
    zoom.out(1);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        boxes[j + columns * i].position.z =
          Math.sin(elapsedTime - i) * (mag - resistor);
      }
    }
  },
  columnWave(elapsedTime) {
    zoom.out(1);
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        boxes[i + columns * j].position.z =
          Math.sin(elapsedTime - i) * (mag - resistor);
      }
    }
  },
  calmDown() {
    zoom.reset();
    for (let i = 0; i < columns * rows; i++) {
      boxes[i].position.z = boxes[i] < 0.1 ? 0 : boxes[i].position.z * 0.97;
    }
  },
};

// 10秒ごとにエフェクトを変更
const effectMember = Object.keys(effectFuncs).length - 1;

const variableInterval = interval => {
  const rnd = Math.floor(Math.random() * effectMember);
  resistor = 1;

  setTimeout(() => {
    if (select === 'calmDown') {
      select = Object.keys(effectFuncs)[rnd];
      interval = 15000;
    } else {
      select = 'calmDown';
      interval = 6000;
    }
    h2.textContent = `effect: ${select}`;
    variableInterval(interval);
  }, interval);
};

variableInterval(interval);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  resistor = resistor < 0.05 ? 0 : resistor * 0.995;
  effectFuncs[select](elapsedTime);
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
