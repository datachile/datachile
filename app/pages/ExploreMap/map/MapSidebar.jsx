import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Icon } from "@blueprintjs/core";

import CustomSelect from "components/CustomSelect";
import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import "./MapSidebar.css";

class MapSidebar extends React.Component {
  static need = [
    (params, store) => {
      // mondrian-rest-client doesn't use the annotations from the json
      const promise = fetch(__API__ + "cubes")
        .then(response => response.json())
        .then(data => ({
          key: "data_map_indicators",
          data: data.cubes.reduce(function(groups, cube) {
            const topic = cube.annotations.topic;
            topic in groups || (groups[topic] = []);
            groups[topic].push(cube.name);
            return groups;
          }, {})
        }));

      return { type: "GET_DATA", promise };
    }
  ];

  getTopicOptions() {
    const { t, setTopic } = this.props;

    const options = [
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

    setTopic(options[0]);

    this.topics = options;
    return options;
  }

  getIndicatorOptions() {
    const { data, t, valueTopic } = this.props;
    const cubes = data.data_map_indicators[valueTopic.value] || [];
    return cubes.map(name => ({ value: name, name }));
  }

  render() {
    const { data, t } = this.props;

    const { valueTopic, setTopic } = this.props;
    const { valueIndicator, setIndicator } = this.props;
    const { valueCountry, addCountry, removeCountry } = this.props;
    const { valueCategory, setCategory } = this.props;

    const optionTopic = this.topics || this.getTopicOptions.call(this);
    const optionIndicator = this.getIndicatorOptions.call(this);

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

        <OptionGroup label={t("Country")}>
          <CustomSelect
            items={[]}
            value={valueCountry}
            onItemSelect={addCountry}
          />
        </OptionGroup>

        <OptionGroup label={t("Category")}>
          <CustomSelect
            items={[]}
            value={valueCategory}
            onItemSelect={setCategory}
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

  optionCountry: state.map.a,
  valueCountry: state.map.a,

  optionCategory: state.map.a,
  valueCategory: state.map.a
});

const mapDispatchToProps = dispatch => ({
  setTopic(payload) {
    dispatch({ type: "MAP_TOPIC_SET", payload });
  },
  setIndicator(payload) {
    dispatch({ type: "MAP_INDICATOR_SET", payload });
  },
  addCountry(payload) {
    dispatch({ type: "MAP_COUNTRY_ADD", payload });
  },
  removeCountry(payload) {
    dispatch({ type: "MAP_COUNTRY_REMOVE", payload });
  },
  setCategory(payload) {
    dispatch({ type: "MAP_CATEGORY_SET", payload });
  }
});

MapSidebar = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapSidebar)
);

export default MapSidebar;
export { MapSidebar };
