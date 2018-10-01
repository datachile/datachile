import React, { Component } from "react";
import { connect } from "react-redux";
import { SectionColumns, Canon, CanonProfile } from "datawheel-canon";
import { translate } from "react-i18next";

import { slugifyItem, shortenProfileName } from "helpers/formatters";
import mondrianClient, {
  getMemberQuery,
  levelCut
} from "helpers/MondrianClient";
import {
  getLevelObject,
  ingestParent,
  clearStoreData
} from "helpers/dataUtils";

import Nav from "components/Nav";

import SvgImage from "components/SvgImage";
import TopicMenu from "components/TopicMenu";
import Topic from "components/Topic";
import FeaturedDatumSplash from "components/FeaturedDatumSplash";
import LinksList from "components/LinksList";

/* BEGIN WAGES */
import WagesSlide from "./education/WagesSlide";
import WagesByProgram from "./education/charts/WagesByProgram";
/* END WAGES */

/* BEGIN EMPLOYABILITY */
import EmployabilitySlide from "./employability/EmployabilitySlide";
import EmployabilityByProgram from "./employability/charts/EmployabilityByProgram";
/* END EMPLOYABILITY */

/* BEGIN ACCREDITATION */
import AccreditationSlide from "./education/AccreditationSlide";
import AccreditationByProgram from "./education/charts/AccreditationByProgram";
/* END ACCREDITATION */

/* BEGIN RETENTION */
import RetentionSlide from "./education/RetentionSlide";
import RetentionByProgram from "./education/charts/RetentionByProgram";
/* END RETENTION */

import "../intro.css";
import "../topics.css";

class InstitutionProfile extends Component {
  constructor() {
    super();
    this.state = {
      subnav: false,
      activeSub: false
    };
  }

