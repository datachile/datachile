import React, { Component } from "react";
import { connect } from "react-redux";
import { SectionColumns, CanonProfile, Canon } from "datawheel-canon";
import { translate } from "react-i18next";
import orderBy from "lodash/orderBy";
import Helmet from "react-helmet";

import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, {
  getMembersQuery,
  getMemberQuery,
  levelCut,
  simpleDatumNeed
} from "helpers/MondrianClient";
import {
  getLevelObject,
  ingestParent,
  clearStoreData
} from "helpers/dataUtils";

import { products } from "helpers/images";

import Nav from "components/Nav";

import SvgImage from "components/SvgImage";
import TopicMenu from "components/TopicMenu";
import FeaturedDatumSplash from "components/FeaturedDatumSplash";
import FeaturedMapSplash from "components/FeaturedMapSplash";
import LinksList from "components/LinksList";
import Topic from "components/Topic";

import InternationalTradeBalanceSlide from "./InternationalTrade/InternationalTradeBalanceSlide";
import InternationalTradeSlide from "./InternationalTrade/InternationalTradeSlide";
import ExportsByDestination from "./InternationalTrade/charts/ExportsByDestination";
import ImportsByOrigin from "./InternationalTrade/charts/ImportsByOrigin";
import TradeBalance from "./InternationalTrade/charts/TradeBalance";

import ExportsGeoMap from "./InternationalTrade/charts/ExportsGeoMap";
import ImportsGeoMap from "./InternationalTrade/charts/ImportsGeoMap";

import GeoTradeSlide from "./GeoTrade/GeoTradeSlide";
import ExportsByRegion from "./GeoTrade/charts/ExportsByRegion";
import ImportsByRegion from "./GeoTrade/charts/ImportsByRegion";

import { sources } from "helpers/consts";

import { IndexProductProfile } from "texts/ProductProfile";

import "../intro.css";

class ProductProfile extends Component {
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

