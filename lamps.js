import * as THREE from 'three';
import { positions } from './positions.js';

export function setupLamps(metalMaterial, fbxLoader, scene){
  const lightGlowMaterial = new THREE.MeshStandardMaterial({ name: "lightGlow", color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.2, roughness: 0.1, metalness: .5, fog: true });

  fbxLoader.load('./models/SM_Lamp_1.FBX', (fbxScene) => {
    fbxScene.scale.set(.17,.17,.5);  
    fbxScene.children[0].material[0] = metalMaterial;
    fbxScene.children[0].material[1] = lightGlowMaterial;
    
    const rearLamp = fbxScene;
    rearLamp.children[0].name = "rearLamp";
    rearLamp.position.set(positions.rearLampPosition.x, positions.rearLampPosition.y, positions.rearLampPosition.z);
    rearLamp.rotateY(Math.PI/2);
    
    scene.add(rearLamp);
  });
  
}