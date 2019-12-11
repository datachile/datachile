import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

class HigherEducationSlide extends Section {
  static need = [];

  render() {
    const { children, t, i18n } = this.props;

    const locale = i18n.language;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title">{t("Higher Education")}</h3>
          <p className="topic-slide-text">
            
          </p>
          <div className="topic-slide-data">
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(HigherEducationSlide);
