import React, { Component } from "react";
import _ from "lodash";

import { LinePlot } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { melt,getGeoObject } from "helpers/dataUtils";
import { ordinalColorScale } from "helpers/colors";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";
import Select from "components/Select";

class EmploymentBySex extends Section {
  static need = [
      (params, store) => {
        const geo = getGeoObject(params);
        const prm = mondrianClient.cube("nene").then(cube => {
          var q = geoCut(
            geo,
            "Geography",
            cube.query
              .drilldown("Date", "Month")
              .drilldown("Occupational Situation", "Occupational Situation", "Occupational Situation")
              .drilldown("Sex", "Sex", "Sex")
              .measure("Expansion factor"),
            store.i18n.locale
          );

          return {
            key: "path_employment_by_sex",
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
              title: t('Female'),
              sex_id: 1
          },
          {
              id: 1,
              title: t('Male'),
              sex_id: 2
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
    const path = this.context.data.path_employment_by_sex;
    const { t, className } = this.props;
    const { selectedObj } = this.state;
    return (
      <div className={className}>
        <h3 className="chart-title">
          {t("Employment By Sex and Situation")}
          <Select id='variations' 
              options={this.state.chartVariations} 
              value={this.state.selectedOption}
              labelField='title'
              valueField='id'
              onChange={this.handleChange}/>
        </h3>
        <LinePlot
            config={{
              height: 500,
              data: path,
              groupBy: "variable",
              x: "Month",
              y: "value",
              scale: "time",
              xConfig:{
                tickSize:0,
                title:false
              },
              yConfig:{
                title:t("People")
              },
              shapeConfig: {
                Line:{
                  stroke: d => ordinalColorScale(d["variable"]),
                  "strokeWidth": 2
                }
              }
            }}
            dataFormat={function(data) {
                var filtered = data.data.filter(function(d){return d['ID Sex']==selectedObj.sex_id;});
                var melted = [];
                filtered.forEach(function(f){
                  var a = {};
                  var month = f['Month'].split('/');
                  month = month[0] + '-' + ((parseInt(month[1])<10)?'0'+month[1]:month[1]) + '-01';
                  a['Month'] = month;
                  a['variable'] = f['Occupational Situation'];
                  a['value'] = f['Expansion factor'];
                  melted.push(a);
                });
                melted = melted.sort(function(a,b){return (a['Month']>b['Month'])?1:-1;});
                return melted;
              }
            }
          />
      </div>
    );
  }
}

export default translate()(EmploymentBySex);
