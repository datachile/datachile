import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import { CanonComponent } from "datawheel-canon";
import {Link} from "react-router";

import { browserHistory } from 'react-router';
import d3plus from "helpers/d3plus";

import mondrianClient from 'helpers/MondrianClient';

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
        const id = params.product.split('-')[0];

        var prm;

        if(id){

          prm = mondrianClient
                  .cube('exports')
                  .then(cube => {

                    return cube.dimensionsByName['Export HS']
                      .hierarchies[0]
                      .getLevel('HS0');

                  })
                  .then(level => {
                    return mondrianClient.member(level,id)
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

    const { country } = this.props.routeParams;

    const {focus, t} = this.props;

    const productObj = this.props.data.product;

      return (
          <CanonComponent data={ this.props.data } d3plus={ d3plus }>
              <div className="product-profile">

                <div className="dc-container">
                  <h1>{ productObj.name }</h1>
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
