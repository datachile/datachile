import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleSearch } from "actions/index";
import { translate } from "react-i18next";
import { Link, browserHistory } from "react-router";
import { debounce } from "lodash";

import { request } from "d3-request";

import "./Search.css";

import { slugifyItem } from "helpers/formatters";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      loading: false,
      results: []
    };
  }

  handleChange(userQuery) {
    if (userQuery.length <= 3) {
      // bail out early on empty query
      this.setState({ active: true, results: [] });
      return;
    }

    this.setState({ loading: true });

    // XXX TODO don't hardcode this once we're finally able to configure canon
    // via env vars
    request(
      `https://chilecube.datawheel.us/search?q=${encodeURIComponent(
        userQuery
      )}&limit=10&lang=${encodeURIComponent(this.props.i18n.language)}`,
      (error, data) =>
        this.setState({
          active: true,
          results: JSON.parse(data.responseText),
          loading: false
        })
    );
  }

  onChange(e) {
    e.persist();
    this.handleChange(e.target.value);
  }

  componentDidMount() {
    this.handleChange = debounce(this.handleChange, 300).bind(this);

    document.addEventListener(
      "keydown",
      () => {
        const { local, searchActive, toggleSearch } = this.props;
        const { active } = this.state;
        const key = event.keyCode;
        const DOWN = 40,
          ENTER = 13,
          ESC = 27,
          S = 83,
          UP = 38;

        const enabled = local ? active : searchActive;
        const toggle = local
          ? () => this.setState({ active: !active })
          : toggleSearch;

        if (
          !local &&
          !enabled &&
          key === S &&
          event.target.tagName.toLowerCase() !== "input"
        ) {
          event.preventDefault();
          toggle();
        } else if (enabled && key === ESC && event.target === this.ref_input) {
          event.preventDefault();
          toggle();
        } else if (enabled && event.target === this.ref_input) {
          const highlighted = document.querySelector(".highlighted");

          if (key === ENTER && highlighted) {
            //this.ref_input.value = highlighted.querySelector("a").innerHTML;
            toggle();
            setTimeout(() => {
              browserHistory.push(highlighted.querySelector("a").href);
              //window.location = highlighted.querySelector("a").href;
            }, 500);
          } else if (key === DOWN || key === UP) {
            if (!highlighted) {
              if (key === DOWN)
                document
                  .querySelector(".results > li:first-child")
                  .classList.add("highlighted");
            } else {
              const results = document.querySelectorAll(".results > li");

              const currentIndex = [].indexOf.call(results, highlighted);

              if (key === DOWN && currentIndex < results.length - 1) {
                results[currentIndex + 1].classList.add("highlighted");
                highlighted.classList.remove("highlighted");
              } else if (key === UP) {
                if (currentIndex > 0)
                  results[currentIndex - 1].classList.add("highlighted");
                highlighted.classList.remove("highlighted");
              }
            }
          }
        }
      },
      false
    );
  }

  getProfileType(result) {
    const { t } = this.props;
    var profileType = "";
    switch (result.index_as) {
      case undefined: {
        profileType = "";
        break;
      }
      case "countries": {
        profileType = result.ancestor_key ? t("Country") : t("Area");
        break;
      }
      case "institutions": {
        profileType = result.ancestor_key
          ? t("Institution")
          : t("Institution Type");
        break;
      }
      case "careers": {
        profileType = result.ancestor_key ? t("Career") : t("Field of Science");
        break;
      }
      case "products": {
        profileType = result.ancestor_key ? t("Product") : t("Product Type");
        break;
      }
      case "industries": {
        profileType = result.ancestor_key ? t("Sector") : t("Sector Type");
        break;
      }
      case "geo": {
        profileType = result.ancestor_key ? t("Comuna") : t("Region");
        break;
      }
    }
    return profileType;
  }

  render() {
    const { className, searchActive, local, t } = this.props;
    const { active, results, loading } = this.state;
    const enabled = local ? active : searchActive;

    const availableClass =
      results && results.length > 0 ? "available" : "not-available";

    if (this.ref_input) {
      if (enabled) this.ref_input.focus();
      else this.ref_input.blur();
    }

    return (
      <div
        className={`${className} ${enabled ? "active" : ""} search-component`}
      >
        <div className="input">
          <input
            className={loading ? "loading" : ""}
            type="text"
            ref={input => (this.ref_input = input)}
            onChange={this.onChange.bind(this)}
            placeholder={t("Search a location, industry, product, career, etc")}
          />
        </div>
        <ul className={`results ${availableClass}`}>
          {results.map((result, i) => {
            var url;
            if (result.ancestor_key === 0) {
              url = slugifyItem(result.index_as, result.key, result.content);
            } else {
              url = slugifyItem(
                result.index_as,
                result.ancestor_key,
                result.ancestor_name,
                result.key,
                result.content
              );
            }
            return (
              <li
                key={`${result.index_as}-${result.key}-${i}`}
                className="result"
              >
                <Link to={url}>
                  <span className="icon-container">
                    <img
                      className="icon"
                      src={`/images/icons/icon-${result.index_as}.svg`}
                    />
                  </span>
                  <span className="content">{result.content}</span>
                  <span className="separator">|</span>
                  <span className="type">{this.getProfileType(result)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

Search.defaultProps = {
  className: "search-nav"
};

export default translate()(
  connect(
    state => ({
      searchActive: state.search.searchActive
    }),
    { toggleSearch }
  )(Search)
);
