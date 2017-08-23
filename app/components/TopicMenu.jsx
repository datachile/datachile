import React, { Component } from "react";
import { Link } from "react-router";
import Slider from "react-slick";
import SvgImage from "components/SvgImage";
import "./TopicMenu.css";

class TopicMenu extends Component {
  render() {
    const { topics } = this.props;

    return (
      <div className="topic-menu">
        {topics.map(topic =>
          <a key={topic.slug} className="topic-link" href={`#${topic.slug}`}>
            <SvgImage src={`/images/profile-icon/icon-${topic.slug}.svg`} />
            <span>
              {topic.title}
            </span>
          </a>
        )}
      </div>
    );
  }
}

export default TopicMenu;
export { TopicMenu };
