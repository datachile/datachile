import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonProfile } from "@datawheel/canon-core";
import { Link } from "react-router";
import { translate } from "react-i18next";
import Helmet from "react-helmet";

import { ingestChildren } from "helpers/dataUtils";
import { getMembersQuery } from "helpers/MondrianClient";
import { getImageFromMember } from "helpers/formatters";

import Nav from "components/Nav";

import Search from "components/Search";
import ProfileTile from "components/ProfileTile";
import ComingSoon from "components/ComingSoon";

import ResultsElement from "./results";

import "./explore.css";

class Explore extends Component {
  state = {
    level1ID: false,
    transitioning: true // removed onmount; toggled when switching categories
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

    // transition in
    this.categoryTransition();
  }

  // used to transition panels in and out
  categoryTransition() {
    // transitioning
    this.setState({
      transitioning: true
    });

    // more or less when things are done loading
    setTimeout(() => {
      this.setState({
        transitioning: false
      });
    }, 300);
  }

  render() {
    const { entity, entity_id } = this.props.routeParams;

    const { t, i18n, location, router } = this.props;
    const { transitioning } = this.state;

    const locale = i18n.language;

    const members = this.props.data.members;

    // console.log(members);
    var type = "";
    var title = "";
    var longTitle = "";
    switch (entity) {
      /*case undefined: {
        type = "";
        break;
      }*/
      case "countries": {
        type = "countries";
        title = t("countries");
        longTitle = t("countries");
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
        title = t("products");
        longTitle = t("products");
        break;
      }
      case "industries": {
        type = "industries";
        title = t("industries");
        longTitle = t("industries");
        break;
      }
      case "geo": {
        type = "region";
        title = "Chile";
        longTitle = t("locations");
        break;
      }
      default: {
        if (router) {
          router.push("/404");
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
              filterUrl: "/explore/" + profileType + "/" + m.key + "#results",
              url: profileType + "/" + m.key,
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

    // category array
    const categories = [
      { theme: "geo", type: "region", title: "Chile" },
      { theme: "countries", type: "countries", title: t("Countries") },
      { theme: "products", type: "products", title: t("Products") },
      { theme: "industries", type: "industries", title: t("Industries") }
      // { type: "careers", title: t("Careers") },
      // { type: "institutions", title: t("Institutions") }
    ];

    // create category list from category array
    const categoryItems = categories.map(category => (
      <li key={category.type} className="explore-category-item">
        <Link
          to={`/explore/${category.theme}`}
          onClick={ entity !== category.theme &&
            this.categoryTransition.bind(this)
          }
          className={`explore-category-link label font-xxs border-${category.theme} ${type === category.type ? "is-active" : "is-inactive"}`}
        >
          <img
            className="explore-category-icon"
            src={`/images/icons/icon-${category.theme}.svg`}
          />
          <span className="explore-category-text">{category.title}</span>
        </Link>
      </li>
    ));

    // default results count & filter name
    let resultsCount = 0;
    let filterName = null;

    // console.log(filters);
    // set filters at top (category) level
    if (filters.length && !entity_id) {
      resultsCount = filters.length;
    }
    // if we're doing a deeper search, update the results count and filter name
    // NOTE: filterName is also used to determine whether to display the back button
    else if (members && entity_id) {
      const member = [].concat(members).find(m => m.key == entity_id);
      if (member) {
        if (member.numChildren) {
          resultsCount = member.numChildren + 1;
        }
        filterName = member.name;
      }
    }

    return (
      <CanonProfile id="explore" data={this.props.data} topics={[]}>
        <Helmet>
          <title>{t("Explore")}</title>
          <meta name="description" content={t("Explore profiles")} />
          <meta property="og:title" content={t("Explore") + " - DataChile"} />
          <meta
            property="og:url"
            content={`https://${locale}.datachile.io/${location.pathname}`}
          />
          <meta
            property="og:image"
            content={`https://${locale}.datachile.io/images/logos/opengraph.png`}
          />
        </Helmet>
        <div className="explore-page">
          <div className="explore-header">
            <Nav
              title={t("Explore")}
              typeTitle={t("Home")}
              type={type != "" ? (type == "region" ? "geo" : type) : false}
              exploreLink={"/"}
            />

            {/* select category */}
            <ul className="explore-category-list u-list-reset">{categoryItems}</ul>
          </div>

          {/*<div className="search-explore-wrapper">
            <Search className="search-home" local={true} limit={5} />
          </div>*/}

          <div className="explore-title-container">
            <h2 className="explore-title">{!transitioning
                ? `${resultsCount} ${filterName ? filterName : ""} ${(longTitle === "countries" && resultsCount === 6) ? t("continents") : longTitle}`
                : t("table.loading")}
            </h2>

            {/* back link */}
            {filterName &&
              <Link className="explore-reset-link inverted-link font-xs" to={`explore/${entity}`}>
                <span className={`explore-reset-icon pt-icon pt-icon-arrow-left color-${entity}`} />
                <span className="explore-reset-text">{t("All")} {longTitle}</span>
              </Link>
            }
          </div>

          <div className="explore-container">
            <div className={`explore-panel tile-list${!filterName && !transitioning ? " is-visible" : " is-hidden"}`}>
              {entity &&
                filters &&
                filters.map(f => (
                  <ProfileTile
                    key={f.key}
                    item={f}
                    filterUrl={f.filterUrl}
                    className="explore-featured-profile"
                  />
                ))}
            </div>
            <div className={`explore-panel${filterName ? " is-visible" : " is-hidden"}`}>
              {this.renderResultComponent(this.props)}
            </div>
          </div>
        </div>
      </CanonProfile>
    );
  }

  renderResultComponent(props) {
    const { entity, entity_id } = props.routeParams;
    const { data, t } = props;

    // console.log(data);

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
