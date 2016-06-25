var map;
var styleArray = [];
var myLatLng = {lat: 37.784580, lng: -122.397437};
var mostRecentInfoWindow;
var styleArray = [
{
  "featureType": "administrative",
  "elementType": "all",
  "stylers": [
  {
    "visibility": "off"
  }
  ]
},
{
  "featureType": "poi",
  "elementType": "all",
  "stylers": [
  {
    "visibility": "simplified"
  }
  ]
},
{
  "featureType": "road",
  "elementType": "labels",
  "stylers": [
  {
    "visibility": "simplified"
  }
  ]
},
{
  "featureType": "water",
  "elementType": "all",
  "stylers": [
  {
    "visibility": "simplified"
  }
  ]
},
{
  "featureType": "transit",
  "elementType": "all",
  "stylers": [
  {
    "visibility": "simplified"
  }
  ]
},
{
  "featureType": "landscape",
  "elementType": "all",
  "stylers": [
  {
    "visibility": "simplified"
  }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "all",
  "stylers": [
  {
    "visibility": "off"
  }
  ]
},
{
  "featureType": "road.local",
  "elementType": "all",
  "stylers": [
  {
    "visibility": "on"
  }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "geometry",
  "stylers": [
  {
    "visibility": "on"
  }
  ]
},
{
  "featureType": "water",
  "elementType": "all",
  "stylers": [
  {
    "color": "#84afa3"
  },
  {
    "lightness": 52
  }
  ]
},
{
  "featureType": "all",
  "elementType": "all",
  "stylers": [
  {
    "saturation": -17
  },
  {
    "gamma": 0.36
  }
  ]
},
{
  "featureType": "transit.line",
  "elementType": "geometry",
  "stylers": [
  {
    "color": "#3f518c"
  }
  ]
}
]
var updateTextInput = function (val) {
  $('#textInput').empty();
  if (val >= 0) {
    $('#textInput').append('<strong>' + val + ' AD</strong>');
  } else {
    $('#textInput').append('<strong>' + val*-1 + ' BC</strong>');
  }
}
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
      infoWindow.setContent('Drag and Drop to print lat/lng to console and to infoWindow.');
      mostRecentInfoWindow = infoWindow;
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
    position: map.getCenter(),
    map: map,
    title: 'Drag Me!',
    draggable: true
  });
  google.maps.event.addListener(marker, 'dragend', function (event) {
    var lat = event.latLng.lat();
    var long = event.latLng.lng();
    var latlng = {lat: lat, lng: long};
    updateWindow(map, marker, latlng);
    $('#lat-input').val(lat);
    $('#long-input').val(long);
    console.log(latlng);

  });

  map.addListener('mouseover', function() {
    if (!!mostRecentInfoWindow) {
      mostRecentInfoWindow.close();
    }
  })
}

var updateWindow = function (map, marker, latlng) {
  mostRecentInfoWindow.close();
  infoWindow = new google.maps.InfoWindow({
    content: "Latitude: " + latlng.lat + "<br>Longitude: " + latlng.lng
  })
  mostRecentInfoWindow = infoWindow;
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  })
  infoWindow.open(map, marker);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geoloction.');
}

$(document).ready(function() {


  $('#submit-button').on('click', function(event) {

    event.preventDefault();
    var data = $('#input-data').serialize();
    console.log(data);
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/query',
      data: data

    }).done(function(response) {
      console.log(response);

    })
  })


})

