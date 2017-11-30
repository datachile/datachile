import React, { Component } from "react";

export default class Placeholder extends Component {
  render() {
    let { text } = this.props;
    if (text === null) text = "Placeholder";
    return (
      <div className={this.props.className}>
        <div className="viz">
          <img
            src={`https://via.placeholder.com/350x150?text=${text.replace(
              / /g,
              "+"
            )}`}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    );
  }
}
