import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { SectionColumns, CanonComponent } from "datawheel-canon";
import Nav from "components/Nav";

import SourceNote from "components/SourceNote";

import NavFixed from "components/NavFixed";
import d3plus from "helpers/d3plus";
import { Geomap } from "d3plus-react";
import SvgMap from "components/SvgMap";
import SvgImage from "components/SvgImage";
import { browserHistory } from "react-router";

import { Link } from "react-router";
import { slugifyItem } from "helpers/formatters";

import mondrianClient, { geoCut } from "helpers/MondrianClient";

import { getGeoObject } from "helpers/dataUtils";
import { translate } from "react-i18next";

/*Economy*/
import Economy from "./economy/Economy";

import IndustrySlide from "./economy/industry/IndustrySlide";
import OutputByIndustry from "./economy/industry/charts/OutputByIndustry";

import TradeSlide from "./economy/trade/TradeSlide";
import ExportsByProduct from "./economy/trade/charts/ExportsByProduct";
import ExportsByDestination from "./economy/trade/charts/ExportsByDestination";
import ImportsByOrigin from "./economy/trade/charts/ImportsByOrigin";
import TradeBalance from "./economy/trade/charts/TradeBalance";
/*end Economy*/

import "./intro.css";
import "./topics.css";

const topics = [
  {
    slug: "economy",
    title: "Economy"
  },
  {
    slug: "innovation",
    title: "Innovation"
  },
  {
    slug: "education",
    title: "Education"
  },
  {
    slug: "environment",
    title: "Environment"
  },
  {
    slug: "demographics",
    title: "Demographics"
  },
  {
    slug: "health",
    title: "Health"
  },
  {
    slug: "politics",
    title: "Politics"
  }
];

const Stat = props =>
  <div className="stat">
    <div className="label">
      {props.label}
    </div>
    <div className="value">
      {props.value}
    </div>
  </div>;

const chileObj = {
  name: "Chile",
  id: "chile"
};

