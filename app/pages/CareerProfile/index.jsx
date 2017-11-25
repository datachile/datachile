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
  getMemberQuery,
  levelCut
} from "helpers/MondrianClient";
import { getLevelObject, ingestParent } from "helpers/dataUtils";

import Nav from "components/Nav";
import SvgImage from "components/SvgImage";
import TopicMenu from "components/TopicMenu";
import FeaturedDatumSplash from "components/FeaturedDatumSplash";
import LinksList from "components/LinksList";
import LoadingWithProgress from "components/LoadingWithProgress";

import "../intro.css";

class CareerProfile extends Component {
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
    const { subnav, activeSub } = this.state;

    const { focus, t, i18n } = this.props;

    if (!i18n.language) return null;

    const locale = i18n.language.split("-")[0];

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
      ? ids.level2 ? t("Institutions") : t("Careers")
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
        slug: "demography",
        title: t("Demography")
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
      <CanonComponent
        data={this.props.data}
        d3plus={d3plus}
        topics={topics}
        loadingComponent={<LoadingWithProgress />}
      >
        <div className="profile">
          <div className="intro">
            {obj &&
              obj.caption && (
                <Nav
                  title={obj.caption}
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

            <div className="arrow-container">
              <a href="#about">
                <SvgImage src="/images/profile-icon/icon-arrow.svg" />
              </a>
            </div>
          </div>

          <div className="topic-block" id="about">
            <div className="topic-header">
              <div className="topic-title">
                <h2 className="full-width">
                  {t("About")}
                  {obj && (
                    <span className="small">
                      <span className="pipe"> | </span>
                      {obj.caption}
                    </span>
                  )}
                </h2>
              </div>
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
  )(CareerProfile)
);
