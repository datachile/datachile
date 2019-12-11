import React, { Component } from "react";
import { Link } from "react-router";
import { withNamespaces } from "react-i18next";

import "./LinksList.css";

class LinksList extends Component {
  constructor(props) {
    super(props);
    // this.toggleList = this.toggleList.bind(this);
    // this.state = {
    //   openList: false
    // };
  }

  // toggleList() {
  //   this.setState({
  //     openList: !this.state.openList
  //   });
  // }

  render() {
    // if (!this.state) {
    //   return null;
    // }

    const { category, list, open, t, title } = this.props;
    // const { openList } = this.state;

    // const openClass = openList ? "open-list" : "";
    // const openText = openList ? t("See less") : t("See more");

    const render = list && list.length > 0 ? true : false;

    let categoryClasses = "category font-xxs";
    if (category) {
      categoryClasses += ` color-${category}`;
    }

    return (
      render && (
        <div className="links-list-container">
          <h3>{title}</h3>
          <div className="links-list-inner">
            <ul className="links-list u-list-reset">
              {list.map((l, i) => (
                <li className="links-list-item" key={i}>
                  <Link
                    className={categoryClasses}
                    to={l.link}
                    title={l.label.length > 22 ? l.label : null}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    );
  }
}

export default withNamespaces()(LinksList);
