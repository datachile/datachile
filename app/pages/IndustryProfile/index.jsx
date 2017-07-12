import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import { CanonComponent } from "datawheel-canon";
import {Link} from "react-router";

import { browserHistory } from 'react-router';
import d3plus from "helpers/d3plus";

import mondrianClient from 'helpers/MondrianClient';

import {translate} from "react-i18next";

class IndustryProfile extends Component {

  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  };

  static need = [
      (params) => {
        const id = params.industry.split('-')[0];

        var prm;

        if(id){

          prm = mondrianClient
                  .cube('tax_data')
                  .then(cube => {

                    return cube.dimensionsByName['ISICrev4']
                      .hierarchies[0]
                      .getLevel('Level 1');

                  })
                  .then(level => {
                    return mondrianClient.member(level,id)
                  })
                  .then(res => ({ 
                    key: 'industry', data: res }
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

    const { industry } = this.props.routeParams;

    const {focus, t} = this.props;

    const industryObj = this.props.data.industry;

      return (
          <CanonComponent data={ this.props.data } d3plus={ d3plus }>
              <div className="industry-profile">

                <div className="dc-container">
                  <h1>{ industryObj.name }</h1>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <ul>
                    <li><Link className="link" to="/explore/industries">{ t("Explore industries") }</Link></li>
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
}), {})(IndustryProfile));
