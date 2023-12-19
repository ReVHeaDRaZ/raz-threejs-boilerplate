import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import gsap from 'gsap';
import { setupCamera } from './camera.js';
import { setupScene } from './scene.js';
import { setupRenderer } from './renderer.js';
import { positions } from './positions.js';

import Stats from "three/examples/jsm/libs/stats.module.js";
import { outlinePass, setupPostProcess } from './postprocess.js';

// Globals
let fullOrbitControl = false; // For debugging scene with full camera control
let state = "home";

let highQuality = true;
let showStats = false;
let helpContainerDOM, stats;
let helpContainerOpen = false;

gsap.defaults({
  ease: "power1.inOut",
  duration: 1,
});

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

const camera = setupCamera(positions);
const renderer = setupRenderer(document.getElementById('bg'));

// Controls
let controls;
if(fullOrbitControl){
  controls = new OrbitControls( camera, document.body );
  controls.update();
}

// Loading Manager
const loadingManager = new THREE.LoadingManager();
loadingManager.addHandler( /\.tga$/i, new TGALoader() ); // add handler for TGA textures
const textureLoader = new THREE.TextureLoader(loadingManager);
const fbxLoader = new FBXLoader(loadingManager);

// Progress Bar
const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.querySelector(".progress-bar-container");
loadingManager.onProgress = function (url, loaded, total){
  progressBar.value = (loaded / total) * 100;
};

// After Loading Finished (Initialise)
loadingManager.onLoad = function(){
  progressBarContainer.style.display = 'none';
  
  document.querySelector('#app').innerHTML = `
    <div class="appContainer">
        
      <div id="nav-menu">
        <div id="heading" class="shredded-font">RaZ</div>
        <button id="home-button">HOME</button>
        <button id="settings-button">SETTINGS</button>
      </div>

      <div id="helpContainer" style="overflow-y: scroll">
        <div class=help-wrapper">
          <div class="help-heading">
            <h2>RaZ Three.js Boilerplate</h2>
            <button id="help-close-button">X</button>
          </div>
          <div class="content">
            <p>This is the helpContainer, can be used for information, menus, forms, etc.</p>
          </div>
        </div> 
      </div>
      
    </div> 
  `
  helpContainerDOM = document.getElementById('helpContainer');
  helpContainerDOM.style.opacity = 1;
  helpContainerDOM.style.pointerEvents = "auto";
  document.getElementById('help-close-button').addEventListener("click", hideHelp);
  document.getElementById("home-button").addEventListener("click", showHome);
  document.getElementById("settings-button").addEventListener("click", showSettings);

  animate();
  renderer.shadowMap.needsUpdate = true;
  intro();
};

const scene = setupScene(textureLoader, fbxLoader);

const sphereObject = new THREE.Mesh(new THREE.SphereGeometry(5,10,10),new THREE.MeshStandardMaterial({color: 0xff3333, emissive: 0xff3333, emissiveIntensity: 4}));
  sphereObject.name = "sphereObject";
  sphereObject.position.set(0,70,-100);
  scene.add(sphereObject);

gsap.to(sphereObject.position,{x:0, y:-16, z:-100, repeat:-1, yoyo: true, ease: "bounce.out", duration: 2});

// Postprocessing
const composer = setupPostProcess(renderer,scene,camera);



// Functions
function changeQuality(){
  if(highQuality){
    renderer.setPixelRatio(window.devicePixelRatio / 2);
    highQuality=false;
    document.getElementById('quality-button').innerHTML = "HIGH QUALITY";
  }else{
    renderer.setPixelRatio(window.devicePixelRatio);
    highQuality=true;
    document.getElementById('quality-button').innerHTML = "LOW QUALITY";
  }
}

function showFPS(){
  if(!showStats){
    stats = new Stats();
    document.body.appendChild(stats.dom);
    showStats = true;
  }else{
    document.body.removeChild(stats.dom);
    showStats = false;
  }
}


function showHome(){
  gsap.to(camera.position, {x: positions.cameraHomePosition.x, y: positions.cameraHomePosition.y, z: positions.cameraHomePosition.z});
  gsap.to(camera.rotation, {y: 0});
  state = "home";
}

function intro(){
  showNav();
  showHome();
}

function hideHelp(){
  helpContainerDOM.style.opacity = 0;
  helpContainerDOM.style.pointerEvents = "none";
  helpContainerOpen = false;
}
function showHelp(){
  helpContainerDOM.style.opacity = "1";
  helpContainerDOM.style.pointerEvents = "auto";
  helpContainerOpen = true;
}
function showNav(){
  document.getElementById('nav-menu').style.opacity = "1";
}

