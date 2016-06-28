var React = require('react');
var PropTypes = React.PropTypes;
var SliderStartYr = require('../components/SliderStartYr');
var SliderEndYr = require('../components/SliderEndYr');
var SliderRadius = require('../components/SliderRadius');
var styles = require('../styles');

function SubmitForm() {
  return (
    <div className="jumbotron col-sm-6 col-sm-offset-3 text-center" style={styles.transparentBg}>
        <div className="col-sm-12" >
          <form>
            <div className="form-group">
              <select className="form-control" name="type">
                <option value="battles">Battles</option>
                <option value="other">Other</option>
              </select>
              <br /><br />
              <SliderStartYr />
              <SliderEndYr />
              <SliderRadius />
            </div>
            <div className="form-group col-sm-4 col-sm-offset-4">
              <input
                className="btn btn-block btn-success"
                type="submit" value="Submit" />
            </div>
          </form>
        </div>
    </div>
  )
}


// Prompt.propTypes = {
//
// };

module.exports = SubmitForm;
