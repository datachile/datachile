import React from "react";
import { Section } from "@datawheel/canon-core";
import { Treemap, StackedArea } from "d3plus-react";
import { translate } from "react-i18next";

import { numeral } from "helpers/formatters";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { educationLevelColorScale } from "helpers/colors";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

import { nest } from "d3-collection";
import { sum } from "d3-array";

class EmploymentByLevel extends Section {
  static need = [
    (params, store) => {
      var geo = getGeoObject(params);
      const prm = mondrianClient.cube("nene_quarter").then(cube => {
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
            .drilldown("Date", "Date", "Moving Quarter")
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

    const classSvg = "employment-by-level";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Employed People By Education Level")}
            <SourceTooltip cube="nene" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <StackedArea
          className={classSvg}
          config={{
            height: 400,
            data: path,
            groupBy: "ID ISCED",
            label: d => d["ISCED"],
            x: "month",
            y: "share",
            yConfig: {
              tickFormat: d => `${d * 100}%`
            },
            xConfig: {
              //labels: [2010, 2011, 2012, 2013, 2014, 2015, 2016]
            },
            time: "month",
            timeline: false,
            scale: "time",
            shapeConfig: {
              fill: d => educationLevelColorScale(d["ID ISCED"]),
              label: d => d["ISCED"]
            },
            tooltipConfig: {
              title: d => {
                return d["ISCED"];
              },
              tbody: [
                [t("Quarter"), d => d["quarter"]],
                [t("Share"), d => numeral(d["share"], locale).format("0.0%")],
                [t("Employees"), d => numeral(d["Expansion factor"], locale).format("0.0a")]
              ]
            },
            legend: false,
            legendConfig: {
              label: false,
              shapeConfig: {
                backgroundImage: () => "/images/legend/college/hat.png"
              }
            }
          }}
          dataFormat={resp => {
            const data = resp.data.map(f => {
              const date = f["ID Moving Quarter"].split("_");
              f["month"] = date[0] + "-" + date[1] + "-01";
              f["quarter"] =
                date[0] + " (" + date[1] + "," + date[2] + "," + date[3] + ")";
              return f;
            });

            nest()
              .key(d => d.month)
              .entries(data)
              .forEach(group => {
                const total = sum(group.values, d => d["Expansion factor"]);
                group.values.forEach(
                  d => (d.share = d["Expansion factor"] / total)
                );
              });

            return data;
          }}
        />
      </div>
    );
  }
}

export default translate()(EmploymentByLevel);
