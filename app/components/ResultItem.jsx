import React, { Component } from "react";
import { Link } from "react-router";
import { translate } from "react-i18next";

import ProfileTile from "components/ProfileTile";

import "./ResultItem.css";

class ResultItem extends Component {
	render() {
		const { t, item } = this.props;

		const icon =
			["country", "region", "comuna"].indexOf(item.type) > -1
				? "geo"
				: item.type;

		return <ProfileTile key={item.name} item={item} />;
	}
}

export default translate()(ResultItem);
