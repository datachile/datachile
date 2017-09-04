import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router";
import Slider from "react-slick";
import "./TopicSliderSections.css";

class TopicSliderSections extends Component {
  render() {
    const { name, sections, selected, goTo } = this.props;

    return (
      <div className="topic-slider-sections">
        <ul id={name + "-sections"}>
          {sections &&
            sections.map((s, ix) =>
              <span>
                <li
                  className={
                    "section-item " +
                    (_.indexOf(s.slides, selected) > -1 ? "selected" : "")
                  }>
                  <a onClick={() => goTo(s.slides[0])}>
                    {s.name} 
                    {s && s.slides && s.slides.length>1 && 
                      <span> ({s.slides.length})</span>
                    }
                  </a>
                </li>
                <span className="pipe">|</span>
              </span>
            )}
        </ul>
      </div>
    );
  }
}

export default TopicSliderSections;
export { TopicSliderSections };
