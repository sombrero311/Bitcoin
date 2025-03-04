//ID/name
StackVisualizer.stackID = 'stack-diagram';
StackVisualizer.qname = 'stackAnimQueue';
StackVisualizer.speedSliderID = 'speedSlider';
StackVisualizer.speedSliderTitleID = 'speedSliderTitle';
StackVisualizer.speedSliderHolderID = 'speedSliderHolder';

//Diagram appearance
StackVisualizer.diagramHeight = '85%';
StackVisualizer.diagramWidth = '80%';
StackVisualizer.diagramMarginTop = '6%';
StackVisualizer.stackElementBorderWidth = 1;
StackVisualizer.curvedness = 8;
StackVisualizer.borderWidth = '8px';
StackVisualizer.percentHeightToFallFrom = 0.95;
StackVisualizer.percentHeightToFlyUp = 0.95;
StackVisualizer.speedSliderMarginTop = '16px';
StackVisualizer.fontFamily = 'Verdana';

//Animation speeds
StackVisualizer.stackAnimationTime = 400; // speed of animations
StackVisualizer.SMALLESTstackAnimationTime = 10; // speed of animations
StackVisualizer.LARGESTstackAnimationTime = 1500; // speed of animations
StackVisualizer.msToWaitForAnim = 100;
StackVisualizer.msToWaitBetweenAnimSections = 0;
StackVisualizer.msToWaitBeforeQueueing = 0; //setTimeout timer
StackVisualizer.msToWaitPerCall = 0; //delay between calls


//Animation number system
StackVisualizer.binary = 1;
StackVisualizer.decimal = 2;
StackVisualizer.hexadecimal = 3;



function StackVisualizer (elemID, isHiddenStack) {
    this.name = "Bitcoin Stack Visualizer";
    this.stack = new Array();
    this.hasFailed = false;
    this.completed = false;
    this.numberSystem = StackVisualizer.hexadecimal;

    if(elemID != undefined && (isHiddenStack == undefined || !isHiddenStack)) {
	    this.parentID = elemID;
	    this.stackID = StackVisualizer.stackID;
	    this.parentElement = $("#"+elemID);
	    this.createStackDiagram();
	    this.isHiddenStack = false;
	    this.callerCount = 0;
	} else {
		this.isHiddenStack = true; //Do not visualize this stack
	}
}


StackVisualizer.prototype.getInfo = function() {
    return this.name;
};


