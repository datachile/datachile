import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";
import { browserHistory } from "react-router";

import { regionsColorScale } from "helpers/colors";
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

class OutputByLocation extends Section {
  state = {
    treemap: true
  };

  static need = [
    (params, store) => {
      var industry = getLevelObject(params);
      const prm = mondrianClient.cube("tax_data").then(cube => {
        var q = levelCut(
          industry,
          "ISICrev4",
          "ISICrev4",
          cube.query
            .option("parents", true)
            .drilldown("Tax Geography", "Geography", "Comuna")
            .drilldown("Date", "Date", "Year")
            .measure("Output"),
          "Level 1",
          "Level 2",
          store.i18n.locale
        );

        return {
          key: "industry_output_by_region",
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
    const path = this.context.data.industry_output_by_region;
    const industry = this.context.data.industry;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Output By Comuna (Legal address)")}
            {industry &&
              industry.parent && (
                <span>
                  :{" "}
                  {industry.parent ? industry.parent.caption : industry.caption}
                </span>
              )}
          </span>
          <ExportLink path={path} />
        </h3>
        {this.state.treemap ? (
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Region", "ID Comuna"],
              label: d =>
                d["Comuna"] instanceof Array ? d["Region"] : d["Comuna"],
              sum: d => d["Output"],
              time: "ID Year",
              total: d => d["Output"],
              totalConfig: {
                text: d =>
                  "Total: CLP" +
                  numeral(getNumberFromTotalString(d.text), locale).format(
                    "($ 0.[00] a)"
                  )
              },
              shapeConfig: {
                fill: d => regionsColorScale("r" + d["ID Region"])
              },
              on: {
                click: d => {
                  if (!(d["ID Comuna"] instanceof Array)) {
                    var url = slugifyItem(
                      "geo",
                      d["ID Region"],
                      d["Region"],
                      d["ID Comuna"] instanceof Array ? false : d["ID Comuna"],
                      d["Comuna"] instanceof Array ? false : d["Comuna"]
                    );
                    browserHistory.push(url);
                  }
                }
              },
              tooltipConfig: {
                title: d => {
                  return d["Comuna"] instanceof Array
                    ? d["Region"]
                    : d["Comuna"];
                },
                body: d => {
                  const link =
                    d["ID Comuna"] instanceof Array
                      ? ""
                      : "<br/><a>" + t("tooltip.to_profile") + "</a>";
                  return (
                    numeral(d["Output"], locale).format("(USD 0 a)") + link
                  );
                }
              },
              legendConfig: {
                shapeConfig: {
                  width: 20,
                  height: 20
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
        <SourceNote cube="tax_data" />
      </div>
    );
  }
}

export default translate()(OutputByLocation);
