import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";
import LevelWarning from "components/LevelWarning";

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
            ["Sex", "Sex", "Sex"],
            ["Disability Grade", "Disability Grade", "Disability Grade"]
          ],
          options: { parents: true },
          cuts: []
        },
        "geo",
        false
      )(params, store)
  ];

  render() {
    const { children, path, t, i18n } = this.props;

    const { datum_health_disabilities, geo } = this.context.data;

    const locale = i18n.language;
    const text = Disability(
      datum_health_disabilities,
      geo.depth > 1 ? geo.ancestors[0] : geo,
      locale
    );

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("Disability")}</h3>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: t("geo_profile.health.disability", text)
              }}
            />
          </div>
          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="poblacion-con-discapacidad"
                datum={text.value}
                title={t("Population with disability")}
                subtitle={t("In") + " " + text.geo.caption}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="porcentaje-poblacion-discapacidad"
                datum={text.share}
                title={t("Population with disability")}
                subtitle={t("In") + " " + text.geo.caption}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="poblacion-femenina-con-discapacidad"
                datum={text.gender.female.share}
                title={t("Female percent with disability")}
                subtitle={
                  t(" of ") +
                  text.value +
                  " " +
                  t(" in ") +
                  " " +
                  text.geo.caption
                }
              />
            )}
          </div>
          {this.context.data.geo.depth > 1 && (
            <LevelWarning name={this.context.data.geo.ancestors[0].caption} path={path} />
          )}
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(DisabilitySlide);
