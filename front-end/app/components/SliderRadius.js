var React = require('react');
var PropTypes = React.PropTypes;
var reactNativeBootstrapSliderObj = require('react-bootstrap-native-slider');
var ReactNativeBootstrapSlider = reactNativeBootstrapSliderObj.ReactNativeBootstrapSlider;
// var reactBootstrapSliderObj = require("react-bootstrap-slider");
// var ReactBootstrapSlider = reactBootstrapSliderObj.ReactBootstrapSlider;
var SliderRadius = React.createClass({
  getInitialState(){
    return {
      currentValue: 100,
      step: 1,
      max: 1000,
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
    return(
      <div id="slider-details" >
        <ReactNativeBootstrapSlider
        value={this.state.currentValue}
        handleChange={this.handleUpdateValue}
        step={this.state.step}
        max={this.state.max}
        min={this.state.min} />
      <b style={{float: 'left'}}>{this.state.min} km</b>
      <b style={{float: 'right'}}>{this.state.max} km</b>
        <br />
       Radius: {newValue}
       <br /><br />
       <input ref="sliderRad" type="hidden" value={newValue} name="radius"/>
      </div>
    )
  }
})

module.exports = SliderRadius;
