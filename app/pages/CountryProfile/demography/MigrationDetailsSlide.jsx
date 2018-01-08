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
        const zero = { "Number of visas": 0 };
        const data = groupBy(result.data.data, "Year");

        const max_year = Object.keys(data)
          .sort()
          .pop();

        if (!max_year) return { year_last, context: "none" };

        const max_by_year = Object.keys(data)
          .sort()
          .map(year => maxBy(data[year], "Number of visas"));

        const max_first = max_by_year[0] || zero;
        const max_last = max_by_year.pop() || zero;

        let compared, changed;
        while ((changed = max_by_year.pop())) {
          if (!changed) {
            changed = compared;
            break;
          } else if (changed["Sex"] != max_last["Sex"]) {
            break;
          } else {
            compared = changed;
          }
        }

        if (!compared && !changed)
          return {
            context: "only",
            year_last: max_last.Year,
            current_max: max_last.Sex
          };
        else changed = compared;

        const growth = annualized_growth(
          [changed["Number of visas"], max_last["Number of visas"]],
          [changed.Year, max_last.Year]
        );

        return {
          year_prev: changed.Year,
          year_last: max_last.Year,
          context: changed.Sex != max_last.Sex ? "changed" : "remained",
          current_max: max_last.Sex,
          previous_max: changed.Sex,
          growth: numeral(growth, locale).format("0.0%")
        };
      }
    ),

    //TODO: fusionar con el need anterior
    simpleCountryDatumNeed(
      "slide_migration_age",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Date", "Year"], ["Calculated Age Range", "Age Range"]],
        cuts: [
          { key: "[Date].[Date].[Year]", values: [year_last - 1, year_last] }
        ],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const zero = { "Number of visas": 0 };
        const data = groupBy(result.data.data, "Year");

        const year = Object.keys(data)
          .sort()
          .pop();

        const output = { context: "none" };

        if (!year) return output;

        const latest_total = sumBy(data[year], "Number of visas");
        const latest_sorted = sortBy(data[year], "Number of visas");

        const latest_first = latest_sorted.pop() || zero;
        const latest_second = latest_sorted.pop() || zero;

        output.year_prev = year - 1;
        output.year_last = year;
        output.context = "unique";
        output.first = latest_first["Age Range"];
        output.first_percent = numeral(
          latest_first["Number of visas"] / latest_total,
          locale
        ).format("0.0%");

        const previous_first = []
          .concat(data[year - 1])
          .filter(Boolean)
          .find(d => d["Age Range"] == latest_first["Age Range"]);

        if (previous_first) {
          output.context = "full";
          output.second = latest_second["Age Range"];
          output.first_growth = numeral(
            annualized_growth([
              previous_first["Number of visas"],
              latest_first["Number of visas"]
            ]),
            locale
          ).format("0.0%");
        }

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

    const {
      country,
      slide_migration_sex,
      slide_migration_age
    } = this.context.data;

    slide_migration_sex.level = country.caption;
    slide_migration_age.level = country.caption;

    const txt_slide =
      t("country_profile.migration_details_slide.sex", slide_migration_sex) +
      t("country_profile.migration_details_slide.age", slide_migration_age);

    const datum_female = this.context.data.datum_migration_agebysex.female;
    const datum_male = this.context.data.datum_migration_agebysex.male;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            {slide_migration_sex.growth && (
              <FeaturedDatum
                className="l-1-3"
                icon="cambio-numero-visas-sexo"
                datum={slide_migration_sex.growth}
                title={t(
                  "Change number of visas for {{current_max}} immigrants",
                  slide_migration_sex
                )}
                subtitle={t(
                  "in period {{year_prev}} - {{year_last}}",
                  slide_migration_sex
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
