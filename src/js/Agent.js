//Reads/Discovers all the states of the DOM based on complex relationships identified by the programmer
class ControlBarClass{
	static controlbarid="globalControlBar"
	static #controlbar;
	
	static MoveControlBar(parent_path){
		this.getControlBar(); //protect in case controlbar isnt defined
		let parentnode = document.querySelector('div[data-testid="NPV_Panel_OpenDiv"]'); 
		if (!parentnode){
			console.error('parent node not found:' + parentnode);
			return;
		}
		this.#controlbar= parentnode.insertBefore(this.#controlbar,parentnode.children[1]);
		this.#controlbar.id=this.controlbarid; //set id again.
		return this.#controlbar;
	}
	
	static RestoreControlBar(parent_path){
		this.getControlBar();
		let navbar=document.querySelector(parent_path);
		if (!navbar){
			console.log('parent path not found:' + parent_path );
		}
		navbar.parentElement.appendChild(this.#controlbar);
	}
	
	static getControlBar(){
		if (!this.#controlbar){ //for the first time loading controlbar
			this.#controlbar = document.getElementById(this.controlbarid);
		}
		return this.#controlbar;
	}
	
}
//
function removeElementsWithAncestor(selector, ancestorDiv) {
  const elements = document.querySelectorAll(selector); // Select all matching elements
  
  elements.forEach((element) => {
    // Check if ancestorDiv is an ancestor of the current element
    if (element.closest(ancestorDiv)) {
      element.remove(); // Remove the element if it has ancestorDiv as an ancestor
    }
  });
  return elements.length;
}

class Agent{ 
	globalBody;
	ShowAboutTab;
	globalAboutTab;
	ShowFullLibrary;
	SearchForm;
	
	
	currentUrl="";
	oldUrl="";

	constructor (){
		this.initialise_basic_elements();
	}
	static CanvasOrArtworkAgent() {
		if (document.querySelector(' #globalAboutTab div[aria-hidden="false"][data-testid="track-visual-enhancement"]')) {
			//Canvas Hidden (Canvas = Visualiser of track in about tab)
			sys.set_VisualiserEnabled('disabled');
		} else {
			sys.set_VisualiserEnabled('enabled');
		}
		//console.log('Visualiser State:' + sys.get_VisualiserEnabled());
	}

	initialise_basic_elements(){ //this function initialises basic elements that can be used without being recalculated while the user uses the app
		//some elements get deleted by dynamic libraries, so we try not to keep them saved in this agent.
		this.globalBody = document.getElementById('globalBody');
		this.ShowAboutTab = document.getElementById('ShowAboutTab');
		this.globalAboutTab = document.getElementById('globalAboutTab');
		this.ShowFullLibrary = document.getElementById('ShowFullLibrary');
		this.SearchForm = document.querySelector("#SearchForm");
	}

	
	checkDomAndAct() {
 
		let window_loc_path=window.location.pathname;
		if (sys.get_currentStateOfMainView()==false) { 
			setTimeout(function() {
				this.ShowFullLibrary = document.getElementById('ShowFullLibrary');
				if (this.ShowFullLibrary.getAttribute('aria-label') == 'Expand Your Library'){// if (checkforDIV(divthatshowsLibraryIsNOTExpanded)){LibraryDiv.click()}
					this.ShowFullLibrary.click();
				}
			}, 500); // 500ms delay
		}
		
		if (sys.get_currentStateOfControlBar()==true){ 
			// if (checkforDIV(divthatshowsAboutTab(TrackInfo)IsNOTExpanded)){AboutTab(TrackInfobutton).click()}
			
			//this.ShowAboutTab = document.getElementById('ShowAboutTab');
			
			if (this.ShowAboutTab.getAttribute('aria-pressed')=="false"){// if (checkforDIV(divthatshowsLibraryIsNOTExpanded)){LibraryDiv.click()}
				console.log('should open about tab');
				this.ShowAboutTab.click();
			}
			if (!document.getElementById('videoart')){
				let videoart=document.querySelector('.canvasVideoContainerNPV > video');
				if (videoart){
					videoart.id='videoart';
				}
			}

		} 



	}

