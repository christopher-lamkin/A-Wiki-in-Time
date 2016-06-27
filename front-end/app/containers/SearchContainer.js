var React = require('react');
var SubmitForm = require('../components/SubmitForm');
var RadioGroup = require('../components/RadioGroup');

var SearchContainer = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  render(){
    return (
      <SubmitForm />
    )
  }

})

module.exports = SearchContainer;
