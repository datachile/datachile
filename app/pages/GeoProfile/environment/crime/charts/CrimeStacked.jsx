import React from "react";
import { Section } from "datawheel-canon";
import { StackedArea } from "d3plus-react";
import { translate } from "react-i18next";

import { crimesColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class CrimeStacked extends Section {
  state = {
    show: true
  };

  static need = [];

  render() {
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_crimes_by_crime;
    const locale = i18n.language;
    const classSvg = "crime-stacked";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Complaints Over Time")}</span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        {this.state.show ? (
          <StackedArea
            className={classSvg}
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Crime Group", "ID Crime"],
              label: d => d["Crime"],
              y: d => d["Cases"],
              x: d => d["Year"],
              shapeConfig: {
                fill: d => crimesColorScale("CRIME" + d["ID Crime Group"])
              },
              tooltipConfig: {
                title: d => d["Crime"],
                body: d =>
                  numeral(d["Cases"], locale).format("0,0") +
                  " " +
                  t("complaints")
              },
              xConfig: {
                title: t("Year")
              },
              yConfig: {
                title: t("Number of complaints")
              },
              legendConfig: {
                label: false,
                shapeConfig: {
                  width: 25,
                  height: 25,
                  backgroundImage: d =>
                    "/images/legend/crime/" + d["ID Crime Group"] + ".png"
                }
              },
              legendTooltip: {
                title: d => d["Crime Group"]
              }
            }}
            dataFormat={data => {
              if (
                data.data.reduce((all, item) => {
                  return all + item["Cases"];
                }, 0)
              ) {
                return data.data;
              } else {
                this.setState({ show: false });
              }
            }}
          />
        ) : (
          <NoDataAvailable />
        )}
        <SourceNote cube="crimes" />
      </div>
    );
  }
}

export default translate()(CrimeStacked);
