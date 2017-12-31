import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";

import { Disability } from "texts/GeoProfile";

class DisabilitySlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_health_disabilities",
        "disabilities",
        ["Expansion Factor Region"],
        {
          drillDowns: [
            ["Disability Grade", "Disability Grade", "Disability Grade"]
          ],
          options: { parents: true },
          cuts: [
            "{[Disability Grade].[Disability Grade].[Disability Grade].&[2],[Disability Grade].[Disability Grade].[Disability Grade].&[3]}"
          ]
        },
        "geo",
        false
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;

    const { datum_health_disabilities, geo } = this.context.data;

    const locale = i18n.language;
    const text = Disability(datum_health_disabilities, geo, locale);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("Disability")}
            {this.context.data.geo.depth > 1 ? (
              <div className="topic-slide-subtitle">
                <p>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "geo_profile.warning",
                        this.context.data.geo.ancestors[0]
                      )
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
                  __html: t("geo_profile.health.disability", text)
                }}
              />
            </p>
          </div>
          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="empleo"
                datum="xx"
                title="Lorem ipsum"
                subtitle="Lorem blabla"
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="empleo"
                datum="xx"
                title="Lorem ipsum"
                subtitle="Lorem blabla"
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="empleo"
                datum="xx"
                title="Lorem ipsum"
                subtitle="Lorem blabla"
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(DisabilitySlide);
