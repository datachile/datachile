import React, { Component } from "react";
import { Link } from "react-router";
import Slider from "react-slick";
import "./TopicSliderBullets.css";

class TopicSliderBullets extends Component {
  render() {
    const { name, selected, goTo } = this.props;
    const slides = React.Children.toArray(this.props.slides);

    return (
      <div className="topic-slider-bullets">
        <ul id={name + "-bullets"}>
          {slides &&
            slides.map((m, ix) => (
              <li
                className={"bullet " + (selected == ix ? "selected" : "")}
                key={ix}
              >
                <a onClick={() => goTo(ix)} />
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default TopicSliderBullets;
export { TopicSliderBullets };
