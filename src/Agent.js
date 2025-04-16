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
