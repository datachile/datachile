import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import { CanonComponent } from "datawheel-canon";
import {Link} from "react-router";

import { browserHistory } from 'react-router';
import d3plus from "helpers/d3plus";

import { slugifyItem } from "helpers/formatters";

import mondrianClient from 'helpers/MondrianClient';

import { getLevelObject } from "helpers/dataUtils";

import {translate} from "react-i18next";

import "./intro.css";

class CareerProfile extends Component {

  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  };

  static need = [
      (params) => {

        var ids = getLevelObject(params);

        var prm;

        if(ids.level1 || ids.level2){
          prm = mondrianClient
                  .cube('education_employability')
                  .then(cube => {

                    var h = cube.dimensionsByName['Careers']
                      .hierarchies[0];

                    return (ids.level2)?h.getLevel('Career'):h.getLevel('Career Group')

                  })
                  .then(level => {
                    return mondrianClient.member(level,(ids.level2)?ids.level2:ids.level1)
                  })
                  .then(res => ({ 
                    key: 'career', data: res }
                  ));
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

    const {focus, t} = this.props;

    const obj = this.props.data.career;
    const ancestor = (obj && obj.ancestors)?(obj.ancestors.length>1)?obj.ancestors[0]:false:false;

      return (
          <CanonComponent data={ this.props.data } d3plus={ d3plus }>
              <div className="career-profile">

                <div className="intro">

                      <div className="splash">
                          <div className="image" style={{backgroundImage: `url('/images/profile-bg/chile.jpg')`}} ></div>
                          <div className="gradient"></div>
                      </div>

                      <div className="dc-container">
                          <div className="header">
                            <div className="meta">
                                  {ancestor && 
                                    <div className="parent"><Link className="link" to={ slugifyItem('careers',ancestor.key,ancestor.name) }>{ ancestor.name }</Link></div> 
                                  }
                                  {obj &&
                                    <div className="title">{ obj.caption }</div>
                                  }
                                  <div className="subtitle">{ (ancestor)?t('Career'):t('Field of Science')} <Link className="link" to="/explore/careers">{t('Explore careers')}</Link></div>
                              </div>
                          </div>
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
}), {})(CareerProfile));
