import React, { Component } from "react";
import { Link, browserHistory } from "react-router";
import Slider from "react-slick";
import { translate } from "react-i18next";
import "./TopicSlider.css";
import "../../node_modules/slick-carousel/slick/slick.css";

class TopicSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartsRendered: false
    };
  }

  render() {
    const { children, selected, goTo } = this.props;

    const afterChange = d => {
      if (this.state.chartsRendered) return;
      var canUseDOM = !!(
        typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
      );

      //disgusting code, just to trigger the new slide's charts render (d3plus).
      if (canUseDOM) {
        setTimeout(() => {
          window.dispatchEvent(new Event("scroll"));
          this.state.chartsRendered = true;
        }, 100);
      }
    };

    const beforeChange = d => {
      //goTo(d);
      //console.log("beforeChange", browserHistory.getCurrentLocation());
      //browserHistory.replace({ search: "?slide=" + d });
      /*browserHistory.push(
        browserHistory.getCurrentLocation().pathname + "#" + d
      );*/
    };

    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      lazyLoad: false
    };

    return (
      <div className="topic-slider">
        <Slider
          {...settings}
          ref="topicSlider"
          slickGoTo={selected}
          afterChange={afterChange}
          /* beforeChange={beforeChange} */
        >
          {children}
        </Slider>
      </div>
    );
  }
}

export default translate()(TopicSlider);
