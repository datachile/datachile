import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";

//import { Disability } from "texts/GeoProfile";

class ElectionSlide extends Section {
  static need = [];

  render() {
    const { children, t, i18n } = this.props;

    const locale = i18n.language;
    const text = {};

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Election")}</div>
          <div className="topic-slide-text" />
          <div className="topic-slide-data">
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="poblacion-con-discapacidad"
                datum={"xx"}
                title={t("XX")}
                subtitle={t("In")}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="poblacion-con-discapacidad"
                datum={"xx"}
                title={t("XX")}
                subtitle={t("In")}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="poblacion-con-discapacidad"
                datum={"xx"}
                title={t("XX")}
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

export default translate()(ElectionSlide);
