import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import groupBy from "lodash/groupBy";
import maxBy from "lodash/maxBy";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import { simpleCountryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { annualized_growth } from "helpers/calculator";
import { numeral } from "helpers/formatters";

const year_last = sources.immigration.year;

class MigrationEducationSlide extends Section {
  static need = [
    simpleCountryDatumNeed(
      "slide_migration_education",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [
          ["Date", "Year"],
          ["Sex", "Sex"],
          ["Education", "Education"]
        ],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const zero = { "Number of visas": 0 };

        const total = sumBy(result.data.data, "Number of visas");
        const group_year = groupBy(result.data.data, "Year");
        const lastyr = parseInt(
          Object.keys(group_year)
            .sort()
            .pop()
        );

        const group_lastyr = [].concat(group_year[lastyr]);
        const check_edu_level = n => n == 2 || n == 4 || n == 5;
        const lastyr_sex_female = group_lastyr.reduce(function(sum, d) {
          if (d && d["ID Sex"] == 1 && check_edu_level(d["ID Education"]))
            sum += d["Number of visas"] || 0;
          return sum;
        }, 0);
        const lastyr_sex_male = group_lastyr.reduce(function(sum, d) {
          if (d && d["ID Sex"] == 2 && check_edu_level(d["ID Education"]))
            sum += d["Number of visas"] || 0;
          return sum;
        }, 0);

        const prevyr_group_edu = groupBy(
          group_year[lastyr - 1],
          "ID Education"
        );
        const lastyr_group_edu = groupBy(group_lastyr, "ID Education");

        const prevyr_edu_techni = sumBy(prevyr_group_edu[4], "Number of visas");
        const prevyr_edu_higher = sumBy(prevyr_group_edu[5], "Number of visas");

        const lastyr_edu_highsc = sumBy(lastyr_group_edu[2], "Number of visas");
        const lastyr_edu_techni = sumBy(lastyr_group_edu[4], "Number of visas");
        const lastyr_edu_higher = sumBy(lastyr_group_edu[5], "Number of visas");
        const lastyr_edu_none = sumBy(lastyr_group_edu[6], "Number of visas");
        const lastyr_edu_unknown =
          sumBy(lastyr_group_edu[7], "Number of visas") +
          sumBy(lastyr_group_edu[8], "Number of visas");

        const prevyr_sum_college = prevyr_edu_techni + prevyr_edu_higher;
        const lastyr_sum_college = lastyr_edu_techni + lastyr_edu_higher;
        const higher_growth = annualized_growth([
          prevyr_sum_college,
          lastyr_sum_college
        ]);

        return {
          context: isNaN(lastyr) ? "none" : "",
          year_last: lastyr,
          year_prev: lastyr - 1,
          datum_male: lastyr_sex_male,
          datum_female: lastyr_sex_female,
          highsc_percent: numeral(lastyr_edu_highsc / total, locale).format(
            "0.0%"
          ),
          higher_rawgrowth: higher_growth || 0,
          higher_upgrowth: higher_growth > 0,
          higher_growth: numeral(Math.abs(higher_growth), locale).format(
            "0.0%"
          ),
          higher_percent: numeral(lastyr_sum_college / total, locale).format(
            "0.0%"
          ),
          none_percent: numeral(lastyr_edu_none / total, locale).format("0.0%"),
          unknown_percent: numeral(lastyr_edu_unknown / total, locale).format(
            "0.0%"
          )
        };
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;

    const country = this.context.data.country;
    const slide_migration_education =
      this.context.data.slide_migration_education || {};

    slide_migration_education.level = country.caption;
    slide_migration_education.higher_behavior = slide_migration_education.higher_upgrowth
      ? t("incremented")
      : t("decremented");

    const txt_slide = t(
      "country_profile.migration_education_slide.text",
      slide_migration_education
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            {slide_migration_education.datum_female > 0 && (
              <FeaturedDatum
                className="l-1-3"
                icon="inmigrantes-femenino-escolaridad-completa"
                datum={numeral(
                  slide_migration_education.datum_female,
                  locale
                ).format("0 a")}
                title={t("Female immigrants with complete schooling")}
                subtitle={t(
                  "Number of visas granted in {{year_last}}",
                  slide_migration_education
                )}
              />
            )}
            {slide_migration_education.datum_male > 0 && (
              <FeaturedDatum
                className="l-1-3"
                icon="inmigrantes-masculina-escolaridad-completa"
                datum={numeral(
                  slide_migration_education.datum_male,
                  locale
                ).format("0 a")}
                title={t("Male immigrants with complete schooling")}
                subtitle={t(
                  "Number of visas granted in {{year_last}}",
                  slide_migration_education
                )}
              />
            )}
            {slide_migration_education.higher_rawgrowth != 0 && (
              <FeaturedDatum
                className="l-1-3"
                icon="crecimiento-migrantes-educ-superior"
                datum={slide_migration_education.higher_growth}
                title={t("Growth of immigrants with higher education")}
                subtitle={t(
                  "in period {{year_prev}} - {{year_last}}",
                  slide_migration_education
                )}
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MigrationEducationSlide);
