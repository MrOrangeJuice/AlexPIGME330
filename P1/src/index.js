( function() {
	"use strict";
	// Initialize variables
	let canvas, ctx;
	const canvasWidth = 1800, canvasHeight = 1200;
	let cellWidth;
	let hsize;
	let vsize;
	let fps;
	let lifeworld;
	let color;
	let randomTimer;
	let colorchangespeed;
	let parent;
	let drag;
	let shape;
	let last_x,last_y;
	let paused;
	let percentalive;
	let root;
	
	window.onload = init;
	
	function init(){
		// Create default values
		canvas = document.querySelector("canvas");
		parent = document.querySelector("#parent");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		ctx = canvas.getContext("2d");
		percentalive = .2;
		// Initialize lifeworld
		lifeworld = new LW.Lifeworld(180,120,percentalive);
		cellWidth = 10;
		hsize = 5;
		vsize = 5;
		fps = 12;
		shape = 'square';
		color = 'red';
		randomTimer = 0;
		colorchangespeed = 100;
		drag = false;
		last_x = 0;
		last_y = 0;
		paused = false;
		root = document.documentElement;
		loop();
	
		// Controls
		document.querySelector('#widthChooser').onchange = function(e) {
			cellWidth = e.target.value;
		}
	
		document.querySelector('#speedChooser').onchange = function(e) {
			fps = e.target.value;
		}
	
		document.querySelector('#colorSpeedChooser').onchange = function(e) {
			colorchangespeed = e.target.value;
		}
	
		document.querySelector('#shapeChooser').onchange = function(e) {
			shape = e.target.value;
		}
	
		document.querySelector('#hsizeChooser').onchange = function(e) {
			hsize = e.target.value;
			document.querySelector('#parent').style.width = `${hsize * 10}%`;
		}
	
		document.querySelector('#vsizeChooser').onchange = function(e) {
			vsize = e.target.value;
			document.querySelector('#parent').style.height = `${vsize * 10}vh`;
		}
	
		document.querySelector('#percentChooser').onchange = function(e) {
			percentalive = e.target.value / 10;
		}
	
		document.querySelector('#pause').onclick = function(e) {
			paused = !paused;
			if(paused) {
				document.querySelector('#pauseText').innerHTML = "Play";
			}
			else {
				document.querySelector('#pauseText').innerHTML = "Pause";
			}
		}
	
		document.querySelector('#reset').onclick = function(e) {
			reset();
		}
	
		// Canvas scrolling, tutorial from https://paulcreaser.wordpress.com/2016/08/06/simple-html5-and-canvas-application/

		// Activate scroll mode when user clicks
		canvas.onmousedown = function(e) {
			let pos = aapLIB.mouse_position_xy(e);
			last_x = pos.x;
			last_y = pos.y;
			if (drag == false) {
				canvas.style.cursor="grab";
				drag = true;
			}
		}
	
		// Scroll canvas with mouse movement
		canvas.onmousemove = function(e) {
			if (drag == true) 
			{
				let pos = aapLIB.mouse_position_xy(e);
				let diffy = last_y - pos.y;
				let diffx = last_x - pos.x;
				parent.scrollTop += diffy;
				parent.scrollLeft += diffx;
				last_x = pos.x;
				last_y = pos.y;
			}
			canvas.style.cursor="grab";
		}
	
		// Deactivate scroll mode when user lets go of mouse button
		canvas.onmouseup = function(e) {
			drag = false;
			canvas.style.cursor="default";
		}
	}
	
	function loop(){
		setTimeout(loop,1000/fps);
		// TODO: update lifeworld
		if(!paused) {
			pickColor();
			drawBackground();
			drawWorld();
			lifeworld.step();
		}
	}
	
	// Pick color depending on the user selection, and change it if necessary
	function pickColor(){
		let colorValue = document.querySelector('#colorChooser').value;
		if(colorValue == "rainbow") {
			document.querySelector("#colorspeed").style.display = "block";
			if(randomTimer <= 0){
				let newColor = aapLIB.getRandomColor();
				color = newColor;
				root.style.setProperty('--border-color', newColor);
				randomTimer = 100/colorchangespeed;
			}
			else {
				randomTimer--;
			}
		}
		else {
			document.querySelector("#colorspeed").style.display = "none";
			color = colorValue;
			root.style.setProperty('--border-color', colorValue);
		}
	}
	
	// Render background
	function drawBackground(){
		ctx.save();
		ctx.fillStyle = "black";
		ctx.globalAlpha = 4/fps;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		ctx.restore();
	}
	
	// Draw game of life
	function drawWorld(){
		ctx.save();
		for(let col = 0; col < lifeworld.numCols; col++) {
			for(let row = 0; row < lifeworld.numRows; row++){
				switch(shape) {
					case 'square':
						drawCell(col,row,cellWidth, lifeworld.world[col][row]);
						break;
					case 'circle':
						drawCircleCell(col,row,cellWidth, lifeworld.world[col][row]);
						break;
				}
			}
		}
		ctx.restore();
	}
	
	// Draw square cell
	function drawCell(col,row,dimensions,alive) {
		ctx.beginPath();
		ctx.rect(col*dimensions, row*dimensions, dimensions, dimensions);
		ctx.fillStyle = alive ? `${color}` : 'rgba(0,0,0,0)';
		ctx.fill();
	}
	
	// Draw circle cell
	function drawCircleCell(col,row,dimensions,alive) {
		ctx.beginPath();
		ctx.arc(col*dimensions + (dimensions / 2), row*dimensions + (dimensions / 2), (dimensions / 2), 0, 2 * Math.PI);
		ctx.fillStyle = alive ? `${color}` : 'rgba(0,0,0,0)';
		ctx.fill();
	}
	
	// Reset simulation
	function reset() {
		lifeworld = new LW.Lifeworld(180,120,percentalive);
	}
}) ();