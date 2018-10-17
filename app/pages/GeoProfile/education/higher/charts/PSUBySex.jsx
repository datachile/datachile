import React from "react";
import { Section } from "@datawheel/canon-core";
import { BarChart } from "d3plus-react";
import { translate } from "react-i18next";
import { Switch } from "@blueprintjs/core";

import { numeral } from "helpers/formatters";

import { COLORS_GENDER } from "helpers/colors";
import { simpleGeoChartNeed } from "helpers/MondrianClient";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

class PSUBySex extends Section {
  state = {
    stacked: true
  };
  static need = [];

  // to stack, or not to stack
  toggleStacked() {
    this.setState({
      stacked: !this.state.stacked
    });
  }

  render() {
    const { t, className, i18n } = this.props;
    const { stacked } = this.state;

    const locale = i18n.language;
    const classSvg = "psu-by-sex";

    const path = this.context.data.path_higher_psu_by_sex;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("PSU By Sex")}
            <SourceTooltip cube="psu" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>

        <BarChart
          className={classSvg}
          config={{
            height: 400,
            data: path,
            groupBy: "ID Sex",
            label: d => t(d["Sex"]),
            x: "ID Year",
            y: "Number of records",
            stacked: stacked,
            shapeConfig: {
              fill: d => COLORS_GENDER[d["ID Sex"]],
              label: d => d["Sex"]
            },
            xConfig: {
              title: false
            },
            yConfig: {
              title: t("PSU exams")
            },
            legendConfig: {
              label: false,
              shapeConfig: {
                backgroundImage: d =>
                  "/images/legend/sex/" + d["ID Sex"] + ".png"
              }
            },
            barPadding: 0,
            groupPadding: 10,
            tooltipConfig: {
              body: d => {
                return (
                  numeral(d.value, locale).format("0,0") + " " + t("PSU exams")
                );
              }
            }
          }}
          dataFormat={data => {
            const reduced = data.data.reduce((all, d) => {
              all.push({
                ...d,
                item: t("Sex")
              });
              return all;
            }, []);
            console.log(reduced)
            return reduced;
          }}
        />
        {/* stacked bar toggle */}
        <Switch
          onClick={this.toggleStacked.bind(this)}
          label={t("Stacked bars")}
          defaultChecked={stacked}
        />
      </div>
    );
  }
}

export default translate()(PSUBySex);
