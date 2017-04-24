import React, {Component} from "react";
import {Link} from "react-router";
import {translate} from "react-i18next";
import {text as loadSvgAsString} from 'd3-request';
import {select,selectAll,event} from 'd3-selection';
import { browserHistory } from 'react-router';
import { GEOMAP } from "helpers/GeoData";
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
    loadSvgAsString('/images/maps/zoom/'+this.props.slug+'.svg').get(this.callbackSvg);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.slug !== this.props.slug) {
      loadSvgAsString('/images/maps/zoom/'+nextProps.slug+'.svg').get(this.callbackSvg);
    }
    if (nextProps.active !== this.props.active) {
      this.prepareSelected(nextProps.active);
    }
  };


  prepareSelected(active){
    selectAll('.svg-map .comuna').classed('selected',false);
    select('.svg-map .comuna#'+active).classed('selected',true);
    select('.svg-map #svg-map-tooltip').style('opacity',0);
  }

  launchEvents() {
    
    this.prepareSelected(this.props.active);

    var slug = this.props.slug;

    var tooltip = select('.svg-map #svg-map-tooltip');

    selectAll('.svg-map .comuna')
      .on('mouseover', function(d,a){
        var id = select(this).classed('hover',true).attr('id');
        var data = GEOMAP.getRegion(slug+'.'+id);
        tooltip.transition()
           .duration(200)
           .style("opacity", .9);
        tooltip.html('Comuna '+data.name)
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
        browserHistory.push('/geo/'+slug+'/'+select(this).attr('id'));
      });

    selectAll('.svg-map .region')
      .on('mouseover', function(d,a){
        var id = select(this).classed('hover',true).attr('id');
        var data = GEOMAP.getRegion(id);
        tooltip.transition()
           .duration(200)
           .style("opacity", .9);
        tooltip.html('Región '+data.name)
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
        browserHistory.push('/geo/'+select(this).attr('id'));
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
