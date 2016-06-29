var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
require('../main.css');
var NavBarContainer = require('../containers/NavBarContainer');

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
