import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import { CanonComponent } from "datawheel-canon";
import SourceNote from "components/SourceNote";
import TopicBlock from "components/TopicBlock";

import ForeignTrade from "./economy/ForeignTrade";
import Industry from "./economy/Industry";

import ExportsByProduct from './economy/foreign-trade/ExportsByProduct';
import ExportsByDestination from './economy/foreign-trade/ExportsByDestination';
import ImportsByOrigin from './economy/foreign-trade/ImportsByOrigin';
import TradeBalance from './economy/foreign-trade/TradeBalance';
import OutputByIndustry from './economy/industry/OutputByIndustry';

import NavFixed from "components/NavFixed";
import d3plus from "helpers/d3plus";
import {Geomap} from "d3plus-react";
import SvgMap from "components/SvgMap";
import SvgImage from "components/SvgImage";
import { browserHistory } from 'react-router';

import {Link} from "react-router";
import { slugifyItem } from "helpers/formatters";

import mondrianClient from 'helpers/MondrianClient';

import { getGeoObject } from 'helpers/dataUtils';

import "./intro.css";
import "./topics.css";

import {translate} from "react-i18next";

const topics = [
  {
    slug: "economy",
    title: 'Economy'
  },
  {
    slug: "innovation",
    title: "Innovation"
  },
  {
    slug: "education",
    title: "Education"
  },
  {
    slug: "environment",
    title: "Environment"
  },
  {
    slug: "demographics",
    title: "Demographics"
  },
  {
    slug: "health",
    title: "Health"
  },
  {
    slug: "politics",
    title: "Politics"
  }
];


const Stat = (props) => (
    <div className="stat">
        <div className="label">{ props.label }</div>
        <div className="value">{ props.value }</div>
    </div>
);

const chileObj = {
  name:'Chile',
  id:'chile'
};

