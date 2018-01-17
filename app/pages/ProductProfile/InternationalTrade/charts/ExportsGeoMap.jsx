import React from "react";
import { Section } from "datawheel-canon";
import CustomMap from "components/CustomMap";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { continentColorScale } from "helpers/colors";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";

class ExportsGeoMap extends Section {
  static need = [];
  render() {
    const { t, className, i18n } = this.props;
    const path = this.context.data.product_exports_by_destination;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Exports By Destination")}</span>
          <ExportLink path={path} />
        </h3>
        <CustomMap
          path={path}
          config={{
            colorScale: "FOB US",
            time: "ID Year",
            total: d => d["FOB US"],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(d.text.split(": ")[1], locale).format("($ 0.00 a)")
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
                return numeral(d["FOB US"], locale).format("(USD 0 a)") + link;
              }
            }
          }}
        />
      </div>
    );
  }
}

export default translate()(ExportsGeoMap);
