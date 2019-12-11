import React, { Component } from "react";
import { Link } from "react-router";
import { withNamespaces } from "react-i18next";
import "./LevelWarning.css";

// Displays a warning about the data coming from the parent profile and links to it
class LevelWarning extends Component {
  constructor() {
    super();
  }

  // NOTE: this component expects `location.pathname` to be passed as the `path` prop
  render() {
    const { name, path, t } = this.props;
    // const { } = this.state;

    // grab parent URL
    const parentPath = path
      ? path.substring(0, path.lastIndexOf("/"))
      : null;
    // grab parent category
    let parentCategory = parentPath
      ? parentPath.substring(0, parentPath.lastIndexOf("/"))
      : null;

    // industry warning catch
    if (parentCategory === "/industries") {
      parentCategory = "industry";
    }

    return (
      <p className="level-warning font-xxs">
        <span className="level-warning-icon bp3-icon bp3-icon-warning-sign" />
        <span className="level-warning-text">
          {t(`${parentCategory}_profile.warning`)}
        </span>
        <Link to={parentPath} className="level-warning-link link">
          {name}
        </Link>
      </p>
    );
  }
}

export default withNamespaces()(LevelWarning);
