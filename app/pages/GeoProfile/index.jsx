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

import TradeSlide from "./economy/trade/TradeSlide";
import ExportsByProduct from "./economy/trade/charts/ExportsByProduct";
import ExportsByDestination from "./economy/trade/charts/ExportsByDestination";
import ImportsByOrigin from "./economy/trade/charts/ImportsByOrigin";
import ImportsByProduct from "./economy/trade/charts/ImportsByProduct";
import TradeBalance from "./economy/trade/charts/TradeBalance";

import IndustrySlide from "./economy/industry/IndustrySlide";
import IndustryBySector from "./economy/industry/charts/IndustryBySector";
import IndustryByOccupation from "./economy/industry/charts/IndustryByOccupation";

import OpportunitySlide from "./economy/opportunity/OpportunitySlide";
import ProductSpace from "./economy/opportunity/charts/ProductSpace";
import IndustrySpace from "./economy/opportunity/charts/IndustrySpace";

import EmploymentSlide from "./economy/employment/EmploymentSlide";
import EmploymentBySex from "./economy/employment/charts/EmploymentBySex";
import EmploymentByLevel from "./economy/employment/charts/EmploymentByLevel";

import IncomeSexAgeSlide from "./economy/income/IncomeSexAgeSlide";
import IncomeByAge from "./economy/income/charts/IncomeByAge";
import IncomeBySex from "./economy/income/charts/IncomeBySex";

import IncomeOccupationSlide from "./economy/income/IncomeOccupationSlide";
import SalariesByOccupation from "./economy/income/charts/SalariesByOccupation";
import SalariesByCategory from "./economy/income/charts/SalariesByCategory";

import IDSpendingIndustrySlide from "./economy/innovation/IDSpendingIndustrySlide";
import SpendingBySector from "./economy/innovation/charts/SpendingBySector";
import SpendingByIndustry from "./economy/innovation/charts/SpendingByIndustry";

import IDSpendingCategorySlide from "./economy/innovation/IDSpendingCategorySlide";
import SpendingByArea from "./economy/innovation/charts/SpendingByArea";
import SpendingByFundingSource from "./economy/innovation/charts/SpendingByFundingSource";

import IDStaffSlide from "./economy/innovation/IDStaffSlide";
import StaffByOccupation from "./economy/innovation/charts/StaffByOccupation";
import StaffBySex from "./economy/innovation/charts/StaffBySex";

import CompanyInnovationSlide from "./economy/innovation/CompanyInnovationSlide";
import InnovationRate from "./economy/innovation/charts/InnovationRate";
import InnovationByType from "./economy/innovation/charts/InnovationByType";


import InnovationCompanySlide from "./economy/innovation/InnovationCompanySlide";
import InnovationBySize from "./economy/innovation/charts/InnovationBySize";
import InnovationByActivity from "./economy/innovation/charts/InnovationByActivity";

/*end Economy*/

/*Education*/
import Education from "./education/Education";

import EnrollmentSlide from "./education/enrollment/EnrollmentSlide";
import CollegeByEnrollment from "./education/enrollment/charts/CollegeByEnrollment";

import PerformanceSlide from "./education/performance/PerformanceSlide";
import PerformanceByType from "./education/performance/charts/PerformanceByType";
/*end Education*/

/*Demography*/
import Demography from "./demography/Demography";

import MigrationSlide from "./demography/origins/MigrationSlide";
import MigrationByOrigin from "./demography/origins/charts/MigrationByOrigin";

import MigrationDetailsSlide from "./demography/origins/MigrationDetailsSlide";
import MigrationBySex from "./demography/origins/charts/MigrationBySex";
import MigrationByAge from "./demography/origins/charts/MigrationByAge";

import MigrationActivitySlide from "./demography/origins/MigrationActivitySlide";
import MigrationByActivity from "./demography/origins/charts/MigrationByActivity";
import MigrationByVisa from "./demography/origins/charts/MigrationByVisa";

