import React from "react";
import { translate } from "react-i18next";
import { Treemap, StackedArea } from "d3plus-react";
import NoDataAvailable from "components/NoDataAvailable";

import "./TreemapStacked.css";

class TreemapStacked extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: props.defaultChart || "treemap",
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
      <div className="btn-group">
        <button
          className={`btn font-xxs ${
            selected === "treemap" ? "is-active" : "is-inactive"
          }`}
          onClick={() => this.toggleChart("treemap")}
        >
          <span className="btn-icon pt-icon pt-icon-control" />
          <span className="btn-text">Treemap</span>
        </button>
        <button
          className={`btn font-xxs ${
            selected === "stacked" ? "is-active" : "is-inactive"
          }`}
          onClick={() => this.toggleChart("stacked")}
        >
          <span className="btn-icon pt-icon pt-icon-timeline-area-chart" />
          <span className="btn-text">Stacked</span>
        </button>
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
                height: 400,
                data: path,
                label: d => d[drilldowns[drilldowns.length - 1]],
                groupBy: drilldowns.map(dd => "ID " + dd),
                //groupBy: ["ID " + drilldowns[0], "ID " + drilldowns[1]],
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
          <div className={className}>
            <StackedArea
              config={{
                ...config,
                label: !depth
                  ? d => d[drilldowns[0]]
                  : d => d[drilldowns[drilldowns.length - 1]],
                total: false,
                totalConfig: {
                  text: ""
                },
                height: 400,
                data: path,
                groupBy: !depth
                  ? `ID ${drilldowns[0]}`
                  : drilldowns.map(dd => `ID ${dd}`),
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
