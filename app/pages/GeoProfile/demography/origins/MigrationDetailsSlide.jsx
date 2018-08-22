import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import { sources } from "helpers/consts";

import { simpleGeoDatumNeed } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";

import FeaturedDatum from "components/FeaturedDatum";

class MigrationDetailsSlide extends Section {
  static need = [
    simpleGeoDatumNeed(
      "datum_migration_origin_avg_age",
      "immigration",
      ["Average Age"],
      {
        drillDowns: [["Date", "Date", "Year"]],
        options: { parents: false },
        cuts: [`{[Date].[Date].[Year].&[${sources.immigration.year}]}`]
      }
    ),
    simpleGeoDatumNeed(
      "datum_migration_origin_avg_age_sex",
      "immigration",
      ["Average Age"],
      {
        drillDowns: [["Sex", "Sex", "Sex"]],
        options: { parents: false },
        cuts: [`{[Date].[Date].[Year].&[${sources.immigration.year}]}`]
      }
    )
  ];

  render() {
    const { children, t, i18n } = this.props;

    const locale = i18n.language;

    const {
      geo,
      datum_migration_origin_avg_age,
      datum_migration_origin,
      datum_migration_origin_female,
      datum_migration_origin_avg_age_sex
    } = this.context.data;

    const txt_slide = t("geo_profile.demographics.origin_by_sex_age", {
      last_year: sources.immigration.year,
      area: geo.caption,
      avg_age: numeral(datum_migration_origin_avg_age[0], locale).format(
        "(0.0)"
      ),
      percentage_female: numeral(
        datum_migration_origin_female / datum_migration_origin[1],
        locale
      ).format("(0.0%)"),
      percentage_male: numeral(
        1 - datum_migration_origin_female / datum_migration_origin[1],
        locale
      ).format("(0.0%)")
    });

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <h3 className="topic-slide-title">{t("Migration")}</h3>
          <p
            className="topic-slide-text"
            dangerouslySetInnerHTML={{ __html: txt_slide }}
          />
          {datum_migration_origin_avg_age_sex && (
            <div className="topic-slide-data">
              <FeaturedDatum
                className="l-1-2"
                icon="edad-femenino"
                datum={numeral(
                  datum_migration_origin_avg_age_sex[0],
                  locale
                ).format("(0.0)")}
                title={t("Female Average Age")}
                subtitle={t("in ") + sources.immigration.year}
              />
              <FeaturedDatum
                className="l-1-2"
                icon="edad-masculino"
                datum={numeral(
                  datum_migration_origin_avg_age_sex[1],
                  locale
                ).format("(0.0)")}
                title={t("Male Average Age")}
                subtitle={t("in ") + sources.immigration.year}
              />
            </div>
          )}
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(MigrationDetailsSlide);
