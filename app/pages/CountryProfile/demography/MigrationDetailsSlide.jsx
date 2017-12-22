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
import { calculateYearlyGrowth, getLevelObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

const year_last = sources.immigration.year;

class MigrationDetailsSlide extends Section {
  static need = [
    function slideMigrationSex(params, store) {
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
              .drilldown("Sex", "Sex")
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
          const max_by_year = Object.keys(data).map(year =>
            maxBy(data[year], "Number of visas")
          );

          const max_first = max_by_year[0];
          const max_last = max_by_year.pop();
          let compared, changed;
          while ((compared = max_by_year.pop())) {
            if (compared["Sex"] != max_last["Sex"]) {
              changed = compared;
              break;
            }
          }

          return {
            key: "slide_migration_sex",
            data: {
              context: changed ? "change" : "stay",
              year_latest: year_last,
              year_previous: year_last - 1,
              year_first: changed ? changed["Year"] : null,
              sex: {
                current: max_last["Sex"],
                growth: numeral(
                  Math.log(
                    max_last["Number of visas"] / max_first["Number of visas"]
                  ),
                  locale
                ).format("0.0%"),
                before: changed ? changed["Sex"] : null
              }
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    function slideMigrationAge(params, store) {
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
              .drilldown("Calculated Age Range", "Age Range")
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
          const latest_sorted = sortBy(data[year_last], "Number of visas");
          const latest_first = latest_sorted.pop();
          const latest_second = latest_sorted.pop();
          const previous_first = data[year_last - 1].find(
            d => d["Age Range"] == latest_first["Age Range"]
          );

          return {
            key: "slide_migration_age",
            data: {
              agerange: {
                first: latest_first["Age Range"],
                first_percent: numeral(
                  latest_first["Number of visas"] / total,
                  locale
                ).format("0.0%"),
                first_growth: numeral(
                  calculateYearlyGrowth([
                    previous_first["Number of visas"],
                    latest_first["Number of visas"]
                  ]),
                  locale
                ).format("0.0%"),
                second: latest_second["Age Range"]
              }
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
      slide_migration_sex,
      slide_migration_age
    } = this.context.data;

    const txt_slide = t("country_profile.migration_details_slide.text", {
      context: "change",
      level: country.caption,
      year_latest: "year_latest".toUpperCase(),
      year_previous: "year_previous".toUpperCase(),
      year_first: "year_first".toUpperCase(),
      ...slide_migration_sex,
      ...slide_migration_age
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

export default translate()(MigrationDetailsSlide);
