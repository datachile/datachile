import React, { Component } from "react";
import { connect } from "react-redux";
import { SectionColumns, CanonComponent } from "datawheel-canon";
import { Geomap } from "d3plus-react";
import { browserHistory } from "react-router";
import { translate } from "react-i18next";
import { selectAll } from "d3-selection";
import Helmet from "react-helmet";

import d3plus from "helpers/d3plus";
import { numeral, slugifyItem } from "helpers/formatters";
import { getGeoObject, clearStoreData } from "helpers/dataUtils";

// needs (data fetchers)
import {
  needGetGeo,
  needGetPopulationDatum,
  needGetIncomeDatum,
  needGetPSUDatum
} from "./index_needs";

import Nav from "components/Nav";
import DatachileLoading from "components/DatachileLoading";
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

import ProductSpaceSlide from "./economy/opportunity/ProductSpaceSlide";
import IndustrySpaceSlide from "./economy/opportunity/IndustrySpaceSlide";
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

/*end Economy*/

/*Education*/

import PSUNEMSlide from "./education/performance/PSUNEMSlide";
import PSUNEMScatter from "./education/performance/charts/PSUNEMScatter";

import EnrollmentSlide from "./education/enrollment/EnrollmentSlide";
import CollegeByEnrollment from "./education/enrollment/charts/CollegeByEnrollment";

import HigherEducationSlide from "./education/higher/HigherEducationSlide";
import PSUResultsBySex from "./education/higher/charts/PSUResultsBySex";
import PSUBySex from "./education/higher/charts/PSUBySex";

/*end Education*/

/* Housing and Environment */
import QualitySlide from "./environment/quality/QualitySlide";
import HousingType from "./environment/quality/charts/HousingType";
import HousingByConstructionType from "./environment/quality/charts/HousingByConstructionType";

import InternetAccessSlide from "./environment/conectivity/InternetAccessSlide";
import InternetAccessByZone from "./environment/conectivity/charts/InternetAccessByZone";

import DevicesSlide from "./environment/conectivity/DevicesSlide";
import Devices from "./environment/conectivity/charts/Devices";

import ServicesAccessSlide from "./environment/amenities/ServicesAccessSlide";
import Services from "./environment/amenities/charts/Services";

import CrimeSlide from "./environment/crime/CrimeSlide";
import CrimeTreemap from "./environment/crime/charts/CrimeTreemap";
import CrimeStacked from "./environment/crime/charts/CrimeStacked";

/* end Housing and Environment */

/*Demography*/
import MigrationSlide from "./demography/origins/MigrationSlide";
import MigrationByOrigin from "./demography/origins/charts/MigrationByOrigin";
import MigrationByEducation from "./demography/origins/charts/MigrationByEducation";

import MigrationDetailsSlide from "./demography/origins/MigrationDetailsSlide";
import MigrationBySex from "./demography/origins/charts/MigrationBySex";
import MigrationByAge from "./demography/origins/charts/MigrationByAge";

import MigrationActivitySlide from "./demography/origins/MigrationActivitySlide";
import MigrationByActivity from "./demography/origins/charts/MigrationByActivity";
import MigrationByVisa from "./demography/origins/charts/MigrationByVisa";

import PopulationSlide from "./demography/population/PopulationSlide";
import PopulationProjection from "./demography/population/charts/PopulationProjection";
import PopulationPyramid from "./demography/population/charts/PopulationPyramid";
/*end Demography*/

/* Health */
import AccessSlide from "./health/access/AccessSlide";
import HealthCareSlide from "./health/access/HealthCareSlide";
import HealthInsurance from "./health/access/charts/HealthInsurance";
import HealthCare from "./health/access/charts/HealthCare";

import DisabilitySlide from "./health/disability/DisabilitySlide";
import DisabilityBySex from "./health/disability/charts/DisabilityBySex";

import DeathCausesSlide from "./health/death/DeathCausesSlide";
import DeathCauses from "./health/death/charts/DeathCauses";
import DeathCausesStacked from "./health/death/charts/DeathCausesStacked";

/* end Health */

/** Politics */

//import ElectionSlide from "./politics/election/ElectionSlide";
//import MayorResults from "./politics/election/charts/MayorResults";

/** end Politics */

import "../intro.css";
import "../topics.css";

const chileObj = {
  key: "chile",
  name: "Chile",
  caption: "Chile"
};

class GeoProfile extends Component {
  static preneed = [clearStoreData];

