import React, { Component } from "react";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

class CollegeByEnrollment extends Section {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("education_enrollment").then(cube => {
        
        var query = cube.query
            .option("parents", true)
            .drilldown("Date", "Date", "Year")
            .drilldown("Administration", "Administration", "Administration")
            .measure("Number of records")

        if(geo.type=='comuna'){
          query.drilldown("Institutions", "Institution", "Institution")
        }
        var q = geoCut(
          geo,
          "Geography",
          query
          ,
          store.i18n.locale
        );

        return {
          key: "path_college_by_enrollment",
          data: store.env.CANON_API + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const path = this.context.data.path_college_by_enrollment;
    const { t, className } = this.props;
    const geo = this.context.data.geo;

    return (
      <div className={className}>
        <h3 className="chart-title">
          {t("College By Enrollment")}
        </h3>
        <Treemap
          config={{
            height: 500,
            data: path,
            groupBy: (geo.type!='comuna')?["ID Administration"]:["ID Administration", "ID Institution"],
            label: d =>
              d["Institution"] instanceof Array || geo.type!='comuna' ? d["Administration"] : d["Institution"],
            sum: d => d["Number of records"],
            time: "ID Year",
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID Administration"])
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(CollegeByEnrollment);
