import React from "react";
import { withNamespaces } from "react-i18next";

import IntroSliderItem from "components/IntroSliderItem";

import "./IntroSlider.css";

class IntroSlider extends React.Component {
  state = {
    step: 0,
    hide: true
  };

  constructor(props) {
    super(props);

    if (typeof localStorage != "undefined")
      this.state.hide = "gettingStarted" in localStorage;
  }

  handlePrev = () => {
    this.setState(state => ({ step: Math.max(0, state.step - 1) }));
  };

  handleNext = () => {
    this.setState(state => ({ step: state.step + 1 }));
  };

  handleFinish = () => {
    localStorage.setItem("gettingStarted", false);
    this.setState({ hide: true });
  };

  render() {
    const steps = this.props.t("map.slides", { returnObjects: true });
    const current = steps[this.state.step];

    if (this.state.hide || !current) return null;

    return (
      <div>
        <div className="overlay" />
        <IntroSliderItem
          step={this.state.step}
          total={steps.length}
          img={current.img}
          title={current.title || ""}
          text={current.text || ""}
          onSkip={this.handleFinish}
          onPrev={this.handlePrev}
          onNext={this.handleNext}
        />
      </div>
    );
  }
}

export default withNamespaces()(IntroSlider);
