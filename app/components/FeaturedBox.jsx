import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {translate} from "react-i18next";
import { FORMATTERS } from "helpers/formatters";

import "./FeaturedBox.css";

class FeaturedBox extends Component {

  render() {

    const {t} = this.props;

    var type = '';
    switch(this.props.item.type){
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

    return (
        <Link key={this.props.item.key+'anchor'} className="tile" to={ this.props.item.url } style={{backgroundImage: `url('/images/profile-bg/${this.props.item.background}')`}}>
            <span className="tile-filter"></span>
            <span className="col-l">
                <img className="icon" src="/images/icons/icon-location-profile.svg" />
                <span className="name">{ this.props.item.name }</span>
                <span className="region">{ (this.props.item.type=='country')?t('Country'):t('Region') + ' ' + FORMATTERS.roman((this.props.item.parent)?this.props.item.parent.key:this.props.item.key) }</span>
            </span>
            <span className="col-r">
                <span className="type">{ type }</span>
            </span>
        </Link>
    );
  }
}

export default translate()(connect(state => ({}), {})(FeaturedBox));