StackVisualizer.prototype.createStackDiagram = function() {
    console.log("Creating new stack diagram...");

    // Remove previous diagram
    this.grandParentID = this.parentElement.parent().attr("id");
    this.parentElement.children().remove();
    $('#'+StackVisualizer.speedSliderHolderID ).remove();

    this.parentElement.css({
    	'position' : 'relative',
    	'display' : 'table',
    	'height' : StackVisualizer.diagramHeight,
    	'width' : StackVisualizer.diagramWidth,
    	'margin' : '0 auto',
		'margin-top' : StackVisualizer.diagramMarginTop,
    	//'overflow' : 'scroll'
    });

    var stackDiv = $('<div/>', {
	    id: this.stackID
	});

	stackDiv.css({
		'height' : '100%',
		'display' : 'table-cell', //for IE8+
		'margin' : '0 auto',
		'position' : 'relative',
		'vertical-align' :'bottom',
		'overflow-y' : 'hidden',
		'background-color' : 'white',
		
		//border
		'border-style' : 'double',
		'border-color' : 'gray',
		'border-width' : '0px ' + StackVisualizer.borderWidth + ' ' + StackVisualizer.borderWidth + ' ' + StackVisualizer.borderWidth,

		'-moz-border-radius-bottomright' : StackVisualizer.curvedness + 'px',
		'border-bottom-right-radius' : StackVisualizer.curvedness + 'px',
		'-moz-border-radius-bottomleft' : StackVisualizer.curvedness + 'px',
		'border-bottom-left-radius' : StackVisualizer.curvedness + 'px'
	});

	stackDiv.appendTo(this.parentElement);
	this.stackDiagram = stackDiv;


	//Speed slider under diagram
    var speedSlider = $('<div/>', {
	    id: StackVisualizer.speedSliderID
	}).css({
		// 'height' : '100%',
		'width' : '100%',
		'display' : 'block',
		'margin' : '0 auto',
		// 'margin-top' : '10px'
	});

    var speedSliderTitle = $('<h3/>', {
    	id: StackVisualizer.speedSliderTitleID,
	    text: 'Animation Speed'
	}).css({
		// 'width' : '90%',
		'text-align' : 'center',
		'margin' : 'auto',
		'margin-top' : '8px',
		'color' : '#0080ff',
		'font-size' : '1.2em',
		'font-family' : StackVisualizer.fontFamily
	});

	speedSliderTitle.prepend($('<span/>', {
    	'class': 'glyphicon glyphicon-flash',
	    'aria-hidden': 'true',
	    'style' : 'color:#0080ff; margin-right: 3px;'

	}));

	//Speed slider under diagram
    var speedSliderHolder = $('<div/>', {
	    id: StackVisualizer.speedSliderHolderID
	}).css({
		// 'height' : '100%',
		'width' : '90%',
		'display' : 'block',
		'margin' : '0 auto',
		'margin-top' : StackVisualizer.speedSliderMarginTop
	});


	speedSlider.appendTo(speedSliderHolder);
	speedSliderTitle.appendTo(speedSliderHolder);
	speedSliderHolder.appendTo('#'+'stack-visualizer-holder');
	
	$( "#"+StackVisualizer.speedSliderID ).slider({
      range: false,
      min: StackVisualizer.SMALLESTstackAnimationTime,
      max: StackVisualizer.LARGESTstackAnimationTime-5,
      animate : 'slow',
      value: StackVisualizer.LARGESTstackAnimationTime - StackVisualizer.stackAnimationTime,
      slide: function( event, ui ) {
      	StackVisualizer.stackAnimationTime = StackVisualizer.LARGESTstackAnimationTime - ui.value;
        // console.log(StackVisualizer.stackAnimationTime);
      }
    });


	//Slider hiding animation
	$( "body" ).delegate("#"+this.grandParentID, "mouseover", function() {
		// console.log("Mouse over");
		$("#"+StackVisualizer.speedSliderHolderID).stop(true);
		$("#"+StackVisualizer.speedSliderHolderID).animate({
			opacity: 1.0,
			// 'margin-top' : StackVisualizer.speedSliderMarginTop
		}, 150);
	});

	$( "body" ).delegate("#"+this.grandParentID, "mouseout", function() {
		// console.log("Mouse out");
		$("#"+StackVisualizer.speedSliderHolderID).stop(true);
		$("#"+StackVisualizer.speedSliderHolderID).animate({
			opacity: 0.3,
			// 'margin-top' : '30%'
		}, 400);
	});

	// $("#"+this.grandParentID).trigger("mouseout");
};

StackVisualizer.prototype.createStackElement = function(value) {
    var stackElement = $('<div/>', {
	    text: value,
	    'class' : 'stackElement'
	});

	stackElement.css({
		'height' : '10%',
		'width' : '100%',
		'position' : 'relative',
		'display' : 'table', //for IE8+
		
		'padding' : '5px',
		'color' : 'white',
		'text-align' : 'center',
		'bottom' : '0',
		'font-family' : StackVisualizer.fontFamily,

		'border-style' : 'groove',
		'border-color' : 'white',
		'border-width' : StackVisualizer.stackElementBorderWidth+'px',

		'-moz-border-radius' : StackVisualizer.curvedness+'px',
		'border-radius' : StackVisualizer.curvedness+'px'
	});


	// var elemsQueued = $("#"+this.stackID).queue(StackVisualizer.qname) == 1;
	// var elemsQueued = this.isAnimating();

	if(this.completed && !this.hasFailed && value != 0) { //Success
		// stackElement.css({'background-color' : 'green'});
		stackElement.css({'background-color' : '#E89A2C'});
	} else if (this.completed && this.hasFailed && value == 0) { //Failure
		// stackElement.css({'background-color' : 'red'});
		stackElement.css({'background-color' : '#E89A2C'});
	} else {
		stackElement.css({'background-color' : '#E89A2C'});
	}

	return stackElement;
};


