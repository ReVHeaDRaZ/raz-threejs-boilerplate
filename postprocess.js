import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export let outlinePass;
export function setupPostProcess(renderer,scene,camera){
  const composer = new EffectComposer( renderer );

  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5,
    0.1,
    1.0
  );
  composer.addPass(bloomPass);

  outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );
  outlinePass.edgeStrength = 0.5;
  outlinePass.visibleEdgeColor.set(0xeafaa5);
  outlinePass.hiddenEdgeColor.set(0xeafaa5);
  composer.addPass( outlinePass );

  const outputPass = new OutputPass();
  composer.addPass( outputPass );

  return composer;
}