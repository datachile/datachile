import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import sumBy from "lodash/sumBy";

import FeaturedDatum from "components/FeaturedDatum";

import mondrianClient, { levelCut } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { calculateYearlyGrowth, getLevelObject } from "helpers/dataUtils";
import { numeral } from "helpers/formatters";

const year_last = sources.immigration.year;

class MigrationEducationSlide extends Section {
  static need = [
    function slideMigrationEducationLevel(params, store) {
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
              .drilldown("Education", "Education")
              .measure("Number of visas"),
            "Continent",
            "Country",
            locale,
            false
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          const data = res.data.data.filter(d => d.Year == year_last);
          const total = sumBy(data, "Number of visas");
          const categories = {
            unknown: data.find(d => d["ID Education"] == 1),
            high: data.find(d => d["ID Education"] == 4),
            college: data.find(
              d => d["ID Education"] == 2 || d["ID Education"] == 6
            ),
            none: data.find(d => d["ID Education"] == 8)
          };
          const previous = {
            high: res.data.data.find(
              d => d.Year == year_last - 1 && d["ID Education"] == 4
            ),
            college: res.data.data.find(
              d =>
                d.Year == year_last - 1 &&
                (d["ID Education"] == 2 || d["ID Education"] == 6)
            )
          };

          return {
            key: "slide_migration_education",
            data: {
              year_last,
              year_prev: year_last - 1,
              high: {
                percent: numeral(
                  categories.high["Number of visas"] / total,
                  locale
                ).format("0.0%"),
                growth: numeral(
                  calculateYearlyGrowth([
                    previous.high["Number of visas"],
                    categories.high["Number of visas"]
                  ]),
                  locale
                ).format("0.0%")
              },
              college: {
                percent: numeral(
                  categories.college["Number of visas"] / total,
                  locale
                ).format("0.0%"),
                growth: numeral(
                  calculateYearlyGrowth([
                    previous.college["Number of visas"],
                    categories.college["Number of visas"]
                  ]),
                  locale
                ).format("0.0%")
              },
              percent_noop: numeral(
                categories.none["Number of visas"] / total,
                locale
              ).format("0.0%"),
              percent_unknown: numeral(
                categories.unknown["Number of visas"] / total,
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

    const { country, slide_migration_education } = this.context.data;

    const txt_slide = t("country_profile.migration_education_slide.text", {
      ...slide_migration_education,
      level: country.caption
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

export default translate()(MigrationEducationSlide);
