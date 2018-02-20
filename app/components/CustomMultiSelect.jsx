import React from "react";

import { MultiSelect } from "@blueprintjs/labs";
import { classnames } from "helpers/formatters.js";

import "./CustomMultiSelect.css";

CustomMultiSelect.defaultProps = {
  itemRenderer({ handleClick, item, isActive }) {
    return (
      <span
        className={classnames("target-option", { active: isActive })}
        onClick={handleClick}
      >
        {item.caption}
      </span>
    );
  },
  tagRenderer: item => item.caption,
  popoverProps: {
    popoverClassName: "select-members pt-minimal"
  },
  tagInputProps: {}
};

function CustomMultiSelect(props) {
  props = Object.assign({}, props, {
    className: classnames("custom-select multi", props.className)
  });
  props.tagInputProps.onRemove = props.onItemRemove;
  return React.createElement(MultiSelect, props, props.children);
}

export default CustomMultiSelect;
