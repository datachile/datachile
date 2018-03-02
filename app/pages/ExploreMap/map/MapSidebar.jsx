import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Icon } from "@blueprintjs/core";

import CustomSelect from "components/CustomSelect";

import { classnames, guessAcceptableName } from "helpers/formatters";
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
        const hierarchies = {};
        const measures = {};

        for (let cube, i = 0; (cube = cubes[i]); i++) {
          if (!hasGeoDimensions(cube.dimensions)) continue;

          const topic = cube.annotations.topic;

          measures[topic] = [].concat(
            measures[topic] || [],
            cube.measures
              .filter(m => m.annotations.es_element_caption)
              .map(ms => ({
                cube: cube.name,
                value: ms.name,
                name: ms.annotations.es_element_caption || ms.caption
              }))
          );

          let selectors = [];

          const availableDims = cube.annotations.available_dimensions
            ? cube.annotations.available_dimensions.split(",")
            : [];

          for (let dim, j = 0; (dim = cube.dimensions[j]); j++) {
            if (
              !/Geography$|^Date$/.test(dim.name) &&
              availableDims.indexOf(dim.name) > -1
            ) {
              for (let hier, k = 0; (hier = dim.hierarchies[k]); k++) {
                selectors.push({
                  cube: cube.name,
                  name:
                    dim.annotations.es_element_caption ||
                    dim.caption ||
                    dim.name,
                  value: `[${dim.name}].[${hier.name}]`,
                  isGeo: /country/i.test(dim.name),
                  levels: hier.levels.slice(1).map(lvl => ({
                    value: lvl.fullName,
                    name: lvl.annotations.es_element_caption || lvl.caption
                  }))
                });
              }
            }
          }

          hierarchies[cube.name] = selectors;
        }

        return {
          key: "map_params",
          data: {
            hierarchies,
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
  }

  getMeasureOptions = key =>
    key ? this.props.data.map_params.measures[key.value] || [] : [];

  getSelectors = cube => this.props.data.map_params.hierarchies[cube] || [];

  componentWillReceiveProps(nextProps) {
    const { cube, valueTopic } = nextProps;

    if (valueTopic && this.props.valueTopic != valueTopic) {
      const measures = this.getMeasureOptions(valueTopic);
      this.measures = measures;
      measures[0] && nextProps.setMeasure(measures[0]);
    }

    if (cube && this.props.cube != cube) {
      this.selectors = this.getSelectors(cube);
    }
  }

  render() {
    const { t, setTopic, setMeasure, setSelectorLevel } = this.props;
    const { cube, valueTopic, valueMeasure, selectorHier } = this.props;
    const { memberOptions, memberValues, addCut, removeCut } = this.props;

    const optionTopic = this.topics;
    const optionMeasure = this.measures || this.getMeasureOptions(valueTopic);

    const selectorNodes = [];

    if (cube) {
      const selectors = this.selectors || this.getSelectors(cube);

      for (let sel, i = 0; (sel = selectors[i]); i++) {
        let currentLevel = selectorHier[sel.value] || sel.levels[0];
        let optionMembers =
          memberOptions[`[${sel.cube}].${currentLevel.value}`] || [];

        let valueMembers = memberValues[sel.value];

        let optionLevel = sel.levels.map(lvl => (
          <button
            className={classnames({ active: lvl == currentLevel })}
            onClick={setSelectorLevel.bind(null, sel.value, lvl)}
          >
            {lvl.name}
          </button>
        ));

        selectorNodes.push(
          <OptionGroup label={sel.name} icon={sel.isGeo ? "geo" : "indicator"}>
            {optionLevel.length > 1 && (
              <div className="option-hierarchy">{optionLevel}</div>
            )}
            <CustomSelect
              multiple={true}
              items={optionMembers}
              value={valueMembers}
              onItemSelect={addCut.bind(null, sel.value)}
              onItemRemove={removeCut.bind(null, sel.value)}
              placeholder={t("Add a filter...")}
            />
          </OptionGroup>
        );
      }
    }

    return (
      <div className="map-sidebar">
        <h1>{t("Map")}</h1>
        <OptionGroup label={t("Topics")} icon="topic">
          <CustomSelect
            items={optionTopic}
            value={valueTopic}
            onItemSelect={setTopic}
            filterable={false}
          />
        </OptionGroup>

        <OptionGroup label={t("Measure")} icon="measure">
          <CustomSelect
            items={optionMeasure}
            value={valueMeasure}
            onItemSelect={setMeasure}
            filterable={false}
          />
        </OptionGroup>

        {selectorNodes}
      </div>
    );
  }
}

function OptionGroup(props) {
  return (
    <div className="option-group">
      <label
        className="option-label"
        style={{
          backgroundImage: `url(/images/icons/icon-map-${props.icon}.svg)`
        }}
      >
        {props.label}
      </label>
      {props.children}
    </div>
  );
}

const mapStateToProps = state => ({
  cube: state.map.params.measure && state.map.params.measure.cube,
  memberOptions: state.map.options,
  memberValues: state.map.params.cuts,
  valueTopic: state.map.params.topic,
  valueMeasure: state.map.params.measure,
  selectorHier: state.map.params.selector
});

const mapDispatchToProps = dispatch => ({
  setTopic(payload) {
    dispatch({ type: "MAP_TOPIC_SET", payload });
  },
  setMeasure(payload) {
    dispatch({ type: "MAP_MEASURE_SET", payload });
  },
  setSelectorLevel(key, level) {
    dispatch({ type: "MAP_SELECTOR_SET", payload: { key, level } });
  },
  addCut(key, member) {
    dispatch({ type: "MAP_CUT_ADD", payload: { key, member } });
  },
  removeCut(key, name) {
    dispatch({ type: "MAP_CUT_REMOVE", payload: { key, name } });
  }
});

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapSidebar)
);
