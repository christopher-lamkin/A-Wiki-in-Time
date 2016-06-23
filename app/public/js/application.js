var map;
var styleArray = [];
var myLatLng = {lat: 37.784580, lng: -122.397437};

function initMap() {
  var markerSpot;
  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 10,
    styles: styleArray
  });

  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      markerSpot = pos;

      infoWindow.setPosition(pos);
      infoWindow.setContent('Drag and Drop to print lat/lng to console.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
    myLatLng = {lat: 37.784580, lng: -122.397437};
  }

  marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Drag Me!',
    draggable: true
  });
  google.maps.event.addListener(marker, 'dragend', function (event) {
    var lat = event.latLng.lat();
    var long = event.latLng.lng();
    var latlng = {lat: lat, lng: long};
    console.log(latlng)
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}


