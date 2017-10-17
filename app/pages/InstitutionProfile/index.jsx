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

class InstitutionProfile extends Component {
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
          "education_employability",
          "Higher Institution",
          "Higher Institution Subgroup",
          ids.level1,
          store.i18n.locale
        )
      ];

      if (ids.level2) {
        prms.push(
          getMemberQuery(
            "education_employability",
            "Higher Institution",
            "Higher Institution",
            ids.level2,
            store.i18n.locale
          )
        );
      }

      var prm = Promise.all(prms).then(res => {
        return { key: "institution", data: ingestParent(res[0], res[1]) };
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

    const { institution } = this.props.routeParams;

    const { focus, t, i18n } = this.props;

    const obj = this.props.data.institution;

    const locale = i18n.language.split("-")[0];

    const stats = {
      enrollment: {
        value: 1000,
        decile: 5,
        year: 2010,
        source: "source"
      },
      accreditation: {
        value: 1000,
        decile: 5,
        year: 2010,
        source: "source"
      },
      psu: {
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
        slug: "education",
        title: t("Education")
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
            {obj && (
              <Nav
                title={obj.caption}
                typeTitle={
                  obj.parent ? t("Institution") : t("Institution Type")
                }
                type={"institutions"}
                exploreLink={"/explore/institutions"}
                ancestor={obj.parent ? obj.parent.caption : ""}
                ancestorLink={
                  obj.parent
                    ? slugifyItem(
                        "institutions",
                        obj.parent.key,
                        obj.parent.name
                      )
                    : ""
                }
                topics={topics}
              />
            )}
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
                {stats.enrollment && (
                  <FeaturedDatumSplash
                    title={t("Total Enrollment")}
                    icon="poblacion"
                    decile={stats.enrollment.decile}
                    datum={numeral(stats.enrollment.value, locale).format(
                      "(0,0)"
                    )}
                    source={
                      stats.enrollment.year + " - " + stats.enrollment.source
                    }
                    className=""
                  />
                )}

                {stats.accreditation && (
                  <FeaturedDatumSplash
                    title={t("Accreditation")}
                    icon="check"
                    decile={stats.accreditation.decile}
                    datum={numeral(stats.accreditation.value, locale).format(
                      "(0,0)"
                    )}
                    source={
                      stats.accreditation.year +
                      " - " +
                      stats.accreditation.source
                    }
                    className=""
                  />
                )}

                {stats.psu && (
                  <FeaturedDatumSplash
                    title={t("Average PSU")}
                    icon="psu"
                    decile={stats.psu.decile}
                    datum={numeral(stats.psu.value, locale).format("(0,0)")}
                    source={stats.psu.year + " - " + stats.psu.source}
                    className=""
                  />
                )}
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
  )(InstitutionProfile)
);
