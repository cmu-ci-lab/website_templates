var ImageBox = function(parent, config) {
	var box = this;
	
	this.elements = config.elements;
	this.names = config.names;
	
	this.selectorGroup = document.createElement("ul"); 
	this.selectorGroup.className = "selector-group";
	
	this.selectors = [];
	for (var i = 0; i < this.elements.length; i++) {
		var item = document.createElement("li");
		var selector = document.createElement("button");
		selector.type = "button";
		selector.className = "selector";
		if (i == 0)
			selector.className += " active";
		selector.setAttribute("aria-pressed", i == 0 ? "true" : "false");
		selector.appendChild(document.createTextNode(this.names[i]));
		
		selector.addEventListener("mouseover", function(idx, event) {
			this.selectImage(idx);
		}.bind(this, i));

		selector.addEventListener("click", function(idx, event) {
			this.selectImage(idx);
		}.bind(this, i));

		item.appendChild(selector);
		this.selectors.push(selector);
		this.selectorGroup.appendChild(item);
	}
	
	this.display = document.createElement("img");
	// Attributes that affect fetching have to be set before src. The optional imageWidth /
	// imageHeight config keys reserve the right aspect ratio so the widget does not shift
	// the page as it loads; omit them and the element behaves exactly as it did before.
	this.display.loading = "lazy";
	this.display.decoding = "async";
	if (config.imageWidth && config.imageHeight) {
		this.display.width = config.imageWidth;
		this.display.height = config.imageHeight;
	}
	this.display.src = this.elements[0];
	this.display.alt = this.names[0];
	this.display.className = "image-display";
	
	this.containerDiv = document.createElement("div"); 
	this.containerDiv.className = "image-box";
	this.containerDiv.appendChild(this.selectorGroup);
	this.containerDiv.appendChild(this.display);
	parent.appendChild(this.containerDiv);

	document.addEventListener("keydown", function(event) { box.keyDownHandler(event); });
	
	if (config.enableInsets) {
		this.insetBox = document.createElement("div");
		this.insetBox.className = "image-inset-box";
		this.insetBox.style.display = 'block';
		parent.appendChild(this.insetBox);
	
		this.insetZoom = config.insetZoom;
		this.insetSize = config.insetSize;
		this.insetUnit = config.insetUnit || "px";
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
		// Pointer Events unify mouse, touch, and pen, the same way the comparison slider in
		// jquery.twentytwenty.js does. touch-action is set from JS, not CSS, because it must
		// apply only when insets are enabled: a rule on .image-display would also hit boxes
		// built with enableInsets: false, which bind no pointer handlers, and would kill touch
		// scrolling over those images for nothing. (Derived sites also keep their own copies of
		// the template stylesheet while sharing this script, so a CSS rule would have to be
		// added to each of them.)
		this.display.style.touchAction = "none";
		var tracking = false;
		this.display.addEventListener("pointerdown", function(event) {
			tracking = true;
			// Keep receiving moves even if the finger or cursor leaves the image mid-drag.
			if (box.display.setPointerCapture)
				box.display.setPointerCapture(event.pointerId);
			box.pointerMoveHandler(event);
		});
		this.display.addEventListener("pointermove", function(event) {
			// A mouse tracks on hover, as before; touch and pen track only while pressed.
			if (event.pointerType === "mouse" || tracking)
				box.pointerMoveHandler(event);
		});
		this.display.addEventListener("pointerup",     function(event) { tracking = false; });
		this.display.addEventListener("pointercancel", function(event) { tracking = false; });
		// The inset strip sits below the image; a mouse dragged over it keeps the crops moving.
		// Touch is left alone here so the page can still be scrolled from the strip.
		this.insetBox.addEventListener("pointermove", function(event) {
			if (event.pointerType === "mouse")
				box.pointerMoveHandler(event);
		});
		
		this.dummyImage = new Image();
		this.dummyImage.src = this.elements[0];
		this.dummyImage.addEventListener('load', function(e) { box.setupInsets(); });
		if (this.dummyImage.complete)
			this.setupInsets();
	}
}

ImageBox.prototype.setupInsets = function() {
	if (!this.insets)
		return;
	var format = this.dummyImage.naturalWidth *this.insetZoom + "px "
			+ this.dummyImage.naturalHeight*this.insetZoom + "px";
	for (var i = 0; i < this.insets.length; i++)
		this.insets[i].style.backgroundSize = format
}

ImageBox.prototype.selectImage = function(idx) {
	for (var i = 0; i < this.elements.length; i++) {
		var isActive = (i == idx);
		this.selectors[i].classList.toggle("active", isActive);
		this.selectors[i].setAttribute("aria-pressed", isActive ? "true" : "false");
	}

	this.display.src = this.elements[idx];
	this.display.alt = this.names[idx];
}

ImageBox.prototype.keyDownHandler = function(event) {
	if (event.ctrlKey || event.metaKey || event.altKey)
		return;
	if ((event.key == "+" || event.key == "-") && this.insetContainers) {
		if (event.key == "+")
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
		var idx = parseInt(event.key, 10) - 1;
		if (idx >= 0 && idx < this.elements.length)
			this.selectImage(idx);
	}
}

ImageBox.prototype.pointerMoveHandler = function(event) {
	var rect = this.display.getBoundingClientRect();
	var xCoord = Math.floor((event.clientX - rect.left)*this.display.naturalWidth /this.display.width );
	var yCoord = Math.floor((event.clientY - rect.top )*this.display.naturalHeight/this.display.height);
	// A captured drag keeps reporting once the pointer is past the edge; clamp so the crops
	// stop at the border of the image instead of sliding off into empty background.
	xCoord = Math.max(0, Math.min(this.display.naturalWidth  - 1, xCoord));
	yCoord = Math.max(0, Math.min(this.display.naturalHeight - 1, yCoord));
	
	for (var i = 0; i < this.insets.length; i++) {
		var xScroll = this.insets[i].clientWidth /2 - xCoord*this.insetZoom;
		var yScroll = this.insets[i].clientHeight/2 - yCoord*this.insetZoom;
		this.insets[i].style.backgroundPosition = xScroll + "px " + yScroll + "px";
	}
}