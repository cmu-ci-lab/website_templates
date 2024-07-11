var ImageBox = function(parent, config) {
	var box = this;
	
	this.elements = config.elements;
	this.names = config.names;
	
	this.selectorGroup = document.createElement("ul"); 
	this.selectorGroup.className = "selector-group";
	
	this.selectors = [];
	for (var i = 0; i < this.elements.length; i++) {
		var selector = document.createElement("li");
		selector.className = "selector";
		if (i == 0)
			selector.className += " active";
		selector.appendChild(document.createTextNode(this.names[i]));
		
		selector.addEventListener("mouseover", function(idx, event) {
			this.selectImage(idx);
		}.bind(this, i));
		
		this.selectors.push(selector);
		this.selectorGroup.appendChild(selector);
	}
	
	this.display = document.createElement("img"); 
	this.display.src = this.elements[0];
	this.display.className = "image-display";
	
	this.containerDiv = document.createElement("div"); 
	this.containerDiv.className = "image-box";
	this.containerDiv.appendChild(this.selectorGroup);
	this.containerDiv.appendChild(this.display);
	parent.appendChild(this.containerDiv);

	document.addEventListener("keypress", function(event) { box.keyPressHandler(event); });
	
	if (config.enableInsets) {
		this.insetBox = document.createElement("div");
		this.insetBox.className = "image-inset-box";
		this.insetBox.style.display = 'block';
		parent.appendChild(this.insetBox);
	
		this.insetZoom = config.insetZoom;
		this.insetSize = config.insetSize;
		this.insetUnit = config.insetUnit;
		this.insets = []
		this.insetContainers = []
		for (var i = 0; i < this.elements.length; i++) {
			var insetImage = document.createElement("div");
			insetImage.className = "image-inset pixelated";
			insetImage.style.width = this.insetSize + this.insetUnit;
			insetImage.style.height = this.insetSize + this.insetUnit;
			insetImage.style.backgroundImage = "url('" + this.elements[i] + "')";
			insetImage.style.backgroundRepeat = "no-repeat";
			
			var insetContainer = document.createElement("div");
			insetContainer.className = "image-inset-container";
			insetContainer.style.width = this.insetSize + this.insetUnit;
			insetContainer.appendChild(insetImage);
			insetContainer.appendChild(document.createTextNode(this.names[i]));
			
			this.insetBox.appendChild(insetContainer);
			this.insets.push(insetImage);
			this.insetContainers.push(insetContainer);
		}
		this.display.addEventListener("mouseover", function(event) { box.mouseOverHandler(); });
		this.display.addEventListener("mouseout",  function(event) { box.mouseOutHandler (); });
		this.display.addEventListener("mousemove", function(event) { box.mouseMoveHandler(event); });
		this.insetBox.addEventListener("mouseover", function(event) { box.mouseOverHandler(); });
		this.insetBox.addEventListener("mouseout",  function(event) { box.mouseOutHandler (); });
		this.insetBox.addEventListener("mousemove", function(event) { box.mouseMoveHandler(event); });
		
		this.dummyImage = new Image();
		this.dummyImage.src = this.elements[0];
		this.dummyImage.addEventListener('load', function(e) { box.setupInsets(); });
		if (this.dummyImage.complete)
			this.setupInsets();
	}
}

ImageBox.prototype.setupInsets = function() {
	var format = this.dummyImage.naturalWidth *this.insetZoom + "px "
			+ this.dummyImage.naturalHeight*this.insetZoom + "px";
	for (var i = 0; i < this.insets.length; i++)
		this.insets[i].style.backgroundSize = format
}

ImageBox.prototype.selectImage = function(idx) {
	for (var i = 0; i < this.elements.length; i++) {
		if (i == idx)
			this.selectors[i].className += " active";
		else
			this.selectors[i].className = this.selectors[i].className.replace( /(?:^|\s)active(?!\S)/g , '');
	}

	this.display.src = this.elements[idx];
}

ImageBox.prototype.keyPressHandler = function(event) {
	var inc = event.charCode == "+".charCodeAt(0);
	var dec = event.charCode == "-".charCodeAt(0);
	if (inc || dec) {
		if (inc)
			this.insetSize *= 2;
		else
			this.insetSize /= 2;
		for (var i = 0; i < this.elements.length; i++) {
			var image = this.insetContainers[i].childNodes[0];
			image.style.width = this.insetSize + this.insetUnit;
			image.style.height = this.insetSize + this.insetUnit;
			this.insetContainers[i].style.width = this.insetSize + this.insetUnit;
		}
	} else {
		var idx = parseInt(event.charCode) - "1".charCodeAt(0);
		if (idx >= 0 && idx < this.elements.length)
			this.selectImage(idx);
	}
}

ImageBox.prototype.mouseOverHandler = function() {
	/*for (var i = 0; i < this.insets.length; i++) {
		this.insets[i].style.backgroundImage = "url('" + this.elements[i] + "')";
		this.insetContainers[i].style.color = 'black';
	}*/
	this.insetBox.style.display = 'block';
}

ImageBox.prototype.mouseOutHandler = function() {
	/*for (var i = 0; i < this.insets.length; i++) {
		this.insets[i].style.backgroundImage = "none";
		this.insetContainers[i].style.color = 'white';
	}*/
	this.insetBox.style.display = 'block';
}

ImageBox.prototype.mouseMoveHandler = function(event) {
	var rect = this.display.getBoundingClientRect();
	var xCoord = Math.floor((event.clientX - rect.left)*this.display.naturalWidth /this.display.width );
	var yCoord = Math.floor((event.clientY - rect.top )*this.display.naturalHeight/this.display.height);
	
	for (var i = 0; i < this.insets.length; i++) {
		var xScroll = this.insets[i].clientWidth /2 - xCoord*this.insetZoom;
		var yScroll = this.insets[i].clientHeight/2 - yCoord*this.insetZoom;
		this.insets[i].style.backgroundPosition = xScroll + "px " + yScroll + "px";
	}
}