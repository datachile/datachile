import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { sources } from "helpers/consts";

import FeaturedDatum from "components/FeaturedDatum";

import { textCivicsMayor } from "texts/GeoProfile";

const election_year = []
  .concat(sources.election_results_update.mayor_election_year)
  .pop();

class MayorSlide extends Section {
  static need = [
    simpleDatumNeed(
      "datum_election_mayor",
      "election_results_update",
      ["Number of records", "Votes"],
      {
        drillDowns: [
          ["Party", "Party", "Partido"],
          ["Candidates", "Candidates", "Candidate"],
          ["Elected", "Elected", "Elected"]
        ],
        options: { sparse: true },
        cuts: [
          "[Election Type].[Election Type].[Election Type].&[5]",
          `[Date].[Date].[Year].&[${election_year}]`
        ]
      },
      "geo",
      false
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_election_mayor, geo } = this.context.data;

    const locale = i18n.language;
    const text = undefined;
    const text2 = textCivicsMayor(
      geo,
      datum_election_mayor,
      election_year,
      locale
    );

    if (text2) text2.position = t("mayor");

    if (text2 && geo.depth === 2) {
      const participation = this.context.data.need_mayor_participation.data[0];
      text2.votes.participation = numeral(
        participation.Votes / participation.Electors,
        locale
      ).format("0.0 %");
    }

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("geo_profile.civics.mayor.title")}
          </div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{
              __html: t("geo_profile.civics.mayor.text", text2)
            }}
          />
          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-2"
                icon="cambio-votacion"
                datum={numeral(text.growth, locale).format("0.0%")}
                title={t("Change in participation")}
                subtitle={t("Presidential 1st - 2nd round") + " " + "2017"}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-2"
                icon="participation"
                datum={text.participation.perc}
                title={t("Participation")}
                subtitle={
                  text.participation.caption + " - " + text.participation.year
                }
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MayorSlide);
