import React from "react";
import { Section } from "@datawheel/canon-core";
import { Treemap } from "d3plus-react";
import { withNamespaces } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

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

    const locale = i18n.language;
    const classSvg = "disabilities-by-grade";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Disabilities by Grade")}
            <SourceTooltip cube="disabilities" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <Treemap
          className={classSvg}
          config={{
            height: 400,
            data: path,
            groupBy: ["ID Disability Grade"],
            label: d => d["Disability Grade"],
            sum: d => d["Expansion Factor Region"],
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Disability Grade"])
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default withNamespaces()(Disability);
