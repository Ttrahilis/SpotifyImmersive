let DomModifier;
let sys;
let ag;

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

(function() {
    /*GM_addStyle*/
    'use strict';
    const buttondelay=200;
    //GLOBAL VARIABLES START
    let AboutTabState; //State of about tab
    //GLOBAL VARIABLES END
    // Define an array of objects with your desired selectors and corresponding new IDs
    let divsToModify = [
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
        { selector: '#moreControls>button[aria-label="Lyrics"]', newId: "LyricsButton", selfDestruct:1 },
		
        {selector: '#moreControls > :nth-child(1)', newId: "ShowAboutTab", selfDestruct:1},
        { selector: '#subControlBar> :nth-child(3)> :nth-child(1)', newId: "moreControls", selfDestruct:1 },
        { selector: '#globalControlBar > footer > :nth-child(1)', newId: "subControlBar", selfDestruct:1 },
        { selector: '#globalAboutTab img[data-testid="cover-art-image"]', newId: "coverart", selfDestruct:1 },
        { selector: "#mainpage + div", newId: "globalAboutTab", selfDestruct:1 },
        { selector: "#globalControlBar + div", newId: "mainpage", selfDestruct:1 },
        { selector: "#Desktop_LeftSidebar_Id + div", newId: "globalControlBar", selfDestruct:1 },
        { selector: "html>body", newId: "globalBody", selfDestruct:1 },
    ];

    let unNecessaryCount=0;
    const countAllUnNecessaries = () => {
        for (let i = divsToModify.length - 1; i >= 0; i--) {
            if (divsToModify[i].necessary==0){
                unNecessaryCount++;
            }
        }
    };
    countAllUnNecessaries();
    console.log('unnec count' + unNecessaryCount);
    // Function to assign IDs to matching elements
    const assignIDs = () => {
        if (divsToModify.length<=unNecessaryCount){
            return 0;
        }
        //else {
            //console.error('found it '+divsToModify[0].newId);
        //}
        for (let i = divsToModify.length - 1; i >= 0; i--) { //Iterate the list backwards

            const { selector, newId, newClass,selfDestruct } = divsToModify[i];
            // Perform your operations here
            if (newId){
                const element = document.querySelector(selector);
                if (element && !element.id) { // Assign ID only if it doesn't already exist
                    element.id = newId;
                    console.log(`Assigned ID "${newId}" to element matching selector "${selector}"`);
                    if (divsToModify[i].necessary==0){
                        unNecessaryCount--;
                    }
                    if (selfDestruct==1){ //remove element from list if its not meant to be tagged/id'ed'/classed twice
                        divsToModify.splice(i, 1);
                        console.log(divsToModify.length + 'LEFT');
                    }
                }
            } else if (newClass) {
                const elements = document.querySelectorAll(selector); // Get all matching elements
                elements.forEach(element => {
                    if (element) { // Add class only if element exists
                        element.classList.add(newClass);
                        console.log(`Added class "${newClass}" to element matching selector "${selector}"`);
                    }
                });
            }

        }
    };

	let divideSearchBar_flag=false;
    const divideSearchBar = () => {
		if (divideSearchBar_flag==true){return;}
        let SearchForm = document.querySelector("#SearchForm");

        let globalNavBar = document.querySelector('#global-nav-bar');
        let browseButtonOld = document.querySelector('#browseButtonOld');


        if (browseButtonOld && globalNavBar){ 
			
            let mainViewContainer = document.querySelector(".main-view-container");

            if (mainViewContainer && SearchForm){
				mainViewContainer.insertBefore(SearchForm, mainViewContainer.firstChild);
				
				if (!document.querySelector(`#globalBody form[data-encore-id="formInputIcon"]`)){
					return;
				} else{
					divideSearchBar_flag=true;
				}
				let browseButtonNew = DomModifier.createButton("browseButtonNew",globalNavBar,'M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z');
				
				browseButtonNew.addEventListener('click', debounce(function() {
					sys.toggleSearchBar();
				}, buttondelay)); // Adjust delay as needed

            }
        }
    };

    DomModifier = new DomModifierClass();
    sys = new System();
    ag = new Agent();

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
            return 1;
        }
        // Get the image element
        const img = document.querySelector('#globalControlBar img[data-testid="cover-art-image"]');

        if (!img) {
            console.log("Image not found");
            return 0;
        }

        // Ensure the image has the crossOrigin attribute if it's from a different origin
        img.crossOrigin = 'Anonymous';

        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

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


    let logicdefined=0;
    const defineLogic = () => { 
        if (logicdefined==1){
            return 1;
        }
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
                        scrollableContainer.addEventListener('scroll', function() {//scrolltop 100
                            let scrollPercentage = ((scrollableContainer.scrollTop*100) / scrollableContainer.clientHeight);
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
        logicdefined=1;
        ag.checkDomAndAct();


    };

    // Function to add the button
	let addLibraryButton_flag=false;
    const addLibraryButton = () => { 
        if (addLibraryButton_flag==false) {
            let globalNavBar = document.querySelector('#global-nav-bar');
            if (globalNavBar) {
				let library_button = DomModifier.createButton("library-toggle-button",globalNavBar,'M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z');
				
                console.log('Button added to #global-nav-bar successfully.');
 
				const handleClick = (e) => {
					let library_expand_button = document.getElementById("ShowFullLibrary"); 
					if (sys.get_currentStateOfMainView() ==false){//library
						sys.enableMainView();
					} else {
						sys.disableMainView()
						if (library_expand_button.getAttribute('aria-label')=="Open Your Library")
							library_expand_button.click();
					}
					// Temporarily disable the listener
					library_button.removeEventListener('click', handleClick);
					setTimeout(() => library_button.addEventListener('click', handleClick), buttondelay);
		
				};
				library_button.addEventListener('click', handleClick);
				addLibraryButton_flag=true; 
            }
        }
		return addLibraryButton_flag;

    };
    
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
	let addControlBarBehavior_flag=false;
    const addControlBarBehavior = () => {
		if (addControlBarBehavior_flag==false){
			let globalControlBar = document.querySelector('#globalControlBar');
			let navbar = document.querySelector('#global-nav-bar');
		
			if (globalControlBar && navbar) {
				// //Initialise values on all  
				doublescaleandupdateheight(navbar,'bottom left',1);
				doublescaleandupdateheight(globalControlBar,'bottom left',0);

				//toggleControlBar
				const handleClick = (e) => {
					const current = sys.get_currentStateOfControlBar(); 
					if (
						(current==false && (!e.target.closest('#playerControls')) )
					) {
					   
						sys.enableControlBar();
						globalControlBar.removeEventListener('click', handleClick);
						setTimeout(() => globalControlBar.addEventListener('click', handleClick), buttondelay);
					}
				};
				globalControlBar.addEventListener('click', handleClick);
				addControlBarBehavior_flag=true;
			}
            
            
        }
	return addControlBarBehavior_flag;


    }

    // Observe mutations on the DOM
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                const checks = [
                    addLibraryButton() == 1,
                    addControlBarBehavior() == 1,
                    divideSearchBar() ==1,
                    defineLogic() == 1,
                    //OptimisationAttempt()==1,
                    assignIDs() == 0
                ];

                if (checks.every(Boolean)) {
                    TrackColor();
                    ag.addScrollBarBehavior();
					ag.initialise_basic_elements(); 
                    console.log('disconnecting observer');
                    observer.disconnect();
				
                    // Select all link elements that reference stylesheets-------------------
                    const links = document.querySelectorAll('link[rel="stylesheet"]');

                    // Loop through the links and remove the ones we dont need based on their name
                    links.forEach(link => {
                        if (link.href.includes('dwp-lyrics-cinema-mode-container') || link.href.includes('dwp-full-screen-mode-container')) { // Match the CSS file with the substring
                            link.parentNode.removeChild(link); // Remove the <link> element
                            console.log('CSS file removed:', link.href); // Optional: Log for debugging
                        }
                    });
                    //--------------------------------------------------------------------------
                    break;
                    console.error('still here');

                }

            }
        }
    });

    // Start observing the document body
    observer.observe(document.body, {
        childList: true, // Watch for added/removed child nodes
        subtree: true, // Watch entire DOM subtree
        attributes: true, // Watch for attribute changes (optional)
    });
    console.log("MutationObserver script initialized. Monitoring DOM for changes...");
    // Initial assignment in case elements are already present on page load
    assignIDs();
    // Inject custom styles using GM_addStyle
    window.onload = () => {
        console.log("AAAAAAAAAAAAAAPage fully loaded. Executing script...");
        
    
		document.body.classList.add('hidden');
               
        document.body.classList.remove('hidden');
    };

})();