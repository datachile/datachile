import React, { Component } from "react";

import { Network } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { numeral } from "helpers/formatters";

class ProductSpace extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const cube = mondrianClient.cube("exports");
      const prm = cube.then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .drilldown("Date", "Year")
            .drilldown("Export HS", "HS4")
            .measure("FOB US")
            .cut(`[Date].[Date].[Year].&[${store.exports_year}]`)
            .option("parents", true),
          store.i18n.locale
        );

        return {
          key: "path_exports_last_year",
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
    const path = this.context.data.path_exports_last_year;
    const { t, className, i18n } = this.props;
    const locale = i18n.language.split("-")[0];
    return (
      <div className={className}>
        <h3 className="chart-title">{t("Product Space")}</h3>
        <Network
          config={{
            height: 500,
            links: "/json/hs92_4_links_circular_spring_d3p2.json",
            nodes: "/json/hs92_4_nodes_circular_spring_d3p2.json",
            data: path,
            size: "FOB US",
            sizeMin: 1,
            sizeMax: 15,
            zoomScroll: false,
            tooltipConfig: {
              title: d => {
                console.log(d);
                return d["HS4"];
              },
              body: d => numeral(d["FOB US"], locale).format("(USD 0 a)")
            },
            legend: false
          }}
          dataFormat={data => data.data.map(d => ({ id: d["ID HS4"], ...d }))}
        />
      </div>
    );
  }
}

export default translate()(ProductSpace);
