import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { CanonComponent } from "datawheel-canon";
import { Link } from "react-router";
import { browserHistory } from "react-router";
import { translate } from "react-i18next";

import d3plus from "helpers/d3plus";
import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, {
  getMembersQuery,
  getMemberQuery
} from "helpers/MondrianClient";
import { getLevelObject, ingestParent } from "helpers/dataUtils";

import Nav from "components/Nav";
import SvgImage from "components/SvgImage";
import TopicMenu from "components/TopicMenu";
import FeaturedDatumSplash from "components/FeaturedDatumSplash";

import "../intro.css";

class IndustryProfile extends Component {
  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  }

  static need = [
    (params, store) => {
      var ids = getLevelObject(params);

      var prms = [
        getMemberQuery(
          "tax_data",
          "ISICrev4",
          "Level 1",
          ids.level1,
          store.i18n.locale
        )
      ];

      if (ids.level2) {
        prms.push(
          getMemberQuery(
            "tax_data",
            "ISICrev4",
            "Level 2",
            ids.level2,
            store.i18n.locale
          )
        );
      }

      var prm = Promise.all(prms).then(res => {
        return { key: "industry", data: ingestParent(res[0], res[1]) };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  componentDidMount() {}

  render() {
    const { subnav, activeSub } = this.state;

    const { focus, t, i18n } = this.props;

    const { industry } = this.props.routeParams;
    
    const obj = this.props.data.industry;

    const locale = i18n.language.split("-")[0];

    const stats = {
      employees: {
        value: 1000,
        decile: 5,
        year: 2010,
        source: "source"
      },
      income: {
        value: 1000,
        decile: 5,
        year: 2010,
        source: "source"
      },
      studies: {
        value: 1000,
        decile: 5,
        year: 2010,
        source: "source"
      }
    };

    const topics = [
      {
        slug: "about",
        title: t("About")
      },
      {
        slug: "employment",
        title: t("Employment")
      }
    ];

    return (
      <CanonComponent data={this.props.data} d3plus={d3plus} topics={topics}>
        <div className="profile">
          <div className="intro">
            {obj &&
              <Nav
                title={obj.caption}
                type={obj.parent ? t("Industry") : t("Industry Type")}
                exploreLink={"/explore/industries"}
                ancestor={obj.parent ? obj.parent.caption : ""}
                ancestorLink={
                  obj.parent
                    ? slugifyItem("industries", obj.parent.key, obj.parent.name)
                    : ""
                }
                topics={topics}
              />}
              <div className="splash">
                <div
                  className="image"
                  style={{
                    backgroundImage: `url('/images/profile-bg/chile.jpg')`
                  }}
                />
                <div className="gradient" />
              </div>

              <div className="header">
                  <div className="datum-full-width">
                    
                    {stats.employees &&
                      <FeaturedDatumSplash
                        title={t("Employees")}
                        icon="poblacion"
                        decile={stats.employees.decile}
                        datum={numeral(stats.employees.value, locale).format(
                          "(0,0)"
                        )}
                        source={
                          stats.employees.year + " - " + stats.employees.source
                        }
                        className=""
                      />}


                    {stats.income &&
                      <FeaturedDatumSplash
                        title={t("Average Income")}
                        icon="ingreso"
                        decile={stats.income.decile}
                        datum={numeral(stats.income.value, locale).format(
                          "(0,0)"
                        )}
                        source={
                          stats.income.year + " - " + stats.income.source
                        }
                        className=""
                      />}


                    {stats.studies &&
                      <FeaturedDatumSplash
                        title={t("Years of Studies")}
                        icon="psu"
                        decile={stats.studies.decile}
                        datum={numeral(stats.studies.value, locale).format(
                          "(0,0)"
                        )}
                        source={
                          stats.studies.year + " - " + stats.studies.source
                        }
                        className=""
                      />}
                  
                  </div>

              </div>

              <div className="topics-selector-container">
                <TopicMenu topics={topics} />
              </div>

              <div className="arrow-container">
                <a href="#about">
                  <SvgImage src="/images/profile-icon/icon-arrow.svg" />
                </a>
              </div>

          </div>
        </div>
      </CanonComponent>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data,
      focus: state.focus,
      stats: state.stats
    }),
    {}
  )(IndustryProfile)
);
