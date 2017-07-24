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

import { ingestChildren } from "helpers/dataUtils";

import { slugifyItem } from "helpers/formatters";

import mondrianClient, { getMembersQuery, getMemberQuery } from 'helpers/MondrianClient';

import {translate} from "react-i18next";

import "./intro.css";

class Explore extends Component {

  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  };

  static need = [
    (params,store) => {
      const entity = params.entity;

      var prm;

      if(entity){

        switch(entity){
            case undefined:{
                type = '';
                break;
            }
            case 'geo':{
                var prm1 = getMembersQuery('exports','Geography','Region',store.i18n.locale,false);
                var prm2 = getMembersQuery('exports','Geography','Comuna',store.i18n.locale,false);

                prm = Promise.all([prm1,prm2])
                  .then((res) => {
                    return { key: 'members', data: ingestChildren(res[0],res[1]) };
                  });
                break;
            }
            case 'countries':{
                var prm1 = getMembersQuery('exports','Destination Country','Subregion',store.i18n.locale,false);
                var prm2 = getMembersQuery('exports','Destination Country','Country',store.i18n.locale,false);

                prm = Promise.all([prm1,prm2])
                  .then((res) => {
                    return { key: 'members', data: ingestChildren(res[0],res[1]) };
                  });
                break;
            }
            case 'institutions':{
                var prm1 = getMembersQuery('education_employability','Institution','Institution Type',store.i18n.locale,false);
                var prm2 = getMembersQuery('education_employability','Institution','Institution',store.i18n.locale,false);

                prm = Promise.all([prm1,prm2])
                  .then((res) => {
                    return { key: 'members', data: ingestChildren(res[0],res[1]) };
                  });
                break;
            }
            case 'careers':{
                var prm1 = getMembersQuery('education_employability','Careers','Career Group',store.i18n.locale,false);
                var prm2 = getMembersQuery('education_employability','Careers','Career',store.i18n.locale,false);

                prm = Promise.all([prm1,prm2])
                  .then((res) => {
                    return { key: 'members', data: ingestChildren(res[0],res[1]) };
                  });
                break;
            }
            case 'products':{
                var prm1 = getMembersQuery('exports','Export HS','HS0',store.i18n.locale,false);
                var prm2 = getMembersQuery('exports','Export HS','HS2',store.i18n.locale,false);

                prm = Promise.all([prm1,prm2])
                  .then((res) => {
                    return { key: 'members', data: ingestChildren(res[0],res[1]) };
                  });
                break;
            }
            case 'industries':{
                var prm1 = getMembersQuery('tax_data','ISICrev4','Level 1',store.i18n.locale,false);
                var prm2 = getMembersQuery('tax_data','ISICrev4','Level 2',store.i18n.locale,false);

                prm = Promise.all([prm1,prm2])
                  .then((res) => {
                    return { key: 'members', data: ingestChildren(res[0],res[1]) };
                  });
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

    const {focus, t, } = this.props;

    const members = this.props.data.members;

    var type = '';
    var mainLink = false;
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
        case 'geo':{
            type = t('Geo');
            mainLink = true;
            break;
        }
        default: {
            browserHistory.push('/explore');
        }
    }

      return (
          <CanonComponent id="explore" data={this.props.data} d3plus={d3plus}>
              <div className="explore-page">

                <div className="intro">

                      <div className="splash">
                          <div className="image" style={{backgroundImage: `url('/images/profile-bg/chile2.jpg')`}} ></div>
                          <div className="gradient"></div>
                      </div>

                      <div className="dc-container">
                          <div className="header">
                            <div className="meta">
                                  <div className="title">{t('Explore')} { type }</div>
                                  <div className="subtitle">
                                  {entity &&
                                    <Link className="link" to="/explore">{t('Explore')}</Link>
                                  }
                                  </div>
                              </div>
                          </div>
                      </div>

                </div>

                <div>
                  {!entity &&
                     <div className="">
                       <ul className="explore-list">
                        <li><Link className="link" to="/explore/geo">{ t("Geo") }</Link></li>
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
                      
                      <div>
                        { 
                          members && members.map(m =>
                            <div>
                              <h3 className="list-title"><Link className="link" to={ slugifyItem(entity,m.key,m.name) }>{ m.caption }</Link></h3>
                              
                              <ul className="explore-list">
                                { 
                                  m.children && m.children.map(c =>
                                    <li><Link className="link" to={ slugifyItem(entity,m.key,m.name,c.key,c.name) }>{ c.caption }</Link></li>
                                  )
                                }
                              </ul>
                            </div>
                          )
                        }
                      </div>

                   </div>
                  }
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
