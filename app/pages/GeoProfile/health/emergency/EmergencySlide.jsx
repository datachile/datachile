import React from "react";
import { translate } from "react-i18next";
import { Section } from "@datawheel/canon-core";

import { simpleDatumNeed } from "helpers/MondrianClient";

import FeaturedDatum from "components/FeaturedDatum";
import LevelWarning from "components/LevelWarning";

import Axios from "axios";
import numeral from "numeral";

class EmergencySlide extends Section {
  constructor(props) {
    super(props);
    this.state = {
      total: undefined,
      childhood: undefined
    };
  }

  componentDidMount() {
    const { geo } = this.context.data;
    let dd = undefined;
    let key = undefined;
    if (geo.depth > 0) {
      dd = "Region";
      key = geo.depth === 2 ? geo.ancestor.key : geo.key;
    }
    let path = `/api/data?measures=Total&drilldowns=Age,Year&parents=true&Year=2018`;
    if (dd) path += `&${dd}=${key}`;

    Axios.get(path).then(resp => {
      const data = resp.data.data.filter(d => d["ID Year"] === 2018);
      const total = data.reduce((all, d) => all + d["Total"], 0);
      const childhood = data
        .filter(d => [1, 2].includes(d["ID Age"]))
        .reduce((all, d) => all + d["Total"], 0);
      this.setState({ total, childhood });
    });
  }

  render() {
    const { children, path, t, i18n } = this.props;
    const { geo } = this.context.data;

    let name = "Chile";
    if (geo.depth > 0) {
      name = geo.depth === 2 ? geo.ancestor.caption : geo.caption;
    }

    const locale = i18n.language;
    const { total, childhood } = this.state;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title u-visually-hidden">
            {t("Emergency Care")}
          </h3>
          <div className="topic-slide-text">
            <p>
              {t("In 2018 there were {{total}} Emergency Care attentions in {{name}}, with a {{rate}} of the attentions being children between 0 to 4 years old.",
                {
                  total: numeral(total).format("0,0"),
                  name,
                  rate: numeral(childhood / total).format("0.0%")
                }
              )}
            </p>
          </div>
          <div className="topic-slide-data">
            {this.context.data.geo.depth > 1 && (
              <LevelWarning
                name={this.context.data.geo.ancestors[0].caption}
                path={path}
              />
            )}
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(EmergencySlide);
