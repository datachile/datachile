import React from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import sum from "lodash/sum";

import { sources } from "helpers/consts";
import mondrianClient, {
  geoCut,
  simpleAvailableGeoDatumNeed
} from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { numeral, slugifyItem } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class ServicesAccessSlide extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return simpleAvailableGeoDatumNeed(
        "datum_network_electricity_households",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Electricity", "Electricity", "Electricity"]],
          options: { parents: false },
          cuts: [
            `[Date].[Date].[Year].&[${sources.casen_household.year}]`,
            "{[Electricity].[Electricity].[Electricity].&[1],[Electricity].[Electricity].[Electricity].&[2],[Electricity].[Electricity].[Electricity].&[3]}"
          ]
        }
      )(params, store);
    },
    (params, store) => {
      const geo = getGeoObject(params);
      const msrName =
        geo.type == "comuna"
          ? "Expansion Factor Comuna"
          : "Expansion Factor Region";
      return simpleAvailableGeoDatumNeed(
        "datum_household_total",
        "casen_household",
        [msrName],
        {
          drillDowns: [["Date", "Date", "Year"]],
          options: { parents: false },
          cuts: [`[Date].[Date].[Year].&[${sources.casen_household.year}]`]
        }
      )(params, store);
    }
  ];

  render() {
    const { children, t, i18n } = this.props;
    const {
      datum_network_electricity_households,
      datum_household_total,
      geo
    } = this.context.data;

    const locale = i18n.locale;

    const area = datum_network_electricity_households.available
      ? geo
      : geo.ancestors[0];

    const total_network_electricity = sum(
      datum_network_electricity_households.data
    );

    const datum = datum_network_electricity_households.available
      ? numeral(
          total_network_electricity / datum_household_total.data,
          locale
        ).format("(0.0%)")
      : t("no_datum");

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">{t("Services Access")}</div>
          <div className="topic-slide-text">
            {datum_network_electricity_households &&
              !datum_network_electricity_households.available && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("no_info", {
                      yes: area.caption,
                      link: slugifyItem("geo", area.key, area.name),
                      no: geo.caption
                    })
                  }}
                />
              )}
            <p>
              Aliquam erat volutpat. Nunc eleifend leo vitae magna. In id erat
              non orci commodo lobortis. Proin neque massa, cursus ut, gravida
              ut, lobortis eget, lacus.
            </p>
          </div>
          <div className="topic-slide-data">
            {datum_network_electricity_households &&
              datum_household_total && (
                <FeaturedDatum
                  className="l-1-3"
                  icon="empleo"
                  datum={datum}
                  title={t("Connected to electricity network")}
                  subtitle={
                    datum_network_electricity_households.available
                      ? numeral(total_network_electricity, locale).format(
                          "(0.0 a)"
                        ) +
                        t(" in ") +
                        area.caption
                      : ""
                  }
                />
              )}
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

export default translate()(ServicesAccessSlide);
