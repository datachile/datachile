import React from "react";
import { translate } from "react-i18next";
import { Treemap, StackedArea } from "d3plus-react";
import NoDataAvailable from "components/NoDataAvailable";

import "./TreemapStacked.css";

class TreemapStacked extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: "treemap",
      show: true
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
    const {
      t,
      path,
      msrName,
      drilldowns,
      config,
      depth,
      className
    } = this.props;
    const chart = this.state.chart;

    if (!chart) {
      return null;
    }

    switch (chart) {
      case "treemap": {
        return this.state.show ? (
          <div className={className}>
            <Treemap
              config={{
                ...config,
                height: 500,
                data: path,
                label: d => d[drilldowns[1]],
                groupBy: ["ID " + drilldowns[0], "ID " + drilldowns[1]],
                sum: d => d[msrName],
                time: "Year"
              }}
              dataFormat={data => {
                if (data.data && data.data.length > 0) {
                  return data.data;
                } else {
                  this.setState({ show: false });
                }
              }}
            />
            {this.menuChart(chart)}
          </div>
        ) : (
          <NoDataAvailable />
        );
      }

      case "stacked": {
        return this.state.show ? (
          <div>
            <StackedArea
              config={{
                ...config,
                label: !depth ? d => d[drilldowns[0]] : config.label,
                total: false,
                totalConfig: {
                  text: ""
                },
                height: 500,
                data: path,
                groupBy: !depth
                  ? "ID " + drilldowns[0]
                  : ["ID " + drilldowns[0], "ID " + drilldowns[1]],
                y: d => d[msrName],
                x: d => d["Year"],

                xConfig: {
                  title: t("Year")
                }
                //legend: false
              }}
              dataFormat={data => {
                if (data.data && data.data.length > 0) {
                  return data.data;
                } else {
                  this.setState({ show: false });
                }
              }}
            />
            {this.menuChart(chart)}
          </div>
        ) : (
          <NoDataAvailable />
        );
      }
    }
  }
}

export default translate()(TreemapStacked);
