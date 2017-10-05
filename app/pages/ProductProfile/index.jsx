import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
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
              .property("Destination Country", "Country","iso3"),
            "HS0",
            "HS2",
            store.i18n.locale
          );

          q.cut(`[Date].[Year].&[${store.exports_year}]`);
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          res.data.data = _.orderBy(res.data.data, ['FOB US'],['desc']);
          const top_country = (res.data.data[0])?res.data.data[0]:false;
          return {
            key: "top_destination_country_per_product",
            data:{
                id:(top_country)?top_country['iso3']:'',
                name:(top_country)?top_country['Country']:'',
                value:(top_country)?top_country['FOB US']:'',
                source: "Source Lorem",
                year:store.exports_year
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
          res.data.data = _.orderBy(res.data.data, ['FOB US'],['desc']);
          const top_region = (res.data.data[0])?res.data.data[0]:false;
          return {
            key: "top_region_producer_per_product",
            data: {
                id:(top_region)?top_region['ID Region']:'',
                name:(top_region)?top_region['Region']:'',
                value:(top_region)?top_region['FOB US']:'',
                source: "Source Lorem",
                year:store.exports_year
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
          res.data.data = _.orderBy(res.data.data, ['FOB US'],['desc']);
          const total = (res.data.data[0])?res.data.data[0]:false;
          return {
            key: "total_exports_per_product",
            data: 
              {
                value: (total)?total['FOB US']:'',
                decile: (total)?total['HS Rank Decile']:'',
                rank: (total)?total['HS Rank']:'',
                total: (total)?total['HS Rank Total']:'',
                year: store.exports_year,
                source: "Source Lorem"
              }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  componentDidMount() {}

  render() {
    const { subnav, activeSub } = this.state;

    const { focus, t, i18n } = this.props;

    const { industry } = this.props.routeParams;
    const obj = this.props.data.product;

    const locale = i18n.language.split("-")[0];

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
            {obj &&
              <Nav
                title={obj.caption}
                type={obj.parent ? t("Product") : t("Product Type")}
                exploreLink={"/explore/products"}
                ancestor={obj.parent ? obj.parent.caption : ""}
                ancestorLink={
                  obj.parent
                    ? slugifyItem("products", obj.parent.key, obj.parent.name)
                    : ""
                }
                topics={topics}
              />}
            <div className="splash">
              <div
                className="image"
                style={{
                  backgroundImage: `url('/images/profile-bg/chile.jpg')`
                }}
              />
              <div className="gradient" />
            </div>

            <div className="header">
                <div className="datum-full-width">
                  
                  {stats.country &&
                    <FeaturedMapSplash
                      title={t("Top destination country")}
                      type="country"
                      code={stats.country.id}
                      datum={stats.country.name}
                      source={
                        numeral(stats.country.value, locale).format(
                      "($ 0,0 a)"
                    ) + " - " + stats.country.year + " - " + stats.country.source
                      }
                      className=""
                    />}


                  {stats.exports &&
                    <FeaturedDatumSplash
                      title={t("Exports")}
                      icon="ingreso"
                      decile={stats.exports.decile}
                      rank={stats.exports.rank+'/'+stats.exports.total}
                      datum={numeral(stats.exports.value, locale).format(
                        "($ 0,0 a)"
                      )}
                      source={
                        stats.exports.year + " - " + stats.exports.source
                      }
                      className=""
                    />}


                  {stats.region &&
                    <FeaturedMapSplash
                      title={t("Top producer region")}
                      type="region"
                      code={stats.region.id}
                      datum={stats.region.name}
                      source={
                        numeral(stats.region.value, locale).format(
                      "($ 0,0 a)"
                    ) + " - " + stats.region.year + " - " + stats.region.source
                      }
                      className=""
                    />}
                
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
