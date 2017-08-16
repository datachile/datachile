import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, browserHistory } from "react-router";
import Slider from "react-slick";
import { translate } from "react-i18next";
import "./TopicSlider.css";
import "../../node_modules/slick-carousel/slick/slick.css";

class TopicSlider extends Component {
  componentWillReceiveProps(nextProps) {
    console.log("TOPIC SLIDER", nextProps);
    /*if (nextProps.selected !== this.state.selected) {
      //this.setState({ selected: nextProps.selected });
      //this.refs.slider.slickGoTo(nextProps.selected);
    }*/
  }

  render() {
    const { children, selected, goTo } = this.props;

    console.log("selected en topic slider", selected);

    const afterChange = d => {
      goTo(d);
      console.log("afterChange", browserHistory.getCurrentLocation());
      //browserHistory.replace({ search: "?slide=" + d });
      /*browserHistory.push(
        browserHistory.getCurrentLocation().pathname + "#" + d
      );*/
    };

    const beforeChange = d => {
      //goTo(d);
      console.log("beforeChange", browserHistory.getCurrentLocation());
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
      lazyLoad: true
    };

    return (
      <div className="topic-slider">
        <Slider
          {...settings}
          slickGoTo={selected}
          afterChange={afterChange}
          beforeChange={beforeChange}>
          {children}
        </Slider>
      </div>
    );
  }
}

export default translate()(connect(state => ({}), {})(TopicSlider));
