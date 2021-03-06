import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData, color, randomTimer;


function setupCanvas(canvasElement, analyserNodeRef) {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{
		percent: 0,
		color: "red"
	}, {
		percent: .25,
		color: "orange"
	}, {
		percent: .5,
		color: "yellow"
	}, {
		percent: .75,
		color: "green"
	}, {
		percent: 1,
		color: "blue"
	}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize / 2);

	let options = { 
		video:true, 
		audio:false 
	}

	randomTimer = 0;
	color = utils.getRandomColor();

	// Set up video
	let videoElement = document.querySelector("#videoElement");
	//request webcam access 
	navigator.webkitGetUserMedia(options, 
		function(stream) { 
			//turn the stream into a magic URL 
			//videoElement.src = window.webkitURL.createObjectURL(stream); 
			videoElement.srcObject = stream; 
		},
		function(e) { 
			console.log("error happened"); 
			alert("You have navigator.webkitGetUserMedia, but an error occurred");
		
		} 
	); 
}

function draw(params = {}, headParams = {}) {
	// 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);

	// waveform data


	// Clear canvas
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// draw background
		ctx.save();
		ctx.fillStyle = "rgba(0,0,0,0)";
		ctx.globalAlpha = .1;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
		ctx.restore();

	// draw bars
	if(params.showBars) {
		let barSpacing = 4;
		let margin = 5; 
		let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
		let barWidth = screenWidthForBars / audioData.length;
		let barHeight = 300;
		let topSpacing = 100;

		ctx.save();
		ctx.fillStyle = color;
		ctx.strokeStyle = 'rgba(0,0,0,0.50)';
		// loop through the data and draw!
		for (let i=0; i < audioData.length; i++) {
			ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i],barWidth,(params.barHeight * 100));
			ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i],barWidth,(params.barHeight * 100));
		}
		ctx.restore();
	}

	// draw circles
	if (params.showCircles){
		let maxRadius = canvasHeight/4;
		ctx.save();
		ctx.globalAlpha = 0.5;
		let offsetx = -(headParams.x * 6) + 400;
		let offsety = -(headParams.y * 6) + 250;
		for(let i=0; i < audioData.length; i++) {
			let percent = audioData[i] / 255;

			let circleRadius = percent * maxRadius;
			if(!params.deadmau5) {
				ctx.beginPath();
				ctx.fillStyle = utils.makeColor(255,111,111, .34 - percent/1.0);
				ctx.arc(offsetx, offsety, circleRadius, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}

			ctx.beginPath();
			// Pick circle color based on parameters
			if(params.circleColor == "red")
			{
				ctx.fillStyle = utils.makeColor(255, 0, 0, .10 - percent/10.0);
			}
			if(params.circleColor == "green")
			{
				ctx.fillStyle = utils.makeColor(0, 255, 0, .10 - percent/10.0);
			}
			if(params.circleColor == "blue")
			{
				ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent/10.0);
			}
			if(params.circleColor == "yellow")
			{
				ctx.fillStyle = utils.makeColor(255, 255, 0, .10 - percent/10.0);
			}
			if(params.circleColor == "purple")
			{
				ctx.fillStyle = utils.makeColor(255, 0, 255, .10 - percent/10.0);
			}
			ctx.arc(offsetx, offsety, circleRadius * 1.5, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();

			if(params.deadmau5) {
				// Draw mouse ears
				ctx.beginPath();
				ctx.arc(offsetx - 75, offsety - 75, circleRadius * 0.5, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
	
				ctx.beginPath();
				ctx.arc(offsetx + 75, offsety - 75, circleRadius * 0.5, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();

				// Draw mouse eyes
				ctx.beginPath();
				ctx.fillStyle = utils.getRandomColor();
				ctx.arc(offsetx - 50, offsety - 25, circleRadius * .50, 0, 2 * Math.PI, false);
				ctx.arc(offsetx + 50, offsety - 25, circleRadius * .50, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
				ctx.restore();

				// Draw mouth
				ctx.beginPath();
				ctx.arc(offsetx, offsety, circleRadius * 0.75, 0, Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
		}
		ctx.restore();
	}

	// 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	let data = imageData.data;
	let length = data.length;
	let width = imageData.width;
	
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
	for(let i = 0; i < length; i += 4) {
		// C) randomly change every 20th pixel to red
		if (params.showNoise && Math.random() < .05) {
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i + 1] = data[i+2] = 0;// zero out the red and green and blue channels
			data[i] = 255;// make the red channel 100% red
			data[i + 1] = 255;
			data[i + 2] = 255; 
		} // end if

		if (params.showInvert) {
			let red = data[i], green = data[i+1], blue = data[i+2];
			data[i] = 255 - red;
			data[i+1] = 255 - green;
			data[i+2] = 255 - blue;
		}
	} // end for

	if(params.showEmboss) {
		for (let i = 0; i < length; i++) {
			if (i%4 == 3) continue;
			data[i] = 127 + 2*data[i] - data[i+4] - data [i + width * 4];
		}
	}
	// Draw video
	ctx.drawImage(videoElement, 0, 0, 800, 400);
	// Pick new color for bars
	if(randomTimer <= 0)
	{
		let newColor = utils.getRandomColor();
		color = newColor;
		randomTimer = 100 / params.colorChangeSpeed;
	}
	else
	{
		randomTimer--;
	}

	// D) copy image data back to canvas
	ctx.putImageData(imageData, 0, 0);
}

export {
	setupCanvas,
	draw
};