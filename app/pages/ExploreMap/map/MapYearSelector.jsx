import React, { Component } from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Select from "components/Select";

import "./MapYearSelector.css";

class MapYearSelector extends Component {
  static need = [];

  constructor(props) {
    super(props);
  }

  render() {
    const { t, mapYear, mapYearOptions, setMapYearSelected } = this.props;
    if (!mapYearOptions) {
      return null;
    }
    if (!mapYear) {
      setMapYearSelected({
        newValue: mapYearOptions[mapYearOptions.length - 1]
      });
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
    dispatch({ type: "SETPARAM_MAPYEAR", payload: value.newValue });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    mapYear: state.map.year.value,
    mapYearOptions: [2011, 2012, 2013, 2014, 2015, 2016] //state.map...
  };
};

MapYearSelector = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapYearSelector)
);

export default MapYearSelector;
export { MapYearSelector };
