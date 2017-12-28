import React, { Component } from "react";
import { translate } from "react-i18next";
import { CanonComponent } from "datawheel-canon";

import Nav from "components/Nav";
import Search from "components/Search";

import "./NotFound.css";

class NotFound extends Component {
  render() {
    const { t } = this.props;
    return (
      <CanonComponent data={this.props.data} topics={[]}>
        <div className="profile not-found">
          <div className="intro">
            <Nav
              title={t("not_found.title")}
              typeTitle={t("Home")}
              type={false}
              exploreLink={"/"}
            />
            <div className="splash">
              <div className="image" />
              <div className="gradient" />
            </div>
            <div className="header">
              <div className="text-container">
                <h2>{t("not_found.oops")}</h2>
                <p>{t("not_found.text")}</p>
              </div>
              <div className="search-container">
                <Search />
              </div>
            </div>
          </div>
        </div>
      </CanonComponent>
    );
  }
}

export default translate()(NotFound);