	async addScrollBarBehavior(){
		const scrollableDiv = document.querySelector('div[data-testid="NPV_Panel_OpenDiv"]')?.parentElement?.parentElement;
		
		if (!scrollableDiv){
			console.error('addScrollBarBehavior: '+'ScrollableDivNotFound');
			return;
		}
		console.log('addScrollBarBehavior: '+'ScrollableDivFound');
		let isTouching = false;
		let lastTouchY = 0;

		// For mouse events
		scrollableDiv.addEventListener('mousedown', (event) => {
			isTouching = true;
			lastTouchY = event.clientY; // Track initial Y position of the mouse
		});

		// For touch events
		scrollableDiv.addEventListener('touchstart', (event) => {
			isTouching = true;
			lastTouchY = event.touches[0].clientY; // Track initial Y position of the touch
		});

		// For mouse move events
		scrollableDiv.addEventListener('mousemove', (event) => {
			if (isTouching) {
				const deltaY = event.clientY - lastTouchY; // Calculate how much the mouse moved vertically

				// Check if the scrollable area is near the top (within 10px)
				if (scrollableDiv.scrollTop <= 10 && deltaY > 0) {
					sys.disableControlBar();
				}

				// Update the last mouse Y position
				lastTouchY = event.clientY;
			}
		});

		// For touch move events
		scrollableDiv.addEventListener('touchmove', (event) => {
			if (isTouching) {
				const deltaY = event.touches[0].clientY - lastTouchY; // Calculate vertical movement for touch

				// Check if the scrollable area is near the top (within 10px)
				if (scrollableDiv.scrollTop <= 10 && deltaY > 0) {
					sys.disableControlBar();
				}

				// Update the last touch Y position
				lastTouchY = event.touches[0].clientY;
			}
		});

		// For mouse up event
		document.addEventListener('mouseup', () => {
			isTouching = false; // Reset the state when mouse is released
		});

		// For touch end event
		document.addEventListener('touchend', () => {
			isTouching = false; // Reset the state when touch is released
		});
		
		return true; //async function
	}
	
	checkAboutTabState(){
		
		if (sys.get_currentStateOfControlBar()==true){ //So we dont waste computational power
			//First check about tab state through control bar's buttons
			//Old method was to detect html content through about tab, but now control bar is included and will ruin the results unless we exclude it
			if (document.querySelector('button[data-active="true"][aria-pressed="true"][data-restore-focus-key="device_picker"]')) {
				sys.set_about_tab_state("device_picker"); 
			} else if (document.querySelector('button[data-testid="control-button-queue"][data-active="true"]')){
				sys.set_about_tab_state("queue"); 
			} else if (document.querySelector('button[data-testid="control-button-npv"][data-active="true"][aria-pressed="true"]')){
				sys.set_about_tab_state("now_playing");
			} else{ //When we change about tab state control bar may get wiped, so we fall back to old 'about tab' detection
				if (document.querySelector('#globalAboutTab div[data-testid="device-picker-row-sidepanel"]')) {
					sys.set_about_tab_state("device_picker");
				} else if (document.querySelector('#globalAboutTab [aria-label="Queue"]')){
					sys.set_about_tab_state("queue");
				} else if (document.querySelector('#globalAboutTab [aria-label="Now playing view"]')){
					sys.set_about_tab_state("now_playing");
				} 
			}
			DomModifier.writeToBody('AboutTabState',sys.get_about_tab_state());
			if (sys.get_about_tab_state()=="queue" || sys.get_about_tab_state()=="device_picker" ){
				ControlBarClass.RestoreControlBar('#globalAboutTab');
			} else if (sys.get_about_tab_state()=="now_playing") {
				ControlBarClass.MoveControlBar('div[data-testid="NPV_Panel_OpenDiv"]');
			}
			ag.addScrollBarBehavior();//scroll down to return	
		}
		
	}
	
}
