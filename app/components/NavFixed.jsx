import React, {Component} from "react";
import {Link} from "react-router";
import {translate} from "react-i18next";
import {connect} from "react-redux";
import {Geomap} from "d3plus-react";
import FeaturedBox from "components/FeaturedBox";
import {GEO,GEOMAP} from "helpers/GeoData";
import { FORMATTERS } from "helpers/formatters";
import "./NavFixed.css";

class NavFixed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      default_region: props.geo,
      selected_region: props.geo
    };

    this.showNavSelection = this.showNavSelection.bind(this);
    this.hideNavSelection = this.hideNavSelection.bind(this);
    this.toggleNavSelection = this.toggleNavSelection.bind(this);
    this.regionOver = this.regionOver.bind(this);
    this.regionOut = this.regionOut.bind(this);
  };

  toggleNavSelection() {
    this.setState({
      open: !this.state.open
    });
  }

  showNavSelection() {
    this.setState({
      open: true
    });
  }

  hideNavSelection() {
    this.setState({
      open: false
    });
  }

  regionOver(selected) {
    this.setState({
      selected_region: selected
    });
  }

  regionOut() {
    /*console.log('out');
    this.setState({
      selected_region: this.state.default_region
    });*/
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible == false) {
      this.hideNavSelection();
    }
  }

  render() {
    const {t,topics,visible,activeSub,geo,type,focus} = this.props;

    const { open,selected_region} = this.state;

    const featured = focus.map(f => GEOMAP.getRegion(f));

    function fillShape(d) {
      if(selected_region.slug=='chile'){
        return "rgba(255, 255, 255, 1)";
      }
      return (parseInt(d.id)==parseInt(selected_region.key))? "rgba(255, 255, 255, 1)":"rgba(255, 255, 255, 0.35)";
    }

    return (
      <nav className={ `nav-fixed${ visible ? "" : " hidden" }` }>
        
        <div className="nav-geo">
          <div className="dc-container">
            <div className="nav-side-menu-link">
              <img src="/images/icons/icon-menu.svg" />
            </div>
            <div className="nav-titles">
              <span className="datachile">DataChile:</span> <a className="geo-title" onClick={this.toggleNavSelection}>{ geo.caption } { type } <span className={ `${ open ? "" : " hidden" }` }>&#9650;</span> <span className={ `${ open ? " hidden" : "" }` }>&#x25BC;</span></a>
            </div>
            <div className="nav-search">
              <img src="/images/icons/icon-lupa-header.svg" />
            </div>
          </div>
        </div>

        <div className="nav-topic">
          <div className="dc-container">
            <div className="subtopic-selector">
              <span className="label">{ t("Estás viendo") }:</span>
              <span className="value">{ activeSub } </span>
            </div>
            <div className="topics">
              {
                topics.map(topic =>
                  <a key={ topic.slug } className={`topic-link${ topic.slug==activeSub ? " active" : "" }`} href={ `#${topic.slug}` }>
                      <img className="icon" src={ `/images/profile-icon/icon-${topic.slug}.svg`} />
                      { topic.title }
                  </a>
                )
              }
            </div>
          </div>
        </div>

        <div className={ `nav-selection dc-container${ open ? "" : " hidden" }` } >
          <div className="map-regions">
            <div className="map-viz">
              <div className="national-link">
                <Link to="/geo/chile">Chile</Link>
              </div>
              <Geomap config={{
                downloadButton: false,
                groupBy: "id",
                height: 400,
                label: d => d.properties.Region,
                legend: true,
                ocean: "transparent",
                on: {
                  "click.shape": d => {
                    if (d) window.location = `/profile/${d.id}`;
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
                  body: "dale!!",
                  footer: "",
                  footerStyle: {
                    "margin-top": 0
                  },
                  padding: "12px",
                  html: d => `${d.properties.Region}<img class='link-arrow' src='/images/nav/link-arrow.svg' />`
                },
                topojson: "/geo/regiones.json",
                topojsonId: "id",
                topojsonKey: "regiones",
                width: 200,
                zoom: false
              }} />
            </div>
            <div className="region-list">
              <h3>{t('Regions of Chile')}</h3>
              <ul>
                {
                  GEO.map(region =>
                    <li key={ region.slug } className={`region-link${ region.key==this.state.selected_region.key ? " selected" : "" }`} onMouseOver={this.regionOver.bind(this,region)} onMouseOut={this.regionOut} >
                        { FORMATTERS.roman(region.key) }. { region.name }
                    </li>
                  )
                }
              </ul>
            </div>
          </div>
          <div className="comunas">
            <h3>{t('Comunas in')} <Link to={this.state.selected_region.url}>{ this.state.selected_region.name }</Link></h3>
            <ul>
            {
              this.state.selected_region.children && this.state.selected_region.children.map(comuna =>
                <li key={ comuna.slug } className={`comuna-link`} >
                    <Link to={comuna.url}>{ comuna.name }</Link>
                </li>
              )
            }
            </ul>
          </div>
          <div className="profiles">
            <h3>{t('Featured profiles')}</h3>
            <a onClick={this.hideNavSelection}>x</a>
            {
              featured.map(f =>
                  <FeaturedBox key={f.key} item={f} />
              )
            }
          </div>
        </div>

      </nav>
    );
  }
}

NavFixed.defaultProps = {
  visible: false,
  activeSub: false
};

export default translate()(connect(state => ({
    focus: state.focus
}), {})(NavFixed));
