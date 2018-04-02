import React, { Component } from "react";
import { connect } from "react-redux";
import keyBy from "lodash/keyBy";
import { translate } from "react-i18next";
import { request as d3Request } from "d3-request";
import { select, selectAll } from "d3-selection";
import { sources } from "helpers/consts";

import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";
import SVGCache from "helpers/svg";

import "./Datasets.css";

class Datasets extends Component {
  static need = [
    (params, store) => {
      let prm;
      const r = { key: "__all_cubes__" };
      // force population of the internal MondrianClient cache.
      prm = mondrianClient.cubes().then(cubes => {
        const result = cubes.map(cube => {
          let levels = cube.dimensions.reduce((output, dim) => {
            for (let hier, i = 0; (hier = dim.hierarchies[i]); i++) {
              for (let level, j = 1; (level = hier.levels[j]); j++) {
                output.push({
                  key: level.fullName,
                  level: level.name,
                  hier: hier.name,
                  dim: dim.name
                });
              }
            }
            return output;
          }, []);

          let measures = cube.measures.map(ms => ({
            value: ms.name,
            name: ms.name
          }));

          return {
            name: cube.name,
            source_name: cube.annotations.source_name || "",
            dimensions: levels,
            measures: measures
          };
        });
        return { ...r, data: result };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { t } = this.props;
    const datasets = this.props.data.__all_cubes__;

    return (
      <div className="datasets">
        <table>
          <thead>
            <tr>
              <th>{t("Cube")}</th>
              <th>{t("Drilldowns")}</th>
              <th>{t("Measures")}</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map(cube => {
              return (
                <tr>
                  <td>{cube.name}</td>
                  <td>
                    {cube.dimensions.map(dim => (
                      <div>
                        [{dim.dim}].[{dim.hier}].[{dim.level}]
                      </div>
                    ))}
                  </td>
                  <td>{cube.measures.map(ms => <div>{ms.name}</div>)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(Datasets)
);
