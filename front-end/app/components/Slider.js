
var React = require('react');
var PropTypes = React.PropTypes;
var reactNativeBootstrapSliderObj = require('react-bootstrap-native-slider');
var ReactNativeBootstrapSlider = reactNativeBootstrapSliderObj.ReactNativeBootstrapSlider;
// var reactBootstrapSliderObj = require("react-bootstrap-slider");
// var ReactBootstrapSlider = reactBootstrapSliderObj.ReactBootstrapSlider;

var Slider = React.createClass({
  getInitialState(){
    var today = new Date();
    var year = today.getFullYear();
    return {
      currentValue: 100,
      step: 1,
      max: year,
      min: 0,
      range: true
    }
  },
  handleUpdateValue(e) {
    this.setState({ currentValue: e.target.value });
  },

  componentDidMount: function(){
    // componentDidMount is called by react when the component
    // has been rendered on the page. We can set the interval here:
  },

  componentWillUnmount: function(){
    // This method is called immediately before the component is removed
    // from the page and destroyed. We can clear the interval here:
    // clearInterval(this);
  },

  render(){
    var newValue = this.state.currentValue;
    // var newValue2 = this.state.currentValue[1];
    return(
      <div id="slider-details" >
        <ReactNativeBootstrapSlider
        value={this.state.currentValue}
        //range={this.state.range}
        handleChange={this.handleUpdateValue}
        step={this.state.step}
        max={this.state.max}
        min={this.state.min}
        reverse={true}/>
      <b style={{float: 'left'}}>year {this.state.min}</b>
      <b style={{float: 'right'}}>{this.state.max}</b>
        <br /> <br />
       Year: {newValue}
       <br /><br />
      </div>
    )
  }
})

module.exports = Slider;
