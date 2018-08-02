import React from "react";

import Loading from "components/Loading";

class ChartImporter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Component: null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.Component !== nextState.Component;
  }

  componentDidMount() {
    const type = this.props.type;
    import("d3plus-react").then(module => {
      console.log(module);
      this.setState({ Component: module[type] || module.default });
    });
  }

  render() {
    const { Component } = this.state;
    const props = this.props;

    console.log(Component);

    if (!Component)
      return React.createElement(props.loadingComponent, props, props.children);

    return React.createElement(Component, props);
  }
}

ChartImporter.defaultProps = {
  loadingComponent: Loading
};

export default ChartImporter;
