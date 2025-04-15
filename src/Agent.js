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
		this.stateChangedAgent();
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
			console.log('ScrollableDivNotFound');
			return;
		}
		console.log('ScrollableDivFound');
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
