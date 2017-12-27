import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { educationLevelColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class EmploymentByLevel extends Section {
  static need = [
    (params, store) => {
      var geo = getGeoObject(params);
      const prm = mondrianClient.cube("nene").then(cube => {
        //force to region query on comuna profile
        if (geo.type == "comuna") {
          geo = geo.ancestor;
        }
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .option("parents", true)
            .drilldown("ISCED", "ISCED", "ISCED")
            .drilldown("Date", "Month")
            .measure("Expansion factor")
            .cut(
              "[Occupational Situation].[Occupational Situation].[Occupational Situation].&[1]"
            ),
          store.i18n.locale
        );

        return {
          key: "path_employment_by_level",
          data: __API__ + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const path = this.context.data.path_employment_by_level;
    const { t, className, i18n } = this.props;

    const locale = i18n.language;

    const ISCED_SORT = {
      i8: 0, //Ignorado
      i9: 1, //Nunca estudió
      i2: 2, //Preescolar
      i3: 3, //Primaria 1
      i4: 4, //Primaria 2
      i5: 5, //Secundaria
      i6: 6, //Técnica
      i7: 7, //Universidad
      i1: 8 //Doctorado
    };

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Regional Employment By Education")}</span>
          <ExportLink path={path} />
        </h3>
        <BarChart
          config={{
            height: 500,
            data: path,
            groupBy: "ID ISCED",
            label: d => d["ISCED"],
            time: "Month",
            x: false,
            y: "Expansion factor",
            shapeConfig: {
              fill: d => educationLevelColorScale(d["ID ISCED"]),
              label: false
            },
            xConfig: {
              tickSize: 0,
              title: false
            },
            yConfig: {
              title: t("People"),
              tickFormat: tick => numeral(tick, locale).format("(0 a)")
            },
            xSort: (a, b) => {
              return ISCED_SORT["i" + a["ID ISCED"]] >
                ISCED_SORT["i" + b["ID ISCED"]]
                ? 1
                : -1;
            },
            barPadding: 0,
            groupPadding: 5,
            tooltipConfig: {
              title: d => {
                return d["ISCED"];
              },
              body: d =>
                numeral(d["Expansion factor"], locale).format("(0 a)") +
                " " +
                t("people")
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: () => "/images/legend/college/hat.png"
              }
            }
          }}
          dataFormat={data =>
            data.data.sort(
              (a, b) =>
                ISCED_SORT["i" + a["ID ISCED"]] >
                ISCED_SORT["i" + b["ID ISCED"]]
                  ? 1
                  : -1
            )
          }
        />
        <SourceNote cube="nene" />
      </div>
    );
  }
}

export default translate()(EmploymentByLevel);
