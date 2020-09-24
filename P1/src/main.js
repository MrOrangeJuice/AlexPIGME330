let canvas, ctx;
const canvasWidth = 1200, canvasHeight = 800;
let cellWidth;
const fps = 12;
let lifeworld;
let color;
let root;

window.onload = init;

function init(){
	canvas = document.querySelector("canvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	ctx = canvas.getContext("2d");
	// TODO: init lifeworld
	lifeworld = new Lifeworld(360,240,.2);
	cellWidth = 10;
	color = 'red';
	root = document.documentElement;
	loop();

	document.querySelector('#widthChooser').onchange = function(e) {
		cellWidth = e.target.value;
	}

	document.querySelector('#colorChooser').onchange = function(e) {
		color = e.target.value;
		root.style.setProperty('--border-color', e.target.value);
	}
}

function loop(){
	setTimeout(loop,1000/fps);
	// TODO: update lifeworld
	drawBackground();
	drawWorld();
	lifeworld.step();
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