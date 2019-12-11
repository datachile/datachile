import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

class EmployabilitySlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title">{t("Employability")}</h3>
          <div className="topic-slide-text" />
          <div className="topic-slide-data" />
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(EmployabilitySlide);
