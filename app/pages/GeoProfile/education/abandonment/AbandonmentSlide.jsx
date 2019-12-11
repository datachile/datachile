import React from "react";
import { withNamespaces } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import { numeral } from "helpers/formatters";

import Axios from "axios";

class AbandonmentSlide extends Section {
  constructor(props) {
    super(props);
    this.state = {
      primary: undefined,
      secondary: undefined,
      total: undefined
    };
  }
  componentDidMount() {
    const { geo } = this.context.data;
    const geoType =
      geo.type.substring(0, 1).toUpperCase() + geo.type.substring(1);

    let path =
      "/api/data?measures=Number of Students&drilldowns=Promotion Status,Education Level&captions=es&Year=latest";
    if (geo.depth > 0) path += `&${geoType}=${geo.key}`;

    Axios.get(path).then(resp => {
      const data = resp.data.data;
      const primary = data.find(d => d["ID Education Level"] === 1) || {};
      const secondary = data.find(d => d["ID Education Level"] === 2) || {};
      this.setState({
        primary: primary["Number of Students"],
        secondary: secondary["Number of Students"]
      });
    });
  }
  render() {
    const { children, path, t, i18n } = this.props;
    const { primary, secondary } = this.state;

    const { geo } = this.context.data;

    const locale = i18n.language;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Abandonment Rate")}
          </h3>
          <div className="topic-slide-text">
            <p>
              {t("abandonment_rate", {
                name: geo.caption,
                total: numeral(primary + secondary, locale).format("0,0"),
                primary: numeral(primary, locale).format("0,0"),
                secondary: numeral(secondary, locale).format("0,0")
              })}
            </p>
          </div>
          <div className="topic-slide-data" />
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default withNamespaces()(AbandonmentSlide);
