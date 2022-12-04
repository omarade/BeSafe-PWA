import {sendSms} from "./sendSos.js"

var map;
var currentLocation;
var address
var routeSelectionStep = 0;
var directionsRenderer;
var markers = [];

var watchId;

//route vars
var origin;
var destination;
var waypoints = [];

//alert
var safe = true;

var decodedPoints;

var maxDistance = 20;

//marker
var bluedot;

// Initialize and add the map
function initMap() {
	directionsRenderer = new google.maps.DirectionsRenderer();
	const directionsService = new google.maps.DirectionsService();

	// The location of Eindhoven
	const eindhoven = { lat: 51.4231, lng: 5.4623 };

	// The map, centered at Eindhoven
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 12,
		center: eindhoven,
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: true,
		streetViewControl: false,
		rotateControl: true,
		fullscreenControl: true
	});

	bluedot = placeCurrentLocationMarker()
	
	//placeMarker(amsterdam)

	//var currentLocationMarker = placeCurrentLocationMarker(amsterdam)

	addYourLocationButton(map, bluedot)

	
	directionsRenderer.setMap(map);


	//show route on map
	$("#containerShowRoute > button").click(() => {
		calculateAndDisplayRoute(directionsService, directionsRenderer);
	})
	// calculateAndDisplayRoute(directionsService, directionsRenderer);

	//watchUsersLocation()

	google.maps.event.addListener(map, 'click', function (event) {
		if (routeSelectionStep == 0 ) {
			origin = event.latLng;
			routeSelectionStep++;
			$("#instruction > h5").text("Choose Destination")
		} else if (routeSelectionStep == 1) {			
			destination = event.latLng;
			routeSelectionStep++;
			$("#instruction > h5").text("Choose Waypoints")
		} else {
			waypoints.push({location: 
				event.latLng
			})
		}
		placeMarker(event.latLng);
		console.log(event.latLng)
	});
}

//find and show walking route based on multiple locations and return decoded points of the route
function calculateAndDisplayRoute(directionsService, directionsRenderer) {

	directionsService
	//{ lat: 51.618144, lng: 4.739765 }
	//{ lat: 51.618211, lng: 4.738166 }
	//{ lat: 51.618618, lng: 4.739097 }
		.route({
			origin: origin,
			destination: destination,
			waypoints: waypoints,
			travelMode: google.maps.TravelMode["WALKING"],
		})
		.then((response) => {
			decodedPoints = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline);
		
			directionsRenderer.setDirections(response);
		})
		.catch((e) => console.log("Directions request failed due to -> " + e));
}

function getCurrentLocation(marker) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( res => {
			console.log(res)
			var latlng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
			marker.setPosition(latlng);
			map.setCenter(latlng);

			convertLocationToAddress({lat: res.coords.latitude, lng: res.coords.longitude});

			return latlng
		}, err => {
			console.log(err)
		})
	}
}

function convertLocationToAddress(location) {
	var latLng = `${location.lat},${location.lng}`
	fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=AIzaSyDsG7ARwUwAiTNs8_AQszdR4mbCLr5kjHc`)
	.then((responseText) => {
		return responseText.json();
	})
	.then(jsonData => {
		address = jsonData.results[0].formatted_address;
		console.log(address);
		return address;
	})
	.catch(error => {
		console.log(error);

	})
}

//track users location
function trackUsersLocation() {
	if (navigator.geolocation) {
		watchId = navigator.geolocation.watchPosition(res => {

			currentLocation = {lat: res.coords.latitude, lng: res.coords.longitude}
			bluedot.setPosition(currentLocation)
			calculateDistanceFromRoute(decodedPoints, currentLocation)

		}, err => {
			console.log(err)
		})
	}
}

//caculate points distances from current location
function calculateDistanceFromRoute(decodedPoints, currentLocation){
	var linePoints = []

	console.log("decodedPoints")
	console.log(decodedPoints)

	console.log("currentLocation")
	console.log(currentLocation)


	decodedPoints.forEach(point => {
		var p = {lat: point.lat(), lng: point.lng()}
		linePoints.push(p)
	});

	console.log("linePoints")
	console.log(linePoints)

	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix({
		origins: [currentLocation],
		destinations: linePoints,
		travelMode: 'WALKING',
		avoidTolls: true
	}, (res) => {
		console.log("RES")
		console.log(res)
		console.log("res.rows[0].elements")
		console.log(res.rows[0].elements)

		var linePointsDistances = res.rows[0].elements
		var closestPoint = findClosestPoint(linePointsDistances)

		if(closestPoint > maxDistance && safe) {
			//Send Msg
			console.log("Kidnapped");
			safe = false;
			
			console.log("address");
			console.log(address);
			alert("You are too far away from your route, a message has been sent to your emergency contact.")
			sendSms(address);
		}

		//return res.rows[0].elements
	}, err => {
		console.log(err)
	});
}

//find closest point to current location
function findClosestPoint(linePointsDistances){
	var closestPoint = linePointsDistances[0].distance.value;
	linePointsDistances.forEach(point => {
		if(point.distance.value < closestPoint){
			closestPoint = point.distance.value
		}
	})
	console.log(closestPoint)
	return closestPoint
}

//place current loaction marker
function placeCurrentLocationMarker(location) {
	var bluedot = new google.maps.Marker({
		position: location,
		map: map,
		icon: {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 10,
			fillOpacity: 1,
			strokeWeight: 2,
			fillColor: '#5384ED',
			strokeColor: '#ffffff',
		},
	});
	if(location) {
		map.panTo(location);
	}

	return bluedot;
}

//place marker on map and move camera to it
function placeMarker(location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});

	markers.push(marker);

	if(location) {
		map.panTo(location);
	}
	
	return marker;
}


function addYourLocationButton(map, marker) 
{
	var controlDiv = document.createElement('div');
	
	var firstChild = document.createElement('button');
	
	firstChild.title = 'Your Location';
	firstChild.id = 'btnCurrentLocation'
	controlDiv.appendChild(firstChild);
	
	var secondChild = document.createElement('div');
	secondChild.id = 'gpsIcon';
	firstChild.appendChild(secondChild);

	firstChild.addEventListener('click', function() {		
		getCurrentLocation(marker);
		
	});
	
	controlDiv.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

function clearMarkers() {
	console.log(markers)
	markers.forEach(marker => {
		marker.setMap(null);
	})
	markers = [];
}

$("#btnStartTrip > button").click(() => {
	var maxDistanceInp = $("#maxDistanceInp")
	if(maxDistanceInp.val()) {
		maxDistance = maxDistanceInp.val()
		console.log(maxDistance)
	}
	alert("Your trip has been started")

	trackUsersLocation();
})

$("#btnArrived > button").click(() => {
	if (navigator.geolocation) {
		navigator.geolocation.clearWatch(watchId);
		directionsRenderer.set("directions", null);
		alert("You arrived to your destination")

		clearMarkers();

		origin = {};
		destination = {};
		waypoints = [];
		routeSelectionStep = 0;
	}
})



window.initMap = initMap;