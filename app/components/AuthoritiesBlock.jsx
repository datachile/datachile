import React, { Component } from "react";
import PersonItem from "components/PersonItem";
import { translate } from "react-i18next";
import "./AuthoritiesBlock.css";

class AuthoritiesBlock extends Component {
  render() {
    const { t, geo, ancestor } = this.props;

    const president = {
      id: 1,
      name: "Michelle Bachelet Jería",
      party: false
    };

    const senators = [
      {
        id: 2,
        name: "Andrés Allamand Z.",
        party: "RN"
      },
      {
        id: 3,
        name: "Guido Girardi L.",
        party: "PPD"
      },
      {
        id: 4,
        name: "Carlos Montes C.",
        party: "PS"
      },
      {
        id: 2,
        name: "Andrés Allamand Z.",
        party: "RN"
      },
      {
        id: 3,
        name: "Guido Girardi L.",
        party: "PPD"
      },
      {
        id: 4,
        name: "Carlos Montes C.",
        party: "PS"
      },
      {
        id: 5,
        name: "Manuel Ossandón I.",
        party: "INDEP."
      }
    ];

    return (
      <div className="splash-authorities">
        <div className="splash-authorities-president">
          <PersonItem
            img={"/images/authorities/" + president.id + ".png"}
            name={president.name}
            subtitle={t("President")}
            className="president lost-1-3"
          />
        </div>
        <div className="splash-authorities-senators">
          {senators &&
            senators.map((s, ix) =>
              <PersonItem
                img={"/images/authorities/" + s.id + ".png"}
                name={s.name}
                subtitle={t("Senator") + " (" + s.party + ")"}
                className="senator lost-1-4"
              />
            )}
        </div>
      </div>
    );
  }
}

export default translate()(AuthoritiesBlock);
