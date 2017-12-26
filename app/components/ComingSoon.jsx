import React from "react";
import { translate } from "react-i18next";

import "./ComingSoon.css";

function ComingSoon(props) {
  const { t } = props;

  return <small className="coming-soon">{t("Soon")}</small>;
}

export default translate()(ComingSoon);
