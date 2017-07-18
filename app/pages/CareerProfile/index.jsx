import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import { CanonComponent } from "datawheel-canon";
import {Link} from "react-router";

import { browserHistory } from 'react-router';
import d3plus from "helpers/d3plus";

import mondrianClient from 'helpers/MondrianClient';

import {translate} from "react-i18next";

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
        var parts = params.career.split('-');
        const id = parts[parts.length-1];

        var prm;

        if(id){

          prm = mondrianClient
                  .cube('education_employability')
                  .then(cube => {

                    return cube.dimensionsByName['Careers']
                      .hierarchies[0]
                      .getLevel('Career');

                  })
                  .then(level => {
                    return mondrianClient.member(level,id)
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

    const { career } = this.props.routeParams;

    const {focus, t} = this.props;

    const careerObj = this.props.data.career;

      return (
          <CanonComponent data={ this.props.data } d3plus={ d3plus }>
              <div className="career-profile">

                <div className="dc-container">
                  { careerObj &&  
                    <h1>{ careerObj.name }</h1>
                  }
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <ul>
                    <li><Link className="link" to="/explore/careers">{ t("Explore careers") }</Link></li>
                  </ul>
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
