import React, { Component } from "react";
import { connect } from "react-redux";
import PersonItem from "components/PersonItem";
import { translate } from "react-i18next";
import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";
import { getGeoObject } from "helpers/dataUtils";
import "./AuthoritiesBlock.css";

class AuthoritiesBlock extends Component {
  static need = [
    (params, store) => {
      const geo = getGeoObject(params);

      var prm;
      if (geo.type != "country") {
        prm = new Promise((resolve, reject) => {
          resolve({
            key: "election_president",
            data: false
          });
        });
      } else {
        prm = mondrianClient
          .cube("election_results")
          .then(cube => {
            var q = cube.query
              .drilldown("Candidates", "Candidates", "Candidate")
              .drilldown("Party", "Party", "Party")
              .measure("Votes")
              .cut("[Elected].[Elected].&[1]")
              .cut("[Election Type].[Election Type].&[2]");

            q.cut(`[Date].[Year].&[${store.presidential_election_year}]`);

            return mondrianClient.query(
              setLangCaptions(q, store.i18n.locale),
              "jsonrecords"
            );
          })
          .then(res => {
            return {
              key: "election_president",
              data: res.data.data[0]
            };
          });
      }

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const geo = getGeoObject(params);

      var prm;
      if (geo.type == "country") {
        prm = new Promise((resolve, reject) => {
          resolve({
            key: "election_senators",
            data: false
          });
        });
      } else {
        prm = mondrianClient
          .cube("election_results")
          .then(cube => {
            var q = cube.query
              .drilldown("Candidates", "Candidates", "Candidate")
              .drilldown("Party", "Party", "Party")
              .measure("Votes")
              .cut("[Elected].[Elected].&[1]")
              .cut("[Election Type].[Election Type].&[3]")
              .cut(
                `{[Date].[Date].[Year].&[${
                  store.senators_election_year[0]
                }],[Date].[Date].[Year].&[${store.senators_election_year[1]}]}`
              );

            var id = 99999;
            switch (geo.type) {
              case "region":
                id = geo.key;
                break;
              case "comuna":
                id = geo.ancestor.key;
                break;
            }

            q.cut(`[GeographyR].[Geography].[Region].&[${id}]`);

            return mondrianClient.query(
              setLangCaptions(q, store.i18n.locale),
              "jsonrecords"
            );
          })
          .then(
            res => {
              return {
                key: "election_senators",
                data: res.data.data.filter(function(r) {
                  return r["Votes"] != null;
                })
              };
            },
            error => {
              console.error("AuthoritiesBlock need:", error);
              return {
                key: "election_senators",
                data: false
              };
            }
          );
      }

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const geo = getGeoObject(params);

      var prm;
      if (geo.type == "comuna") {
        prm = mondrianClient
          .cube("election_results")
          .then(cube => {
            var q = cube.query
              .drilldown("Candidates", "Candidates", "Candidate")
              .drilldown("Party", "Party", "Party")
              .measure("Votes")
              .cut("[Elected].[Elected].&[1]")
              .cut("[Election Type].[Election Type].&[5]")
              .cut(`[Date].[Year].&[${store.mayor_election_year}]`)
              .cut(`[GeographyC].[Geography].[Comuna].&[${geo.key}]`);

            return mondrianClient.query(
              setLangCaptions(q, store.i18n.locale),
              "jsonrecords"
            );
          })
          .then(res => {
            return {
              key: "election_mayor",
              data: res.data.data[0]
            };
          });
      } else {
        prm = new Promise((resolve, reject) => {
          resolve({
            key: "election_mayor",
            data: false
          });
        });
      }

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { t } = this.props;

    const geo = this.props.data.geo;

    console.log(geo);

    const president = this.props.data.election_president
      ? {
          id: this.props.data.election_president["ID Candidate"],
          name: this.props.data.election_president["Candidate"],
          party: false
        }
      : false;

    const mayor = this.props.data.election_mayor
      ? {
          id: this.props.data.election_mayor["ID Candidate"],
          name: this.props.data.election_mayor["Candidate"],
          party: this.props.data.election_mayor["Party"]
        }
      : false;

    const senators = this.props.data.election_senators
      ? this.props.data.election_senators.map(d => {
          return {
            id: d["ID Candidate"],
            name: d["Candidate"],
            party: d["Party"]
          };
        })
      : false;

    return (
      <div className="splash-authorities">
        {president && (
          <div>
            <div className="title">{t("President")}</div>
            <div className="splash-authorities-president">
              <PersonItem
                imgpath={
                  "/images/authorities/president/" + president.id + ".png"
                }
                name={president.name}
                subtitle={president.party}
                className="president"
              />
            </div>
          </div>
        )}
        {senators && (
          <div>
            <div className="title">{t("Senators")}</div>
            <div className="splash-authorities-senators">
              {senators.map((s, ix) => (
                <PersonItem
                  imgpath={"/images/authorities/senators/" + s.id + ".jpeg"}
                  name={s.name}
                  subtitle={s.party}
                  className="senator"
                  key={ix}
                />
              ))}
            </div>
          </div>
        )}
        {mayor && (
          <div>
            <div className="title">{t("Mayor")}</div>
            <div className="splash-authorities-mayor">
              <PersonItem
                imgpath={
                  "/images/authorities/mayors/region-" +
                  geo.ancestors[0].key +
                  "/" +
                  mayor.id +
                  ".jpg"
                }
                name={mayor.name}
                subtitle={mayor.party}
                className="mayor"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(AuthoritiesBlock)
);
