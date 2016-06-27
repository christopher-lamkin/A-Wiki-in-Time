var React = require('react');
var SubmitForm = require('../components/SubmitForm');


var SearchContainer = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    console.log(e);
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  render(){
    return (
      <SubmitForm onSubmit={this.handleSubmit}/>
    )
  }

})

module.exports = SearchContainer;
