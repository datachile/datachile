import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import Select from "components/Select";

import "./ExportLink.css";

class ExportLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  }

  render() {
    const { t, path } = this.props;

    if (!path) return null; //Prevent error when path is not loaded yet

    const { open } = this.state;

    const options = [
      { caption: "CSV", path: path.replace("jsonrecords", "csv") },
      { caption: "XLS", path: path.replace("jsonrecords", "xls") },
      { caption: "JSON", path: path }
    ];

    return (
      <div className="export-link">
        <a
          className={open ? "toggle open" : "toggle close"}
          onClick={this.toggleMenu}
        >
          <img src={`/images/icons/icon-download.svg`} />
        </a>
        <ul className={open ? "open" : "close"}>
          {options.map(o => (
            <li>
              <a target="_blank" href={o.path}>
                {o.caption}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default translate()(
  connect(
    state => ({
      sources: state.sources
    }),
    {}
  )(ExportLink)
);
