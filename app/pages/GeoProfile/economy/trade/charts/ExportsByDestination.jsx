import React from "react";
import { Section } from "@datawheel/canon-core";
import TreemapStacked from "components/TreemapStacked";
import { translate } from "react-i18next";

import { continentColorScale } from "helpers/colors";
import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import { simpleGeoChartNeed } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class ExportsByDestination extends Section {
  static need = [
    simpleGeoChartNeed("path_exports_by_destination", "exports", ["FOB US"], {
      drillDowns: [["Destination Country", "Country"], ["Date", "Year"]],
      options: { parents: true }
    })
  ];

  render() {
    const { t, className, i18n, router } = this.props;
    const path = this.context.data.path_exports_by_destination;
    const geo = this.context.data.geo;
    const locale = i18n.language;

    const title = t("geo_profile.economy.exports.by_destination", geo);
    const classSvg = "exports-by-destination";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {title}
            <SourceTooltip cube="exports" />
          </span>
          <ExportLink path={path} className={classSvg} title={title} />
        </h3>
        <TreemapStacked
          depth={true}
          path={path}
          msrName="FOB US"
          drilldowns={["Continent", "Country"]}
          className={classSvg}
          defaultChart={"stacked"}
          config={{
            total: d => d["FOB US"],
            totalConfig: {
              text: d => "Total: US $ " + d.text.split(": ")[1]
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
                  router.push(url);
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
                    : "<br/><a>" + t("tooltip.view_profile") + "</a>";
                return (
                  "US " + numeral(d["FOB US"], locale).format("$ (0a)") + link
                );
              }
            },
            legendConfig: {
              label: d => d["Continent"],
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/continent/" + d["ID Continent"] + ".png"
              }
            },
            yConfig: {
              title: t("US$"),
              tickFormat: tick => numeral(tick, locale).format("(0.[0]a)")
            }
          }}
        />
      </div>
    );
  }
}

export default translate()(ExportsByDestination);
