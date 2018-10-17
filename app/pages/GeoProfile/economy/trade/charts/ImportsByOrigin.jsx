import React from "react";
import { Section } from "@datawheel/canon-core";
import TreemapStacked from "components/TreemapStacked";
import { translate } from "react-i18next";

import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import { continentColorScale } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class ImportsByOrigin extends Section {
  static need = [
    simpleGeoChartNeed("path_imports_by_origin", "imports", ["CIF US"], {
      drillDowns: [["Origin Country", "Country"], ["Date", "Year"]],
      options: { parents: true }
    })
  ];

  render() {
    const { t, className, i18n, router } = this.props;
    const path = this.context.data.path_imports_by_origin;
    const geo = this.context.data.geo;
    const locale = i18n.language;

    const title = t("geo_profile.economy.imports.by_origin", geo);
    const classSvg = "imports-by-origin";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {title}
            <SourceTooltip cube="imports" />
          </span>
          <ExportLink path={path} title={title} className={classSvg} />
        </h3>
        <TreemapStacked
          depth={true}
          path={path}
          msrName="CIF US"
          drilldowns={["Continent", "Country"]}
          className={classSvg}
          defaultChart={"stacked"}
          config={{
            shapeConfig: {
              fill: d => continentColorScale("c" + d["ID Continent"])
            },
            total: d => d["CIF US"],
            totalConfig: {
              text: d => "Total: US $ " + d.text.split(": ")[1]
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
              title: d =>
                d["Country"] instanceof Array ? d["Continent"] : d["Country"],
              body: d => {
                const link =
                  d["ID Country"] instanceof Array
                    ? ""
                    : "<br/><a>" + t("tooltip.view_profile") + "</a>";
                return (
                  "US " +
                  numeral(d["CIF US"], locale).format("$ (0.[0]a)") +
                  link
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
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(ImportsByOrigin);
