import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { SectionColumns, CanonComponent } from "datawheel-canon";
import { Link } from "react-router";
import { browserHistory } from "react-router";
import { translate } from "react-i18next";

import d3plus from "helpers/d3plus";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, {
  getMembersQuery,
  getMemberQuery,
  levelCut
} from "helpers/MondrianClient";
import { getLevelObject, ingestParent } from "helpers/dataUtils";

import Topic from "components/Topic";

import Nav from "components/Nav";
import SvgImage from "components/SvgImage";
import TopicMenu from "components/TopicMenu";
import FeaturedDatumSplash from "components/FeaturedDatumSplash";
import LinksList from "components/LinksList";

import InternationalTrade from "./InternationalTrade/InternationalTrade";
import InternationalTradeSlide from "./InternationalTrade/InternationalTradeSlide";
import ExportsByProduct from "./InternationalTrade/charts/ExportsByProduct";
import ImportsByProduct from "./InternationalTrade/charts/ImportsByProduct";
import TradeBalance from "./InternationalTrade/charts/TradeBalance";

/* BEGIN DEMOGRAPHY */
import MigrationSlide from "./demography/MigrationSlide";
import MigrationDetailsSlide from "./demography/MigrationDetailsSlide";
import MigrationActivitySlide from "./demography/MigrationActivitySlide";

import MigrationByActivity from "./demography/charts/MigrationByActivity";
import MigrationByAge from "./demography/charts/MigrationByAge";
import MigrationByRegion from "./demography/charts/MigrationByRegion";
import MigrationBySex from "./demography/charts/MigrationBySex";
import MigrationByVisa from "./demography/charts/MigrationByVisa";

/* END DEMOGRAPHY */

import "../intro.css";
import "../topics.css";

