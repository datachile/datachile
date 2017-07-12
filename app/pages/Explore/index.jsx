import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import { CanonComponent } from "datawheel-canon";
import {Link} from "react-router";

import NavFixed from "components/NavFixed";
import d3plus from "helpers/d3plus";
import {Geomap} from "d3plus-react";
import SvgMap from "components/SvgMap";
import SvgImage from "components/SvgImage";
import { browserHistory } from 'react-router';

import {slugifyItem} from "helpers/formatters";

import mondrianClient from 'helpers/MondrianClient';

import { GEOMAP, GEO } from "helpers/GeoData";

import {translate} from "react-i18next";


class Explore extends Component {

  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  };

  static need = [
    (params) => {
      const entity = params.entity;

      var prm;

      if(entity){

        switch(entity){
            case undefined:{
                type = '';
                break;
            }
            case 'countries':{
                prm = mondrianClient
                  .cube('exports')
                  .then(cube => {

                    return cube.dimensionsByName['Destination Country']
                      .hierarchies[0]
                      .getLevel('Country');

                  })
                  .then(level => {
                    return mondrianClient.members(level)
                  })
                  .then(res => ({ 
                    key: 'members', data: res }
                  ));
                break;
            }
            case 'institutions':{
                prm = mondrianClient
                  .cube('education_employability')
                  .then(cube => {

                    return cube.dimensionsByName['Institution']
                      .hierarchies[0]
                      .getLevel('Institution');

                  })
                  .then(level => {
                    return mondrianClient.members(level)
                  })
                  .then(res => ({ 
                    key: 'members', data: res }
                  ));
                break;
            }
            case 'careers':{
                prm = mondrianClient
                  .cube('education_employability')
                  .then(cube => {

                    return cube.dimensionsByName['Careers']
                      .hierarchies[0]
                      .getLevel('Career');

                  })
                  .then(level => {
                    return mondrianClient.members(level)
                  })
                  .then(res => ({ 
                    key: 'members', data: res }
                  ));
                break;
            }
            case 'products':{
                prm = mondrianClient
                  .cube('exports')
                  .then(cube => {

                    return cube.dimensionsByName['Export HS']
                      .hierarchies[0]
                      .getLevel('HS0');

                  })
                  .then(level => {
                    return mondrianClient.members(level)
                  })
                  .then(res => ({ 
                    key: 'members', data: res }
                  ));
                break;
            }
            case 'industries':{
                prm = mondrianClient
                  .cube('tax_data')
                  .then(cube => {

                    return cube.dimensionsByName['ISICrev4']
                      .hierarchies[0]
                      .getLevel('Level 1');

                  })
                  .then(level => {
                    return mondrianClient.members(level)
                  })
                  .then(res => ({ 
                    key: 'members', data: res }
                  ));
                break;
            }
        }
        
      }

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  componentDidMount() {
    
  }

  render() {

    const { subnav, activeSub } = this.state;

    const { entity } = this.props.routeParams;

    const {focus, t} = this.props;

    const members = this.props.data.members;

    var type = '';
    switch(entity){
        case undefined:{
            type = '';
            break;
        }
        case 'countries':{
            type = t('Countries');
            break;
        }
        case 'institutions':{
            type = t('Institutions');
            break;
        }
        case 'careers':{
            type = t('Careers');
            break;
        }
        case 'products':{
            type = t('Products');
            break;
        }
        case 'industries':{
            type = t('Industries');
            break;
        }
        default: {
            browserHistory.push('/explore');
        }
    }

      return (
          <CanonComponent data={this.props.data} d3plus={d3plus}>
              <div className="explore">

                  <div className="intro">

                      <div className="splash">
                          <div className="image"></div>
                          <div className="gradient"></div>
                      </div>

                      <div className="dc-container">
                            <h1>{t('Explore')} { type }</h1>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            
                            {!entity &&
                             <div className="">
                               <ul>
                                <li><Link className="link" to="/explore/countries">{ t("Countries") }</Link></li>
                                <li><Link className="link" to="/explore/institutions">{ t("Institutions") }</Link></li>
                                <li><Link className="link" to="/explore/careers">{ t("Careers") }</Link></li>
                                <li><Link className="link" to="/explore/products">{ t("Products") }</Link></li>
                                <li><Link className="link" to="/explore/industries">{ t("Industries") }</Link></li>
                               </ul>
                             </div>
                            }

                            {entity &&
                             <div className="">
                                
                                <ul>
                                  <li><Link className="link" to="/explore">{ t("Explore") }</Link></li>
                                </ul>

                                <ul>
                                  { 
                                    members && members.map(m =>
                                      <li><Link className="link" to={ slugifyItem(entity,m.key,m.name) }>{ m.name }</Link></li>
                                    )
                                  }
                                </ul>

                             </div>
                            }
                      </div>


                  </div>

              </div>
          </CanonComponent>
      );
  }
}


export default translate()(connect(state => ({
  data: state.data,
  focus: state.focus,
  stats: state.stats
}), {})(Explore));
