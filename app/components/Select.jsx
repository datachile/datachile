import React, {Component} from "react";
import PropTypes from "prop-types";
import {translate} from "react-i18next";

import "./Select.css";

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.getSelectedFromProps(this.props)
    };
    this.handleChange = this.handleChange.bind(this);
  }

  propTypes = {
    id: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    value: PropTypes.string,
    valueField: PropTypes.string,
    labelField: PropTypes.string,
    onChange: PropTypes.func
  };

  static get defaultProps() {
    return {
      value: null,
      valueField: "value",
      labelField: "label",
      onChange: null
    };
  }

  componentWillReceiveProps(nextProps) {
    var selected = this.getSelectedFromProps(nextProps);
    this.setState({
      selected: selected
    });
  }

  getSelectedFromProps(props) {
    var selected;
    if (props.value === null && props.options.length !== 0) {
      selected = props.options[0][props.valueField];
    }
    else {
      selected = props.value;
    }
    return selected;
  }

  render() {
    if (!this.state) {
      return null;
    }

    const {id, options, valueField, labelField} = this.props;
    const {selected} = this.state;

    return (
      <select className="select" id={id} value={selected} onChange={this.handleChange}>
        {options &&
          options.map(option => (
            <option key={option[valueField]} value={option[valueField]}>
              {option[labelField]}
            </option>
          ))}
        )}
      </select>
    );
  }

  handleChange(e) {
    const {onChange} = this.props;
    const {selected} = this.state;

    if (onChange) {
      var change = {
        oldValue: selected,
        newValue: e.target.value
      };
      onChange(change);
    }
    this.setState({selected: e.target.value});
  }
}

export default translate()(Select);
