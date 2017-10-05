import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";

import TopicSlider from "components/TopicSlider";
import TopicSliderBullets from "components/TopicSliderBullets";
import TopicSliderSections from "components/TopicSliderSections";

class Economy extends Component {
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
        name: t("Trade"),
        slides: [
          {ix:0,name:t("International trade")}
        ]
      },
      { 
        name: t("Industry"),
        slides: [
          {ix:1,name:t("Industry & Occupations")}
        ] 
      },
      { 
        name: t("Opportunity"),
        slides: [
          {ix:2,name:t("Opportunities")}
        ] 
      },
      { 
        name: t("Employment"),
        slides: [
          {ix:3,name:t("By Sex & Education Level")}
        ]
      },
      { 
        name: t("Income"),
        slides: [
          {ix:4,name:t("By Sex & Age")},
          {ix:5,name:t("By Occupation")}
        ] 
      },
      { 
        name:t( t("Innovation")),
        slides: [
          {ix:6,name:t("By Industry")},
          {ix:7,name:t("By Funding & Area")},
          {ix:8,name:t("By Staff")},
          {ix:9,name:t("By Type")},
          {ix:10,name:t("By Sector")}
        ]
      }
      ];

    const selectedSection = _.find(sections, function(s) {
      return _.find(s.slides, function(slid){
        return slid.ix == selected;
      });
    });

    return (
      <div className="topic-block" id="economy">
        <div className="topic-header">
          <div className="topic-title">
            <h2>
              {t("Economy")}
              <small>
                <span className="pipe">|</span>
                {selectedSection.name}
              </small>
            </h2>
            <TopicSliderBullets
              name="economy"
              slides={children}
              selected={selected}
              goTo={this.goTo}
            />
          </div>
          <div className="topic-go-to-targets">
            <TopicSliderSections
              name="economy"
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
  )(Economy)
);
