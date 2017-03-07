import React, { Children } from "react";

export default class MondrianClientProvider extends React.Component {

  static childContextTypes = {
    apiClient: React.PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      apiClient: this.client
    };
  }

  constructor(props, context) {
    super(props, context);
    this.client = props.client;
  }

  render() {
    return Children.only(this.props.children);
  }
}
