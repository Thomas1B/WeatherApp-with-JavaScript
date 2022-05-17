/*
Written By Thomas Bourgeois
CSC 130 Project 2
November 2021


JavaScript program to display weather collected by connecting to an API.
API being used is from https://www.weatherbit.io/
*/


let apiKey = "your_API_Key"; // Your api key
let baseURL = "https://api.weatherbit.io/v2.0/current?"; // Main url link

// function to show timeleft before next class is lowed
function timeLeft(info) {
	let timeLeft = info.calls_reset_ts - Date.now();
	let date = new Date(timeLeft);

	let hours = date.getHours();
	let mins = date.getMinutes();
	let secs = date.getSeconds();

	if (hours == 0) {
		hours = "12";
	} else if (hours > 12) {
		hours %= 12;
	}
	if (mins < 10) {
		mins = "0" + mins;
	}

	if (secs < 10) {
		secs = "0" + secs;
	}

	let clock =  hours + ":" + mins + ":" + secs;
	text = "Call limit for 24 hours has been reached!<br><br>Time left until next call is allowed " + clock;
	$("#error_msg").html(text).show();
}

// Main function to search connect to api and search for data
function search(type) {
	$("#intro").hide();
	let url = "https://api.weatherbit.io/v2.0/subscription/usage?key="+apiKey;
	$.get(url, function(info) {

		let callsLeft = info.calls_remaining;
		let limit = parseInt(callsLeft) + parseInt(info.calls_count); // number of requests to api allowed

		$("#calls").html(""); // clears text
		if (callsLeft == null) {
			callsLeft = 500;
			limit = 500;
		}
		let text = "Remaining Calls: " + (callsLeft) + " of " + limit;
		$("#calls").append(text).show();
		$("#rightVL").show(); // showing vertical line

		if (callsLeft == 0) { // checking if calls are allowed to be made.
			$("#intro").hide();
			$("#showinfo").hide();
			setInterval(function() {timeLeft(info)}, 1000);
		}
		else { // conditions for different search buttons
			if (type == "city") {
				getDataByCity($("#country").val(), $("#state").val(), $("#city").val(), baseURL);
			} else if (type == "gps") {
				getDataByGPS($("#lat").val(), $("#lon").val(), baseURL);
			}
		}
	});

	formatText();
}

// Getting data by city
function getDataByCity(country, state, city, baseURL) {
	let url = baseURL + "city=" + city;

	if (state != undefined) {
		url += "&state=" + state + "&country=" + country;
	} else {
		url += "&country=" + country;
	}
	url += "&key=" + apiKey;

	$.ajax({
		url: url,
		type: "GET",
		success: function (data) {
			if (data == undefined) {
				let text = "ERROR!<br>Unabled to find the location you entered.";
				$("#error_msg").html(text).show();
			}	else {
				$("#error_msg").hide();
				show(data, "city");
			}
		},
		error: function(data) {
			let text = "ERROR!<br>";

			if (data.status == 400) {
				text += "Check the information that you entered!";
			} else if (data.status == 403) {
				text += "Access Denied. You do not have access rights.";
			}

			$("#showinfo").hide();
			$("#error_msg").html(text);
			$("#error_msg").show();
		}
	});

}

// Getting data by Coordinates
function getDataByGPS(lat, lon, baseURL) {
	let url = baseURL + "lat=" + lat + "&lon=" + lon + "&key=" + apiKey;

	// $.get(url, function(data, status, xhr) {
	// 	if (!status == "success") { // Error connecting to api
	// 		let text = "ERROR LOADING DATA!<br>Check your entered information.";
	// 		$("#showinfo").hide();
	// 		$("#error_msg").html(text);
	// 		$("#error_msg").show();
	// 	} else {
	// 		$("#error_msg").hide();
	//
	// 		data = data.data[0]
	// 		show(data, "gps");
	// 	}
	// });

	$.ajax({
		url: url,
		type: "GET",
		success: function (data) {
			$("#error_msg").hide();
			show(data, "gps");
		},
		error: function(data) {
			// let text = data.status + " " + data.statusText + "<br>";
			let text = "ERROR!!!<br>";

			if (data.status == 400) {
				text += "Check the information that you entered!";
			} else if (data.status == 403) {
				text += "Access Denied. You do not have access rights.";
			}

			$("#showinfo").hide();
			$("#error_msg").html(text);
			$("#error_msg").show();
		}
	});
}