  static need = [
    needGetGeo,
    needGetPopulationDatum,
    needGetIncomeDatum,
    needGetPSUDatum,

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

    ProductSpaceSlide,
    ProductSpace,

    IndustrySpaceSlide,
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

    IDSpendingIndustrySlide,
    SpendingByIndustry,
    SpendingBySector,

    QualitySlide,
    HousingType,
    HousingByConstructionType,

    InternetAccessSlide,
    InternetAccessByZone,

    DevicesSlide,
    Devices,

    ServicesAccessSlide,
    Services,

    CrimeSlide,
    CrimeStacked,
    CrimeTreemap,

    /** EDUCATION */
    PSUNEMSlide,
    PSUNEMScatter,

    EnrollmentSlide,
    CollegeByEnrollment,

    HigherEducationSlide,
    PSUResultsBySex,

    /** DEMOGRAPHY */

    MigrationSlide,
    MigrationByOrigin,
    MigrationByEducation,

    MigrationDetailsSlide,
    MigrationBySex,
    MigrationByAge,

    MigrationActivitySlide,
    MigrationByActivity,

    MigrationByVisa,

    PopulationSlide,
    PopulationProjection,
    PopulationPyramid,

    AccessSlide,
    HealthCareSlide,
    HealthInsurance,
    HealthCare,
    DisabilityBySex,
    DisabilitySlide,

    DeathCausesSlide,
    DeathCauses,
    DeathCausesStacked

    //ElectionSlide,
    //MayorResults
  ];

  render() {
    const { t, i18n } = this.props;

    const locale = i18n.language;

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
    if (
      geo &&
      geo.type == "country" &&
      stats.population &&
      stats.income &&
      stats.psu
    ) {
      stats.population.decile = 10;
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
        title: t("Housing")
      },
      {
        slug: "demography",
        title: t("Demography")
      },
      {
        slug: "health",
        title: t("Health")
      }
      /*{
        slug: "politics",
        title: t("Politics")
      }*/
    ];

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

    let title = "Chile";
    if (geo && geo.type === "region") {
      title = t("Region") + t(" of ") + geo.caption;
    } else if (geo && geoObj.type === "comuna") {
      title = t("Comuna") + t(" of ") + geo.caption + ` (${ancestor.caption})`;
    }

