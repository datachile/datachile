import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { SectionColumns, CanonComponent } from "datawheel-canon";
import { Geomap } from "d3plus-react";
import { Link, browserHistory } from "react-router";
import { translate } from "react-i18next";

import d3plus from "helpers/d3plus";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";

import Nav from "components/Nav";
import NavFixed from "components/NavFixed";
import SourceNote from "components/SourceNote";
import FeaturedDatumSplash from "components/FeaturedDatumSplash";
import SvgMap from "components/SvgMap";
import SvgImage from "components/SvgImage";
import AuthoritiesBlock from "components/AuthoritiesBlock";
import TopicMenu from "components/TopicMenu";

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
      const geo = getGeoObject(params);
      const prm = mondrianClient
        .cube("population_estimate")
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .drilldown("Date", "Year")
              .measure("Number of records")
              .measure("Population")
              .measure("Population Rank")
              .measure("Population Rank Decile"),
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${store.population_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "population",
            data: {
              value: res.data.data[0]["Population"],
              decile: res.data.data[0]["Population Rank Decile"],
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
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient
        .cube("nesi_income")
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .drilldown("Date", "Year")
              .measure("Income")
              .measure("Median Income")
              .measure("Weighted Median Income Rank")
              .measure("Weighted Median Income Decile"),
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${store.income_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "income",
            data: {
              value: res.data.data[0]["Median Income"],
              decile: res.data.data[0]["Weighted Median Income Decile"],
              year: store.income_year,
              source: "NESI Survey"
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient
        .cube("psu")
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .drilldown("Date", "Year")
              .measure("Number of records")
              .measure("PSU Rank")
              .measure("PSU Average")
              .measure("PSU Rank Decile"),
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${store.psu_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "psu",
            data: {
              value: res.data.data[0]["PSU Average"],
              decile: res.data.data[0]["PSU Rank Decile"],
              year: store.psu_year,
              source: "PSU data"
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
    const { focus, t, i18n } = this.props;

    const { subnav, activeSub } = this.state;

    const geoObj = getGeoObject(this.props.routeParams);

    const geo = this.props.data.geo;

    const locale = i18n.language.split("-")[0];

    const ancestor =
      geo && geo.ancestors && geo.ancestors.length > 1
        ? geo.ancestors[0]
        : geoObj.type == "region" ? chileObj : false;

    const topics = [
      {
        slug: "economy",
        title: t("Economy")
      },
      {
        slug: "education",
        title: t("Education")
      },
      {
        slug: "environment",
        title: t("Environment")
      },
      {
        slug: "demographics",
        title: t("Demographics")
      },
      {
        slug: "health",
        title: t("Health")
      },
      {
        slug: "politics",
        title: t("Politics")
      }
    ];

    /*
    stats format
      {
        value: 200100,
        decile: 3.1,
        year: 2015,
        source: "NESI"
      }
    */
    const stats = {
      population: this.props.data.population,
      income: this.props.data.income,
      psu: this.props.data.psu
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
                  <FeaturedDatumSplash
                    title={t("Population")}
                    icon="poblacion"
                    decile={stats.population.decile}
                    datum={numeral(stats.population.value, locale).format(
                      "(0,0)"
                    )}
                    source={
                      stats.population.year + " - " + stats.population.source
                    }
                    className=""
                  />}
                {stats.income &&
                  <FeaturedDatumSplash
                    title={t("Income")}
                    icon="ingreso"
                    decile={stats.income.decile}
                    datum={numeral(stats.income.value, locale).format(
                      "($ 0,0)"
                    )}
                    source={stats.income.year + " - " + stats.income.source}
                    className=""
                  />}
                {stats.income &&
                  <FeaturedDatumSplash
                    title={t("PSU")}
                    icon="psu"
                    decile={9.2}
                    datum={
                      numeral(stats.psu.value, locale).format("(0,0)") + "pts"
                    }
                    source={stats.psu.year + " - " + stats.psu.source}
                    className=""
                  />}
              </div>

              <div className="candidates">
                <AuthoritiesBlock geo={geoObj} ancestor={ancestor} />
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

            <div className="topics-selector-container">
              <TopicMenu topics={topics} />
            </div>

            <div className="arrow-container">
              <a href="#economy">
                <SvgImage src="/images/profile-icon/icon-arrow.svg" />
              </a>
            </div>
          </div>

          <div className="topics-container">
            <Economy>
              <div>
                <TradeSlide>
                  <SectionColumns>
                    <ExportsByProduct className="lost-1-2" />
                    <ExportsByDestination className="lost-1-2" />
                  </SectionColumns>
                  <SectionColumns>
                    <ImportsByOrigin className="lost-1-2" />
                    <TradeBalance className="lost-1-2" />
                  </SectionColumns>
                </TradeSlide>
              </div>

              <div>
                <IndustrySlide>
                  <SectionColumns>
                    <OutputByIndustry className="lost-1-2" />
                  </SectionColumns>
                </IndustrySlide>
              </div>
            </Economy>
          </div>
        </div>
      </CanonComponent>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data,
      population_year: state.population_year,
      income_year: state.income_year,
      psu_year: state.psu_year
    }),
    {}
  )(GeoProfile)
);
