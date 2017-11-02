import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { Link } from "react-router";
import { browserHistory } from "react-router";
import { translate } from "react-i18next";

import { ingestChildren } from "helpers/dataUtils";
import { slugifyItem } from "helpers/formatters";
import mondrianClient, {
  getMembersQuery,
  getMemberQuery
} from "helpers/MondrianClient";

import Nav from "components/Nav";
import Search from "components/Search";
import FeaturedBox from "components/FeaturedBox";
import ResultItem from "components/ResultItem";

import "./explore.css";

class Explore extends Component {
  constructor() {
    super();
    this.state = {
      level1ID: false
    };
  }

  static need = [
    (params, store) => {
      const entity = params.entity;

      var prm;

      if (entity) {
        switch (entity) {
          case undefined: {
            type = "";
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
              "Subregion",
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

    const { focus, t } = this.props;

    const members = this.props.data.members;

    var typeTitle = "";
    var type = "";
    var mainLink = false;
    switch (entity) {
      case undefined: {
        type = "";
        typeTitle = "";
        break;
      }
      case "countries": {
        typeTitle = t("Countries");
        type = "countries";
        break;
      }
      case "institutions": {
        typeTitle = t("Institutions");
        type = "institutions";
        break;
      }
      case "careers": {
        typeTitle = t("Careers");
        type = "careers";
        break;
      }
      case "products": {
        typeTitle = t("Products");
        type = "products";
        break;
      }
      case "industries": {
        typeTitle = t("Industries");
        type = "industries";
        break;
      }
      case "geo": {
        typeTitle = t("Geo");
        type = "geo";
        mainLink = true;
        break;
      }
      default: {
        browserHistory.push("/explore");
      }
    }

    const filters =
      typeof members != "undefined" && entity
        ? members.filter(m => m.key != 0).map(m => {
            return {
              key: m.key,
              name: m.caption,
              type: type,
              url: "/explore/" + type + "/" + m.key + "#results",
              img: "/images/profile-bg/geo/chile.jpg"
            };
          })
        : [];

    const results =
      typeof members != "undefined" && entity && entity_id
        ? members.filter(m => m.key == entity_id).map(m => {
            if (type) {
              m.children = m.children.map(c => {
                return {
                  key: c.key,
                  name: c.name,
                  type: type,
                  url: slugifyItem(entity, m.key, m.name, c.key, c.name)
                };
              });
            }
            return m;
          })
        : [];

    return (
      <CanonComponent id="explore" data={this.props.data} topics={[]}>
        <div className="explore-page">
          <Nav
            title={type != "" ? type : t("Explore")}
            typeTitle={t("Home")}
            type={type != "" ? type : false}
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
                  <li className={type == "institutions" ? "selected" : ""}>
                    <Link className="link" to="/explore/institutions">
                      <img src="/images/icons/icon-institutions.svg" />
                      <span>{t("Institutions")}</span>
                    </Link>
                  </li>
                  <li className={type == "careers" ? "selected" : ""}>
                    <Link className="link" to="/explore/careers">
                      <img src="/images/icons/icon-careers.svg" />
                      <span>{t("Careers")}</span>
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
                <div id={`results`} className="results-block">
                  {entity &&
                    results.length > 0 && (
                      <div className="">
                        <h3>
                          {t("Results for")} {typeTitle} : "{results[0].name}"
                        </h3>
                        <div>
                          {type == "geo" && (
                            <div className="list-title">
                              <ResultItem
                                item={{
                                  key: "chile",
                                  name: "Chile",
                                  type: "geo",
                                  url: "/geo/chile"
                                }}
                              />
                            </div>
                          )}
                          {members &&
                            entity &&
                            results &&
                            results.map(m => (
                              <div>
                                <div className="list-title">
                                  <ResultItem
                                    item={{
                                      key: m.key,
                                      name: m.caption,
                                      type: type,
                                      url: slugifyItem(entity, m.key, m.name)
                                    }}
                                  />
                                </div>

                                <ul className="explore-list">
                                  {m.children &&
                                    m.children.map(c => (
                                      <li>
                                        <ResultItem item={c} />
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
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
  )(Explore)
);
