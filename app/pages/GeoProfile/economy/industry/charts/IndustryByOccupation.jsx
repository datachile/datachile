import React, { Component } from "react";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import Select from "components/Select";

class IndustryByOccupation extends Section {
  static need = [
    (params, store) => {
      
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("nesi_income").then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .option("parents", true)
            .drilldown("ISCO", "ISCO", "ISCO")
            .drilldown("Date", "Date", "Year")
            .measure("Expansion Factor")
            ,
          store.i18n.locale
        );

        return {
          key: "path_industry_occupation_common",
          data: store.env.CANON_API + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("nesi_income").then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .option("parents", true)
            .drilldown("ISCO", "ISCO", "ISCO")
            .drilldown("Date", "Date", "Year")
            .measure("Expansion Factor")
            .measure("Median Income")
            ,
          store.i18n.locale
        );

        return {
          key: "path_industry_occupation_income",
          data: store.env.CANON_API + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      
      const geo = getGeoObject(params);
      const prm = mondrianClient.cube("nesi_income").then(cube => {
        var q = geoCut(
          geo,
          "Geography",
          cube.query
            .option("parents", true)
            .drilldown("ISCED", "ISCED", "ISCED")
            .drilldown("ISCO", "ISCO", "ISCO")
            .drilldown("Date", "Date", "Year")
            .measure("Expansion Factor")
            .measure("Median Income")
            ,
          store.i18n.locale
        );

        return {
          key: "path_industry_occupation_specialized",
          data: store.env.CANON_API + q.path("jsonrecords")
        };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedOption:0,
      selectedObj:{
              path: "",
              groupBy:[],
              label: d => "",
              sum: d => ""
          },
      chartVariations:[]
    };
  };

  componentDidMount() {
    const { t } = this.props;

    var variations = [
          {
              id: 0,
              title: t('Most common occupations'),
              path: this.context.data.path_industry_occupation_common,
              groupBy: ["ID ISCO"],
              label: d => d["ISCO"],
              sum: d => d["Expansion Factor"]
          },
          {
              id: 1,
              title: t('Best paid occupations'),
              path: this.context.data.path_industry_occupation_income,
              groupBy: ["ID ISCO"],
              label: d => d["ISCO"],
              sum: d => d["Median Income"]
          },
          {
              id: 2,
              title: t('More Specialized occupations'),
              path: this.context.data.path_industry_occupation_specialized,
              groupBy: ["ID ISCO","ID ISCED"],
              label: d => d["ISCED"],
              sum: d => d["Expansion Factor"]
          }
      ];

    this.setState({
      selectedOption:0,
      selectedObj:variations[0],
      chartVariations:variations
    });
  };

  handleChange(ev) {
    this.setState({
      selectedOption:ev.newValue,
      selectedObj:this.state.chartVariations[ev.newValue]
    });
  };

  render() {
    const { t, className } = this.props;

    return (
      <div className={className}>
        <h3 className="chart-title">
          <Select id='myDropdown' 
              options={this.state.chartVariations} 
              value={this.state.selectedOption}
              labelField='title'
              valueField='id'
              onChange={this.handleChange}/>
        </h3>

        <Treemap
          config={{
            height: 500,
            data: this.state.selectedObj.path,
            groupBy: this.state.selectedObj.groupBy,
            label: this.state.selectedObj.label,
            sum: this.state.selectedObj.sum,
            time: "ID Year",
            legendConfig: {
                label: false,
                shapeConfig:{
                    width:25,
                    height:25,
                    fill: d => ordinalColorScale(d["ID ISCO"]),
                    backgroundImage: d => "https://datausa.io/static/img/attrs/thing_apple.png",
                }
            },
            shapeConfig: {
              fill: d => ordinalColorScale(d["ID ISCO"])
            }
          }}
          dataFormat={data => data.data}
        />
      </div>
    );
  }
}

export default translate()(IndustryByOccupation);
