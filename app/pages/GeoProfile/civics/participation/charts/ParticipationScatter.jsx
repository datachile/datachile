import React from "react";
import { Section } from "datawheel-canon";
import { Plot } from "d3plus-react";
import { simpleDatumNeed } from "helpers/MondrianClient";
import { translate } from "react-i18next";

import { mean } from "d3-array";

import { regionsColorScale } from "helpers/colors";
import { numeral, slugifyItem } from "helpers/formatters";

import Select from "components/Select";
import SourceTooltip from "components/SourceTooltip";
import ExportLink from "components/ExportLink";
import NoDataAvailable from "components/NoDataAvailable";

class ParticipationScatter extends Section {
  static need = [
    (params, store) => {
      let mirror = { ...params };
      mirror.comuna = undefined;

      return simpleDatumNeed(
        "election_participation_by_territory",
        "election_participation",
        ["Votes", "Participation", "Electors"],
        {
          drillDowns: [
            ["Geography", "Geography", "Comuna"],
            ["Election Type", "Election Type", "Election Type"]
          ],
          options: { parents: true }
        },
        "geo",
        false
      )(mirror, store);
    }
  ];

  constructor(props) {
    super(props);
    this.toggleChart = this.toggleChart.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      plot: true,
      log: false,
      selectedOption: 5,
      key: Math.random(),
      selectedObj: {
        path: "",
        groupBy: [],
        label: () => "",
        sum: () => ""
      },
      chartVariations: []
    };
  }

  componentDidMount() {
    const { t } = this.props;

    var variations = [
      {
        id: 5,
        title: t("Municipal") + " - 2016"
      },
      {
        id: 1,
        title: t("Presidential 1st round") + " - 2017"
      },
      {
        id: 2,
        title: t("Presidential 2nd round") + " - 2017"
      }
    ];

    this.setState({
      selectedOption: 5,
      selectedObj: variations[0],
      chartVariations: variations
    });
  }

  toggleChart(bool) {
    this.setState({
      log: bool
    });
  }

  handleChange(ev) {
    this.setState({ key: Math.random() });

    this.setState({
      selectedOption: ev.newValue,
      selectedObj: this.state.chartVariations[ev.newValue]
    });
  }

  render() {
    const { t, className, i18n, router } = this.props;
    const { geo, election_participation_by_territory } = this.context.data;
    const path = null;

    const locale = i18n.language;
    const classSvg = "participation-in-municipal-election";

    const data = election_participation_by_territory.data.filter(
      item => item["ID Comuna"] !== 345
    );

    let customTick = "";

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>
            {t("Electoral Participation")}
            <SourceTooltip cube="election_participation" />
          </span>
          <ExportLink path={path} className={classSvg} />
        </h3>
        {this.state.plot ? (
          <Plot
            className={classSvg}
            key={Math.random()}
            config={{
              aggs: {
                "ID Region": mean
              },
              height: 400,
              groupBy: ["Comuna"],
              data: data.reduce((all, item) => {
                if (
                  item["ID Election Type"] ==
                  parseInt(this.state.selectedOption)
                )
                  all.push({
                    ...item,
                    ElectorsLOG: Math.log10(item.Electors)
                  });
                return all;
              }, []),
              shapeConfig: {
                fill: d => {
                  if (geo.depth === 2) {
                    return geo.key === d["ID Comuna"] ? "#86396B" : "#CCC";
                  } else {
                    return regionsColorScale("c" + d["ID Region"]);
                  }
                }
              },
              on: {
                click: d => {
                  if (!(d["ID Country"] instanceof Array)) {
                    var url = slugifyItem(
                      "geo",
                      d["ID Region"],
                      d["Region"],
                      d["ID Comuna"] > 350 ? false : d["ID Comuna"],
                      d["Comuna"] > 350 ? false : d["Comuna"]
                    );
                    router.push(url);
                  }
                }
              },
              tooltipConfig: {
                title: d => d["Comuna"],
                body: d => {
                  const link =
                    d["ID Country"] instanceof Array
                      ? ""
                      : "<a>" + t("tooltip.to_profile") + "</a>";
                  return (
                    "<div>" +
                    t("Electors") +
                    ": " +
                    numeral(d["Electors"], locale).format("0,0") +
                    "</div>" +
                    "<div>" +
                    t("Votes") +
                    ": " +
                    numeral(d["Votes"], locale).format("0,0") +
                    "</div>" +
                    "<div>" +
                    t("Participation") +
                    ": " +
                    numeral(d["Participation"], locale).format("0.0%") +
                    "</div>" +
                    link
                  );
                }
              },
              legendTooltip: {
                title: d => {
                  if (geo.depth === 2) {
                    return d["Comuna"] instanceof Array
                      ? d["Region"]
                      : d["Comuna"];
                  } else {
                    return d["Region"];
                  }
                }
              },
              legendConfig: {
                label: false,
                shapeConfig: {
                  backgroundImage: d =>
                    "/images/legend/region/" + d["ID Region"] + ".png"
                }
              },
              y: "Participation",
              yConfig: {
                title: t("Participation"),
                tickFormat: tick =>
                  numeral(parseFloat(tick), locale).format("0%")
              },
              x: this.state.log ? "ElectorsLOG" : "Electors",
              xConfig: {
                title: t("Electors"),
                tickFormat: tick => {
                  let value = this.state.log
                    ? Math.pow(10, parseInt(tick))
                    : parseInt(tick);

                  let newTick = numeral(value, locale).format("0a");
                  if (newTick !== customTick) {
                    customTick = newTick;
                    return newTick;
                  } else {
                    return " ";
                  }
                }
              },
              x2Config: {
                barConfig: {
                  "stroke-width": 0
                }
              },
              size: "Votes"
            }}
          />
        ) : (
          <NoDataAvailable />
        )}


        <div className="viz-controls">
          {/* time range select */}
          <Select
            id="variations"
            options={this.state.chartVariations}
            value={this.state.selectedOption}
            labelField="title"
            valueField="id"
            onChange={this.handleChange}
          />

          {/* linear/log toggle */}
          <div className="btn-group">
            <button
              className={`btn font-xxs ${
                !this.state.log ? "is-active" : "is-inactive"
              }`}
              onClick={() => this.toggleChart(false)}
            >
              <span className="btn-icon pt-icon pt-icon-scatter-plot" />
              <span className="btn-text">{t("LINEAR")}</span>
            </button>
            <button
              className={`btn font-xxs ${
                this.state.log ? "is-active" : "is-inactive"
              }`}
              onClick={() => this.toggleChart(true)}
            >
              <span className="btn-icon pt-icon pt-icon-scatter-plot" />
              <span className="btn-text">LOG</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default translate()(ParticipationScatter);
