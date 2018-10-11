import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { simpleDatumNeed } from "helpers/MondrianClient";
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

    const text = textCivicsCongress(
      geo,
      datum_election_congressperson,
      election_year,
      locale
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title">
            {t("geo_profile.civics.congress.title")}
          </h3>
          <p
            className="topic-slide-text"
            dangerouslySetInnerHTML={{
              __html: t(
                "geo_profile.civics.congress.text",
                text || { context: "nodata", geo, year: election_year }
              )
            }}
          />
          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-2"
                icon="cambio-votacion"
                showIf={text.datum.rawSenTotal > 0}
                datum={text.datum.senTotal}
                title={t("Total amount of votes")}
                subtitle={
                  t("geo_profile.civics.congress.title_senators") +
                  " - " +
                  election_year
                }
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-2"
                icon="participation"
                showIf={text.datum.rawDipTotal > 0}
                datum={text.datum.dipTotal}
                title={t("Total amount of votes")}
                subtitle={
                  t("geo_profile.civics.congress.title_congresspeople") +
                  " - " +
                  election_year
                }
              />
            )}
          </div>
          {geo.depth > 0 && (
            <p
              className="chart-text font-xxs"
              dangerouslySetInnerHTML={{
                __html: t("geo_profile.civics.congress.note")
              }}
            />
          )}
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(CongressSlide);
