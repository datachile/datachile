import React, { Component } from "react";
import { translate } from "react-i18next";
import { CanonProfile } from "@datawheel/canon-core";

import Nav from "components/Nav";
import Search from "components/Search";

import "./NotFound.css";

class NotFound extends Component {
  render() {
    const { t } = this.props;
    return (
      <div>
        <CanonProfile data={this.props.data} topics={[]}>
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
                  <h2 className="font-xl" aria-hidden="true">
                    {t("not_found.oops")}
                  </h2>
                  <p className="font-sm">{t("not_found.text")}</p>
                </div>
                <div className="search-container">
                  <Search />
                </div>
              </div>
            </div>
          </div>
        </CanonProfile>
      </div>
    );
  }
}

export default translate()(NotFound);
