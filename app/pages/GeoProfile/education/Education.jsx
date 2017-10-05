import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";

import TopicSlider from "components/TopicSlider";
import TopicSliderBullets from "components/TopicSliderBullets";
import TopicSliderSections from "components/TopicSliderSections";

class Education extends Component {
  static need = [];

  constructor(props) {
    super(props);
    this.goTo = this.goTo.bind(this);
    this.state = { selected: 0 };
  }

  componentWillMount() {}

  goTo(n) {
    this.setState({ selected: n });
  }

  render() {
    const { t, children } = this.props;
    const { selected } = this.state;

    const sections = [
      { 
        name: t("Enrollment"),
        slides: [
          {ix:0, name:t("By School Type")}
        ]
      },
      { 
        name: t("Performance"),
        slides: [
          {ix:1, name:t("By School Type")}
        ]
      }
      /*{ name: t("Higher education"), slides: [2, 3, 4] },
      { name: t("Secondary education"), slides: [5] },
      { name: t("Scholarships"), slides: [6] }*/
    ];

    const selectedSection = _.find(sections, function(s) {
      return _.find(s.slides, function(slid){
        return slid.ix == selected;
      });
    });

    return (
      <div className="topic-block" id="education">
        <div className="topic-header">
          <div className="topic-title">
            <h2>
              {t("Education")}
              <small>
                <span className="pipe">|</span>
                {selectedSection.name}
              </small>
            </h2>
            <TopicSliderBullets
              name="education"
              slides={children}
              selected={selected}
              goTo={this.goTo}
            />
          </div>
          <div className="topic-go-to-targets">
            <TopicSliderSections
              name="education"
              sections={sections}
              selected={selected}
              goTo={this.goTo}
            />
          </div>
        </div>
        <div className="topic-slide-container">
          <TopicSlider selected={selected} goTo={this.goTo}>
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
  )(Education)
);
