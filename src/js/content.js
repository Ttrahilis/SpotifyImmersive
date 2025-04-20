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
	  //Resume app activity for some seconds
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
			if (document.querySelector(`#browseButtonNew`)){ //If it already exists dont add it again
				return true;
			}
			let browseButtonNew = DomModifier.createButton("browseButtonNew",globalNavBar,'M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z');
			if (!browseButtonNew){
				return;
			}
			
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
	let globalControlBar = ControlBarClass.getControlBar();
	if (globalBody && ShowFullLibrary && globalAboutTab && ShowAboutTab && SearchForm && globalControlBar){
	}else {
		return;
	}

	ag.initialise_basic_elements(); 

	// Call the function to get the primary color


	

	//checkAboutTabState only triggered when we click
	globalBody.addEventListener("click", function(event) {
		
		setTimeout(function() {
			if (sys.get_currentStateOfControlBar()==true){ 
				ag.checkAboutTabState();
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
		if (document.querySelector(`#library-toggle-button`)){ //If it already exists dont add it again
			return true;
		} 
		let library_button = DomModifier.createButton("library-toggle-button",globalNavBar,'M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z');
		if (!library_button){
			return;
		}
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

async function addControlBarBehavior() { //Sets trigger that lets user enter about tab
	
	let globalControlBar = ControlBarClass.getControlBar();
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
	
	if (repeatUntilTrue(assignIDs)){
		repeatUntilTrue(defineLogic);
		repeatUntilTrue(addLibraryButton);
		repeatUntilTrue(addControlBarBehavior);
		repeatUntilTrue(divideSearchBar); 
		if (repeatUntilTrue(TrackColor)){ 
		}
	}
	
	//execution continues normally, as if we launched async threads.
	//DO NOT DELETE THIS COMMENT
	//INSERT_GM_ADDSTYLE_HERE
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



