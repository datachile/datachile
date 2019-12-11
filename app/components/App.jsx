import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import Helmet from "react-helmet";

import Footer from "components/Footer";
import mondrianClient from "helpers/MondrianClient";
import StagingIndicator from "components/StagingIndicator";

import "./App.css";

class App extends Component {
	render() {
		const { children, t, location } = this.props;
		const espanol = this.props.i18n.language == "es";

		return (
			<div className="main-container">
				<Helmet titleTemplate="%s — DataChile" defaultTitle="DataChile">
					<meta name="description" content={t("home.subtitle")} />
					<meta
						property="og:locale"
						content={espanol ? "es_CL" : "en_US"}
					/>
					<meta
						property="og:locale:alternate"
						content={espanol ? "en_US" : "es_CL"}
					/>
				</Helmet>
				<div>{children}</div>
				{location.pathname === "explore/map" && <Footer location={location} />}
			</div>
		);
	}
}

export default withNamespaces()(App);
