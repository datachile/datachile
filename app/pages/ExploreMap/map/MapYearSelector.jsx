import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Select from "components/Select";

import "./MapYearSelector.css";

class MapYearSelector extends React.Component {
  render() {
    const { t, mapYear, mapYearOptions, setMapYearSelected } = this.props;

    if (mapYearOptions.length == 0) {
      return null;
    }

    return (
      <div className="map-year-selector">
        <Select
          id="years"
          options={mapYearOptions.map(year => ({ year }))}
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
    mapYear: state.map.params.year,
    mapYearOptions: state.map.options.year
  };
};

MapYearSelector = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapYearSelector)
);

export default MapYearSelector;
export { MapYearSelector };
