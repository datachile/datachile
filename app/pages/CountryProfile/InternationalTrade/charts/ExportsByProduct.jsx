import React from "react";
import { Section } from "@datawheel/canon-core";
import { withNamespaces } from "react-i18next";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import {
  numeral,
  buildPermalink,
  getNumberFromTotalString
} from "helpers/formatters";
import { productsColorScale } from "helpers/colors";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import NoDataAvailable from "components/NoDataAvailable";
import TreemapStacked from "components/TreemapStacked";

class ExportsByProduct extends Section {
  state = {
    chart: true
  };

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
          "Continent",
          "Country",
          store.i18n.locale,
          false
        );

        return {
          key: "path_exports_by_product_country",
          data: __API__ + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { t, className, i18n, router } = this.props;

    const locale = i18n.language;
    const path = this.context.data.path_exports_by_product_country;
    const classSvg = "exports-by-product";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Exports by product")}
            <SourceTooltip cube="exports" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        {this.state.chart ? (
          <TreemapStacked
            depth={true}
            path={path}
            msrName="FOB US"
            drilldowns={["HS0", "HS2"]}
            className={classSvg}
            defaultChart={"stacked"}
            config={{
              label: d => (d["HS2"] instanceof Array ? d["HS0"] : d["HS2"]),
              total: d => d["FOB US"],
              totalConfig: {
                text: d =>
                  "Total: US " +
                  numeral(getNumberFromTotalString(d.text), locale).format(
                    "($0,.[00]a)"
                  ) +
                  " FOB"
              },
              legendConfig: {
                label: false,
                shapeConfig: {
                  label: d => d["HS0"],
                  backgroundImage: d =>
                    "/images/legend/hs/hs_" + d["ID HS0"] + ".png",
                  fill: d => productsColorScale("hs" + d["ID HS0"])
                }
              },
              shapeConfig: {
                fill: d => productsColorScale("hs" + d["ID HS0"])
              },
              on: {
                click: d => {
                  var url = buildPermalink(d, "geo", Array.isArray(d.Comuna));
                  router.push(url);
                }
              },
              tooltipConfig: {
                title: d => (d["HS2"] instanceof Array ? d["HS0"] : d["HS2"]),
                body: d =>
                  numeral(d["FOB US"], locale).format("(USD 0a)") +
                  " FOB<br/><a>" +
                  t("tooltip.view_profile") +
                  "</a>"
              }
            }}
          />
        ) : (
          <NoDataAvailable />
        )}
      </div>
    );
  }
}
export default withNamespaces()(ExportsByProduct);
