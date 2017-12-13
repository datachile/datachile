import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import { getGeoObject } from "helpers/dataUtils";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { trade_by_time_and_product } from "helpers/aggregations";

import FeaturedDatum from "components/FeaturedDatum";

class PSUNEMSlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .drilldown("Date", "Year")
              .drilldown("Export HS", "HS2")
              .measure("FOB US")
              .measure("Geo Rank Across Time"),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          const result = trade_by_time_and_product(
            res.data.data,
            "FOB US",
            geo.type != "country",
            store.i18n.locale
          );
          return {
            key: "text_data_exports_by_product",
            data: result
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { children, t } = this.props;

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">Performance</div>
          <div className="topic-slide-text">
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec
              hendrerit tempor tellus. Donec pretium posuere tellus. Proin quam
              nisl, tincidunt et, mattis eget, convallis nec, purus. Cum sociis
              natoque penatibus et magnis dis parturient montes, nascetur
              ridiculus mus. Nulla posuere. Donec vitae dolor. Nullam tristique
              diam non turpis. Cras placerat accumsan nulla. Nullam rutrum. Nam
              vestibulum accumsan nisl.
            </p>
          </div>
          <div className="topic-slide-data">
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum="XXX"
              title={t("Trade volume")}
              subtitle=""
            />
            <FeaturedDatum
              className="l-1-3"
              icon="empleo"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
            <FeaturedDatum
              className="l-1-3"
              icon="industria"
              datum="xx"
              title="Lorem ipsum"
              subtitle="Lorem blabla"
            />
          </div>
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(PSUNEMSlide);
