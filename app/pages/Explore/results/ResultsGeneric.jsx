import React from "react";

import ResultItem from "components/ResultItem";
import { slugifyItem } from "helpers/formatters";
import { getImageFromMember } from "helpers/formatters";

class TemplateResults extends React.PureComponent {
  render() {
    // console.log(this.props.profile);
    return this.renderChildren.call(this);
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
      <div className="tile-list">
        {/*{this.renderProfileTitle.call(this)}*/}
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
      <div className="tile-list">
        {/* filtered parent */}
        <ResultItem
          item={{
            img: getImageFromMember(entity, profile.key),
            key: profile.key,
            name: profile.caption,
            type: entity === "geo" ? "region" : entity,
            url: slugifyItem(entity, profile.key, profile.caption)
          }}
        />

        {/* children */}
        {profile.children.map(c => (
          <ResultItem
            key={c.key}
            item={{
              img: getImageFromMember(entity, profile.key, c.key),
              parentImg: getImageFromMember(entity, profile.key),
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
        ))}
      </div>
    );
  }

  renderElementAppended() {
    return null;
  }
}

export default TemplateResults;
