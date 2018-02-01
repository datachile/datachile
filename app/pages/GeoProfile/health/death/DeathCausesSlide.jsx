import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import { DeathCauses } from "texts/GeoProfile";

import FeaturedDatum from "components/FeaturedDatum";

class DeathCausesSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_health_death_causes_by_year",
        "death_causes",
        ["Casualities Count SUM"],
        {
          drillDowns: [
            ["CIE 10", "CIE 10", "CIE 10"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true }
        },
        "geo",
        false
      )(params, store),

    (params, store) =>
      simpleDatumNeed(
        "datum_health_death_causes_tumors",
        "death_causes",
        ["Casualities rate per 100 inhabitants"],
        {
          drillDowns: [
            ["CIE 10", "CIE 10", "CIE 10"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true },
          cuts: [
            "[CIE 10].[CIE 10].[CIE 10].&[C00-D48]",
            `[Date].[Date].[Year].&[${sources.death_causes.year}]`
          ]
        },
        "geo"
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    const {
      datum_health_death_causes_by_year,
      datum_health_death_causes_tumors,
      geo
    } = this.context.data;
    const locale = i18n.language;

    const text = DeathCauses(
      datum_health_death_causes_by_year,
      geo.depth > 1 ? geo.ancestors[0] : geo,
      locale
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("Death Causes")}
            {this.context.data.geo.depth > 1 ? (
              <div className="topic-slide-subtitle">
                <p>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("geo_profile.warning", {
                        caption:
                          "Región " + this.context.data.geo.ancestors[0].caption
                      })
                    }}
                  />
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="topic-slide-text">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("geo_profile.health.death_causes", text)
                }}
              />
            </p>
          </div>
          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-2"
                icon="muerte"
                datum={text.data.first.rate}
                title={
                  t("Yearly growth in deaths by ") + text.data.first.caption
                }
                subtitle={text.year.first + "-" + text.year.last}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-2"
                icon="muertes-tumores"
                datum={numeral(
                  datum_health_death_causes_tumors.data,
                  locale
                ).format("0.0")}
                title={t("Tumors (Neoplasms) deaths")}
                subtitle={
                  t("Per 100 inhabitants in") + " " + sources.death_causes.year
                }
              />
            )}
            {/*text && (
              <FeaturedDatum
                className="l-1-3"
                icon="empleo"
                datum="xx"
                title="Lorem ipsum"
                subtitle="Lorem blabla"
              />
            )*/}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(DeathCausesSlide);
