import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import { CanonComponent } from "datawheel-canon";
import {Link} from "react-router";

import { browserHistory } from 'react-router';
import d3plus from "helpers/d3plus";

import mondrianClient from 'helpers/MondrianClient';

import {translate} from "react-i18next";

class InstitutionProfile extends Component {

  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  };

  static need = [
      (params) => {

        var parts = params.institution.split('-');
        const id = parts[parts.length-1];

        var prm;

        if(id){

          prm = mondrianClient
                  .cube('education_employability')
                  .then(cube => {

                    return cube.dimensionsByName['Institution']
                      .hierarchies[0]
                      .getLevel('Institution');

                  })
                  .then(level => {
                    return mondrianClient.member(level,id)
                  })
                  .then(res => ({ 
                    key: 'institution', data: res }
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

    const { institution } = this.props.routeParams;

    const {focus, t} = this.props;

    const institutionObj = this.props.data.institution;

      return (
          <CanonComponent data={ this.props.data } d3plus={ d3plus }>
              <div className="institution-profile">

                <div className="dc-container">
                  <h1>{ institutionObj.name }</h1>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <ul>
                    <li><Link className="link" to="/explore/institutions">{ t("Explore institutions") }</Link></li>
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
}), {})(InstitutionProfile));
