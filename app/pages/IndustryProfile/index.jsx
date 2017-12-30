import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonComponent, SectionColumns } from "datawheel-canon";
import { translate } from "react-i18next";
import Helmet from "react-helmet";

import d3plus from "helpers/d3plus";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, {
  getMemberQuery,
  levelCut,
  simpleDatumNeed
} from "helpers/MondrianClient";
import {
  getLevelObject,
  ingestParent,
  clearStoreData
} from "helpers/dataUtils";
import { sources } from "helpers/consts";

import orderBy from "lodash/orderBy";

import Nav from "components/Nav";
import DatachileLoading from "components/DatachileLoading";
import SvgImage from "components/SvgImage";
import Topic from "components/Topic";
import TopicMenu from "components/TopicMenu";

import FeaturedDatumSplash from "components/FeaturedDatumSplash";
import FeaturedMapSplash from "components/FeaturedMapSplash";

import EconomySlide from "./economy/EconomySlide";
import OutputByLocation from "./economy/charts/OutputByLocation";
import InvestmentByLocation from "./economy/charts/InvestmentByLocation";

import RDSlide from "./economy/RDSlide";
import RDByBusinessType from "./economy/charts/RDByBusinessType";
import RDByOwnershipType from "./economy/charts/RDByOwnershipType";

import OccupationSlide from "./employment/OccupationSlide";
import EmployedByCategory from "./employment/charts/EmployedByCategory";
import EmployedByEducation from "./employment/charts/EmployedByEducation";

import SalariesSlide from "./employment/SalariesSlide";

import "../intro.css";

