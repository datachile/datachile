import React, {Component} from "react";
import {Link} from "react-router";
import {translate} from "react-i18next";
import {text as loadSvgAsString} from 'd3-request';
import {select,selectAll,event} from 'd3-selection';
import { browserHistory } from 'react-router';
import { GEOMAP } from "helpers/GeoData";
import { slugifyItem } from "helpers/formatters";
import "./SvgMap.css";


class SvgMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
        svgFile: ''
    };

    this.callbackSvg = this.callbackSvg.bind(this);
    this.launchEvents = this.launchEvents.bind(this);

  };

  callbackSvg(error, xml) {
    if (error) throw error;
    this.setState({
      svgFile: xml
    },function(){
      this.launchEvents()
    });

  };

  componentDidMount() {
    loadSvgAsString('/images/maps/zoom/comunas-'+this.props.region.key+'.svg').get(this.callbackSvg);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.region.key !== this.props.region.key) {
      loadSvgAsString('/images/maps/zoom/comunas-'+this.props.region.key+'.svg').get(this.callbackSvg);
    }
    if (nextProps.active.key !== this.props.active.key) {
      this.prepareSelected(nextProps.active.key);
    }
  };


  prepareSelected(active){
    selectAll('.svg-map .comuna').classed('selected',false);
    select('.svg-map .comuna#c'+active).classed('selected',true);
    select('.svg-map #svg-map-tooltip').style('opacity',0);
  }

  launchEvents() {
    
    this.prepareSelected(this.props.active.key);

    var slug = this.props.slug;

    var tooltip = select('.svg-map #svg-map-tooltip');

    var region = this.props.region;

    selectAll('.svg-map .comuna')
      .on('mouseover', function(d,a){
        var d = select(this);
        var id = d.classed('hover',true).attr('id');
        tooltip.transition()
           .duration(200)
           .style("opacity", .9);
        tooltip.html('Comuna '+d.attr('name'))
         .style("left", (event.pageX) + "px")
         .style("top", (event.pageY - 28) + "px");
      })
      .on('mouseout', function(d,a){
        select(this).classed('hover',false);
        tooltip.transition()
           .duration(200)
           .style("opacity", 0);
      })
      .on('mousemove', function(d,a){
        tooltip
         .style("left", (event.pageX) + "px")
         .style("top", (event.pageY - 28) + "px");
      })
      .on('click',function(){
        var d = select(this);
        browserHistory.push(slugifyItem('geo',region.key,region.name,d.attr('id').replace('c',''),d.attr('name')));
      });

    selectAll('.svg-map .region')
      .on('mouseover', function(d,a){
        var d = select(this);
        var id = d.classed('hover',true).attr('id');
        tooltip.transition()
           .duration(200)
           .style("opacity", .9);
        tooltip.html('Región '+d.attr('name'))
         .style("left", (event.pageX) + "px")
         .style("top", (event.pageY - 28) + "px");
      })
      .on('mouseout', function(d,a){
        select(this).classed('hover',false);
        tooltip.transition()
           .duration(200)
           .style("opacity", 0);
      })
      .on('mousemove', function(d,a){
        tooltip
         .style("left", (event.pageX) + "px")
         .style("top", (event.pageY - 28) + "px");
      })
      .on('click',function(){
        var d = select(this);
        browserHistory.push(slugifyItem('geo',d.attr('id'),d.attr('name')));
      });

  };

  render() {
    const {t,slug,active} = this.props;

    return (
        <div className="svg-map">
          <div id="svg-map-tooltip"></div>
          <div ref="svgcontainer" dangerouslySetInnerHTML={{ __html: this.state.svgFile }} ></div>
        </div>
    );
  }
}

export default translate()(SvgMap);