function showSettings(){
  let quality;
  if(highQuality)
    quality = "LOW";
  else
    quality = "HIGH";

  helpContainerDOM.innerHTML = `
    <div class="help-wrapper">
      <div class="help-heading">
        <h1>SETTINGS</h1>
        <button id="help-close-button">X</button>
      </div>
      <button id="quality-button">${quality} QUALITY</button>
      <button id="fps-button">SHOW FPS</button>
    </div>
  `
  showHelp();
  document.getElementById('help-close-button').addEventListener("click", hideHelp);
  document.getElementById('quality-button').addEventListener("click", changeQuality)
  document.getElementById('fps-button').addEventListener("click", showFPS);
}
function showIframe(src){
  helpContainerDOM.innerHTML = `
    <div class="help-wrapper">
    <div class="help-heading">
        <h2>FrogHollow</h2>
        <button id="photo-close-button"><i class="fa-solid fa-xmark fa-xl"></i></button>
      </div>
      <iframe src="${src}" style="border:none;height:100vh;width:100%;" " title="FrogHollow webpage"></iframe> 
    </div>
  `
  showHelp();
  document.getElementById('photo-close-button').addEventListener("click", hideHelp);
}

// Events
// mouse event vars
let isSwiping = false;
const delta = 2.5;
let sogliaMove = 0;
let startX;
let startY;
let firstTouch = true;

// device detection
let isMobile = false;

if (
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
    navigator.userAgent,
  )
  || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    navigator.userAgent.substr(0, 4),
  )
) {
  isMobile = true;
}

if (isMobile) {
  window.addEventListener('pointerdown', (event) => {
    firstTouch = true; 
    startX = event.pageX;
    startY = event.pageY;

    isSwiping = false;
  });
  window.addEventListener('pointermove', (event) => {
    if (firstTouch) {
      startX = event.pageX;
      startY = event.pageY;
      firstTouch = false;
    } else {
      const diffX = Math.abs(event.pageX - startX);
      const diffY = Math.abs(event.pageY - startY);
      if (diffX < delta && diffY < delta && sogliaMove > 2) {
        // sogliaMove>2 means 2 frame still when isSwiping is true
        onTouchClick(event); // for iOS  
      }
    }
    isSwiping = true; 
  });
  window.addEventListener('pointerup', (event) => {
    const diffX = Math.abs(event.pageX - startX);
    const diffY = Math.abs(event.pageY - startY);
    if (diffX < delta && diffY < delta) {
      onMouseClick(event); // Android old: is better desktop solution
    }
    else{ // Swipe Events
      const swipeDirection = event.pageX - startX;
      onSwipe(swipeDirection);
    }
    firstTouch = true;
  });
} else {
  //desktop behavior
      window.addEventListener('pointerdown', (event) => {
        isSwiping = false;
        startX = event.pageX;
        startY = event.pageY;
      });
      window.addEventListener('pointermove', () => {
        isSwiping = true;
      });
  
      window.addEventListener('pointerup', (event) => {
        const diffX = Math.abs(event.pageX - startX);
        const diffY = Math.abs(event.pageY - startY);
  
        if (diffX < delta && diffY < delta) {
          onMouseClick(event);
        }
        else{ // Swipe Events
          const swipeDirection = event.pageX - startX;
          onSwipe(swipeDirection);
        }
      });
    }
  
function onSwipe(swipeDirection){
  console.log(swipeDirection);
}

function onTouchClick(event){
  event.preventDefault();
  // Update mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);
  
  if(firstTouch === false){
    firstTouch = true;
    for (let i=0; i < intersects.length; i++){    
      
    }
  }
};

function onMouseClick(event){
  event.preventDefault();
  if (!isSwiping && !helpContainerOpen) {
    // Update mouse variable
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    handleRaycastIntersects();
  }
  isSwiping = false;
  document.body.style.cursor = 'default';
};


function handleRaycastIntersects() {
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    if(intersects[i].object.name.includes("sphere")){
      gsap.to(camera.position,{x:0,y:20,z:-50});
    }
  }
}

function onMouseMove(event){
  // Update the mouse variable
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if( !isMobile && !helpContainerOpen){
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children);
    if(intersects.length > 0){
        outlinePass.selectedObjects = [intersects[0].object];
        document.body.style.cursor = 'pointer';
    }
    else{
      outlinePass.selectedObjects = [];
      document.body.style.cursor = 'default';
    }
  }
};

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  if(window.innerWidth < window.innerHeight){
    camera.fov = 85;
  }else{
    camera.fov = 50;
  }
  camera.updateProjectionMatrix();

  composer.setSize( window.innerWidth, window.innerHeight );
});


window.addEventListener('mousemove', onMouseMove);

gsap.from(".loadingHeading",{opacity: 0, duration: .5})

// Main Loop
function animate(){
  requestAnimationFrame(animate);

  if(highQuality)
    composer.render();
  else
    renderer.render(scene,camera);
  if(fullOrbitControl) controls.update();
  
  if(showStats) stats.update();

}


