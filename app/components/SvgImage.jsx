import React, { Component } from "react";
import { text as loadSvgAsString } from "d3-request";
import { select, selectAll, event } from "d3-selection";
import { translate } from "react-i18next";

class SvgImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svgFile: ""
    };

    this.callbackSvg = this.callbackSvg.bind(this);
  }

  callbackSvg(error, xml) {
    if (error) throw error;
    this.setState(
      {
        svgFile: xml
      },
      function() {}
    );
  }

  componentDidMount() {
    loadSvgAsString(this.props.src).get(this.callbackSvg);
  }

  /*componentWillReceiveProps(nextProps) {
    if (nextProps.slug !== this.props.slug) {
      loadSvgAsString('/images/maps/zoom/'+nextProps.slug+'.svg').get(this.callbackSvg);
    }
    if (nextProps.active !== this.props.active) {
      this.prepareSelected(nextProps.active);
    }
  };*/

  render() {
    const { t, extraClass } = this.props;

    const clase = extraClass ? extraClass : "";

    return (
      <div
        className={`svg-image ${clase}`}
        dangerouslySetInnerHTML={{ __html: this.state.svgFile }}
      />
    );
  }
}

export default translate()(SvgImage);
