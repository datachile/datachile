import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { sources } from "helpers/consts";

import FeaturedDatum from "components/FeaturedDatum";

import { textCivicsCongress } from "texts/GeoProfile";

const election_year = []
  .concat(sources.election_results_update.senators_election_year)
  .pop();

class CongressSlide extends Section {
  static need = [
    simpleDatumNeed(
      "datum_election_congressperson",
      "election_results_update",
      ["Number of records", "Votes"],
      {
        drillDowns: [
          ["Election Type", "Election Type", "Election Type"],
          ["Party", "Party", "Partido"],
          ["Candidates", "Candidates", "Candidate"]
        ],
        options: { sparse: true },
        cuts: [
          "{[Election Type].[Election Type].[Election Type].&[3],[Election Type].[Election Type].[Election Type].&[4]}",
          "[Elected].[Elected].[Elected].&[1]",
          `[Date].[Date].[Year].&[${election_year}]`
        ]
      },
      "geo",
      false
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_election_congressperson, geo } = this.context.data;

    const locale = i18n.language;
    const text = undefined; //Election(datum_electoral_participation, geo, locale);
    const text2 = textCivicsCongress(
      geo,
      datum_election_congressperson,
      election_year,
      locale
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("geo_profile.civics.congress.title")}
          </div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{
              __html: t("geo_profile.civics.congress.text", text2)
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
        {geo.depth > 0 && (
          <div>
            <p
              className="chart-text"
              dangerouslySetInnerHTML={{
                __html: t("geo_profile.civics.congress.note")
              }}
            />
            <br />
          </div>
        )}
      </div>
    );
  }
}

export default translate()(CongressSlide);
