import React, { Component } from "react";
import ReactImageFallback from "react-image-fallback";
import _ from "lodash";
import { Link } from "react-router";
import "./PersonItem.css";

class PersonItem extends Component {
  render() {
    const { imgpath, name, subtitle, className } = this.props;

    return (
      <div className={"person-item " + className}>
        <div className="person-item-img">
          <ReactImageFallback
            src={imgpath}
            fallbackImage="/images/authorities/dummy.jpg"
            initialImage="/images/loader.gif"
            alt={name}
            className="person-item-img-react"
          />
        </div>
        <div className="person-item-name">{name}</div>
        <div className="person-item-subtitle">{subtitle}</div>
      </div>
    );
  }
}

export default PersonItem;
