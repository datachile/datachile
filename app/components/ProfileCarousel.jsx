import React, { Component } from "react";
import { translate } from "react-i18next";
import { getGeoObject } from "helpers/dataUtils";
import ProfileTile from "components/ProfileTile";
import "./ProfileCarousel.css";

class ProfileCarousel extends Component {
  static need = [];

  render() {
    const { t, type, title, description, items, limit } = this.props;

    return (
      <div className="profile-carousel">
        <h3 className={`profile-carousel-title color-${type}`}>
          <img
            className="profile-carousel-title-icon"
            src={`/images/icons/icon-home-${type}.svg`}
          />
          <span className="profile-carousel-title-text">{title}</span>
        </h3>
        {description && <p>{description}</p>}
        <div className="tile-list">
          {items &&
            items
              .slice(0, limit)
              .map((f, i) => <ProfileTile item={f} key={i} />)}
        </div>
      </div>
    );
  }
}

export default translate()(ProfileCarousel);
