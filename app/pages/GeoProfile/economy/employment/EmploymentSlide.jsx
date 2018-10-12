import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";
import { getGeoObject } from "helpers/dataUtils";
import { simpleGeoDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";
import LevelWarning from "components/LevelWarning";

class EmploymentSlide extends Section {
  static need = [
    (params, store) => {
      var geo = getGeoObject(params);
      //force to region query on comuna profile
      if (geo.type == "comuna") {
        geo = geo.ancestor;
      }
      return simpleGeoDatumNeed(
        "datum_employment_text_sex",
        "nene_quarter",
        ["Expansion factor"],
        {
          drillDowns: [["Sex", "Sex", "Sex"]],
          options: { parents: true },
          cuts: [
            `[Date].[Date].[Moving Quarter].&[${sources.nene.last_quarter}]`,
            "{[Age Range].[Age Range].[Age Range].&[2],[Age Range].[Age Range].[Age Range].&[3],[Age Range].[Age Range].[Age Range].&[4],[Age Range].[Age Range].[Age Range].&[5]}"
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
        "datum_employment_text_employment",
        "nene_quarter",
        ["Expansion factor"],
        {
          drillDowns: [
            [
              "Occupational Situation",
              "Occupational Situation",
              "Occupational Situation"
            ]
          ],
          options: { parents: true },
          cuts: [
            `[Date].[Date].[Moving Quarter].&[${sources.nene.last_quarter}]`,
            "{[Age Range].[Age Range].[Age Range].&[2],[Age Range].[Age Range].[Age Range].&[3],[Age Range].[Age Range].[Age Range].&[4],[Age Range].[Age Range].[Age Range].&[5]}"
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
        "datum_employment_text_isced",
        "nene_quarter",
        ["Expansion factor"],
        {
          drillDowns: [["ISCED", "ISCED", "ISCED"]],
          options: { parents: true },
          cuts: [
            `[Date].[Date].[Moving Quarter].&[${sources.nene.last_quarter}]`,
            "{[Age Range].[Age Range].[Age Range].&[2],[Age Range].[Age Range].[Age Range].&[3],[Age Range].[Age Range].[Age Range].&[4],[Age Range].[Age Range].[Age Range].&[5]}"
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
        "datum_employment_occupied",
        "nene_quarter",
        ["Expansion factor"],
        {
          drillDowns: [
            ["Date", "Date", "Moving Quarter"],
            ["Sex", "Sex", "Sex"]
          ],
          options: { parents: false },
          cuts: [
            "[ISCED].[ISCED].[ISCED].&[6]",
            `[Date].[Date].[Moving Quarter].&[${sources.nene.last_quarter}]`,
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
        "nene_quarter",
        ["Expansion factor"],
        {
          drillDowns: [["Date", "Date", "Moving Quarter"]],
          options: { parents: false },
          cuts: [
            "[Occupational Situation].[Occupational Situation].[Occupational Situation].&[2]",
            `[Date].[Date].[Moving Quarter].&[${sources.nene.last_quarter}]`
          ]
        },
        false,
        geo
      )(params, store);
    }
  ];

  render() {
    const { children, path, t, i18n } = this.props;

    const {
      geo,
      datum_employment_occupied,
      datum_employment_unemployment,

      datum_employment_text_isced,
      datum_employment_text_employment,
      datum_employment_text_sex
    } = this.context.data;

    const locale = i18n.language;

    const ancestor = geo.depth > 1 ? geo.ancestors[0].caption : geo.caption;

    const levels = datum_employment_text_isced.sort(
      (a, b) => b["Expansion factor"] - a["Expansion factor"]
    );

    const total_female = datum_employment_text_sex.find(
      item => item["ID Sex"] === 1
    )["Expansion factor"];
    const total_male = datum_employment_text_sex.find(
      item => item["ID Sex"] === 2
    )["Expansion factor"];

    const text = {
      year: {
        last: "2016",
        trim: ""
      },
      geo: { caption: ancestor },
      total: {
        total: numeral(total_female + total_male, locale).format("0,0.00 a"),
        female: numeral(total_female, locale).format("0,0.00 a"),
        male: numeral(total_female, locale).format("0,0.00 a"),
        empleados: numeral(
          datum_employment_text_employment.find(
            item => item["ID Occupational Situation"] === 1
          )["Expansion factor"],
          locale
        ).format("0,0.00 a"),
        desempleados: numeral(
          datum_employment_text_employment.find(
            item => item["ID Occupational Situation"] === 2
          )["Expansion factor"],
          locale
        ).format("0,0.00 a"),
        inactivos: numeral(
          datum_employment_text_employment.find(
            item => item["ID Occupational Situation"] === 3
          )["Expansion factor"],
          locale
        ).format("0,0.00 a")
      },
      level: {
        first: {
          caption: levels[0]["ISCED"]
        },
        second: {
          caption: levels[1]["ISCED"]
        }
      }
    };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Employment")}
          </h3>
          <div className="topic-slide-text">
            <p dangerouslySetInnerHTML={{
                __html: t("geo_profile.economy.employment.text", text)
              }}
            />
          </div>
          {datum_employment_unemployment && (
            <div className="topic-slide-data">
              <FeaturedDatum
                className="l-1-3"
                icon="actividad-inactivo"
                datum={numeral(
                  datum_employment_unemployment[0]["Expansion factor"],
                  locale
                ).format("0.0 a")}
                title={t("Unemployed people")}
                subtitle={sources.nene.year + t(" in ") + ancestor}
              />
              <FeaturedDatum
                className="l-1-3"
                icon="empleo-femenino"
                datum={numeral(
                  datum_employment_occupied[0]["Expansion factor"],
                  locale
                ).format("0.0 a")}
                title={t("Employed Women with Technical Education")}
                subtitle={sources.nene.year + t(" in ") + ancestor}
              />
              <FeaturedDatum
                className="l-1-3"
                icon="empleo-masculino"
                datum={numeral(
                  datum_employment_occupied[1]["Expansion factor"],
                  locale
                ).format("0.0 a")}
                title={t("Employed Men with Technical Education")}
                subtitle={sources.nene.year + t(" in ") + ancestor}
              />
            </div>
          )}
          {geo.depth > 1 && (
            <LevelWarning name={geo.ancestors[0].caption} path={path} />
          )}
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(EmploymentSlide);
