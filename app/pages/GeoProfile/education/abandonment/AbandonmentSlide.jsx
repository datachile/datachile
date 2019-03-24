import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";
import InfancyTooltip from "components/InfancyTooltip";

import { Disability } from "texts/GeoProfile";

class AbandonmentSlide extends Section {

  render() {
    const { children, path, t, i18n } = this.props;

    const { geo } = this.context.data;

    const locale = i18n.language;

   

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Abandonment Rate")}
          </h3>
          <div className="topic-slide-text">
            
          </div>
          <div className="topic-slide-data">
          </div>

        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(AbandonmentSlide);
