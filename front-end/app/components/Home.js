var React = require('react');
var SubmitForm = require('../components/SubmitForm');
var Gmap = require('../components/Gmap');
var initialCenter = {lat: 37.784580, lng: -122.397437};
var GmapWrapper = require('../components/GmapWrapper');

function onLoad() {
  console.log('script loaded');
}

var Home = React.createClass({
  getInitialState() {
    return {
      isLoaded: false
    }
  },

  // componentDidMount: function(){
  //   if (google) {
  //     this.setState({isLoaded: true});
  //   }
  // },

  render() {
        return (
          <div style={{width: '100%', height: '100%'}}>
            <GmapWrapper asyncScriptOnLoad={onLoad} initialCenter={initialCenter} />
            <SubmitForm />
          </div>
        )
  }
});

module.exports = Home;
