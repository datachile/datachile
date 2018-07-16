import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import { getGeoObject } from "helpers/dataUtils";
import { annualized_growth } from "helpers/calculator";

import mondrianClient, { simpleGeoDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";

class PopulationSlide extends Section {
  static need = [
    simpleGeoDatumNeed(
      "datum_population_growth",
      "population_estimate",
      ["Population"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [
          `{[Date].[Date].[Year].&[${
            sources.population_estimate.first_year
          }],[Date].[Date].[Year].&[${sources.population_estimate.last_year}]}`
        ]
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;

    const locale = i18n.language;

    const { geo, population, datum_population_growth } = this.context.data;

    const data_slide = {
      year: sources.population_estimate.year,
      area: geo.caption,
      total: population
        ? numeral(population.value, locale).format("(0,0)")
        : "",
      year_max: sources.population_estimate.last_year,
      projected: datum_population_growth
        ? numeral(datum_population_growth[1], locale).format("+0,0")
        : ""
    };

    const txt_slide = t(
      "geo_profile.demographics.population_by_sex_age",
      data_slide
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Population")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-2"
              icon="poblacion-estimada"
              datum={numeral(
                annualized_growth(datum_population_growth, [2005, 2020]),
                locale
              ).format("0.0 %")}
              title={t("Estimate Population Growth")}
              subtitle={
                sources.population_estimate.first_year +
                "-" +
                sources.population_estimate.last_year
              }
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(PopulationSlide);
