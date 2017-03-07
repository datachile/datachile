import React, { PropTypes } from "react";
import {connect} from "react-redux";
import {fetchStats} from "actions/profile";
import {Profile, Stat, TopicTitle} from "datawheel-canon";
import d3plus from "helpers/d3plus";

import { GEO } from "helpers/dictionary";

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

    // TODO check for 404
    const geo = GEO.getRegion(region);
    // TODO get comuna if comuna != null

    const {attrs, focus, stats} = this.props;

    return (
        <div className="profile">

            <div className="intro">

                <div className="splash">
                    <div className="gradient"></div>
                </div>

                <div className="header">
                    <div className="meta">
                        <div className="title">{ geo.caption }</div>
                        { /* }
                        { stats.map(stat => <Stat key={ stat.key } label={ stat.label } value={ stat.attr ? attrs[stat.attr][stat.value].name : stat.value } />) }
                        { */ }
                    </div>
                </div>

                <div className="subnav">
                    <a className="sublink" href="#introduction">
                        <img className="icon" src="/images/topics/introduction.svg" />
                        Introduction
                    </a>
                    <a className="sublink" href="#agriculture">
                        <img className="icon" src="/images/topics/agriculture.svg" />
                        Agriculture
                    </a>
                    <a className="sublink" href="#climate">
                        <img className="icon" src="/images/topics/climate.svg" />
                        Climate
                    </a>
                    <a className="sublink" href="#health">
                        <img className="icon" src="/images/topics/health.svg" />
                        Health
                    </a>
                    <a className="sublink" href="#poverty">
                        <img className="icon" src="/images/topics/poverty.svg" />
                        Poverty
                    </a>
                </div>

            </div>

            { /* }
            <TopicTitle slug="introduction">
                <div className="icon" style={{backgroundImage: "url('/images/topics/introduction.svg')"}}></div>
                Introduction
            </TopicTitle>
            <IntroParagraph profile={} />
            { */ }

            <TopicTitle slug="economy">
                <div className="icon" style={{backgroundImage: "url('/images/topics/agriculture.svg')"}}></div>
                Economy
            </TopicTitle>
            <ExportsByProduct />
            <ExportsByDestination />
            <ImportsByOrigin />
            <OutputByIndustry />
            <TradeBalance />
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
