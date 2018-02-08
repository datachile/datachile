import React from "react";
import escapeRegExp from "lodash/escapeRegExp";

import { Icon } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import "./CustomSelect.css";

CustomSelect.defaultProps = {
  itemListPredicate(query, items) {
    query = query.trim();
    let tester = RegExp(escapeRegExp(query) || ".", "i");
    return items.filter(item => tester.test(item.name));
  },
  itemRenderer({ handleClick, item, isActive }) {
    const className = ["select-option"];
    isActive && className.push("active");
    item.disabled && className.push("disabled");
    return (
      <span className={className.join(" ")} onClick={handleClick}>
        {item.icon ? <Icon iconName={item.icon} /> : null}
        <span className="select-option-label">{item.name}</span>
      </span>
    );
  },
  popoverProps: {
    popoverClassName: "custom-select pt-minimal"
  }
};

/**
 * @class CustomSelect
 * @augments {React.Component<CustomSelectProps>}
 * @static {object} defaultProps
 * @param {object} props
 * @param {string|Array<any>} [props.className]
 * @param {JSX.Element|Array<JSX.Element>} [props.children]
 * @param {Array<Selectable>} props.items
 * @param {(item: Selectable, event?: Event) => void} props.onItemSelect
 * @param {Selectable} props.value
 */
function CustomSelect(props) {
  props = Object.assign({}, props, {
    className: "custom-select " + (props.className || "")
  });

  if (!props.value || !props.value.name)
    props.value = { value: null, name: "Select...", disabled: true };

  if (!props.children)
    props.children = (
      <div className="select-option current" title={props.value.name}>
        <span className="value">{props.value.name}</span>
        <Icon iconName="double-caret-vertical" />
      </div>
    );

  return (
    <div className="custom-select">
      {React.createElement(Select, props, props.children)}
    </div>
  );
}

export default CustomSelect;
