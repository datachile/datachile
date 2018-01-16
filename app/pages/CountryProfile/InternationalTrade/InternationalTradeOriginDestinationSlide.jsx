import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import { championsBy } from "helpers/aggregations";
import { sources } from "helpers/consts";
import { numeral, buildPermalink } from "helpers/formatters";
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
        const zero = {};
        const data = result.data.data;
        let { first, second, third } = championsBy(data, "CIF US");
        const grouping = groupingKey(first, second, third);

        if (!third) third = zero;
        if (!second) second = zero;
        if (!first) first = zero;

        return {
          year: last_year,
          grouping,
          links: {
            imp_1_region: buildPermalink(first, "geo", 1),
            imp_1_comuna: buildPermalink(first, "geo"),
            imp_2_region: buildPermalink(second, "geo", 1),
            imp_2_comuna: buildPermalink(second, "geo"),
            imp_3_region: buildPermalink(third, "geo", 1),
            imp_3_comuna: buildPermalink(third, "geo")
          },
          first_municipality: first.Comuna,
          first_region: first.Region,
          first_percentage: numeral(
            sumBy(data.filter(d => d.Comuna == first.Comuna), "CIF US") /
              sumBy(data, "CIF US"),
            locale
          ).format("0.0%"),
          second_municipality: second.Comuna,
          second_region: second.Region,
          third_municipality: third.Comuna,
          third_region: third.Region
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
        const zero = {};
        const data = result.data.data;
        let { first, second, third } = championsBy(data, "FOB US");
        const grouping = groupingKey(first, second, third);

        if (!third) third = zero;
        if (!second) second = zero;
        if (!first) first = zero;

        return {
          grouping,
          links: {
            exp_1_region: buildPermalink(first, "geo", 1),
            exp_1_comuna: buildPermalink(first, "geo", 2),
            exp_2_region: buildPermalink(second, "geo", 1),
            exp_2_comuna: buildPermalink(second, "geo", 2),
            exp_3_region: buildPermalink(third, "geo", 1),
            exp_3_comuna: buildPermalink(third, "geo", 2)
          },
          first_municipality: first.Comuna,
          first_region: first.Region,
          first_percentage: numeral(
            sumBy(data.filter(d => d.Comuna == first.Comuna), "FOB US") /
              sumBy(data, "FOB US"),
            locale
          ).format("0.0%"),
          second_municipality: second.Comuna,
          second_region: second.Region,
          third_municipality: third.Comuna,
          third_region: third.Region
        };
      }
    )
  ];

  render() {
    const { children, t } = this.props;

    const country = this.context.data.country;
    const trade_destination =
      this.context.data.slide_country_trade_destination || {};
    const trade_origin = this.context.data.slide_country_trade_origin || {};

    const txt_slide =
      t("country_profile.intltrade_origin_dest_slide.import", {
        context: trade_destination.grouping,
        level: country.caption,
        year: last_year,
        links: trade_destination.links,
        destination: trade_destination
      }) +
      t("country_profile.intltrade_origin_dest_slide.export", {
        context: trade_origin.grouping,
        level: country.caption,
        year: last_year,
        links: trade_origin.links,
        origin: trade_origin
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
            {trade_destination.first_municipality && (
              <FeaturedDatum
                className="l-1-2"
                icon="principal-comuna-export-import"
                datum={trade_destination.first_municipality}
                title={t("Main importing comuna")}
                subtitle={t("{{percent}} of the country - {{last_year}}", {
                  percent: trade_destination.first_percentage,
                  last_year
                })}
              />
            )}
            {trade_origin.first_municipality && (
              <FeaturedDatum
                className="l-1-2"
                icon="principal-comuna-export-import"
                datum={trade_origin.first_municipality}
                title={t("Main exporting comuna")}
                subtitle={t("{{percent}} of the country - {{last_year}}", {
                  percent: trade_origin.first_percentage,
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
