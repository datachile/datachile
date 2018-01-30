import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { Link } from "react-router";
import { browserHistory } from "react-router";
import { translate } from "react-i18next";
import Helmet from "react-helmet";

import { ingestChildren } from "helpers/dataUtils";
import { getMembersQuery } from "helpers/MondrianClient";
import { getImageFromMember } from "helpers/formatters";

import Nav from "components/Nav";
import DatachileLoading from "components/DatachileLoading";
import Search from "components/Search";
import FeaturedBox from "components/FeaturedBox";
import ComingSoon from "components/ComingSoon";

import ResultsElement from "./results";

import "./explore.css";

class Explore extends Component {
  state = {
    level1ID: false
  };

  static need = [
    (params, store) => {
      const entity = params.entity;

      var prm;

      if (entity) {
        switch (entity) {
          case undefined: {
            break;
          }
          case "geo": {
            var prm1 = getMembersQuery(
              "exports",
              "Geography",
              "Region",
              store.i18n.locale,
              false
            );
            var prm2 = getMembersQuery(
              "exports",
              "Geography",
              "Comuna",
              store.i18n.locale,
              false
            );

            prm = Promise.all([prm1, prm2]).then(res => {
              return { key: "members", data: ingestChildren(res[0], res[1]) };
            });
            break;
          }
          case "countries": {
            var prm1 = getMembersQuery(
              "exports",
              "Destination Country",
              "Continent",
              store.i18n.locale,
              false
            );
            var prm2 = getMembersQuery(
              "exports",
              "Destination Country",
              "Country",
              store.i18n.locale,
              false
            );

            prm = Promise.all([prm1, prm2]).then(res => {
              return { key: "members", data: ingestChildren(res[0], res[1]) };
            });
            break;
          }
          case "institutions": {
            var prm1 = getMembersQuery(
              "education_employability",
              "Higher Institutions",
              "Higher Institution Subgroup",
              store.i18n.locale,
              false
            );
            var prm2 = getMembersQuery(
              "education_employability",
              "Higher Institutions",
              "Higher Institution",
              store.i18n.locale,
              false
            );

            prm = Promise.all([prm1, prm2]).then(res => {
              return { key: "members", data: ingestChildren(res[0], res[1]) };
            });
            break;
          }
          case "careers": {
            var prm1 = getMembersQuery(
              "education_employability",
              "Careers",
              "Career Group",
              store.i18n.locale,
              false
            );
            var prm2 = getMembersQuery(
              "education_employability",
              "Careers",
              "Career",
              store.i18n.locale,
              false
            );

            prm = Promise.all([prm1, prm2]).then(res => {
              return { key: "members", data: ingestChildren(res[0], res[1]) };
            });
            break;
          }
          case "products": {
            var prm1 = getMembersQuery(
              "exports",
              "Export HS",
              "HS0",
              store.i18n.locale,
              false
            );
            var prm2 = getMembersQuery(
              "exports",
              "Export HS",
              "HS2",
              store.i18n.locale,
              false
            );

            prm = Promise.all([prm1, prm2]).then(res => {
              return { key: "members", data: ingestChildren(res[0], res[1]) };
            });
            break;
          }
          case "industries": {
            var prm1 = getMembersQuery(
              "tax_data",
              "ISICrev4",
              "Level 1",
              store.i18n.locale,
              false
            );
            var prm2 = getMembersQuery(
              "tax_data",
              "ISICrev4",
              "Level 2",
              store.i18n.locale,
              false
            );

            prm = Promise.all([prm1, prm2]).then(res => {
              return { key: "members", data: ingestChildren(res[0], res[1]) };
            });
            break;
          }
        }
      }

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  componentWillUnmount() {
    this.setState({
      level1ID: false
    });
  }

  componentDidMount() {
    this.setState({
      level1ID: false
    });
  }

  render() {
    const { entity, entity_id } = this.props.routeParams;

    const { t } = this.props;

    const members = this.props.data.members;

    var type = "";
    var title = "";
    var mainLink = false;
    switch (entity) {
      /*case undefined: {
        type = "";
        break;
      }*/
      case "countries": {
        type = "countries";
        title = t("Countries");
        break;
      }
      /*case "institutions": {
        type = "institutions";
        break;
      }
      case "careers": {
        type = "careers";
        break;
      }*/
      case "products": {
        type = "products";
        title = t("Products");
        break;
      }
      case "industries": {
        type = "industries";
        title = t("Industries");
        break;
      }
      case "geo": {
        type = "region";
        title = t("Geographical");
        mainLink = true;
        break;
      }
      default: {
        if (browserHistory) {
          browserHistory.push("/404");
        }
        break;
      }
    }
    if (type == "") return null;

    let filters =
      typeof members != "undefined" && entity
        ? members.filter(m => m.key != 0).map(m => {
            const profileType = type == "region" ? "geo" : type;
            return {
              key: m.key,
              name: m.caption,
              type: type,
              url: "/explore/" + profileType + "/" + m.key + "#results",
              img: getImageFromMember(profileType, m.key)
            };
          })
        : [];

    if (type == "region" && filters.length) {
      filters.unshift({
        key: "chile",
        name: "Chile",
        type: "national",
        url: "/geo/chile",
        img: getImageFromMember("geo", "chile")
      });
    }

    return (
      <CanonComponent
        id="explore"
        data={this.props.data}
        topics={[]}
        loadingComponent={<DatachileLoading />}
      >
        <Helmet>
          <title>{t("Explore")}</title>
          <meta name="description" content={t("Explore profiles")} />
          <meta property="og:title" content={t("Explore") + " - DataChile"} />
          <meta
            property="og:url"
            content={`https://${locale}.datachile.io${location.pathname}`}
          />
          <meta
            property="og:image"
            content={`https://${locale}.datachile.io/images/logos/opengraph.jpg`}
          />
        </Helmet>
        <div className="explore-page">
          <Nav
            title={type != "" ? title : t("Explore")}
            typeTitle={t("Home")}
            type={type != "" ? (type == "region" ? "geo" : type) : false}
            exploreLink={"/"}
          />

          <div className="search-explore-wrapper">
            <Search className="search-home" local={true} limit={5} />
          </div>

          <div className="explore-title">
            <h3>{t("Explore profiles by category")}</h3>
          </div>

          <div className="explore-container">
            <div id="explore-sidebar">
              <div className="explore-column">
                <ul>
                  <li className={type == "geo" ? "selected" : ""}>
                    <Link className="link" to="/explore/geo">
                      <img src="/images/icons/icon-geo.svg" />
                      <span>{t("Geo")}</span>
                    </Link>
                  </li>
                  <li className={type == "countries" ? "selected" : ""}>
                    <Link className="link" to="/explore/countries">
                      <img src="/images/icons/icon-countries.svg" />
                      <span>{t("Countries")}</span>
                    </Link>
                  </li>
                  <li className={type == "products" ? "selected" : ""}>
                    <Link className="link" to="/explore/products">
                      <img src="/images/icons/icon-products.svg" />
                      <span>{t("Products")}</span>
                    </Link>
                  </li>
                  <li className={type == "industries" ? "selected" : ""}>
                    <Link className="link" to="/explore/industries">
                      <img src="/images/icons/icon-industries.svg" />
                      <span>{t("Industries")}</span>
                    </Link>
                  </li>
                  <li className={type == "careers" ? "selected" : ""}>
                    <Link className="link link-soon" to="">
                      <img src="/images/icons/icon-careers.svg" />
                      <span>
                        {t("Careers")}
                        <ComingSoon />
                      </span>
                    </Link>
                  </li>
                  <li className={type == "institutions" ? "selected" : ""}>
                    <Link className="link link-soon" to="">
                      <img src="/images/icons/icon-institutions.svg" />
                      <span>
                        {t("Institutions")}
                        <ComingSoon />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div id="explore-results">
              <div className="explore-column">
                <div className="filter-block">
                  <div className="explore-featured-tiles">
                    {entity &&
                      filters &&
                      filters.map(f => (
                        <div
                          key={f.key}
                          className={
                            entity_id == f.key
                              ? "level1-filter selected"
                              : "level1-filter"
                          }
                        >
                          <FeaturedBox
                            item={f}
                            className="explore-featured-profile"
                          />
                        </div>
                      ))}
                  </div>
                </div>
                {this.renderResultComponent(this.props)}
              </div>
            </div>
          </div>
        </div>
      </CanonComponent>
    );
  }

  renderResultComponent(props) {
    const { entity, entity_id } = props.routeParams;
    const { data, t } = props;

    if (!entity || !entity_id || !data || !t) return null;

    if (!data.members) return null;

    const member = [].concat(data.members).find(m => m.key == entity_id);

    if (!member) return null;

    return React.createElement(
      ResultsElement[entity] || ResultsElement.undefined,
      {
        t,
        entity,
        profile: { ...member }
      }
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
  )(Explore)
);
