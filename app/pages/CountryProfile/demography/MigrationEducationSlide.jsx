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
        drillDowns: [["Date", "Year"], ["Education", "Education"]],
        options: { parents: true },
        format: "jsonrecords"
      },
      (result, locale) => {
        const zero = { "Number of visas": 0 };
        const data_last = result.data.data.filter(d => d.Year == year_last);
        const total = sumBy(data_last, "Number of visas");
        const year_prev = year_last - 1;
        const data_prev = result.data.data.filter(d => d.Year == year_prev);

        const categories = {
          high: data_last.find(d => d["ID Education"] == 2) || zero,
          technical: data_last.find(d => d["ID Education"] == 4) || zero,
          higher: data_last.find(d => d["ID Education"] == 5) || zero,
          none: data_last.find(d => d["ID Education"] == 6) || zero,
          unknown: data_last.find(d => d["ID Education"] > 6) || zero
        };

        const previous = {
          high: data_prev.find(d => d["ID Education"] == 2) || zero,
          technical: data_prev.find(d => d["ID Education"] == 4) || zero,
          higher: data_prev.find(d => d["ID Education"] == 5) || zero,
          none: data_prev.find(d => d["ID Education"] == 6) || zero,
          unknown: data_prev.find(d => d["ID Education"] > 6) || zero
        };

        const college_prev =
          previous.technical["Number of visas"] +
          previous.higher["Number of visas"];
        const college_last =
          categories.technical["Number of visas"] +
          categories.higher["Number of visas"];
        const growth_college = annualized_growth([college_prev, college_last]);

        return {
          year_last,
          year_prev,
          high: {
            percent: numeral(
              categories.high["Number of visas"] / total,
              locale
            ).format("0.0%")
          },
          college: {
            behavior: growth_college > 0,
            growth: numeral(Math.abs(growth_college), locale).format("0.0%"),
            percent: numeral(college_last / total, locale).format("0.0%")
          },
          percent_noop: numeral(
            categories.none["Number of visas"] / total,
            locale
          ).format("0.0%"),
          percent_unknown: numeral(
            categories.unknown["Number of visas"] / total,
            locale
          ).format("0.0%")
        };
      }
    ),

    simpleCountryDatumNeed(
      "datum_migration_education",
      {
        cube: "immigration",
        measures: ["Number of visas"],
        drillDowns: [["Education", "Education"], ["Sex", "Sex"]],
        cuts: [`[Date].[Date].[Year].&[${year_last}]`],
        options: { parents: false },
        format: "jsonrecords"
      },
      (result, locale) => {
        const zero = { "Number of visas": 0 };
        const educated = [2, 4, 5];
        const data = groupBy(
          result.data.data.filter(
            d => educated.indexOf(d["ID Education"]) > -1
          ),
          "ID Sex"
        );
        return {
          year: year_last,
          female: maxBy(data["1"], "Number of visas") || zero,
          male: maxBy(data["2"], "Number of visas") || zero
        };
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const locale = i18n.language;

    const {
      country,
      slide_migration_education,
      datum_migration_education
    } = this.context.data;

    slide_migration_education.level = country.caption;
    slide_migration_education.college.behavior = slide_migration_education
      .college.behavior
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
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(
                datum_migration_education.female["Number of visas"],
                locale
              ).format("0 a")}
              title={t("Female immigrants with complete schooling")}
              subtitle={t(
                "Number of visas granted in {{year}}",
                datum_migration_education
              )}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(
                datum_migration_education.male["Number of visas"],
                locale
              ).format("0 a")}
              title={t("Male immigrants with complete schooling")}
              subtitle={t(
                "Number of visas granted in {{year}}",
                datum_migration_education
              )}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={slide_migration_education.college.growth}
              title={t("Growth of immigrants with higher education")}
              subtitle={t(
                "In period {{year_prev}} - {{year_last}}",
                slide_migration_education
              )}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MigrationEducationSlide);
