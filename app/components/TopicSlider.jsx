import React, { Component } from "react";
import Slider from "react-slick";
import { translate } from "react-i18next";
import "./TopicSlider.css";
import "../../node_modules/slick-carousel/slick/slick.css";
import { isMobile } from "helpers/responsiveUtils";

import { sendEvent } from "helpers/ga";

const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  lazyLoad: false,
  adaptiveHeight: true,
  fade: true
};

class TopicSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartsRendered: false
    };
  }

  afterChange = (d, id, currentSlide) => {
    sendEvent(id, d);

    if (this.state.chartsRendered) return;

    //disgusting code, just to trigger the new slide's charts render (d3plus).
    if (!__SERVER__) {
      setTimeout(() => {
        window.dispatchEvent(new Event("scroll"));
        //window.dispatchEvent(new Event("resize"));
        this.state.chartsRendered = true;
      }, 100);
    }
  };

  render() {
    const { children, selected, goTo, id } = this.props;

    const finalSettings = { ...settings, draggable: isMobile() };

    return (
      <div className="topic-slider">
        <Slider
          {...finalSettings}
          ref="topicSlider"
          slickGoTo={selected}
          afterChange={(a, currentSlide) => {
            this.afterChange(a, id, currentSlide);
          }}
        >
          {children}
        </Slider>
      </div>
    );
  }
}

export default translate()(TopicSlider);
