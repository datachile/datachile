import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { translate } from "react-i18next";

import DatachileLoading from "components/DatachileLoading";
import Nav from "components/Nav";

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
      <CanonComponent
        id="explore-map"
        data={this.props.data}
        topics={[]}
        loadingComponent={<DatachileLoading />}
      >
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
