import React from "react";
import { translate } from "react-i18next";
import { Treemap, StackedArea } from "d3plus-react";
import NoDataAvailable from "components/NoDataAvailable";

import "./TreemapStacked.css";

class TreemapStacked extends React.Component {
  state = {
    chart: "loading"
  };

  toggleChart(chart) {
    this.setState({ chart });
  }

  renderMenu(selected) {
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

  renderTreemap() {
    const {
      t,
      path,
      msrName,
      drilldowns,
      config,
      depth,
      className
    } = this.props;

    return (
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
              this.setState({ chart: "nodata" });
            }
          }}
        />
        {this.renderMenu(chart)}
      </div>
    );
  }

  renderStacked() {
    const {
      t,
      path,
      msrName,
      drilldowns,
      config,
      depth,
      className
    } = this.props;

    return (
      <div className={className}>
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
              this.setState({ chart: "nodata" });
            }
          }}
        />
        {this.renderMenu(chart)}
      </div>
    );
  }

  render() {
    switch (this.state.chart) {
      case "loading":
        return null;

      case "nodata":
        return <NoDataAvailable />;

      case "treemap":
        return this.renderTreemap();

      case "stacked":
        return this.renderStacked();
    }
  }
}

export default translate()(TreemapStacked);
