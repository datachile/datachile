import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import { getGeoObject } from "helpers/dataUtils";

import { simpleDatumNeed, getMeasureByGeo } from "helpers/MondrianClient";
import { sources } from "helpers/consts";

import { SpendingBySector, SpendingByIndustry } from "texts/GeoProfile";
import merge from "lodash/merge";

import FeaturedDatum from "components/FeaturedDatum";
import LevelWarning from "components/LevelWarning";

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
    const { children, path, t, i18n } = this.props;
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

    const sector = SpendingBySector(
      datum_spending_by_sector,
      msrName,
      geo.type === "comuna" ? geo.ancestors[0] : geo,
      locale,
      t
    );
    const industry = SpendingByIndustry(
      datum_spending_by_industry,
      msrName,
      locale,
      t
    );

    const text = merge(sector, industry);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("R&D spending")}
          </h3>
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
            {text && (
              <FeaturedDatum
                className="l-1-2"
                icon="crecimiento-inversion-r-mas-d"
                datum={"US " + text.industry.total}
                title={t("R&D spending")}
                subtitle={
                  t("Executed by companies in") +
                  " " +
                  sources.rd_survey.last_year
                }
              />
            )}
          </div>
          {geo.depth > 1 && (
            <LevelWarning name={geo.ancestors[0].caption} path={path} />
          )}
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(IDSpendingCategorySlide);
