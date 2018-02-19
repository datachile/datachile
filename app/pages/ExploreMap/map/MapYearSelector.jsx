import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Select from "components/Select";

import "./MapYearSelector.css";

class MapYearSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { mapYearOptions: [] };
  }

  componentWillReceiveProps(nextProps) {
    const { setMapYearSelected, results } = nextProps;
    if (this.props.results != results) {
      if (results.queries.regiones) {
        this.setState(
          {
            mapYearOptions: [
              ...new Set(
                results.queries.regiones.data.map(item => item["ID Year"])
              )
            ]
          },
          () => {
            setMapYearSelected({
              newValue: this.state.mapYearOptions[
                this.state.mapYearOptions.length - 1
              ]
            });
          }
        );
      }
    }
  }

  render() {
    const { t, mapYear, setMapYearSelected } = this.props;
    const { mapYearOptions } = this.state;

    if (mapYearOptions.length == 0) {
      return null;
    }

    return (
      <div className="map-year-selector">
        <Select
          id="years"
          options={mapYearOptions.map(y => {
            return { year: y };
          })}
          value={mapYear}
          labelField="year"
          valueField="year"
          onChange={setMapYearSelected}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setMapYearSelected(value) {
    dispatch({ type: "MAP_YEAR_SET", payload: value.newValue });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    mapYear: state.map.year.value,
    results: state.map.results
  };
};

MapYearSelector = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapYearSelector)
);

export default MapYearSelector;
export { MapYearSelector };
