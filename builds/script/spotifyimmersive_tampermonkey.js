// ==UserScript==
// @name         SpotifyImmersiveScript
// @namespace    https://github.com/ttrahilis/SpotifyImmersive
// @version      2025.04.19.10
// @description  Mobile Interface injection for Spotify Desktop Site
// @author       ttrahilis
// @match        https://open.spotify.com/*
// @run-at       document-end
// @updateURL    https://github.com/Ttrahilis/SpotifyImmersive/releases/download/dev/spotifyimmersive_tampermonkey.js
// @downloadURL  https://github.com/Ttrahilis/SpotifyImmersive/releases/download/dev/spotifyimmersive_tampermonkey.js
// @grant GM_addStyle
// ==/UserScript==


//Does all the Changes of values we used to mark the states of the dom
class DomModifierClass {
	globalBody;
	constructor(){
		this.globalBody = document.getElementById('globalBody');
	}
	writeToBody(variable,valuetoset){//Writes a value to a variable the globalBody (HTML body tag)

		if (this.globalBody){
			this.globalBody.setAttribute(variable, valuetoset);
		} else{
			this.globalBody = document.getElementById('globalBody');
			this.globalBody.setAttribute(variable, valuetoset);
		}
	}
	createCssVariable(variable, valuetoset){
		//example name --main-colorbg
		//example value red
		document.documentElement.style.setProperty(variable, valuetoset);
	}
	
	createSVGWithPath(pathData) {
        // Create the SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24'); // Set the width of the SVG (can be customized)
        svg.setAttribute('height', '24'); // Set the height of the SVG (can be customized)
        svg.setAttribute('viewBox', '0 0 24 24'); // Set the viewBox to define the coordinate system
        svg.setAttribute('fill', 'white');

        // Create the path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData); // Set the path data from the function input

        // Append the path to the SVG
        svg.appendChild(path);

        // Return the SVG element so it can be appended to any div or other container
        return svg;
    }
	
	createButton(button_id,parent,svg_path){ //Creates a button inside a parent container with an icon based on svg data
		
		let new_button = document.createElement('button');
                
		new_button.id=button_id;new_button.style.cursor = 'pointer'; new_button.style.outline = 'none'; new_button.style.border = 'none';
		parent.appendChild(new_button);
		new_button.appendChild(this.createSVGWithPath(svg_path));
		
		return new_button;
	}
}
// High level interface for handling app(ignoring DOM specific details)
class System {
	#secret; // Private field 
	
	#VisualiserEnabled;
	#global_color;
	#global_side_color;

	#search; //search feature enabled
	#main_view;//e.g. home library search
	#about_tab; // e.g. true/false = enabled / disabled (the full view of about tab and expanded control bar)
	#about_tab_state; //e.g. now_playing
	constructor() {
		DomModifier.createCssVariable('--global-color','black');
		DomModifier.createCssVariable('--global-side-color','black'); 
		this.#main_view = false;
		this.#about_tab = true;
		this.#search = true;
	}

	#revealSecret() { // Private method
		console.log(`Secret is: ${this.#secret}`);
	}

	showSecret() {
		this.#revealSecret(); // Works inside class
	}
	//Setters Getters Toggles etc
	//Toggle Search Box feature
	toggleSearchBar(){
		this.#search=!this.#search;
		if (this.#search==true){
			DomModifier.writeToBody('search',"enabled");
		} else if (this.#search==false){
			DomModifier.writeToBody('search',"disabled");
		}
	}
	// Toggle Control Bar
	toggleControlBar(){ 
		this.#about_tab=!this.#about_tab;//toggle
		if (this.#about_tab==true){
			DomModifier.writeToBody('controlbarexpanded',"open");
		}
		else if (this.#about_tab==false){ 
			DomModifier.writeToBody('controlbarexpanded',"closed");
		}
		ag.checkDomAndAct();
	}
	
	get_currentStateOfControlBar(){
		return this.#about_tab; //about tab is the same as control bar in high level logic because they show up together
	}
	
	enableControlBar(){
		if (this.#about_tab==false){
			this.toggleControlBar();
		}
	}
	disableControlBar(){
		if (this.#about_tab==true){
			this.toggleControlBar();
		}
	}
	// Toggle Main View
	toggleMainView(){
		this.#main_view = !this.#main_view;
		if (this.#main_view==true){
			DomModifier.writeToBody('mainview',"home");
		}
		else if (this.#main_view==false){
			DomModifier.writeToBody('mainview',"library");
		}
	}
	
	enableMainView(){ //Shows Main View
		if (!this.#main_view){
			this.toggleMainView();
		}
	}
	disableMainView(){ //Shows Library Page
		if (this.#main_view){
			this.toggleMainView();
		}
	}
	
	get_currentStateOfMainView(){
		return this.#main_view;
	}
	

	set_VisualiserEnabled(val){
		this.#VisualiserEnabled = val;
		DomModifier.writeToBody('visualiser',val );
	}

	set_global_colors(global_color,global_side_color){
		this.#global_color=global_color;
		this.#global_side_color=global_side_color;
		DomModifier.createCssVariable('--global-color',global_color);
		DomModifier.createCssVariable('--global-side-color',global_side_color);
	}

	
	get_VisualiserEnabled(){
		return this.#VisualiserEnabled;
	}
	get_global_colors(){
		return [this.#global_color,this.#global_side_color];
	}

}
 //Reads/Discovers all the states of the DOM based on complex relationships identified by the programmer
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

	addScrollBarBehavior(){
		const scrollableDiv = document.querySelector('#globalAboutTab div[data-testid="NPV_Panel_OpenDiv"]');
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

	}
}
let DomModifier;
let sys;
let ag;

