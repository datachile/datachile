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

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Emergency Care")}
          </h3>
          <div className="topic-slide-text">
            <p
              dangerouslySetInnerHTML={{
                __html: <div />
              }}
            />
          </div>
          <div className="topic-slide-data">a</div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(DisabilitySlide);
