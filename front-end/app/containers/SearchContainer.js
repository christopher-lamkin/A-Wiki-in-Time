var React = require('react');
var SubmitForm = require('../components/SubmitForm');
var axios = require('axios');
var PropTypes = React.PropTypes;

var SearchContainer = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var that = this;
    // console.log(e);
    // var form = document.getElementsByTagName('form');
    // var elements = this.refs.form.getDOMNode().elements;
    var data = $('form').serialize();
    console.log('form', $('form'));
    console.log('data', data);
    axios({
      method: 'post',
      url: 'http://localhost:3000/query',
      data: data
    }).then(function(response){
      // console.log('success', response)
      if (!!response.error) {
        console.log('err', response);
      } else {
        console.log('success', response);
        // var qids = response.data[0].qids
        // var type = response.data[0].type
        // console.log(qids)
        // console.log(type)
        var events = [];
        var events_array = response.data.events;
        for (var i = 0; i < response.data.events.length; i++) {
          var event = events_array[i]
          var coordinates = {lat: event.latitude, lng: event.longitude};
          // if (type == 'battles') {
            // console.log('event', event)
            // console.log('coords', coordinates)
            events.push(event);
            // addMarkerWithTimeout(coordinates, i*400, event);
          // }
        }
        this.props.onUpdate(events)
      }
    }).catch(function(err) {
      console.log('fail', err)
    })
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentWillMount() {

  },


  render(){
    return (
      <SubmitForm
        onFormSubmit={this.handleSubmit}/>
    )
  }
});

SearchContainer.propTypes = {
  onUpdate: PropTypes.func.isRequired
}

module.exports = SearchContainer;
