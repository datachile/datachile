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

  saveImage(e, className, title, format) {
    // TODO: find a better way
    // Very fragile, but right now there's no other way without reestructuring
    // Must be keep updated with the JSX in the Chart.jsx component
    // const { className } = this.props;
    e.preventDefault();
    const element = document.querySelector(`.${className} svg`).cloneNode(1);

    // Title Color
    element.querySelector(".d3plus-viz-total text")
      ? (element.querySelector(".d3plus-viz-total text").style.fill = "#000000")
      : "";

    // Avoid change color in Treemap Labels
    element
      .querySelectorAll(
        "g:not(.d3plus-Treemap) g:not(.d3plus-Area) :not(.d3plus-Area-text) :not(.d3plus-Rect-text) .d3plus-textBox text"
      )
      .forEach(e => {
        e.style.fill = "#000000";
      });

    // Legend Color
    element.querySelector(".d3plus-Legend text")
      ? element
          .querySelectorAll(".d3plus-Legend text")
          .forEach(item => (item.style.fill = "#000000"))
      : "";

    // Lines
    element.querySelector("line")
      ? element
          .querySelectorAll("line")
          .forEach(item => (item.style.stroke = "#000000"))
      : "";

    // Axis titles
    element.querySelector(".d3plus-Axis-title")
      ? element
          .querySelectorAll(".d3plus-Axis-title .d3plus-textBox text")
          .forEach(item => (item.style.fill = "#000000"))
      : "";

    element &&
      saveElement(
        element,
        {
          filename: title || "image",
          type: format
        },
        {
          background: "transparent",
          padding: 5,
          height: 400
        }
      );
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
    const { className, path, t, title } = this.props;

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
      //{ caption: "SVG", path: path, data: false }
    ];

    return (
      <div
        className={open ? "export-link is-open" : "export-link"}
        ref={this.containerRef}
      >
        <button className="btn font-xxs" onClick={this.toggleMenu}>
					{t("exportar")}
          <img className="btn-icon" src={`/images/icons/icon-download.svg`} />
        </button>
        <ul className="export-list u-list-reset font-xs">
          {options.map(o => (
            <li
              key={o.caption}
              className={
                (o.caption === "PNG" || o.caption === "SVG") && !className
                  ? "export-item disabled"
                  : "export-item "
              }
            >
              <a
                className="export-link"
                target="_blank"
                href={o.data ? o.path : ""}
                onClick={
                  !o.data
                    ? e =>
                        this.saveImage(
                          e,
                          className,
                          title ? title : className,
                          o.caption.toLowerCase()
                        )
                    : ""
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
