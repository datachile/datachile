import React from "react";
import { classnames } from "helpers/formatters.js";
import escapeRegExp from "lodash/escapeRegExp";

import { Icon } from "@blueprintjs/core";
import { Select, MultiSelect } from "@blueprintjs/labs";

import "@blueprintjs/labs/dist/blueprint-labs.css";
import "./CustomSelect.css";

CustomSelect.defaultProps = {
  defaultOption: { value: null, name: "Select...", disabled: true },
  itemListPredicate(query, items) {
    query = query.trim();
    let tester = RegExp(escapeRegExp(query) || ".", "i");
    return items.filter(item => tester.test(item.name));
  },
  itemRenderer({ handleClick, item, isActive }) {
    const className = classnames("select-option", {
      active: isActive,
      disabled: item.disabled
    });
    return (
      <span
        className={className}
        onClick={item.disabled ? null : handleClick}
        title={item.name}
      >
        {item.icon ? <img className="icon" src={item.icon} /> : null}
        <span className="select-option-label">{item.name}</span>
      </span>
    );
  },
  multiple: false,
  noResults: <span className="select-noresults">No results</span>,
  popoverProps: {
    popoverClassName: "custom-select pt-minimal"
  },
  resetOnSelect: true,
  tagRenderer: item => item.name,
  tagInputProps: {
    className: "input-area",
    inputProps: {
      className: "input-box"
    },
    rightElement: <Icon iconName="chevron-down" />
  }
};

function CustomSelect(props) {
  props = Object.assign({}, props, {
    className: classnames("custom-select", "pt-fill", props.className, {
      disabled: props.disabled,
      multi: props.multiple
    })
  });

  if (props.multiple) {
    props.selectedItems = [].concat(props.value || []);
    props.tagInputProps.onRemove = props.onItemRemove;
    props.tagInputProps.placeholder = props.placeholder;

    return React.createElement(MultiSelect, props, props.children);
  } else {
    if (!props.value || "object" != typeof props.value)
      props.value = props.defaultOption;
    else {
      const inOptions = props.items.some(item => item.name == props.value.name);
      if (!inOptions) props.value = props.defaultOption;
    }

    props.children = props.children || (
      <div className="select-option current" title={props.value.name}>
        {props.value.icon && <img className="icon" src={props.value.icon} />}
        <span className="value">{props.value.name}</span>
        <Icon iconName="chevron-down" />
      </div>
    );

    return React.createElement(Select, props, props.children);
  }
}

export default CustomSelect;
