var React = require('react');
// var SubmitForm = require('../components/SubmitForm');
var Gmap = require('../components/Gmap');
var initialCenter = {lat: 37.784580, lng: -122.397437};
var SearchContainer = require('../containers/SearchContainer');


var Home = React.createClass({
  getInitialState() {
    return {
      isLoaded: false,
      data: []
    }
  },

  handleUpdate(events){
    this.setState({
      data: events
    })
  },

  componentDidUpdate() {
    this.refs.map.createMarkersArray(this.state.data);
  },

  componentWillMount() {
    if(google) {
      this.setState({isLoaded: true});
    }
  },

  render() {
    return this.state.isLoaded === false
    ? <div>loading...</div>
    : <div style={{width: '100%', height: '100%'}}>
      <Gmap initialCenter={initialCenter} ref="map"/>
      <SearchContainer onUpdate={this.handleUpdate}/>
      </div>
    }
  });

module.exports = Home;
