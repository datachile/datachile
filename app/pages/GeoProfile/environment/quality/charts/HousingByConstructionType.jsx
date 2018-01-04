import React from "react";
import orderBy from "lodash/orderBy";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";
import sumBy from "lodash/sumBy";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import SourceNote from "components/SourceNote";
import ExportLink from "components/ExportLink";

class HousingByConstructionType extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);

      const promise = mondrianClient.cube("casen_household").then(cube => {
        const query = cube.query
          .drilldown("Date", "Date", "Year")
          .drilldown("Walls Material", "Walls Material", "Walls Material")
          .measure("Expansion Factor Region")
          .option("parents", true);

        if (geo.type == "comuna") query.measure("Expansion Factor Comuna");

        return {
          key: "path_housing_construction_type",
          data:
            __API__ +
            geoCut(geo, "Geography", query, store.i18n.locale).path(
              "jsonrecords"
            )
        };
      });

      return { type: "GET_DATA", promise };
    }
  ];

  render() {
    const { t, className, i18n } = this.props;
    const locale = i18n.language;

    const { path_housing_construction_type } = this.context.data;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Material of Walls")}</span>
          <ExportLink path={path_housing_construction_type} />
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path_housing_construction_type,
            groupBy: ["ID Walls Material"],
            label: d => d["Walls Material"],
            time: "ID Year",
            sum: d => d["Expansion Factor"],
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Walls Material"])
            },
            total: d => d["Expansion Factor"],
            totalConfig: {
              text: d =>
                "Total: " +
                numeral(getNumberFromTotalString(d.text), locale).format(
                  "0.[0] a"
                )
            },
            tooltipConfig: {
              title: d => d["Walls Material"],
              body: d =>
                `${numeral(d["Expansion Factor"], locale).format(
                  "( 0,0 )"
                )} ${t("houses")}`
            },
            legend: false,
            legendConfig: {
              label: false,
              shapeConfig: false
            }
          }}
          dataFormat={data => {
            console.log(data);
            const total = sumBy(data.data, "Expansion Factor Comuna");

            if (total)
              data.data.forEach(d => {
                d["Expansion Factor"] = d["Expansion Factor Comuna"];
              });
            else
              data.data.forEach(d => {
                d["Expansion Factor"] = d["Expansion Factor Region"];
              });

            return data.data.sort(
              (a, b) => a["Expansion Factor"] - b["Expansion Factor"]
            );
          }}
        />
        <SourceNote cube="casen_household" />
      </div>
    );
  }
}

export default translate()(HousingByConstructionType);
