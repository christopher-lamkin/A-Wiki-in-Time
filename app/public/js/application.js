var map;
var styleArray = [];
var myLatLng = {lat: 37.784580, lng: -122.397437};

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 10,
    styles: styleArray
  });

}
