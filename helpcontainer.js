const helpContainerDOM = document.createElement('div');
export let helpContainerOpen = false;

export function createHelpContainer(parentContainer){
  helpContainerDOM.setAttribute('id','helpContainer');
  helpContainerDOM.setAttribute('style','overflow-y: scroll');
  helpContainerDOM.innerHTML = `
    <div class=help-wrapper">
      <div class="help-heading">
        <h2>RaZ Three.js Boilerplate</h2>
        <button id="help-close-button">X</button>
      </div>
      <div class="content">
        <p>This is the helpContainer, can be used for information, menus, forms, etc.</p>
      </div>
    </div> 
  `;
  
  parentContainer.appendChild(helpContainerDOM);

  document.getElementById('help-close-button').addEventListener("click", hideHelp);
    
  return helpContainerDOM;
}


export function hideHelp(){
  helpContainerDOM.style.opacity = 0;
  helpContainerDOM.style.pointerEvents = "none";
  helpContainerOpen = false;
}
export function showHelp(){
  helpContainerDOM.style.opacity = "1";
  helpContainerDOM.style.pointerEvents = "auto";
  helpContainerOpen = true;
}

export function showIframe(src){
  helpContainerDOM.innerHTML = `
    <div class="help-wrapper">
    <div class="help-heading">
        <h2></h2>
        <button id="help-close-button">X</button>
      </div>
      <iframe src="${src}" style="border:none;height:100vh;width:100%;"></iframe> 
    </div>
  `
  showHelp();
  document.getElementById('help-close-button').addEventListener("click", hideHelp);
}