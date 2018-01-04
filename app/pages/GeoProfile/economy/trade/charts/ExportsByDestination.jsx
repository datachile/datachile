import React from "react";
import { Section } from "datawheel-canon";
import TreemapStacked from "components/TreemapStacked";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { continentColorScale } from "helpers/colors";
import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import { simpleGeoChartNeed } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class ExportsByDestination extends Section {
  static need = [
    simpleGeoChartNeed("path_exports_by_destination", "exports", ["FOB US"], {
      drillDowns: [["Destination Country", "Country"], ["Date", "Year"]],
      options: { parents: true }
    })
  ];

  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.path_exports_by_destination;
    const geo = this.context.data.geo;
    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t(`Exports by destination of firms located in ${geo.name}`)}
          </span>
          <ExportLink path={path} />
        </h3>
        <TreemapStacked
          path={path}
          msrName="FOB US"
          drilldowns={["Continent", "Country"]}
          config={{
            total: d => d["FOB US"],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "($ 0.[00] a)"
                )
            },
            shapeConfig: {
              fill: d => continentColorScale("c" + d["ID Continent"])
            },
            on: {
              click: d => {
                if (!(d["ID Country"] instanceof Array)) {
                  var url = slugifyItem(
                    "countries",
                    d["ID Continent"],
                    d["Continent"],
                    d["ID Country"] instanceof Array ? false : d["ID Country"],
                    d["Country"] instanceof Array ? false : d["Country"]
                  );
                  browserHistory.push(url);
                }
              }
            },
            tooltipConfig: {
              title: d => {
                return d["Country"] instanceof Array
                  ? d["Continent"]
                  : d["Country"];
              },
              body: d => {
                const link =
                  d["ID Country"] instanceof Array
                    ? ""
                    : "<br/><a>" + t("tooltip.to_profile") + "</a>";
                return (
                  "US" + numeral(d["FOB US"], locale).format("$ (0 a)") + link
                );
              }
            },
            legendConfig: {
              label: d => d["Continent"],
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: d =>
                  "/images/legend/continent/" + d["ID Continent"] + ".png"
              }
            },
            yConfig: {
              title: t("US$"),
              tickFormat: tick => numeral(tick, locale).format("(0 a)")
            }
          }}
        />
        <SourceNote cube="exports" />
      </div>
    );
  }
}

export default translate()(ExportsByDestination);
