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
      subsections.length > 1 &&
        <ul id={name + "-sub-sections"} className="topic-tab-list topic-slider-subsections u-list-reset">
          {subsections.map((ss, ix) => (
            <li className="topic-tab-item">
              <button
                className={ "topic-tab-button font-sm subhead u-btn-reset font-xs" + (selected == ss.ix ? " is-active" : "") }
                onClick={() => goTo(ss.ix)}>
                {ss.name}
              </button>
            </li>
          ))}
        </ul>
    );
  }
}

export default TopicSliderSubsections;
export { TopicSliderSubsections };
