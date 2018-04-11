import React, { Component } from "react";
import { translate } from "react-i18next";

import "./IntroSlider.css";

class IntroSliderItem extends Component {
  handleButtonNext = () => {
    console.log(this.props.step);
    if (this.props.step + 1 == this.props.total) this.props.onSkip();
    else this.props.onNext();
  };

  render() {
    const { t, step, total } = this.props;
    const { img, title, text } = this.props;

    return (
      <div className="intro-slider">
        <img src={`/images/getting-started/${img}.gif`} alt="" />
        <div className="intro-slider-content">
          {title && <h2 className="intro-slider-title">{title}</h2>}
          <div className="intro-slider-button">
            <span onClick={this.props.onSkip} className="back">
              {t("button.skip")}
            </span>
          </div>
          {text && <p>{text}</p>}
        </div>
        <div className="intro-slider-dots">
          {[...Array(total)].map((item, key) => (
            <img
              className="dot"
              src={`/images/getting-started/nav-slide-${
                key === step ? "azul" : "gris"
              }.svg`}
            />
          ))}
        </div>
        <div className="intro-slider-footer">
          <div className="intro-slider-button">
            {step > 0 && (
              <span className="back" onClick={this.props.onPrev}>
                {t("button.prev")}
              </span>
            )}
          </div>

          <div className="intro-slider-button">
            <span onClick={this.handleButtonNext}>
              {total - step == 1 ? t("button.finish") : t("button.next")}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default translate()(IntroSliderItem);
