// High level interface for handling app(ignoring DOM specific details)
class System {
	#secret; // Private field
	#currentState;
	oldState;
	#VisualiserEnabled;
	#global_color;
	#global_side_color;

	
	#main_view;//e.g. home library search
	#about_tab; // e.g. true/false = enabled / disabled (the full view of about tab and expanded control bar)
	#about_tab_state; //e.g. now_playing
	constructor() {
		DomModifier.createCssVariable('--global-color','black');
		DomModifier.createCssVariable('--global-side-color','black');
		this.#currentState = null;
		this.#about_tab = true;
	}

	#revealSecret() { // Private method
		console.log(`Secret is: ${this.#secret}`);
	}

	showSecret() {
		this.#revealSecret(); // Works inside class
	}
	//Setters
	
	//
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
	//
	syncDomState(){
		let state=this.#currentState;
		if (state=='library' || state=='home'){
			DomModifier.writeToBody('mainview',state);
			if (this.#about_tab==true){
				this.toggleControlBar();
			}
		}
	}
	
	set_currentState(currentState){
		this.oldState= this.#currentState; //save old State
		this.#currentState = currentState ; //save current State
		this.syncDomState();ag.checkDomAndAct();
	}
	
	push_currentState(currentState,url){
		if ( (currentState!='about' && this.#currentState=='about' ) || currentState=='about' || this.oldState==this.#currentState) { //prevent pushing of previous state if we have about enabled
			this.set_currentState(currentState); //Set state without using push api (not triggering history)
			return;
		}
		this.oldState=this.#currentState; //Keep old state
		this.#currentState=currentState;
		if (url===null){
			url = window.location.href;
		}
		
		this.syncDomState();history.pushState({ page: `${currentState}` }, `${currentState}`, url);
		
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

//window.System = System;