class GeoProfile extends Component {

  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  };

  static need = [
      (params) => {

        const geoObj = getGeoObject(params)

        var prm;

        switch(geoObj.type){
            case 'country':{
                prm = new Promise((resolve, reject) => {
                    resolve({ key: 'geo', data: geoObj });
                  });
                break;
            }
            case 'region':{
                prm = mondrianClient
                  .cube('exports')
                  .then(cube => {

                    return cube.dimensionsByName['Geography']
                      .hierarchies[0]
                      .getLevel('Region');

                  })
                  .then(level => {
                    return mondrianClient.member(level,geoObj.key)
                  })
                  .then(res => {
                    return { key: 'geo', data: res }
                  });
                break;
            }
            case 'comuna':{                
                prm = mondrianClient
                  .cube('exports')
                  .then(cube => {

                    return cube.dimensionsByName['Geography']
                      .hierarchies[0]
                      .getLevel('Comuna');

                  })
                  .then(level => {
                    return mondrianClient.member(level,geoObj.key)
                  })
                  .then(res => {
                    return { key: 'geo', data: res }
                  });
                break;
            }
        }

        return {
          type: "GET_DATA",
          promise: prm
        };
      },
      ExportsByProduct,
      ExportsByDestination,
      ImportsByOrigin,
      TradeBalance,
      OutputByIndustry
  ];

  componentDidMount() {
    //window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {

    /*if (!this.subLinks) return;

    const {activeSub, subnav} = this.state;
    const newSub = this.subLinks.getBoundingClientRect().top <= 0;

    let newActive = false;
    for (let i = 0; i < topics.length; i++) {
      const top = document.getElementById(topics[i].slug).getBoundingClientRect().top;
      if (top <= 0) newActive = topics[i].slug;
    }
    if (subnav !== newSub || newActive !== activeSub) {
      this.setState({activeSub: newActive, subnav: newSub});
    }*/
  }

  render() {

    const {focus, t} = this.props;
    
    const { subnav, activeSub } = this.state;

    const geoObj = getGeoObject(this.props.routeParams)

    const geo = this.props.data.geo;

    const ancestor = (geo.ancestors && geo.ancestors.length>1)?geo.ancestors[0]:(geoObj.type=='region')?chileObj:false;

    // TODO check for 404

    const stats = {
        population: '17.5M',
        age_avg: 300.000,
        income_avg: 31.5,
        source: 'INE Censo',
        source_year: 2013
    }

    var type = '';
    switch(geoObj.type){
        case 'country':{
            type = t('Country');
            break;
        }
        case 'region':{
            type = t('Region');
            break;
        }
        case 'comuna':{
            type = t('Comuna');
            break;
        }
    }

    function fillShape(d) {
      var c = "rgba(255, 255, 255, 0.35)";
      switch(geoObj.type){
          case 'country':{
              c = "rgba(255, 255, 255, 0.5)";
              break;
          }
          case 'region':{
              if(parseInt(d.id)==parseInt(geoObj.key)){
                c = "rgba(255, 255, 255, 1)";
              }
              break;
          }
          case 'comuna':{
              if(parseInt(d.id)==parseInt(ancestor.key)){
                c = "rgba(255, 255, 255, 1)";
              }
              break;
          }
      }

      return c;
    }

      return (
          <CanonComponent data={this.props.data} d3plus={d3plus}>
              <div className="profile">
                  
                <div className="intro">

                      <div className="splash">
                          <div className="image" style={{backgroundImage: `url('/images/profile-bg/${geoObj.image}')`}} ></div>
                          <div className="gradient"></div>
                      </div>

                      <div className="dc-container">
                          <div className="header">
                              
                              <div className="meta">
                                  {ancestor && 
                                    <div className="parent"><Link className="link" to={ slugifyItem('geo',ancestor.key,ancestor.name) }>{ ancestor.name }</Link></div> 
                                  }
                                  <div className="title">{ geo.caption }</div>
                                  <div className="subtitle">{ geoObj.type } <Link className="link" to="/explore/geo">{t('Explore')}</Link></div>
                                  <Stat value={ stats.population } label={ t('Population') } />
                                  <Stat value={ '$' + stats.income_avg } label={ t('Average Household') } />
                                  <Stat value={ stats.age_avg +' '+ t('years')} label={ t('Average age') } />
                              </div>

                              <div className="map-region">
                                <Geomap config={{
                                      data: [],
                                      downloadButton: false,
                                      groupBy: "key",
                                      height: 500,
                                      label: d => 'Región '+d.properties.Region,
                                      legend: false,
                                      ocean: "transparent",
                                      on: {
                                          "click.shape": function(d) {
                                              browserHistory.push(slugifyItem('geo',d.id,d.properties.Region));
                                          }
                                      },
                                      padding: 10,
                                      shapeConfig: {
                                          hoverOpacity: 1,
                                          Path: {
                                              fill: fillShape,
                                              stroke: "rgba(255, 255, 255, 0.75)"
                                          }
                                      },
                                      tiles: false,
                                      tooltipConfig: {
                                          background: "white",
                                          footer: "",
                                          footerStyle: {
                                              "margin-top": 0
                                          },
                                          padding: "12px",
                                          body: d => `${d.properties.Region}`
                                      },
                                      topojson: "/geo/regiones.json",
                                      topojsonId: "id",
                                      topojsonKey: "regiones",
                                      width: 200,
                                      zoom: false
                                  }} />
                              </div>
                              <div className="map-comuna">
                                 { geoObj.type!='country' &&
                                    <SvgMap region={(geoObj.type=='region')?geo:ancestor} active={(geoObj.type=='comuna')?geo:false} />
                                  }
                              </div>
                          </div>
                      </div>
                  
                  </div>



                  <ExportsByProduct/>

                  <ExportsByDestination/>
                  
                  <ImportsByOrigin/>

                  <TradeBalance/>

                  <OutputByIndustry/>

              </div>
          </CanonComponent>
      );
  }
}


export default translate()(connect(state => ({
  data: state.data,
  focus: state.focus,
  stats: state.stats
}), {})(GeoProfile));
