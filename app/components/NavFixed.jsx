import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { connect } from "react-redux";

import { FORMATTERS } from "helpers/formatters";

import SvgImage from "components/SvgImage";

import "./NavFixed.css";

class NavFixed extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", this.handleScroll);
    }
  }

  componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  handleScroll() {
    const ref = document.getElementById("topic-profile-menu");
    if (ref && ref.offsetTop < window.scrollY) {
      if (this.state.visible != true) {
        this.setState({ visible: true });
      }
    } else {
      if (this.state.visible != false) {
        this.setState({ visible: false });
      }
    }
  }

  componentWillReceiveProps(nextProps) {}

  render() {
    const { t, topics, title, toggleSubNav } = this.props;
    const { visible } = this.state;

    return (
      <nav className={`nav-fixed${visible ? "" : " hidden"}`}>
        <div className="nav-entity">
          <div className="nav-titles">
            <div className="menu-button">
              <a onClick={toggleSubNav}>
                <img src="/images/icons/icon-menu.svg" />
              </a>
            </div>
            <span className="datachile">DataChile:</span> {title}
          </div>
          <div className="nav-topic">
            {topics &&
              topics.length > 0 && (
                <div className="topics">
                  {topics.map(topic => (
                    <a
                      key={topic.slug}
                      className={`topic-link`}
                      href={`#${topic.slug}`}
                    >
                      <SvgImage
                        src={`/images/profile-icon/icon-${topic.slug}.svg`}
                      />
                      {topic.title}
                    </a>
                  ))}
                </div>
              )}
            <div className="nav-search">
              <img src="/images/icons/icon-lupa-header.svg" />
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default translate()(
  connect(
    state => ({
      focus: state.focus
    }),
    {}
  )(NavFixed)
);
