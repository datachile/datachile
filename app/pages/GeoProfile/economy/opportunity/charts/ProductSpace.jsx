import React from "react";

import { Network } from "d3plus-react";
import { simpleGeoChartNeed } from "helpers/MondrianClient";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { numeral } from "helpers/formatters";
import { sources } from "helpers/consts";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class ProductSpace extends Section {
  static need = [
    simpleGeoChartNeed(
      "path_exports_last_year",
      "exports",
      ["FOB US", "Exports RCA"],
      {
        drillDowns: [["Export HS", "HS2"]],
        options: { parents: true, sparse: false, nonempty: false },
        cuts: [`[Date].[Date].[Year].&[${sources.exports.year}]`]
      }
    )
  ];

  render() {
    const path = this.context.data.path_exports_last_year;
    const { t, className, i18n } = this.props;

    const locale = i18n.language;
    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Product Space")}</span>
          <ExportLink path={path} />
        </h3>
        <Network
            config={{
              height: 500,
              links: "/json/pspace_hs2012_links_d3p2.json",
              nodes: "/json/pspace_hs2012_nodes_d3p2.json",
              data: path,
              label: d => d.HS2,
              size: "Exports RCA",
              sizeMin: 3,
              sizeMax: 10,
              zoomScroll: false,
              shapeConfig: {
                Path: {
                  stroke: "#555"
                },
                fill: d =>
                  d["Exports RCA"] < 1
                       ? "#aaaaaa"
                       : ordinalColorScale("hs0" + d["ID HS0"]),
                activeStyle: { stroke: "#ffffff" }
              },
              tooltipConfig: {
                body: d => {
                  var body = `<table class='tooltip-table'>
                           <tr><td class='title'>${t("Exports USD")}</td></tr>
                           <td class='data'>${numeral(
                             d["FOB US"],
                             locale
                           ).format("(USD 0 a)")}</td></tr>
                         </table>`;
                  return body;
                }
              },
              legend: false
            }}
            dataFormat={data => {
                data.data.map(d => (
                  {
                    ...d,
                    id: d["ID HS2"].slice(2),
                    "Exports RCA": d["Exports RCA"] ? d["Exports RCA"] : 0,
                    "FOB US": d["FOB US"] ? d["FOB US"] : 0
                  }
                ));
              }}
        />
        <SourceNote cube="tax_data" />
      </div>
    );
  }
}

export default translate()(ProductSpace);
