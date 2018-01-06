import React, { Component } from "react";
import { connect } from "react-redux";
import { SectionColumns, CanonComponent } from "datawheel-canon";
import orderBy from "lodash/orderBy";
import { translate } from "react-i18next";
import Helmet from "react-helmet";

import d3plus from "helpers/d3plus";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, {
  getMembersQuery,
  getMemberQuery,
  levelCut
} from "helpers/MondrianClient";
import {
  getLevelObject,
  ingestParent,
  clearStoreData
} from "helpers/dataUtils";
import { sources } from "helpers/consts";

import Topic from "components/Topic";
import DatachileLoading from "components/DatachileLoading";

import Nav from "components/Nav";
import SvgImage from "components/SvgImage";
import TopicMenu from "components/TopicMenu";
import FeaturedDatumSplash from "components/FeaturedDatumSplash";
// import LinksList from "components/LinksList";

import InternationalTradeSlide from "./InternationalTrade/InternationalTradeSlide";
import InternationalTradeOriginDestinationSlide from "./InternationalTrade/InternationalTradeOriginDestinationSlide";
import InternationalTradeBalanceSlide from "./InternationalTrade/InternationalTradeBalanceSlide";

import ExportsByProduct from "./InternationalTrade/charts/ExportsByProduct";
import ImportsByProduct from "./InternationalTrade/charts/ImportsByProduct";
import ExportsByOrigin from "./InternationalTrade/charts/ExportsByOrigin";
import ImportsByDestination from "./InternationalTrade/charts/ImportsByDestination";
import TradeBalance from "./InternationalTrade/charts/TradeBalance";

/* BEGIN DEMOGRAPHY */
import MigrationSlide from "./demography/MigrationSlide";
import MigrationDetailsSlide from "./demography/MigrationDetailsSlide";
import MigrationActivitySlide from "./demography/MigrationActivitySlide";
import MigrationEducationSlide from "./demography/MigrationEducationSlide";

import MigrationByActivity from "./demography/charts/MigrationByActivity";
import MigrationByAge from "./demography/charts/MigrationByAge";
import MigrationByRegion from "./demography/charts/MigrationByRegion";
import MigrationBySex from "./demography/charts/MigrationBySex";
import MigrationByVisa from "./demography/charts/MigrationByVisa";
import MigrationByEducation from "./demography/charts/MigrationByEducation";

/* END DEMOGRAPHY */

import "../intro.css";
import "../topics.css";

class CountryProfile extends Component {
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
          "exports",
          "Destination Country",
          "Continent",
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
          "Continent",
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
              "Continent",
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
            "Continent",
            "Country",
            store.i18n.locale
          );
          q.cut(`[Date].[Date].[Year].&[${sources.imports.year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "country_imports",
            data: {
              value: res.data.data[0]["CIF US"],
              decile: null,
              year: sources.imports.year,
              source: sources.imports.title
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
            "Continent",
            "Country",
            store.i18n.locale
          );
          q.cut(`[Date].[Date].[Year].&[${sources.exports.year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "country_exports",
            data: {
              value: res.data.data[0]["FOB US"],
              decile: null,
              year: sources.exports.year,
              source: sources.exports.title
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
            "Continent",
            "Country",
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${sources.imports.year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = orderBy(res.data.data, ["CIF US"], ["desc"]);
          const top_product = res.data.data[0] ? res.data.data[0] : false;
          return {
            key: "top_imported_product_from_country",
            data: {
              name: top_product ? top_product["HS2"] : "",
              value: top_product ? top_product["CIF US"] : "",
              source: sources.imports.title,
              year: sources.imports.year
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    InternationalTradeSlide,
    InternationalTradeBalanceSlide,
    InternationalTradeOriginDestinationSlide,
    ImportsByProduct,
    ImportsByDestination,
    ExportsByProduct,
    ExportsByOrigin,
    TradeBalance,

    MigrationSlide,
    MigrationDetailsSlide,
    MigrationActivitySlide,
    MigrationEducationSlide,
    MigrationByActivity,
    MigrationByAge,
    MigrationByRegion,
    MigrationBySex,
    MigrationByVisa,
    MigrationByEducation
  ];

  render() {
    const { t, i18n } = this.props;
    const locale = i18n.language;

    const ids = getLevelObject(this.props.routeParams);

    const obj = this.props.data.country;

    const list = this.props.data.country_list_detail;

    const bgImage =
      obj && obj.key ? `url('/images/profile-bg/country/${obj.key}.jpg')` : "";

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
          } else if (ids.level1 && c["ID Continent"]) {
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
      product: this.props.data.top_imported_product_from_country
    };

    const topics = [
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
      <CanonComponent
        data={this.props.data}
        d3plus={d3plus}
        topics={topics}
        loadingComponent={<DatachileLoading />}
      >
        {obj && (
          <Helmet>
            <title>{obj.caption}</title>
          </Helmet>
        )}
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
                  backgroundImage: bgImage
                }}
              />
              <div className="gradient" />
            </div>

            <div className="header">
              <div className="datum-full-width">
                {stats.imports && (
                  <FeaturedDatumSplash
                    title={t("Total Imports")}
                    icon="ingreso"
                    decile={stats.imports.decile}
                    datum={numeral(stats.imports.value, locale).format(
                      "($ 0.0 a)"
                    )}
                    source="imports"
                    className=""
                  />
                )}

                {stats.exports && (
                  <FeaturedDatumSplash
                    title={t("Total Exports")}
                    icon="ingreso"
                    decile={stats.exports.decile}
                    datum={numeral(stats.exports.value, locale).format(
                      "($ 0.0 a)"
                    )}
                    source="exports"
                    className=""
                  />
                )}

                {stats.product && (
                  <FeaturedDatumSplash
                    title={t("Main imported product")}
                    icon="check"
                    datum={stats.product.name}
                    subtitle={`${numeral(stats.product.value, locale).format(
                      "$ 0.0 a"
                    )}`}
                    source="imports"
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
              name={t("Demography")}
              id="demography"
              slider={false}
              sections={[
                {
                  name: t("Migration"),
                  slides: [t("")]
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
                <MigrationEducationSlide>
                  <SectionColumns>
                    <MigrationByEducation className="lost-1" />
                  </SectionColumns>
                </MigrationEducationSlide>
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
              slider={false}
              sections={[
                {
                  name: t("Products"),
                  slides: [t("")]
                }
              ]}
            >
              <div>
                <InternationalTradeSlide>
                  <SectionColumns>
                    <ImportsByProduct className="lost-1-2" />
                    <ExportsByProduct className="lost-1-2" />
                  </SectionColumns>
                </InternationalTradeSlide>
              </div>
              <div>
                <InternationalTradeOriginDestinationSlide>
                  <SectionColumns>
                    <ImportsByDestination className="lost-1-2" />
                    <ExportsByOrigin className="lost-1-2" />
                  </SectionColumns>
                </InternationalTradeOriginDestinationSlide>
              </div>
              <div>
                <InternationalTradeBalanceSlide>
                  <SectionColumns>
                    <TradeBalance className="lost-1" />
                  </SectionColumns>
                </InternationalTradeBalanceSlide>
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