// Function to Clear user inputs
function clearInput(type) {

	if (type == "city") {
		$("#country, #state, #city").val("");
	}
	else if (type == "gps") {
		$("#lat, #lon").val("");
	}
}

// Function to display Province abbreviations
function canadaProvs(country, state) {
	if (country == "CA") {
		if (state == "01") {
			state = "AB";
		} else if (state == "02") {
			state = "BC";
		} else if (state == "03") {
			state = "MB";
		}	else if (state == "04") {
			state = "NB";
		} else if (state == "05") {
			state = "NL";
		} else if (state == "07") {
			state = "NS";
		} else if (state == "08") {
			state = "ON";
		} else if (state == "09") {
			state = "PEI";
		} else if (state == "10") {
			state = "QC";
		} else if (state == "11") {
			state = "SK";
		} else if (state == "12") {
			state = "YT";
		} else if (state == "13") {
			state = "NWT";
		} else if (state == "14") {
			state = "NU";
		}
	}

	return state;


}

// Function to display weather data
function show(data, type) {

	data = data.data[0]
	changeBackground(data);
	let city = data.city_name;
	let state = data.state_code;
	let country = data.country_code;


	// changing display name for canadian Provinces
	state = canadaProvs(country, state);

	$("#showinfo")[0].scrollIntoView(); // jumpy to info section

	console.log(data.ob_time.split(" "));

	// Displaying JSON information
	$("#method").html(showMethod(type));
	$("#location").html(city + ", " + state + ", " + country);
	let text = "Latitude: " + data.lat.toFixed(4) + ", Longitude: " + data.lon.toFixed(4);
	$("#gpsinfo").html(text);
	$("#stationid").html(data.station);
	$("#timezone").html(data.timezone);
	$("#localtime").html(data.datetime);
	$("#obs_time").html(data.ob_time);
	$("#temp").html(data.temp + "&degC, feels like " + data.app_temp + "&degC");
	$("#weatherdesc").html(data.weather.description);
	$("#cloudcoverage").html(data.clouds + "%");
	$("#windspeed").html((data.wind_spd*3.6).toFixed(1) + " km/h");
	$("#wind_direc").html(data.wind_dir + "&deg" + " " + data.wind_cdir);
	windCompass(data.wind_dir, data.pod);
	$("#humidity").html(data.rh.toFixed(1) + "%");
	$("#aqi").html(data.aqi);
	$("#pressure").html(data.pres + " hPa");
	$("#seapressure").html(data.slp + " hPa");
	$("#vis").html(data.vis + " Km");

	let weather = data.weather.description.toLowerCase();
	if (weather.includes("snow")) {
		$("#snowAmt").html((data.snow/10).toFixed(1) + " cm/hr");
		$("#snow").css("display", "inline-flex").show();
	} else if (weather.includes("rain")) {
		$("#rainAmt").html((data.precip).toFixed(1) + " mm/hr");
		$("#rain").css("display", "inline-flex").show();
	}
	nightMode(data.pod);
	$("#showinfo").show();
}

// Function to get method type of how data was collected. (meaning -> which url is used)
function showMethod(type) {
	if (type.includes("city")) {
		return "Country, State, City";
	} else if (type.includes("gps")) {
		return "GPS Coordinates";
	} else if (type.includes("airport")) {
		return "Airport Code";
	}
}

