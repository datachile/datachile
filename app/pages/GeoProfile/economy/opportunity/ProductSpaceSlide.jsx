import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";

class ProductSpaceSlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;
    const { geo } = this.context.data;

    const text = { geo };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title">
            {t("Opportunity in Products")}
          </h3>
          <div
            className="topic-slide-text-full"
            dangerouslySetInnerHTML={{
              __html: t("geo_profile.economy.product_space", text)
            }}
          />

          <h4 className="topic-slide-context-subhead">
            {t("About the RCA index")}
          </h4>
          <p className="font-xxs">
            {t("geo_profile.economy.rca")}
          </p>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(ProductSpaceSlide);
