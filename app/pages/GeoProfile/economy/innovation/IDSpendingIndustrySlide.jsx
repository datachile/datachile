import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { getGeoObject } from "helpers/dataUtils";

import { simpleDatumNeed, getMeasureByGeo } from "helpers/MondrianClient";
import { sources } from "helpers/consts";

import { SpendingBySector, SpendingByIndustry } from "texts/GeoProfile";

import FeaturedDatum from "components/FeaturedDatum";
import merge from "lodash/merge";

class IDSpendingCategorySlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject({ region: params.region, comuna: undefined });

      const regionID =
        typeof geo.ancestor != "undefined" ? geo.ancestor.key : "";
      const msrName = getMeasureByGeo(
        geo.type,
        "Total Spending",
        "gasto_region_" + geo.key,
        "gasto_region_" + regionID
      );
      return simpleDatumNeed(
        "datum_spending_by_sector",
        "rd_survey",
        [msrName],
        {
          drillDowns: [["Ownership Type", "Ownership Type", "Ownership Type"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.rd_survey.last_year - 1}]`]
        },
        "rd_survey",
        false
      )(params, store);
    },
    (params, store) => {
      const geo = getGeoObject({ region: params.region, comuna: undefined });

      const regionID =
        typeof geo.ancestor != "undefined" ? geo.ancestor.key : "";
      const msrName = getMeasureByGeo(
        geo.type,
        "Total Spending",
        "gasto_region_" + geo.key,
        "gasto_region_" + regionID
      );
      return simpleDatumNeed(
        "datum_spending_by_industry",
        "rd_survey",
        [msrName],
        {
          drillDowns: [["ISICrev4", "ISICrev4", "Level 1"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.rd_survey.last_year}]`]
        },
        "rd_survey",
        false
      )(params, store);
    }
  ];

  render() {
    const { children, t, i18n } = this.props;
    const {
      geo,
      datum_spending_by_sector,
      datum_spending_by_industry
    } = this.context.data;
    //const geo = this.context.data.geo;
    const locale = i18n.language;
    const regionID = geo.type === "comuna" ? geo.ancestors[0].key : "";
    const msrName = getMeasureByGeo(
      geo.type,
      "Total Spending",
      "gasto_region_" + geo.key,
      "gasto_region_" + regionID
    );

    console.log(msrName)

    const sector = SpendingBySector(
      datum_spending_by_sector,
      msrName,
      geo,
      locale,
      t
    );
    const industry = SpendingByIndustry(
      datum_spending_by_industry,
      msrName,
      locale,
      t
    );

    console.log(industry)
    const text = merge(sector, industry);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {geo.type !== "country" ? t("Regional ") : ""}
            {t("R&D spending")}
            {geo.depth > 1 ? (
              <div className="topic-slide-subtitle">
                <p>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("geo_profile.warning", geo.ancestors[0])
                    }}
                  />
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="topic-slide-text">
            <p>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("geo_profile.economy.innovation", text)
                }}
              />
            </p>
          </div>
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

export default translate()(IDSpendingCategorySlide);
