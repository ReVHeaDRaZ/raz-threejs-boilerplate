import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

//Lights
export function setupLights(scene, positions){
  RectAreaLightUniformsLib.init();

  const rearAreaLight = new THREE.RectAreaLight(0xffffff,5,8,48);
  rearAreaLight.position.set(0,89,-115);
  rearAreaLight.rotateX(Math.PI/-2);
  rearAreaLight.rotateZ(Math.PI/-2);

  
  const pointLightFront = new THREE.PointLight(0xff5555,350,0,2.1);
  pointLightFront.castShadow = true;
  pointLightFront.position.set(0, 19, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff,0.05);

  const topLight = new THREE.PointLight(0xffffff,850,0,2);
  topLight.position.set(0,125,-119);
  topLight.castShadow = true;

  scene.add(rearAreaLight, pointLightFront, ambientLight, topLight);
  
  // const lightHelp = new THREE.PointLightHelper(barPointLightFront);
  // const lightHelp = new RectAreaLightHelper(rearAreaLight);
  // scene.add(lightHelp);
}
