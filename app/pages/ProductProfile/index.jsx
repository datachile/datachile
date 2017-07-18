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

class ProductProfile extends Component {

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
                  .cube('exports')
                  .then(cube => {

                    var h = cube.dimensionsByName['Export HS']
                      .hierarchies[0];

                    return (ids.level2)?h.getLevel('HS2'):h.getLevel('HS0')

                  })
                  .then(level => {
                    return mondrianClient.member(level,(ids.level2)?ids.level2:ids.level1)
                  })
                  .then(res => ({ 
                    key: 'product', data: res }
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

    const { industry } = this.props.routeParams;
    const obj = this.props.data.product;

    const ancestor = (obj && obj.ancestors)?(obj.ancestors.length>1)?obj.ancestors[0]:false:false;

      return (
          <CanonComponent data={ this.props.data } d3plus={ d3plus }>
              <div className="product-profile">

                <div className="dc-container">
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  {obj &&
                    <h1>{ obj.caption }</h1>
                  }
                  {ancestor && <h3><Link className="link" to={ slugifyItem('products',ancestor.key,ancestor.name) }>{ ancestor.name }</Link></h3> }
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <ul>
                    <li><Link className="link" to="/explore/products">{ t("Explore products") }</Link></li>
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
}), {})(ProductProfile));