const originalLog = console.log;
console.log = function(...args) {
	//set to true for debugging
	if (true){
		originalLog(...args);
	}
};

class BasicInfo{
	static divsToModify;
	static unNecessaryCount=0;
}
const buttondelay=200; 
let AboutTabState; //State of about tab

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

//repeatUntilTrue: consumes a function 'foo' and runs it indefenitely,
//until 'foo' returns the boolean value true;
//while letting the background processes continue
//function 'foo' should return true when it accomplishes its goals
async function repeatUntilTrue(fn) {
  while (!(await fn())) {
	  //Resume app activity for 1000 seconds
	  await new Promise(res => setTimeout(res, 1000));
  }
  return true;
}

// Define an array of objects with your desired selectors and corresponding new IDs
BasicInfo.divsToModify = [
	//SOS. ITERATION WILL BE DONE IN REVERSE. LIST STARTS ITERATING FROM THE BOTTOM

	//I will track this div

	{selector: '#Desktop_LeftSidebar_Id header>div>div button', newId: "ShowFullLibrary", selfDestruct:1},
	{selector: '#browseButtonOldContainer > :nth-child(1) > :nth-child(1)', newId: "browseButtonOld", selfDestruct:1},
	{selector: '#SearchForm > :nth-child(1) > :nth-child(1) > :nth-child(1) > :nth-child(3)', newId: "browseButtonOldContainer", selfDestruct:1},
	//I will
	{selector: '#global-nav-bar > :nth-child(2) > :nth-child(1) > :nth-child(2)', newId: "SearchForm", selfDestruct:1},

	{ selector: '#global-nav-bar div:has(+ #profileButton)', newId: "notifButton", selfDestruct:1 },
	{ selector: '#global-nav-bar button[data-testid="user-widget-link"]', newId: "profileButton", selfDestruct:1 },
	{ selector: '#global-nav-bar > div button[data-testid="home-button"]', newId: "HomeButton", selfDestruct:1 },
	{ selector: '#global-nav-bar > div a[href="/download"]', newId: "SPdownloadButton", selfDestruct:1 , necessary:0},
	//{ selector: '#global-nav-bar > div > button[title="Upgrade to Premium"]', newId: "SPpremiumButton", selfDestruct:1 },
	//Subsets of search bar ^
	{ selector: '#subControlBar [data-testid="player-controls"]', newId: "playerControls", selfDestruct:1 },
	{ selector: '#moreControls>button[data-testid="lyrics-button"]', newId: "LyricsButton", selfDestruct:1 },
	
	{selector: '#moreControls > :nth-child(1)', newId: "ShowAboutTab", selfDestruct:1},
	{ selector: '#subControlBar> :nth-child(3)> :nth-child(1)', newId: "moreControls", selfDestruct:1 },
	{ selector: '#globalControlBar > footer > :nth-child(1)', newId: "subControlBar", selfDestruct:1 },
	{ selector: '#globalAboutTab img[data-testid="cover-art-image"]', newId: "coverart", selfDestruct:1 },
	{ selector: "#mainpage + div", newId: "globalAboutTab", selfDestruct:1 },
	{ selector: "#globalControlBar + div", newId: "mainpage", selfDestruct:1 },
	{ selector: "#Desktop_LeftSidebar_Id + div", newId: "globalControlBar", selfDestruct:1 },
	{ selector: "html>body", newId: "globalBody", selfDestruct:1 },
];