// Function to change background based on weather and time of day:
function changeBackground(data) {

	let weather = data.weather.description;
	let pod = data.pod; // part of day (d=day, n=night)

	let w = weather.toLowerCase();
	let icon = $("#weathericon");
	let bg = $("#background_img");

	if (pod == "d") { // if it's datetime
		$("#uvIndex").html(data.uv.toFixed(1));
		$("#uv").css("display", "inline-flex");

		if (w.includes("heavy") && !w.includes("snow")) {
			icon.attr("src", "icons/storm.png");
			bg.attr("src", "backgrounds/storm.jpg");
		}	else if (w.includes("overcast")) {
			icon.attr("src", "icons/overcast.png");
			bg.attr("src", "backgrounds/overcast.jpg");
		} else if (w.includes("smoke")) {
			icon.attr("src", "icons/smoke-d.png");
			bg.attr("src", "backgrounds/smoke.jpg");
		} else if (w.includes("thunderstorm")) {
			icon.attr("src", "icons/lightning.png");
			bg.attr("src", "backgrounds/lightning.jpg");
		} else if (w.includes(("few" || "broken" || "scattered") && "cloud")) {
			icon.attr("src", "icons/part_cloud-d.png");
			bg.attr("src", "backgrounds/part_cloud.jpg");
		}	else if (w.includes("rain")) {
			icon.attr("src", "icons/rain.png");
			bg.attr("src", "backgrounds/rain.jpg");
		} else if (w.includes("snow")) {
			icon.attr("src", "icons/snow.png");
			bg.attr("src", "backgrounds/snowy.jpg");
		} else if (w.includes("clear")) {
			icon.attr("src", "icons/clear-d.png");
			bg.attr("src", "backgrounds/sunny.jpg");
		} else if (w.includes("fog" || "mist")) {
			icon.attr("src", "icons/smoke-d.png");
			bg.attr("src", "backgrounds/fog.jpg");
		}
	} else if (pod == "n") { // if it's nightime
		$("#uv").hide();

		if (w.includes("heavy") && !w.includes("snow")) {
			icon.attr("src", "icons/storm.png");
			bg.attr("src", "backgrounds/storm.jpg");
		}	else if (w.includes("smoke")) {
			icon.attr("src", "icons/smoke-n.png");
			bg.attr("src", "backgrounds/nightsmoke.jpg");
		} else if (w.includes("overcast")) {
			icon.attr("src", "icons/overcast.png");
			bg.attr("src", "backgrounds/overcastnight.jpg");
		} else if (w.includes("thunderstorm")) {
			icon.attr("src", "icons/lightning-n.png");
			bg.attr("src", "backgrounds/lightning.jpg");
		}	else if (w.includes("rain")) {
			icon.attr("src", "icons/rain.png");
			bg.attr("src", "backgrounds/rainnight.jpg");
		} else if (w.includes(("few" || "broken" || "scattered")  && "cloud")) {
			icon.attr("src", "icons/part_cloud-n.png");
			bg.attr("src", "backgrounds/partcloudnight.jpg");
		} else if (w.includes("snow")) {
			icon.attr("src", "icons/snow.png");
			bg.attr("src", "backgrounds/snownight.jpg");
			return "snownight";
		} else if (w.includes("clear")) {
			icon.attr("src", "icons/clear-n.png");
			bg.attr("src", "backgrounds/clearnight.jpg");
		}	else if (w.includes("fog" || "mist")) {
			icon.attr("src", "icons/smoke-n.png");
			bg.attr("src", "backgrounds/fog.jpg");
		}
	}
}