StackVisualizer.prototype.pushElementOnDiagram = function(stackElement) {
	var heightToFallFrom = this.getStackRemainingHeight()*StackVisualizer.percentHeightToFallFrom;
	var stackSelector = '#' + this.stackID;

	//Set starting state and then animation
	stackElement.css({
		'opacity' : '0.0',
		'margin' : '0',
		'bottom' : heightToFallFrom
	});

	var thisStack = this;
	setTimeout(function() {
		//Concurrent
		$('#'+thisStack.stackID).queue(StackVisualizer.qname, function(next) {
		    $(stackSelector).prepend(stackElement);
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE

		    //filler animation
		    $(stackElement).animate({
					'bottom' : heightToFallFrom
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });

		    // console.log("(1/2)Concurrent for PUSH done.");
		}).queue(StackVisualizer.qname, function(next) {
		    $(stackElement).animate({
					opacity: 1.0,
					'bottom' : '0px'
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    thisStack.checkForAndHighlightCompletion();
		     // console.log("(2/2)Animation for PUSH done.");
		});

		thisStack.dequeueIfNotAnimating();

	}, StackVisualizer.msToWaitBeforeQueueing+StackVisualizer.msToWaitBetweenAnimSections);

	// this.dequeueIfNotAnimating();
};

StackVisualizer.prototype.popElementFromDiagram = function() {
	var poppedSelector = '#' + this.stackID + ' :first-child';
	var heightToFlyTo = this.getStackRemainingHeight()*StackVisualizer.percentHeightToFlyUp;

	var thisStack = this;
	setTimeout(function() {
		//Animation
		$('#'+thisStack.stackID).queue(StackVisualizer.qname, function(next) {
		    $(poppedSelector).animate({
					opacity: 0.0,
					'bottom' : heightToFlyTo+'px'
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    // console.log("(1/2)Animation for POP done.");
		    //thisStack.dequeueIfNotAnimating();
		}).queue(StackVisualizer.qname, function(next) {
		    
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE

			//filler animation
		    $(poppedSelector).animate({
					opacity: 1.0,
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });

		    $(poppedSelector).remove();
		    thisStack.checkForAndHighlightCompletion();
		    // console.log("(2/2)After for POP done.");
		});

		thisStack.dequeueIfNotAnimating();
	}, StackVisualizer.msToWaitBeforeQueueing+StackVisualizer.msToWaitBetweenAnimSections);

	// this.dequeueIfNotAnimating();
};

//1-indexed from top
StackVisualizer.prototype.removeElementFromDiagram = function(idx) {
	if(idx == 1) { //removing top element
		this.popElementFromDiagram();
		return;
	} 

	var heightToFlyTo = this.getStackRemainingHeight()*StackVisualizer.percentHeightToFlyUp;
	var poppedSelector = '#' + this.stackID + ' :nth-child(' + idx + ')';

	var thisStack = this;
	setTimeout(function() {
		//Concurrent
		$('#'+thisStack.stackID).queue(StackVisualizer.qname, function(next) {
		    $(poppedSelector).css({
				padding: "0"
			});
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE

			//filler animation
		    $(poppedSelector).animate({
					opacity: 1.0,
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });

		    // console.log("(1/4)Concurrent for REMOVE done.");
		}).queue(StackVisualizer.qname, function(next) {
		    $(poppedSelector).animate({
					'opacity' : '0.0',
					'bottom' : heightToFlyTo+'px' //var heightToFlyTo = this.getStackRemainingHeight()*percentHeightToFlyUp;
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    // console.log("(2/4)Animation #1 for REMOVE done.");
		}).queue(StackVisualizer.qname, function(next) {
		    $(poppedSelector).animate({
					"height": "toggle",
					'font-size': '0',
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    // console.log("(3/4)Animation #2 for REMOVE done.");
		}).queue(StackVisualizer.qname, function(next) {
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE

		    //filler animation
		    $(poppedSelector).animate({
					opacity: 1.0,
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });

		    $(poppedSelector).remove();

		    // console.log("(4/4)After for REMOVE done.");
		});

		thisStack.dequeueIfNotAnimating();

	}, StackVisualizer.msToWaitBeforeQueueing+ StackVisualizer.msToWaitBetweenAnimSections);	
};

//1-indexed from top
StackVisualizer.prototype.insertElementInDiagram = function(stackElement, idx) {

	if(idx == 1) { //inserting new top element
		this.pushElementOnDiagram(stackElement);
		return;
	} 
	var heightToFallFrom = this.getStackRemainingHeight()*StackVisualizer.percentHeightToFallFrom;

	//Set starting state and then animation
	stackElement.css({
		'opacity' : '0.0',
		'margin' : '0',
		'bottom' : heightToFallFrom,
		'padding' : '0',
		'font-size' : '0',
		'height' : '0'
	});

	var children = $('#'+this.stackID).children();
	var padding = '5px'; //default?
	if(children.length > 0) //there are children elements in the stack
		padding = $('#'+this.stackID+' :nth-child(1)').css("padding");
	var appendSelector = '#' + this.stackID + ' :nth-child(' + (idx-1) + ')';
	var thisStack = this;
	setTimeout(function() {
		//Concurrent
		$('#'+thisStack.stackID).queue(StackVisualizer.qname, function(next) {
		    $(appendSelector).after(stackElement);
		    // $('#'+thisStack.stackID).dequeue(qname); //THIS IS IMPORTANT TO CONTINUE THE QUEUE SEQUENCE
			$(stackElement).animate({
					'opacity' : '0.0'
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    // console.log("(1/3)Concurrent for INSERT done.");
		}).queue(StackVisualizer.qname, function(next) {
		    $(stackElement).animate({
					"height": "10%",
					'font-size' : '100%',
					// 'opacity' : '1.0',
					// 'bottom' : '0px',
					'padding' : padding
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    // console.log("(2/3)Animation #1 for INSERT done.");
		}).queue(StackVisualizer.qname, function(next) {
		    $(stackElement).animate({
					'opacity' : '1.0',
					'bottom' : '0px',
				}, {
					duration: StackVisualizer.stackAnimationTime, 
			     	queue: false, //so other anim queues are independent
			        complete: next //THIS IS IMPORTANT FOR ANIMATION
		    });
		    // console.log("(3/3)Animation #2 for INSERT done.");
		});

		thisStack.dequeueIfNotAnimating();

	}, StackVisualizer.msToWaitBeforeQueueing+ StackVisualizer.msToWaitBetweenAnimSections);
};

StackVisualizer.prototype.consistentSize = function() {
	//Is the visual consistent with the actual stack data?
	var sizeVisualStack = $('#' + this.stackID + ' > *').length;
	return this.size() == sizeVisualStack;
};

StackVisualizer.prototype.getStackRemainingHeight = function() {
	return this.getStackMaxHeight() - this.getStackCurrHeight();
};

StackVisualizer.prototype.getStackMaxHeight = function() {
	var maxHeight = this.stackDiagram.height();
	return maxHeight;
};

StackVisualizer.prototype.getStackCurrHeight = function() {
	return this.numStackElements() * this.getStackElementHeight();
};

StackVisualizer.prototype.getStackElementHeight = function() {
	return $('#' + this.stackID + ' :first-child').height() + 2*StackVisualizer.stackElementBorderWidth;
};

StackVisualizer.prototype.numStackElements = function() {
	return this.stack.length;
};

StackVisualizer.prototype.size = function() {
	return this.stack.length;
};

//1-indexed from the top of the stack
StackVisualizer.prototype.peek = function(idx) {

	if(idx === undefined) {
		if(this.size() <= 0) {
			console.error("WARNING: peek() called with empty stack.");
			return null;
		} else {
			return this.stack[this.size()-1];
		}
	} else {
		if(this.size()-idx < 0 || this.size()-idx >= this.size()) {
			console.error("WARNING: Index out of bounds: peek(" + idx + ") called with stack size " + this.size() + ".");
			return null;
		} else {
			return this.stack[this.size()-idx];
		}
	}
};

StackVisualizer.prototype.push = function(value) {
	this.stack.push(value);

	console.log('numbsys: ' + this.numberSystem);

	//Given in decimal, convert if necessary
	if (this.numberSystem == StackVisualizer.binary)
		value = value.toString(2).toUpperCase(); //convert all to binary.
	else if (this.numberSystem == StackVisualizer.hexadecimal)
		value = '0x' + value.toString(16).toUpperCase(); //convert all to hex.

	var thisStack = this;
	if(!this.isHiddenStack) {
		setTimeout(function() {
			thisStack.pushElementOnDiagram(thisStack.createStackElement(value));
		}, StackVisualizer.msToWaitPerCall*(this.callerCount++));
	}
};

StackVisualizer.prototype.pop = function() {
	// console.log('callerCount: ' + callerCount);
	if(this.numStackElements() == 0) {
		console.error("WARNING: Stack underflow! Attempted to pop empty stack.");
		return null;
	}

	var thisStack = this;
	if(!this.isHiddenStack) {
		setTimeout(function() {
			thisStack.popElementFromDiagram();
		}, StackVisualizer.msToWaitPerCall*(this.callerCount++));
	}
// console.log("STACK:");
// console.log(this.stack);
    return this.stack.pop();
};

//1-indexed from the top of the stack
StackVisualizer.prototype.remove = function(idx) {
	// console.log('callerCount: ' + callerCount);
	var arrayIndex = this.size() - idx;
	if(arrayIndex < 0 || arrayIndex >= this.size()) {
		console.error("WARNING: Index out of bounds: remove(" + idx + ") called with stack size " + this.size() + ".");
		return null;
	} else {

		var thisStack = this;
		if(!this.isHiddenStack){
			setTimeout(function() {
				thisStack.removeElementFromDiagram(idx);
			}, StackVisualizer.msToWaitPerCall*(this.callerCount++));
		}

		return this.stack.splice(arrayIndex, 1)[0];
	}
};

//1-indexed from the top of the stack
StackVisualizer.prototype.insert = function(value, idx) {
	//insert(val, 1) goes on the top of the stack
	//insert(val, 2) goes under the current top element
	var arrayIndex = this.size() - idx;
	// console.log("Array index: " + arrayIndex);
	if(idx <= 0 || idx > this.size()+1) {
		console.error("WARNING: Index out of bounds: insert(" + value + "," + idx + ") called with stack size " + this.size() + ".");
	} else {
		this.stack.splice(arrayIndex+1, 0, value);

		var thisStack = this;
		if(!this.isHiddenStack) {
			setTimeout(function() {
				thisStack.insertElementInDiagram(thisStack.createStackElement(value), idx);
			}, StackVisualizer.msToWaitPerCall*(this.callerCount++));
		}
	}
};

StackVisualizer.prototype.visualizationMatchesStack = function() {
	if(!this.consistentSize())
		return false;

	var i = 0;
	var thisStack = this;
	$($('#' + this.stackID).children().get().reverse()).each(function() {
		if(thisStack.stack[i] != $(this).text()) {
			return false;
		}
	});

	return true;

}

StackVisualizer.prototype.clear = function() {
    this.stack = new Array();

    if(!this.isHiddenStack) {
    	var stackElements = $('#' + this.stackID).children();

	    //Clear the queue
	    stackElements.stop(); //stop animation
		$('#'+this.stackID).clearQueue(StackVisualizer.qname);

	    var heightToFlyTo = this.getStackRemainingHeight()*StackVisualizer.percentHeightToFlyUp;

	    var thisStack = this;
	    //Pop all at once and remove
	    $(stackElements).animate({
			'opacity' : '0.0',
			'bottom' : heightToFlyTo+'px'
	    }, StackVisualizer.stackAnimationTime* 0.50, function(){
	    	stackElements.remove();
	    	thisStack.dequeueIfNotAnimating();
	    });
	    
	}

	this.hasFailed = false;
	this.completed = false;
};

StackVisualizer.prototype.dequeueIfNotAnimating = function() {
	this.callerCount = 0;
	if(!this.isAnimating()) {
		$('#'+this.stackID).dequeue(StackVisualizer.qname);
	}
};

StackVisualizer.prototype.flush = function() {
	this.dequeueIfNotAnimating();
};

StackVisualizer.prototype.highlightCompletion = function(success) {
	if(success) {
		this.hasFailed = false;
		this.completed = true;
	} else {
		//Failure
		var elemsQueued = $("#"+this.stackID).queue(StackVisualizer.qname) == 0;
		console.log(elemsQueued);
		if(this.peek() == 0 && !elemsQueued) {
			$('#' + this.stackID).children().first().css({
				'background-color':'red'
			});
		}
		this.hasFailed = true;
		this.completed = true;
	}
};

StackVisualizer.prototype.checkForAndHighlightCompletion = function() {
	// console.log(this.hasFailed);

	if(this.completed && this.hasFailed) {
		var elemsQueued = $("#"+this.stackID).queue(StackVisualizer.qname) != 0;
		console.log(elemsQueued);
		var p = this.peek();
		console.log(p == 0);
		if(p == 0 && !elemsQueued) {
			console.log("CHANGING");
			// $('#' + this.stackID).children().first().css({
			// 	'background-color':'red'
			// });
			$('#' + this.stackID).children().first().animate({
				'backgroundColor':'red'
			}, StackVisualizer.stackAnimationTime);
		}
	} else if (this.completed && !this.hasFailed) {
		var elemsQueued = $("#"+this.stackID).queue(StackVisualizer.qname) != 0;
		if(this.peek() != 0 && !elemsQueued) {
			// $('#' + this.stackID).children().first().css({
			// 	'background-color':'green'
			// });
			$('#' + this.stackID).children().first().animate({
				'backgroundColor':'green'
			}, StackVisualizer.stackAnimationTime);
		}
	}
};


StackVisualizer.prototype.isAnimating = function() {
	var numAnimatingElements =  $('#' + this.stackID).children().filter(":animated").length;

	if(numAnimatingElements > 0) {
		// console.log("ANIMATING");
		return true;
	} else {
		// console.log("NOT animating");
		return false;
	}
};
