import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Icon } from "@blueprintjs/core";
import union from "lodash/union";

import CustomSelect from "components/CustomSelect";

import { classnames } from "helpers/formatters";

import "./MapSidebar.css";

class MapSidebar extends React.Component {
  state = {
    expanded: false
  };

  expandSelectors = () => {
    this.setState({ expanded: true });
  };

  filterUnusedSelectors(selector) {
    const values = this.props.memberValues[selector.value];
    return values && values.length > 0;
  }

  componentWillReceiveProps(nextProps) {
    const oldTopic = this.props.topicKey;
    const newTopic = nextProps.topicKey;

    if (oldTopic && newTopic && oldTopic != newTopic)
      nextProps.setMeasure(nextProps.measureOptions[0]);
  }

  renderSelectorGroup(selector) {
    // selector.value = `[${dim.name}].[${hier.name}]`
    const { t, addCut, removeCut, setSelectorLevel } = this.props;

    const value = selector.value;
    const currentLevel = this.props.selectorHier[value] || selector.levels[0];

    const levelKey = `[${selector.cube}].${currentLevel.value}`;
    const optionMembers = this.props.memberOptions[levelKey] || [];
    const valueMembers = this.props.memberValues[value];

    const optionLevel =
      selector.levels.length > 1 ? (
        <div className="option-hierarchy">
          {selector.levels.map(lvl => (
            <button
              className={classnames({ active: lvl.hash == currentLevel.hash })}
              onClick={setSelectorLevel.bind(null, value, lvl)}
            >
              {lvl.name}
            </button>
          ))}
        </div>
      ) : null;

    return (
      <OptionGroup
        label={selector.name}
        icon={selector.isGeo ? "geo" : "indicator"}
      >
        {optionLevel}
        <CustomSelect
          disabled={this.props.disabled}
          multiple={true}
          items={optionMembers}
          value={valueMembers}
          onItemSelect={addCut.bind(null, value)}
          onItemRemove={removeCut.bind(null, value)}
          placeholder={t("map.sidebar_addfilter")}
        />
      </OptionGroup>
    );
  }

  render() {
    const { t, setTopic, setMeasure, setIsolate } = this.props;
    const expanded = this.state.expanded;

    let selectors = this.props.selectors;
    if (!expanded) {
      const selWithValue = selectors.filter(this.filterUnusedSelectors, this);
      const selFirstSix = selectors.slice(0, 6);
      selectors = union(selWithValue, selFirstSix).slice(0, 6);
    }

    return (
      <div className="map-sidebar">
        <h1>{t("Map")}</h1>
        <OptionGroup label={t("Topics")} icon="topic">
          <CustomSelect
            disabled={this.props.disabled}
            items={this.props.topicOptions}
            value={this.props.topicValue}
            onItemSelect={setTopic}
            filterable={false}
          />
        </OptionGroup>

        <OptionGroup label={t("Measure")} icon="measure">
          <CustomSelect
            disabled={this.props.disabled}
            items={this.props.measureOptions}
            value={this.props.measureValue}
            onItemSelect={setMeasure}
            filterable={false}
          />
        </OptionGroup>

        {this.props.levelValue === "comuna" && (
          <OptionGroup label={t("Isolate Region")} icon="geo">
            <CustomSelect
              disabled={this.props.disabled}
              items={[{ value: 0, name: t("All Regions") }].concat(
                this.props.isoregionOptions
              )}
              value={this.props.isoregionValue}
              onItemSelect={setIsolate}
              filterable={false}
              placeholder={t("map.sidebar_isolateregion")}
            />
          </OptionGroup>
        )}

        {selectors.map(this.renderSelectorGroup, this)}

        {!expanded && (
          <button
            className="show-more-selectors"
            onClick={this.expandSelectors}
          >
            {t("map.sidebar_moreselectors")}
          </button>
        )}
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

const mapStateToProps = (state, ownProps) => {
  const preload = ownProps.data.map_params;
  const params = state.map.params;

  const topicKey = params.topic && params.topic.value;
  const cube = params.measure && params.measure.cube;

  return {
    cube: cube,
    topicOptions: state.map.options.topic,
    topicValue: params.topic,
    levelValue: params.level,
    topicKey: topicKey,
    measureOptions: preload.measures[topicKey] || [],
    measureValue: params.measure,
    memberOptions: state.map.options.members,
    memberValues: state.map.params.cuts,
    selectors: preload.selectors[cube] || [],
    selectorHier: params.selector,
    isoregionOptions: state.map.options.regions,
    isoregionValue: params.isolate,
    disabled:
      state.map.results.status == "LOADING" ||
      state.map.options.countLoading > 0
  };
};

const mapDispatchToProps = dispatch => ({
  setTopic(payload) {
    dispatch({ type: "MAP_TOPIC_SET", payload });
  },
  setIsolate(payload) {
    dispatch({ type: "MAP_ISOLATE_SET", payload });
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