    return (
      <CanonComponent
        data={this.props.data}
        d3plus={d3plus}
        topics={topics}
        loadingComponent={<DatachileLoading />}
      >
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={title} />
        </Helmet>
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
                  backgroundImage: `url('${geoObj.image}')`
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
                    source="population_estimate"
                    className="population"
                  />
                )}
                {geo &&
                  stats.income && (
                    <FeaturedDatumSplash
                      title={t("Median Income")}
                      icon="ingreso"
                      decile={stats.income.value ? stats.income.decile : 0}
                      rank={
                        showRanking
                          ? numeral(stats.income.rank, locale).format("0o") +
                            " " +
                            t("of") +
                            " " +
                            stats.income.total
                          : false
                      }
                      datum={
                        stats.income.value
                          ? numeral(stats.income.value, locale).format(
                              "($ 0,0)"
                            )
                          : false
                      }
                      source="nesi_income"
                      className=""
                      level={geo.depth > 1 ? "geo_profile" : false}
                      name={geo.depth > 1 ? ancestor : geo}
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
                      numeral(
                        geoObj.type != "country" ? stats.psu.value : 500,
                        locale
                      ).format("(0,0)") + " psu"
                    }
                    source="psu"
                    className=""
                  />
                )}
              </div>

              <div className="candidates">
                <AuthoritiesBlock
                  geo={geoObj}
                  ancestor={ancestor}
                  data={this.props.data}
                />
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
                        { id: 1, name: "Tarapacá" },
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
                        { id: 13, name: "Metropolitana" },
                        { id: 14, name: "Los Ríos" },
                        { id: 15, name: "Arica y Parinacota" }
                      ],
                      id: "id",
                      downloadButton: false,
                      height: 500,
                      label: d => {
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
                  slides: [t("Industry Space"), t("Product Space")]
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
                  slides: [t("By Industry")]
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
                <IndustrySpaceSlide>
                  <SectionColumns>
                    <IndustrySpace className="lost-1" />
                  </SectionColumns>
                </IndustrySpaceSlide>
              </div>

              <div>
                <ProductSpaceSlide>
                  <SectionColumns>
                    <ProductSpace className="lost-1" />
                  </SectionColumns>
                </ProductSpaceSlide>
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
                <IncomeSexAgeSlide>
                  <SectionColumns>
                    <SalariesByOccupation className="lost-2-3" />
                    <SalariesByCategory className="lost-1-3" />
                  </SectionColumns>
                </IncomeSexAgeSlide>
              </div>

              <div>
                <IDSpendingIndustrySlide>
                  <SectionColumns>
                    <SpendingBySector className="lost-1-3" />
                    <SpendingByIndustry className="lost-2-3" />
                  </SectionColumns>
                </IDSpendingIndustrySlide>
              </div>
            </Topic>

            <Topic
              name={t("Education")}
              id="education"
              sections={[
                {
                  name: t("Performance"),
                  slides: [t("PSU vs NEM"), t("PSU By Sex")]
                },
                {
                  name: t("Enrollment"),
                  slides: [t("By School Type")]
                }
              ]}
            >
              <div>
                <PSUNEMSlide>
                  <SectionColumns>
                    <PSUNEMScatter className="lost-1" />
                  </SectionColumns>
                </PSUNEMSlide>
              </div>
              <div>
                <PSUNEMSlide>
                  <SectionColumns>
                    <PSUBySex className="lost-1-2" />
                    <PSUResultsBySex className="lost-1-2" />
                  </SectionColumns>
                </PSUNEMSlide>
              </div>
              <div>
                <EnrollmentSlide>
                  <SectionColumns>
                    <CollegeByEnrollment className="lost-1" />
                  </SectionColumns>
                </EnrollmentSlide>
              </div>
            </Topic>

            <Topic
              name={t("Housing")}
              id="environment"
              sections={[
                {
                  name: t("Security"),
                  slides: [t("Crimes")]
                },
                {
                  name: t("Amenities"),
                  slides: [t("Access to services")]
                },
                {
                  name: t("Quality"),
                  slides: [t("Housing Conditions")]
                },
                {
                  name: t("Connectivity"),
                  slides: [t("Devices")]
                }
              ]}
            >
              <div>
                <CrimeSlide>
                  <SectionColumns>
                    <CrimeTreemap className="lost-1-2" />
                    <CrimeStacked className="lost-1-2" />
                  </SectionColumns>
                </CrimeSlide>
              </div>
              <div>
                <ServicesAccessSlide>
                  <SectionColumns>
                    <Services className="lost-1" />
                  </SectionColumns>
                </ServicesAccessSlide>
              </div>
              <div>
                <QualitySlide>
                  <SectionColumns>
                    <HousingType className="lost-1-2" />
                    <HousingByConstructionType className="lost-1-2" />
                  </SectionColumns>
                </QualitySlide>
              </div>
              <div>
                <DevicesSlide>
                  <SectionColumns>
                    <Devices className="lost-1" />
                  </SectionColumns>
                </DevicesSlide>
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
                } /*
                       {
                       name: t("Diversity"),
                       slides: [t("By Sex & Age")]
                       },*/,
                {
                  name: t("Population"),
                  slides: [t("By Sex & Age")]
                } /*,
                       {
                       name: t("Ethnicity"),
                       slides: [t("By Sex & Age")]
                       }*/
              ]}
            >
              <div>
                <MigrationSlide>
                  <SectionColumns>
                    <MigrationByOrigin className="lost-1-2" />
                    <MigrationByEducation className="lost-1-2" />
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
                    <MigrationByActivity className="lost-1-2" />
                    <MigrationByVisa className="lost-1-2" />
                  </SectionColumns>
                </MigrationActivitySlide>
              </div>
              <div>
                <PopulationSlide>
                  <SectionColumns>
                    <PopulationPyramid className="lost-1-2" />
                    <PopulationProjection className="lost-1-2" />
                  </SectionColumns>
                </PopulationSlide>
              </div>
            </Topic>

            <Topic
              name={t("Health")}
              id="health"
              sections={[
                {
                  name: t("Healthcare"),
                  slides: [t("Health Insurance"), t("Healthcare")]
                },
                {
                  name: t("Disability"),
                  slides: [t("Disability")]
                },
                {
                  name: t("Death Causes"),
                  slides: [t("Death Causes")]
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
              <div>
                <HealthCareSlide>
                  <SectionColumns>
                    <HealthCare className="lost-1" />
                  </SectionColumns>
                </HealthCareSlide>
              </div>
              <div>
                <DisabilitySlide>
                  <SectionColumns>
                    <DisabilityBySex className="lost-1" />
                  </SectionColumns>
                </DisabilitySlide>
              </div>
              <div>
                <DeathCausesSlide>
                  <SectionColumns>
                    <DeathCauses className="lost-1-2" />
                    <DeathCausesStacked className="lost-1-2" />
                  </SectionColumns>
                </DeathCausesSlide>
              </div>
            </Topic>

            {/*<Topic
              name={t("Politics")}
              id="politics"
              sections={[
                {
                  name: t("Mayor Election"),
                  slides: [t("Results")]
                }
              ]}
            >
              <div>
                <ElectionSlide>
                  <SectionColumns>
                    <MayorResults className="lost-1" />
                  </SectionColumns>
                </ElectionSlide>
              </div>
            </Topic>*/}
          </div>
        </div>
      </CanonComponent>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(GeoProfile)
);
