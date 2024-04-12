import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GameMap } from "./Game/World/GameMap.js";
import { Character } from "./Game/Behaviour/Character.js";
import { Player } from "./Game/Behaviour/Player.js";
import { NPC } from "./Game/Behaviour/NPC.js";
import { Controller } from "./Game/Behaviour/Controller.js";
import { TileNode } from "./Game/World/TileNode.js";
import { Vector3 } from "three";
import { Resources } from "./Util/Resources.js";

// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

// Camera Settings
const cameraDistance = 0;
const cameraHeight = 100;
var cameraOffset = new THREE.Vector3(0, cameraHeight, cameraDistance);
var target = new THREE.Vector3();

// Audio
let listener;

const orbitControls = new OrbitControls(camera, renderer.domElement);

// Create clock
const clock = new THREE.Clock();

// Controller for player
const controller = new Controller(document, camera);

// GameMap
let gameMap;

// Player
let player;

let npc;

// resources

let files = [
  { name: "car", url: "/models/lambo.glb" },
  { name: "police", url: "/models/police.glb" },
];

const resources = new Resources(files);
await resources.loadAll();

// Setup our scene
function setup() {
  const overlay = document.getElementById("overlay");
  overlay.remove();

  scene.background = new THREE.Color(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //Create Light
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 5, 5);
  scene.add(directionalLight);

  listener = new THREE.AudioListener();
  camera.add(listener);

  // initialize our gameMap
  gameMap = new GameMap();
  gameMap.init(scene);

  // Create Player
  npc = new NPC(new THREE.Color(0x000000));

  player = new Player(new THREE.Color(0xff0000));

  npc.setModel(resources.get("police"));

  player.setModel(resources.get("car"));
  // player.setLight()

  npc.setSound(listener, "weewoo");

  // Add the character to the scene
  scene.add(player.gameObject);
  scene.add(npc.gameObject);

  // scene.add(player.light)

  // Get a random starting place for the enemy
  let startNPC = gameMap.graph.getRandomEmptyTile();

  let startPlayer = gameMap.graph.getRandomEmptyTile();

  // this is where we start the player
  player.location = gameMap.localize(startPlayer);
  npc.location = gameMap.localize(startNPC);

  let goal = gameMap.graph.getRandomEmptyTile();

  gameMap.setupSingleGoalFlowField(goal);

  scene.add(gameMap.gameObject);

  //First call to animate
  animate();
}

// animate
function animate() {
  requestAnimationFrame(animate);

  target.copy(player.location);
  camera.position.copy(target).add(cameraOffset);
  camera.lookAt(target);

  renderer.render(scene, camera);

  let deltaTime = clock.getDelta();

  // let steer = npc.interactiveFlow(gameMap, player);
  // npc.applyForce(steer);
  npc.update(deltaTime, gameMap, player);

  player.update(deltaTime, gameMap, controller);

  checkCollisions();

  orbitControls.update();
  controller.setWorldDirection();
}

function checkCollisions() {
  const mapObject = scene.children.find((o) => o.name == "map");
  const goal = mapObject.children.find((o) => o.name == "goal");

  let bbox1 = new THREE.Box3().setFromObject(player.gameObject);
  let bbox2 = new THREE.Box3().setFromObject(goal);

  return bbox1.intersectsBox(bbox2);
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", setup);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const state = urlParams.get("state");

const stateBox = document.getElementById("state");

if (state == "win") {
  stateBox.innerText = "You WON! Restart Game";
} else if (state == "lose") {
  stateBox.innerText = "You lost! Restart Game";
} else {
  stateBox.innerText = "Maze Escape: Police";
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update the renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add a resize event listener
window.addEventListener("resize", onWindowResize);
