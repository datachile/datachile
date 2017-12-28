import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";
import { simpleGeoDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";

class EmploymentSlide extends Section {
  static need = [
    (params, store) => {
      var geo = getGeoObject(params);
      //force to region query on comuna profile
      if (geo.type == "comuna") {
        geo = geo.ancestor;
      }
      return simpleGeoDatumNeed(
        "datum_employment_occupied",
        "nene",
        ["Expansion factor"],
        {
          drillDowns: [["Date", "Date", "Year"], ["Sex", "Sex", "Sex"]],
          options: { parents: false },
          cuts: [
            "[ISCED].[ISCED].[ISCED].&[6]",
            `[Date].[Date].[Year].&[${sources.nene.year}]`,
            "[Occupational Situation].[Occupational Situation].[Occupational Situation].&[1]"
          ]
        },
        false,
        geo
      )(params, store);
    },
    (params, store) => {
      var geo = getGeoObject(params);
      //force to region query on comuna profile
      if (geo.type == "comuna") {
        geo = geo.ancestor;
      }
      return simpleGeoDatumNeed(
        "datum_employment_unemployment",
        "nene",
        ["Expansion factor"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [
            "[Occupational Situation].[Occupational Situation].[Occupational Situation].&[2]",
            `[Date].[Date].[Year].&[${sources.nene.year}]`
          ]
        },
        false,
        geo
      )(params, store);
    }
  ];

  render() {
    const { children, t, i18n } = this.props;

    const {
      geo,
      datum_employment_occupied,
      datum_employment_unemployment
    } = this.context.data;

    const locale = i18n.language;

    console.log(datum_employment_occupied);

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Employment")}</div>
          <div className="topic-slide-text">text</div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum={numeral(
                datum_employment_unemployment[0]["Expansion factor"],
                locale
              ).format("0,0")}
              title={t("Unemployed people")}
              subtitle={sources.nene.year + t(" in ") + geo.caption}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(
                datum_employment_occupied[0]["Expansion factor"],
                locale
              ).format("0,0")}
              title={t("Employed Women with Technical Education")}
              subtitle={sources.nene.year + t(" in ") + geo.caption}
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum={numeral(
                datum_employment_occupied[1]["Expansion factor"],
                locale
              ).format("0,0")}
              title={t("Employed Men with Technical Education")}
              subtitle={sources.nene.year + t(" in ") + geo.caption}
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(EmploymentSlide);
