// Hook up functions to buttons

let displayTerm = "";
let offset = 0;

// Initialize API key and base url
const GB_URL = "bomb-proxy.php";
const D_URL = "deal-proxy.php";

function init() {
	document.querySelector("#search").onclick = searchButtonClicked;
}

function searchButtonClicked() {
	console.log("searchButtonClicked() called");

	// Reset offset
	offset = 0;

	// Build url string
	let url = GB_URL;

	// Parse user entered term
	let term = document.querySelector("#searchterm").value;
	displayTerm = term;

	// Get rid of any leading and trailing spaces
	term = term.trim();

	// Encode spaces and special characters
	term = encodeURIComponent(term);

	// If there's no search term, bail
	if (term.length < 1) return;

	// Add search term to url with parameter name q
	url += "?term=" + term;

	// Add limit to url
	let limit = document.querySelector("#limit").value;
	url += "&limit=" + limit;

	// Update UI
	document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

	// Print url to console
	console.log(url);

	// Request data
	getData(url);
}

function getData(url) {
	// create a new XHR object
	let xhr = new XMLHttpRequest();

	// Set the onload handler
	xhr.onload = dataLoaded;

	// Set the onerror handler
	xhr.onerror = dataError;

	// Open connection and send the request
	xhr.open("GET", url);
	xhr.send();
}

function getDealData(url) {
	// create a new XHR object
	let xhr = new XMLHttpRequest();

	// Set the onload handler
	xhr.onload = dealDataLoaded;

	// Set the onerror handler
	xhr.onerror = dataError;

	// Open connection and send the request
	xhr.open("GET", url);
	xhr.send();
}

// Callback Functions

function dataLoaded(e) {
	// event.target is the xhr object
	let xhr = e.target;

	// print JSON file
	//console.log(xhr.responseText);

	// Turn the text into a parsable JavaScript object
	let obj = JSON.parse(xhr.responseText);

	// If there are no results, print a message and return
	if (!obj.results || obj.results.length == 0) {
		document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
		return; // Bail out
	}

	// Start building an HTML string we will display to the user
	let results = obj.results;
	console.log("results.length = " + results.length);
	let bigString = "";

	// Loop through the array of results
	for (let i = 0; i < results.length; i++) {
		let result = results[i];

		// Build a <div> to hold each result
		// ES6 string templating
		let line = `<div class='result'>
		<img src='${result.image.small_url}' class='resultImg' alt='Thumbnail'>
		<p>${result.name}</p>
		<button type="button" class="streamButton" id="${result.name}" onclick="seeStreams('${result.name}');">See Deals</button>
		</div>`;

		// Add the div to the bigString and loop
		bigString += line;
	}

	// Show HTML to user
	document.querySelector("#content").innerHTML = bigString;

	// Update status
	document.querySelector("#status").innerHTML = "<b>Success!</b>";

}

function dealDataLoaded(e) {
	// event.target is the xhr object
	let xhr = e.target;

	// print JSON file
	console.log(xhr.responseText);

	// Turn the text into a parsable JavaScript object
	let obj = JSON.parse(xhr.responseText);

	// If there are no deals, print a message and return
	if (!obj || obj.length == 0) {
		document.querySelector("#selected").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
		return; // Bail out
	}

	let bigString = `<h2>${name}</h2><h2>Cheapest Price: ${obj[0].cheapest}</h2>`;

	document.querySelector("#selected").innerHTML = bigString;
}

function seeStreams(name) {
	let bigString = `<h2>Searching for ${name}...</h2>`;

	document.querySelector("#selected").innerHTML = bigString;
	// Build url string
	let url = D_URL;

	// Get rid of any leading and trailing spaces
	name= name.trim();

	// Encode spaces and special characters
	name = encodeURIComponent(name);

	// If there's no search term, bail
	if (name.length < 1) return;

	// Add search term to url with parameter name q
	url += "?term=" + name;

	// Request data
	getDealData(url);
}

function dataError(e) {
	console.log("An error occured");
}

export {init, searchButtonClicked, getData, getDealData, dataLoaded, dealDataLoaded, seeStreams};