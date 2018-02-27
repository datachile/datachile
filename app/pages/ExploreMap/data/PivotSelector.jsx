import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import "./PivotSelector.css";

class PivotSelector extends React.Component {
  render() {
    const { t, pivotType, setPivotType, datasets } = this.props;

    return (
      <div className="pivot-options">
        <p className="pivot-text">{t("Visualize by")}</p>
        <div className="pivot-options-container">
          <a
            className={`toggle ${pivotType === "cols" ? "selected" : ""} ${
              !datasets.length ? "disabled" : ""
            }`}
            onClick={evt => {
              if (datasets.length) {
                setPivotType("cols");
              }
            }}
          >
            {t("Columns")}
          </a>
          <a
            className={`toggle ${pivotType === "rows" ? "selected" : ""} ${
              !datasets.length ? "disabled" : ""
            }`}
            onClick={evt => {
              if (datasets.length) {
                setPivotType("rows");
              }
            }}
          >
            {t("Rows")}
          </a>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setPivotType(payload) {
    dispatch({ type: "MAP_PIVOT_SET", payload });
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    pivotType: state.map.pivot,
    datasets: state.map.datasets
  };
};

PivotSelector = translate()(
  connect(mapStateToProps, mapDispatchToProps)(PivotSelector)
);

export default PivotSelector;
export { PivotSelector };
