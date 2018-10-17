import React from "react";
import orderBy from "lodash/orderBy";
import { Section } from "@datawheel/canon-core";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { numeral, getNumberFromTotalString } from "helpers/formatters";

import SourceTooltip from "components/SourceTooltip";
import ExportLink from "components/ExportLink";
import NoDataAvailable from "components/NoDataAvailable";

class HousingType extends Section {
  state = {
    chart: true
  };

  static need = [
    (params, store) => {
      const geo = getGeoObject(params);

      const promise = mondrianClient.cube("casen_household").then(cube => {
        const query = cube.query
          .drilldown("Date", "Date", "Year")
          .drilldown("Household Type", "Household Type", "Household Type")
          .measure("Expansion Factor Region")
          .option("parents", false);

        if (geo.type == "comuna") query.measure("Expansion Factor Comuna");

        return {
          key: "path_housing_type",
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

  prepareData = data => {
    if (!data.data || !data.data.length) {
      this.setState({ chart: false });
      return;
    }

    const comuna_available = data.data.some(d => d["Expansion Factor Comuna"]);

    if (comuna_available)
      data.data.forEach(d => {
        d["Expansion Factor"] = d["Expansion Factor Comuna"] || 0;
      });
    else
      data.data.forEach(d => {
        d["Expansion Factor"] = d["Expansion Factor Region"] || 0;
      });

    return data.data.sort(
      (a, b) => a["Expansion Factor"] - b["Expansion Factor"]
    );
  };

  render() {
    const { t, className, i18n } = this.props;
    const locale = i18n.language;
    const classSvg = "housing-type";

    const { geo, path_housing_type } = this.context.data;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Housing Type")}
            <SourceTooltip cube="casen_household" />
          </span>
          <ExportLink path={path_housing_type} className={classSvg} />
        </h3>
        {this.state.chart ? (
          <Treemap
            className={classSvg}
            config={{
              height: 400,
              data: path_housing_type,
              groupBy: ["ID Household Type"],
              label: d => d["Household Type"],
              time: "ID Year",
              sum: d => d["Expansion Factor"],
              shapeConfig: {
                fill: d => ordinalColorScale(d["Household Type"])
              },
              total: d => d["Expansion Factor"],
              tooltipConfig: {
                title: d => d["Household Type"],
                body: d =>
                  `${numeral(d["Expansion Factor"], locale).format("0,0")} ${t(
                    "houses"
                  )}`
              },
              legend: false,
              legendConfig: {
                label: false,
                shapeConfig: false
              }
            }}
            dataFormat={this.prepareData}
          />
        ) : (
          <NoDataAvailable />
        )}
      </div>
    );
  }
}

export default translate()(HousingType);
