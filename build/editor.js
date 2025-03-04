//console.log("BITCOIN IDE! YEAH!");

var stackVisualizer;
var scriptDebugger;

/* All javascript manipulation for the page goes in here: */
$( document ).ready(function() {
	/* All javascript manipulation for the page goes in here */

	// Attach event listeners to the assemble and disassemble button
	// $( "body" ).delegate( "#assemble-button", "click", function() {
	// 	var script = editor.getSession().getValue();
	// 	$(".assembly-content").val(assembleToHex(script));
	// });

	// $( "body" ).delegate( "#disassemble-button", "click", function() {
	// 	var hex = $(".assembly-content").val();
	// 	editor.getSession().setValue(disassembleFromHex(hex));
	// });

	// Attach event listeners to the debugging buttons
	scriptDebugger = new ScriptDebugger();
	$( "body" ).delegate( "#run-button", "click", function() {
		scriptDebugger.runFromBeginning();
	});

	$( "body" ).delegate( "#next-button", "click", function() {
		scriptDebugger.nextStep();
	});

	$( "body" ).delegate( "#continue-button", "click", function() {
		scriptDebugger.continueExecution();
	});

	// If the user changes the code, initialize the stack the next time they step or run.
	editor.on("change", function() {
		scriptDebugger.needToInitialize = true;

		var script = editor.getSession().getValue();
		// Split the script based on space characters
		scriptDebugger.commands = scriptDebugger.splitScript(script);
		scriptDebugger.index = 0; // The current index in the commands array to execute    
		// Display the next opcode to execute
		$( "#next-opcode-container" ).text(scriptDebugger.commands[scriptDebugger.index]);
		// $( "#next-opcode-container" ).css({"background-color": "#dddddd", "color":"black"});
		$( "#next-opcode-container" ).animate({
			"backgroundColor": "#dddddd",
			"color":"black"});
	});

	// Attach event listeners to the toggling between assembly and script
	$( "body" ).delegate( "#editor-tab-assembly", "click", function() {
		// if(!$("#editor").hasClass("assembly")) {
		// 	var script = editor.getSession().getValue();
		// 	editor.setValue(assembleToHex(script), -1); //-1 for cursor at start, 1 for end
		// 	$("#editor").addClass("assembly");
		// 	$("#editor").removeClass("script");
		// }
		if($("#editor-holder").hasClass("active")) {
			var script = editor.getSession().getValue();
			editorAssembly.setValue(assembleToHex(script), -1); //-1 for cursor at start, 1 for end
		}

		$("#editor-section div.tab-area").removeClass("active").addClass("inactive");
		$("#editor-assembly-holder.tab-area").removeClass("inactive").addClass("active");
	});

	$( "body" ).delegate( "#editor-tab-script", "click", function() {
		// if(!$("#editor").hasClass("script")) {
		// 	var hex = editor.getSession().getValue();
		// 	editor.setValue(disassembleFromHex(hex), -1); //-1 for cursor at start, 1 for end
		// 	$("#editor").addClass("script");
		// 	$("#editor").removeClass("assembly");
		// }
		if($("#editor-assembly-holder").hasClass("active")) {
			var hex = editorAssembly.getSession().getValue();
			editor.setValue(disassembleFromHex(hex), -1); //-1 for cursor at start, 1 for end
		}

		$("#editor-section div.tab-area").removeClass("active").addClass("inactive");
		$("#editor-holder.tab-area").removeClass("inactive").addClass("active");
	});

	$("body").delegate("#editor-options form", "change", function() {
		$("#editor-options form input").each(function () {
			if($(this).attr("type") == "checkbox") {
				var val = false;
				if($(this).is(":checked"))
					val = true;
				var op = $(this).attr('option');
				console.log(op, val);
				editorAssembly.setOption(op,val);
				editor.setOption(op,val);
			} else {
			    var op = $(this).attr('option');
				var val = parseInt($(this).val());
				console.log(op, val);
				editorAssembly.setOption(op,val);
				editor.setOption(op,val);
			}
		});
	});

	$("body").delegate("#editor-options form .dropdown li > a", "click", function() {
		var op = $(this).attr('option');
		var val = $(this).attr('value');
		editorAssembly.setOption(op,val);
		editor.setOption(op,val);
	});
	

	$( "body" ).delegate( "#editor-tab-options", "click", function() {
		$("#editor-section div.tab-area").removeClass("active").addClass("inactive");
		$("#editor-options.tab-area").removeClass("inactive").addClass("active");
	});


	//Download button
	$( "body" ).delegate( "#download-script", "click", function() {
		var blob = new Blob([ editor.getSession().getValue() ], {
		    type: "text/plain;charset=utf-8;",
		});
		saveAs(blob, "script.txt");
	});

	//Upload button
	$( "body" ).delegate( "#upload-input", "change", function() {
		if (!window.FileReader) {
	        console.log('Your browser is not supported for file upload!');
	    }
	    var fileInput = $('#upload-input');
	    var input = fileInput.get(0);
	    
	    // Create a reader object
	    var reader = new FileReader();
	    if (input.files.length) {
	        var textFile = input.files[0];
	        reader.readAsText(textFile);
	        $(reader).on('load', processFile);
	    } else {
	        console.log('Please upload a file before continuing.');
	    }
	});

	$("#editor-section").on("mouseover", function() {
		// console.log("READ");
		$("#editor-section-title-tip").stop(true);
		$("#editor-section-title-tip").fadeOut(200);
	}).on("mouseout", function() {
		// console.log("READ");
		$("#editor-section-title-tip").stop(true);
		$("#editor-section-title-tip").fadeIn(200);
	});

	$("#stack-visualizer-section").on("mouseover", function() {
		// console.log("READ");
		$("#stack-section-title-tip").stop(true);
		$("#stack-section-title-tip").fadeOut(200);
	}).on("mouseout", function() {
		// console.log("READ");
		$("#stack-section-title-tip").stop(true);
		$("#stack-section-title-tip").fadeIn(200);
	});

	$("#executor-section").on("mouseover", function() {
		// console.log("READ");
		$("#debugger-section-title-tip").stop(true);
		$("#debugger-section-title-tip").fadeOut(200);
	}).on("mouseout", function() {
		// console.log("READ");
		$("#debugger-section-title-tip").stop(true);
		$("#debugger-section-title-tip").fadeIn(200);
	});

	//Hide the slider after a delay
	setTimeout(function() {
		$("#stack-visualizer-holder").trigger("mouseout");
	}, 400);

	//When window is resized, recalculate size of section panes
	$( window ).resize(resizeSections);
	$( window ).resize(resizeStackVisualizer);
	$( window ).resize(resizeDebuggerElements);

	//Resize section panes
	resizeSections();
	resizeStackVisualizer();
	resizeDebuggerElements();
	setEditorOptionValues();
});