function countAllUnNecessaries() {
	for (let i = BasicInfo.divsToModify.length - 1; i >= 0; i--) {
		if (BasicInfo.divsToModify[i].necessary==0){
			BasicInfo.unNecessaryCount++;
		}
	}
};
countAllUnNecessaries();
console.log('unNecessaryCount: ' + BasicInfo.unNecessaryCount); 
async function assignIDs(){ 
	// return true;
	if (BasicInfo.divsToModify.length<=BasicInfo.unNecessaryCount){
		return true; //=ready to exit
	} 
	//else {
		//console.error('found it '+divsToModify[0].newId);
	//}
	for (let i = BasicInfo.divsToModify.length - 1; i >= 0; i--) { //Iterate the list backwards

		let { selector, newId, newClass,selfDestruct } = BasicInfo.divsToModify[i];
		// console.log(divsToModify[i]);
		// Perform your operations here
		if (newId){
			let element = document.querySelector(selector);
			if (element && !element.id) { // Assign ID only if it doesn't already exist
				element.id = newId;
				console.log(`Assigned ID "${newId}" to element matching selector "${selector}"`);
				if (BasicInfo.divsToModify[i].necessary==0){
					BasicInfo.unNecessaryCount--;
				}
				if (selfDestruct==1){ //remove element from list if its not meant to be tagged/id'ed'/classed twice
					BasicInfo.divsToModify.splice(i, 1);
					console.log(BasicInfo.divsToModify.length + 'LEFT');
				}
			}
		} else if (newClass) {
			let elements = document.querySelectorAll(selector); // Get all matching elements
			elements.forEach(element => {
				if (element) { // Add class only if element exists
					element.classList.add(newClass);
					console.log(`Added class "${newClass}" to element matching selector "${selector}"`);
				}
			});
		}

	}
}

async function divideSearchBar () { 
	let SearchForm = document.querySelector("#SearchForm");

	let globalNavBar = document.querySelector('#global-nav-bar');
	let browseButtonOld = document.querySelector('#browseButtonOld');


	if (browseButtonOld && globalNavBar){ 
		
		let mainViewContainer = document.querySelector(".main-view-container");

		if (mainViewContainer && SearchForm){
			mainViewContainer.insertBefore(SearchForm, mainViewContainer.firstChild);
			
			if (!document.querySelector(`#globalBody form[data-encore-id="formInputIcon"]`)){
				return;
			}
			let browseButtonNew = DomModifier.createButton("browseButtonNew",globalNavBar,'M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z');
			
			browseButtonNew.addEventListener('click', debounce(function() {
				sys.toggleSearchBar();
			}, buttondelay)); // Adjust delay as needed
			
			return true;
		}
	}
	
}

/*GM_addStyle*/

const fixBrightRGB = (r, g, b) =>{
	let L = (r + g + b) / 3; // Calculate luminance
	//console.log('Luminance:', L);
	if (L > 100) {
		let factor = (100 / L) ** 3; // Exponential reduction factor
		r *= factor;
		g *= factor;
		b *= factor;
	}
	return [Math.round(r), Math.round(g), Math.round(b)];
};

