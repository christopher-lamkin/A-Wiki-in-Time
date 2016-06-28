var React = require('react');
var Gmap = require('../components/Gmap');
var initialCenter = {lat: 37.784580, lng: -122.397437};
var makeAsycnScriptLoader = require('react-async-script')
console.log(makeAsycnScriptLoader)
// var makeAsyncScript = makeAsycnScriptLoader.makeAsyncScript;

var callbackName = 'onloadcallback';
var URL = "https://maps.googleapis.com/maps/api/js?onload=onloadcallback&key=AIzaSyCj9yUP6BgnHAX-qFkkEQDmgce9hB_vpuo";
var globalName = 'google';

// var makeAsyncScript = React.createClass( Gmap, URL, {
//   callbackName: callbackName,
//   globalName: globalName,
//   initialCenter: initialCenter
// });

var makeAsyncScript = React.createClass({
  Gmap,
  URL,
  { callbackName: callbackName,
  globalName: globalName,
  initialCenter: initialCenter
}
)};

console.log('second call', makeAsyncScript)

module.exports = makeAsyncScript;
