import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { continentColorScale } from "helpers/colors";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";

export default translate()(
  class ExportsByDestination extends Section {
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("exports").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", true)
              .drilldown("Destination Country", "Country")
              .drilldown("Date", "Year")
              .measure("FOB US"),
            store.i18n.locale
          );
          return {
            key: "path_exports_by_destination",
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
      const path = this.context.data.path_exports_by_destination;
      const locale = i18n.language.split("-")[0];
      return (
        <div className={className}>
          <h3 className="chart-title">
            {t("Exports by destination of firms based on this location")}
          </h3>
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Continent", "ID Country"],
              label: d =>
                d["Country"] instanceof Array ? d["Continent"] : d["Country"],
              sum: d => d["FOB US"],
              time: "ID Year",
              shapeConfig: {
                fill: d => continentColorScale("c" + d["ID Continent"])
              },
              on: {
                click: d => {
                  if (!(d["ID Country"] instanceof Array)) {
                    var url = slugifyItem(
                      "countries",
                      d["ID Subregion"],
                      d["Subregion"],
                      d["ID Country"] instanceof Array
                        ? false
                        : d["ID Country"],
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
                    numeral(d["FOB US"], locale).format("(USD 0 a)") + link
                  );
                }
              },
              legendConfig: {
                shapeConfig: {
                  width: 40,
                  height: 40,
                  backgroundImage: d =>
                    "/images/legend/continent/" + d["ID Continent"] + ".png"
                }
              }
            }}
            dataFormat={data => data.data}
          />
        </div>
      );
    }
  }
);
