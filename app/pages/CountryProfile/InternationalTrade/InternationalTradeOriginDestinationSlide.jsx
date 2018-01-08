import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import { championsBy } from "helpers/aggregations";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";
import { simpleCountryDatumNeed } from "helpers/MondrianClient";

const last_year = sources.imports.year;
const groupingKey = (a, b, c) => {
  if (!a) return "0";
  if (!b) return "1";
  if (!c) return "11";
  if (a.Region == b.Region) return b.Region == c.Region ? "3" : "21";
  else return b.Region == c.Region ? "12" : "111";
};

class InternationalTradeOriginDestinationSlide extends Section {
  static need = [
    simpleCountryDatumNeed(
      "slide_country_trade_destination",
      {
        cube: "imports",
        measures: ["CIF US"],
        drillDowns: [["Geography", "Comuna"]],
        cuts: [`[Date].[Date].[Year].&[${last_year}]`],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const data = result.data.data;
        const { first, second, third } = championsBy(data, "CIF US");

        return {
          year: last_year,
          grouping: groupingKey(first, second, third),
          first_municipality: first ? first.Comuna : undefined,
          first_region: first ? first.Region : undefined,
          first_percentage: numeral(
            sumBy(data.filter(d => d.Comuna == first.Comuna), "CIF US") /
              sumBy(data, "CIF US"),
            locale
          ).format("0.0%"),
          second_municipality: second ? second.Comuna : undefined,
          second_region: second ? second.Region : undefined,
          third_municipality: third ? third.Comuna : undefined,
          third_region: third ? third.Region : undefined
        };
      }
    ),

    simpleCountryDatumNeed(
      "slide_country_trade_origin",
      {
        cube: "exports",
        measures: ["FOB US"],
        drillDowns: [["Geography", "Comuna"]],
        cuts: [`[Date].[Date].[Year].&[${last_year}]`],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const data = result.data.data;
        const { first, second, third } = championsBy(data, "FOB US");

        return {
          grouping: groupingKey(first, second, third),
          first_municipality: first ? first.Comuna : undefined,
          first_region: first ? first.Region : undefined,
          first_percentage: numeral(
            sumBy(data.filter(d => d.Comuna == first.Comuna), "FOB US") /
              sumBy(data, "FOB US"),
            locale
          ).format("0.0%"),
          second_municipality: second ? second.Comuna : undefined,
          second_region: second ? second.Region : undefined,
          third_municipality: third ? third.Comuna : undefined,
          third_region: third ? third.Region : undefined
        };
      }
    )
  ];

  render() {
    const { children, t } = this.props;

    const {
      country,
      slide_country_trade_destination,
      slide_country_trade_origin
    } = this.context.data;

    const txt_slide =
      t("country_profile.intltrade_origin_dest_slide.import", {
        context: slide_country_trade_destination.grouping,
        level: country.caption,
        year: last_year,
        destination: slide_country_trade_destination
      }) +
      t("country_profile.intltrade_origin_dest_slide.export", {
        context: slide_country_trade_origin.grouping,
        level: country.caption,
        year: last_year,
        origin: slide_country_trade_origin
      });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Origin & Destination")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />

          <div className="topic-slide-data">
            {slide_country_trade_destination.first_municipality && (
              <FeaturedDatum
                className="l-1-2"
                icon="principal-comuna-export-import"
                datum={slide_country_trade_destination.first_municipality}
                title={t("Main importing comuna")}
                subtitle={t("{{percent}} of the country - {{last_year}}", {
                  percent: slide_country_trade_destination.first_percentage,
                  last_year
                })}
              />
            )}
            {slide_country_trade_origin.first_municipality && (
              <FeaturedDatum
                className="l-1-2"
                icon="principal-comuna-export-import"
                datum={slide_country_trade_origin.first_municipality}
                title={t("Main exporting comuna")}
                subtitle={t("{{percent}} of the country - {{last_year}}", {
                  percent: slide_country_trade_origin.first_percentage,
                  last_year
                })}
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(InternationalTradeOriginDestinationSlide);
