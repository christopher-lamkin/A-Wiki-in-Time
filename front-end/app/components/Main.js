var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
require('../main.css');
var NavBarContainer = require('../containers/NavBarContainer');

// var WindowDimensions = React.createClass({
//     render: function() {
//         return <span>{this.state.width} x {this.state.height}</span>;
//     },
//     updateDimensions: function() {
//         this.setState({width: $(window).width(), height: $(window).height()});
//     },
//     componentWillMount: function() {
//         this.updateDimensions();
//     },
//     componentDidMount: function() {
//         window.addEventListener("resize", this.updateDimensions);
//     },
//     componentWillUnmount: function() {
//         window.removeEventListener("resize", this.updateDimensions);
//     }
// });

var Main = React.createClass({
  render() {
    return (
      <div className='main-container'>
        <NavBarContainer />
        <ReactCSSTransitionGroup
          transitionName="appear"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
            {React.cloneElement(this.props.children, {key: this.props.location.pathname})}
          </ReactCSSTransitionGroup>
      </div>
    )
  }
});

module.exports = Main;
