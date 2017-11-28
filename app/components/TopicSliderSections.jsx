import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router";
import Slider from "react-slick";
import "./TopicSliderSections.css";

class TopicSliderSections extends Component {
  render() {
    const { name, sections, selected, goTo } = this.props;

    const selectedSection = _.find(sections, function(s) {
      return _.find(s.slides, function(slid) {
        return slid.ix == selected;
      });
    });

    const subsections = selectedSection ? selectedSection.slides : [];

    return (
      <div className="topic-slider-sections">
        <ul id={name + "-sections"}>
          {sections &&
            sections.map((s, ix) => (
              <span className="section-block">
                <li
                  className={
                    "section-item " + (selectedSection == s ? "selected" : "")
                  }
                >
                  <a onClick={() => goTo(s.slides[0].ix)}>{s.name}</a>
                </li>
                <span className="pipe">|</span>
              </span>
            ))}
        </ul>
        <ul id={name + "-sub-sections"}>
          {subsections &&
            subsections.map((ss, ix) => (
              <span className="section-block">
                <li
                  className={
                    "sub-section-item " + (ss.ix == selected ? "selected" : "")
                  }
                >
                  <a onClick={() => goTo(ss.ix)}>{ss.name}</a>
                </li>
                <span className="pipe pipe-small">|</span>
              </span>
            ))}
        </ul>
      </div>
    );
  }
}

export default TopicSliderSections;
export { TopicSliderSections };
