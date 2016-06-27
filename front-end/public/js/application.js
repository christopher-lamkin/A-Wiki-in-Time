var map;
var styleArray = [];
var myLatLng = {lat: 32.866756, lng: -83.469486};
var mostRecentInfoWindow;
var markers = [];
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
    zoom: 4,
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
    // position: map.getCenter(),
    position: myLatLng,
    map: map,
    draggable: true
  });
  $('#lat-input').val(myLatLng.lat);
  $('#long-input').val(myLatLng.lng);

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
  var infoWindow = new google.maps.InfoWindow({
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

function addMarkerWithTimeout(position, timeout, battle) {
  window.setTimeout(function() {
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    })
    markers.push(marker);

    var infoWindow = new google.maps.InfoWindow({
      content: "<strong>Title:</strong> " + battle.title + "<br><strong>Description: </strong>" + battle.description + "<br><strong>Date:</strong> " + battle.end_time + "<br><strong>Wiki URL:</strong> <a href=" + battle.link + " target='_blank'> " + battle.link + "</a>"
    })
    mostRecentInfoWindow = infoWindow;
    marker.addListener('click', function() {
      mostRecentInfoWindow.close();
      infoWindow.open(map, marker);
      mostRecentInfoWindow = infoWindow;
    })

  }, timeout);
}

function addArchaeologyMarkerWithTimeout(position, timeout, site) {
  window.setTimeout(function() {
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    })
    markers.push(marker);

    var infoWindow = new google.maps.InfoWindow({
      content: "<strong>Title:</strong> " + site.title + "<br><strong>Wiki URL:</strong> <a href=" + site.link + " target='_blank'> " + site.link + "</a>"
    })
    mostRecentInfoWindow = infoWindow;
    marker.addListener('click', function() {
      mostRecentInfoWindow.close();
      infoWindow.open(map, marker);
      mostRecentInfoWindow = infoWindow;
    })

  }, timeout);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

$(document).ready(function() {


  $('#wiki-header').hover(function() {
    $(this).addClass('magictime perspectiveUpRetourn')
    // setTimeout(function(){
    //   $(this).removeClass('magictime perspectiveUpRetourn');
    // }, 3000)
  });

  $('#map-container').hover(function() {
    $('#wiki-header').removeClass('magictime perspectiveUpRetourn')
  })

  $('#submit-button').on('click', function(event) {

    event.preventDefault();
    var data = $('#input-data').serialize();
    console.log(data);
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/query',
      data: data

    }).done(function(response) {
      if (!!response.error) {
        console.log(response);
      } else {
        var qids = response[0].qids
        var type = response[0].type
        clearMarkers();
        for (i = 1; i < response.length; i++) {
          var event = response[i][qids[i-1]];
          var coordinates = {lat: event.latitude, lng: event.longitude};

          if (type == 'battles') {
            addMarkerWithTimeout(coordinates, i*400, event);
          } else {
            addArchaeologyMarkerWithTimeout(coordinates, i*400, event);
          }
        }
      }
    })
  })
})




