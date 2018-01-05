import React from "react";

import { Network } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { industriesColorScale } from "helpers/colors";
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
            height: 600,
            links: "/json/isic_4_02_links_d3p2.json",
            nodes: "/json/isic_4_02_nodes_d3p2.json",
            data: path,
            label: d => d["Level 4"],
            size: "Output",
            sizeMin: 3,
            sizeMax: 10,
            zoomScroll: false,
            shapeConfig: {
              Path: {
                stroke: "#555"
              },
              fill: d =>
                d["Output RCA"] < 1
                  ? "#aaaaaa"
                  : industriesColorScale(d["ID Level 1"]),
              activeStyle: { stroke: "#ffffff" }
            },
            legend: false,
            tooltipConfig: {
              body: d => {
                var body = `<table class='tooltip-table'>
                           <tr><td class='title'>${t("Output")}</td>
                           <td class='data'>${numeral(
                             d["Output"],
                             locale
                           ).format("$ 0 a")}</td></tr>
                           <tr><td class='title'>${t("ISIC")}</td>
                           <td class='data'>${d["ID Level 4"]}</td></tr>
                           <tr><td class='title'>${t(
                             "RCA"
                           )}</td><td class='data'>${numeral(
                  d["Output RCA"],
                  locale
                ).format("0.0")}</td></tr>
                         </table>`;
                return body;
              }
            }
          }}
          dataFormat={data =>
            data.data.map(d => ({
              id: d["ID Level 4"],
              "Output RCA": d["Output RCA"] === null ? 0 : d["Output RCA"],
              ...d
            }))
          }
        />
        <SourceNote cube="tax_data" />
        <p
          className="chart-text"
          dangerouslySetInnerHTML={{
            __html: t("geo_profile.economy.rca")
          }}
        />
      </div>
    );
  }
}

export default translate()(IndustrySpace);