class GeoProfile extends Component {
  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  }

  static need = [
    params => {
      const geoObj = getGeoObject(params);

      var prm;

      switch (geoObj.type) {
        case "country": {
          prm = new Promise((resolve, reject) => {
            resolve({ key: "geo", data: geoObj });
          });
          break;
        }
        case "region": {
          prm = mondrianClient
            .cube("exports")
            .then(cube => {
              return cube.dimensionsByName["Geography"].hierarchies[0].getLevel(
                "Region"
              );
            })
            .then(level => {
              return mondrianClient.member(level, geoObj.key);
            })
            .then(res => {
              return { key: "geo", data: res };
            });
          break;
        }
        case "comuna": {
          prm = mondrianClient
            .cube("exports")
            .then(cube => {
              return cube.dimensionsByName["Geography"].hierarchies[0].getLevel(
                "Comuna"
              );
            })
            .then(level => {
              return mondrianClient.member(level, geoObj.key);
            })
            .then(res => {
              return { key: "geo", data: res };
            });
          break;
        }
      }

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      console.log("store", store);
      const geo = getGeoObject(params);
      const prm = mondrianClient
        .cube("population_estimate")
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query.drilldown("Date", "Year").measure("Population"),
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${store.population_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "population",
            data: {
              value: res.data.data[0].Population,
              year: store.population_year,
              source: "INE projection"
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    Economy,
    IndustrySlide,
    OutputByIndustry,

    TradeSlide,
    ExportsByProduct,
    ExportsByDestination,
    ImportsByOrigin,
    TradeBalance
  ];

  componentDidMount() {
    //window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    /*if (!this.subLinks) return;

    const {activeSub, subnav} = this.state;
    const newSub = this.subLinks.getBoundingClientRect().top <= 0;

    let newActive = false;
    for (let i = 0; i < topics.length; i++) {
      const top = document.getElementById(topics[i].slug).getBoundingClientRect().top;
      if (top <= 0) newActive = topics[i].slug;
    }
    if (subnav !== newSub || newActive !== activeSub) {
      this.setState({activeSub: newActive, subnav: newSub});
    }*/
  }

  render() {
    const { focus, t } = this.props;

    const { subnav, activeSub } = this.state;

    const geoObj = getGeoObject(this.props.routeParams);

    const geo = this.props.data.geo;

    const ancestor =
      geo && geo.ancestors && geo.ancestors.length > 1
        ? geo.ancestors[0]
        : geoObj.type == "region" ? chileObj : false;

    console.log(this.props.data.population);

    const stats = {
      population: this.props.data.population,
      income: this.props.data.population,
      psu: this.props.data.population
    };

    var type = "";
    switch (geoObj.type) {
      case "country": {
        type = t("Country");
        break;
      }
      case "region": {
        type = t("Region");
        break;
      }
      case "comuna": {
        type = t("Comuna");
        break;
      }
    }

    function fillShape(d) {
      var c = "rgba(255, 255, 255, 0.75)";
      switch (geoObj.type) {
        case "country": {
          c = "rgba(255, 255, 255, 1)";
          break;
        }
        case "region": {
          if (parseInt(d.id) == parseInt(geoObj.key)) {
            c = "rgba(30,144,255,1)";
          }
          break;
        }
        case "comuna": {
          if (parseInt(d.id) == parseInt(ancestor.key)) {
            c = "rgba(30,144,255,1)";
          }
          break;
        }
      }

      return c;
    }

    return (
      <CanonComponent data={this.props.data} d3plus={d3plus}>
        <div className="profile">
          <div className="intro">
            <Nav
              title={geo.caption}
              type={geoObj.type}
              ancestor={ancestor}
              explore={"/explore/geo"}
            />
            <div className="splash">
              <div
                className="image"
                style={{
                  backgroundImage: `url('/images/profile-bg/${geoObj.image}')`
                }}
              />
              <div className="gradient" />
            </div>

            <div className="header">
              <div className="meta">
                {stats.population &&
                  <div className="stat-group">
                    <Stat
                      value={stats.population.value + " " + t("habitants")}
                      label={t("Population")}
                    />
                    <span className="source">
                      {stats.population.year} - {stats.population.source}
                    </span>
                  </div>}
                {stats.income &&
                  <div className="stat-group">
                    <Stat
                      value={"$" + stats.income.value}
                      label={t("Income")}
                    />
                    <span className="source">
                      {stats.income.year} - {stats.income.source}
                    </span>
                  </div>}
                {stats.psu &&
                  <div className="stat-group">
                    <Stat
                      value={stats.psu.value + " " + t("points")}
                      label={t("PSU")}
                    />
                    <span className="source">
                      {stats.psu.year} - {stats.psu.source}
                    </span>
                  </div>}
              </div>

              <div className="candidates">
                <p>cara de los candidatos</p>
              </div>

              <div className="map-comuna">
                {geoObj.type != "country" &&
                  <SvgMap
                    region={geoObj.type == "region" ? geo : ancestor}
                    active={geoObj.type == "comuna" ? geo : false}
                  />}
                <div className="map-region">
                  <Geomap
                    config={{
                      data: [],
                      downloadButton: false,
                      groupBy: "key",
                      height: 500,
                      label: d => "Región " + d.properties.Region,
                      legend: false,
                      ocean: "transparent",
                      on: {
                        "click.shape": function(d) {
                          browserHistory.push(
                            slugifyItem("geo", d.id, d.properties.Region)
                          );
                        }
                      },
                      padding: 10,
                      shapeConfig: {
                        hoverOpacity: 1,
                        Path: {
                          fill: fillShape,
                          stroke: "rgba(255, 255, 255, 1)"
                        }
                      },
                      tiles: false,
                      tooltipConfig: {
                        background: "white",
                        footer: "",
                        footerStyle: {
                          "margin-top": 0
                        },
                        padding: "12px",
                        body: d => `${d.properties.Region}`
                      },
                      topojson: "/geo/regiones.json",
                      topojsonId: "id",
                      topojsonKey: "regiones",
                      width: 200,
                      zoom: false
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Economy>
            <div>
              <TradeSlide>
                <SectionColumns>
                  <ExportsByProduct />
                  <ExportsByDestination />
                </SectionColumns>
                <SectionColumns>
                  <ImportsByOrigin />
                  <TradeBalance />
                </SectionColumns>
              </TradeSlide>
            </div>

            <div>
              <IndustrySlide>
                <SectionColumns>
                  <OutputByIndustry />
                </SectionColumns>
              </IndustrySlide>
            </div>
          </Economy>
        </div>
      </CanonComponent>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data,
      population_year: state.population_year
    }),
    {}
  )(GeoProfile)
);
