import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router";
import { connect } from "react-redux";

import "./MapOptions.css";

class MapOptions extends Component {
  static need = [];

  constructor(props) {
    super(props);
  }

  render() {
    const { t, saveDataset, datasetsQty = 0 } = this.props;
    return (
      <div className="map-options">
        <Link className={`option`} to="/explore/map/data">
          {t("See data")}
        </Link>
        <a className={`option`} onClick={evt => saveDataset("dataset1")}>
          {t("Save data")}
          {datasetsQty > 0 && <span> ({datasetsQty})</span>}
        </a>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  saveDataset(value) {
    dispatch({
      type: "MAP_SAVE_DATASET",
      dataset: {
        title: value,
        data: [1, 2, 3]
      }
    });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    datasetsQty: state.map.datasets.list.length
  };
};

MapOptions = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapOptions)
);

export default MapOptions;
export { MapOptions };
