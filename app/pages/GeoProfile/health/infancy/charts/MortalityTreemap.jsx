import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";
import { numeral } from "helpers/formatters";

import { simpleDatumNeed } from "helpers/MondrianClient";

import { COLORS_SCALE_INFANT_MORTALITY } from "helpers/colors";

import TreemapStacked from "components/TreemapStacked";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class MortalityTreemap extends Section {
  static need = [
    simpleDatumNeed(
      "path_infant_mortality_under_one_data",
      "mortality_under_one",
      ["Number of deaths", "Rate Comuna", "Rate Region", "Rate Country"],
      {
        drillDowns: [
          ["Age Range", "Age Range DEIS", "Age Range"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true },
        cuts: [
          "{[Date].[Date].[Year].&[2012],[Date].[Date].[Year].&[2013],[Date].[Date].[Year].&[2014]}"
        ]
      },
      "geo",
      false
    ),
    simpleDatumNeed(
      "path_infant_mortality_one_to_ten_data",
      "mortality_one_to_ten",
      ["Number of deaths", "Rate Comuna", "Rate Region", "Rate Country"],
      {
        drillDowns: [
          ["Age Range", "Age Range DEIS", "Age Range"],
          ["Date", "Date", "Year"]
        ],
        options: { parents: true },
        cuts: [
          "{[Date].[Date].[Year].&[2012],[Date].[Date].[Year].&[2013],[Date].[Date].[Year].&[2014]}"
        ]
      },
      "geo",
      false
    )
  ];

  render() {
    const { t, className, i18n } = this.props;

    const path = this.context.data.path_infant_mortality_one_to_ten;

    const oneToTenData = this.context.data
      .path_infant_mortality_one_to_ten_data;
    const underOneData = this.context.data.path_infant_mortality_under_one_data;

    const processData = {
      data: underOneData.data
        .filter(d => [2, 3].includes(d["ID Age Range"]))
        .map(d => {
          return { ...d, "ID Age Group": 1, "Age Group": t("Infancy") };
        })
        .concat(
          oneToTenData.data.map(d => {
            return { ...d, "ID Age Group": 2, "Age Group": t("Childhood") };
          })
        )
    };

    const geo = this.context.data.geo;

    const locale = i18n.language;
    const classSvg = "infant-mortality-treemap-stacked";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Infant & Childhood Mortality")}
            <SourceTooltip cube="mortality_under_one" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <TreemapStacked
          depth={true}
          forceUpdate={true}
          path={processData}
          msrName="Number of deaths"
          drilldowns={["Age Group", "Age Range"]}
          className={classSvg}
          defaultChart="stacked"
          config={{
            label: d => d["Age Range"],
            // width,
            legendConfig: {
              label: false
            },
            tooltipConfig: {
              title: d => d["Age Range"],
              body: d =>
                "<div>" +
                `${numeral(d["Number of deaths"], locale).format("0,0")} ${t(
                  "deaths"
                )}` +
                "</div>"
            },
            legendTooltip: {
              title: d => d["Age Group"]
            },
            shapeConfig: {
              fill: d => COLORS_SCALE_INFANT_MORTALITY[d["ID Age Group"]]
            }
          }}
        />
      </div>
    );
  }
}

export default translate()(MortalityTreemap);
