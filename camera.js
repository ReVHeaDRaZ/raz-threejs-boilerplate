import * as THREE from 'three';

export function setupCamera(positions){
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 300);
  if(window.innerWidth < window.innerHeight){
    camera.fov = 85;
    camera.updateProjectionMatrix();
    camera.position.set(positions.cameraStartPosition.x,
      positions.cameraStartPosition.y,
      positions.cameraStartPosition.z-15);
  }else{
    camera.position.set(positions.cameraStartPosition.x,
      positions.cameraStartPosition.y,
      positions.cameraStartPosition.z);
    }
  return camera;
}