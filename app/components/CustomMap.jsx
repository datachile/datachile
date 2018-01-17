import React from "react";
import { translate } from "react-i18next";
import { Geomap } from "d3plus-react";
import NoDataAvailable from "components/NoDataAvailable";

import { numeral, slugifyItem } from "helpers/formatters";

import "./CustomMap.css";

class CustomMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  render() {
    const { t, path, msrName, drilldowns, config, depth } = this.props;

    return this.state.show ? (
      <div className="geomap">
        <Geomap
          config={{
            ...config,
            height: 500,
            data: path,
            fitObject: "/geo/countries.json",
            topojson: "/geo/countries.json",
            groupBy: "iso3",
            topojsonId: "id",
            topojsonKey: "id",
            fitKey: "id",
            colorScalePosition: "bottom",
            
            colorScaleConfig: {
              axisConfig: {
                shapeConfig: {
                  labelConfig: {
                    fontColor: "#000"
                  }
                },
                tickFormat: tick => {
                    return numeral(Math.exp(parseFloat(tick)), "es").format(
                      "($ 0.[00] a)"
                    );
                  }
                //tickFormat: tick => {
                //console.log(tick);
                //return Math.exp(parseFloat(tick));
                //}
              },
              /*shapeConfig: {
                fontColor: "#999999",
                labelConfig: {
                  fontColor: "#000"
                }
              },*/
              select: "#legend",
              //size: 20,
              //width: 500,
              align: "start"
              //padding: 12,
              /*rectConfig: {
                stroke: "#BBBBBB"
              }*/
            }
            //label: d => d["Country"]
          }}
          dataFormat={data => {
            if (data.data && data.data.length > 0) {
              return data.data.filter(item => item["ID Year"] === 2016).map(item => {
                return { ...item, ["FOB US"]: Math.log(item["FOB US"]) };
              });
            } else {
              this.setState({ show: false });
            }
          }}
        />
        <svg id="legend" />
      </div>
    ) : (
      <NoDataAvailable />
    );
  }
}

export default translate()(CustomMap);