class CountryProfile extends Component {
  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  }

  static need = [
    (params, store) => {
      var ids = getLevelObject(params);

      var prms = [
        getMemberQuery(
          "exports",
          "Destination Country",
          "Subregion",
          ids.level1,
          store.i18n.locale
        )
      ];

      if (ids.level2) {
        prms.push(
          getMemberQuery(
            "exports",
            "Destination Country",
            "Country",
            ids.level2,
            store.i18n.locale
          )
        );
      }

      var prm = Promise.all(prms).then(res => {
        return { key: "country", data: ingestParent(res[0], res[1]) };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      var ids = getLevelObject(params);

      var prm;

      if (ids.level2) {
        prm = getMembersQuery(
          "exports",
          "Destination Country",
          "Subregion",
          store.i18n.locale,
          false
        ).then(res => {
          return {
            key: "country_list_detail",
            data: res
          };
        });
      } else {
        prm = mondrianClient
          .cube("exports")
          .then(cube => {
            var q;

            //Search countries
            q = levelCut(
              ids,
              "Destination Country",
              "Country",
              cube.query
                .option("parents", true)
                .drilldown("Destination Country", "Country", "Country")
                .measure("FOB US"),
              "Subregion",
              "Country",
              store.i18n.locale,
              false
            );

            return mondrianClient.query(q, "jsonrecords");
          })
          .then(res => {
            return {
              key: "country_list_detail",
              data: res.data.data
            };
          });
      }

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      var ids = getLevelObject(params);
      const prm = mondrianClient
        .cube("imports")
        .then(cube => {
          var q = levelCut(
            ids,
            "Origin Country",
            "Country",
            cube.query.option("parents", true).measure("CIF US"),
            "Subregion",
            "Country",
            store.i18n.locale
          );
          q.cut(`[Date].[Date].[Year].&[${store.imports_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "country_imports",
            data: {
              value: res.data.data[0]["CIF US"],
              decile: null,
              year: store.imports_year,
              source: store.sources.imports.title
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
        .cube("exports")
        .then(cube => {
          var q = levelCut(
            ids,
            "Destination Country",
            "Country",
            cube.query.option("parents", true).measure("FOB US"),
            "Subregion",
            "Country",
            store.i18n.locale
          );
          q.cut(`[Date].[Date].[Year].&[${store.exports_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "country_exports",
            data: {
              value: res.data.data[0]["FOB US"],
              decile: null,
              year: store.exports_year,
              source: store.sources.exports.title
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
        .cube("exports_and_imports")
        .then(cube => {
          var q = levelCut(
            ids,
            "Country",
            "Country",
            cube.query.option("parents", true).measure("Trade Balance"),
            "Subregion",
            "Country",
            store.i18n.locale
          );
          q.cut(`[Date].[Date].[Year].&[${store.exports_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "country_balance",
            data: {
              value: res.data.data[0]["Trade Balance"],
              decile: null,
              year: store.sources.exports.year,
              source: store.sources.exports.title
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    // main imported product
    (params, store) => {
      var ids = getLevelObject(params);
      const prm = mondrianClient
        .cube("imports")
        .then(cube => {
          var q = levelCut(
            ids,
            "Origin Country",
            "Country",
            cube.query
              .option("parents", true)
              .drilldown("Import HS", "HS", "HS2")
              .measure("CIF US"),
            "Subregion",
            "Country",
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${store.imports_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = _.orderBy(res.data.data, ["CIF US"], ["desc"]);
          const top_product = res.data.data[0] ? res.data.data[0] : false;
          return {
            key: "top_imported_product_from_country",
            data: {
              name: top_product ? top_product["HS2"] : "",
              value: top_product ? top_product["CIF US"] : "",
              source: store.sources.imports.title,
              year: store.sources.imports.year
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    InternationalTrade,
    InternationalTradeSlide,
    ImportsByProduct,
    ExportsByProduct,
    TradeBalance,

    MigrationSlide,
    MigrationDetailsSlide,
    MigrationActivitySlide,
    MigrationByActivity,
    MigrationByAge,
    MigrationByRegion,
    MigrationBySex,
    MigrationByVisa
  ];

  componentDidMount() {}

  render() {
    const { subnav, activeSub } = this.state;
    const { t, i18n } = this.props;

    if (!i18n.language) return null;

    const locale = i18n.language.split("-")[0];

    const { country } = this.props.routeParams;

    const obj = this.props.data.country;

    const ids = getLevelObject(this.props.routeParams);

    const list = this.props.data.country_list_detail;

    obj && ids && list
      ? list.map(c => {
          c.label = ids.level2 ? c["caption"] : c["Country"];
          if (ids.level2 && c["fullName"]) {
            c.link = slugifyItem(
              "countries",
              c["key"],
              c["name"],
              false,
              false
            );
          } else if (ids.level1 && c["ID Subregion"]) {
            c.link = slugifyItem(
              "countries",
              obj.key,
              obj.name,
              c["ID Country"],
              c["Country"]
            );
          }
          return c;
        })
      : [];

    const listTitle = ids
      ? ids.level2 ? t("Other regions") : t("Countries")
      : "";

    const stats = {
      imports: this.props.data.country_imports,
      exports: this.props.data.country_exports,
      balance: this.props.data.country_balance,
      product: this.props.data.top_imported_product_from_country
    };

    const topics = [
      {
        slug: "about",
        title: t("About")
      },
      {
        slug: "demography",
        title: t("Demography")
      },
      {
        slug: "trade",
        title: t("Trade")
      }
    ];

    return (
      <CanonComponent data={this.props.data} d3plus={d3plus} topics={topics}>
        <div className="profile">
          <div className="intro">
            {obj && (
              <Nav
                title={obj.caption}
                typeTitle={obj.parent ? t("Country") : t("Zone")}
                type={"countries"}
                exploreLink={"/explore/countries"}
                ancestor={obj.parent ? obj.parent.caption : ""}
                ancestorLink={
                  obj.parent
                    ? slugifyItem("countries", obj.parent.key, obj.parent.name)
                    : ""
                }
                topics={topics}
              />
            )}
            <div className="splash">
              <div
                className="image"
                style={{
                  backgroundImage: `url('/images/profile-bg/geo/chile.jpg')`
                }}
              />
              <div className="gradient" />
            </div>

            <div className="header">
              <div className="datum-full-width">
                {stats.imports && (
                  <FeaturedDatumSplash
                    title={t("Imports")}
                    icon="ingreso"
                    decile={stats.imports.decile}
                    datum={numeral(stats.imports.value, locale).format(
                      "($ 0,0 a)"
                    )}
                    source={stats.imports.year + " - " + stats.imports.source}
                    className=""
                  />
                )}

                {stats.product && (
                  <FeaturedDatumSplash
                    title={t("Main imported product")}
                    icon="check"
                    datum={stats.product.name}
                    source={`${numeral(stats.product.value, locale).format(
                      "$ 0,0 a"
                    )} - ${stats.product.year} - ${stats.product.source}`}
                    className=""
                  />
                )}

                {stats.exports && (
                  <FeaturedDatumSplash
                    title={t("Exports")}
                    icon="ingreso"
                    decile={stats.exports.decile}
                    datum={numeral(stats.exports.value, locale).format(
                      "($ 0,0 a)"
                    )}
                    source={stats.exports.year + " - " + stats.exports.source}
                    className=""
                  />
                )}

                {stats.balance && (
                  <FeaturedDatumSplash
                    title={t("Trade Balance")}
                    icon="ingreso"
                    decile={stats.balance.decile}
                    datum={numeral(stats.balance.value, locale).format(
                      "$ 0,0 a"
                    )}
                    source={stats.balance.year + " - " + stats.balance.source}
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

          <div className="topic-block" id="about">
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
          </div>

          <div className="topics-container">
            <Topic
              name={t("Demography")}
              id="demography"
              sections={[
                {
                  name: t("Destination"),
                  slides: [t("By Destination Region")]
                },
                {
                  name: t("Characterization"),
                  slides: [t("By Sex & Age"), t("By Activity & Visa Type")]
                }
              ]}
            >
              <div>
                <MigrationSlide>
                  <SectionColumns>
                    <MigrationByRegion className="lost-1" />
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
                    <MigrationByVisa className="lost-1-2" />
                    <MigrationByActivity className="lost-1-2" />
                  </SectionColumns>
                </MigrationActivitySlide>
              </div>
            </Topic>
            <Topic
              name={t("Trade")}
              id="trade"
              sections={[
                {
                  name: t("Trade"),
                  slides: [t("International trade")]
                },
                {
                  name: t("Trade Balance"),
                  slides: [t("Trade Balance")]
                }
              ]}
            >
              <div>
                <InternationalTradeSlide>
                  <SectionColumns>
                    <ImportsByProduct className="lost-1-2" />
                    <ExportsByProduct className="lost-1-2" />
                  </SectionColumns>
                  <SectionColumns>
                    <TradeBalance className="lost-1" />
                  </SectionColumns>
                </InternationalTradeSlide>
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
      data: state.data
    }),
    {}
  )(CountryProfile)
);
