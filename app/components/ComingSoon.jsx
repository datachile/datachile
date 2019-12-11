import React from "react";
import { withNamespaces } from "react-i18next";

import "./ComingSoon.css";

function ComingSoon(props) {
  const { t } = props;

  return <small className="coming-soon">{t("Soon")}</small>;
}

export default withNamespaces()(ComingSoon);
