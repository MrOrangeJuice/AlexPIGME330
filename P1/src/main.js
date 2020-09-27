let canvas, ctx;
const canvasWidth = 1600, canvasHeight = 1200;
let cellWidth;
let fps;
let lifeworld;
let color;
let randomTimer;
let colorchangespeed;
let parent;
let drag;
let last_x,last_y;
let root;

window.onload = init;

function init(){
	canvas = document.querySelector("canvas");
	parent = document.querySelector("#parent");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	ctx = canvas.getContext("2d");
	// TODO: init lifeworld
	lifeworld = new Lifeworld(160,120,.2);
	cellWidth = 10;
	fps = 12;
	color = 'red';
	randomTimer = 0;
	colorchangespeed = 100;
	drag = false;
	last_x = 0;
	last_y = 0;
	root = document.documentElement;
	loop();

	document.querySelector('#widthChooser').onchange = function(e) {
		cellWidth = e.target.value;
	}

	document.querySelector('#speedChooser').onchange = function(e) {
		fps = e.target.value;
	}

	document.querySelector('#colorSpeedChooser').onchange = function(e) {
		colorchangespeed = e.target.value;
	}

	canvas.onmousedown = function(e) {
		var pos = mouse_position_xy(e);
		last_x = pos.x;
		last_y = pos.y;
		if (drag == false) {
			canvas.style.cursor="grab";
			drag = true;
		}
	}

	canvas.onmousemove = function(e) {
		if (drag == true) 
		{
			var pos = mouse_position_xy(e);
			var diffy = last_y - pos.y;
			var diffx = last_x - pos.x;
			parent.scrollTop += diffy;
			parent.scrollLeft += diffx;
			last_x = pos.x;
			last_y = pos.y;
		}
		canvas.style.cursor="grab";
	}

	canvas.onmouseup = function(e) {
		drag = false;
		canvas.style.cursor="default";
	}
}

function loop(){
	setTimeout(loop,1000/fps);
	// TODO: update lifeworld
	pickColor();
	drawBackground();
	drawWorld();
	lifeworld.step();
}

function pickColor(){
	var colorValue = document.querySelector('#colorChooser').value;
	if(colorValue == "rainbow") {
		if(randomTimer <= 0){
			var newColor = getRandomColor();
			color = newColor;
			root.style.setProperty('--border-color', newColor);
			randomTimer = 100/colorchangespeed;
		}
		else {
			randomTimer--;
		}
	}
	else {
		color = colorValue;
		root.style.setProperty('--border-color', colorValue);
	}
}

function drawBackground(){
	ctx.save();
	ctx.fillStyle = "black";
	ctx.globalAlpha = 4/fps;
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.restore();
}

function drawWorld(){
	ctx.save();
	for(let col = 0; col < lifeworld.numCols; col++) {
		for(let row = 0; row < lifeworld.numRows; row++){
			drawCell(col,row,cellWidth, lifeworld.world[col][row]);
		}
	}
	ctx.restore();
}

function drawCell(col,row,dimensions,alive) {
	ctx.beginPath();
	ctx.rect(col*dimensions, row*dimensions, dimensions, dimensions);
	ctx.fillStyle = alive ? `${color}` : 'rgba(0,0,0,0)';
	ctx.fill();
}

function mouse_position_xy(e) {
	var x = e.clientX;
	var y = e.clientY;
	var result = new Object();
	result.x = x;
	result.y = y;
	return result;
}

function getRandomColor(){
	//setTimeout(function(){color = getRandomColor();},500);
	const getByte = _ => 55 + Math.round(Math.random() * 200);
	return `rgba(${getByte()},${getByte()},${getByte()},1)`;
}