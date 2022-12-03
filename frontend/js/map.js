var map;
var currentLocation;
var routeSelectionStep = 0;

//route vars
var origin;
var destination;
var waypoints = [];

// Initialize and add the map
function initMap() {
	const directionsRenderer = new google.maps.DirectionsRenderer();
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

	var bluedot = placeCurrentLocationMarker()
	
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
			// origin: { lat: 51.618144, lng: 4.739765 },
			// destination: { lat: 51.618618, lng: 4.739097 },
			// waypoints: [
			// 	{location: { lat: 51.618211, lng: 4.738166 }},
			// 	{location: {
			// 		lat: 51.61941889981885,
			// 		lng: 4.739231152082226
			// 	}}

			// ],
			// Note that Javascript allows us to access the constant
			// using square brackets and a string value as its
			// "property."
			travelMode: google.maps.TravelMode["WALKING"],
		})
		.then((response) => {
			console.log(response)
			var decodedPoints = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline) ;
			var currentLocation = {
				"lat": 51.619254595329764,
				"lng": 4.740125087935567
			}

			calculateDistanceFromRoute(decodedPoints, currentLocation)
		
			directionsRenderer.setDirections(response);
			return decodedPoints
		})
		.catch((e) => console.log("Directions request failed due to -> " + e));
}


//find closest point to current location
function findClosestPoint(linePointsDistances){
	var closestPoint = 500;
	linePointsDistances.forEach(point => {
		if(point.distance.value < closestPoint){
			closestPoint = point.distance.value
		}
	})
	return closestPoint
}


function getCurrentLocation(marker) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( res => {
			var latlng = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
			marker.setPosition(latlng);
		
			map.setCenter(latlng);
			console.log(res)
			return latlng
		}, err => {
			console.log(err)
		})

		// navigator.geolocation.getCurrentPosition(function(position) {
			// 	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			// 	marker.setPosition(latlng);
			// 	map.setCenter(latlng);
	}
}

//track users location
function trackUsersLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(res => {
			console.log(res)
		}, err => {
			console.log(err)
		})
	}
}

//caculate points distances from current location
function calculateDistanceFromRoute(decodedPoints, currentLocation){
	var linePoints = []

	decodedPoints.forEach(point => {
		var p = {lat: point.lat(), lng: point.lng()}
		linePoints.push(p)
	});

	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix({
		origins: [currentLocation],
		destinations: linePoints,
		travelMode: 'WALKING',
		avoidTolls: true
	}, (res) => {
		console.log(res.rows[0].elements)
		return res.rows[0].elements
	});
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
	var mark = new google.maps.Marker({
		position: location,
		map: map
	});
	if(location) {
		map.panTo(location);
	}
	
	return mark;
}




function addYourLocationButton(map, marker) 
{
	var controlDiv = document.createElement('div');
	
	var firstChild = document.createElement('button');
	
	firstChild.style.backgroundColor = '#fff';
	firstChild.style.border = 'none';
	firstChild.style.outline = 'none';
	firstChild.style.width = '40px';
	firstChild.style.height = '40px';
	firstChild.style.borderRadius = '50px';
	firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
	firstChild.style.cursor = 'pointer';
	firstChild.style.marginRight = '10px';
	firstChild.style.padding = '7px';
	firstChild.title = 'Your Location';
	controlDiv.appendChild(firstChild);
	
	var secondChild = document.createElement('div');
	secondChild.style.height = '26px';
	secondChild.style.backgroundImage = 'url(../icon.png)';
	secondChild.style.backgroundSize = 'contain';
	secondChild.style.backgroundRepeat = 'no-repeat';
	secondChild.id = 'your_location_img';
	firstChild.appendChild(secondChild);
	
	google.maps.event.addListener(map, 'center_changed', function() {
		$('#your_location_img').css('background-position', '0px 0px');
	});

	firstChild.addEventListener('click', function() {		
		getCurrentLocation(marker);
		
	});
	
	controlDiv.index = 1;
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

window.initMap = initMap;