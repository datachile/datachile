import React from "react";
import { Section } from "datawheel-canon";
import CustomMap from "components/CustomMap";
import { translate } from "react-i18next";
import { sources } from "helpers/consts";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class ExportsGeoMap extends Section {
  static need = [
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient.cube("exports").then(cube => {
        var q = levelCut(
          product,
          "Export HS",
          "HS",
          cube.query
            .option("parents", true)
            .drilldown("Destination Country", "Country", "Country")
            .drilldown("Date", "Date", "Year")
            .measure("FOB US")
            .cut(`[Date].[Year].&[${sources.exports.year}]`)
            .property("Destination Country", "Country", "iso3"),
          "HS0",
          "HS2",
          store.i18n.locale
        );

        return {
          key: "product_exports_by_destination_last_year",
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
    const path = this.context.data.product_exports_by_destination_last_year;

    const locale = i18n.language;
    const classSvg = "exports";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Exports By Destination") +
              " " +
              t("in") +
              " " +
              sources.exports.year}
            <SourceTooltip cube="imports" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <CustomMap
          path={path}
          msrName={"FOB US"}
          className={"exports"}
          router={router}
        />
      </div>
    );
  }
}

export default translate()(ExportsGeoMap);
