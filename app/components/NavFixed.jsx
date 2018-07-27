import React from "react";
import { translate } from "react-i18next";
import { Link } from "react-router";
import { select } from "d3-selection";
import Search from "components/Search";

import SvgImage from "components/SvgImage";

import "./NavFixed.css";

class NavFixed extends React.Component {
  state = { visible: false, active: "about", search_visible: false };

  toggleSearch = () => {
    this.setState(prevState => ({
      search_visible: !prevState.search_visible
    }));
  };

  handleScroll = () => {
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
          <div className={`nav-titles ${search_visible ? "close" : "open"}`}>
            <div className="nav-titles-action">
              <a className="menu-button" onClick={toggleSubNav}>
                <img src="/images/icons/icon-menu.svg" />
                {/*<img src={`/images/icons/${search_icon}.svg`} />*/}
              </a>
            </div>
            <Link className="datachile" to="/">
              <img src="/images/logos/datachile-beta-navbar.svg" />
            </Link>
            <span className="title" onClick={toggleSubNav}>
              {title}
            </span>
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

export default translate()(NavFixed);
