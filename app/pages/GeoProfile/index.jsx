import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { SectionColumns, CanonComponent } from "datawheel-canon";
import { Geomap } from "d3plus-react";
import { Link, browserHistory } from "react-router";
import { translate } from "react-i18next";
import { selectAll } from "d3-selection";

import d3plus from "helpers/d3plus";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";

import Nav from "components/Nav";
import SourceNote from "components/SourceNote";
import FeaturedDatumSplash from "components/FeaturedDatumSplash";
import SvgMap from "components/SvgMap";
import SvgImage from "components/SvgImage";
import AuthoritiesBlock from "components/AuthoritiesBlock";
import TopicMenu from "components/TopicMenu";
import Topic from "components/Topic";

import Placeholder from "components/Placeholder";

/*Economy*/
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

import EnrollmentSlide from "./education/enrollment/EnrollmentSlide";
import CollegeByEnrollment from "./education/enrollment/charts/CollegeByEnrollment";

import PerformanceSlide from "./education/performance/PerformanceSlide";
import PerformanceByType from "./education/performance/charts/PerformanceByType";
/*end Education*/

/* Housing and Environment */
import QualitySlide from "./environment/quality/QualitySlide";
import HousingType from "./environment/quality/charts/HousingType";

import InternetAccessSlide from "./environment/conectivity/InternetAccessSlide";
import InternetAccessByZone from "./environment/conectivity/charts/InternetAccessByZone";

import DevicesSlide from "./environment/conectivity/DevicesSlide";
import Devices from "./environment/conectivity/charts/Devices";

import InternetUseSlide from "./environment/conectivity/InternetUseSlide";
/* end Housing and Environment */

/*Demography*/
import MigrationSlide from "./demography/origins/MigrationSlide";
import MigrationByOrigin from "./demography/origins/charts/MigrationByOrigin";

import MigrationDetailsSlide from "./demography/origins/MigrationDetailsSlide";
import MigrationBySex from "./demography/origins/charts/MigrationBySex";
import MigrationByAge from "./demography/origins/charts/MigrationByAge";

import MigrationActivitySlide from "./demography/origins/MigrationActivitySlide";
import MigrationByActivity from "./demography/origins/charts/MigrationByActivity";
import MigrationByVisa from "./demography/origins/charts/MigrationByVisa";

/*end Demography*/

/* Health */
import AccessSlide from "./health/access/AccessSlide";
import HealthInsurance from "./health/access/charts/HealthInsurance";

/* end Health */

import "../intro.css";
import "../topics.css";

