import React, { Component } from "react";
import find from "lodash/find";

import "./TopicSliderTabs.css";

class TopicSliderTabs extends Component {
  render() {
    const { name, sections, selected, goTo } = this.props;

    const selectedSection = find(sections, function(s) {
      return find(s.slides, function(slid) {
        return slid.ix == selected;
      });
    });

    // const subsections = selectedSection ? selectedSection.slides : [];

    return (
      <ul id={name + "-sections"} className="topic-tab-list u-list-reset">
        {sections &&
          sections.map((s, ix) => (
            <li className="topic-tab-item" key={ix}>
              <button
                className={
                  "topic-tab-button font-sm subhead u-btn-reset" +
                  (selectedSection == s ? " is-active" : "")
                }
                onClick={() => goTo(s.slides[0].ix)}
              >
                {s.name}
              </button>
            </li>
          ))}
      </ul>
    );
  }
}

export default TopicSliderTabs;
export { TopicSliderTabs };
