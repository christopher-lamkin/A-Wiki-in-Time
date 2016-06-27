var React = require('react');
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
    styles: styleArray
    };
  // static propTypes(){
  //   initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired
  // },
  },
  render: function() {
    return (
      <div className="GMap">
        <div className='UpdatedText'>
          <p>Current Zoom: { this.state.zoom }</p>
        </div>
        <div className='GMap-canvas' ref="mapCanvas">
          Loading map ...
        </div>
      </div>
  )},

  componentDidMount: function() {
    // create the map, marker and infoWindow after the component has
    // been rendered because we need to manipulate the DOM for Google =(
    this.map = this.createMap()
    this.marker = this.createMarker()
    this.infoWindow = this.createInfoWindow()

    // have to define google maps event listeners here too
    // because we can't add listeners on the map until its created
    google.maps.event.addListener(this.map, 'zoom_changed', function(){
      this.handleZoomChange()
    })
  },

  // clean up event listeners when component unmounts
  componentDidUnMount: function() {
    google.maps.event.clearListeners(map, 'zoom_changed')
  },

  createMap: function() {
    var mapOptions = {
      zoom: this.state.zoom,
      center: this.mapCenter()
    }
    return new google.maps.Map(this.refs.mapCanvas, mapOptions)
  },

  mapCenter: function() {
    return new google.maps.LatLng(
      this.props.initialCenter.lat,
      this.props.initialCenter.lng
    )
  },

  createMarker: function() {
    return new google.maps.Marker({
      position: this.mapCenter(),
      map: this.map
    })
  },

  createInfoWindow: function() {
    var contentString = "<div class='InfoWindow'>I'm a Window that contains Info Yay</div>"
    return new google.maps.InfoWindow({
      map: this.map,
      anchor: this.marker,
      content: contentString
    })
  },

  handleZoomChange: function() {
    this.setState({
      zoom: this.map.getZoom()
    })
  },

});

module.exports = Gmap;