// Function for making wind direction compass
function windCompass(direction, pod) {

	let c = document.getElementById("compass");

	let x = 175; // compass dimensions
	let y = 175;
	c.width = x;
	c.height = y;

	let cx = c.width/2; 	// center x of canvas
	let cy = c.height/2; 	// center y of canvas
	let ro = 82; 					// outer radius
	let ri = 55; 					// innner radius

	let ctx = c.getContext("2d"); // creating 2d canvas



	// creating outer circle
	ctx.beginPath();
	ctx.arc(cx, cy, ro, 0, 2 * Math.PI);
	ctx.fillStyle = "lightblue";
	if (pod == "n") {
		ctx.fillStyle = "black";
		ctx.strokeStyle = "lime";
	}
	ctx.lineWidth = 2;
	ctx.fill();
	ctx.stroke();

	// creating inner circle
	ctx.beginPath();
	ctx.arc(cx, cy, ri, 0, 2 * Math.PI);
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	if (pod == "n") {
		ctx.strokeStyle = "lime";
		ctx.fillStyle = "black";
	}
	ctx.lineWidth = 1;
	ctx.fill();
	ctx.stroke();

	// labeling compass
	ctx.beginPath();
	ctx.font = "20px times";
	ctx.fillStyle = "black";
	if (pod == "n") {
		ctx.fillStyle = "lime";
	}
	ctx.fillText("N", cx-6.5, cy-61.5);
	ctx.fillText("E", cx+62, cy+8);
	ctx.fillText("S", cx-5.5, cy+75);
	ctx.fillText("W", cx-76.5, cy+8);

	// lines for detailing
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.moveTo(87.5, 34);
	ctx.lineTo(87.5, 141);
	ctx.moveTo(141, 87.5);
	ctx.lineTo(34, 87.5);
	if (pod == 'n') {
		ctx.strokeStyle = "lime";
	}
	ctx.lineWidth = 1;
	ctx.stroke();

	// creating pin
	ctx.beginPath();
	ctx.arc(cx, cy, 7, 0, 2 * Math.PI);
	ctx.fillStyle = "gold";
	if (pod == "n") {
		ctx.fillStyle = "lime";
	}
	ctx.fill();

	// *** creating compass needle ***
	let dir = ((direction-90)/360)*2*Math.PI; // changing to radians and factoring compass angles for convention for math.

	let nx = cx + (ri-5)*Math.cos(dir); // north x-component on canvas
	let ny = cy + (ri-5)*Math.sin(dir); // north y-component

	let sx = cx + (ri-5)*Math.cos(dir + Math.PI);; // south x-component on canvas
	let sy = cy + (ri-5)*Math.sin(dir + Math.PI);; // south y-component

	let pinWidth = 5;

	// making north part
	ctx.beginPath();
	ctx.moveTo(nx, ny);
	ctx.lineTo(cx,cy);
	ctx.lineWidth = pinWidth;
	ctx.strokeStyle = "red";
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.stroke();

	// making south part
	ctx.beginPath();
	ctx.moveTo(sx, sy);
	ctx.lineTo(cx,cy);
	ctx.lineWidth = pinWidth;
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.stroke();


}

// Function to change webpage to nightMode color theme/
function nightMode(pod) {

	let btns = ["#homelink", "#citybtn", "#gpsbtn", "#cleargps", "#clearcity"];
	if (pod == "n") { // conditions when its night time in for that location, changing text color

		for (let i = 0; i < btns.length; i++) {
			$(btns[i]).hover(function() {
				$(btns[i]).css("background-color", "rgba(0, 100, 0, 0.5)");
			}, function() {
				$(btns[i]).css("background-color", "black");
			});
		}

		$(".navbar").css("background-color", "black");
		$("#homelink").css("color", "lime");
		$("#citybtn, #gpsbtn, #airportbtn").css("background-color", "rgba(0, 100, 0, 0.5)");
		$("#curtime").css("color", "lime");
		$("#calls").css("color", "lime");

		$("#title").css("color", "lime");

		$("button").css("border", "1px solid lime");
		$("button").css("color", "lime");
		$("button, #homelink").css("background-color", "black");


		$(".box").css("color", "lime");
		$(".box").css("background-color", "rgba(0,0,0, 0.9)");
		$(".box").css("border", "0");
		$("#error_msg").css("border", "5px solid darkred");
	}
	else {

		for (let i = 1; i < btns.length; i++) {
			$(btns[i]).hover(function() {
				$(btns[i]).css("background-color", "grey");
			}, function() {
				$(btns[i]).css("background-color", "lightgrey");
			});
		}

		$("#homelink").hover(function() {
			$("#homelink").css("background-color", "slategrey");
		}, function() {
			$("#homelink").css("background-color", "darkgrey");
		});


		$(".navbar, #homelink").css("background-color", "darkgrey");
		$("#homelink, #curtime, #calls, #title").css("color", "black");


		$("button").css("border", "1px solid black");
		$("button").css("color", "black");
		$("button").css("background-color", "lightgrey");

		$(".box").css("color", "black");
		$(".box").css("background-color", "rgba(255,238,230,0.8)");
		$(".box").css("border", "5px solid grey");
	}
}

// Function to change font style for displayed data.
function formatText() {

	$("#title").css("margin-bottom", "0px");

	ids = [
		"#method",
		"#location",
		"#gpsinfo",
		"#stationid",
		"#obs_time",
		"#localtime",
		"#temp",
		"#weatherdesc",
		"#cloudcoverage",
		"#windspeed",
		"#wind_direc",
		"#snowAmt",
		"#aqi",
		"#vis",
		"#pressure",
		"#seapressure"
	];


	for (let i=0; i < ids.length; i++) {
		$(ids[i]).css("font-style", "italic")
	}
}
