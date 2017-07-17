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

  static contextTypes = {
    apiClient: PropTypes.object
  };

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

    /*const key = (geo.parent)?geo.parent.key:geo.key;
    const slug = (geo.parent)?geo.parent.slug:geo.slug;*/

    /*const onlyRegions = GEO.filter(function(d){
      return d.parent==false && d.slug != 'chile';
    });

    function fillShape(d) {
      if(geo.slug=='chile'){
        return "rgba(255, 255, 255, 0.5)";
      }
      return (parseInt(d.id)==parseInt(key))? "rgba(255, 255, 255, 1)":"rgba(255, 255, 255, 0.35)";
    }*/

      return (
          <CanonComponent data={this.props.data} d3plus={d3plus}>
              <div className="profile">
                  <p><Link className="link" to="/explore/geo">{t('Explore')}</Link></p>
                  <h3>{ geoObj.type }</h3>
                  <h1>{ geo.name }</h1>
                  {ancestor && <h3><Link className="link" to={ slugifyItem('geo',ancestor.key,ancestor.name) }>{ ancestor.name }</Link></h3> }


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
