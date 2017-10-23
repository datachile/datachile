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

import "../intro.css";

class CountryProfile extends Component {
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
          "exports",
          "Destination Country",
          "Subregion",
          ids.level1,
          store.i18n.locale
        )
      ];

      if (ids.level2) {
        prms.push(
          getMemberQuery(
            "exports",
            "Destination Country",
            "Country",
            ids.level2,
            store.i18n.locale
          )
        );
      }

      var prm = Promise.all(prms).then(res => {
        return { key: "country", data: ingestParent(res[0], res[1]) };
      });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {

      var ids = getLevelObject(params);

      var prm;

      if (ids.level2) {
        
        prm = getMembersQuery(
              "exports",
              "Destination Country",
              "Subregion",
              store.i18n.locale,
              false
            ).then(res => {
            return {
              key: "country_list_detail",
              data: res
            };
          });

      }else{

        prm = mondrianClient
          .cube("exports")
          .then(cube => {
            var q;
            
              //Search countries
              q = levelCut(
                ids,
                "Destination Country",
                "Country",
                cube.query
                  .option("parents", true)
                  .drilldown("Destination Country", "Country", "Country")
                  .measure("FOB US"),
                "Subregion",
                "Country",
                store.i18n.locale,
                false
              );

            return mondrianClient.query(q, "jsonrecords");
          })
          .then(res => {
            return {
              key: "country_list_detail",
              data: res.data.data
            };
          });

      }

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

    const { country } = this.props.routeParams;

    const obj = this.props.data.country;

    const ids = getLevelObject(this.props.routeParams);

    const list = this.props.data.country_list_detail;


    obj && ids && list
      ? list.map(c => {
          c.label = ids.level2 ? c["caption"] : c["Country"];
          if (ids.level2 && c["fullName"]) {
            c.link = slugifyItem(
              "countries",
              c["key"],
              c["name"],
              false,
              false
            );
          } else if (ids.level1 && c["ID Subregion"]) {
            c.link = slugifyItem(
              "countries",
              obj.key,
              obj.name,
              c["ID Country"],
              c["Country"]
            );
          }
          return c;
        })
      : [];
    
    console.warn('list->',list);

    const listTitle = ids
      ? ids.level2 ? t("Other regions") : t("Countries")
      : "";

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
      }
    ];

    return (
      <CanonComponent data={this.props.data} d3plus={d3plus} topics={topics}>
        <div className="profile">
          <div className="intro">
            {obj && (
              <Nav
                title={obj.caption}
                typeTitle={obj.parent ? t("Country") : t("Zone")}
                type={"countries"}
                exploreLink={"/explore/countries"}
                ancestor={obj.parent ? obj.parent.caption : ""}
                ancestorLink={
                  obj.parent
                    ? slugifyItem("countries", obj.parent.key, obj.parent.name)
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
                {stats.employees && (
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
                  />
                )}

                {stats.income && (
                  <FeaturedDatumSplash
                    title={t("Average Income")}
                    icon="ingreso"
                    decile={stats.income.decile}
                    datum={numeral(stats.income.value, locale).format("(0,0)")}
                    source={stats.income.year + " - " + stats.income.source}
                    className=""
                  />
                )}

                {stats.studies && (
                  <FeaturedDatumSplash
                    title={t("Years of Studies")}
                    icon="psu"
                    decile={stats.studies.decile}
                    datum={numeral(stats.studies.value, locale).format("(0,0)")}
                    source={stats.studies.year + " - " + stats.studies.source}
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
                    <small>
                      <span className="pipe">|</span>
                      {obj.caption}
                    </small>
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
                  <div className="topic-slide-text">
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
  )(CountryProfile)
);
