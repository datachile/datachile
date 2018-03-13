import React, { Component } from "react";
import { translate } from "react-i18next";

import "./NoDataAvailable.css";

class NoDataAvailable extends Component {
	render() {
		const { t, message } = this.props;
		return (
			<div className="no-data-available" style={{ padding: "15px" }}>
				<img className="no-data-image" src={`/images/no-data/default.svg`} />
				<p className="no-data-title">Oops!</p>
				<p className="no-data-message">
					{message ? message : t("There are not data available for this chart")}
				</p>
			</div>
		);
	}
}

export default translate()(NoDataAvailable);
