import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class Disability extends Section {
  static need = [
    (params, store) => {
      let geo = getGeoObject(params);
      if (geo.type === "comuna") {
        geo = { ...geo.ancestor };
      }
      const prm = mondrianClient.cube("disabilities").then(cube => {
        var query = cube.query
          .option("parents", true)
          .drilldown("Date", "Date", "Year")
          .drilldown("Disability Grade", "Disability Grade", "Disability Grade")
          .measure("Expansion Factor Region");

        var q = geoCut(geo, "Geography", query, store.i18n.locale);

        return {
          key: "path_health_disabilities_by_grade",
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
    const path = this.context.data.path_health_disabilities_by_grade;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;

    const locale = i18n.locale;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Disabilities by Grade")}</span>
          <ExportLink path={path} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: ["ID Disability Grade"],
            label: d => d["Disability Grade"],
            sum: d => d["Expansion Factor Region"],
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Disability Grade"])
            },
            legendConfig: {
              shapeConfig: {
                width: 40,
                height: 40
              }
            }
          }}
          dataFormat={data => data.data}
        />
        <SourceNote cube="disabilities" />
      </div>
    );
  }
}

export default translate()(Disability);
