import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Icon } from "@blueprintjs/core";

import CustomSelect from "components/CustomSelect";
import CustomMultiSelect from "components/CustomMultiSelect";

import { guessAcceptableName } from "helpers/formatters";
import mondrianClient from "helpers/MondrianClient";

import "./MapSidebar.css";

class MapSidebar extends React.Component {
  static need = [
    (params, store) => {
      const hasGeoDimensions = dimensions =>
        dimensions.length > 0 &&
        dimensions.some(
          dim =>
            dim.hierarchies.length > 0 &&
            dim.hierarchies.some(hie => hie.name == "Geography")
        );

      // mondrian-rest-client doesn't use the annotations from the json
      const promise = mondrianClient.cubes().then(cubes => {
        const indicators = {};
        const levels = {};
        const measures = {};

        for (let cube, i = 0; (cube = cubes[i]); i++) {
          if (!hasGeoDimensions(cube.dimensions)) continue;

          const topic = cube.annotations.topic;

          if (!indicators.hasOwnProperty(topic)) indicators[topic] = [];
          indicators[topic].push({ value: cube.name, name: cube.caption });

          levels[cube.name] = cube.dimensions.reduce((output, dim) => {
            if (!/Geography$|^Date$/.test(dim.name)) {
              for (let hier, i = 0; (hier = dim.hierarchies[i]); i++) {
                for (let level, j = 1; (level = hier.levels[j]); j++) {
                  output.push({
                    key: level.fullName,
                    name: guessAcceptableName(level)
                  });
                }
              }
            }
            return output;
          }, []);

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
            levels,
            measures
          }
        };
      });

      return { type: "GET_DATA", promise };
    }
  ];

  constructor(props) {
    super(props);

    const t = props.t;

    this.topics = [
      { value: "economy", name: t("Economy") },
      { value: "education", name: t("Education") },
      { value: "environment", name: t("Housing & Environment") },
      { value: "demography", name: t("Demography") },
      { value: "health", name: t("Health") },
      { value: "civics", name: t("Civics") }
    ].map(item => {
      item.icon = `/images/profile-icon/icon-${item.value}.svg`;
      return item;
    });
    props.setTopic(this.topics[0]);

    this.getIndicatorOptions = this.getOptions.bind(this, "indicators");
    this.getMeasureOptions = this.getOptions.bind(this, "measures");
    this.getLevelOptions = this.getOptions.bind(this, "levels");
  }

  componentWillReceiveProps(nextProps) {
    const { valueTopic, valueIndicator } = nextProps;

    if (valueTopic && this.props.valueTopic != valueTopic) {
      const indicators = this.getIndicatorOptions(valueTopic);
      this.indicators = indicators;
      indicators[0] && nextProps.setIndicator(indicators[0]);
    }

    if (valueIndicator && this.props.valueIndicator != valueIndicator) {
      this.levels = this.getLevelOptions(valueIndicator);

      const measures = this.getMeasureOptions(valueIndicator);
      this.measures = measures;
      measures[0] && nextProps.setMeasure(measures[0]);
    }
  }

  getOptions(collection, key) {
    return key ? this.props.data.map_params[collection][key.value] || [] : [];
  }

  render() {
    const { t, setTopic, setIndicator, setMeasure, setCut } = this.props;
    const { valueTopic, valueIndicator, valueMeasure } = this.props;
    const { cutOptions, cutValues } = this.props;

    const optionTopic = this.topics;
    const optionIndicator =
      this.indicators || this.getIndicatorOptions(valueTopic);
    const optionMeasure =
      this.measures || this.getMeasureOptions(valueIndicator);

    const selectorsCut = [];

    if (valueIndicator) {
      const levels = this.levels || this.getLevelOptions(valueIndicator);

      for (let lvl, i = 0; (lvl = levels[i]); i++) {
        let optionCut = cutOptions[lvl.key] || [];
        let valueCut = cutValues[lvl.key];

        selectorsCut.push(
          <OptionGroup label={lvl.name}>
            <CustomSelect
              items={optionCut}
              value={valueCut}
              onItemSelect={setCut.bind(null, lvl.key)}
              filterable={optionCut.length > 6}
            />
          </OptionGroup>
        );
      }
    }

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

        {selectorsCut}

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
  cutOptions: state.map.options,
  cutValues: state.map.params.cuts,
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
  },
  setCut(level, value) {
    dispatch({ type: "MAP_CUT_SET", payload: { level, value } });
  }
});

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapSidebar)
);
