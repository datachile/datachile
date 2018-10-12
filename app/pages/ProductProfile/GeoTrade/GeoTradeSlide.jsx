import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

class GeoTradeSlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">Geo trade</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore dolorem, libero ipsum voluptatibus dolorum blanditiis quidem sint aspernatur laboriosam, pariatur sunt ducimus expedita facilis est cumque, iure molestias similique autem.</p>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(GeoTradeSlide);
