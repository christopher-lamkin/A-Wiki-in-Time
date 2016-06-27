var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = React.PropTypes;

// function refsToArray(ctx, prefix){
//   var results = [];
//   for (var i=0;;i++){
//     var ref = ctx.refs[prefix + '-' + String(i)];
//     if (ref) results.push(ref);
//     else return results;
//   }
// }

var RadioGroup = React.createClass({

  // var makeRef = function(){ return 'BoardPanel-'+(_refi++); }, _refi=0;

  getInitialState(){
    return {selectedValue: "5"};
  },

  onChange(event) {
    console.log("event", event);
    this.setState({selectedValue: event.target.value});
    var forms = ReactDOM.findDOMNode(this).querySelectorAll('[type="radio"]');
    Array.prototype.forEach.call(forms, function(radio, i){
      console.log(radio);
      radio.setAttribute('checked', false);
      console.log(radio);
    });
    console.log(ReactDOM.findDOMNode(this).querySelectorAll('[type="radio"]'));
    // ReactDOM.findDOMNode(event.target).querySelector('[type="radio"]').checked = true;
    console.log(this.state.selectedValue)
  },

  componentDidMount: function(){
    console.log("Mounting things");
    console.log("mount", this);
    ReactDOM.findDOMNode(this).querySelector('[type="radio"]').checked = "checked";
  },
  render(){
    return (
      <div id="row">
        <div className="controls-row">
          <label>Within: </label>
            <input
              className="form-control"
              value="5"
              onChange={this.onChange}
              type="radio"
            /> 5 years
            <input
              className="form-control"
              value="20"
              onChange={this.onChange}
              type="radio"
            />  20 years
            <input
              className="form-control"
              value="50"
              onChange={this.onChange}
              type="radio"
            /> 50 years
            <input
              className="form-control"
              value="100"
              onChange={this.onChange}
              type="radio"
            /> 100 years
        </div>
    </div>
    )
  }
})

// function RadioGroup (props) {
//       console.log(RadioGroup.propTypes)
//       var optional = {};
//       if(props.selectedValue !== undefined) {
//         optional.checked = (this.props.selectedValue === props.selectedValue);
//       }
//       if(typeof onChange === 'function') {
//         optional.onChange = onChange.bind(null, this.props.value);
//       }
//       return (
//         <div id="row">
//           <div className="controls-row">
//             <label>Within: </label>
//               <input
//                 className="form-control"
//                 value="5"
//                 onChange = {props.selectedValue}
//                 type="radio"
//               /> 5 years
//               <input
//                 className="form-control"
//                 value="20"
//                 onChange = {props.selectedValue}
//                 type="radio"
//               />  20 years
//               <input
//                 className="form-control"
//                 value="50"
//                 onChange = {props.selectedValue}
//                 type="radio"
//               /> 50 years
//               <input
//                 className="form-control"
//                 value="100"
//                 onChange = {props.selectedValue}
//                 type="radio"
//               /> 100 years
//           </div>
//       </div>
//     )
// }
//
  RadioGroup.propTypes = {
    selectedValue: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  },

module.exports = RadioGroup;
