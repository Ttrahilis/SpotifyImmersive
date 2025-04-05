// ==UserScript==
// @name         SpotifyImmersive
// @namespace    https://github.com/ttrahilis/SpotifyImmersive
// @version      0.9.5.6
// @description  Mobile Interface injection for Spotify Desktop Site
// @author       ttrahilis
// @match        https://open.spotify.com/*
// @run-at       document-end
// @grant GM_addStyle
// ==/UserScript==

(function() {
    /*GM_addStyle*/
    'use strict';
    const buttondelay=200;
    //GLOBAL VARIABLES START
    let AboutTabState; //State of about tab
    //GLOBAL VARIABLES END
    // Define an array of objects with your desired selectors and corresponding new IDs
    const divsToModify = [
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


    const divideSearchBar = () => {
        let SearchForm = document.querySelector("#SearchForm");

        if (SearchForm && SearchForm.dataset.moved==1){
            return 1;
        }

        let globalNavBar = document.querySelector('#global-nav-bar');
        let browseButtonOld = document.querySelector('#browseButtonOld');


        if (browseButtonOld && globalNavBar){
            if (browseButtonOld.dataset.moved!=1){

                browseButtonOld.dataset.moved=1; /*if u get through here then no need to rerun*/

                SearchForm.dataset.readyToMove=1;
                let browseButtonNew = document.createElement('button');
                browseButtonNew.id="browseButtonNew";
                browseButtonNew.style.cursor = 'pointer';
                browseButtonNew.style.outline = 'none';
                browseButtonNew.style.border = 'none';

                globalNavBar.appendChild(browseButtonNew);


                let pathData = 'M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z';
                browseButtonNew.appendChild(createSVGWithPath(pathData));

                
                browseButtonNew.addEventListener('click', function() {
                    sys.push_currentState('search','/search');
                });

            }

            let mainViewContainer = document.querySelector(".main-view-container");

            if (mainViewContainer && SearchForm && SearchForm.dataset.readyToMove==1){
                if (SearchForm.dataset.moved!=1) {
                    SearchForm.dataset.moved=1;
                    mainViewContainer.insertBefore(SearchForm, mainViewContainer.firstChild);

                }

            }
        }
    };

    const OptimisationAttempt = () => {

    };
    // ------------------------------------------------------------------------------------------------------------------------
    class DomModifierClass {//Does all the Changes of values we used to mark the states of the dom
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
    }

    const DomModifier = new DomModifierClass();
// ------------------------------------------------------------------------------------------ CLASSES
    class System {
        #secret; // Private field
        #currentState;
        oldState;
        #VisualiserEnabled;
        #global_color;
        #global_side_color;


        #main_view;//e.g. home library search
        #about_tab; // e.g. enabled / disabled (the full view of about tab and expanded control bar)
        #about_tab_state; //e.g. now_playing
        constructor() {
            DomModifier.createCssVariable('--global-color','black');
            DomModifier.createCssVariable('--global-side-color','black');
            this.#currentState = null;
        }

        #revealSecret() { // Private method
            console.log(`Secret is: ${this.#secret}`);
        }

        showSecret() {
            this.#revealSecret(); // Works inside class
        }
        //Setters

        set_currentState(currentState){
            this.oldState= this.#currentState; //save old State
            this.#currentState = currentState ; //save current State
            ag.checkDomAndAct();
        }
        push_currentState(currentState,url){
            if ( (currentState!='about' && this.#currentState=='about' ) || currentState=='about') { //prevent pushing of previous state if we have about enabled
                this.set_currentState(currentState); //Set state without using push api (not triggering history)
                return;
            }
            this.oldState=this.#currentState; //Keep old state
            this.#currentState=currentState;
            if (url===null){
                url = window.location.href;
            }
            history.pushState({ page: `${currentState}` }, `${currentState}`, url);
            
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

        //Getters
        get_currentState(){
            return this.#currentState;
        }
        get_VisualiserEnabled(){
            return this.#VisualiserEnabled;
        }
        get_global_colors(){
            return [this.#global_color,this.#global_side_color];
        }

    }



    // ------------------------------------------------------------------------------------------------------------------------

    class Agent{ //Reads/Discovers all the states of the DOM based on complex relationships identified by the programmer
        globalBody;
        ShowAboutTab;
        globalAboutTab;
        ShowFullLibrary;
        SearchForm;

        currentUrl="";
        oldUrl;

        constructor (){
            this.stateChangedAgent();
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

        stateChangedAgent(){ //Creates a trigger for when a state is changed (pushed programmatically, user clicking through spotify app, backwards/forwards button on browser)
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            this.oldUrl = window.location.href; // Store initial URL

            const onStateChange = (origin) => {
                console.log('get_currentState() ' + sys.get_currentState() + ' oldstate ' + sys.oldState + ' origin ' + origin);
                if (sys.oldState!='about' && sys.get_currentState()=='about' && origin==='pop'){ //if we managed to hit the about tab from using back button navigation, skip the about tab we dont want it
                    console.log('no need to go back to about tab');
                    window.history.back();
                } else if (sys.oldState==='about' && origin==='pop' && sys.get_currentState()==='undefined' ){//if oldState is about and we got here using the back button, prevent actually going back
                    console.log('Lets try to avoid closing about and going back simultaneously. push url: ' + this.oldUrl);
                    //sys.push_currentState('undefined',this.oldUrl);
                    //history.pushState("", "", this.oldUrl);

                }

                if (this.currentUrl !== this.oldUrl) { //may be used for future stuff
                    //console.log("URL literally changed:", this.currentUrl);
                    this.oldUrl = this.currentUrl;
                } else {
                    //console.log("URL not literally changed but state pushed");
                }
                //this.checkDomAndAct(); gets executed in set_currentState();
            };

            //Caution: when clicking through spotify it returns currentState undefined
            history.pushState = function(...args) {
                originalPushState.apply(history, args);
                sys.set_currentState(history.state.page);
                console.log ('Push state:' + sys.get_currentState());
                onStateChange('push');
            };

            history.replaceState = function(...args) {
                originalReplaceState.apply(history, args);
                sys.set_currentState(history.state.page);
                console.log ('Replace state:' + sys.get_currentState());
                onStateChange('replace');
            };


            window.addEventListener("popstate", function(event) {
                sys.set_currentState(event.state.page);// Save the state when navigating back/forward
                console.log ('Pop state:' + sys.get_currentState());
                onStateChange('pop');
            });
        };

        checkDomAndAct() {

            // Check if the current page starts with "/search/" (using pathname)
            let window_loc_path=window.location.pathname;
            if (window_loc_path.startsWith('/search')) {
                this.SearchForm.style.display = 'block'; // Show the search form if on "/search/**"
            } else {
                this.SearchForm.style.display = 'none'; // Hide the search form for other URLs

            }
            if (sys.get_currentState()==='library') {
                DomModifier.writeToBody('mainview', 'library');
                DomModifier.writeToBody('controlbarexpanded', 'closed');
                if (this.ShowFullLibrary.getAttribute('aria-label') == 'Expand Your Library'){// if (checkforDIV(divthatshowsLibraryIsNOTExpanded)){LibraryDiv.click()}
                    this.ShowFullLibrary.click();
                }

            } else if (sys.get_currentState()==='home' || sys.get_currentState()==='undefined' ) {
                DomModifier.writeToBody('mainview', 'home');
                DomModifier.writeToBody('controlbarexpanded', 'closed');
            } else if (sys.get_currentState()==='about'){
                DomModifier.writeToBody('controlbarexpanded', 'open');
                // if (checkforDIV(divthatshowsAboutTab(TrackInfo)IsNOTExpanded)){AboutTab(TrackInfobutton).click()}
                if (!this.globalAboutTab.firstChild.firstChild){// if (checkforDIV(divthatshowsLibraryIsNOTExpanded)){LibraryDiv.click()}
                    this.ShowAboutTab.click();
                }



                if (!document.getElementById('videoart')){
                    let videoart=document.querySelector('.canvasVideoContainerNPV > video');
                    if (videoart){
                        videoart.id='videoart';
                    }
                }

            } else {
                DomModifier.writeToBody('controlbarexpanded', 'closed');
                DomModifier.writeToBody('mainview', 'home');

            }



        }

        addScrollBarBehavior(){
            const scrollableDiv = document.querySelector('#globalAboutTab .os-size-observer + div');

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
                        sys.push_currentState('home', null);
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
                        sys.push_currentState('home', null);
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

// ------------------------------------------------------------------------------------------------------------------------
    const sys = new System();
    const ag = new Agent();

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

        ag.initialise_basic_elements()


        // Call the function to get the primary color


        function checkAboutTabState(){
            if (sys.get_currentState()==="about"){ //So we dont waste computational power
                if (document.querySelector('#globalAboutTab div[data-testid="device-picker-row-sidepanel"]')) {
                    AboutTabState="device_picker";
                } else if (document.querySelector('#globalAboutTab [aria-label="Queue"]')){
                    AboutTabState="queue";
                } else if (document.querySelector('#globalAboutTab [aria-label="Now playing view"]')){
                    AboutTabState="now_playing";
                }
                globalBody.setAttribute('AboutTabState', AboutTabState);
                if (AboutTabState=="queue" || AboutTabState=="device_picker" ){
                    const stickyDiv = document.getElementById('globalControlBar');
                    if (stickyDiv) {
                        stickyDiv.style.marginBottom = '0';
                    }


                } else if (AboutTabState=="now_playing") {
                    ag.addScrollBarBehavior();
                    //FUNCTION TO ADJUST CONTROLBAR---------------------------
                    const scrollableContainer = document.querySelector('#globalAboutTab .os-size-observer + div ');//div[data-testid="NPV_Panel_OpenDiv"]
                    const stickyDiv = document.getElementById('globalControlBar');

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
                if (sys.get_currentState()=='about'){
                    checkAboutTabState();
                }
                
            }, 500); // 500ms delay
        });

        globalBody.addEventListener("click", function(event) {

            setTimeout(function() {
                if (sys.get_currentState()=='about'){
                    Agent.CanvasOrArtworkAgent();
                }

            }, 1000); // 500ms delay

        });

        sys.push_currentState('home',null);/*Podariko*/

        // Initial check to set visibility when the page first loads
        logicdefined=1;
        ag.checkDomAndAct();


    };

    // Function to add the button
    const addLibraryButton = () => {
        let globalBody = document.querySelector('#globalBody');
        let valuetoset = 'mainview';
        if (globalBody.hasAttribute(valuetoset)){
                        return 1;
        }
        if (!document.querySelector('#library-toggle-button')) {
            let library_button = document.createElement('button');
            library_button.id = 'library-toggle-button'; // Assign a unique ID
            library_button.style.cursor = 'pointer';
            library_button.display = 'block';
            library_button.style.width = 'fit-content';
            library_button.style.height = '100%';
            library_button.style.background = 'transparent';
            library_button.style.outline = 'none';
            library_button.style.border = 'none';

            let globalNavBar = document.querySelector('#global-nav-bar');
            

            if (globalNavBar && globalBody) {

                globalNavBar.appendChild(library_button);
                let pathData = 'M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z';

                library_button.appendChild(createSVGWithPath(pathData)); //Add colors

                console.log('Button added to #global-nav-bar successfully.');

                const div = library_button.querySelector('svg');
                if (div) {
                    if (!globalBody.hasAttribute(valuetoset)) {
                        globalBody.setAttribute(valuetoset, 'home'); // Arxikopoihsh
                        const handleClick = (e) => {
                            const current = globalBody.getAttribute(valuetoset);
                            const newValue = current === 'home' ? 'library' : 'home';

                            //globalBody.setAttribute(valuetoset, newValue);
                            //console.log('Attribute toggled:', newValue);
                            if (newValue==='library'){
                                sys.push_currentState('library',null);
                            } else {
                                sys.push_currentState('home',null);
                            }

                            // Temporarily disable the listener
                            div.removeEventListener('click', handleClick);
                            setTimeout(() => div.addEventListener('click', handleClick), buttondelay);

                        };

                        div.addEventListener('click', handleClick);
                        return 1;
                    }
                }




            }


        }

    };
    function createSVGWithPath(pathData) {
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
    const addControlBarBehavior = () => {
        let globalBody = document.querySelector('#globalBody'); //Will keep the value of change
        let valuetoset = 'controlBarExpanded';
        if (globalBody.hasAttribute(valuetoset)){
            return 1; //No need to proceed if value has been set once
        }
        const div = document.querySelector('#globalControlBar');
        
        let navbar = document.querySelector('#global-nav-bar');

        if (div && !globalBody.hasAttribute(valuetoset) && globalBody && navbar) {
            //Initialise values on all
            globalBody.setAttribute(valuetoset, 'closed'); // Set 'var' to closed if it doesn't have a value
            //
            doublescaleandupdateheight(navbar,'bottom left',1);
            doublescaleandupdateheight(div,'bottom left',0);


            const handleClick = (e) => {
                const current = globalBody.getAttribute(valuetoset);
                if (
                    
                    (current=='closed' && (!e.target.closest('#playerControls')) )
                ) {
                   
                    const newValue = current === 'open' ? 'closed' : 'open';
                    //Update values on all
                    if (newValue==='open'){
                        sys.push_currentState('about',null);
                    } else {
                        sys.push_currentState('home',null);
                        doublescaleandupdateheight(div,'bottom left',0);
                    }
                    //
                    //console.log('Attribute toggled:', newValue);
                    // Set the transform origin to the top left

                    
                    
                    // Temporarily disable the listener
                    div.removeEventListener('click', handleClick);
                    setTimeout(() => div.addEventListener('click', handleClick), buttondelay);
                }
            };

            div.addEventListener('click', handleClick);
            return 1;
        }



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
                    console.log('disconnecting observer');
                    observer.disconnect();
                    if (1){ //1=debugging
                        // Object.keys(window).forEach(key => {
                        // unsafeWindow[key] = window[key];
                        // });
                        unsafeWindow.sys = sys;
                    }

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
        // Your script logic here
    
document.body.classList.add('hidden');
        try { GM_addStyle(`









    /*MINI SPOTIFY STYLE WORKS ON FIREFOX ANDROID WITH USERAGENT & TAMPERMONKEY*/
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


/*--------------------------------------------------------------------------------------------------------ABOUT TAB CUSTOMIZATION*/
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
#globalBody[controlbarexpanded="open"][AboutTabState="now_playing"] #globalAboutTab { /*now playing view*/

    >:nth-child(1){
        width:100% !important;
        >:nth-child(1){
            width:100%!important ;

            border-radius: 0px;
        }

    }

    #Desktop_PanelContainer_Id>div>div{
        display:contents;
        >:nth-child(1)>:nth-child(1){
            translate:3vw;
            left:10vw;

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

}





/*------------------------------------------------------------------------------------------------------*/
        /*------------------------------------------------------------------------------------------------------NAVBAR CUSTOMIZATION*/


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

/*----------------------------------------------------------------------------------------------------LIBRARY SIDEBAR CUSTOMIZATION*/

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

/*--------------------------------------------------------------------------------------------------------SPOTIFY MAIN PAGE CUSTOMIZATION*/

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
/*------------------------------------------------------------------------------------------------------*/








`);
        }catch (e) {
            console.error("gm_addStyle is not defined or failed to execute:", e);
        }
        document.body.classList.remove('hidden');
    };

})();