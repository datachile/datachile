import React, { PropTypes } from "react";
import {connect} from "react-redux";
import {fetchStats} from "actions/profile";
import {Profile, Stat, TopicTitle} from "datawheel-canon";
import d3plus from "helpers/d3plus";

import { GEOMAP } from "helpers/dictionary";

import "./intro.css";
import "./topics.css";

import IntroParagraph from "./splash/IntroParagraph";
import ExportsByProduct from './economy/ExportsByProduct';
import ExportsByDestination from './economy/ExportsByDestination';
import ImportsByOrigin from './economy/ImportsByOrigin';
import OutputByIndustry from './economy/OutputByIndustry';
import TradeBalance from './economy/TradeBalance';

class GeoProfile extends Profile {

  static contextTypes = {
    apiClient: PropTypes.object
  };
  static defaultProps = { d3plus };

  static need = [
      ExportsByProduct,
      ExportsByDestination,
      ImportsByOrigin,
      OutputByIndustry,
      TradeBalance
  ];

  render() {

    const { region, comuna } = this.props.routeParams;

    const geo = (comuna)?GEOMAP.getRegion(comuna):GEOMAP.getRegion(region);

    // TODO check for 404

    const {attrs, focus, stats} = this.props;

    return (
        <div className="profile">

            <div className="intro">

                <div className="splash">
                    <div className="image" style={{backgroundImage: `url('/images/profile-bg/${geo.background}')`}} ></div>
                    <div className="gradient"></div>
                </div>

                <div className="header">
                    <div className="meta">
                        <div className="subtitle">{ geo.type }</div>
                        <div className="title">{ geo.caption }</div>
                        {geo.parent &&
                          <div className="parent">Región {geo.parent.caption}</div>
                        }
                    </div>
                </div>

                <div className="subnav">
                    <a className="sublink" href="#economy">
                        <img className="icon" src="/images/profile-icon/icon-economy.svg" />
                        Economy
                    </a>
                    <a className="sublink" href="#innovation">
                        <img className="icon" src="/images/profile-icon/icon-innovation.svg" />
                        Innovation
                    </a>
                    <a className="sublink" href="#education">
                        <img className="icon" src="/images/profile-icon/icon-education.svg" />
                        Education
                    </a>
                    <a className="sublink" href="#environment">
                        <img className="icon" src="/images/profile-icon/icon-environment.svg" />
                        Environment
                    </a>
                    <a className="sublink" href="#demographics">
                        <img className="icon" src="/images/profile-icon/icon-demographics.svg" />
                        Demographics
                    </a>                

                </div>

            </div>

            <TopicTitle slug="economy">
                <div className="icon" style={{backgroundImage: "url('/images/profile-icon/icon-economy.svg')"}}></div>
                Economy
            </TopicTitle>
            <ExportsByProduct />
            <ExportsByDestination />
            <ImportsByOrigin />
            <OutputByIndustry />
            <TradeBalance />
            <TopicTitle slug="innovation">
                <div className="icon" style={{backgroundImage: "url('/images/profile-icon/icon-innovation.svg')"}}></div>
                Innovation
            </TopicTitle>
        </div>
    );
  }
}


export default connect(state => ({
  attrs: state.attrs,
  data: state.profile.data,
  focus: state.focus,
  stats: state.profile.stats
}), {})(GeoProfile);
