import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { sources } from "helpers/consts";

import FeaturedDatum from "components/FeaturedDatum";

import { textCivicsPresident } from "texts/GeoProfile";

const election_year = []
  .concat(sources.election_results_update.presidential_election_year)
  .pop();

class PresidentSlide extends Section {
  static need = [
    simpleDatumNeed(
      "datum_election_president",
      "election_results_update",
      ["Votes"],
      {
        drillDowns: [
          ["Party", "Party", "Partido"],
          ["Candidates", "Candidates", "Candidate"],
          ["Election Type", "Election Type", "Election Type"]
        ],
        options: { sparse: true },
        cuts: [
          "{[Election Type].[Election Type].[Election Type].&[1],[Election Type].[Election Type].[Election Type].&[2]}",
          `[Date].[Date].[Year].&[${election_year}]`
        ]
      },
      "geo",
      false
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_election_president, geo } = this.context.data;

    const locale = i18n.language;
    const text = undefined;
    const text2 = textCivicsPresident(
      geo,
      datum_election_president,
      election_year,
      locale
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Election")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{
              __html: t("geo_profile.civics.president.text", text2)
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

export default translate()(PresidentSlide);
