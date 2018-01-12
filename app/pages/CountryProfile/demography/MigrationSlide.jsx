import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import groupBy from "lodash/groupBy";
import maxBy from "lodash/maxBy";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import { simpleCountryDatumNeed } from "helpers/MondrianClient";
import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral, buildPermalink } from "helpers/formatters";

const year_last = sources.immigration.year;

class MigrationSlide extends Section {
  static need = [
    simpleCountryDatumNeed("datum_migration_origin_female", {
      cube: "immigration",
      measures: ["Number of visas"],
      drillDowns: [["Date", "Date", "Year"]],
      cuts: [`[Date].[Date].[Year].&[${year_last}]`, `[Sex].[Sex].[Sex].&[1]`],
      options: { parents: false }
    }),

    simpleCountryDatumNeed(
      "slide_migration_destination",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Date", "Year"], ["Geography", "Comuna"]],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const zero = { "Number of visas": 0 };
        const sorted = groupBy(result.data.data, "Year");
        const year = Object.keys(sorted)
          .sort()
          .pop();

        const visas_year_last = [].concat(sorted[year]).filter(Boolean);
        const visas_year_prev = [].concat(sorted[year - 1]).filter(Boolean);

        const max_last = maxBy(visas_year_last, "Number of visas") || zero;

        const sum_last = sumBy(visas_year_last, "Number of visas") || 0;
        const sum_prev = sumBy(visas_year_prev, "Number of visas") || 0;

        const growth = annualized_growth([sum_last, sum_prev]);

        return {
          context: max_last.Region ? (sum_prev > 0 ? "full" : "unique") : "no",
          year_prev: year - 1,
          year_last: year,
          number_visas: sum_last,
          region: max_last.Region,
          comuna: max_last.Comuna,
          links: {
            region: max_last.Region ? buildPermalink(max_last, "geo", 1) : "",
            comuna: max_last.Region ? buildPermalink(max_last, "geo", 2) : ""
          },
          rawgrowth: growth,
          growth: numeral(growth, locale).format("0.0%")
        };
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;

    const { country, datum_migration_origin_female } = this.context.data;
    const slide_migration_destination =
      this.context.data.slide_migration_destination || {};

    slide_migration_destination.level = country.caption;
    slide_migration_destination.behavior =
      slide_migration_destination.rawgrowth > 0
        ? t("increased")
        : t("decreased");

    const txt_slide = t(
      "country_profile.migration_slide.text",
      slide_migration_destination
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          {datum_migration_origin_female &&
            slide_migration_destination && (
              <div className="topic-slide-data">
                <FeaturedDatum
                  className="l-1-3"
                  icon="visas-inmigrantes"
                  datum={numeral(
                    slide_migration_destination.number_visas,
                    locale
                  ).format("(0,0)")}
                  title={t("Immigrant visas")}
                  subtitle={t(
                    "granted in {{year_last}}",
                    slide_migration_destination
                  )}
                />
                <FeaturedDatum
                  className="l-1-3"
                  icon="visas-femeninas"
                  datum={numeral(
                    datum_migration_origin_female /
                      slide_migration_destination.number_visas,
                    locale
                  ).format("(0.0 %)")}
                  title={t("Visas for Female immigrants")}
                  subtitle={t("granted in {{year}}", sources.immigration)}
                />
                {slide_migration_destination.context == "full" && (
                  <FeaturedDatum
                    className="l-1-3"
                    icon="cambio-numero-visas"
                    datum={slide_migration_destination.growth}
                    title={t("Change number of visas")}
                    subtitle={t(
                      "in period {{year_prev}} - {{year_last}}",
                      slide_migration_destination
                    )}
                  />
                )}
              </div>
            )}
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MigrationSlide);