/*end Demography*/

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
    AuthoritiesBlock,

    Economy,

    IndustrySlide,
    IndustryBySector,
    IndustryByOccupation,

    TradeSlide,
    ExportsByProduct,
    ExportsByDestination,
    ImportsByOrigin,
    ImportsByProduct,
    TradeBalance,

    OpportunitySlide,
    ProductSpace,
    IndustrySpace,

    EmploymentSlide,
    EmploymentByLevel,
    EmploymentBySex,

    IncomeSexAgeSlide,
    IncomeByAge,
    IncomeBySex,

    IncomeOccupationSlide,
    SalariesByCategory,
    SalariesByOccupation,

    IDSpendingCategorySlide,
    SpendingByIndustry,
    SpendingBySector,

    IDSpendingIndustrySlide,
    SpendingByArea,
    SpendingByFundingSource,

    IDStaffSlide,
    StaffByOccupation,
    StaffBySex,

    InnovationCompanySlide,
    InnovationRate,
    InnovationByType,

    CompanyInnovationSlide,
    InnovationBySize,
    InnovationByActivity,

    Education,

    PerformanceSlide,
    PerformanceByType,

    EnrollmentSlide,
    CollegeByEnrollment,

    Demography,

    MigrationSlide,
    MigrationByOrigin,

    MigrationDetailsSlide,
    MigrationBySex,
    MigrationByAge,

    MigrationActivitySlide,
    MigrationByActivity,
    MigrationByVisa
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
    
    const ancestor =
      geo && geo.ancestors && geo.ancestors.length > 1
        ? geo.ancestors[0]
        : geoObj.type == "region" ? chileObj : false;
    
    if(geo){
      this.props.data.geo.type = geoObj.type;
      this.props.data.geo.ancestor = ancestor;
    }

    const locale = i18n.language.split("-")[0];


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
        slug: "demography",
        title: t("Demography")
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
            {geo &&
              geoObj &&
              <Nav
                title={geo.caption}
                type={geoObj.type}
                exploreLink={"/explore/geo"}
                ancestor={ancestor ? ancestor.caption : ""}
                ancestorLink={slugifyItem(
                  "geo",
                  ancestor ? ancestor.key : "",
                  ancestor ? ancestor.name : ""
                )}
              />}
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
                {stats.psu &&
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
                  ></Geomap>
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
                <TradeSlide TradeBalance={TradeBalance}>
                  <SectionColumns>
                    <ExportsByDestination className="lost-1-2" />
                    <ExportsByProduct className="lost-1-2" />
                  </SectionColumns>
                  <SectionColumns>
                    <ImportsByOrigin className="lost-1-2" />
                    <ImportsByProduct className="lost-1-2" />
                  </SectionColumns>
                </TradeSlide>
              </div>

              <div>
                <IndustrySlide>
                  <SectionColumns>
                    <IndustryBySector className="lost-1-2" />
                    <IndustryByOccupation className="lost-1-2" />
                  </SectionColumns>
                </IndustrySlide>
              </div>

              <div>
                <OpportunitySlide>
                  <SectionColumns>
                    <IndustrySpace className="lost-1-2" />
                    <ProductSpace className="lost-1-2" />
                  </SectionColumns>
                </OpportunitySlide>
              </div>

              <div>
                <EmploymentSlide>
                  <SectionColumns>
                    <EmploymentBySex className="lost-2-3" />
                    <EmploymentByLevel className="lost-1-3" />
                  </SectionColumns>
                </EmploymentSlide>
              </div>

              <div>
                <IncomeSexAgeSlide>
                  <SectionColumns>
                    <IncomeBySex className="lost-1-2" />
                    <IncomeByAge className="lost-1-2" />
                  </SectionColumns>
                </IncomeSexAgeSlide>
              </div>

              <div>
                <IncomeOccupationSlide>
                  <SectionColumns>
                    <SalariesByOccupation className="lost-2-3" />
                    <SalariesByCategory className="lost-1-3" />
                  </SectionColumns>
                </IncomeOccupationSlide>
              </div>

              <div>
                <IDSpendingIndustrySlide>
                  <SectionColumns>
                    <SpendingBySector className="lost-1-3" />
                    <SpendingByIndustry className="lost-2-3" />
                  </SectionColumns>
                </IDSpendingIndustrySlide>
              </div>

              <div>
                <IDSpendingCategorySlide>
                  <SectionColumns>
                    <SpendingByFundingSource className="lost-1-2" />
                    <SpendingByArea className="lost-1-2" />
                  </SectionColumns>
                </IDSpendingCategorySlide>
              </div>

              <div>
                <IDStaffSlide>
                  <SectionColumns>
                    <StaffByOccupation className="lost-1-2" />
                    <StaffBySex className="lost-1-2" />
                  </SectionColumns>
                </IDStaffSlide>
              </div>

              <div>
                <InnovationCompanySlide>
                  <SectionColumns>
                    <InnovationRate className="lost-2-3" />
                    <InnovationByType className="lost-1-3" />
                  </SectionColumns>
                </InnovationCompanySlide>
              </div>

              <div>
                <CompanyInnovationSlide>
                  <SectionColumns>
                    <InnovationBySize className="lost-2-3" />
                    <InnovationByActivity className="lost-1-3" />
                  </SectionColumns>
                </CompanyInnovationSlide>
              </div>
            </Economy>

            <Education>
              <div>
                <EnrollmentSlide>
                  <SectionColumns>
                    <CollegeByEnrollment className="lost-1" />
                  </SectionColumns>
                </EnrollmentSlide>
              </div>
              <div>
                <PerformanceSlide>
                  <SectionColumns>
                    <PerformanceByType className="lost-1" />
                  </SectionColumns>
                </PerformanceSlide>
              </div>
            </Education>

            <Demography>
              <div>
                <MigrationSlide>
                  <SectionColumns>
                    <MigrationByOrigin className="lost-1" />
                  </SectionColumns>
                </MigrationSlide>
              </div>
              <div>
                <MigrationDetailsSlide>
                  <SectionColumns>
                    <MigrationBySex className="lost-1-2" />
                    <MigrationByAge className="lost-1-2" />
                  </SectionColumns>
                </MigrationDetailsSlide>
              </div>
              <div>
                <MigrationActivitySlide>
                  <SectionColumns>
                    <MigrationByActivity className="lost-2-3" />
                    <MigrationByVisa className="lost-1-3" />
                  </SectionColumns>
                </MigrationActivitySlide>
              </div>
            </Demography>

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
