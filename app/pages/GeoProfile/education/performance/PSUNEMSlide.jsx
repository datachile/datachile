import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";

import { sources } from "helpers/consts";
import { PerformanceByPSU } from "texts/GeoProfile";

class PSUNEMSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_performance_by_psu",
        "education_performance_new",
        ["Average PSU"],
        {
          drillDowns: [["Institution", "Institution", "Administration"]],
          options: { parents: true },
          cuts: [
            `[Year].[Year].[Year].&[${sources.education_performance_new.year}]`
          ]
        },
        "geo",
        false
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    let { geo, datum_performance_by_psu } = this.context.data;

    const locale = i18n.language;

    const text = PerformanceByPSU(datum_performance_by_psu, geo, locale);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">Performance</div>
          <div className="topic-slide-text">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t(
                    "geo_profile.education.performance.byPSU.level1",
                    text
                  )
                }}
              />
            </p>
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum="XXX"
              title={t("Trade volume")}
              subtitle=""
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

export default translate()(PSUNEMSlide);
