var React = require('react');
var styles = require('../styles');

var NavBarContainer = React.createClass({
  componentDidMount(){
    console.log(this)
      $('#wiki-header').hover(function() {
        $(this).addClass('magictime perspectiveUpRetourn')
      });

      $('.GMap').hover(function() {
        $('#wiki-header').removeClass('magictime perspectiveUpRetourn')
      })
  },

  render(){
    return(
      <nav className="navbar">
        <div id='header' className="nav">
          <div className="container">
            <div className='header-div'><a href='/'>A </a></div>
            <div className='header-div' id='wiki-header'><a href='/'>WiKi</a></div>
            <div className='header-div'><a href='/'>in </a></div>
            <div className='header-div'><a href='/'>Time</a></div>
          </div>
        </div>
      </nav>
    )
  }

})


module.exports = NavBarContainer;