          q.cut(`[Date].[Year].&[${sources.exports.year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = orderBy(res.data.data, ["FOB US"], ["desc"]);
          const top_country = res.data.data[0] ? res.data.data[0] : false;
          return {
            key: "top_destination_country_per_product",
            data: {
              id: top_country ? top_country["iso3"] : "",
              name: top_country ? top_country["Country"] : "",
              value: top_country ? top_country["FOB US"] : "",
              source: sources.exports.title,
              year: sources.exports.year
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

          q.cut(`[Date].[Year].&[${sources.exports.year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = orderBy(res.data.data, ["FOB US"], ["desc"]);
          const top_region = res.data.data[0] ? res.data.data[0] : false;
          return {
            key: "top_region_producer_per_product",
            data: {
              id: top_region ? top_region["ID Region"] : "",
              name: top_region ? top_region["Region"] : "",
              value: top_region ? top_region["FOB US"] : "",
              source: "Source Lorem",
              year: sources.exports.year
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

          q.cut(`[Date].[Year].&[${sources.exports.year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = orderBy(res.data.data, ["FOB US"], ["desc"]);
          const total = res.data.data[0] ? res.data.data[0] : false;
          return {
            key: "total_exports_per_product",
            data: {
              value: total ? total["FOB US"] : "",
              decile: total ? total["HS Rank Decile"] : "",
              rank: total ? total["HS Rank"] : "",
              total: total ? total["HS Rank Total"] : "",
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

    (params, store) =>
      simpleDatumNeed(
        "datum_exports_per_country",
        "exports",
        ["FOB US"],
        {
          drillDowns: [["Destination Country", "Country", "Country"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.exports.year}]`]
        },
        "product.export",
        false
      )(params, store),

    (params, store) =>
      simpleDatumNeed(
        "datum_imports_per_country",
        "imports",
        ["CIF US"],
        {
          drillDowns: [["Origin Country", "Country", "Country"]],
          options: { parents: true },
          cuts: [`[Date].[Date].[Year].&[${sources.imports.year}]`]
        },
        "product.import",
        false
      )(params, store),

    (params, store) =>
      simpleDatumNeed(
        "total_exports_chile",
        "exports",
        ["FOB US"],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.exports.year}]`]
        },
        "no_cut"
      )(params, store),

    InternationalTradeBalanceSlide,
    InternationalTradeSlide,
    ExportsByDestination,
    ImportsByOrigin,

    ExportsGeoMap,
    ImportsGeoMap,

    GeoTradeSlide,
    ExportsByRegion,
    ImportsByRegion,
    TradeBalance
  ];

  componentDidMount() {}

  render() {
    const { t, i18n, location, router } = this.props;
    const obj = this.props.data.product;

    const locale = i18n.language;

    const {
      datum_exports_per_country,
      datum_imports_per_country,
      total_exports_per_product,
      total_exports_chile
    } = this.props.data;

    const key =
      typeof obj === "object"
        ? obj.depth === 1
          ? obj.key
          : products.includes(obj.key)
            ? obj.key
            : obj.ancestors[0].key
        : "";

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
      ? ids.level2
        ? t("Other products")
        : t("Products")
      : "";

    const stats = {
      country: this.props.data.top_destination_country_per_product,
      region: this.props.data.top_region_producer_per_product,
      exports: total_exports_per_product
    };

    const text_product =
      typeof total_exports_per_product !== "undefined"
        ? IndexProductProfile(
            this.props.data.product,
            datum_exports_per_country,
            datum_imports_per_country,
            locale,
            t
          )
        : { available: false };

    const text_about = {
      year: {
        last: sources.exports.year
      },
      product: this.props.data.product,
      region: this.props.data.top_region_producer_per_product,
      total_exports: total_exports_per_product
    };

    if (text_about.total_exports && text_about.product && text_about.region) {
      text_about.total_exports.rank = numeral(
        text_about.total_exports.rank,
        locale
      ).format("0o");
      text_about.product.share = numeral(
        total_exports_per_product.value / total_exports_chile.data[0],
        locale
      ).format("0.0 %");
      text_about.region.share = numeral(
        text_about.region.value / total_exports_per_product.value,
        locale
      ).format("0.0 %");
    }

    const topics = [
      {
        slug: "about",
        title: t("About")
      },
      {
        slug: "trade",
        title: t("Trade")
      }
    ];

    let title =
      obj &&
      `${obj.caption}${obj.parent ? " (" + obj.parent.caption + ")" : ""}`;

    // truncate & add ellipses if necessary
    let titleTruncated = null;
    if (obj.caption.length > 40) {
      titleTruncated = obj.caption.slice(0, 40);
      titleTruncated += "…";
    }

    return (
      <Canon>
        <CanonProfile data={this.props.data} topics={topics}>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={title} />
            <meta property="og:title" content={title + " - DataChile"} />
            <meta
              property="og:url"
              content={`https://${locale}.datachile.io/${location.pathname}`}
            />
            <meta
              property="og:image"
              content={`https://${locale}.datachile.io/images/opengraph/product/${key}.jpg`}
            />
          </Helmet>
          <div className="profile">
            <div className="intro">
              {obj && (
                <Nav
                  title={titleTruncated ? titleTruncated : obj.caption}
                  fullTitle={obj.caption}
                  typeTitle={obj.parent ? t("Product") : t("Product Type")}
                  type="products"
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
                    backgroundImage: `url('/images/profile-bg/product/${key}.jpg')`
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
                      subtitle={
                        "US " +
                        numeral(stats.country.value, locale).format("($ 0,0 a)")
                      }
                      source="exports"
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
                      datum={
                        "US " +
                        numeral(stats.exports.value, locale).format("($ 0,0 a)")
                      }
                      source="exports"
                      className=""
                    />
                  )}

                  {stats.region && (
                    <FeaturedMapSplash
                      title={t("Top exporter region")}
                      type="region"
                      code={stats.region.id}
                      datum={stats.region.name}
                      subtitle={
                        "US " +
                        numeral(stats.region.value, locale).format("($ 0,0 a)")
                      }
                      source="exports"
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
                    <span className="u-visually-hidden">
                      {obj && (
                        <span className="small">
                          {/*<span className="pipe"> | </span>*/}
                          {obj.caption}
                        </span>
                      )}
                    </span>
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
                        <span
                          dangerouslySetInnerHTML={{
                            __html: total_exports_per_product
                              ? t("product_profile.about1.default", text_about)
                              : t("product_profile.about1.no_data", text_about)
                          }}
                        />
                      </p>
                    </div>
                    <div className="topic-slide-text">
                      {text_product.available && (
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              text_product.exports.n_countries > 0
                                ? t(
                                    `product_profile.about2.exp_${
                                      text_product.exports.n_countries
                                    }_imp_${text_product.imports.n_countries}`,
                                    text_product
                                  )
                                : ""
                          }}
                        />
                      )}
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
                name={t("Trade")}
                id="trade"
                slider={false}
                sections={[
                  {
                    name: t("Products"),
                    slides: [t("Trade")]
                  }
                ]}
              >
                <div>
                  <InternationalTradeSlide>
                    <SectionColumns>
                      <ExportsByDestination className="lost-1-2" />
                      <ExportsGeoMap className="lost-1-2" router={router} />
                    </SectionColumns>
                  </InternationalTradeSlide>
                </div>
                <div>
                  <InternationalTradeSlide>
                    <SectionColumns>
                      <ImportsByOrigin className="lost-1-2" router={router} />
                      <ImportsGeoMap className="lost-1-2" router={router} />
                    </SectionColumns>
                  </InternationalTradeSlide>
                </div>
                <div>
                  <GeoTradeSlide>
                    <SectionColumns>
                      <ExportsByRegion className="lost-1-2" router={router} />
                      <ImportsByRegion className="lost-1-2" router={router} />
                    </SectionColumns>
                  </GeoTradeSlide>
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
        </CanonProfile>
      </Canon>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(ProductProfile)
);
