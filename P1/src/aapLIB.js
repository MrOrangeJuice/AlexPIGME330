( function()  {
	"use strict";

	// Generate random color with max opacity
	function getRandomColor(){
		return `rgba(${getByte()},${getByte()},${getByte()},1)`;
	}

	// Get position of mouse
	function mouse_position_xy(e) {
		let x = e.clientX;
		let y = e.clientY;
		let result = new Object();
		result.x = x;
		result.y = y;
		return result;
	}

	function getByte() {
		return 55 + Math.round(Math.random() * 200);
	}
	window.aapLIB = {getRandomColor,mouse_position_xy, getByte};
}) ();