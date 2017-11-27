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

import "./explore-map.css";

class ExploreMap extends Component {
  constructor() {
    super();
  }

  static need = [];

  componentWillUnmount() {
    this.setState({});
  }

  componentDidMount() {
    this.setState({});
  }

  render() {
    const { t } = this.props;

    return (
      <CanonComponent id="explore-map" data={this.props.data} topics={[]}>
        <div className="explore-map-page">
          <Nav
            title={t("Map Explore")}
            typeTitle={t("Home")}
            type={false}
            exploreLink={"/"}
          />

          <div className="explore-map-title">
            <h3>{t("Map Explore")}</h3>
          </div>

          <div className="explore-map-container">map!</div>
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
  )(ExploreMap)
);
