var React = require('react');
var SubmitForm = require('../components/SubmitForm');
var axios = require('axios');


var SearchContainer = React.createClass({
  getInitialState: function() {
    return {
      events: []
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    // console.log(e);
    // var form = document.getElementsByTagName('form');
    // var elements = this.refs.form.getDOMNode().elements;
    var data = $('form').serialize();
    axios({
      method: 'post',
      url: 'http://localhost:3000/query',
      data: data
    }).then(function(response){
      console.log('success', response)
      if (!!response.error) {
        console.log(response);
      } else {
        var qids = response.data[0].qids
        var type = response.data[0].type
        // console.log(qids)
        // console.log(type)
        var events = [];
        for (var i = 1; i < response.data.length; i++) {
          var event = response.data[i][qids[i-1]];
          var coordinates = {lat: event.latitude, lng: event.longitude};
          if (type == 'battles') {
            // console.log('event', event)
            // console.log('coords', coordinates)
            events.push(event);
            // addMarkerWithTimeout(coordinates, i*400, event);
          }
        }
        this.setState({'events': events})
      }
    }).catch(function(err) {
      console.log('fail', err)
    })
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentWillMount() {
    console.log
  },

  render(){
    return (
      <SubmitForm onFormSubmit={this.handleSubmit}/>
    )
  }
})

module.exports = SearchContainer;
