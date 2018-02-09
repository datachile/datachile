import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { Link } from "react-router";
import CustomSelect from "components/CustomSelect";
import "./MapSidebar.css";

class MapSidebarRaw extends React.Component {
  render() {
    const { t } = this.props;

    const { setTopics, valueTopics } = this.props;
    const { setIndicator, valueIndicator } = this.props;
    const { setCountry, valueCountry } = this.props;
    const { setCategory, valueCategory } = this.props;

    const OPTIONS_TOPICOS = [
      { key: "economy", label: t("Economy"), icon: "portfolio" },
      { key: "education", label: t("Education"), icon: "graduation" },
      { key: "housing", label: t("Housing and Environment"), icon: "house" },
      { key: "demography", label: t("Demography"), icon: "family" },
      { key: "health", label: t("Health"), icon: "health" }
    ];

    return (
      <div className="map-sidebar">
        <h1>{t("Map")}</h1>
        <OptionGroup
          label={t("Topics")}
          items={OPTIONS_TOPICOS}
          value={valueTopics}
          onItemSelect={setTopics}
        />
        <OptionGroup
          label={t("Indicator")}
          items={[]}
          value={valueIndicator}
          onItemSelect={setIndicator}
        />
        <OptionGroup
          label={t("Country")}
          items={[]}
          value={valueCountry}
          onItemSelect={setCountry}
        />
        <OptionGroup
          label={t("Category")}
          items={[]}
          value={valueCategory}
          onItemSelect={setCategory}
        />
        <Link to="/explore/map/data">Go to data</Link>
      </div>
    );
  }
}

function OptionGroup(props) {
  return (
    <div className="option-group">
      <label className="option-label">{props.label}</label>
      <CustomSelect
        value={props.value}
        items={props.items}
        onItemSelect={props.onItemSelect}
      />
    </div>
  );
}
const mapStateToProps = state => ({
  valueTopics: state.a,
  valueIndicator: state.a,
  valueCountry: state.a,
  valueCategory: state.a
});
const mapDispatchToProps = dispatch => ({
  setTopics(value) {
    dispatch({ type: "SETPARAM_TOPICS", payload: value });
  },
  setIndicator(value) {
    dispatch({ type: "SETPARAM_TOPICS", payload: value });
  },
  setCountry(value) {
    dispatch({ type: "SETPARAM_TOPICS", payload: value });
  },
  setCategory(value) {
    dispatch({ type: "SETPARAM_TOPICS", payload: value });
  }
});

const MapSidebar = translate()(
  connect(mapStateToProps, mapDispatchToProps)(MapSidebarRaw)
);

export default MapSidebar;
export { MapSidebar };
