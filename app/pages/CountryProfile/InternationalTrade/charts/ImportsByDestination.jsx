import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";
import { browserHistory } from "react-router";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral, slugifyItem } from "helpers/formatters";

import ExportLink from "components/ExportLink";

class ImportsByDestination extends Section {
  static need = [
    (params, store) => {
      const country = getLevelObject(params);
      const prm = mondrianClient.cube("imports").then(cube => {
        const q = levelCut(
          country,
          "Origin Country",
          "Country",
          cube.query
            .option("parents", true)
            .drilldown("Date", "Year")
            .drilldown("Geography", "Comuna")
            .measure("CIF US"),
          "Subregion",
          "Country",
          store.i18n.locale,
          false
        );

        return {
          key: "path_country_imports_by_destination",
          data: store.env.CANON_API + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_country_imports_by_destination;
    const locale = i18n.locale;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Imports By Destination")}</span>
          <ExportLink path={path} />
        </h3>

        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Region", "ID Comuna"],
            label: d => d["Comuna"],
            sum: d => d["CIF US"],
            total: d => d["CIF US"],
            totalConfig: {
              text: d =>
                "Total: US" +
                numeral(d.text.split(": ")[1], locale).format("($ 0,0 a)")
            },
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Region"])
            },
            on: {
              click: d => {
                var url = slugifyItem(
                  "geo",
                  d["ID Region"],
                  d["Region"],
                  d["ID Comuna"] instanceof Array ? false : d["ID Comuna"],
                  d["Comuna"] instanceof Array ? false : d["Comuna"]
                );
                browserHistory.push(url);
              }
            },
            tooltipConfig: {
              title: d => {
                return d["Comuna"] instanceof Array
                  ? d["Region"]
                  : d["Comuna"] + " - " + d["Region"];
              },
              body: d =>
                numeral(d["CIF US"], locale).format("(USD 0 a)") +
                "<br/><a>" +
                t("tooltip.to_profile") +
                "</a>"
            },
            legendConfig: {
              label: false,
              shapeConfig: false
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(ImportsByDestination);