  static preneed = [clearStoreData];
  static need = [
    (params, store) => {
      var ids = getLevelObject(params);

      var prms = [
        getMemberQuery(
          "education_employability",
          "Higher Institutions",
          "Higher Institution Subgroup",
          ids.level1,
          store.i18n.locale
        )
      ];

      if (ids.level2) {
        prms.push(
          getMemberQuery(
            "education_employability",
            "Higher Institutions",
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
    },
    (params, store) => {
      var ids = getLevelObject(params);
      const prm = mondrianClient
        .cube("education_employability")
        .then(cube => {
          var q;
          if (ids.level2) {
            //Search careers
            q = levelCut(
              ids,
              "Higher Institutions",
              "Higher Institutions",
              cube.query
                .option("parents", true)
                .drilldown("Careers", "Careers", "Career")
                .measure("Number of records"),
              "Higher Institution Subgroup",
              "Higher Institution",
              store.i18n.locale
            );
          } else {
            //Search institutions
            q = levelCut(
              ids,
              "Higher Institutions",
              "Higher Institutions",
              cube.query
                .option("parents", true)
                .drilldown(
                  "Higher Institutions",
                  "Higher Institutions",
                  "Higher Institution"
                )
                .measure("Number of records"),
              "Higher Institution Subgroup",
              "Higher Institution",
              store.i18n.locale,
              false
            );
          }

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "institution_list_detail",
            data: res.data.data
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      var ids = getLevelObject(params);
      const prm = mondrianClient
        .cube("education_employability")
        .then(cube => {
          var q = levelCut(
            ids,
            "Higher Institutions",
            "Higher Institutions",
            cube.query
              .option("parents", true)
              .drilldown("Accreditations", "Accreditations", "Accreditation")
              .measure("Number of records"),
            "Higher Institution Subgroup",
            "Higher Institution",
            store.i18n.locale
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "institution_accreditation",
            data: res.data.data[0]["Accreditation"]
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      var ids = getLevelObject(params);
      const prm = mondrianClient
        .cube("education_employability")
        .then(cube => {
          var q = levelCut(
            ids,
            "Higher Institutions",
            "Higher Institutions",
            cube.query
              .option("parents", true)
              .drilldown(
                "Avg Income 4th year",
                "Avg Income 4th year",
                "Avg Income 4th year"
              )
              .measure("Number of records"),
            "Higher Institution Subgroup",
            "Higher Institution",
            store.i18n.locale
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "institution_avgincome",
            data: res.data.data[0]["Number of records"]
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      var ids = getLevelObject(params);
      const prm = mondrianClient
        .cube("education_employability")
        .then(cube => {
          var q = levelCut(
            ids,
            "Higher Institutions",
            "Higher Institutions",
            cube.query
              .option("parents", true)
              .drilldown(
                "Higher Institutions",
                "Higher Institutions",
                "Higher Institution"
              )
              .measure("Number of records")
              .measure("Avg employability 1st year"),
            "Higher Institution Subgroup",
            "Higher Institution",
            store.i18n.locale
          );
          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "institution_avgemployability",
            data: res.data.data[0]["Avg employability 1st year"]
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },

    WagesSlide,
    WagesByProgram,

    EmployabilitySlide,
    EmployabilityByProgram,

    AccreditationSlide,
    AccreditationByProgram,

    RetentionSlide,
    RetentionByProgram
  ];

  componentDidMount() {}

  render() {
    const { t, i18n } = this.props;

    const locale = i18n.language;
    const obj = this.props.data.institution;
    const ids = getLevelObject(this.props.routeParams);
    const list = this.props.data.institution_list_detail;

    obj && ids && list
      ? list.map(c => {
          c.label = ids.level2 ? c["Career"] : c["Higher Institution"];
          if (ids.level2) {
            c.link = slugifyItem(
              "careers",
              c["ID Career Group"],
              c["Career Group"],
              c["ID Career"],
              c["Career"]
            );
          } else if (ids.level1) {
            c.link = slugifyItem(
              "institutions",
              c["ID Higher Institution Subgroup"],
              c["Higher Institution Subgroup"],
              c["ID Higher Institution"],
              c["Higher Institution"]
            );
          }
          return c;
        })
      : [];

    const listTitle = ids
      ? ids.level2 ? t("Careers") : t("Institutions")
      : "";

    const stats = {
      accreditation: this.props.data.institution_accreditation,
      avgincome: this.props.data.institution_avgincome,
      avgemployability: this.props.data.institution_avgemployability
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
        title: t("Employability")
      }
    ];

    // truncate & add ellipses if necessary
    let titleTruncated = null;
    if (obj) {
      titleTruncated = shortenProfileName(obj.caption);
    }

    return (
      <Canon>
        <CanonProfile data={this.props.data} topics={topics}>
          <div className="profile">
            <div className="intro">
              {obj && (
                <Nav
                  title={titleTruncated ? titleTruncated : obj.caption}
                  fullTitle={obj.caption}
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
                    backgroundImage: `url('/images/profile-bg/geo/chile.jpg')`
                  }}
                />
                <div className="gradient" />
              </div>

              <div className="header">
                <div className="datum-full-width">
                  {stats.accreditation && (
                    <FeaturedDatumSplash
                      title={t("Accreditation")}
                      icon="check"
                      datum={stats.accreditation}
                      source="MINEDUC"
                      className=""
                    />
                  )}

                  {stats.avgincome && (
                    <FeaturedDatumSplash
                      title={t("Average Income (4th year)")}
                      icon="check"
                      datum={stats.avgincome}
                      source="MINEDUC"
                      className=""
                    />
                  )}

                  {stats.avgemployability && (
                    <FeaturedDatumSplash
                      title={t("Average Employability (1st year)")}
                      icon="check"
                      datum={stats.avgemployability}
                      source="MINEDUC"
                      className=""
                    />
                  )}
                </div>
              </div>

              <div className="topics-selector-container">
                <TopicMenu topics={topics} />
              </div>

              {/*<div className="arrow-container">
                <a href="#about">
                  <SvgImage src="/images/profile-icon/icon-arrow.svg" />
                </a>
              </div>*/}
            </div>

            <div className="topic-block" id="about">
              <div className="topic-header">
                <h2 className="topic-heading font-xxl">{t("About")}</h2>
                <div className="topic-go-to-targets">
                  <div className="topic-slider-sections" />
                </div>
              </div>
              <div className="topic-slide-container">
                <div className="topic-slide-block">
                  <div className="topic-slide-intro">
                    <div className="topic-slide-text">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </div>
                    <div className="topic-slide-text">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </div>
                    <div className="topic-slide-link-list">
                      <LinksList title={listTitle} list={list} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="topics-container">
              <Topic
                name={t("Education")}
                id="education"
                slider={false}
                sections={[
                  {
                    name: t("Summary"),
                    slides: [t("")]
                  }
                ]}
              >
                <div className="topic-slide">
                  <WagesSlide>
                    <SectionColumns>
                      <WagesByProgram className="lost-1" />
                    </SectionColumns>
                  </WagesSlide>
                </div>
                <div className="topic-slide">
                  <AccreditationSlide>
                    <SectionColumns>
                      <AccreditationByProgram className="lost-1" />
                    </SectionColumns>
                  </AccreditationSlide>
                </div>
                <div className="topic-slide">
                  <RetentionSlide>
                    <SectionColumns>
                      <RetentionByProgram className="lost-1" />
                    </SectionColumns>
                  </RetentionSlide>
                </div>
              </Topic>
              <Topic
                name={t("Employability")}
                id="employment"
                slider={false}
                sections={[
                  {
                    name: t(""),
                    slides: [t("")]
                  }
                ]}
              >
                <div className="topic-slide">
                  <EmployabilitySlide>
                    <SectionColumns>
                      <EmployabilityByProgram className="lost-1" />
                    </SectionColumns>
                  </EmployabilitySlide>
                </div>
              </Topic>
            </div>
          </div>
        </CanonProfile>
      </Canon>
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
