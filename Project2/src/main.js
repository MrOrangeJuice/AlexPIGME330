import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// Parameters for canvas
const drawParams = {
	showGradient: true,
	showBars: true,
	showCircles: true,
	showNoise: false,
	showInvert: false,
	showEmboss: false,
	colorChangeSpeed: document.querySelector("#colorChange").value,
	circleColor: "red",
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1: "media/Back 2 Back.mp3"
});

function init() {
	audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	let videoElement = document.querySelector("#videoElement");
	let outputDiv = document.querySelector('#outputDiv');
	setupUI(canvasElement);
	canvas.setupCanvas(canvasElement, audio.analyserNode);
	loop();
}

function setupUI(canvasElement) {
	// fullscreen button
	const fsButton = document.querySelector("#fsButton");
	
	// add .onclick event to button
	fsButton.onclick = e => {
		console.log("init called");
		utils.goFullscreen(canvasElement);
	};

	const barsCB = document.querySelector("#barsCB");
	barsCB.onchange = e => {
		if(barsCB.checked == true){
			drawParams.showBars = true;
		}
		else {
			drawParams.showBars = false;
		}
	}

	const circlesCB = document.querySelector("#circlesCB");
	circlesCB.onchange = e => {
		if(circlesCB.checked == true){
			drawParams.showCircles = true;
		}
		else {
			drawParams.showCircles = false;
		}
	}

	const noiseCB = document.querySelector("#noiseCB");
	noiseCB.onchange = e => {
		if(noiseCB.checked == true) {
			drawParams.showNoise = true;
		}
		else {
			drawParams.showNoise = false;
		}
	}

	const invertCB = document.querySelector("#invertCB");
	invertCB.onchange = e => {
		if(invertCB.checked == true) {
			drawParams.showInvert = true;
		}
		else {
			drawParams.showInvert = false;
		}
	}

	const embossCB = document.querySelector("#embossCB");
	embossCB.onchange = e => {
		if(embossCB.checked == true) {
			drawParams.showEmboss = true;
		}
		else {
			drawParams.showEmboss = false;
		}
	}

	playButton.onclick = e => {
		console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
		if (audio.audioCtx.state == "suspended") {
			audio.audioCtx.resume();
		}
		console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
		if (e.target.dataset.playing == "no") {
			audio.playCurrentSound();
			e.target.dataset.playing = "yes";
		} else {
			audio.pauseCurrentSound();
			e.target.dataset.playing = "no";
		}
	}

	let volumeSlider = document.querySelector("#volumeSlider");
	let volumeLabel = document.querySelector("#volumeLabel");

	volumeSlider.oninput = e => {
		audio.setVolume(e.target.value);
		volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
	};

	volumeSlider.dispatchEvent(new Event("input"));

	let colorSpeedSlider = document.querySelector("#colorChange");
	let colorSpeedLabel = document.querySelector("#colorLabel");

	colorSpeedSlider.oninput = e => {
		drawParams.colorChangeSpeed = e.target.value;
		colorSpeedLabel.innerHTML = e.target.value;
	}

	// Determine circle color from radio buttons
	let colorRadio = document.querySelectorAll("input[type=radio][name=circleColor]");
	for (let c of colorRadio)
	{
		c.onchange = function (e) {
			drawParams.circleColor = e.target.value;
			console.log(drawParams.circleColor);
		}
	}

	colorSpeedSlider.dispatchEvent(new Event("input"));

	let trackSelect = document.querySelector("#trackSelect");

	trackSelect.onchange = e => {
		audio.loadSoundFile(e.target.value);
		if (playButton.dataset.playing = "yes") {
			playButton.dispatchEvent(new MouseEvent("click"));
		}
	};

} // end setupUI

function loop() {
	requestAnimationFrame(loop);
	// Progress Bar
	let currentTime = audio.element.currentTime;
	let duration = audio.element.duration;
	document.querySelector("#progress").innerHTML = sec2time(Math.round(currentTime)) + "/" + sec2time(Math.round(duration));
	canvas.draw(drawParams);
}

// From vankasteelj on GitHub
function sec2time(timeInSeconds) {
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(minutes, 2) + ':' + pad(seconds, 2);
}

function doHeadTrackingEvent(e) {
	var x = e.x.toFixed(2),
		y = e.y.toFixed(2),
		z = e.z.toFixed(2);
	var s = "<p>x=";
	s += x;
	s += ", y=";
	s += y;
	s += ", z=";
	s += z;
	outputDiv.innerHTML = s;
}

export {
	init
};