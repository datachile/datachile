import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";
import { numeral } from "helpers/formatters";
import { PerformanceByPSU } from "texts/GeoProfile";

class SNEDSlide extends Section {
  static need = [];

  render() {
    const { children, t, i18n } = this.props;
    let { geo } = this.context.data;

    const locale = i18n.language;

    const text = false;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Performance Evaluation")}</div>
          <div className="topic-slide-text">
            <p>
              {text && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(`geo_profile.education.sned.text1`, text)
                  }}
                />
              )}
            </p>
          </div>
          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="estudiantes-cantidad"
                datum="XX"
                title={t("Students that took the PSU")}
                subtitle={t("In")}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="estudiantes-cantidad"
                datum="XX"
                title={t("Students that took the PSU")}
                subtitle={t("In")}
              />
            )}

            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="estudiantes-cantidad"
                datum="XX"
                title={t("Students that took the PSU")}
                subtitle={t("In")}
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(SNEDSlide);
