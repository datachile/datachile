import React from "react";
import { Section } from "datawheel-canon";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, {
  geoCut,
  simpleGeoChartNeed
} from "helpers/MondrianClient";

import { COLORS_GENDER } from "helpers/colors";

import TreemapStacked from "components/TreemapStacked";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class MortalityTreemap extends Section {
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
    const path = this.context.data.path_infant_mortality_one_to_ten;
    const { t, className, i18n } = this.props;
    const geo = this.context.data.geo;

    const locale = i18n.language;
    const classSvg = "infant-mortality-under-one";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Infant Mortality")}
            <SourceTooltip cube="disabilities" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <TreemapStacked
          depth={true}
          path={path}
          msrName="Number of deaths"
          drilldowns={["Age Range"]}
          className={classSvg}
          config={{
            label: d => d["Age Range"],
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

export default translate()(MortalityTreemap);
