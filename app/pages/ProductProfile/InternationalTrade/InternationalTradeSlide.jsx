import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import flattenDeep from "lodash/flattenDeep";

import { sources } from "helpers/consts";
import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { getLevelObject } from "helpers/dataUtils";

import { calculateYearlyGrowth } from "helpers/dataUtils";

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
            key: "datum_exports_per_year",
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
            key: "datum_imports_per_year",
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
              ,
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q);
        })
        .then(res => {
          return {
            key: "datum_exports_per_country",
            data: res.data
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
              .drilldown("Destination Country", "Country", "Country")
              .measure("CIF US"),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          return mondrianClient.query(q);
        })
        .then(res => {
          console.log(res.data);
          return {
            key: "datum_imports_per_country",
            data: res.data
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
    const {
      datum_imports_per_year,
      datum_exports_per_year,
      datum_exports_per_country,
      datum_imports_per_country
    } = this.context.data;
    const locale = i18n.locale;
    const text_product = { last_year: 2015, product: this.context.data };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("International Trade")}</div>
          <div className="topic-slide-text">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("trade_product_profile.text", text_product)
                }}
              />
            </p>
          </div>

          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(
                calculateYearlyGrowth(datum_exports_per_year),
                locale
              ).format("0.0 %")}
              title={t("Growth Exports")}
              subtitle={
                t("In period") +
                " " +
                (sources.exports_and_imports.year - 1) +
                "-" +
                sources.exports_and_imports.year
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(
                calculateYearlyGrowth(datum_imports_per_year),
                locale
              ).format("0.0 %")}
              title={t("Growth Imports")}
              subtitle={
                t("In period") +
                " " +
                (sources.exports_and_imports.year - 1) +
                "-" +
                sources.exports_and_imports.year
              }
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={"4343k"}
              title={t("Trade volume")}
              subtitle="XXXX - YYYY"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeSlide);
