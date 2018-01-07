import React from "react";

import ResultItem from "components/ResultItem";
import { slugifyItem } from "helpers/formatters";

class TemplateResults extends React.PureComponent {
  render() {
    return (
      <div id="results" className="results-block">
        {this.renderTitle.call(this)}
        {this.renderElementPrepended.call(this)}
        {this.renderProfile.call(this)}
        {this.renderChildren.call(this)}
        {this.renderElementAppended.call(this)}
      </div>
    );
  }

  renderTitle() {
    const { t, profile, entity } = this.props;

    return (
      <h3>
        {t("Results for")}
        {`: "${profile.caption}"`}
      </h3>
    );
  }

  renderElementPrepended() {
    return null;
  }

  renderProfileTitle() {
    return null;
  }

  renderProfile() {
    const { t, profile, entity } = this.props;

    return (
      <div className="list-title">
        {this.renderProfileTitle.call(this)}
        <ResultItem
          item={{
            key: profile.key,
            name: profile.caption,
            type: entity,
            url: slugifyItem(entity, profile.key, profile.caption)
          }}
        />
      </div>
    );
  }

  renderChildrenTitle() {
    return null;
  }

  renderChildren() {
    const { t, profile, entity } = this.props;

    return (
      <div className="list-title">
        {this.renderChildrenTitle.call(this)}
        <ul className="explore-list">
          {profile.children.map(c => (
            <li key={c.key}>
              <ResultItem
                item={{
                  key: c.key,
                  name: c.caption,
                  type: entity,
                  url: slugifyItem(
                    entity,
                    profile.key,
                    profile.caption,
                    c.key,
                    c.caption
                  )
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  renderElementAppended() {
    return null;
  }
}

export default TemplateResults;
