import React, { Component } from "react";

import { Network } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

class IndustrySpace extends Section {
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
            .cut(`[Date].[Date].[Year].&[${store.tax_data_year}]`)
            .measure("Output")
            .option("parents", true),
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
    const { t, className } = this.props;
    return (
      <div className={className}>
        <h3 className="chart-title">{t("Industry Space")}</h3>
        <Network
          config={{
            height: 500,
            links: "/json/isic_4_02_links_d3p2.json",
            nodes: "/json/isic_4_02_nodes_d3p2.json",
            data: path,
            size: "Output",
            sizeMin: 1,
            sizeMax: 15,
            zoomScroll: false,
            legend: false
          }}
          dataFormat={data =>
            data.data.map(d => ({
              id: `${d["ID Level 1"]}${d["ID Level 2"]}`,
              ...d
            }))}
        />
      </div>
    );
  }
}

export default translate()(IndustrySpace);
