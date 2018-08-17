import React, { Component } from "react";
import ReactImageFallback from "react-image-fallback";
import "./PersonItem.css";

class PersonItem extends Component {
  render() {
    const { imgpath, name, subtitle, className } = this.props;

    return (
      <figure className={"person-item " + className}>
        <div className="person-figure">
          <ReactImageFallback
            src={imgpath}
            fallbackImage="/images/authorities/dummy.jpg"
            initialImage="/images/loader.gif"
            alt=""
            className="person-img"
          />
        </div>
        <figcaption className="person-caption">
          {/* name converted to title case via css */}
          <h4 className="person-title font-xs">{name.toLowerCase()}</h4>
          <p className="person-subtitle font-xxs">{subtitle}</p>
        </figcaption>
      </figure>
    );
  }
}

export default PersonItem;
