import React from "react";
import { translate } from "react-i18next";
import { saveElement } from "d3plus-export";

import "./ExportLink.css";

class ExportLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.saveImage = this.saveImage.bind(this);
  }

  toggleMenu = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  };

  saveImage(e, className, title) {
    // TODO: find a better way
    // Very fragile, but right now there's no other way without reestructuring
    // Must be keep updated with the JSX in the Chart.jsx component
    //const { className } = this.props;
    e.preventDefault();
    const element = document.querySelector(`.${className} .viz > svg`);
    element &&
      saveElement(element, {
        filename: title || "image",
        type: "png"
      });
  }

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
    const { path, title, className } = this.props;

    if (!path) return null; //Prevent error when path is not loaded yet

    const { open } = this.state;

    const options = [
      { caption: "CSV", path: path.replace("jsonrecords", "csv"), data: true },
      { caption: "XLS", path: path.replace("jsonrecords", "xls"), data: true },
      {
        caption: "JSON",
        path: path.replace("jsonrecords", "json"),
        data: true
      },
      { caption: "PNG", path: path, data: false }
    ];

    return (
      <div
        className={open ? "export-link open" : "export-link"}
        ref={this.containerRef}
      >
        <a className="toggle" onClick={this.toggleMenu}>
          <img src={`/images/icons/icon-download.svg`} />
        </a>
        <ul>
          {options.map(o => (
            <li
              key={o.caption}
              className={o.caption === "PNG" && !className ? "disabled" : ""}
            >
              <a
                target="_blank"
                //download={""}
                href={o.data ? o.path : ""}
                onClick={
                  !o.data ? e => this.saveImage(e, className, title) : ""
                }
              >
                {o.caption}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default translate()(ExportLink);
