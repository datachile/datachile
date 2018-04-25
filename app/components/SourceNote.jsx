import React from "react";
import { translate } from "react-i18next";

import { sources, getI18nSourceObject } from "helpers/consts";

import "./SourceNote.css";

/**
 * @param {object} props
 * @param {string} props.cube
 * @param {string|number} props.year
 */
function SourceNote(props) {
  const { t, cube } = props;

  const src = t("about.data", { returnObjects: true });
  const source = getI18nSourceObject(src, cube);

  if (!source) {
    console.warn("Missing source key:" + cube);
    return null;
  }

  return (
    <div className="source-note">
      <span className="source-note-txt">{t("Source")}:</span>
      <a target="_blank" className="source-note-link" href={source.url}>
        {`${source.title} - ${source.source} - ${source.year}`}
      </a>
    </div>
  );
}

export default translate()(SourceNote);
