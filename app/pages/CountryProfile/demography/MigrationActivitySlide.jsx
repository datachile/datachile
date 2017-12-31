import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import groupBy from "lodash/groupBy";
import maxBy from "lodash/maxBy";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import mondrianClient, { simpleCountryDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { calculateYearlyGrowth } from "helpers/dataUtils";
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
        const data = groupBy(result.data.data, "Year");

        const total = sumBy(data[year_last], "Number of visas");
        const latest_sorted = sortBy(data[year_last], "Number of visas");
        const latest_first = latest_sorted.pop() || {};
        const latest_second = latest_sorted.pop() || {};

        return {
          visa_type: {
            first: latest_first["Visa Type"],
            second: latest_second["Visa Type"],
            percent: numeral(
              (latest_first["Number of visas"] +
                latest_second["Number of visas"]) /
                total,
              locale
            ).format("0.0%")
          }
        };
      }
    ),

    simpleCountryDatumNeed(
      "slide_migration_activity",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Date", "Year"], ["Activity", "Activity"]],
        cuts: [
          {
            key: "[Date].[Date].[Year]",
            values: [year_last - 1, year_last]
          }
        ],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const data = groupBy(result.data.data, "Year");
        const total = sumBy(data[year_last], "Number of visas");
        const max_latest = maxBy(data[year_last], "Number of visas");
        const max_previous = data[year_last - 1].find(
          d => d["ID Activity"] == max_latest["ID Activity"]
        );

        const last_year_students = data[year_last].find(
          d => d["ID Activity"] == 2
        );

        return {
          datum_students: numeral(
            last_year_students["Number of visas"],
            locale
          ).format("(0,0)"),
          first_occupation: {
            year: year_last,
            name: max_latest["Activity"],
            number: numeral(max_latest["Number of visas"], locale).format(
              "(0,0)"
            ),
            percent: numeral(
              max_latest["Number of visas"] / total,
              locale
            ).format("0.0%"),
            growth: numeral(
              calculateYearlyGrowth([
                max_previous["Number of visas"],
                max_latest["Number of visas"]
              ]),
              locale
            ).format("0.0%")
          },
          unoccupied_percent: numeral(
            data[year_last].find(d => d["ID Activity"] == 4)[
              "Number of visas"
            ] / total,
            locale
          ).format("0.0%"),
          unknown_percent: numeral(
            data[year_last].find(d => d["ID Activity"] == 6)[
              "Number of visas"
            ] / total,
            locale
          ).format("0.0%")
        };
      }
    )
  ];

  render() {
    const { children, t } = this.props;

    const {
      country,
      slide_migration_activity,
      slide_migration_visa_type
    } = this.context.data;

    const txt_slide = t("country_profile.migration_activity_slide.text", {
      ...slide_migration_activity,
      ...slide_migration_visa_type,
      level: country.caption,
      year_last,
      year_prev: year_last - 1
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={slide_migration_activity.datum_students}
              title={t("Number of visas granted to students")}
              subtitle={t("in ") + year_last}
            />
            <FeaturedDatum
              className="l-2-3"
              icon="empleo"
              datum={slide_migration_activity.first_occupation.name}
              title={t("Most common activity")}
              subtitle={t(
                "{{number}} people on {{year}}",
                slide_migration_activity.first_occupation
              )}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MigrationActivitySlide);
