import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import find from "lodash/find";

import TopicSlider from "components/TopicSlider";
// import TopicSliderBullets from "components/TopicSliderBullets";
import TopicSliderTabs from "components/TopicSliderTabs";
import TopicSliderSubsections from "components/TopicSliderSubsections";

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
    const { t, children, name, id, slider } = this.props;
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

    const selectedSection = find(sections, function(s) {
      return find(s.slides, function(slid) {
        return slid.ix == selected;
      });
    });

    return (
      <div id={id} className="topic-block">
        <span className="topic-anchor-link" />
        <div className="topic-header">
          <h2 className="topic-heading font-xl">{name}</h2>
          {slider && (
            <div className="topic-go-to-targets">
              <TopicSliderTabs
                name={id}
                sections={sections}
                selected={selected}
                goTo={this.goTo}
              />
            </div>
          )}
        </div>
        <div className="topic-slide-container">

          {slider && (
            <TopicSliderSubsections
              name={id}
              sections={sections}
              selected={selected}
              goTo={this.goTo}
            />
          )}

          {slider && (
            <TopicSlider key={id} id={id} selected={selected} goTo={this.goTo}>
              {children}
            </TopicSlider>
          )}
          {!slider && <div className="linear-topic-slides"> {children} </div>}
        </div>
      </div>
    );
  }
}

Topic.defaultProps = {
  slider: true
};

export default withNamespaces()(Topic);
