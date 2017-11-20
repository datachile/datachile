import React, { Component } from "react";

export default class NoDataAvailable extends Component {
  render() {
    let { text } = this.props;
    if (text === null || text === "") text = "No Data Available";
    return (
      <div className="no-data-available" style={{ padding: "15px" }}>
        <img
          src={`https://via.placeholder.com/350x150?text=${text.replace(
            / /g,
            "+"
          )}`}
          style={{ width: "100%" }}
        />
      </div>
    );
  }
}
