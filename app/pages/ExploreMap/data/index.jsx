import React from "react";
import { connect } from "react-redux";
import { CanonProfile, Canon } from "@datawheel/canon-core";

import { translate } from "react-i18next";
import isEqual from "lodash/isEqual";

import { mapCommonNeed } from "helpers/map";

import Nav from "components/Nav";

import DataSidebar from "./DataSidebar";
import DataContent from "./DataContent";
import PivotSelector from "./PivotSelector";
import DataOptions from "./DataOptions";

import "../explore-map.css";

class ExploreMap extends React.Component {
  static need = [mapCommonNeed];

  state = {};

  render() {
    const { data, t, status } = this.props;

    return (
      <Canon>
        <CanonProfile id="explore-map" data={data} topics={[]}>
          <div className="explore-map-page">
            <Nav title="" typeTitle="" type={false} dark={true} />

            <div className="explore-map-container">
              <div className="explore-map-section">
                <div className="explore-map-sidebar">
                  <DataSidebar />
                </div>
                <div className="explore-map-content cart">
                  <div className="map-options-row">
                    <PivotSelector />
                    <DataOptions />
                  </div>
                  <DataContent />
                </div>
              </div>
            </div>
          </div>
        </CanonProfile>
      </Canon>
    );
  }
}

export default translate()(connect()(ExploreMap));
