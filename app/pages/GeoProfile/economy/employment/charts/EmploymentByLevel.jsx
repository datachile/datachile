import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
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

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Employed People By Education Level")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: "ID ISCED",
            label: d => d["ISCED"],
            time: "month",
            sum: d => d["Expansion factor"],
            time: "month",
            shapeConfig: {
              fill: d => educationLevelColorScale(d["ID ISCED"]),
              label: d => d["ISCED"]
            },
            tooltipConfig: {
              title: d => {
                return d["ISCED"];
              },
              body: d => d["quarter"]
            },
            legend: false,
            legendConfig: {
              label: false,
              shapeConfig: {
                width: 40,
                height: 40,
                backgroundImage: () => "/images/legend/college/hat.png"
              }
            }
          }}
          dataFormat={data => {
            console.log("total", data.data);
            return data.data.map(f => {
              var date = f["ID Moving Quarter"].split("_");
              f["month"] = date[0] + "-" + date[1] + "-01";
              f["quarter"] =
                date[0] + " (" + date[1] + "," + date[2] + "," + date[3] + ")";
              return f;
            });
          }}
        />
        <SourceNote cube="nene" />
      </div>
    );
  }
}

export default translate()(EmploymentByLevel);
