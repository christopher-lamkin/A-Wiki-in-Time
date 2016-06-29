var React = require('react');
var blueMarkerA = require('../images/blue_MarkerA.png')
// var initialCenter = {lat: 37.784580, lng: -122.397437};

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


// var state = { zoom: 4, styles: styleArray};

var Gmap = React.createClass({
  getInitialState: function(){
  return {
    zoom: 4,
    styles: styleArray,
    mostRecentInfoWindow: { close: function(){} },
    mostRecentMarkerWindow: { close: function(){} },
    eventMarkers: [],
    map: {}
    };
  // static propTypes(){
  //   initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired
  // },
  },
  render: function() {
    var gMapStyles = {
      height: '70%',
      width: '99%',
      margin: '0px auto'
    }

    var gMapCanvasStyles = {
      height: '100%',
      width: '100%',
      margin: '0px auto'
    }
    return (
      <div className="GMap" style={gMapStyles}>
        {/*<div className='UpdatedText'>
          <p>Current Zoom: { this.state.zoom }</p>
        </div>*/}
        <div className='GMap-canvas' ref="mapCanvas" style={gMapCanvasStyles}>
          Loading map ...
        </div>
      </div>
  )},

  componentDidMount: function() {
    this.map = this.createMap()
    this.marker = this.createDraggableMarker();
    // this.infoWindow = this.createInfoWindow();
    var that = this;

    google.maps.event.addListener(this.map, 'zoom_changed', function(){
      that.handleZoomChange()
    });

    google.maps.event.addListener(this.marker, 'dragend', function (event) {
      var lat = event.latLng.lat();
      var long = event.latLng.lng();
      var latlng = {lat: lat, lng: long};
      $('#lat-input').val(lat);
      $('#long-input').val(long);
      this.infoWindow = that.createInfoWindow(latlng);
    });
  },

  // clean up event listeners when component unmounts
  componentDidUnMount: function() {
    google.maps.event.clearListeners(map, 'zoom_changed')
  },

  createMarkersArray: function(events) {
    this.clearEventMarkers(this.state.eventMarkers);
    var that = this;
    var eventMarkers = [];
    events.forEach(function(event) {
      // var marker = that.createMarker({lat: event.latitude, lng: event.longitude});
      var marker = that.newAddMarkerWithTimeout({lat: event.latitude, lng: event.longitude}, 1000, event)
      eventMarkers.push(marker);
    })
    this.setState({eventMarkers: eventMarkers});
  },

  clearEventMarkers: function(eventMarkers) {
    eventMarkers.forEach(function(marker) {
      marker.setMap(null);
    })
  },

  newAddMarkerWithTimeout: function(position, timeout, battle) {
    var that = this;
    this.state.mostRecentInfoWindow.close();
    // var mark;
    var marker = new google.maps.Marker({
      position: position,
      map: that.state.map,
      animation: google.maps.Animation.DROP
    })
    window.setTimeout(function() {
      var adjusted_scraped_date;
      if (battle.scraped_date < 0) {
        adjusted_scraped_date = (battle.scraped_date*-1).toString() + ' BC'
      } else {
        adjusted_scraped_date = battle.scraped_date
      }

      var infoWindow = new google.maps.InfoWindow({
        content: "<strong>Title:</strong> " + battle.title + "<br><strong>Description: </strong>" + battle.description + "<br><strong>Date:</strong> " + adjusted_scraped_date + "<br><strong>Wiki URL:</strong> <a href=" + battle.event_url + " target='_blank'> " + battle.event_url + "</a>"
      })
      marker.addListener('click', function() {
        that.state.mostRecentMarkerWindow.close();
        infoWindow.open(that.map, marker);
        that.setState({mostRecentMarkerWindow: infoWindow});
      })

    }, timeout);
    return marker;
  },

  createMap: function() {
    var mapOptions = {
      zoom: this.state.zoom,
      center: this.mapCenter(),
      styles: this.state.styles
    }
    var map = new google.maps.Map(this.refs.mapCanvas, mapOptions)
    this.setState({map: map})
    return map
  },

  mapCenter: function() {
    return new google.maps.LatLng(
      this.props.initialCenter.lat,
      this.props.initialCenter.lng
    )
  },

  createMarker: function(coordinates) {
    var marker = new google.maps.Marker({
      position: coordinates,
      map: this.map
    })

    return marker
  },

  createDraggableMarker: function() {
    return new google.maps.Marker({
      position: this.mapCenter(),
      map: this.map,
      draggable: true,
      icon: blueMarkerA
    })
  },

  createInfoWindow: function(latlng) {
    this.state.mostRecentInfoWindow.close()
    var contentString = "Latitude: " + latlng.lat + "<br>Longitude: " + latlng.lng
    var infoWindow = new google.maps.InfoWindow({
      map: this.map,
      anchor: this.marker,
      content: contentString
    })
    this.setState({ mostRecentInfoWindow: infoWindow });
    return infoWindow;
  },

  handleZoomChange: function() {
    this.setState({
      zoom: this.map.getZoom()
    })
  },

});

module.exports = Gmap;
