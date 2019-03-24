import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";
import { sources } from "helpers/consts";
import { numeral } from "helpers/formatters";

import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";
import InfancyTooltip from "components/InfancyTooltip";

import { Disability } from "texts/GeoProfile";
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

    Axios.get(
      `/api/data?measures=Number of Students&drilldowns=Promotion Status,Education Level&captions=es&Year=latest&${geoType}=${
        geo.key
      }`
    ).then(resp => {
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
              {t(
                "En 2017, la deserción escolar en {{name}} fue de {{total}} estudiantes, siendo {{primary}} de Educación Básica y {{secondary}} de Educación Media.",
                {
                  name: geo.caption,
                  total: numeral(primary + secondary).format("0,0"),
                  primary: numeral(primary).format("0,0"),
                  secondary: numeral(secondary).format("0,0")
                }
              )}
            </p>
          </div>
          <div className="topic-slide-data" />
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(AbandonmentSlide);
