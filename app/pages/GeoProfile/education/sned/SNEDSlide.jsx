import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";
import SNEDTooltip from "components/SNEDTooltip";
import { numeral } from "helpers/formatters";
import { SNED } from "texts/GeoProfile";

class SNEDSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "sned_indicators_datum",
        "education_sned",
        [
          "Number of records",
          "Avg efectiveness",
          "Avg overcoming",
          "Avg initiative",
          "Avg integration",
          "Avg improvement",
          "Avg fairness",
          "Avg sned_score"
        ],
        {
          drillDowns: [["Cluster", "Cluster", "Stage 1a"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[2016]`]
        },
        "geo",
        false
      )(params, store),
    (params, store) =>
      simpleDatumNeed(
        "datum_sned_score",
        "education_sned",
        ["Avg sned_score"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[2016]`]
        },
        "geo"
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    let { geo, sned_indicators_datum, datum_sned_score } = this.context.data;

    const locale = i18n.language;
    const text = SNED(sned_indicators_datum, locale);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Performance Evaluation")}
          </h3>
          <div className="topic-slide-text">
            {text && datum_sned_score && (
              <p
                dangerouslySetInnerHTML={{
                  __html: t(`geo_profile.education.sned.text1`, {
                    score: numeral(datum_sned_score.data, locale).format(
                      "0.00"
                    ),
                    year: 2016,
                    geo
                  })
                }}
              />
            )}
            <div className="topic-slide-data">
              {text && (
                <FeaturedDatum
                  className="l-1-3"
                  icon="avg-score"
                  datum={String(
                    numeral(datum_sned_score.data, locale).format("0.00")
                  )}
                  title={t("Average SNED Score")}
                  subtitle={t("In") + " " + "2016"}
                />
              )}
              {text && (
                <FeaturedDatum
                  className="l-1-3"
                  icon="rural-school"
                  datum={String(text.rural.n)}
                  title={t("Rural Schools")}
                  subtitle={text.rural.perc + " " + t("of") + " " + geo.caption}
                />
              )}
              {text && (
                <FeaturedDatum
                  className="l-1-3"
                  icon="special-education"
                  datum={String(text.special.n)}
                  title={t("Special Education Schools")}
                  subtitle={
                    text.special.perc + " " + t("of") + " " + geo.caption
                  }
                />
              )}
            </div>
            <h4 className="topic-slide-context-subhead">
              {t("About the SNED measurement system")}
              <SNEDTooltip />
            </h4>
            <p className="font-xxs">
              {t("geo_profile.education.sned.description")}
            </p>
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(SNEDSlide);
