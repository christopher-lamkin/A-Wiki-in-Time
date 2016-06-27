var React = require('react');
var PropTypes = React.PropTypes;

function RadioGroup (props) {
      console.log(RadioGroup.propTypes)
      var optional = {};
      if(props.selectedValue !== undefined) {
        optional.checked = (this.props.value === props.selectedValue);
      }
      if(typeof onChange === 'function') {
        optional.onChange = onChange.bind(null, this.props.value);
      }
      return (
        <div id="radio-buttons">
        <label>Within: </label>
        <input
          className="form-control"
          value="5"
          type="radio"
        /> 5 years
        <input
          className="form-control"
          value="20"
          type="radio"
        />  20 years
        <input
          className="form-control"
          value="50"
          type="radio"
        /> 50 years
        <input
          className="form-control"
          value="100"
          type="radio"
        /> 100 years
      </div>
    )
}

  RadioGroup.propTypes = {
    selectedValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  },

module.exports = RadioGroup;
