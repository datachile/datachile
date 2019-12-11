import {sendEvent} from "helpers/ga";
import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import Slider from "react-slick";
import "./TopicSlider.css";
import "../../node_modules/slick-carousel/slick/slick.css";

const settings = {
  dots: false,
  infinite: true,
  swipe: false,
  touchMove: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  lazyLoad: false,
  adaptiveHeight: true
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
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.slider.slickGoTo(nextProps.selected, true);
  }

  render() {
    const {children, id} = this.props;

    return (
      <div className="topic-slider">
        <Slider
          ref={slider => (this.slider = slider)}
          {...settings}
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

export default withNamespaces()(TopicSlider);
