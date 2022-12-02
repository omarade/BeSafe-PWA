var map;

// Initialize and add the map
function initMap() {
	const directionsRenderer = new google.maps.DirectionsRenderer();
	const directionsService = new google.maps.DirectionsService();

	// The location of Amsterdam
	const amsterdam = { lat: 52.3676, lng: 4.9041 };

	// The map, centered at Amsterdam
	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 8,
		center: amsterdam,
	});

	
	directionsRenderer.setMap(map);

	//show route on map
	calculateAndDisplayRoute(directionsService, directionsRenderer);


	google.maps.event.addListener(map, 'click', function (event) {
		placeMarker(event.latLng);
		console.log(event.latLng)
	});
}

//find and show walking route based on multiple locations and return decoded points of the route
function calculateAndDisplayRoute(directionsService, directionsRenderer, origin, destination, waypoints) {

	directionsService
	//{ lat: 51.618144, lng: 4.739765 }
	//{ lat: 51.618211, lng: 4.738166 }
	//{ lat: 51.618618, lng: 4.739097 }
		.route({
			origin: { lat: 51.618144, lng: 4.739765 },
			destination: { lat: 51.618618, lng: 4.739097 },
			waypoints: [{
				location: { lat: 51.618211, lng: 4.738166 },
			}],
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

//place marker on map and move camera to it
function placeMarker(location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});
	map.panTo(location);
}

window.initMap = initMap;