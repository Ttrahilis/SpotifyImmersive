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
