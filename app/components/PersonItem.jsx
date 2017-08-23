import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router";
import "./PersonItem.css";

class PersonItem extends Component {
  render() {
    const { img, name, subtitle, className } = this.props;

    return (
      <div className={"person-item " + className}>
        <div className="person-item-img">
          <img src={img} />
        </div>
        <div className="person-item-name">
          {name}
        </div>
        <div className="person-item-subtitle">
          {subtitle}
        </div>
      </div>
    );
  }
}

export default PersonItem;
