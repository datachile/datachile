import React, { Component } from "react";
import find from "lodash/find";

import "./TopicSliderSubsections.css";

class TopicSliderSubsections extends Component {
  render() {
    const { name, sections, selected, goTo } = this.props;

    const selectedSection = find(sections, function(s) {
      return find(s.slides, function(slid) {
        return slid.ix == selected;
      });
    });

    const subsections = selectedSection ? selectedSection.slides : [];

    return (
      <ul id={name + "-sub-sections"} className="topic-slider-subsections u-list-reset">
        {subsections &&
          subsections.map((ss, ix) => (
            <li className={
                "sub-section-item " + (ss.ix == selected ? "selected" : "")
              }
            >
              <a onClick={() => goTo(ss.ix)}>{ss.name}</a>
            </li>
          ))}
      </ul>
    );
  }
}

export default TopicSliderSubsections;
export { TopicSliderSubsections };
