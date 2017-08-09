import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { SectionColumns, CanonComponent } from "datawheel-canon";

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
          return { key: "population", data: res.data.data[0].Population };
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

    const { subnav, activeSub, population_year } = this.state;

    const geoObj = getGeoObject(this.props.routeParams);

    const geo = this.props.data.geo;

    const ancestor =
      geo && geo.ancestors && geo.ancestors.length > 1
        ? geo.ancestors[0]
        : geoObj.type == "region" ? chileObj : false;

    const stats = {
      population: this.props.data.population,
      population_year: population_year,
      population_source: "INE projection",
      age_avg: "",
      income_avg: "",
      source: "INE Censo"
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
      var c = "rgba(255, 255, 255, 0.35)";
      switch (geoObj.type) {
        case "country": {
          c = "rgba(255, 255, 255, 0.5)";
          break;
        }
        case "region": {
          if (parseInt(d.id) == parseInt(geoObj.key)) {
            c = "rgba(255, 255, 255, 1)";
          }
          break;
        }
        case "comuna": {
          if (parseInt(d.id) == parseInt(ancestor.key)) {
            c = "rgba(255, 255, 255, 1)";
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
            <div className="splash">
              <div
                className="image"
                style={{
                  backgroundImage: `url('/images/profile-bg/${geoObj.image}')`
                }}
              />
              <div className="gradient" />
            </div>

            <div className="dc-container">
              <div className="header">
                <div className="meta">
                  {ancestor &&
                    <div className="parent">
                      <Link
                        className="link"
                        to={slugifyItem("geo", ancestor.key, ancestor.name)}>
                        {ancestor.name}
                      </Link>
                    </div>}
                  {geo &&
                    <div className="title">
                      {geo.caption}
                    </div>}
                  <div className="subtitle">
                    {geoObj.type}{" "}
                    <Link className="link" to="/explore/geo">
                      {t("Explore")}
                    </Link>
                  </div>
                  {stats.population &&
                    <div>
                      <Stat value={stats.population} label={t("Population")} />
                      <p>
                        {stats.population_year} - {stats.population_source}
                      </p>
                    </div>}
                  <Stat
                    value={"$" + stats.income_avg}
                    label={t("Average Household")}
                  />
                  <Stat
                    value={stats.age_avg + " " + t("years")}
                    label={t("Average age")}
                  />
                </div>

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
                          stroke: "rgba(255, 255, 255, 0.75)"
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
                <div className="map-comuna">
                  {geoObj.type != "country" &&
                    <SvgMap
                      region={geoObj.type == "region" ? geo : ancestor}
                      active={geoObj.type == "comuna" ? geo : false}
                    />}
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
