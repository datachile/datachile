import React, { Component } from "react";
import { StackedArea } from "d3plus-react";
import { translate } from "react-i18next";

class CustomStackedArea extends Component {
  render() {
    const { t, className, i18n } = this.props;

    const locale = i18n.language;
    return (
      <StackedArea
        config={this.props.config}
        dataFormat={data => {
          var filtered = data.data.filter(d => {
            return d["ID Sex"] === this.props.Sex;
          });
          var melted = [];
          var total = {};
          filtered.forEach(f => {
            if (total[f["ID Moving Quarter"]]) {
              total[f["ID Moving Quarter"]] += f["Expansion factor"];
            } else {
              total[f["ID Moving Quarter"]] = f["Expansion factor"];
            }
            var a = f;
            var date = f["ID Moving Quarter"].split("_");
            f["month"] = date[0] + "-" + date[1] + "-01";
            f["quarter"] =
              date[0] + " (" + date[1] + "," + date[2] + "," + date[3] + ")";
            a["variable"] = f["Occupational Situation"];
            a["value"] = f["Expansion factor"];
            melted.push(a);
          });
          melted = melted
            .map(m => {
              m["percentage"] = m["value"] / total[m["ID Moving Quarter"]];
              return m;
            })
            .sort((a, b) => {
              return a["Month"] > b["Month"] ? 1 : -1;
            });

          return melted;
        }}
      />
    );
  }
}

export default translate()(CustomStackedArea);
