import React from "react";
import { connect } from "react-redux";
import { withNamespaces } from "react-i18next";

import "./ShareData.css";

class ShareData extends React.Component {
  state = {
    open: false
  };

  toggleMenu = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  };

  containerRef = node => {
    if (node) this._container = node;
  };

  manageOutsideClick = evt => {
    const node = this._container;
    if (!node || (!node.isSameNode(evt.target) && !node.contains(evt.target)))
      this.setState({ open: false });
  };

  componentDidMount() {
    document.addEventListener("click", this.manageOutsideClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.manageOutsideClick, true);
  }

  render() {
    const { path } = this.props;

    if (!path) return null; //Prevent error when path is not loaded yet

    const { open } = this.state;

    const options = [
      { caption: "CSV", path: path.replace("jsonrecords", "csv") },
      { caption: "XLS", path: path.replace("jsonrecords", "xls") },
      { caption: "JSON", path: path }
    ];

    return (
      <div
        className={open ? "export-link open" : "export-link"}
        ref={this.containerRef}
      >
        <div className="content">This works with any content</div>
        <a className="toggle" onClick={this.toggleMenu}>
          <img src={`/images/icons/icon-download.svg`} />
        </a>

        {/*<ul>
        {options.map(o => (
          <li key={o.caption}>
            <a target="_blank" download={""} href={o.path}>
              {o.caption}
            </a>
          </li>
        ))}
      </ul>*/}
      </div>
    );
  }
}

export default withNamespaces()(
  connect(
    state => ({
      sources: state.sources
    }),
    {}
  )(ShareData)
);
