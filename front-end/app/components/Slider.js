
var React = require('react');
var PropTypes = React.PropTypes;
var reactNativeBootstrapSliderObj = require('react-bootstrap-native-slider');
var ReactNativeBootstrapSlider = reactNativeBootstrapSliderObj.ReactNativeBootstrapSlider;

var Slider = React.createClass({
  getInitialState(){
    return {
      currentValue: 100,
      step: 1,
      max: 1000,
      min: 5
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
      <div id="slider-details">
        <ReactNativeBootstrapSlider
        value={this.state.currentValue}
        handleChange={this.handleUpdateValue}
        step={this.state.step}
        max={this.state.max}
        min={this.state.min} />
      <b style={{float: 'left'}}>{this.state.min} years</b>
      <b style={{float: 'right'}}>{this.state.max} years</b>
        <br /> <br />
       Value: { newValue }
       <br /><br />
      </div>
    )
  }
})

module.exports = Slider;
