import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";

class CustomNextArrow extends Component {
  render() {
    return (
      <a
        style={this.props.style}
        className={this.props.className}
        onClick={this.props.onClick}
      >
        <span className="pt-icon-standard pt-icon-chevron-right" />
      </a>
    );
  }
}

export default translate()(CustomNextArrow);
