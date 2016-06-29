var React = require('react');
var SubmitForm = require('../components/SubmitForm');
var axios = require('axios');
var PropTypes = React.PropTypes;

var SearchContainer = React.createClass({
  getInitialState(){
    return {
      hasQueried: false,
      queryResults: [],
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var that = this;
    var data = $('form').serialize();
    axios({
      method: 'post',
      url: 'http://localhost:3000/query',
      data: data
    }).then(function(response){
      if (!!response.error) {
        console.log('err', response);
      } else {
        console.log('success', response);
        var events = [];
        var events_array = response.data.events;
        for (var i = 0; i < response.data.events.length; i++) {
          var event = events_array[i]
          var coordinates = {lat: event.latitude, lng: event.longitude};
          // if (type == 'battles') {
            events.push(event);
          // }
        }
        that.props.onUpdate(events)
        that.setState({hasQueried: true})
        that.setState({queryResults: events})
      }
    }).catch(function(err) {
      console.log('fail', err)
    })
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  componentDidUpdate() {

  },

  queryAgain() {
    this.setState({hasQueried: false})
  },


  render(){
    return (
      <SubmitForm
        onFormSubmit={this.handleSubmit}
        queryAgain={this.queryAgain}
        queryResults={this.state.queryResults}
        hasQueried={this.state.hasQueried} />
    )
  }
});

SearchContainer.propTypes = {
  onUpdate: PropTypes.func.isRequired
}

module.exports = SearchContainer;
