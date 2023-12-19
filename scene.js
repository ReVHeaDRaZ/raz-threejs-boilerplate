import * as THREE from 'three';
import { positions } from './positions.js';
import { setupLights } from './lights.js';
import { setupRoom } from './room.js';
import { setupLamps } from './lamps.js';

export function setupScene(textureLoader, fbxLoader){
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x010101);
  // scene.fog = new THREE.Fog(0xe0e0e0, 0.5, 1000);
  
  // Lights
  setupLights(scene, positions);
  
  //Materials
  const metalMaterial = new THREE.MeshStandardMaterial({ name: "metalMaterial", color: 0xeeeeee, emissive: 0x000000, roughness: 0.1, metalness: .8, fog: true });

  // Setup Meshes
  // Floor, Roof and Walls
  setupRoom(textureLoader, scene);

  //Load in FBX models
  setupLamps(metalMaterial, fbxLoader, scene);
  
  return scene;
}
