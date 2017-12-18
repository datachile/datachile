import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleInstitutionDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class AccreditationSlide extends Section {
  static need = [];

  render() {
    const { t, i18n, children } = this.props;
    const locale = i18n.locale;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Accreditation")}</div>
          <div className="topic-slide-text">
            <p>Lorem ipsum</p>
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(datum_accreditation_avg_retention, locale).format(
                "0.0 %"
              )}
              title={t("Average Retention")}
              subtitle={t("1st year")}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(AccreditationSlide);
