import React, { Component } from "react";
import { Link } from "react-router";
import Slider from "react-slick";
import SvgImage from "components/SvgImage";
import "./TopicMenu.css";

import { AnchorLink } from "@datawheel/canon-core";

class TopicMenu extends Component {
  render() {
    const { topics } = this.props;

    return (
      <div id="topic-profile-menu" className="topic-menu">
        {topics.map(topic => (
          <AnchorLink
            className="topic-link subhead font-xxs"
            to={topic.slug}
            key={topic.slug}
          >
            <SvgImage src={`/images/profile-icon/icon-${topic.slug}.svg`} />
            <span>{topic.title}</span>
          </AnchorLink>
        ))}
      </div>
    );
  }
}

export default TopicMenu;
export { TopicMenu };
