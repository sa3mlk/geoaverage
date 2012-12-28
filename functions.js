var map;
var infoWindow = null;

$(function () {
	var mapDiv = document.getElementById("map");
	var mapOptions = {
		mapTypeControl: false,
		mapTypeId: eniro.maps.MapTypeId.HYBRID,
		zoomControl: false,
		zoom: 17
	};

	map = new eniro.maps.Map(mapDiv, mapOptions);
	eniro.maps.event.addListener(map, 'center_changed', centerChanged);

	if (navigator.geolocation) {
		var options = { maximumAge: 5000, enableHighAccuracy: true };
		navigator.geolocation.watchPosition(showPosition, showError, options);
	} else {
		alert("Din webbläsare stödjer inte HTML5 Geo API");
	}

	map.setFocus(true);

});

function latLngToDecMin(coords) {
	var dd = Math.floor(coords.latitude);
	var mm = (60.0 * (coords.latitude % dd)).toFixed(3);
	var result = "N " + dd + "° " + mm + "'<br/>";
	dd = Math.floor(coords.longitude);
	mm = (60.0 * (coords.longitude % dd)).toFixed(3);
	return result + "E 0" + dd + "° " + mm + "'<br/>";
}

function formatAccuracy(accuracy) {
	var result;
	var rounded = accuracy;
	if (rounded > 10000) {
		result = (rounded / 10000).toFixed(1) + "mils";
	} else if (rounded > 1000) {
		result = (rounded / 1000).toFixed(1) + "km";
	} else {
		result = rounded.toFixed(0) + "m";
	}

	return result + " noggrannhet";
}

function centerChanged() {
	if (infoWindow === null) {
		infoWindow = new eniro.maps.InfoWindow();
		infoWindow.setPosition(this.getCenter());
		infoWindow.open(this);
	}

	var coords = { latitude: this.getCenter().getLat(), longitude: this.getCenter().getLng() };
	infoWindow.setPosition(this.getCenter());
	infoWindow.setContent("<small>Kartans mittpunkt:</small><br/>" + latLngToDecMin(coords));
	infoWindow.open(this);
}

function showPosition(pos) {
	var newPos = new eniro.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	map.panTo(newPos);
	var div = document.getElementById("gps_coord");
	div.innerHTML = "<small>Enligt din GPS:</small><br/>" + latLngToDecMin(pos.coords) + "<small>(" + formatAccuracy(pos.coords.accuracy) + ")</small>";
}

function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			alert("Synd för dig.");
			break;
		case error.POSITION_UNAVAILABLE:
			alert("Kan inte utläsa någon position.");
			break;
		case error.TIMEOUT:
			alert("Fick inget svar från din GPS.");
			break;
		case error.UNKNOWN_ERROR:
			alert("Ett okänt fel har inträffat.");
			break;
	}
}

