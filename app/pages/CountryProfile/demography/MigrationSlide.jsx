import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import groupBy from "lodash/groupBy";
import maxBy from "lodash/maxBy";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import mondrianClient, {
  levelCut,
  simpleCountryDatumNeed
} from "helpers/MondrianClient";
import { calculateYearlyGrowth, getLevelObject } from "helpers/dataUtils";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

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

    simpleCountryDatumNeed("datum_migration_origin", {
      cube: "immigration",
      measures: ["Number of visas"],
      drillDowns: [["Date", "Date", "Year"]],
      cuts: [
        { key: "[Date].[Date].[Year]", values: [year_last - 1, year_last] }
      ],
      options: { parents: false }
    }),

    simpleCountryDatumNeed(
      "slide_migration_region_target",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Date", "Year"], ["Geography", "Comuna"]],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const zero = { "Number of visas": 0, Comuna: NaN };
        const sorted = groupBy(result.data.data, "Year");

        const visas_year_last = [].concat(sorted[year_last]).filter(Boolean);
        const visas_year_prev = []
          .concat(sorted[year_last - 1])
          .filter(Boolean);

        const max_last = maxBy(visas_year_last, "Number of visas") || zero;
        const max_prev =
          visas_year_prev.find(d => d.Comuna == max_last.Comuna) || zero;

        const total_country = sumBy(visas_year_last, "Number of visas");
        const total_region = sumBy(
          visas_year_last.filter(d => d.Region == max_last.Region),
          "Number of visas"
        );

        return {
          region: max_last.Region,
          municipality: max_last.Comuna,
          mun_percent: numeral(
            max_last["Number of visas"] / total_country,
            locale
          ).format("0.0%"),
          reg_percent: numeral(
            max_last["Number of visas"] / total_region,
            locale
          ).format("0.0%"),
          mun_growth: numeral(
            calculateYearlyGrowth([
              max_prev["Number of visas"],
              max_last["Number of visas"]
            ]),
            locale
          ).format("0.0%")
        };
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;

    const {
      country,
      datum_migration_origin,
      datum_migration_origin_female,
      slide_migration_region_target
    } = this.context.data;

    const txt_slide = t("country_profile.migration_slide.text", {
      level: country.caption,
      year_last: year_last,
      year_previous: year_last - 1,
      context: slide_migration_region_target.region ? "yes" : "no",
      destination: slide_migration_region_target
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          {datum_migration_origin &&
            datum_migration_origin_female &&
            slide_migration_region_target && (
              <div className="topic-slide-data">
                <FeaturedDatum
                  className="l-1-3"
                  icon="empleo"
                  datum={numeral(datum_migration_origin[1], locale).format(
                    "(0,0)"
                  )}
                  title={t("Immigrant visas")}
                  subtitle={t("granted in {{year}}", sources.immigration)}
                />
                <FeaturedDatum
                  className="l-1-3"
                  icon="empleo"
                  datum={numeral(
                    datum_migration_origin_female / datum_migration_origin[1],
                    locale
                  ).format("(0.0 %)")}
                  title={t("Visas for Female immigrants")}
                  subtitle={t("granted in {{year}}", sources.immigration)}
                />
                <FeaturedDatum
                  className="l-1-3"
                  icon="empleo"
                  datum={numeral(
                    calculateYearlyGrowth(datum_migration_origin),
                    locale
                  ).format("0.0 %")}
                  title={t("Growth number of visas")}
                  subtitle={t("In period {{year_first}} - {{year_last}}", {
                    year_first: year_last - 1,
                    year_last
                  })}
                />
              </div>
            )}
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MigrationSlide);
