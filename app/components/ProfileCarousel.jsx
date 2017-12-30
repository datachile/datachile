import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { getGeoObject } from "helpers/dataUtils";
import FeaturedBox from "components/FeaturedBox";
import "./ProfileCarousel.css";

class ProfileCarousel extends Component {
  static need = [];

  render() {
    const { t, type, title, description, items, limit } = this.props;

    return (
      <div className="profile-carousel">
        <div className="profile-carousel-icon">
          <img src={`/images/icons/icon-${type}-gris.svg`} />
        </div>
        <h4>{title}</h4>
        {description && <p>{description}</p>}
        <div className="profile-carousel-container">
          {items &&
            items
              .slice(0, limit)
              .map((f, i) => (
                <FeaturedBox
                  item={f}
                  className="profile-carousel-item"
                  key={i}
                />
              ))}
        </div>
      </div>
    );
  }
}

export default translate()(ProfileCarousel);
