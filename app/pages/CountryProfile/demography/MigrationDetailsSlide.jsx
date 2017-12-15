import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import FeaturedDatum from "components/FeaturedDatum";

class MigrationDetailsSlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;

    const { country } = this.context.data;

    const txt_slide = t("country_profile.migration_details_slide.text", {
      level: country.caption,
      context: "change",
      year_latest: "year_latest".toUpperCase(),
      year_previous: "year_previous".toUpperCase(),
      year_first: "year_first".toUpperCase(),
      sex: {
        growth: "sex.growth".toUpperCase(),
        before: "sex.before".toUpperCase(),
        current: "sex.current".toUpperCase()
      },
      agerange: {
        first: "agerange.first".toUpperCase(),
        first_percent: "agerange.first_percent".toUpperCase(),
        first_growth: "agerange.first_growth".toUpperCase(),
        second: "agerange.second".toUpperCase()
      }
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Migration")}</div>
          <div
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
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

export default translate()(MigrationDetailsSlide);
