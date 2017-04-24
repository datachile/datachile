import React, { PropTypes } from "react";
import {connect} from "react-redux";
import {fetchStats} from "actions/profile";
import {Profile, Stat} from "datawheel-canon";
import SourceNote from "components/SourceNote";
import TopicBlock from "components/TopicBlock";
import NavFixed from "components/NavFixed";
import d3plus from "helpers/d3plus";
import {Geomap} from "d3plus-react";
import SvgMap from "components/SvgMap";
import { browserHistory } from 'react-router';

import { GEOMAP, GEO } from "helpers/GeoData";

import "./intro.css";
import "./topics.css";

import IntroParagraph from "./splash/IntroParagraph";
import ExportsByProduct from './economy/ExportsByProduct';
import ExportsByDestination from './economy/ExportsByDestination';
import ImportsByOrigin from './economy/ImportsByOrigin';
import OutputByIndustry from './economy/OutputByIndustry';
import TradeBalance from './economy/TradeBalance';

import {translate} from "react-i18next";

const topics = [
  {
    slug: "economy",
    title: 'Economy'
  },
  {
    slug: "innovation",
    title: "Innovation"
  },
  {
    slug: "education",
    title: "Education"
  },
  {
    slug: "environment",
    title: "Environment"
  },
  {
    slug: "demographics",
    title: "Demographics"
  },
  {
    slug: "health",
    title: "Health"
  },
  {
    slug: "politics",
    title: "Politics"
  }
];

class GeoProfile extends Profile {

  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  };

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

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    const {activeSub, subnav} = this.state;
    const newSub = this.refs.sublinks.getBoundingClientRect().top <= 0;

    let newActive = false;
    for (let i = 0; i < topics.length; i++) {
      const top = document.getElementById(topics[i].slug).getBoundingClientRect().top;
      if (top <= 0) newActive = topics[i].slug;
    }
    if (subnav !== newSub || newActive !== activeSub) {
      this.setState({activeSub: newActive, subnav: newSub});
    }

  }

  render() {

    const { subnav, activeSub } = this.state;

    const { region, comuna } = this.props.routeParams;

    const geo = (comuna)?GEOMAP.getRegion(region+'.'+comuna):GEOMAP.getRegion(region);

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

    const key = (geo.parent)?geo.parent.key:geo.key;
    const slug = (geo.parent)?geo.parent.slug:geo.slug;

    const onlyRegions = GEO.filter(function(d){
      return d.parent==false && d.slug != 'chile';
    });

    console.info(onlyRegions);

    function fillShape(d) {
      if(geo.slug=='chile'){
        return "rgba(255, 255, 255, 0.5)";
      }
      return (parseInt(d.id)==parseInt(key))? "rgba(255, 255, 255, 1)":"rgba(255, 255, 255, 0.35)";
    }

    return (
        <div className="profile">

            <NavFixed topics={ topics } visible={ subnav } activeSub={ activeSub } geo={ geo } type={ type } />

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

                        <div className="map-region">
                            <Geomap config={{
                              data: onlyRegions,
                              downloadButton: false,
                              groupBy: "key",
                              height: 500,
                              label: d => 'Región '+d.name,
                              legend: false,
                              ocean: "transparent",
                              on: {
                                "click.shape": function(d) {
                                  browserHistory.push('/geo/'+d.slug);
                                }
                              },
                              padding: 10,
                              shapeConfig: {
                                hoverOpacity: 1,
                                Path: {
                                  fill: fillShape,
                                  stroke: "rgba(255, 255, 255, 0.75)"
                                }
                              },
                              tiles: false,
                              tooltipConfig: {
                                background: "white",
                                body: "",
                                footer: "",
                                footerStyle: {
                                  "margin-top": 0
                                },
                                padding: "12px",
                                html: d => `${d.properties.Region}`
                              },
                              topojson: "/geo/regiones.json",
                              topojsonId: "id",
                              topojsonKey: "regiones",
                              width: 200,
                              zoom: false
                            }} />

                          </div>
                          <div className="map-comuna">
                            { slug!='chile' &&
                              <SvgMap slug={slug} active={(geo.parent)?geo.slug:false} />
                            }
                        </div>
                    </div>
                </div>

                <div id="sublinks" ref="sublinks" className="dc-container">
                    <div className="subnav">
                      {
                        topics.map(topic =>
                          <a key={ topic.slug } className="sublink" href={ `#${topic.slug}` }>
                              <img className="icon" src={ `/images/profile-icon/icon-${topic.slug}.svg`} />
                              { topic.title }
                          </a>
                        )
                      }
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
