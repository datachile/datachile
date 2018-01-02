import React from "react";
import { translate } from "react-i18next";
import { Treemap, StackedArea } from "d3plus-react";

import "./TreemapStacked.css";

class TreemapStacked extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: "treemap"
    };
    this.toggleChart = this.toggleChart.bind(this);
  }

  toggleChart(chart) {
    this.setState({
      chart
    });
  }

  menuChart(selected) {
    return (
      <div className="treemap-stacked-options">
        <a
          className={`toggle ${selected === "treemap" ? "selected" : ""}`}
          onClick={evt => this.toggleChart("treemap")}
        >
          Treemap
        </a>
        <a
          className={`toggle ${selected === "stacked" ? "selected" : ""}`}
          onClick={evt => this.toggleChart("stacked")}
        >
          Stacked
        </a>
      </div>
    );
  }
  render() {
    const { t, path, i18n, msrName, drilldowns, custom } = this.props;
    const chart = this.state.chart;

    if (!chart) {
      return null;
    }
    switch (chart) {
      case "treemap": {
        return (
          <div>
            <Treemap
              config={{
                ...custom,
                height: 500,
                data: path,
                groupBy: drilldowns,
                sum: d => d[msrName],
                time: "Year"
              }}
              dataFormat={data => data.data}
            />
            {this.menuChart(chart)}
          </div>
        );
      }

      case "stacked": {
        return (
          <div>
            <StackedArea
              config={{
                ...custom,
                total: false,
                totalConfig: {
                  text: ""
                },
                height: 500,
                data: path,
                groupBy: drilldowns[0],
                y: d => d[msrName],
                x: d => d["Year"],

                xConfig: {
                  title: t("Year")
                }
                //legend: false
              }}
              dataFormat={data => data.data}
            />
            {this.menuChart(chart)}
          </div>
        );
      }
    }
  }
}

export default translate()(TreemapStacked);
