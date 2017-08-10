import React, { Component } from "react";
import { Link } from "react-router";
import Slider from "react-slick";
import "./TopicSlider.css";
import "../../node_modules/slick-carousel/slick/slick.css";

class TopicSlider extends Component {
  render() {
    const { children, slug, name, targets } = this.props;

    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      lazyLoad: true
    };

    return (
      <div className="topic-slider">
        <Slider {...settings}>
          {children}
        </Slider>
      </div>
    );
  }
}

export default TopicSlider;
export { TopicSlider };
