import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { Link } from "react-router";
import { browserHistory } from "react-router";
import { translate } from "react-i18next";

import Nav from "components/Nav";

import { ingestChildren } from "helpers/dataUtils";
import { slugifyItem } from "helpers/formatters";
import mondrianClient, {
  getMembersQuery,
  getMemberQuery
} from "helpers/MondrianClient";

import "./intro.css";

class Explore extends Component {
  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
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
              "Higher Institution",
              "Higher Institution Subgroup",
              store.i18n.locale,
              false
            );
            var prm2 = getMembersQuery(
              "education_employability",
              "Higher Institution",
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

  componentDidMount() {}

  render() {
    const { subnav, activeSub } = this.state;

    const { entity } = this.props.routeParams;

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

    return (
      <CanonComponent id="explore" data={this.props.data} topics={[]}>
        <div className="explore-page">
          <div className="intro">
            <Nav
              title={type != "" ? type : t("Explore")}
              typeTitle={typeTitle != "" ? t("Profiles") : t("Home")}
              type={type != "" ? type : false}
              exploreLink={type != "" ? "/explore" : "/"}
            />
            <div className="splash">
              <div
                className="image"
                style={{
                  backgroundImage: `url('/images/profile-bg/chile2.jpg')`
                }}
              />
              <div className="gradient" />
            </div>

            <div className="header">
              <div className="meta">
                <div className="title" />
                <div className="subtitle" />
              </div>
            </div>
          </div>

          <div>
            {!entity && (
              <div className="">
                <ul className="explore-list">
                  <li>
                    <Link className="link" to="/explore/geo">
                      {t("Geo")}
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/explore/countries">
                      {t("Countries")}
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/explore/institutions">
                      {t("Institutions")}
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/explore/careers">
                      {t("Careers")}
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/explore/products">
                      {t("Products")}
                    </Link>
                  </li>
                  <li>
                    <Link className="link" to="/explore/industries">
                      {t("Industries")}
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {entity && (
              <div className="">
                <div>
                  {members &&
                    members.filter(m => m.key != 0).map(m => (
                      <div>
                        <h3 className="list-title">
                          <Link
                            className="link"
                            to={slugifyItem(entity, m.key, m.name)}
                          >
                            {m.caption}
                          </Link>
                        </h3>

                        <ul className="explore-list">
                          {m.children &&
                            m.children.map(c => (
                              <li>
                                <Link
                                  className="link"
                                  to={slugifyItem(
                                    entity,
                                    m.key,
                                    m.name,
                                    c.key,
                                    c.name
                                  )}
                                >
                                  {c.caption}
                                </Link>
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
