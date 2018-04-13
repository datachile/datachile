import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

import { Election } from "texts/GeoProfile";

class PresidentSlide extends Section {
  static need = [
    (params, store) =>
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
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_electoral_participation, geo } = this.context.data;

    const locale = i18n.language;
    const text = Election(datum_electoral_participation, geo, locale);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Election")}</div>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: t("geo_profile.politics.text", text)
              }}
            />
          </div>
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
