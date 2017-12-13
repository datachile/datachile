import React from "react";

import "./MiniFilter.css";

class MiniFilter extends React.Component {
  _toggles = {};

  componentWillMount() {
    this.testComponentUpdate(this.props);
  }

  shouldComponentUpdate(nextProps) {
    return this.testComponentUpdate(nextProps);
  }

  testComponentUpdate = nextProps => {
    const toggles = this._toggles;
    const fnChanged = nextProps.onClick != this.props.onClick;
    let itemsChanged = false;

    nextProps.filters.forEach(filter => {
      filter.items.forEach(item => {
        let key = `${filter.name}-${item.label}`;
        itemsChanged = (filter.value & item.flag) === item.flag;
        if (fnChanged || !toggles.hasOwnProperty(key)) {
          toggles[key] = () => nextProps.onClick(filter.key, item.flag);
          itemsChanged = true;
        }
      });
    });

    return fnChanged || itemsChanged;
  };

  render() {
    const toggles = this._toggles;

    const filters = this.props.filters.map(filter => {
      const items = filter.items.map(item => {
        const key = `${filter.name}-${item.label}`;
        const active = filter.value & item.flag && "active";
        return (
          <span
            key={key}
            className={`filter-item ${item.className} ${active}`}
            onClick={toggles[key]}
          >
            {item.label}
          </span>
        );
      });

      return (
        <span key={filter.name} className={`filter ${filter.className || ""}`}>
          <span className="filter-name">{filter.name}</span>
          {items}
        </span>
      );
    });

    return <div className="mini-filter">{filters}</div>;
  }
}

export default MiniFilter;
