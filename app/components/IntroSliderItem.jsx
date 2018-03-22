import React, { Component } from "react";
import { translate } from "react-i18next";

import "./IntroSlider.css";

class IntroSliderItem extends Component {
	render() {
		const {
			t,
			item,
			step,
			text,
			title,
			total,
			img,
			currentStep,
			onClick
		} = this.props;

		if (currentStep === step) {
			return (
				<div className="intro-slider">
					<img src={`/images/getting-started/${img}.gif`} alt="" />
					<div className="intro-slider-content">
						{title && <h2 className="intro-slider-title">{title}</h2>}
						<div className="intro-slider-button">
							<span onClick={evt => onClick("skip")} className="back">
								{t("Skip")}
							</span>
						</div>
						{text && <div>{text}</div>}
					</div>
					<div className="intro-slider-dots">
						{[...Array(total)].map((item, key) => {
							if (key + 1 === currentStep) {
								return (
									<img
										className="dot"
										src="/images/getting-started/nav-slide-azul.svg"
									/>
								);
							}
							return (
								<img
									className="dot"
									src="/images/getting-started/nav-slide-gris.svg"
								/>
							);
						})}
					</div>
					<div className="intro-slider-footer">
						<div className="intro-slider-button">
							{currentStep > 1 && (
								<span className="back" onClick={evt => onClick("prev")}>
									{t("Previous")}
								</span>
							)}
						</div>

						<div className="intro-slider-button">
							<span
								onClick={evt =>
									currentStep === total ? onClick("finish") : onClick("next")
								}
							>
								{currentStep === total ? t("Finish") : t("Next")}
							</span>
						</div>
					</div>
				</div>
			);
		} else {
			return <div />;
		}
	}
}

export default translate()(IntroSliderItem);
