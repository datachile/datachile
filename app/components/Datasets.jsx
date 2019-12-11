import mondrianClient from "helpers/MondrianClient";
import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import {connect} from "react-redux";

import "./Datasets.css";

class Datasets extends Component {
  static need = [
    (params, store) => {
      let prm;
      const r = {key: "__all_cubes__"};
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
        return {...r, data: result};
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const {t} = this.props;
    const datasets = this.props.data.__all_cubes__;

    return (
      <div className="datasets">
        <table className="docs-table fixed-table">
          <thead>
            <tr>
              <th className="subhead">{t("Cube")}</th>
              <th className="subhead">{t("Drilldowns")}</th>
              <th className="subhead">{t("Measures")}</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((cube, i) => {
              return (
                <tr key={`dataset_${i}`}>
                  <td>
                    <code>{cube.name}</code>
                  </td>
                  <td>
                    {cube.dimensions.map(dim => (
                      <code>
                        [{dim.dim}].[{dim.hier}].[{dim.level}]
                      </code>
                    ))}
                  </td>
                  <td>{cube.measures.map(ms => <p className="font-xs">{ms.name}</p>)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withNamespaces()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(Datasets)
);
