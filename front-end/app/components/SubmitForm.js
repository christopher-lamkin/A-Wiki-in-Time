var React = require('react');
var PropTypes = React.PropTypes;
var SliderStartYr = require('../components/SliderStartYr');
var SliderEndYr = require('../components/SliderEndYr');
var SliderRadius = require('../components/SliderRadius');
var styles = require('../styles');
var ReactDOM = require('react-dom');

function SubmitForm(props){
if (!props.hasQueried) {
  return(
     <div className="jumbotron col-sm-6 col-sm-offset-3 text-center" style={styles.transparentBg}>
        <div className="col-sm-12" >
          <form onSubmit={props.onFormSubmit}>
            <div className="form-group">
              <select className="form-control" name="type">
                <option value="battles">Battles</option>
                <option value="other">Other</option>
              </select>
              <br /><br />
              <SliderStartYr />
              <SliderEndYr />
              <SliderRadius />
              <input id='lat-input' type='hidden' name='lat' value='' />
              <input id='long-input' type='hidden' name='long' value='' />
            </div>
            <div className="form-group col-sm-4 col-sm-offset-4">
              <input
                className="btn btn-block btn-success btn-lg"
                type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </div>
    )
  }
  return ( <div>Loading</div>)
  }


SubmitForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  hasQueried: PropTypes.bool.isRequired
}

module.exports = SubmitForm;
