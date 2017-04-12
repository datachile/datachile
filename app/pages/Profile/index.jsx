import React, { PropTypes } from "react";
import {connect} from "react-redux";
import {fetchStats} from "actions/profile";
import {Profile} from "datawheel-canon";
import SourceNote from "components/SourceNote";
import TopicBlock from "components/TopicBlock";
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

    const stats = {
        population: '17.5M',
        age_avg: 300.000,
        income_avg: 31.5,
        source: 'INE Censo',
        source_year: 2013
    }

    const {attrs, focus} = this.props;

    return (
        <div className="profile">

            <div className="intro">

                <div className="splash">
                    <div className="image" style={{backgroundImage: `url('/images/profile-bg/${geo.background}')`}} ></div>
                    <div className="gradient"></div>
                </div>

                <div className="dc-container">
                    <div className="header">
                        
                        <div className="meta">
                            {geo.parent &&
                              <div className="parent">{geo.parent.caption}</div>
                            }
                            <div className="title">{ geo.caption }</div>
                            <div className="subtitle">{ geo.type }</div>
                            <div className="stat">
                                <div className="value">{ stats.population }</div>
                                <div className="label">Population</div>
                            </div>
                            <div className="stat">
                                <div className="value">${ stats.income_avg }</div>
                                <div className="label">Average Household</div>
                            </div>
                            <div className="stat">
                                <div className="value">{ stats.age_avg } years</div>
                                <div className="label">Average age</div>
                            </div>
                        </div>

                        <div className="map">
                            <img src={'/images/maps/'+geo.map}/>
                        </div>
                    </div>
                </div>

                <div className="dc-container">
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
                        <a className="sublink" href="#health">
                            <img className="icon" src="/images/profile-icon/icon-health.svg" />
                            Health
                        </a>
                        <a className="sublink" href="#politics">
                            <img className="icon" src="/images/profile-icon/icon-politics.svg" />
                            Politics
                        </a>

                    </div>
                </div>

                <div className="dc-container">
                    <div className="sources">
                        <SourceNote icon="/images/icons/icon-source.svg">
                            <strong>Data source:</strong> {stats.source} - {stats.source_year}
                        </SourceNote>
                        <SourceNote icon="/images/icons/icon-camera-source.svg">
                            <strong>Pic by:</strong> {geo.background_source}
                        </SourceNote>
                    </div>
                </div>


            </div>

            <TopicBlock slug="economy" name="Economy" targets={['Exports By Product','Exports By Destination','Imports By Origin','Output By Industry','Trade Balance']}>
    
                <ExportsByProduct />
                <ExportsByDestination />
                <ImportsByOrigin />
                <OutputByIndustry />
                <TradeBalance />

            </TopicBlock>

            <TopicBlock slug="innovation" name="Innovation" targets={[]}>
                <p className="soon">Soon...</p>
            </TopicBlock>

            <TopicBlock slug="education" name="Education" targets={[]}>
                <p className="soon">Soon...</p>
            </TopicBlock>

            <TopicBlock slug="environment" name="Environment" targets={[]}>
                <p className="soon">Soon...</p>
            </TopicBlock>

            <TopicBlock slug="demographics" name="Demographics" targets={[]}>
                <p className="soon">Soon...</p>
            </TopicBlock>

            <TopicBlock slug="health" name="Health" targets={[]}>
                <p className="soon">Soon...</p>
            </TopicBlock>

            <TopicBlock slug="politics" name="Politics" targets={[]}>
                <p className="soon">Soon...</p>
            </TopicBlock>

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
