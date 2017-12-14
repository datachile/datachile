import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import { sources } from "helpers/consts";

import "./SourceNote.css";

class SourceNote extends Component {
  render() {
    const { t, cube } = this.props;

    const source = sources[cube];

    if (!source) {
      console.warn("Missing source key:" + cube);
      return null;
    }

    return (
      <div className="source-note">
        <span className="source-note-txt">{t("Source")}:</span>
        <a target="_blank" className="source-note-link" href={source.url}>
          {source.title} - {source.year}
        </a>
      </div>
    );
  }
}

export default translate()(SourceNote);
