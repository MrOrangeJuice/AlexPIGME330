/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
	showGradient: true,
	showBars: true,
	showCircles: true,
	showNoise: false,
	showInvert: false,
	showEmboss: false
};

const modelParams = {
	flipHorizontal: true,   // flip e.g for video 
	imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
	maxNumBoxes: 20,        // maximum number of boxes to detect
	iouThreshold: 0.5,      // ioU threshold for non-max suppression
	scoreThreshold: 0.79,    // confidence threshold for predictions.
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1: "media/New Adventure Theme.mp3"
});

function init() {
	audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	handTrack.load(modelParams).then(model => {

	});
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
	canvas.setupCanvas(canvasElement, audio.analyserNode);
	loop();
}

function setupUI(canvasElement) {
	// A - hookup fullscreen button
	const fsButton = document.querySelector("#fsButton");

	// Set up video
	let video = document.querySelector("#videoElement");
	if (navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: true })
		  .then(function (stream) {
			video.srcObject = stream;
		  })
		  .catch(function (err0r) {
			console.log("Something went wrong!");
		  });
	  }
	// add .onclick event to button
	fsButton.onclick = e => {
		console.log("init called");
		utils.goFullscreen(canvasElement);
	};

	const gradientCB = document.querySelector("#gradientCB");
	gradientCB.onchange = e => {
		if(gradientCB.checked == true){
			drawParams.showGradient = true;
		}
		else {
			drawParams.showGradient = false;
		}
	}

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

	let trackSelect = document.querySelector("#trackSelect");

	trackSelect.onchange = e => {
		audio.loadSoundFile(e.target.value);
		if (playButton.dataset.playing = "yes") {
			playButton.dispatchEvent(new MouseEvent("click"));
		}
	};

} // end setupUI

function loop() {
	/* NOTE: This is temporary testing code that we will delete in Part II */
	requestAnimationFrame(loop);
	canvas.draw(drawParams);
	/*
	// 1) create a byte array (values of 0-255) to hold the audio data
	// normally, we do this once when the program starts up, NOT every frame
	let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
	
	// 2) populate the array of audio data *by reference* (i.e. by its address)
	audio.analyserNode.getByteFrequencyData(audioData);
	
	// 3) log out the array and the average loudness (amplitude) of all of the frequency bins
		console.log(audioData);
		
		console.log("-----Audio Stats-----");
		let totalLoudness =  audioData.reduce((total,num) => total + num);
		let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
		let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
		let maxLoudness =  Math.max(...audioData); // ditto!
		// Now look at loudness in a specific bin
		// 22050 kHz divided by 128 bins = 172.23 kHz per bin
		// the 12th element in array represents loudness at 2.067 kHz
		let loudnessAt2K = audioData[11]; 
		console.log(`averageLoudness = ${averageLoudness}`);
		console.log(`minLoudness = ${minLoudness}`);
		console.log(`maxLoudness = ${maxLoudness}`);
		console.log(`loudnessAt2K = ${loudnessAt2K}`);
		console.log("---------------------");
		*/
}

export {
	init
};