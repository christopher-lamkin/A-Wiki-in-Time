var React = require('react');
var Gmap = require('../components/Gmap');
var initialCenter = {lat: 37.784580, lng: -122.397437};

var Test = React.createClass({
  render() {
    return (
      <Gmap initialCenter={initialCenter} />
    )
  }
});

module.exports = Test;
