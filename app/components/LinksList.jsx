import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { translate } from "react-i18next";
import { FORMATTERS } from "helpers/formatters";

import "./LinksList.css";

class LinksList extends Component {
    constructor(props) {
        super(props);
        this.toggleList = this.toggleList.bind(this);
        this.state = {
            openList: false
        };
    }

    toggleList() {
        this.setState({
            openList: !this.state.openList
        });
    }

    render() {
        if (!this.state) {
            return null;
        }

        const { t, list, title, open } = this.props;
        const { openList } = this.state;

        const openClass = openList ? "open-list" : "";
        const openText = openList ? t("See less") : t("See more");

        const render = list && list.length > 0 ? true : false;

        return (
            <div className={`links-list-container`}>
                {render && (
                    <div>
                        <h5>{title}</h5>
                        <ul className={`links-list ${openClass}`}>
                            {list.map(l => (
                                <li>
                                    <Link to={l.link}>
                                        <span className="pt-icon-standard pt-icon-chevron-right" />{" "}
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                            {list &&
                                list.length > 8 && (
                                    <li className="see-more">
                                        <a onClick={() => this.toggleList()}>
                                            {openText}
                                        </a>
                                    </li>
                                )}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

export default translate()(connect(state => ({}), {})(LinksList));
