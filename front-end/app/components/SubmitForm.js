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
  return (
    <div>
      <div className="col-sm-8 col-sm-offset-2">
        <ul className="list-unstyled">
          {props.queryResults.map(function(event) {
            return (
              <li key={event.qID}>
                <div className="card card-block">
                  <h3 className="card-title">{event.title}</h3>
                  <span>Coordinates: {event.longitude} : {event.latitude} </span>
                  <p className="card-text">{event.description}</p>
                  <a href={event.event_url} target="_blank">Read More Here</a>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="col-sm-4 col-sm-offset-4">
        <button onClick={props.queryAgain}
          className="btn btn-block btn-success btn-lg">
          Search Again
        </button>
      </div>
    </div>
  )
}


SubmitForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  queryAgain: PropTypes.func.isRequired,
  hasQueried: PropTypes.bool.isRequired,
  queryResults: PropTypes.array.isRequired
}

module.exports = SubmitForm;
