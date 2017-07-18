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

        var ids = getLevelObject(params);

        var prm;

        if(ids.level1 || ids.level2){

          prm = mondrianClient
                  .cube('education_employability')
                  .then(cube => {

                    var h = cube.dimensionsByName['Institution']
                      .hierarchies[0];

                    return (ids.level2)?h.getLevel('Institution'):h.getLevel('Institution Type')

                  })
                  .then(level => {
                    return mondrianClient.member(level,(ids.level2)?ids.level2:ids.level1)
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

    const { industry } = this.props.routeParams;
    const obj = this.props.data.institution;

    const ancestor = (obj && obj.ancestors)?(obj.ancestors.length>1)?obj.ancestors[0]:false:false;

      return (
          <CanonComponent data={ this.props.data } d3plus={ d3plus }>
              <div className="institution-profile">

                <div className="dc-container">
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  {obj &&
                    <h1>{ obj.caption }</h1>
                  }
                  {ancestor && <h3><Link className="link" to={ slugifyItem('institutions',ancestor.key,ancestor.name) }>{ ancestor.name }</Link></h3> }
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