var resizeSections = function() {
	var totalHeight = $("body").height();
	var navbarHeight = $("nav.navbar").outerHeight(true);
	var topPanelHeight = $("#top-panel").outerHeight(true);
	var middlePanelHeight = 155; //$("#middle-panel").outerHeight(true);

	var areaUnderNav = totalHeight - navbarHeight - middlePanelHeight;
	$("#top-panel").css("height", areaUnderNav);
	$("#middle-panel").css("height", middlePanelHeight);
};

var resizeStackVisualizer = function() {
	var totalHeight = $("#stack-visualizer-holder").outerHeight(true);
	var speedSliderHeight = $("#speedSliderHolder").height();
	var topMarginHeight = totalHeight*0.10;
	var stackHeight = totalHeight - topMarginHeight - speedSliderHeight;
	$("#stack-visualizer").css({
		"height": stackHeight,
		"margin-top" : topMarginHeight,
	});
};

var resizeDebuggerElements = function() {
	var totalWidth = $("body").width();
	var buttonsWidth = $("#debugger-container").outerWidth(true);
	var debuggerCenteredWidth = buttonsWidth + $("#next-opcode-container").outerWidth(true);
	var widthRemainingLeftSide = (totalWidth - debuggerCenteredWidth)/2;
	var leftMarginForCenter = widthRemainingLeftSide + buttonsWidth + ($("#next-opcode-container").outerWidth(true)/2);
	var leftMarginForRightEnd = widthRemainingLeftSide + buttonsWidth + $("#next-opcode-container").outerWidth(true) + 0;

	$("#next-opcode-arrow").css({
		"margin-left" : leftMarginForCenter - 19
	});
	$("#next-opcode-text").css({
		"margin-left" : leftMarginForCenter - 85
	});
	$(".completion-icon").css({
		"margin-left" : leftMarginForRightEnd
	});
};

var setEditorOptionValues = function() {
	$("#editor-options form input").each(function () {
		if($(this).attr("type") == "checkbox") {
			var op = $(this).attr('option');
			var val = editor.getOption(op);

			if (val)
				$(this).prop('checked', true);
		} else {
			var op = $(this).attr('option');
			var val = editor.getOption(op);
			$(this).val(val);
		}
	});
};

var processFile = function(f) {
    var file = f.target.result,
        results;
    if (file && file.length) {
        results = file.split("\n");
        // console.log(results);
        // $('#name').val(results[0]); //first line
        // $('#age').val(file); // whole file
        editor.setValue(file);
    }
}