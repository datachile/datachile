import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";

import TopicSlider from "components/TopicSlider";

import OutputByIndustry from "./industry/charts/OutputByIndustry";

class Economy extends Component {
  static need = [];

  render() {
    const { t, children } = this.props;

    return (
      <div className="topic-block" name="Economy">
        <a className="topic-anchor" id="Economy" />
        <div className="topic-header">
          <div className="topic-title">
            {t("Economy")}
          </div>
          <div className="topic-go-to-targets">
            <ul>
              <li>
                <a>comercio</a>
              </li>
              <li>
                <a>industria</a>
              </li>
              <li>
                <a>oportunidades</a>
              </li>
              <li>
                <a>empleo</a>
              </li>
              <li>
                <a>ingreso</a>
              </li>
              <li>
                <a>innovación</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="topic-slide-container">
          <TopicSlider>
            {children}
          </TopicSlider>
        </div>
      </div>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(Economy)
);
