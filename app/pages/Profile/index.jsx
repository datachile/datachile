import React, { PropTypes } from "react";
import {connect} from "react-redux";
import {fetchStats} from "actions/profile";
import {Profile, Stat} from "datawheel-canon";
import SourceNote from "components/SourceNote";
import TopicBlock from "components/TopicBlock";
import d3plus from "helpers/d3plus";

import { GEOMAP } from "helpers/GeoData";

import "./intro.css";
import "./topics.css";

import IntroParagraph from "./splash/IntroParagraph";
import ExportsByProduct from './economy/ExportsByProduct';
import ExportsByDestination from './economy/ExportsByDestination';
import ImportsByOrigin from './economy/ImportsByOrigin';
import OutputByIndustry from './economy/OutputByIndustry';
import TradeBalance from './economy/TradeBalance';

import {translate} from "react-i18next";

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

    const {attrs, focus, t} = this.props;

    var type = '';
    switch(geo.type){
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
                            <div className="subtitle">{ type }</div>
                            <Stat value={ stats.population } label={ t('Population') } />
                            <Stat value={ '$' + stats.income_avg } label={ t('Average Household') } />
                            <Stat value={ stats.age_avg +' '+ t('years')} label={ t('Average age') } />
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
                            { t('Economy') }
                        </a>
                        <a className="sublink" href="#innovation">
                            <img className="icon" src="/images/profile-icon/icon-innovation.svg" />
                            { t('Innovation') }
                        </a>
                        <a className="sublink" href="#education">
                            <img className="icon" src="/images/profile-icon/icon-education.svg" />
                            { t('Education') }
                        </a>
                        <a className="sublink" href="#environment">
                            <img className="icon" src="/images/profile-icon/icon-environment.svg" />
                            { t('Environment') }
                        </a>
                        <a className="sublink" href="#demographics">
                            <img className="icon" src="/images/profile-icon/icon-demographics.svg" />
                            { t('Demographics') }
                        </a>
                        <a className="sublink" href="#health">
                            <img className="icon" src="/images/profile-icon/icon-health.svg" />
                            { t('Health') }
                        </a>
                        <a className="sublink" href="#politics">
                            <img className="icon" src="/images/profile-icon/icon-politics.svg" />
                            { t('Politics') }
                        </a>

                    </div>
                </div>

                <div className="dc-container">
                    <div className="sources">
                        <SourceNote icon="/images/icons/icon-source.svg">
                            <strong>{ t("Data source") }:</strong> {stats.source} - {stats.source_year}
                        </SourceNote>
                        <SourceNote icon="/images/icons/icon-camera-source.svg">
                            <strong>{ t("Pic by") }:</strong> {geo.background_source}
                        </SourceNote>
                    </div>
                </div>


            </div>

            <TopicBlock slug="economy" name={ t('Economy') } targets={[
                        [t('Exports By Product'),'ExportsByProduct'],
                        [t('Exports By Destination'),'ExportsByDestination'],
                        [t('Imports By Origin Country'),'ImportsByOrigin'],
                        [t('Output By Industry'),'OutputByIndustry'],
                        [t('Trade Balance'),'TradeBalance']
                        ]}>
    
                <ExportsByProduct />
                <ExportsByDestination />
                <ImportsByOrigin />
                <OutputByIndustry />
                <TradeBalance />

            </TopicBlock>

            <TopicBlock slug="innovation" name={ t('Innovation') } targets={[]}>
                <p className="soon">{ t('Soon') }</p>
            </TopicBlock>

            <TopicBlock slug="education" name={ t('Education') } targets={[]}>
                <p className="soon">{ t('Soon') }</p>
            </TopicBlock>

            <TopicBlock slug="environment" name={ t('Environment') } targets={[]}>
                <p className="soon">{ t('Soon') }</p>
            </TopicBlock>

            <TopicBlock slug="demographics" name={ t('Demographics') } targets={[]}>
                <p className="soon">{ t('Soon') }</p>
            </TopicBlock>

            <TopicBlock slug="health" name={ t('Health') } targets={[]}>
                <p className="soon">{ t('Soon') }</p>
            </TopicBlock>

            <TopicBlock slug="politics" name={ t('Politics') } targets={[]}>
                <p className="soon">{ t('Soon') }</p>
            </TopicBlock>

        </div>
    );
  }
}


export default translate()(connect(state => ({
  attrs: state.attrs,
  data: state.profile.data,
  focus: state.focus,
  stats: state.profile.stats
}), {})(GeoProfile));
