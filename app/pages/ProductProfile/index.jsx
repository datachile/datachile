import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { SectionColumns, CanonComponent } from "datawheel-canon";
import { Link } from "react-router";
import { browserHistory } from "react-router";
import { translate } from "react-i18next";
import _ from "lodash";

import d3plus from "helpers/d3plus";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, {
  getMembersQuery,
  getMemberQuery,
  levelCut
} from "helpers/MondrianClient";
import { getLevelObject, ingestParent } from "helpers/dataUtils";

import Nav from "components/Nav";
import SvgImage from "components/SvgImage";
import TopicMenu from "components/TopicMenu";
import FeaturedDatumSplash from "components/FeaturedDatumSplash";
import FeaturedMapSplash from "components/FeaturedMapSplash";
import LinksList from "components/LinksList";

import InternationalTrade from "./InternationalTrade/InternationalTrade";
import InternationalTradeSlide from "./InternationalTrade/InternationalTradeSlide";
import ExportsByDestination from "./InternationalTrade/charts/ExportsByDestination";
import ImportsByDestination from "./InternationalTrade/charts/ImportsByDestination";

import "../intro.css";

class ProductProfile extends Component {
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
          "Export HS",
          "HS0",
          ids.level1,
          store.i18n.locale
        )
      ];

      if (ids.level2) {
        prms.push(
          getMemberQuery(
            "exports",
            "Export HS",
            "HS2",
            ids.level2,
            store.i18n.locale
          )
        );
      }

      var prm = Promise.all(prms).then(res => {
        return { key: "product", data: ingestParent(res[0], res[1]) };
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
            "Export HS",
            "HS",
            cube.query
              .option("parents", true)
              .drilldown("Destination Country", "Country", "Country")
              .measure("FOB US")
              .property("Destination Country", "Country", "iso3"),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${store.exports_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = _.orderBy(res.data.data, ["FOB US"], ["desc"]);
          const top_country = res.data.data[0] ? res.data.data[0] : false;
          return {
            key: "top_destination_country_per_product",
            data: {
              id: top_country ? top_country["iso3"] : "",
              name: top_country ? top_country["Country"] : "",
              value: top_country ? top_country["FOB US"] : "",
              source: "Source Lorem",
              year: store.exports_year
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
            "Export HS",
            "HS",
            cube.query
              .drilldown("Geography", "Geography", "Region")
              .measure("FOB US"),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${store.exports_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = _.orderBy(res.data.data, ["FOB US"], ["desc"]);
          const top_region = res.data.data[0] ? res.data.data[0] : false;
          return {
            key: "top_region_producer_per_product",
            data: {
              id: top_region ? top_region["ID Region"] : "",
              name: top_region ? top_region["Region"] : "",
              value: top_region ? top_region["FOB US"] : "",
              source: "Source Lorem",
              year: store.exports_year
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
            "Export HS",
            "HS",
            cube.query
              .drilldown("Date", "Date", "Year")
              .measure("FOB US")
              .measure("HS Rank")
              .measure("HS Rank Decile")
              .measure("HS Rank Total"),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${store.exports_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = _.orderBy(res.data.data, ["FOB US"], ["desc"]);
          const total = res.data.data[0] ? res.data.data[0] : false;
          return {
            key: "total_exports_per_product",
            data: {
              value: total ? total["FOB US"] : "",
              decile: total ? total["HS Rank Decile"] : "",
              rank: total ? total["HS Rank"] : "",
              total: total ? total["HS Rank Total"] : "",
              year: store.exports_year,
              source: "Source Lorem"
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

      var prm;
      if (ids.level2) {
        prm = getMembersQuery(
          "exports",
          "Export HS",
          "HS0",
          store.i18n.locale,
          false
        ).then(res => {
          return {
            key: "product_list_detail",
            data: res
          };
        });
      } else {
        prm = mondrianClient
          .cube("exports")
          .then(cube => {
            var q = levelCut(
              ids,
              "Export HS",
              "HS",
              cube.query
                .option("parents", true)
                .drilldown("Export HS", "HS", "HS2")
                .measure("FOB US"),
              "HS0",
              "HS2",
              store.i18n.locale,
              false
            );

            return mondrianClient.query(q, "jsonrecords");
          })
          .then(res => {
            return {
              key: "product_list_detail",
              data: res.data.data
            };
          });
      }

      return {
        type: "GET_DATA",
        promise: prm
      };
    },

    InternationalTrade,
    InternationalTradeSlide,
    ExportsByDestination,
    ImportsByDestination
  ];

  componentDidMount() {}

  render() {
    const { subnav, activeSub } = this.state;

    const { focus, t, i18n } = this.props;

    const { industry } = this.props.routeParams;

    const obj = this.props.data.product;

    const locale = i18n.language.split("-")[0];

    const ids = getLevelObject(this.props.routeParams);

    const list = this.props.data.product_list_detail;

    obj && ids && list
      ? list.map(c => {
          c.label = ids.level2 ? c["caption"] : c["HS2"];
          if (ids.level2 && c["fullName"]) {
            c.link = slugifyItem("products", c["key"], c["name"], false, false);
          } else if (ids.level1 && c["ID HS2"]) {
            c.link = slugifyItem(
              "products",
              c["ID HS0"],
              c["HS0"],
              c["ID HS2"],
              c["HS2"]
            );
          }
          return c;
        })
      : [];

    const listTitle = ids
      ? ids.level2 ? t("Other products") : t("Products")
      : "";

    const stats = {
      country: this.props.data.top_destination_country_per_product,
      region: this.props.data.top_region_producer_per_product,
      exports: this.props.data.total_exports_per_product
    };

    const topics = [
      {
        slug: "about",
        title: t("About")
      },
      {
        slug: "trade",
        title: t("Trade")
      },
      {
        slug: "opportunities",
        title: t("Opportunities")
      }
    ];

    return (
      <CanonComponent data={this.props.data} d3plus={d3plus} topics={topics}>
        <div className="profile">
          <div className="intro">
            {obj && (
              <Nav
                title={obj.caption}
                typeTitle={obj.parent ? t("Product") : t("Product Type")}
                type={"products"}
                exploreLink={"/explore/products"}
                ancestor={obj.parent ? obj.parent.caption : ""}
                ancestorLink={
                  obj.parent
                    ? slugifyItem("products", obj.parent.key, obj.parent.name)
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
                {stats.country && (
                  <FeaturedMapSplash
                    title={t("Top destination country")}
                    type="country"
                    code={stats.country.id}
                    datum={stats.country.name}
                    source={
                      numeral(stats.country.value, locale).format("($ 0,0 a)") +
                      " - " +
                      stats.country.year +
                      " - " +
                      stats.country.source
                    }
                    className=""
                  />
                )}

                {stats.exports && (
                  <FeaturedDatumSplash
                    title={t("Exports")}
                    icon="ingreso"
                    decile={stats.exports.decile}
                    rank={
                      stats.exports.rank
                        ? numeral(stats.exports.rank, locale).format("0o") +
                          " " +
                          t("of") +
                          " " +
                          stats.exports.total
                        : false
                    }
                    datum={numeral(stats.exports.value, locale).format(
                      "($ 0,0 a)"
                    )}
                    source={stats.exports.year + " - " + stats.exports.source}
                    className=""
                  />
                )}

                {stats.region && (
                  <FeaturedMapSplash
                    title={t("Top producer region")}
                    type="region"
                    code={stats.region.id}
                    datum={stats.region.name}
                    source={
                      numeral(stats.region.value, locale).format("($ 0,0 a)") +
                      " - " +
                      stats.region.year +
                      " - " +
                      stats.region.source
                    }
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
                    <small>
                      <span className="pipe">|</span>
                      {obj.caption}
                    </small>
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
                  <div className="topic-slide-text">
                    <LinksList title={listTitle} list={list} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="topics-container">
            <InternationalTrade>
              <div>
                <InternationalTradeSlide>
                  <SectionColumns>
                    <ExportsByDestination className="lost-1-2" />
                    <ImportsByDestination className="lost-1-2" />
                  </SectionColumns>
                </InternationalTradeSlide>
              </div>
              <div>
                <p>
                  Nullam eu ante vel est convallis dignissim. Fusce suscipit,
                  wisi nec facilisis facilisis, est dui fermentum leo, quis
                  tempor ligula erat quis odio. Nunc porta vulputate tellus.
                  Nunc rutrum turpis sed pede. Sed bibendum. Aliquam posuere.
                  Nunc aliquet, augue nec adipiscing interdum, lacus tellus
                  malesuada massa, quis varius mi purus non odio. Pellentesque
                  condimentum, magna ut suscipit hendrerit, ipsum augue ornare
                  nulla, non luctus diam neque sit amet urna. Curabitur
                  vulputate vestibulum lorem. Fusce sagittis, libero non
                  molestie mollis, magna orci ultrices dolor, at vulputate neque
                  nulla lacinia eros. Sed id ligula quis est convallis tempor.
                  Curabitur lacinia pulvinar nibh. Nam a sapien.
                </p>
              </div>
            </InternationalTrade>
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
      stats: state.stats,
      exports_year: state.exports_year
    }),
    {}
  )(ProductProfile)
);
