import React, { Component } from "react";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import ExportLink from "components/ExportLink";

class InnovationRate extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("tax_data").then(cube => {
        var q = geoCut(
          geo,
          "Tax Geography",
          cube.query
            .option("parents", true)
            .drilldown("ISICrev4", "Level 2")
            .drilldown("Date", "Year")
            .measure("Output"),
          store.i18n.locale
        );

        return {
          key: "path_industry_output",
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
    const path = this.context.data.path_industry_output;
    const { t, className, i18n } = this.props;
    const locale = i18n.locale;
    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Innovation Rate")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Level 1", "ID Level 2"],
            label: d =>
              d["Level 2"] instanceof Array ? d["Level 1"] : d["Level 2"],
            sum: d => d["Output"],
            total: d => d["Output"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(d.text.split(": ")[1], locale).format("0,0") +
                t(" immigrants")
            },
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Level 1"])
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(InnovationRate);
