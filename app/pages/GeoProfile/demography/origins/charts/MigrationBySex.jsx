import React from "react";
import { Section } from "@datawheel/canon-core";
import { withNamespaces } from "react-i18next";
import { BarChart } from "d3plus-react";
import { Switch } from "@blueprintjs/core";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { COLORS_GENDER } from "helpers/colors";
import { numeral } from "helpers/formatters";

import SourceTooltip from "components/SourceTooltip";
import ExportLink from "components/ExportLink";

export default withNamespaces()(
  class MigrationBySex extends Section {
    state = {
      stacked: true
    };
    static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("immigration").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", true)
              .drilldown("Date", "Date", "Year")
              .drilldown("Sex", "Sex", "Sex")
              .measure("Number of visas"),
            store.i18n.locale
          );
          return {
            key: "path_migration_by_sex",
            data: __API__ + q.path("jsonrecords")
          };
        });

        return {
          type: "GET_DATA",
          promise: prm
        };
      }
    ];

    // to stack, or not to stack
    toggleStacked() {
      this.setState({
        stacked: !this.state.stacked
      });
    }

    render() {
      const { t, className, i18n } = this.props;
      const { stacked } = this.state;
      const path = this.context.data.path_migration_by_sex;

      const locale = i18n.language;
      const classSvg = "migration-by-sex";

      return (
        <div className={className}>
          <h3 className="chart-title">
            <span>
              {t("Migration By Sex")}
              <SourceTooltip cube="immigration" />
            </span>
            <ExportLink path={path} className={classSvg} />
          </h3>
          <BarChart
            className={classSvg}
            config={{
              height: 400,
              data: path,
              groupBy: "ID Sex",
              label: d => d["Sex"],
              x: "Year",
              discrete: "x",
              y: "Number of visas",
              stacked: stacked,
              shapeConfig: {
                fill: d => COLORS_GENDER[d["ID Sex"]]
              },
              xConfig: {
                title: false
              },
              yConfig: {
                title: t("Visas"),
                tickFormat: tick => numeral(tick, locale).format("(0.[0]a)")
              },
              barPadding: 0,
              groupPadding: 10,
              tooltipConfig: {
                title: d => t(d["Sex"]),
                body: d =>
                  numeral(d["Number of visas"], locale).format("( 0,0 )") +
                  " " +
                  t("visas")
              },
              legendConfig: {
                label: false,
                shapeConfig: {
                  backgroundImage: d =>
                    "/images/legend/sex/" + d["ID Sex"] + ".png"
                }
              }
            }}
            dataFormat={data => data.data}
          />
          {/* stacked bar toggle */}
          <Switch
            onClick={this.toggleStacked.bind(this)}
            label={t("Stacked bars")}
            defaultChecked={stacked}
          />
        </div>
      );
    }
  }
);
