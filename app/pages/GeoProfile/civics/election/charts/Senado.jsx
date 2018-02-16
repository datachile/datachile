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
