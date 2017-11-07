import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";

import TopicSlider from "components/TopicSlider";
import TopicSliderBullets from "components/TopicSliderBullets";
import TopicSliderSections from "components/TopicSliderSections";

class Topic extends Component {
  static need = [];

  constructor(props) {
    super(props);
    this.goTo = this.goTo.bind(this);
    this.state = { selected: 0 };
  }

  goTo(n) {
    this.setState({ selected: n });
  }

  render() {
    const { t, children, name, id } = this.props;
    const { selected } = this.state;

    let i = 0;
    const sections = this.props.sections.map(s => {
      return {
        name: s.name,
        slides: s.slides.map(sl => ({
          ix: i++,
          name: sl
        }))
      };
    });

    const selectedSection = _.find(sections, function(s) {
      return _.find(s.slides, function(slid) {
        return slid.ix == selected;
      });
    });

    return (
      <div className="topic-block" id={id}>
        <div className="topic-header">
          <div className="topic-title">
            <h2>
              {name}
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
  )(Topic)
);
