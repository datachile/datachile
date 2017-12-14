import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import flattenDeep from "lodash/flattenDeep";

import { sources } from "helpers/consts";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import { calculateYearlyGrowth } from "helpers/dataUtils";
import { info_from_data } from "helpers/aggregations";

import FeaturedDatum from "components/FeaturedDatum";
import { numeral } from "helpers/formatters";

class InternationalTradeSlide extends Section {
  static need = [
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = levelCut(
            product,
            "Export HS",
            "HS",
            cube.query
              .option("parents", false)
              .drilldown("Date", "Date", "Year")
              .measure("FOB US")
              .cut(
                `{[Date].[Date].[Year].&[${sources.exports_and_imports.year -
                  1}],[Date].[Date].[Year].&[${
                  sources.exports_and_imports.year
                }]}`
              ),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q);
        })
        .then(res => {
          return {
            key: "datum_product_export_growth",
            data: flattenDeep(res.data.values)
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient
        .cube("imports")
        .then(cube => {
          var q = levelCut(
            product,
            "Import HS",
            "HS",
            cube.query
              .option("parents", false)
              .drilldown("Date", "Date", "Year")
              .measure("CIF US")
              .cut(
                `{[Date].[Date].[Year].&[${sources.exports_and_imports.year -
                  1}],[Date].[Date].[Year].&[${
                  sources.exports_and_imports.year
                }]}`
              ),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q);
        })
        .then(res => {
          return {
            key: "datum_product_import_growth",
            data: flattenDeep(res.data.values)
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = levelCut(
            product,
            "Export HS",
            "HS",
            cube.query
              .option("parents", true)
              .drilldown("Destination Country", "Country", "Country")
              .measure("FOB US")
              .cut(
                `[Date].[Date].[Year].&[${sources.exports_and_imports.year}]`
              ),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "datum_exports_per_country",
            data: res.data.data
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const product = getLevelObject(params);
      const prm = mondrianClient
        .cube("imports")
        .then(cube => {
          var q = levelCut(
            product,
            "Import HS",
            "HS",
            cube.query
              .option("parents", true)
              .drilldown("Origin Country", "Country", "Country")
              .measure("CIF US")
              .cut(
                `[Date].[Date].[Year].&[${sources.exports_and_imports.year}]`
              ),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "datum_imports_per_country",
            data: res.data.data
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { t, children, i18n } = this.props;
    const locale = i18n.locale;
    
    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("International Trade")}</div>
          </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeSlide);
