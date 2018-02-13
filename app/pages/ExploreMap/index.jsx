import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { translate } from "react-i18next";

import DatachileLoading from "components/DatachileLoading";
import Nav from "components/Nav";

import MapSidebar from "./map/MapSidebar";
import MapContent from "./map/MapContent";
import MapLevelSelector from "./map/MapLevelSelector";

import DataSidebar from "./data/DataSidebar";
import DataContent from "./data/DataContent";

import "./explore-map.css";

class ExploreMap extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static need = [MapContent];

  componentWillUnmount() {
    this.setState({});
  }

  componentDidMount() {
    this.setState({});
  }

  render() {
    const { section } = this.props.routeParams;
    const { t } = this.props;

    return (
      <CanonComponent
        id="explore-map"
        data={this.props.data}
        topics={[]}
        loadingComponent={<DatachileLoading />}
      >
        <div className="explore-map-page">
          <Nav title="" typeTitle="" type={false} dark={true} />

          <div className="explore-map-container">
            {!section && (
              <div className="explore-map-section">
                <div className="explore-map-sidebar">
                  <MapSidebar />
                </div>
                <div className="explore-map-content">
                  <MapLevelSelector />
                  <MapContent data={this.props.data} />
                </div>
              </div>
            )}
            {section &&
              section == "data" && (
                <div className="explore-map-section">
                  <div className="explore-map-sidebar">
                    <DataSidebar />
                  </div>
                  <div className="explore-map-content">
                    <DataContent />
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
      focus: state.focus
    }),
    {}
  )(ExploreMap)
);
