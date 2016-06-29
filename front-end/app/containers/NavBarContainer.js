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
            <span className='header-div'><a href='/'>A </a></span>
            <span className='header-div' id='wiki-header'><a href='/'>WiKi</a></span>
            <span className='header-div'><a href='/'>in </a></span>
            <span className='header-div'><a href='/'>Time</a></span>
          </div>
        </div>
      </nav>
    )
  }

})


module.exports = NavBarContainer;
