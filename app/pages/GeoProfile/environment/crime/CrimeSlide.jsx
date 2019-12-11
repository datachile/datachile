import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import { numeral } from "helpers/formatters";

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

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">{t("Crimes")}</h3>
          <div className="topic-slide-text">
            {text && (
              <p
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
                icon="datum-crime-1"
                datum={numeral(text.theft.growth, locale).format("0.0%")}
                title={t("Number of theft complaints growth")}
                subtitle={text.year.last - 1 + "-" + text.year.last}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="datum-crime-2"
                datum={numeral(text.larceny.total, locale).format("0,0")}
                title={t("Number of larceny complaints")}
                subtitle={t("In") + " " + text.year.last}
              />
            )}
            {text && (
              <FeaturedDatum
                className="l-1-3"
                icon="datum-crime-3"
                datum={numeral(text.theft.share, locale).format("0.0%")}
                title={t("Theft complaints share")}
                subtitle={t("In") + " " + text.year.last}
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(CrimeSlide);
