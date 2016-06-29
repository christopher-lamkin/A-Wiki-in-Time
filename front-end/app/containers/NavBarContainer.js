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
        {/*<div className="container">*/}
          <div id='header' className="col-center">
            <span className='header-div'><a href='/'>A </a></span>
            <span className='header-div' id='wiki-header'><a href='/'>WiKi</a></span>
            <span className='header-div'><a href='/'>in </a></span>
            <span className='header-div'><a href='/'>Time</a></span>
            <button id="login" className='btn btn-warning-outline btn-lg' type='button'> Login </button>
            <button id="register" className='btn btn-danger btn-lg' type='button'> Register </button>
          {/*</div>*/}
        </div>
      </nav>
    )
  }

})


module.exports = NavBarContainer;
