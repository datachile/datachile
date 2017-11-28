import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";
import { Treemap } from "d3plus-react";
import { browserHistory } from "react-router";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { numeral, slugifyItem } from "helpers/formatters";
import { productsColorScale } from "helpers/colors";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";

export default translate()(
  class ExportsByProduct extends Section {
    static need = [
      (params, store) => {
        const country = getLevelObject(params);

        const prm = mondrianClient.cube("exports").then(cube => {
          const q = levelCut(
            country,
            "Destination Country",
            "Country",
            cube.query
              .option("parents", true)
              .drilldown("Export HS", "HS", "HS2")
              .drilldown("Date", "Year")
              .measure("FOB US"),
            "Subregion",
            "Country",
            store.i18n.locale,
            false
          );

          return {
            key: "path_exports_by_product_country",
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
      if (!i18n.language) return null;
      const locale = i18n.language.split("-")[0];
      const path = this.context.data.path_exports_by_product_country;

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>{t("Exports by product")}</span>
            <ExportLink path={path} />
          </h3>
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ID HS0", "ID HS2"],
              label: d => (d["HS2"] instanceof Array ? d["HS0"] : d["HS2"]),
              sum: d => d["FOB US"],
              time: "ID Year",
              legendConfig: {
                label: false,
                shapeConfig: {
                  backgroundImage: d =>
                    "/images/legend/hs/hs_" + d["ID HS0"] + ".png",
                  width: 25,
                  height: 25,
                  fill: d => productsColorScale("hs" + d["ID HS0"])
                }
              },
              shapeConfig: {
                fill: d => productsColorScale("hs" + d["ID HS0"])
              },
              on: {
                click: d => {
                  var url = slugifyItem(
                    "products",
                    d["ID HS0"],
                    d["HS0"],
                    d["ID HS2"] instanceof Array ? false : d["ID HS2"],
                    d["HS2"] instanceof Array ? false : d["HS2"]
                  );
                  browserHistory.push(url);
                }
              },
              tooltipConfig: {
                title: d => (d["HS2"] instanceof Array ? d["HS0"] : d["HS2"]),
                body: d =>
                  numeral(d["FOB US"], locale).format("(USD 0 a)") +
                  "<br/><a>" +
                  t("tooltip.to_profile") +
                  "</a>"
              }
            }}
            dataFormat={data => data.data}
          />
        </div>
      );
    }
  }
);
