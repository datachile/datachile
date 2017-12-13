import React from "react";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";
import groupBy from "lodash/groupBy";
import isEqual from "lodash/isEqual";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { employmentColorScale } from "helpers/colors";
import { numeral } from "helpers/formatters";

import MiniFilter from "components/MiniFilter";
import ExportLink from "components/ExportLink";

class MigrationByActivity extends Section {
  state = {
    filter_sex: 2147483647,
    filter_age: 2147483647
  };

  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient
        .cube("immigration")
        .then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .option("parents", false)
              .drilldown("Date", "Date", "Year")
              .drilldown("Sex", "Sex", "Sex")
              .drilldown(
                "Calculated Age Range",
                "Calculated Age Range",
                "Age Range"
              )
              .drilldown("Activity", "Activity", "Activity")
              .measure("Number of visas"),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "path_migration_by_activity",
            data: {
              path: res.url.replace("aggregate", "aggregate.jsonrecords"),
              raw: res.data,
              age_ranges: Object.keys(groupBy(res.data.data, "Age Range")).sort(
                (a, b) => parseInt(a.split("-")[0]) - parseInt(b.split("-")[0])
              )
            }
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  toggleFilter = (key, flag) => {
    console.log(key, flag, this.state[key] ^ flag);
    this.setState(prevState => ({ [key]: prevState[key] ^ flag }));
  };

  render() {
    const { t, className, i18n } = this.props;

    const locale = i18n.locale;
    const migration_data = this.context.data.path_migration_by_activity;

    const filter_sex = this.state.filter_sex;
    const filter_age = this.state.filter_age;

    const flags_ageranges = {};
    const age_ranges = migration_data.age_ranges || [];

    const filters = [
      {
        name: t("Gender"),
        key: "filter_sex",
        value: filter_sex,
        items: [{ label: t("Male"), flag: 1 }, { label: t("Female"), flag: 2 }]
      },
      {
        name: t("Age"),
        key: "filter_age",
        value: filter_age,
        items: age_ranges.map((range, i) => {
          flags_ageranges[range] = Math.pow(2, i);
          return {
            label: range,
            flag: Math.pow(2, i)
          };
        })
      }
    ];

    return (
      <div className={className}>
        <h3 className="chart-title">
          <span>{t("Migration By Activity")}</span>
          <ExportLink path={migration_data.path} />
        </h3>
        <MiniFilter onClick={this.toggleFilter} filters={filters} />
        <Treemap
          config={{
            height: 500,
            data: migration_data.raw,
            groupBy: ["ID Activity"],
            label: d => d["Activity"],
            time: "ID Year",
            sum: d => d["Number of visas"],
            total: d => d["Number of visas"],
            shapeConfig: {
              fill: d => employmentColorScale(d["ID Activity"])
            },
            tooltipConfig: {
              title: d => d["Activity"],
              body: d =>
                numeral(d["Number of visas"], locale).format("( 0,0 )") +
                " " +
                t("visas")
            },
            legendConfig: {
              label: false,
              shapeConfig: false
            }
          }}
          dataFormat={data => {
            // console.log(data.data);
            const flag_ar = flags_ageranges[d["Age Range"]];
            console.log(flag_ar);

            const filtered = data.data.filter(
              d =>
                d["Number of visas"] > 0 &&
                (d["ID Sex"] & filter_sex) == filter_sex &&
                (flag_ar & filter_age) == flag_ar
            );
            return _.orderBy(filtered, ["Number of visas"], ["desc"]);
          }}
        />
      </div>
    );
  }
}

export default translate()(MigrationByActivity);
