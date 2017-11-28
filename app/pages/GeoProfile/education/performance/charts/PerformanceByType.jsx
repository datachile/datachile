import React from "react";
import { Section } from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { translate } from "react-i18next";

export default translate()(
  class PerformanceByType extends Section {
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("exports").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", true)
              .drilldown("Destination Country", "Country")
              .drilldown("Date", "Year")
              .measure("FOB US"),
            store.i18n.locale
          );
          return {
            key: "path_peformance_by_type",
            data: store.env.CANON_API + q.path("jsonrecords")
          };
        });

        return {
          type: "GET_DATA",
          promise: prm
        };
      }
    ];

    render() {
      const { t, className } = this.props;
      const path = this.context.data.path_peformance_by_type;

      return (
        <div className={className}>
          <h3 className="chart-title">{t("Performance By Type")}</h3>
          <Treemap
            config={{
              height: 500,
              data: path,
              groupBy: ["ID Region", "ID Country"],
              label: d =>
                d["Country"] instanceof Array ? d["Region"] : d["Country"],
              sum: d => d["FOB US"],
              time: "ID Year"
            }}
            dataFormat={data => data.data}
          />
        </div>
      );
    }
  }
);