const chileObj = {
  key: "chile",
  name: "Chile",
  caption: "Chile"
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
              .measure("Population Rank Total")
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
              rank: res.data.data[0]["Population Rank"],
              total: res.data.data[0]["Population Rank Total"],
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
              .measure("Weighted Median Income Decile")
              .measure("Weighted Median Income Total"),
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
              rank: res.data.data[0]["Weighted Median Income Rank"],
              total: res.data.data[0]["Weighted Median Income Total"],
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
              .measure("PSU Rank Decile")
              .measure("PSU Rank Total"),
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
              rank: res.data.data[0]["PSU Rank"],
              total: res.data.data[0]["PSU Rank Total"],
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

    /*Economy,*/

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

    QualitySlide,
    HousingType,

    InternetAccessSlide,
    InternetAccessByZone,

    DevicesSlide,
    Devices,

    InternetUseSlide,

    PerformanceSlide,
    PerformanceByType,

    EnrollmentSlide,
    CollegeByEnrollment,

    MigrationSlide,
    MigrationByOrigin,

    MigrationDetailsSlide,
    MigrationBySex,
    MigrationByAge,

    MigrationActivitySlide,
    MigrationByActivity,

    MigrationByVisa,

    AccessSlide,
    HealthInsurance
  ];

  render() {
    const { focus, t, i18n } = this.props;
    const { subnav, activeSub } = this.state;
    const locale = i18n.language.split("-")[0];
    const geoObj = getGeoObject(this.props.routeParams);
    const showRanking = geoObj.type == "country" ? false : true;
    const geo = this.props.data.geo;

    if (geo) {
      this.props.data.geo.type = geoObj.type;
      this.props.data.geo.ancestor = ancestor;
    }

    const ancestor =
      geo && geo.ancestors && geo.ancestors.length > 1
        ? geo.ancestors[0]
        : geoObj.type == "region" ? chileObj : false;

    /*
    stats format
      {
        value: 200100,
        decile: 3.1,
        rank: 3,
        total: 13
        year: 2015,
        source: "NESI"
      }
    */

    var stats = {
      population: this.props.data.population,
      income: this.props.data.income,
      psu: this.props.data.psu
    };

    //national
    if (geo && geo.type == "country") {
      stats.income.decile = 5;
      stats.psu.decile = 5;
    }

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
      var c = "rgba(255, 255, 255, 0.7)";
      switch (geoObj.type) {
        case "country": {
          c = "rgba(255, 255, 255, 1)";
          break;
        }
        case "region": {
          if (parseInt(d.id) == parseInt(geoObj.key)) {
            c = "rgba(75, 113, 181,1)";
          }
          break;
        }
        case "comuna": {
          if (parseInt(d.id) == parseInt(ancestor.key)) {
            c = "rgba(75, 113, 181,1)";
          }
          break;
        }
      }

      return c;
    }

    return (
      <CanonComponent data={this.props.data} d3plus={d3plus} topics={topics}>
        <div className="profile">
          <div className="intro">
            {geo &&
              geoObj && (
                <Nav
                  title={geo.caption}
                  typeTitle={geoObj.type}
                  type={"geo"}
                  exploreLink={"/explore/geo"}
                  ancestor={ancestor ? ancestor.caption : ""}
                  ancestorLink={slugifyItem(
                    "geo",
                    ancestor ? ancestor.key : "",
                    ancestor ? ancestor.name : ""
                  )}
                  topics={topics}
                />
              )}
            <div className="splash">
              <div
                className="image"
                style={{
                  backgroundImage: `url('/images/profile-bg/geo/${geoObj.image}')`
                }}
              />
              <div className="gradient" />
            </div>

            <div className="header">
              <div className="meta">
                {stats.population && (
                  <FeaturedDatumSplash
                    title={t("Population")}
                    icon="poblacion"
                    decile={stats.population.decile}
                    rank={
                      showRanking
                        ? numeral(stats.population.rank, locale).format("0o") +
                          " " +
                          t("of") +
                          " " +
                          stats.population.total
                        : false
                    }
                    datum={numeral(stats.population.value, locale).format(
                      "(0,0)"
                    )}
                    source={
                      stats.population.year + " - " + stats.population.source
                    }
                    className=""
                  />
                )}
                {stats.income && (
                  <FeaturedDatumSplash
                    title={t("Income")}
                    icon="ingreso"
                    decile={stats.income.decile}
                    rank={
                      showRanking
                        ? numeral(stats.income.rank, locale).format("0o") +
                          " " +
                          t("of") +
                          " " +
                          stats.income.total
                        : false
                    }
                    datum={numeral(stats.income.value, locale).format(
                      "($ 0,0)"
                    )}
                    source={stats.income.year + " - " + stats.income.source}
                    className=""
                  />
                )}
                {stats.psu && (
                  <FeaturedDatumSplash
                    title={t("Education")}
                    icon="psu"
                    decile={stats.psu.decile}
                    rank={
                      showRanking
                        ? numeral(stats.psu.rank, locale).format("0o") +
                          " " +
                          t("of") +
                          " " +
                          stats.psu.total
                        : false
                    }
                    datum={
                      numeral(stats.psu.value, locale).format("(0,0)") + " psu"
                    }
                    source={stats.psu.year + " - " + stats.psu.source}
                    className=""
                  />
                )}
              </div>

              <div className="candidates">
                <AuthoritiesBlock geo={geoObj} ancestor={ancestor} />
              </div>

              <div className="map-comuna">
                {geoObj.type != "country" && (
                  <SvgMap
                    region={geoObj.type == "region" ? geo : ancestor}
                    active={geoObj.type == "comuna" ? geo : false}
                  />
                )}
                <div className="map-region">
                  <Geomap
                    config={{
                      data: [
                        { id: 1, name: "Arica y Parinacota" },
                        { id: 2, name: "Antofagasta" },
                        { id: 3, name: "Atacama" },
                        { id: 4, name: "Coquimbo" },
                        { id: 5, name: "Valparaíso" },
                        { id: 6, name: "O'Higgins" },
                        { id: 7, name: "Maule" },
                        { id: 8, name: "BíoBío" },
                        { id: 9, name: "Araucanía" },
                        { id: 10, name: "Los Lagos" },
                        { id: 11, name: "Aisén" },
                        { id: 12, name: "Magallanes" },
                        { id: 13, name: "Región Metropolitana" },
                        { id: 14, name: "Los Ríos" },
                        { id: 15, name: "pepe" }
                      ],
                      id: "id",
                      downloadButton: false,
                      height: 500,
                      label: d => {
                        console.log(d);
                        return "label";
                      },
                      legend: false,
                      ocean: "transparent",
                      on: {
                        "click.shape": function(d) {
                          selectAll(".d3plus-tooltip").style(
                            "transform",
                            "scale(0)"
                          );
                          browserHistory.push(slugifyItem("geo", d.id, d.name));
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
                        title: "",
                        body: d => {
                          return (
                            "Región " +
                            d.name +
                            "<br/><a>" +
                            t("tooltip.to_profile") +
                            "</a>"
                          );
                        },
                        bodyStyle: {
                          "font-family": "'Yantramanav', sans-serif",
                          "font-size": "12px",
                          "text-align": "center",
                          color: "#2F2F38"
                        },
                        footer: "",
                        background: "white",
                        footerStyle: {
                          "margin-top": 0
                        },
                        padding: "10px",
                        borderRadius: "0px",
                        border: "1px solid #2F2F38"
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
            <Topic
              name={t("Economy")}
              id="economy"
              sections={[
                {
                  name: t("Trade"),
                  slides: [t("International trade")]
                },
                {
                  name: t("Industry"),
                  slides: [t("Industry & Occupations")]
                },
                {
                  name: t("Opportunity"),
                  slides: [t("Opportunities")]
                },
                {
                  name: t("Employment"),
                  slides: [t("By Sex & Education Level")]
                },
                {
                  name: t("Income"),
                  slides: [t("By Sex & Age"), t("By Occupation")]
                },
                {
                  name: t("Innovation"),
                  slides: [
                    t("By Industry"),
                    t("By Funding & Area"),
                    t("By Staff"),
                    t("By Type"),
                    t("By Sector")
                  ]
                }
              ]}
            >
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
                    {/* 
                      <IndustrySpace className="lost-1-2" />
                      <ProductSpace className="lost-1-2" />
                    */}
                    <Placeholder className="lost-1-2" text="Industry Space" />
                    <Placeholder className="lost-1-2" text="Product Space" />
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
                    {/*
                    <SpendingByFundingSource className="lost-1-2" />
                    <SpendingByArea className="lost-1-2" />
                    */}
                    <Placeholder
                      className="lost-1-2"
                      text="RD - By Funding Source"
                    />
                    <Placeholder
                      className="lost-1-2"
                      text="RD - By Knowledge Area"
                    />
                  </SectionColumns>
                </IDSpendingCategorySlide>
              </div>

              <div>
                <IDStaffSlide>
                  <SectionColumns>
                    {/*
                    <StaffByOccupation className="lost-1-2" />
                    <StaffBySex className="lost-1-2" />
                     */}
                    <Placeholder
                      className="lost-1-2"
                      text="RD - By Occupation"
                    />
                    <Placeholder className="lost-1-2" text="RD - By Sex" />
                  </SectionColumns>
                </IDStaffSlide>
              </div>

              <div>
                <InnovationCompanySlide>
                  <SectionColumns>
                    {/*
                    <InnovationRate className="lost-2-3" />
                    <InnovationByType className="lost-1-3" />
                    */}
                    <Placeholder
                      className="lost-1-2"
                      text="RD - Innovation Rate"
                    />
                    <Placeholder
                      className="lost-1-2"
                      text="RD - Innovation Type"
                    />
                  </SectionColumns>
                </InnovationCompanySlide>
              </div>

              <div>
                <CompanyInnovationSlide>
                  <SectionColumns>
                    {/*
                    <InnovationBySize className="lost-2-3" />
                    <InnovationByActivity className="lost-1-3" />
                    */}
                    <Placeholder className="lost-1-2" text="RD - by Size" />
                    <Placeholder className="lost-1-2" text="RD - by Activity" />
                  </SectionColumns>
                </CompanyInnovationSlide>
              </div>
            </Topic>

            <Topic
              name={t("Education")}
              id="education"
              sections={[
                {
                  name: t("Enrollment"),
                  slides: [t("By School Type")]
                },
                {
                  name: t("Performance"),
                  slides: [t("By School Type")]
                }
              ]}
            >
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
                    {/* <PerformanceByType className="lost-1" /> */}
                    <Placeholder className="lost-1" text="Performance" />
                  </SectionColumns>
                </PerformanceSlide>
              </div>
            </Topic>

            <Topic
              name={t("Housing and Environment")}
              id="environment"
              sections={[
                {
                  name: t("Quality"),
                  slides: [t("Housing Conditions")]
                },
                {
                  name: t("Connectivity"),
                  slides: [
                    t("Internet access"),
                    t("Devices"),
                    t("Internet use")
                  ]
                },
                {
                  name: t("Ammenities"),
                  slides: [t("Access to services")]
                }
              ]}
            >
              <div>
                <QualitySlide>
                  <SectionColumns>
                    <HousingType className="lost-1-2" />
                    <Placeholder className="lost-1-2" text="Materials" />
                  </SectionColumns>
                </QualitySlide>
              </div>
              <div>
                <InternetAccessSlide>
                  <SectionColumns>
                    <InternetAccessByZone className="lost-1-2" />
                    <Placeholder
                      className="lost-1-2"
                      text="Internet Access Type"
                    />
                  </SectionColumns>
                </InternetAccessSlide>
              </div>
              <div>
                <DevicesSlide>
                  <SectionColumns>
                    <Devices className="lost-1" />
                  </SectionColumns>
                </DevicesSlide>
              </div>
              <div>
                <InternetUseSlide>
                  <SectionColumns>
                    <Placeholder
                      className="lost-1-2"
                      text="Internet purposes"
                    />
                    <Placeholder className="lost-1-2" text="Internet uses" />
                  </SectionColumns>
                </InternetUseSlide>
              </div>
            </Topic>

            <Topic
              name={t("Demography")}
              id="demography"
              sections={[
                {
                  name: t("Origins"),
                  slides: [
                    t("By Origin Country"),
                    t("By Sex & Age"),
                    t("By Activity & Visa Type")
                  ]
                },
                {
                  name: t("Diversity"),
                  slides: [t("By Sex & Age")]
                },
                {
                  name: t("Population"),
                  slides: [t("By Sex & Age")]
                },
                {
                  name: t("Ethnicity"),
                  slides: [t("By Sex & Age")]
                }
              ]}
            >
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
            </Topic>

            <Topic
              name={t("Health")}
              id="health"
              sections={[
                {
                  name: t("Social Security"),
                  slides: [t("Social Security")]
                },
                {
                  name: t("Disability"),
                  slides: [t("Disability")]
                }
              ]}
            >
              <div>
                <AccessSlide>
                  <SectionColumns>
                    <HealthInsurance className="lost-1" />
                  </SectionColumns>
                </AccessSlide>
              </div>
            </Topic>
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
