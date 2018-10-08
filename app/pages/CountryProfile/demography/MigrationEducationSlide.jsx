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

class GroupContainer {
  get(k) {
    return this[k] || 0;
  }
  add(k, v) {
    this[k] = this.get(k) + (v || 0);
  }
}

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
        options: { parents: true, sparse: false },
        format: "jsonrecords"
      },
      (result, locale) => {
        const groups = groupBy(result.data.data, "Year");
        const available_years = Object.keys(groups).sort();

        if (available_years.length == 0) return { context: "none" };

        const education_labels = [
          "unavailable",
          "primary",
          "highschool",
          "someprimary",
          "technical",
          "higher",
          "none",
          "none"
        ];
        const grouper = function(obj, d) {
          const id_edu = d["ID Education"];
          const label_edu = education_labels[id_edu];
          const label_sex = `total_${d["ID Sex"] == 1 ? "female" : "male"}`;

          obj.add("total", d["Number of visas"]);
          obj.add(label_edu, d["Number of visas"]);
          if (id_edu == 2 || id_edu == 4 || id_edu == 5) {
            obj.add(label_sex, d["Number of visas"]);
          }
          return obj;
        };

        const year_last = parseInt(available_years.pop());
        const year_prev = parseInt(available_years.pop());

        const data_lastyr = [].concat(groups[year_last]).filter(Boolean);
        const data_prevyr = [].concat(groups[year_prev]).filter(Boolean);

        const sums_lastyr = data_lastyr.reduce(grouper, new GroupContainer());
        const sums_prevyr = data_prevyr.reduce(grouper, new GroupContainer());

        const lastyr_sum_college =
          sums_lastyr.get("higher") + sums_lastyr.get("technical");
        const prevyr_sum_college =
          sums_prevyr.get("higher") + sums_prevyr.get("technical");

        const college_growth = annualized_growth(
          [prevyr_sum_college, lastyr_sum_college],
          [year_prev, year_last]
        );
        const useable_growth =
          isFinite(college_growth) && !isNaN(college_growth)
            ? college_growth
            : null;

        const total = sums_lastyr.get("total");

        return {
          context: useable_growth ? "limited" : "",
          raw_data: data_lastyr,
          year_last,
          year_prev,
          datum_male: sums_lastyr.get("total_male"),
          datum_female: sums_lastyr.get("total_female"),
          highsc_percent: numeral(
            sums_lastyr.get("highschool") / total,
            locale
          ).format("0.0%"),
          higher_rawgrowth: useable_growth,
          higher_growth: numeral(Math.abs(useable_growth), locale).format(
            "0.0%"
          ),
          higher_percent: numeral(lastyr_sum_college / total, locale).format(
            "0.0%"
          ),
          none_percent: numeral(sums_lastyr.get("none") / total, locale).format(
            "0.0%"
          ),
          unknown_percent: numeral(
            sums_lastyr.get("unavailable") / total,
            locale
          ).format("0.0%")
        };
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;

    const country = this.context.data.country;
    const education = this.context.data.slide_migration_education || {};

    education.level = country.caption;
    education.higher_behavior =
      education.higher_rawgrowth > 0 ? t("incremented") : t("decremented");

    const txt_slide = t(
      "country_profile.migration_education_slide.text",
      education
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("Migration")}</h3>
          <p
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              showIf={education.datum_female > 0}
              className="l-1-3"
              icon="inmigrantes-femenino-escolaridad-completa"
              datum={numeral(education.datum_female, locale).format("0 a")}
              title={t("Female immigrants with complete schooling")}
              subtitle={t(
                "Number of visas granted in {{year_last}}",
                education
              )}
            />
            <FeaturedDatum
              showIf={education.datum_male > 0}
              className="l-1-3"
              icon="inmigrantes-masculina-escolaridad-completa"
              datum={numeral(education.datum_male, locale).format("0 a")}
              title={t("Male immigrants with complete schooling")}
              subtitle={t(
                "Number of visas granted in {{year_last}}",
                education
              )}
            />
            <FeaturedDatum
              showIf={education.higher_rawgrowth > 0}
              className="l-1-3"
              icon="crecimiento-migrantes-educ-superior"
              datum={numeral(education.higher_rawgrowth, locale).format("0.0%")}
              title={t(
                "Change of immigrants with universitary or technical education"
              )}
              subtitle={t("in period {{year_prev}} - {{year_last}}", education)}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MigrationEducationSlide);
