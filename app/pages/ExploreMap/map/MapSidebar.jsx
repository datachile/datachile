import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Icon } from "@blueprintjs/core";

import CustomSelect from "components/CustomSelect";
import CustomMultiSelect from "components/CustomMultiSelect";
import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import "./MapSidebar.css";

function hasGeoDimensions(dimensions) {
  return (
    dimensions.length > 0 &&
    dimensions.some(
      dim =>
        dim.hierarchies.length > 0 &&
        dim.hierarchies.some(hie => hie.name == "Geography")
    )
  );
}

class MapSidebar extends React.Component {
  static need = [
    (params, store) => {
      // mondrian-rest-client doesn't use the annotations from the json
      const promise = mondrianClient.cubes().then(cubes => {
        const indicators = {};
        const dimensions = {};
        const measures = {};

        for (let cube, i = 0; (cube = cubes[i]); i++) {
          if (!hasGeoDimensions(cube.dimensions)) continue;

          const topic = cube.annotations.topic;

          if (!indicators.hasOwnProperty(topic)) indicators[topic] = [];
          indicators[topic].push({ value: cube.name, name: cube.caption });

          dimensions[cube.name] = cube.dimensions.map(ms => ({
            value: ms.name,
            name: ms.caption
          }));
          measures[cube.name] = cube.measures.map(ms => ({
            value: ms.name,
            name: ms.annotations.es_element_caption || ms.caption
          }));
        }

        delete indicators.undefined;

        return {
          key: "map_params",
          data: {
            indicators,
            dimensions,
            measures
          }
        };
      });

      return { type: "GET_DATA", promise };
    }
  ];

  constructor(props) {
    super(props);

    this.topics = this.getTopicOptions.call(this);
    props.setTopic(this.topics[0]);
  }

  componentWillReceiveProps(nextProps) {
    const { valueTopic, valueIndicator } = nextProps;

    if (valueTopic && this.props.valueTopic != valueTopic) {
      const indicators = this.getIndicatorOptions(valueTopic);
      this.indicators = indicators;
      indicators[0] && nextProps.setIndicator(indicators[0]);
    }

    if (valueIndicator && this.props.valueIndicator != valueIndicator) {
      const measures = this.getMeasureOptions(valueIndicator);
      this.measures = measures;
      measures[0] && nextProps.setMeasure(measures[0]);
    }
  }

  getTopicOptions() {
    const { t } = this.props;

    return [
      { value: "economy", name: t("Economy") },
      { value: "education", name: t("Education") },
      { value: "environment", name: t("Housing & Environment") },
      { value: "demography", name: t("Demography") },
      { value: "health", name: t("Health") },
      { value: "civics", name: t("Civic") }
    ].map(item => {
      item.icon = `/images/profile-icon/icon-${item.value}.svg`;
      return item;
    });
  }

  getIndicatorOptions = valueTopic => {
    return valueTopic
      ? this.props.data.map_params.indicators[valueTopic.value] || []
      : [];
  };

  getMeasureOptions = valueIndicator => {
    return valueIndicator
      ? this.props.data.map_params.measures[valueIndicator.value] || []
      : [];
  };

  render() {
    const { data, t } = this.props;

    const { valueTopic, setTopic } = this.props;
    const { valueIndicator, setIndicator } = this.props;
    const { valueMeasure, setMeasure } = this.props;
    // const params = this.props.dimParams;

    const optionTopic = this.topics;
    const optionIndicator =
      this.indicators || this.getIndicatorOptions(valueTopic);
    const optionMeasure =
      this.measures || this.getMeasureOptions(valueIndicator);
    const optionAnythingElse = [];

    // if (valueIndicator) {
    //   const dimensions = data.map_params.dimensions[valueIndicator.value] || [];
    //   for (let dim, i = 0; (dim = dimensions[i]); i++) {
    //     let dimParams = params;
    //     optionAnythingElse.push(
    //       <OptionGroup label={dim.caption}>
    //         <CustomSelect
    //           items={this.state[dim.name].options}
    //           value={valueIndicator}
    //           onItemSelect={setIndicator}
    //           filterable={false}
    //         />
    //       </OptionGroup>
    //     );
    //   }
    // }

    return (
      <div className="map-sidebar">
        <h1>{t("Map")}</h1>
        <OptionGroup label={t("Topics")}>
          <CustomSelect
            items={optionTopic}
            value={valueTopic}
            onItemSelect={setTopic}
            filterable={false}
          >
            <div className="select-option current" title={valueTopic.name}>
              <img className="icon" src={valueTopic.icon} />
              <span className="value">{valueTopic.name}</span>
              <Icon iconName="double-caret-vertical" />
            </div>
          </CustomSelect>
        </OptionGroup>

        <OptionGroup label={t("Indicator")}>
          <CustomSelect
            items={optionIndicator}
            value={valueIndicator}
            onItemSelect={setIndicator}
            filterable={false}
          />
        </OptionGroup>

        <OptionGroup label={t("Measure")}>
          <CustomSelect
            items={optionMeasure}
            value={valueMeasure}
            onItemSelect={setMeasure}
            filterable={false}
          />
        </OptionGroup>

        <Link to="/explore/map/data">Go to data</Link>
      </div>
    );
  }
}

function OptionGroup(props) {
  return (
    <div className="option-group">
      <label className="option-label">{props.label}</label>
      {props.children}
    </div>
  );
}

const mapStateToProps = state => ({
  valueTopic: state.map.params.topic,
  valueIndicator: state.map.params.indicator,
  valueMeasure: state.map.params.measure
});

const mapDispatchToProps = dispatch => ({
  setTopic(payload) {
    dispatch({ type: "MAP_TOPIC_SET", payload });
  },
  setIndicator(payload) {
    dispatch({ type: "MAP_INDICATOR_SET", payload });
  },
  setMeasure(payload) {
    dispatch({ type: "MAP_MEASURE_SET", payload });
  }
});

MapSidebar = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapSidebar)
);

export default MapSidebar;
export { MapSidebar };
