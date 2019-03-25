import React from "react";
import { Section } from "@datawheel/canon-core";
import { translate } from "react-i18next";

import ExportLink from "components/ExportLink";
import SourceTooltip from "components/SourceTooltip";

import { LinePlot } from "d3plus-react";
import axios from "axios";
import numeral from "numeral";

import { EDUCATION_COLORS } from "helpers/colors";

class AbandonmentRate extends Section {
  constructor(props) {
    super(props);
    this.state = {
      selected: 1
    };
  }
  componentDidMount() {
    // axios.get()
  }
  render() {
    const { t, className, i18n } = this.props;
    const { geo } = this.context.data;
    const { selected } = this.state;

    const locale = i18n.language;
    const classSvg = "abandonment-percentage";

    const geoType =
      geo.type.substring(0, 1).toUpperCase() + geo.type.substring(1);

    let filter = "";
    if (geo.type === "comuna") {
      filter = `&Region=${geo.ancestor.key}`;
    }

    // ${geoType}=${geo.key}

    let path = `/api/data?measures=Abandonment Percentage&drilldowns=Education Level,Year&parents=true`;
    if (geo.depth > 0) path += `&${geoType}=${geo.key}`;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("School Abandonment Rate")}
            <SourceTooltip cube="mds_abandonment_rate" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        <LinePlot
          forceUpdate={true}
          className={classSvg}
          config={{
            height: 400,
            data: path,
            filter: d => d["ID Education Level"] === selected,
            groupBy: "Education Level",
            shapeConfig: {
              Line: {
                stroke: d => EDUCATION_COLORS[d["ID Education Level"] - 1]
              }
            },
            tooltipConfig: {
              tbody: [
                [
                  t("Abandonment Rate"),
                  d =>
                    numeral(d["Abandonment Percentage"], locale).format(
                      "0.[0]%"
                    )
                ]
              ]
            },
            y: "Abandonment Percentage",
            yConfig: {
              title: t("Total"),
              tickFormat: d => numeral(d, locale).format("0.[0]%")
            },
            x: "Year",
            xConfig: {
              title: t("Year")
            },
            legendConfig: {
              label: false,
              shapeConfig: false
            }
          }}
          dataFormat={resp => resp.data}
        />
        <div style={{ height: 30 }}>
          <div className="btn-group">
            <button
              className={`btn font-xxs ${
                selected === 1 ? "is-active" : "is-inactive"
              }`}
              onClick={() => this.setState({ selected: 1 })}
            >
              <span className="btn-text">{t("Primary Education")}</span>
            </button>
            <button
              className={`btn font-xxs ${
                selected === 2 ? "is-active" : "is-inactive"
              }`}
              onClick={() => this.setState({ selected: 2 })}
            >
              <span className="btn-text">{t("Secondary Education")}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(AbandonmentRate);
