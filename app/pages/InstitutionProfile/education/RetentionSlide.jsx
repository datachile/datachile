import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleInstitutionDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class RetentionSlide extends Section {
  static need = [
    simpleInstitutionDatumNeed(
      "datum_accreditation_avg_retention",
      "education_employability",
      ["Avg Retention 1st year"],
      {
        drillDowns: [["Accreditations", "Accreditations", "Accreditation"]],
        options: { parents: false }
      }
    )
  ];

  render() {
    const { t, i18n, children } = this.props;
    const { datum_accreditation_avg_retention } = this.context.data;
    const locale = i18n.language;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title">{t("Retention")}</h3>
          <p className="topic-slide-text">Lorem ipsum</p>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(datum_accreditation_avg_retention, locale).format(
                "0.0%"
              )}
              title={t("Average Retention")}
              subtitle={t("1st year")}
            />
            <FeaturedDatum
              className="lost-1-3"
              icon="empleo"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="lost-1-3"
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

export default translate()(RetentionSlide);
