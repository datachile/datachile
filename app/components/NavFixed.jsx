import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router";
import { connect } from "react-redux";
import { select } from "d3-selection";
import Search from "components/Search";

import SvgImage from "components/SvgImage";

import "./NavFixed.css";

class NavFixed extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, active: "about", search_visible: false };

    this.handleScroll = this.handleScroll.bind(this);
  }

  toggleSearch = () => {
    this.setState(prevState => ({
      search_visible: !prevState.search_visible
    }));
  };

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
    let { visible, active } = this.state;

    /*Show fixed nav*/
    const ref = document.getElementById("topic-profile-menu");
    visible = ref && ref.offsetTop < window.scrollY ? true : false;

    /*Show active topic*/
    const { topics } = this.props;
    if (topics) {
      topics.forEach(topic => {
        const elem = document.getElementById(topic.slug);
        const top = elem ? elem.getBoundingClientRect().top : 1;
        if (top <= 0) active = topic.slug;
      });
    }
    if (this.state.visible != visible || this.state.active != active) {
      this.setState({ visible: visible, active: active });
    }
  }

  render() {
    const { t, topics, title, toggleSubNav } = this.props;
    const { visible, active, search_visible } = this.state;

    const search_icon = search_visible ? "icon-close" : "icon-search";

    if (typeof document != "undefined") {
      const node = select(".search-nav-fixed input").node();
      if (node) {
        if (search_visible) {
          node.focus();
        } else {
          node.blur();
        }
      }
    }

    return (
      <nav className={`nav-fixed${visible ? "" : " hidden"}`}>
        <div className="nav-entity">
          <div className="nav-titles">
            <div className="nav-titles-action">
              <div className="menu-button">
                <a onClick={toggleSubNav}>
                  <img src="/images/icons/icon-menu.svg" />
                </a>
              </div>
            </div>
            <div className="datachile" onClick={this.toggleSearch}>
              <img src="/images/logos/logo-dc-beta-small.svg" />
            </div>
            <span
              className={`title ${search_visible ? "close" : "open"}`}
              onClick={this.toggleSearch}
            >
              {title}
            </span>
            <div
              className={`search-nav-container ${
                search_visible ? "open" : "close"
              }`}
            >
              <div className={`search-nav-wrapper`}>
                <Search className="search-nav search-nav-fixed" />
              </div>
              <a className="search-toggle-nav" onClick={this.toggleSearch}>
                <img src={`/images/icons/${search_icon}.svg`} />
              </a>
            </div>
          </div>
          <div className="nav-topic">
            {topics &&
              topics.length > 0 && (
                <div className="topics">
                  {topics.map(topic => (
                    <a
                      key={topic.slug}
                      className={`topic-link ${
                        active == topic.slug ? " active" : ""
                      }`}
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
