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

import "../intro.css";

class IndustryProfile extends Component {
  state = {
    subnav: false,
    activeSub: false
  };

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
        .cube("nene_quarter")
        .then(cube => {
          var q = levelCut(
            ids,
            "ISICrev4",
            "ISICrev4",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Date", "Moving Quarter")
              .measure("Expansion Factor Decile")
              .measure("Expansion Factor Rank")
              .measure("Expansion Factor Decile Number"),
            "Level 1",
            "Level 2",
            store.i18n.locale
          );
          q.cut(
            `[Date].[Date].[Moving Quarter].&[${sources.nene.last_quarter}]`
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          if (!res.data.data[0]["Expansion Factor Decile"]) {
            return false;
          } else {
            return {
              key: "employees_by_industry",
              data: {
                value: res.data.data[0]["Expansion Factor Decile"],
                decile: res.data.data[0]["Expansion Factor Decile Number"],
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
      "tax_data",
      ["Labour", "Production per worker"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        cuts: [`[Date].[Date].[Year].&[${sources.tax_data.last_year}]`],
        options: { parents: false }
      },
      "industry"
    ),

    EconomySlide,
    OutputByLocation,
    InvestmentByLocation,

    RDSlide,
    RDByOwnershipType,
    RDByBusinessType
  ];

  componentDidMount() {}

  render() {
    const { t, i18n, data, location } = this.props;

    const industry = data ? data.industry : null;

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

    const stats = {
      employees: this.props.data.datum_industry_occupation_total,
      region: this.props.data.top_industry_output_by_region
    };

    const topics = [
      {
        slug: "economy",
        title: t("Economy")
      },
      {
        slug: "opportunities",
        title: t("I+D")
      }
    ];

    const title = industry
      ? industry.caption +
        (industry.parent ? ` (${industry.parent.caption})` : "")
      : "";

    return (
      <CanonComponent
        data={this.props.data}
        d3plus={d3plus}
        topics={topics}
        loadingComponent={<DatachileLoading />}
      >
        <Helmet>
          {industry
            ? [
                <title>{title}</title>,
                <meta property="og:title" content={title + " - DataChile"} />,
                <meta
                  property="og:url"
                  content={`https://${locale}.datachile.io${location.pathname}`}
                />,
                <meta
                  property="og:image"
                  content={`https://${locale}.datachile.io/images/profile-bg/industry/${industryImg.toLowerCase()}.jpg`}
                />
              ]
            : null}
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
                {stats.employees &&
                  industry && (
                    <FeaturedDatumSplash
                      title={t("Employees")}
                      icon={null}
                      decile={null}
                      datum={numeral(stats.employees.data[0], locale).format(
                        "(0,0)"
                      )}
                      source="tax_data"
                      className=""
                      level={industry.depth > 1 ? "industry_profile" : false}
                      name={industry.depth > 1 ? industry.parent : industry}
                    />
                  )}

                {stats.employees &&
                  industry && (
                    <FeaturedDatumSplash
                      title={t("Production per worker")}
                      icon={null}
                      decile={null}
                      datum={numeral(stats.employees.data[1], locale).format(
                        "$ 0,0"
                      )}
                      source="tax_data"
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

          <div className="topics-container">
            <Topic
              name={t("Economy")}
              id="economy"
              slider={false}
              sections={[
                {
                  name: t("Trade"),
                  slides: [t("")]
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
            </Topic>
            <Topic
              name={t("I+D")}
              id="opportunities"
              slider={false}
              sections={[
                {
                  name: t("Summary"),
                  slides: [t("")]
                }
              ]}
            >
              <div>
                <RDSlide>
                  <SectionColumns>
                    <RDByBusinessType className="lost-1-2" />
                    <RDByOwnershipType className="lost-1-2" />
                  </SectionColumns>
                </RDSlide>
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
      focus: state.focus,
      stats: state.stats
    }),
    {}
  )(IndustryProfile)
);
