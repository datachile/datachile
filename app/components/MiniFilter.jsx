import React from "react";

import "./MiniFilter.css";

class MiniFilter extends React.Component {
  _toggles = {};

  static defaultProps = { filters: [], onClick() {} };

  componentWillMount() {
    this._toggles = this.updateToggleFunctions(this.props);
    for (let key in this._toggles) this.props.onClick(key, 2147483647);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.onClick != this.props.onClick) {
      this._toggles = this.updateToggleFunctions(nextProps);
      return true;
    }

    return this.props.filters.reduce(function(status, oldFilter, i) {
      return status || nextProps.filters[i].value != oldFilter.value;
    }, false);
  }

  updateToggleFunctions({ filters, onClick }) {
    return filters.reduce((toggles, filter) => {
      filter.items.forEach(item => {
        const key = `${filter.name}-${item.label}`;
        toggles[key] = () => onClick(filter.key, item.flag);
      });
      return toggles;
    }, {});
  }

  render() {
    const toggles = this._toggles;

    const filters = this.props.filters.map(filter => {
      const items = filter.items.map(item => {
        const key = `${filter.name}-${item.label}`;
        const className = [
          "filter-item",
          item.className,
          filter.value & item.flag && "active"
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <span
            key={key}
            onClick={toggles[key]}
            data-value={item.flag.toString(2)}
            className={className}
          >
            {item.label}
          </span>
        );
      });

      return (
        <span
          key={filter.name}
          data-value={filter.value.toString(2)}
          className={`filter ${filter.className || ""}`}
        >
          <span className="filter-name">{filter.name}</span>
          {items}
        </span>
      );
    });

    return <div className="mini-filter">{filters}</div>;
  }
}

export default MiniFilter;
