import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { Link } from "react-router";
import { browserHistory } from "react-router";
import { translate } from "react-i18next";

import d3plus from "helpers/d3plus";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, {
  getMembersQuery,
  getMemberQuery
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
      country: {
        value: 1000,
        decile: 5,
        year: 2010,
        source: "source"
      },
      exports: {
        value: 1000,
        decile: 5,
        year: 2010,
        source: "source"
      },
      studies: {
        value: 1000,
        decile: 5,
        year: 2010,
        source: "source"
      }
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
                      title={t("Top importer country")}
                      type="country"
                      code={33}
                      datum={t("France")}
                      source={
                        stats.country.year + " - " + stats.country.source
                      }
                      className=""
                    />}


                  {stats.exports &&
                    <FeaturedDatumSplash
                      title={t("Exports")}
                      icon="ingreso"
                      decile={stats.exports.decile}
                      datum={numeral(stats.exports.value, locale).format(
                        "(0,0)"
                      )}
                      source={
                        stats.exports.year + " - " + stats.exports.source
                      }
                      className=""
                    />}


                  {stats.studies &&
                    <FeaturedMapSplash
                      title={t("Top Producer Region")}
                      type="region"
                      code={33}
                      datum={t("O'Higgins")}
                      source={
                        stats.country.year + " - " + stats.country.source
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
      stats: state.stats
    }),
    {}
  )(ProductProfile)
);
