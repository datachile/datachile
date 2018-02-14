import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import { Icon } from "@blueprintjs/core";

import CustomSelect from "components/CustomSelect";
import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";

import "./MapSidebar.css";

class MapSidebarRaw extends React.Component {
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

  render() {
    const { t } = this.props;

    const optionTopic = this.topics || this.getTopicOptions.call(this);

    const { valueTopic, setTopic } = this.props;
    const { valueIndicator, setIndicator } = this.props;
    const { valueCountry, addCountry, removeCountry } = this.props;
    const { valueCategory, setCategory } = this.props;

    return (
      <div className="map-sidebar">
        <h1>{t("Map")}</h1>
        <OptionGroup label={t("Topics")}>
          <CustomSelect
            items={optionTopic}
            value={valueTopic}
            onItemSelect={setTopic}
            filterable={false}
            defaultOption={{}}
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
            items={[]}
            value={valueIndicator}
            onItemSelect={setIndicator}
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
  valueTopic: state.map.topic.value,

  optionIndicator: state.map.a,
  valueIndicator: state.map.a,

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

const MapSidebar = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapSidebarRaw)
);

export default MapSidebar;
export { MapSidebar };
