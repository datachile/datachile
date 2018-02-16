import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

import { Congress } from "texts/GeoProfile";

class CongressSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_congressperson_elected",
        "election_results_update",
        ["Number of records", "Votes"],
        {
          drillDowns: [
            ["Candidates", "Candidates", "Candidate"],
            ["Coalition", "Coalition", "Coalition"]
          ],
          options: { parents: true },
          cuts: [
            "[Election Type].[Election Type].[Election Type].&[4]",
            "[Date].[Date].[Year].&[2017]",
            "[Elected].[Elected].[Elected].&[1]"
          ]
        },
        "geo",
        false
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    const {
      datum_congressperson_elected,
      geo,
      need_presidential_participation
    } = this.context.data;

    const locale = i18n.language;

    console.log(need_presidential_participation.data[0]["Electors"]);
    let text = Congress(datum_congressperson_elected, geo, locale, t);

    const datum_1 = numeral(
      need_presidential_participation.data[0]["Votes"] /
        need_presidential_participation.data[0]["Electors"],
      locale
    ).format("0.0%");
    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Election")}</div>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: t("geo_profile.civics.congress.text", text)
              }}
            />
          </div>
          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-2"
                icon="participation"
                datum={datum_1}
                title={t("Participation")}
                subtitle={t("Congress Election in 2017")}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-2"
                icon="participation"
                datum={""}
                title={t("Participation")}
                subtitle={""}
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(CongressSlide);
