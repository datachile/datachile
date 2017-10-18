import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";

class CustomPrevArrow extends Component {
	render() {
		return (
			<a
				style={this.props.style}
				className={this.props.className}
				onClick={this.props.onClick}
			>
				<span className="pt-icon-standard pt-icon-chevron-left" />
			</a>
		);
	}
}

export default translate()(CustomPrevArrow);
