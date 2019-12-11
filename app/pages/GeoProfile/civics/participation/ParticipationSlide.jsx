import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

import { textCivicsParticipation } from "texts/GeoProfile";

class ParticipationSlide extends Section {
  static need = [
    simpleDatumNeed(
      "datum_electoral_participation",
      "election_participation",
      ["Votes", "Participation"],
      {
        drillDowns: [
          ["Election Type", "Election Type", "Election Type"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true },
        cuts: ["[Date].[Date].[Year].&[2017]"]
      },
      "geo",
      false
    )
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_electoral_participation, geo } = this.context.data;

    const locale = i18n.language;
    const text = textCivicsParticipation(
      geo,
      datum_electoral_participation,
      locale
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("Election")}</h3>
          <p
            className="topic-slide-text"
            dangerouslySetInnerHTML={{
              __html: t(
                "geo_profile.civics.participation.text",
                text || { context: "nodata", geo, year: 2017 }
              )
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

export default withNamespaces()(ParticipationSlide);
