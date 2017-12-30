import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { continentColorScale } from "helpers/colors";
import {
  numeral,
  slugifyItem,
  getNumberFromTotalString
} from "helpers/formatters";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";
import NoDataAvailable from "components/NoDataAvailable";

class ImportsByDestination extends Section {
  state = {
    treemap: true
  };
  static need = [
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient.cube("imports").then(cube => {
        var q = levelCut(
          product,
          "Import HS",
          "HS",
          cube.query
            .option("parents", true)
            .drilldown("Origin Country", "Country", "Country")
            .drilldown("Date", "Date", "Year")
            .measure("CIF US"),
          "HS0",
          "HS2",
          store.i18n.language
        );

        return {
          key: "product_imports_by_destination",
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
    const { t, className, i18n } = this.props;
    const path = this.context.data.product_imports_by_destination;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Imports By Origin")}</span>
          <ExportLink path={path} />
        </h3>
        {this.state.treemap ? (
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Continent", "ID Country"],
              label: d =>
                d["Country"] instanceof Array ? d["Continent"] : d["Country"],
              sum: d => d["CIF US"],
              time: "ID Year",
              total: d => d["CIF US"],
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
                    numeral(d["CIF US"], locale).format("(USD 0 a)") + link
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
              }
            }}
            dataFormat={data => {
              if (data.data && data.data.length > 0) {
                return data.data;
              } else {
                this.setState({ treemap: false });
              }
            }}
          />
        ) : (
          <NoDataAvailable />
        )}
        <SourceNote cube="imports" />
      </div>
    );
  }
}

export default translate()(ImportsByDestination);
