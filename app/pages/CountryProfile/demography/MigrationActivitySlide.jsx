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
import { icon_migration_activity, sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

const year_last = sources.immigration.year;

class MigrationActivitySlide extends Section {
  static need = [
    simpleCountryDatumNeed(
      "slide_migration_visa_type",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Date", "Year"], ["Visa Type", "Visa Type"]],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const zero = { "Number of visas": 0 };
        const data = groupBy(result.data.data, "Year");
        const total = sumBy(data[year_last], "Number of visas");

        const latest_sorted = sortBy(data[year_last], "Number of visas");
        const latest_first = latest_sorted.pop() || zero;

        return {
          year_last,
          year_prev: year_last - 1,
          context: latest_first["Number of visas"] ? "1" : "0",
          first: latest_first["Visa Type"],
          first_percent: numeral(
            latest_first["Number of visas"] / total,
            locale
          ).format("0.0%")
        };
      }
    ),

    simpleCountryDatumNeed(
      "slide_migration_activity",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Date", "Year"], ["Activity", "Activity"]],
        cuts: [{ key: "[Date].[Date].[Year]", values: [year_last] }],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const zero = { "Number of visas": 0 };
        const data = [].concat(result.data.data).filter(Boolean);

        const total = sumBy(data, "Number of visas");
        const data_sorted = sortBy(data, "Number of visas");

        const visa_students = data.find(d => d["ID Activity"] == 5) || zero;
        const visa_first = data_sorted.pop() || zero;
        const visa_second = data_sorted.pop() || zero;

        return {
          year_last,
          context: (
            ("Year" in visa_first ? 1 : 0) + ("Year" in visa_second ? 1 : 0)
          ).toString(),
          first: visa_first["Activity"],
          first_icon: icon_migration_activity.get(visa_first["ID Activity"]),
          first_number: numeral(visa_first["Number of visas"], locale).format(
            "(0,0)"
          ),
          first_percent: numeral(
            visa_first["Number of visas"] / total,
            locale
          ).format("0.0%"),
          second: visa_second["Activity"],
          second_percent: numeral(
            visa_second["Number of visas"] / total,
            locale
          ).format("0.0%"),
          students_number: numeral(
            visa_students["Number of visas"],
            locale
          ).format("(0,0)"),
          students_percent: numeral(
            visa_students["Number of visas"] / total,
            locale
          ).format("0.0%")
        };
      }
    )
  ];

  render() {
    const { children, t } = this.props;

    const country = this.context.data.country;
    const activity = this.context.data.slide_migration_activity || {};
    const visa_type = this.context.data.slide_migration_visa_type || {};

    visa_type.level = country.caption;
    activity.level = country.caption;

    const txt_slide =
      t("country_profile.migration_activity_slide.visa_type", visa_type) +
      t("country_profile.migration_activity_slide.activity", activity);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            {activity.students_number > 0 && (
              <FeaturedDatum
                className="l-1-3"
                icon="visas-entregadas-estudiantes"
                datum={activity.students_number}
                title={t("Number of visas granted to students")}
                subtitle={`${activity.students_percent} - ${year_last}`}
              />
            )}
            {activity.first && (
              <FeaturedDatum
                className="l-2-3"
                icon={activity.first_icon}
                datum={activity.first}
                title={t("Most common activity")}
                subtitle={t("{{number}} visas on {{year}}", {
                  number: activity.first_number,
                  year: year_last
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

export default translate()(MigrationActivitySlide);
