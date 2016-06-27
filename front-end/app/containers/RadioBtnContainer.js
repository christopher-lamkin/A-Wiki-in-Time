var React = require('react');
var SubmitForm = require('../components/SubmitForm');
var RadioGroup = require('../components/RadioGroup');

var RadioBtnContainer = React.createClass({
  getInitialState(){
   return {selectedValue: 5};
 },

  handleChange(value) {
     this.setState({selectedValue: value});
   },

  componentDidMount: function(){
        this.getDOMNode().querySelector('[type="radio"]').checked = "checked";
    },
  render(){
    return (
      <RadioGroup
        selectedValue={this.state.selectedValue}
        onChange={this.handleChange}/>
    )
  }

})

module.exports = RadioBtnContainer;
