import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import groupBy from "lodash/groupBy";
import maxBy from "lodash/maxBy";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import { simpleCountryDatumNeed } from "helpers/MondrianClient";
import { annualized_growth } from "helpers/calculator";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

const year_last = sources.immigration.year;

class MigrationDetailsSlide extends Section {
  static need = [
    simpleCountryDatumNeed(
      "slide_migration_sex",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Date", "Year"], ["Sex", "Sex"]],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const data = groupBy(result.data.data, "Year");
        const available_years = Object.keys(data).sort();

        switch (available_years.length) {
          case 0:
            return { year_last, context: "none" };

          case 1: {
            const max_year = available_years.pop();
            const max_last = maxBy(data[max_year], "Number of visas");
            return {
              context: "only",
              year_last: max_last.Year,
              current_max: max_last.Sex
            };
          }

          default: {
            const max_by_year = available_years.map(year =>
              maxBy(data[year], "Number of visas")
            );
            const max_first = max_by_year[0];
            const max_last = max_by_year.pop();

            let max_prev,
              context = "remained";
            while (max_by_year.length > 0) {
              max_prev = max_by_year.pop();

              if (max_prev.Sex != max_last.Sex) {
                context = "changed";
                break;
              }
            }

            const growth = annualized_growth(
              [max_prev["Number of visas"], max_last["Number of visas"]],
              [max_prev.Year, max_last.Year]
            );

            return {
              raw_growth: growth,
              context,
              year_prev: max_prev.Year,
              year_last: max_last.Year,
              current_max: max_last.Sex,
              previous_max: max_prev.Sex,
              growth: numeral(growth, locale).format("0.0%")
            };
          }
        }
      }
    ),

    //TODO: fusionar con el need anterior
    simpleCountryDatumNeed(
      "slide_migration_age",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Date", "Year"], ["Calculated Age Range", "Age Range"]],
        options: { parents: true, sparse: false },
        format: "jsonrecords"
      },
      (result, locale) => {
        const zero = { "Number of visas": 0 };
        const data = groupBy(result.data.data, "Year");
        const available_years = Object.keys(data).sort();

        const output = { context: "none" };

        if (available_years.length == 0) return output;

        // By this point there's at least 1 year available
        output.context = "unique";

        const year_last = available_years.pop();

        const latest_total = sumBy(data[year_last], "Number of visas");
        const latest_sorted = sortBy(data[year_last], "Number of visas");
        const latest_first = latest_sorted.pop();

        output.year_last = year_last;
        output.first = latest_first["Age Range"];
        output.first_percent = numeral(
          latest_first["Number of visas"] / latest_total,
          locale
        ).format("0.0%");

        const latest_second = latest_sorted.pop();
        if (latest_second) {
          output.context = "double";
          output.second = latest_second["Age Range"];
        }

        if (available_years.length == 0) return output;

        // There's still at least another previous year available
        output.context = "full";

        const year_prev = available_years.pop();

        const previous_first =
          data[year_prev].find(
            d => d["Age Range"] == latest_first["Age Range"]
          ) || zero;
        const growth = annualized_growth(
          [previous_first["Number of visas"], latest_first["Number of visas"]],
          [year_prev, year_last]
        );

        if (!isFinite(growth)) {
          output.context = "double";
          return output;
        }

        output.year_prev = year_prev;
        output.first_growth = numeral(growth, locale).format("0.0%");

        return output;
      }
    ),

    simpleCountryDatumNeed(
      "datum_migration_agebysex",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Calculated Age Range", "Age Range"], ["Sex", "Sex"]],
        cuts: [`[Date].[Date].[Year].&[${year_last}]`],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const group = groupBy(result.data.data, "ID Sex");

        const female = maxBy(group["1"], "Number of visas");
        if (female) {
          female.total = sumBy(group["1"], "Number of visas");
          female.percent = numeral(
            female["Number of visas"] / female.total,
            locale
          ).format("0.0%");
        }

        const male = maxBy(group["2"], "Number of visas");
        if (male) {
          male.total = sumBy(group["2"], "Number of visas");
          male.percent = numeral(
            male["Number of visas"] / male.total,
            locale
          ).format("0.0%");
        }

        return { female, male };
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;

    const country = this.context.data.country;
    const migration_sex = this.context.data.slide_migration_sex || {};
    const migration_age = this.context.data.slide_migration_age || {};
    const migration_agebysex = this.context.data.datum_migration_agebysex || {};

    migration_sex.level = country.caption;
    migration_age.level = country.caption;

    const txt_slide =
      t("country_profile.migration_details_slide.sex", migration_sex) +
      t("country_profile.migration_details_slide.age", migration_age);

    const datum_female = migration_agebysex.female;
    const datum_male = migration_agebysex.male;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <p
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            {migration_sex && (
              <FeaturedDatum
                className="l-1-3"
                icon="cambio-numero-visas-sexo"
                datum={migration_sex.growth}
                title={t(
                  "Change number of visas for {{current_max}} immigrants",
                  migration_sex
                )}
                subtitle={t(
                  "in period {{year_prev}} - {{year_last}}",
                  migration_sex
                )}
              />
            )}
            {datum_female && (
              <FeaturedDatum
                className="l-1-3"
                icon="edad-femenino"
                datum={datum_female.percent}
                title={t("Visas for females in range {{range}}", {
                  range: datum_female["Age Range"]
                })}
                subtitle={t("{{number}} visas, granted in {{year}}", {
                  year: year_last,
                  number: datum_female["Number of visas"]
                })}
              />
            )}
            {datum_male && (
              <FeaturedDatum
                className="l-1-3"
                icon="edad-masculino"
                datum={datum_male.percent}
                title={t("Visas for males in range {{range}}", {
                  range: datum_male["Age Range"]
                })}
                subtitle={t("{{number}} visas, granted in {{year}}", {
                  year: year_last,
                  number: datum_male["Number of visas"]
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

export default translate()(MigrationDetailsSlide);
