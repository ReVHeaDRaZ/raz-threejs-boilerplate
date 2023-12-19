import * as THREE from 'three';

export default class Wall{
  constructor(name,position,rotationY,size,material){
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(size,size), material);
    this.mesh.name = name;
    this.mesh.position.set(position.x,position.y,position.z);
    this.mesh.rotateY(rotationY);
  }

}