import React from "react";
import { Section } from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { translate } from "react-i18next";

export default translate()(
  class ImportsByOrigin extends Section {
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("imports").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", true)
              .drilldown("Origin Country", "Country")
              .drilldown("Date", "Year")
              .measure("CIF US"),
            store.i18n.locale
          );

          return {
            key: "path_imports_by_origin",
            data: "http://localhost:9292" + q.path("jsonrecords")
          };
        });

        return {
          type: "GET_DATA",
          promise: prm
        };
      }
    ];

    render() {
      const { t } = this.props;
      const path = this.context.data.path_imports_by_origin;

      return (
        <div className="lost-1-2">
          <Treemap
            config={{
              height: 552,
              data: path,
              groupBy: ["ID Region", "ID Country"],
              label: d =>
                d["Country"] instanceof Array ? d["Region"] : d["Country"],
              sum: d => d["CIF US"],
              time: "ID Year"
            }}
            dataFormat={data => data.data}
          />
        </div>
      );
    }
  }
);
