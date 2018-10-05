import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed
} from "helpers/MondrianClient";

import { COLORS_GENDER } from "helpers/colors";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class MortalityUnderOne extends Section {
  static need = [
    (params, store) =>
      simpleGeoChartNeed(
        "path_infant_mortality_under_one",
        "mortality_under_one",
        ["Number of deaths", "Rate Comuna", "Rate Region", "Rate Country"],
        {
          drillDowns: [
            ["Age Range", "Age Range DEIS", "Age Range"],
            ["Date", "Date", "Year"]
          ],
          options: { parents: true },
          cuts: []
        }
      )(params, store)
  ];

  render() {
    const path = this.context.data.path_infant_mortality_under_one;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;

    const locale = i18n.language;
    const classSvg = "infant-mortality-under-one";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Infant Mortality")}
            <SourceTooltip cube="mortality_under_one" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <BarChart
          className={classSvg}
          config={{
            height: 400,
            data: path,
            groupBy: ["ID Age Range"],
            label: d => d["Age Range"],
            x: "ID Age Range",
            y:
              geo.depth === 0
                ? "Rate Country"
                : geo.depth === 1
                  ? "Rate Region"
                  : "Rate Comuna",
            time: "ID Year",
            shapeConfig: {
              // fill: d => COLORS_GENDER[d["ID Sex"]]
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                //
              }
            }
          }}
          dataFormat={data => {
            const processData = data.data.reduce((all, d) => {
              all.push(d);
              return all;
            }, [])
            return data.data;
          }}
        />
      </div>
    );
  }
}

export default translate()(MortalityUnderOne);
