import React from "react";

import { Network } from "d3plus-react";
import { simpleGeoChartNeed, simpleDatumNeed } from "helpers/MondrianClient";
import { productsColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { numeral } from "helpers/formatters";
import { sources } from "helpers/consts";

import ExportLink from "components/ExportLink";
import SourceNote from "components/SourceNote";

class Senado extends Section {
  static need = [];

  render() {
    const path = this.context.data.path_exports_last_year;
    const { t, className, i18n } = this.props;

    const data = [
      { id: "560", size: 30 },
      { id: "559", size: 30 },
      { id: "558", size: 30 },
      { id: "557", size: 30 },
      { id: "556", size: 30 },
      { id: "555", size: 30 }
    ];

    const nodes = [
      { id: "alpha", x: 1, y: 1 },
      { id: "beta", x: 2, y: 1 },
      { id: "gamma", x: 1, y: 2 },
      { id: "epsilon", x: 3, y: 2 },
      { id: "zeta", x: 2.5, y: 1.5 },
      { id: "theta", x: 2, y: 2 }
    ];

    const links = [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
      { source: 3, target: 4 },
      { source: 3, target: 5 },
      { source: 5, target: 0 }
    ];

    const locale = i18n.language;
    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Composición del Senado 2018-2022")}</span>
          <ExportLink path={path} />
        </h3>
        <Network
          config={{
            height: 300,
            nodes: "/json/senado.json",
            label: false,
            //nodes: "/json/pspace_hs2012_nodes_d3p2.json",
            //data: data,
            //nodes: nodes,
            //links: links
            //label: d => d.HS2,
            sizeMax: 17,
            //sizeMin: 3,
            //sizeMax: 10,
            zoomScroll: false,
            shapeConfig: {
              Path: {
                //stroke: "#555"
              },
              fill: d => (d["id"] > "520" ? "#0099cc" : "red")
            },
            legend: false
          }}
        />
        <SourceNote cube="exports" />
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

export default translate()(Senado);
