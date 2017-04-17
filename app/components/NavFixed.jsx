import React, {Component} from "react";
import {Link} from "react-router";
import {translate} from "react-i18next";
import "./NavFixed.css";

class NavFixed extends Component {

  render() {
    const {t,topics,visible,activeSub,geo,type} = this.props;

    return (
      <nav className={ `nav-fixed${ visible ? "" : " hidden" }` }>
        
        <div className="nav-geo">
          <div className="dc-container">
            <div className="nav-side-menu-link">
              <img src="/images/icons/icon-menu.svg" />
            </div>
            <div className="nav-titles">
              <span className="datachile">DataChile:</span> <span className="geo-title">{ geo.caption } { type }</span>
            </div>
            <div className="nav-search">
              <img src="/images/icons/icon-lupa-header.svg" />
            </div>
          </div>
        </div>

        <div className="nav-topic">
          <div className="dc-container">
            <div className="subtopic-selector">
              <span className="label">{ t("Estás viendo") }:</span>
              <span className="value">{ activeSub } </span>
            </div>
            <div className="topics">
              {
                topics.map(topic =>
                  <a key={ topic.slug } className={`topic-link${ topic.slug==activeSub ? " active" : "" }`} href={ `#${topic.slug}` }>
                      <img className="icon" src={ `/images/profile-icon/icon-${topic.slug}.svg`} />
                      { topic.title }
                  </a>
                )
              }
            </div>
          </div>
        </div>

      </nav>
    );
  }
}

NavFixed.defaultProps = {
  visible: false,
  activeSub: false
};

export default translate()(NavFixed);
