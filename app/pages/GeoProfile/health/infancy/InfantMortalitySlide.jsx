import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";
import InfancyTooltip from "components/InfancyTooltip";

import { Disability } from "texts/GeoProfile";

class InfantMortalitySlide extends Section {
  static need = [
    simpleDatumNeed(
      "datum_infant_mortality_one_to_ten",
      "mortality_one_to_ten",
      ["Number of deaths", "Rate Comuna", "Rate Region", "Rate Country"],
      {
        drillDowns: [
          ["Age Range", "Age Range DEIS", "Age Range"],
          ["Date", "Date", "Year"],
          ["Sex", "Sex", "Sex"]
        ],
        options: { parents: true }
      },
      "geo",
      false
    )
  ];

  prepareDatum(data, year, msrName, ageRange, sex) {
    const filteredData = data.data.find(
      d =>
        d["ID Year"] === year &&
        d["ID Age Range"] === ageRange &&
        d["ID Sex"] === sex
    );
    return filteredData[msrName];
  }

  render() {
    const { children, path, t, i18n } = this.props;

    const {
      geo,
      datum_infant_mortality_one_to_ten,
      path_infant_mortality_one_to_ten_data,
      path_infant_mortality_under_one_data
    } = this.context.data;

    const locale = i18n.language;

    const total = path_infant_mortality_under_one_data.data.reduce((all, d) => {
      if ([2, 3].includes(d["ID Age Range"])) all += d["Number of deaths"];
      return all;
    }, 0);

    const text = {
      year: sources.mortality_one_to_ten.year,
      name: geo.name,
      total
    };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Infant & Childhood Mortality")}
          </h3>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: t("geo_profile.health.infancy", text)
              }}
            />
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="health-firstaid"
              datum={numeral(
                this.prepareDatum(
                  datum_infant_mortality_one_to_ten,
                  2014,
                  "Rate Comuna",
                  5,
                  1
                ),
                locale
              ).format("0")}
              title={t("Childhood Mortality Rate Female")}
              subtitle={`${t("1 to 4 Years")} ${t("in")} ${
                sources.mortality_one_to_ten.year
              }`}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="health-firstaid"
              datum={numeral(
                this.prepareDatum(
                  datum_infant_mortality_one_to_ten,
                  2014,
                  "Rate Comuna",
                  5,
                  2
                ),
                locale
              ).format("0")}
              title={t("Childhood Mortality Rate Male")}
              subtitle={`${t("1 to 4 Years")} ${t("in")} ${
                sources.mortality_one_to_ten.year
              }`}
            />
          </div>

          <h4 className="topic-slide-context-subhead">
            {t("About the Infant Mortality Rate")}
            <InfancyTooltip />
          </h4>

          {/* Mortalidad infantil: se compone del conciente entre el número de menores de 1 año fallecidos´entre enero y diciembre de cada año y el número de nacidos vivos inscritos de cada año multiplicado por un factor 1.000 de ampliación.  */}

          <h4>
            {t("About the Childhood Mortality Rate")}
            <InfancyTooltip context="childhood" />
          </h4>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(InfantMortalitySlide);
