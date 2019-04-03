import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import { getGeoObject } from "helpers/dataUtils";
import { annualized_growth } from "helpers/calculator";

import mondrianClient, { simpleGeoDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";
import Axios from "axios";

class PopulationSlide extends Section {
  constructor(props) {
    super(props);
    this.state = {
      female: undefined,
      male: undefined,
      total: undefined
    };
  }
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

  componentDidMount() {
    const { geo } = this.context.data;
    const geoType =
      geo.type.substring(0, 1).toUpperCase() + geo.type.substring(1);

    let path = `/api/data?measures=People&drilldowns=Sex&parents=true`;

    if (geo.depth > 0) path += `&${geoType}=${geo.key}`;

    Axios.get(path).then(resp => {
      const data = resp.data.data;
      const female = data.find(d => d["ID Sex"] === 1) || {};
      const male = data.find(d => d["ID Sex"] === 2) || {};
      const total = female["People"] + male["People"];
      this.setState({ female: female["People"], male: male["People"], total });
    });
  }

  render() {
    const { children, t, i18n } = this.props;

    const locale = i18n.language;

    const { geo, datum_population_growth } = this.context.data;

    const { male, female, total } = this.state;
    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Population")}
          </h3>
          <p>
            {t("population_census", {
              name: geo.caption,
              total: numeral(total, locale).format("0,0"),
              female: numeral(female, locale).format("0,0"),
              male: numeral(male, locale).format("0,0")
            })}
          </p>
          <div className="topic-slide-data">
            {male && (
              <FeaturedDatum
                className="l-1-2"
                icon="poblacion-estimada"
                datum={numeral(male / total, locale).format("0.0%")}
                title={t("Male Rate")}
                subtitle="CENSO 2017"
              />
            )}
            {female && (
              <FeaturedDatum
                className="l-1-2"
                icon="poblacion-estimada"
                datum={numeral(female / total, locale).format("0.0%")}
                title={t("Female Rate")}
                subtitle="CENSO 2017"
              />
            )}
            <FeaturedDatum
              className="l-1-2"
              icon="poblacion-estimada"
              datum={numeral(
                annualized_growth(datum_population_growth, [2005, 2020]),
                locale
              ).format("0.0%")}
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