let global_color=0;
let global_sidecolor;
const TrackColor = () => {
	if (global_color!=0){
		return true;
	}
	// Get the image element
	const img = document.querySelector('#globalControlBar img[data-testid="cover-art-image"]');

	if (!img) {
		console.log("Image not found");
		return;
	}

	// Ensure the image has the crossOrigin attribute if it's from a different origin
	img.crossOrigin = 'Anonymous';

	// Create a canvas to draw the image
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (canvas && ctx){
		console.log('found canvas n ctx');
	}
	// Wait for the image to load fully
	img.onload = () => {
		// Set the canvas size to match the image's dimensions
		canvas.width = img.width;
		canvas.height = img.height;

		// Draw the image on the canvas
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		// Get the image's pixel data
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = imageData.data;

		// To find the primary color, we need to analyze the pixels
		let colorCounts = {}; // Store color frequencies
		for (let i = 0; i < pixels.length; i += 4) {
			const r = pixels[i];
			const g = pixels[i + 1];
			const b = pixels[i + 2];

			// Convert the color to a string
			const rgb = `${r},${g},${b}`;

			// Count the occurrence of each color
			colorCounts[rgb] = (colorCounts[rgb] || 0) + 1;
		}

		// Find the most frequent color
		let primaryColor = '';
		let maxCount = 0;
		for (const color in colorCounts) {
			if (colorCounts[color] > maxCount) {
				primaryColor = color;
				maxCount = colorCounts[color];
			}
		}

		// Output the primary color
		global_color = `rgb(${primaryColor})`;
		//console.log('Primary Color:', global_color);
		// Calculate Side color for darker tone
		let [r, g, b] = global_color.match(/\d+/g).map(Number); //convert string rgb(95,85,155) to 95 85 155
		[r,g,b] = fixBrightRGB(r,g,b);
		global_sidecolor = `rgb(${r},${g},${b})`;
		//console.log('Secondary Color:', global_sidecolor);
		sys.set_global_colors(global_color,global_sidecolor);


		Agent.CanvasOrArtworkAgent();
		return 1;

	};

	// If the image is already loaded (cached or from the network), trigger the onload manually
	if (img.complete) {
		img.onload();
	}
};

 
async function defineLogic (){  
	let globalBody = document.getElementById('globalBody');
	let ShowAboutTab = document.getElementById('ShowAboutTab');
	let globalAboutTab = document.getElementById('globalAboutTab');
	let ShowFullLibrary = document.getElementById('ShowFullLibrary');
	let SearchForm = document.querySelector("#SearchForm");
	let globalControlBar = document.querySelector("#globalControlBar");
	if (globalBody && ShowFullLibrary && globalAboutTab && ShowAboutTab && SearchForm && globalControlBar){
	}else {
		return;
	}

	ag.initialise_basic_elements(); 

	// Call the function to get the primary color


	function checkAboutTabState(){
		
		if (sys.get_currentStateOfControlBar()==true){ //So we dont waste computational power
			if (document.querySelector('#globalAboutTab div[data-testid="device-picker-row-sidepanel"]')) {
				AboutTabState="device_picker";
			} else if (document.querySelector('#globalAboutTab [aria-label="Queue"]')){
				AboutTabState="queue";
			} else if (document.querySelector('#globalAboutTab [aria-label="Now playing view"]')){
				AboutTabState="now_playing";
			} 
			DomModifier.writeToBody('AboutTabState',AboutTabState);
			if (AboutTabState=="queue" || AboutTabState=="device_picker" ){
				let stickyDiv = document.getElementById('globalControlBar');
				if (stickyDiv) {
					stickyDiv.style.marginBottom = '0';
				} else {
					console.error('Sticky Div Not Found');
				}


			} else if (AboutTabState=="now_playing") {
				ag.addScrollBarBehavior();
				
				//FUNCTION TO ADJUST CONTROLBAR---------------------------
				let scrollableContainer = document.querySelector('#globalAboutTab div[data-testid="NPV_Panel_OpenDiv"]');//div[data-testid="NPV_Panel_OpenDiv"]
				let stickyDiv = document.getElementById('globalControlBar');
				if (!stickyDiv){
					console.error('Sticky Div Not Found2');
				}
				if (!scrollableContainer){
					console.error('scrollableContainer Div Not Found');
				} 
				if (scrollableContainer && stickyDiv) {
					
					scrollableContainer.id="scrollableContainerAboutTab";
					scrollableContainer.addEventListener('scroll', function(e) {//scrolltop 100
						console.log("hello from the other side");
						let scrollPercentage = ((scrollableContainer.scrollTop*100) / scrollableContainer.clientHeight);
						console.log('scrollPercentage ' + scrollPercentage);
						if (AboutTabState=="now_playing" ){
							// Adjust margin-bottom based on scroll percentage
							stickyDiv.style.marginBottom = `${scrollPercentage }vh`;
						} else{
							stickyDiv.style.marginBottom = '0';
						}
					});
			}
			//---------------------------------------------------------
			}
		}
		
	}

	//checkAboutTabState only triggered when we click
	globalBody.addEventListener("click", function(event) {
		
		setTimeout(function() {
			if (sys.get_currentStateOfControlBar()==true){
				console.log("should check about tab state");
				checkAboutTabState();
			}
			
		}, 500); // 500ms delay
	});

	globalBody.addEventListener("click", function(event) {
		
		setTimeout(function() {
			if (sys.get_currentStateOfControlBar()==true){
				Agent.CanvasOrArtworkAgent();
			}

		}, 1000); // 500ms delay

	});

	sys.enableMainView();/*Podariko*/
	sys.disableControlBar();
	// Initial check to set visibility when the page first loads
	
	ag.checkDomAndAct();
	return true; //done

}

// Function to add the button 
async function addLibraryButton(){ 
	let globalNavBar = document.querySelector('#global-nav-bar');
	if (globalNavBar) {
		let library_button = DomModifier.createButton("library-toggle-button",globalNavBar,'M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z');
		
		console.log('Button added to #global-nav-bar successfully.');
		
		library_button.addEventListener('click', debounce(function() {
			let library_expand_button = document.getElementById("ShowFullLibrary"); 
			if (sys.get_currentStateOfMainView() ==false){//library
				sys.enableMainView();
			} else {
				sys.disableMainView()
				if (library_expand_button.getAttribute('aria-label')=="Open Your Library")
					library_expand_button.click();
			}
		}, buttondelay)); // Adjust delay as needed
		return true;
	}
	

}

