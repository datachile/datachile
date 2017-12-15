import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import groupBy from "lodash/groupBy";
import maxBy from "lodash/maxBy";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { getLevelObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

const year_last = sources.immigration.year;

class MigrationActivitySlide extends Section {
  static need = [
    function slideMigrationVisaType(params, store) {
      const locale = store.i18n.locale;
      const country = getLevelObject(params);

      const prm = mondrianClient
        .cube("immigration")
        .then(cube => {
          const q = levelCut(
            country,
            "Origin Country",
            "Country",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Year")
              .drilldown("Visa Type", "Visa Type")
              .measure("Number of visas"),
            "Subregion",
            "Country",
            locale,
            false
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          const data = groupBy(res.data.data, "Year");
          const total = sumBy(data[year_last], "Number of visas");
          const latest_sorted = sortBy(data[year_last], "Number of visas");
          const latest_first = latest_sorted.pop();
          const latest_second = latest_sorted.pop();

          return {
            key: "slide_migration_visa_type",
            data: {
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
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    function slideMigrationActivity(params, store) {
      const locale = store.i18n.locale;
      const country = getLevelObject(params);

      const prm = mondrianClient
        .cube("immigration")
        .then(cube => {
          const q = levelCut(
            country,
            "Origin Country",
            "Country",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Year")
              .drilldown("Activity", "Activity")
              .cut(
                `{[Date].[Date].[Year].&[${year_last -
                  1}],[Date].[Date].[Year].&[${year_last}]}`
              )
              .measure("Number of visas"),
            "Subregion",
            "Country",
            locale,
            false
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          const data = groupBy(res.data.data, "Year");
          const total = sumBy(data[year_last], "Number of visas");
          const max_latest = maxBy(data[year_last], "Number of visas");
          const max_previous = data[year_last - 1].find(
            d => d["ID Activity"] == max_latest["ID Activity"]
          );

          return {
            key: "slide_migration_activity",
            data: {
              first_occupation: {
                name: max_latest["Activity"],
                percent: numeral(
                  max_latest["Number of visas"] / total,
                  locale
                ).format("0.0%"),
                growth: numeral(
                  Math.log(
                    max_latest["Number of visas"] /
                      max_previous["Number of visas"]
                  ),
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
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
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
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MigrationActivitySlide);
