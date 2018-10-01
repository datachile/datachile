import React, { Component } from "react";
import { connect } from "react-redux";
import { CanonProfile } from "datawheel-canon";
import { translate } from "react-i18next";

import { numeral, shortenProfileName, slugifyItem } from "helpers/formatters";
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
import FeaturedDatumSplash from "components/FeaturedDatumSplash";
import LinksList from "components/LinksList";

import "../intro.css";

class CareerProfile extends Component {
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
          "Careers",
          "Career Group",
          ids.level1,
          store.i18n.locale
        )
      ];

      if (ids.level2) {
        prms.push(
          getMemberQuery(
            "education_employability",
            "Careers",
            "Career",
            ids.level2,
            store.i18n.locale
          )
        );
      }

      var prm = Promise.all(prms).then(res => {
        return { key: "career", data: ingestParent(res[0], res[1]) };
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
            //Search institutions
            q = levelCut(
              ids,
              "Careers",
              "Careers",
              cube.query
                .option("parents", true)
                .drilldown(
                  "Higher Institutions",
                  "Higher Institutions",
                  "Higher Institution"
                )
                .measure("Number of records"),
              "Career Group",
              "Career",
              store.i18n.locale
            );
          } else {
            //Search careers
            q = levelCut(
              ids,
              "Careers",
              "Careers",
              cube.query
                .option("parents", true)
                .drilldown("Careers", "Careers", "Career")
                .measure("Number of records"),
              "Career Group",
              "Career",
              store.i18n.locale,
              false
            );
          }

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "career_list_detail",
            data: res.data.data
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  componentDidMount() {}

  render() {
    const { t, i18n } = this.props;

    const locale = i18n.language;

    const obj = this.props.data.career;

    const ids = getLevelObject(this.props.routeParams);

    const list = this.props.data.career_list_detail;

    obj && ids && list
      ? list.map(c => {
          c.label = ids.level2 ? c["Higher Institution"] : c["Career"];
          if (ids.level2 && c["ID Higher Institution Subgroup"]) {
            c.link = slugifyItem(
              "institutions",
              c["ID Higher Institution Subgroup"],
              c["Higher Institution Subgroup"],
              c["ID Higher Institution"],
              c["Higher Institution"]
            );
          } else if (ids.level1 && c["ID Career"]) {
            c.link = slugifyItem(
              "careers",
              obj.key,
              obj.name,
              c["ID Career"],
              c["Career"]
            );
          }
          return c;
        })
      : [];

    const listTitle = ids
      ? ids.level2
        ? t("Institutions")
        : t("Careers")
      : "";

    const stats = {
      enrollment: {
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
        slug: "demographics",
        title: t("Demographics")
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

    // truncate & add ellipses if necessary
    let titleTruncated = null;
    if (obj) {
      titleTruncated = shortenProfileName(obj.caption);
    }

    return (
      <CanonProfile data={this.props.data} topics={topics}>
        <div className="profile">
          <div className="intro">
            {obj &&
              obj.caption && (
                <Nav
                  title={titleTruncated ? titleTruncated : obj.caption}
                  fullTitle={obj.caption}
                  typeTitle={obj.parent ? t("Career") : t("Field of Science")}
                  type={"careers"}
                  exploreLink={"/explore/careers"}
                  ancestor={obj.parent ? obj.parent.caption : ""}
                  ancestorLink={
                    obj.parent
                      ? slugifyItem("careers", obj.parent.key, obj.parent.name)
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

                {stats.income && (
                  <FeaturedDatumSplash
                    title={t("Average Income 1st year")}
                    icon="ingreso"
                    decile={stats.income.decile}
                    datum={
                      "$" + numeral(stats.income.value, locale).format("(0,0)")
                    }
                    source={stats.income.year + " - " + stats.income.source}
                    className=""
                  />
                )}

                {stats.psu && (
                  <FeaturedDatumSplash
                    title={t("Average psu")}
                    icon="psu"
                    decile={stats.psu.decile}
                    datum={
                      numeral(stats.psu.value, locale).format("(0,0)") + "pts"
                    }
                    source={stats.psu.year + " - " + stats.psu.source}
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
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                  <div className="topic-slide-text">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                  <div className="topic-slide-link-list">
                    <LinksList title={listTitle} list={list} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CanonProfile>
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
  )(CareerProfile)
);