function doublescaleandupdateheight(div,transformOrigin,adjustheight) {
	if (div) {
		// Reset any previous transformations and height
		div.style.transform = '';
		div.style.height = 'fit-content';
		let savedheight = div.offsetHeight;//getBoundingClientRect().height;//.getBoundingClientRect().height/2;
		// Set the transform origin to the top-left
		div.style.transformOrigin = `${transformOrigin}`;

		// Apply the scale transformation to double the size
		div.style.transform = 'scale(2)';
		if (adjustheight) {
			
			// Double the height of the div based on its current (scaled) height
			console.log("SAVED HEIGHT: " + savedheight);
			div.style.marginTop = `${savedheight}px`;
		}
	}
}

async function addControlBarBehavior() {
	
	let globalControlBar = document.querySelector('#globalControlBar');
	let navbar = document.querySelector('#global-nav-bar');

	if (globalControlBar && navbar) {
		// //Initialise values on all  
		doublescaleandupdateheight(navbar,'bottom left',1);
		doublescaleandupdateheight(globalControlBar,'bottom left',0);

		globalControlBar.addEventListener('click', debounce(function(e) {
			const current = sys.get_currentStateOfControlBar(); 
			if (
				(current==false && (!e.target.closest('#playerControls')) )
			) {
				sys.enableControlBar();
			}
		}, buttondelay)); // Adjust delay as needed
		
		return true;
	}
		
}


