import React from "react";

import { Network } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { ordinalColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { sources } from "helpers/consts";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class IndustrySpace extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_industry_space",
      "tax_data",
      ["Output", "Output RCA"],
      {
        drillDowns: [["ISICrev4", "ISICrev4", "Level 4"]],
        options: { parents: true, sparse: false, nonempty: false },
        cuts: [`[Date].[Date].[Year].&[${sources.tax_data.last_year}]`]
      }
    )
  ];

  render() {
    const path = this.context.data.path_industry_space;
    const { t, className, i18n } = this.props;

    const locale = i18n.language;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Industry Space")}</span>
          <ExportLink path={path} />
        </h3>
        <Network
          config={{
            height: 500,
            links: "/json/isic_4_02_links_d3p2.json",
            nodes: "/json/isic_4_02_nodes_d3p2.json",
            data: path,
            size: "Output RCA",
            // size: "Output",
            sizeMin: 3,
            sizeMax: 18,
            zoomScroll: false,
            shapeConfig: {
              Path: {
                stroke: "#555"
              },
              fill: d =>
                d["Output RCA"] < 1
                  ? "#aaaaaa"
                  : ordinalColorScale("isl1" + d["ID Level 1"])
            },
            legend: false,
            tooltipConfig: {
              title: d => {
                return d["Level 4"];
              },
              body: d => numeral(d["Output"], locale).format("(USD 0 a)")
            }
          }}
          dataFormat={data =>
            data.data.map(d => ({
              id: d["ID Level 4"],
              "Output RCA":
                d["Output RCA"] === null ? 0 : d["Output RCA"] === null,
              ...d
            }))
          }
        />
        <SourceNote cube="tax_data" />
      </div>
    );
  }
}

export default translate()(IndustrySpace);
