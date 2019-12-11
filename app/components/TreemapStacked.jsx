import React from "react";
import {withNamespaces} from "react-i18next";
import {Treemap, StackedArea} from "d3plus-react";
import NoDataAvailable from "components/NoDataAvailable";

import "./TreemapStacked.css";

class TreemapStacked extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: props.defaultChart,
      show: true
    };

    this.setTreemap = this.toggleChart.bind(this, "treemap");
    this.setStacked = this.toggleChart.bind(this, "stacked");
  }

  toggleChart(chart) {
    this.setState({chart});
  }

  menuChart(selected) {
    const isStacked = selected === "stacked";
    return (
      <div className="btn-group">
        <button
          className={`btn font-xxs ${!isStacked ? "is-active" : "is-inactive"}`}
          onClick={this.setTreemap}
        >
          <span className="btn-icon bp3-icon bp3-icon-control" />
          <span className="btn-text">Treemap</span>
        </button>
        <button
          className={`btn font-xxs ${isStacked ? "is-active" : "is-inactive"}`}
          onClick={this.setStacked}
        >
          <span className="btn-icon bp3-icon bp3-icon-timeline-area-chart" />
          <span className="btn-text">Stacked</span>
        </button>
      </div>
    );
  }

  render() {
    const {
      className,
      config,
      dataFormat,
      depth,
      drilldowns,
      msrName,
      path,
      t
    } = this.props;
    const {chart, show} = this.state;

    if (!chart || !show) {
      return <NoDataAvailable />;
    }

    const label = d => {
      let i = drilldowns.length;
      while (i--) {
        const drilldown = drilldowns[i];
        if (Array.isArray(d[drilldown])) continue;
        return "" + d[drilldown];
      }
      return "" + d[drilldowns[0]];
    };
    const dataPreformat = typeof path === "string" ? data => {
      if (data.data && data.data.length > 0) {
        return dataFormat ? dataFormat(data) : data.data;
      }
      else {
        this.setState({show: false});
      }
    } : undefined;

    if (chart === "treemap") {
      return (
        <div className={className}>
          <Treemap
            config={{
              ...config,
              height: 400,
              data: path,
              label,
              groupBy: drilldowns.map(dd => "ID " + dd),
              //groupBy: ["ID " + drilldowns[0], "ID " + drilldowns[1]],
              sum: d => d[msrName],
              time: "Year"
            }}
            dataFormat={dataPreformat}
          />
          {this.menuChart(chart)}
        </div>
      );
    }
    else {
      return (
        <div className={className}>
          <StackedArea
            config={{
              ...config,
              label: !depth ? d => d[drilldowns[0]] : label,
              total: false,
              totalConfig: {
                text: ""
              },
              height: 400,
              data: path,
              groupBy: !depth ? `ID ${drilldowns[0]}` : drilldowns.map(dd => `ID ${dd}`),
              y: d => d[msrName],
              x: d => d["Year"],

              xConfig: {
                title: t("Year")
              }
              //legend: false
            }}
            dataFormat={dataPreformat}
          />
          {this.menuChart(chart)}
        </div>
      );
    }
  }
}

TreemapStacked.defaultProps = {
  defaultChart: "treemap"
};

export default withNamespaces()(TreemapStacked);