class IndustryProfile extends Component {
  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  }

  static preneed = [clearStoreData];
  static need = [
    (params, store) => {
      var ids = getLevelObject(params);

      var prms = [
        getMemberQuery(
          "tax_data",
          "ISICrev4",
          "Level 1",
          ids.level1,
          store.i18n.locale
        )
      ];

      if (ids.level2) {
        prms.push(
          getMemberQuery(
            "tax_data",
            "ISICrev4",
            "Level 2",
            ids.level2,
            store.i18n.locale
          )
        );
      }

      var prm = Promise.all(prms).then(res => {
        return { key: "industry", data: ingestParent(res[0], res[1]) };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      var ids = getLevelObject(params);
      const level2 = ids.level2;
      ids.level2 = false;
      const prm = mondrianClient
        .cube("nene")
        .then(cube => {
          var q = levelCut(
            ids,
            "ISICrev4",
            "ISICrev4",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Date", "Month")
              .measure("Expansion factor")
              .measure("Expansion Factor Rank")
              .measure("Expansion Factor Decile"),
            "Level 1",
            "Level 2",
            store.i18n.locale
          );
          q.cut(`[Date].[Month].&[11]&[2016]`);

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          if (!res.data.data[0]["Expansion factor"]) {
            return false;
          } else {
            return {
              key: "employees_by_industry",
              data: {
                value: res.data.data[0]["Expansion factor"],
                decile: res.data.data[0]["Expansion Factor Decile"],
                rank: res.data.data[0]["Expansion Factor Rank"],
                total: 1,
                year: store.nene_month + "/" + store.nene_year
              }
            };
          }
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      var ids = getLevelObject(params);
      const prm = mondrianClient
        .cube("tax_data")
        .then(cube => {
          var q = levelCut(
            ids,
            "ISICrev4",
            "ISICrev4",
            cube.query
              .drilldown("Tax Geography", "Geography", "Region")
              .drilldown("Date", "Date", "Year")
              .measure("Output"),
            "Level 1",
            "Level 2",
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${sources.tax_data.last_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = orderBy(res.data.data, ["Output"], ["desc"]);
          const top_region = res.data.data[0] ? res.data.data[0] : false;
          return {
            key: "top_industry_output_by_region",
            data: {
              id: top_region ? top_region["ID Region"] : "",
              name: top_region ? top_region["Region"] : "",
              value: top_region ? top_region["Output"] : "",
              source: "Source Lorem",
              year: sources.tax_data.last_year
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      var ids = getLevelObject(params);
      const prm = mondrianClient
        .cube("tax_data")
        .then(cube => {
          var q;

          q = levelCut(
            { level1: ids.level1, level2: false },
            "ISICrev4",
            "ISICrev4",
            cube.query
              .option("parents", true)
              .drilldown("ISICrev4", "ISICrev4", "Level 2")
              .measure("Output"),
            "Level 1",
            "Level 2",
            store.i18n.locale,
            false
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "industry_list_detail",
            data: res.data.data
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },

    simpleDatumNeed(
      "datum_industry_occupation_total",
      "nene",
      ["Expansion factor"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        cuts: [`[Date].[Date].[Year].&[${sources.nene.last_year}]`],
        options: { parents: false }
      },
      "industry"
    ),
    simpleDatumNeed(
      "datum_industry_occupation_female_total",
      "nene",
      ["Expansion factor"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        cuts: [
          `[Date].[Date].[Year].&[${sources.nene.last_year}]`,
          "[Sex].[Sex].[Sex].&[1]"
        ],
        options: { parents: false }
      },
      "industry"
    ),

    EconomySlide,
    OutputByLocation,
    InvestmentByLocation,

    EmployedByCategory,
    EmployedByEducation,

    RDSlide,
    RDByOwnershipType,
    RDByBusinessType,

    OccupationSlide,
    SalariesSlide
  ];

  componentDidMount() {}

  render() {
    const { t, i18n } = this.props;

    const industry = this.props.data.industry;
    if (!industry) return null;
    const industryImg = industry
      ? industry.depth === 1 ? industry.key : industry.parent.key
      : "";

    const locale = i18n.language;

    const ids = getLevelObject(this.props.routeParams);

    const list = this.props.data.industry_list_detail;

    industry && ids && list
      ? list.map(c => {
          c.label = c["Level 2"];
          c.link = slugifyItem(
            "industries",
            c["ID Level 1"],
            c["Level 1"],
            c["ID Level 2"],
            c["Level 2"]
          );
          return c;
        })
      : [];

    const listTitle = ids
      ? ids.level2 ? t("Industries") : t("Industries")
      : "";

    const female_percent = this.props.data
      .datum_industry_occupation_female_total
      ? this.props.data.datum_industry_occupation_female_total /
        this.props.data.datum_industry_occupation_total
      : 0;

    const stats = {
      employees: this.props.data.employees_by_industry,
      region: this.props.data.top_industry_output_by_region,
      female: {
        value: female_percent,
        decile: female_percent * 10,
        name: "Female percent"
      }
    };

    console.log(this.props.data.datum_industry_occupation_female_total);

    const topics = [
      {
        slug: "about",
        title: t("About")
      },
      {
        slug: "economy",
        title: t("Economy")
      },
      {
        slug: "education",
        title: t("Employment")
      }
    ];

    return (
      <CanonComponent
        data={this.props.data}
        d3plus={d3plus}
        topics={topics}
        loadingComponent={<DatachileLoading />}
      >
        <Helmet>
          <title>{`${industry.caption}${
            industry.parent ? " (" + industry.parent.caption + ")" : ""
          }`}</title>
        </Helmet>
        <div className="profile">
          <div className="intro">
            {industry && (
              <Nav
                title={industry.caption}
                typeTitle={industry.parent ? t("Industry") : t("Industry Type")}
                type={"industries"}
                exploreLink={"/explore/industries"}
                ancestor={industry.parent ? industry.parent.caption : ""}
                ancestorLink={
                  industry.parent
                    ? slugifyItem(
                        "industries",
                        industry.parent.key,
                        industry.parent.name
                      )
                    : ""
                }
                topics={topics}
              />
            )}
            <div className="splash">
              <div
                className="image"
                style={{
                  backgroundImage: `url('/images/profile-bg/industry/${industryImg.toLowerCase()}.jpg')`
                }}
              />
              <div className="gradient" />
            </div>

            <div className="header">
              <div className="datum-full-width">
                {stats.employees && (
                  <FeaturedDatumSplash
                    title={t("Employees")}
                    icon="poblacion"
                    decile={stats.employees.decile}
                    datum={numeral(stats.employees.value, locale).format(
                      "(0,0)"
                    )}
                    source="nene"
                    className=""
                    level={industry.depth > 1 ? "industry_profile" : false}
                    name={industry.depth > 1 ? industry.parent : industry}
                  />
                )}

                {stats.female &&
                  female_percent > 0 && (
                    <FeaturedDatumSplash
                      title={t("Female percent in industry")}
                      icon="poblacion"
                      decile={stats.female.decile}
                      datum={numeral(stats.female.value, locale).format(
                        "(0.0 %)"
                      )}
                      source="nene"
                      className=""
                      level={industry.depth > 1 ? "industry_profile" : false}
                      name={industry.depth > 1 ? industry.parent : industry}
                    />
                  )}

                {stats.region && (
                  <FeaturedMapSplash
                    title={t("Top output region")}
                    type="region"
                    code={stats.region.id}
                    datum={stats.region.name}
                    subtitle={numeral(stats.region.value, locale).format(
                      "($ 0,0 a)"
                    )}
                    source="tax_data"
                    className=""
                  />
                )}
              </div>
            </div>

            <div className="topics-selector-container">
              <TopicMenu topics={topics} />
            </div>

            <div className="arrow-container">
              <a href="#about">
                <SvgImage src="/images/profile-icon/icon-arrow.svg" />
              </a>
            </div>
          </div>

          {/*<div className="topic-block" id="about">
            <div className="topic-header">
              <div className="topic-title">
                <h2 className="full-width">
                  {t("About")}
                  {obj && (
                    <span className="small">
                      <span className="pipe"> | </span>
                      {obj.caption}
                    </span>
                  )}
                </h2>
              </div>
              <div className="topic-go-to-targets">
                <div className="topic-slider-sections" />
              </div>
            </div>
            <div className="topic-slide-container">
              <div className="topic-slide-block">
                <div className="topic-slide-intro">
                  <div className="topic-slide-text">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                  <div className="topic-slide-text">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                  <div className="topic-slide-link-list">
                    <LinksList title={listTitle} list={list} />
                  </div>
                </div>
              </div>
            </div>
                </div>*/}
          <div className="topics-container">
            <Topic
              name={t("Economy")}
              id="economy"
              slider={false}
              sections={[
                {
                  name: t("Trade"),
                  slides: [t("Occupation")]
                }
              ]}
            >
              <div>
                <EconomySlide>
                  <SectionColumns>
                    <OutputByLocation className="lost-1-2" />
                    <InvestmentByLocation className="lost-1-2" />
                  </SectionColumns>
                </EconomySlide>
              </div>
              <div>
                <RDSlide>
                  <SectionColumns>
                    <RDByBusinessType className="lost-1-2" />
                    <RDByOwnershipType className="lost-1-2" />
                  </SectionColumns>
                </RDSlide>
              </div>
            </Topic>
            <Topic
              name={t("Employment")}
              id="education"
              slider={false}
              sections={[
                {
                  name: t("Summary"),
                  slides: [t("Occupation")]
                }
              ]}
            >
              <div>
                <OccupationSlide>
                  <SectionColumns>
                    <EmployedByEducation className="lost-1-2" />
                    <EmployedByCategory className="lost-1-2" />
                  </SectionColumns>
                </OccupationSlide>
              </div>
              {/*<div>
                <SalariesSlide>
                  <SectionColumns>
                    <Placeholder
                      className="lost-1-2"
                      text="Salaries By Sector"
                    />
                    <Placeholder
                      className="lost-1-2"
                      text="Salaries By Occupation"
                    />
                  </SectionColumns>
                </SalariesSlide>
              </div>*/}
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
      focus: state.focus,
      stats: state.stats
    }),
    {}
  )(IndustryProfile)
);
