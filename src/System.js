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
 