window.onload = () => {
	
	DomModifier = new DomModifierClass();
	sys = new System();
	ag = new Agent(); 
	
	repeatUntilTrue(assignIDs);
	repeatUntilTrue(defineLogic);
	repeatUntilTrue(addLibraryButton);
	repeatUntilTrue(addControlBarBehavior);
	repeatUntilTrue(divideSearchBar);
	repeatUntilTrue(TrackColor);
	//execution continues normally, as if we launched async threads.
	//DO NOT DELETE THIS COMMENT
GM_addStyle(`
/*Main Layout Customisation + HomePage + Library*/
html{
    --left-sidebar-width:0;
    overflow:hidden;
    body{
        min-width: 0px; /* Disable spotify width limit */
        overflow:hidden;
        #main {
            overflow:hidden;
        }
    }
}

.os-scrollbar-handle{
        visibility: hidden;
}
#context-menu{
    &[data-placement="bottom-end"]{
        transform-origin:top right;
    }
    &[data-placement="bottom-start"]{
        transform-origin:bottom left;
    }
    scale:2;
}


div#main>div {
    --panel-gap: 2px !important;
    overflow:hidden;
    >div{ /*order all windows in top down view other for mobile layout*/
        display:flex;
        flex-direction: column-reverse;
        width:100vw;
        overflow:hidden;

    }
}


/*Anakatanomes MAIN stoixeiwn */
#global-nav-bar{                    /*Navigation top bar*/
    z-index:1;
    background-color: transparent !important;
    background: linear-gradient(to top, rgba(0, 0, 0, .94) 10%, rgba(0, 0, 0, 0.7)  );
    backdrop-filter: blur(0px);
    z-index:200;
    width:50%;
}


#Desktop_LeftSidebar_Id{            /*LIBRARY SIDEBAR*/

    position:absolute;
    top:0px;
    width: 100%;
    height:100vh;
    overflow:hidden;
    overflow-y:scroll;
    /**/

    will-change:position;/*will-change: transform, transform-origin, scale, visibility, position;*/

}
#globalControlBar{      /*spotify controls bottom bar*/

    background-color:black;
    order:1;
    width:50% !important;
    z-index: 10;
}

#mainpage{                          /*spotify main page */

    position:absolute;
    top:0px;
    overflow: auto;
    overflow-x:hidden;
    scrollbar-width: none;
    width:100%;
    height:100vh;
    border-radius:0px;
    will-change:position;

}



#globalAboutTab {               /*spotify about tab */
    position:absolute;
    display:flex;
    top:0px;left:0px;
    width:50vw;
    scrollbar-width: 0px;
    height:50vh ;
    transform-origin:top left;
    scale:2;

}


/*----------------------------------------------------------------------------------------------------VISIBILITIES CUSTOMIZATION*/


#globalBody[mainview="home"][controlbarexpanded="closed"]{
    #Desktop_LeftSidebar_Id
    {
        visibility:hidden ;
    }
    #mainpage{
        visibility:visible ;
        scrollbar-width: 0px;
    }
}

#globalBody[mainview="library"][controlbarexpanded="closed"]{
    #Desktop_LeftSidebar_Id{
        visibility:visible ;
    }
    #mainpage {
        visibility:hidden ;
    }
}

#globalBody[controlbarexpanded="open"]{
    #Desktop_LeftSidebar_Id,
    #mainpage
    {
        visibility:hidden ;
    }
    #global-nav-bar
    {
        visibility:hidden ;
        position:absolute;
    }
    #globalAboutTab{
        visibility:visible;
    }
}

#globalBody[controlbarexpanded="closed"]{
    #globalAboutTab {
        visibility:hidden;
        *{
            visibility:hidden;
        }
    }
}

/*------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------LIBRARY SIDEBAR CUSTOMIZATION*/
/*------------------------------------------------------------------------------------------------------*/
#globalBody[mainview="library"] #Desktop_LeftSidebar_Id {
    > :nth-child(1) {
        transform-origin:top left;
        transform-box:  fill-box;
        scale:2;
        width:50%;
        overflow:visible ;
        > :nth-child(1)> :nth-child(1){
            border-radius:0px;
            > :nth-child(2)  {
                padding-bottom:9vh;
            }
        }
    }
    .os-scrollbar-track{
        visibility: hidden;
    }
    #ShowFullLibrary{
        pointer-events: none;
    }
}
/*------------------------------------------------------------------------------------------------------*/

#mainpage>.main-view-container { /*main page adjustment to fit*/
    transform-origin: top left;
    transform: scale(2) ;
    width: 50%;

}
/*------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------SEARCH FORM*/
/*------------------------------------------------------------------------------------------------------*/
#globalBody[search="disabled"] form[data-encore-id="formInputIcon"]{ 
  visibility: hidden;
  display:none; 
}
 
/*------------------------------------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------SPOTIFY MAIN PAGE CUSTOMIZATION*/
/*------------------------------------------------------------------------------------------------------*/

#globalBody[mainview="home"] #mainpage{
    #SearchForm {
        all:unset;
        >span>div{
            padding-inline:0px;

            input {
                border-radius:0px;
            }
        }
    }
    .main-view-container { /*main page adjustment to fit*/
        will-change:scale;
        transform-origin: top left;
        transform: scale(2) ;
        width: 50%;

        section[data-testid="artist-page"] >:nth-child(1) >:nth-child(1){/*Make artist logo smaller on artist page*/
            min-width:20vh;
            height:20vh;
        }
        .under-main-view>div>div[data-testid="background-image"]{

            width:50vw;
            height:16vh;

        }

    }
    .contentSpacing{ /*remove giant spaces between content*/
        --shelf-gap-vertical: 0px;
        padding:3%;
    }

    .Shelf:not([aria-label="Browse all"]) > div{ /*Make albums visible for daily mix etc*/
        display:flex;
        overflow-x:auto;
        scrollbar-width:none;
        >div{
            display:flex;
            min-width:22vw;

        }
        img{ /*make logos not cut*/
            border-radius:0px;
        }
    }
    .os-size-observer + div { /*Fix scrolling x-axis on artist page*/
        overflow-x: hidden !important;
    }

    .os-scrollbar{ /*Hide all scrollbars on main page ig*/
        visibility: hidden;
    }

    .contentSpacing div[role="grid"]>div[role="presentation"]:has(div[data-testid="column-header-context-menu"]){ /*Remove #, Title, Time etiquettes*/
        visibility: hidden;
        position:absolute;

    }
    .contentSpacing:has(div[data-testid="playlist-tracklist"]),
    .contentSpacing:has(div[aria-label="popular tracks"]),
    .contentSpacing:has(div[data-testid="track-list"]){ /*create illusion of playing by clicking track*/
        div[role="row"]{
            &:hover{
                transform: scale(0.99);
            }
            transition: transform 50ms ease-in;
        }
        div[role="row"]
        {

            margin-inline:-5vw;
            >:nth-child(1){
                background-color:transparent; /*Disable gray highlight of the track*/
                >:nth-child(2){ /*Disable pointer events for track name and artist*/
                    pointer-events: none;
                }

                >:nth-child(1){/*Enlargen play button for track*/

                    >div{ /*Div that holds the button*/

                        position:relative;
                        height:100%;
                        >button{ /*Make button span all width of screen*/
                            background-color:transparent;
                            position:absolute;
                            left:0px;
                            height:100%;
                            width:100vw;
                            z-index:2;
                            svg{ /*Hide the play button triangle shape*/
                                visibility: hidden;
                            }
                        }

                    }
                }
            }
        }

    }
    #searchPage {

        div[data-testid="track-list"]{
            div[role="row"]
            {
                margin-inline:0px; /*undo margin fix for tracklist*/
            }

        }
        section[aria-label="Top result"]{
            visibility: hidden;
            position:absolute;
        }
    }
    .under-main-view+div{ /*Add bottom padding*/
        margin-bottom:0vh;
    }

    .main-view-container__mh-footer-container >nav>div{  /*Hide footer info download spotify free credits insta etc*/
        all:unset;
        display:block;
        height:0px !important;
        overflow: hidden !important;
    }
}
/*------------------------------------------------------------------------------------------------------*//*--------------------------------------------------------------------------------------------------------ABOUT TAB CUSTOMIZATION*/
#globalBody[controlbarexpanded="open"][AboutTabState="device_picker"] #globalAboutTab { /*change device screen*/

    & > :nth-child(1) {
        width:100% !important ;
        & > :nth-child(1) {

            width:100% !important;
            height:70%;
        }
    }
 }

#globalBody[controlbarexpanded="open"][AboutTabState="queue"] #globalAboutTab { /*queue screen*/
    & > :nth-child(1) {
        width:100% !important ;
        height:70%;
    }

 }

#globalBody[controlbarexpanded="open"][AboutTabState="now_playing"][visualiser="disabled"] #globalAboutTab {
    #Desktop_PanelContainer_Id>div>div{
         >:nth-child(1){
            background: var(--global-color);
        }
    }

    #scrollableContainerAboutTab {
        background: linear-gradient(to bottom, var(--global-color), black 50vh);
    }
}

#globalBody[controlbarexpanded="open"][AboutTabState="now_playing"][visualiser="enabled"] #globalAboutTab {
    #Desktop_PanelContainer_Id>div>div{
         >:nth-child(1){
            background:transparent !important;
        }
    }
}

/**/

#globalBody[controlbarexpanded="open"][AboutTabState="now_playing"] #globalAboutTab { /*now playing view*/

    >:nth-child(1){
        width:100% !important;
        >:nth-child(1){
            width:100%!important ;

            border-radius: 0px;
        }

    }

    #Desktop_PanelContainer_Id{
        >:nth-child(1)>:nth-child(2)>:nth-child(1){
            overflow-x: hidden !important;
            >*{
                width:100% !important; 
                padding:unset;
                >*{
                    width:100% !important; 
                }
            }
            
        }
        .cIUedsmg_cTnTxvOYTKR{
            min-width:100% !important;
        }
        >div>div{
            display:contents;
            button{
                visibility: hidden;
                display:none;
            }
            button[data-testid="more-button"]{
                visibility: visible;
                display:flex; 
            }
        }
    }
    .os-size-observer+ div > :nth-child(1) > :nth-child(1){ /*give space to the screen so everything is visible*/

        padding-bottom:12vh;
        > :nth-child(1){
            height:50vh;
        }

    }
    div[data-testid="NPV_Panel_OpenDiv"]{
        >:nth-child(1)>:nth-child(1){
            height:50vh;padding-top:20%;
            >:nth-child(2){ /*Hide artist title and gradient*/
                visibility:hidden;
            }
        }
        a div{ /*style track image*/
            border-radius:13px;
            scale:0.989;
        }

    }


    .canvasVideoContainerNPV{
        /*aspect-ratio: 720/1550;*/
    }
    button[aria-label="Close"]{
        visibility: hidden;
        position:absolute;
    }
    #videoart{
        width:100%;
    }

}/*------------------------------------------------------------------------------------------------------NAVBAR CUSTOMIZATION*/


#globalBody[controlbarexpanded="closed"] #global-nav-bar{ /*zoom all divs in search tabs*/

    left:flex-start;
    width:51% !important;
    >*{
        flex:1; height:100%;
    }
    >:nth-child(1){ /*Hide Spotify Logo - Backarrow forwardarrow*/

        visibility:hidden;
        position:absolute;
    }
    >:nth-child(2){ /*Spotify Home*/
        justify-content:center ;
        button{
            flex:1;
            margin-inline:0px;
        }
    }

    >:nth-last-child(3){ /*div contains notifButton, avatar*/
        max-width:fit-content;
        order:4;
        >*{
            width:auto;
        }
    }
     #ChangeToSearch{
        order:2;
    }

    #library-toggle-button{
        order:3;
    }

    #notifButton{
        all:unset;
        order:4;
    }
    #notifButton + * {
        order:5;
        >figure{
            max-width:fit-content;
        }

    }


    #SPdownloadButton,#SPpremiumButton{
        visibility:hidden !important;
        position:absolute;

    }

    #notifButton{
        visibility: visible !important;
    }
    button{
         background-color:transparent !important;

    }

}

/*------------------------------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------SPOTIFY CONTROLS CUSTOMIZATION*/
#globalBody[controlBarExpanded="closed"] #globalControlBar{ /*Closed state*/
    will-change:position;
    width:49% !important;
    margin-left:1%;
    border-radius:5px;
    margin-bottom:0px !important; /*reset dynamic value from auto adjust in open mode*/
    background: var(--global-side-color);
    >:nth-child(1){
        pointer-events: none; /*SOS: disable interactions*/
        min-width:100%;
        #playerControls{ /*SOS: only let controls be touched*/
            pointer-events: auto;
        }
        >:nth-child(1){

            >:nth-child(3){
                visibility:hidden;
                position:absolute;
            }
            >:nth-child(2){
                width:fit-content;
                >:nth-child(1){
                    >:nth-child(1){


                        >:nth-child(1)>:nth-child(1){
                            visibility:hidden;
                            position:absolute;

                        }
                        >:nth-child(3)>:nth-child(2){
                            visibility:hidden;
                            position:absolute;
                        }
                    }
                    >:nth-child(2){
                        overflow:visible;

                        >:nth-child(1),>:nth-child(3){
                            visibility:hidden;
                            position:absolute;
                        }
                        >:nth-child(2){
                            visibility:visible;
                            position: fixed;
                            width:98%;
                            left:0px;
                            bottom:0%;
                            padding-left:2%;
                        }

                    }
                }

            }
            >:nth-child(1){
                width:100%;

                [aria-checked="false"]{ /*hide the plus button if song isnt added to playlist*/
                    visibility: hidden;
                }
            }

        }
        >:nth-child(2){/*Playing on DEVICE*/
            background-color:transparent;
            height:fit-content;
            padding:0vh;
            margin-bottom:0.5vh;
            >button>span{
                font-size: xx-small;
                color : #1ed760;


            }
            >svg{
                height:.5vh !important;
                fill: #1ed760;
            }

        }
    }

}


#globalBody[controlBarExpanded="open"] #globalControlBar{

    background-color:transparent !important;
/*     background: linear-gradient(to top, rgba(0, 0, 0, .94) 10%, rgba(0, 0, 0, 0.7)  );
    backdrop-filter: blur(2px); */
    > footer{
        min-width:0px;
        width:100%;
    }
    #subControlBar{

       /* Topothetei to ena katw ap tallo ta controls hxou kai ta megalwnei*/

        flex-direction: column;       /* Stack items vertically */
        height:fit-content;
        align-items: center;
        gap:1.8vw;
        padding-left: 2.5vw;
        padding-right: 2.5vw;
        > :nth-child(1) { /*COVER TITLE ARTIST PART*/

            align-self: flex-start;
            width: 100%;
            padding-left:unset;
            margin-left:unset;
            margin-top:0.5vh;
            >:nth-child(1){
                >:nth-child(1){
                    visibility:hidden;
                    position:absolute;
                }
                >:nth-child(2){
                    flex:1;
                    margin:unset;
                    *{
                        font-size:1rem;
                    }

                }
            }
        }

        > :nth-child(2),
        > :nth-child(3) { /*playstop and buttons*/
            align-items: center;
            align-self:center;
            width:100%;

        }


        > :nth-child(2){

            max-width:100%;
            width:100%;

            > div{
                flex-direction: column-reverse;
                gap:2vw;
                >:nth-child(1){
                    width:fit-content;
                    gap:5vw;
                    >*{
                        scale:1;
                        >*{
                            scale:1.5;
                        }
                    }

                    >:nth-child(1){
                        max-width:fit-content;
                        display:contents;
                    }
                    >:nth-child(2)>:nth-child(1){
                        scale:1.8;
                    }
                    >:nth-child(3){background-color:green;
                        max-width:fit-content;
                        display:contents;
                    }

                }
                >:nth-child(2){

                    display: grid;
                    grid-template-rows: auto auto; /* Two rows */
                    grid-template-columns: 1fr fit-content 1fr;
                    grid-template-areas:
                        "item2 item2 item2"  /* Row 1: Item 1 spans both columns */
                        "item1 . item3";
                    gap:0px;
                    >:nth-child(1){ /*Left time marker*/
                        grid-area: item1;
                        min-width:0px;
                    }
                    >:nth-child(2){ /*Time bar*/
                        grid-area: item2;
                    }
                    >:nth-child(3){/*Right time marker*/
                        grid-area: item3;
                        min-width:0px;
                    }
                }
            }

        }

        #ShowAboutTab,
        > :nth-child(3)> div > :nth-child(6) /*hide fullscreen button*/
        {
            visibility: hidden ;
            position: absolute;
        }

        > :nth-child(3){
            width:fit-content;
        }

    }
}

/*------------------------------------------------------------------------------------------------------*/
`);
	//DO NOT DELETE THIS COMMENT
	ag.initialise_basic_elements(); 
	ag.addScrollBarBehavior();
	
	console.log('continuing'); 

	// Select all link elements that reference stylesheets-------------------
	const links = document.querySelectorAll('link[rel="stylesheet"]');
	
	// Loop through the links and remove the ones we dont need based on their name
	links.forEach(link => {
		if (link.href.includes('dwp-lyrics-cinema-mode-container') || link.href.includes('dwp-full-screen-mode-container')) { // Match the CSS file with the substring
			link.parentNode.removeChild(link); // Remove the <link> element
			console.log('CSS file removed:', link.href); // Optional: Log for debugging
		}
	});

	console.log("AAAAAAAAAAAAAAPage fully loaded. Executing script...");
	

	 
};



