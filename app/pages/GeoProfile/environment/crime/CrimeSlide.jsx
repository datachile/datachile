import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";

import { Crime } from "texts/GeoProfile";

class CrimeSlide extends Section {
  static need = [
    (params, store) =>
      simpleDatumNeed(
        "datum_crimes_by_year",
        "crimes",
        ["Cases"],
        {
          drillDowns: [["Crime", "Crime", "Crime"], ["Date", "Date", "Year"]],
          options: { parents: true },
          cuts: []
        },
        "geo",
        false
      )(params, store)
  ];

  render() {
    const { children, t, i18n } = this.props;
    const { datum_crimes_by_year, geo } = this.context.data;

    const locale = i18n.language;
    const text = Crime(datum_crimes_by_year, geo, locale, t);

    console.log(text);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Crimes")}</div>
          <div className="topic-slide-text">
            {text && (
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    text.total_last_year > 0
                      ? t("geo_profile.housing.crimes.default", text)
                      : t("geo_profile.housing.crimes.no_data", text)
                }}
              />
            )}
          </div>
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

export default translate()(CrimeSlide);
