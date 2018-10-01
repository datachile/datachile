import React from "react";
import { Section } from "datawheel-canon";
import { translate } from "react-i18next";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";
import { regionsColorScale } from "helpers/colors";
import {
  numeral,
  buildPermalink,
  getNumberFromTotalString
} from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";
import NoDataAvailable from "components/NoDataAvailable";
import TreemapStacked from "components/TreemapStacked";

class ExportsByOrigin extends Section {
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
            .drilldown("Date", "Year")
            .drilldown("Geography", "Comuna")
            .measure("FOB US"),
          "Continent",
          "Country",
          store.i18n.locale,
          false
        );

        return {
          key: "path_country_exports_by_origin",
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

    const path = this.context.data.path_country_exports_by_origin;
    const locale = i18n.language;
    const classSvg = "exports-by-origin";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Exports By Origin")}
            <SourceTooltip cube="exports" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        {this.state.chart ? (
          <TreemapStacked
            depth={true}
            path={path}
            msrName="FOB US"
            drilldowns={["Region", "Comuna"]}
            className={classSvg}
            config={{
              total: d => d["FOB US"],
              totalConfig: {
                text: d =>
                  "Total: US " +
                  numeral(getNumberFromTotalString(d.text), locale).format(
                    "($0.[00]a)"
                  ) +
                  " FOB"
              },
              shapeConfig: {
                fill: d => regionsColorScale(d["ID Region"])
              },
              on: {
                click: d => {
                  var url = buildPermalink(d, "geo", Array.isArray(d.Comuna));
                  router.push(url);
                }
              },
              legendTooltip: {
                title: d => d["Region"]
              },
              tooltipConfig: {
                title: d => d["Comuna"],
                body: d =>
                  numeral(d["FOB US"], locale).format("(USD 0a)") +
                  " FOB<br/><a>" +
                  t("tooltip.to_profile") +
                  "</a>"
              },
              legendConfig: {
                label: false,
                shapeConfig: {
                  backgroundImage: d =>
                    "/images/legend/region/" + d["ID Region"] + ".png"
                }
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
export default translate()(ExportsByOrigin);
