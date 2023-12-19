import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { positions } from './positions.js';
import { Reflector } from './RaZReflector.js'
import Wall from './wall.js';

export function setupRoom(textureLoader,scene){
  // Textures and Materials
  const floorTexture = textureLoader.load ("./textures/TexturesCom_WoodRough.jpg");
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.repeat.set(4,4);
  const roofTexture = textureLoader.load ("./textures/Asphalt009_2K_Color.jpg");
  roofTexture.wrapT = THREE.RepeatWrapping;
  roofTexture.wrapS = THREE.RepeatWrapping;
  roofTexture.repeat.set(4,4);
  const roofMaterial = new THREE.MeshPhongMaterial({  map: roofTexture, shininess: 0, reflectivity: 0.1 });
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xbbaaaa, map: floorTexture, shininess: 0.75, reflectivity: 0.74 });

  const wallTexture = textureLoader.load ("./textures/castle_brick_02_red_diff.jpg");
  const wallNormal = textureLoader.load ("./textures/castle_brick_02_red_nor.jpg");
  wallTexture.wrapS = THREE.RepeatWrapping;
  wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(4,4);
  wallNormal.wrapS = THREE.RepeatWrapping;
  wallNormal.wrapT = THREE.RepeatWrapping;
  wallNormal.repeat.set(4,4);
  
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture, normalMap: wallNormal, metalness: 0, roughness: 0.9 });

  const decalTexture = textureLoader.load ("./RaZLogo1.png");
  const decalNormal = wallNormal.clone();
  decalNormal.repeat.set(1,1);
  const decalMaterial = new THREE.MeshStandardMaterial( {
    map: decalTexture,
    normalMap: decalNormal,
    roughness: .8,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: - 0.1,
    wireframe: false
  } );

  // Meshes
  const planeGeomtry = new THREE.PlaneGeometry(220,220);
  
  const floor = new THREE.Mesh (planeGeomtry, floorMaterial); 
  floor.position.set(0,-20.25,-20.25);
  floor.rotateX(Math.PI * -.5);
  floor.receiveShadow = true;
  floor.name = "floor";

  const floorReflector = new Reflector(planeGeomtry, {
    clipBias: 0.503,
    textureWidth: (window.innerWidth * window.devicePixelRatio) * 0.25,
    textureHeight: (window.innerHeight * window.devicePixelRatio) * 0.25,
    color: 0xb5b5b5
  } );
  floorReflector.position.set(0,-20.24,-20.25);
  floorReflector.rotateX(Math.PI * -.5);
  floorReflector.material.transparent = true;
	floorReflector.material.uniforms.opacity.value = 0.1;
  floorReflector.name = "floorReflector";
    
  const roof = new THREE.Mesh (planeGeomtry, roofMaterial);
  roof.position.set(0,100,-20.25);
  roof.rotateX(Math.PI * .5);
  roof.name = "roof";

  const rearWall = new Wall('rearwall', {x:0,y:90,z:-126}, 0, 220, wallMaterial);
  const frontWall = new Wall('frontwall',{X:0,y:90,z:80},Math.PI,220,wallMaterial);
  const leftWall = new Wall ('leftwall', { x: positions.leftWallPosition.x,
                                          y: positions.leftWallPosition.y,
                                          z:positions.leftWallPosition.z
                                        }, Math.PI / 2, 220, wallMaterial);

  const rightWall = new Wall('rightwall', { x: positions.rightWallPosition.x,
                                            y: positions.rightWallPosition.y,
                                            z:positions.rightWallPosition.z  
                                          }, Math.PI / -2, 220, wallMaterial);

  const decal = new THREE.Mesh( new DecalGeometry( rearWall.mesh, new THREE.Vector3(0,0,-1), rearWall.mesh.rotation, new THREE.Vector3(70,70,50) ), decalMaterial );
  decal.position.set(0,60,-120);
  
  scene.add(floor, floorReflector, roof, rearWall.mesh, leftWall.mesh, rightWall.mesh, frontWall.mesh, decal);
}