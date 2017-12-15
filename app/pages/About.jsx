import React, { Component } from "react";
import { translate } from "react-i18next";
import { CanonComponent, TopicTitle } from "datawheel-canon";

import Nav from "components/Nav";
import "./About.css";

class About extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    //window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  render() {
    const { t } = this.props;
    const topics = [
      {
        slug: "background",
        title: t("about.background.title")
      },
      {
        slug: "data",
        title: t("about.data.title")
      },
      {
        slug: "glossary",
        title: t("Glossary")
      },
      {
        slug: "teams",
        title: t("Team")
      },
      {
        slug: "acknowledgement",
        title: t("Acknowledgement")
      },
      {
        slug: "terms",
        title: t("Terms of Use")
      }
    ];

    return (
      <CanonComponent id="about" data={this.props.data} topics={topics}>
        <Nav
          title={t("About")}
          typeTitle={t("Home")}
          type={false}
          exploreLink={"/"}
        />
        <div className="about">
          <div className="intro">
            <div className="splash">
              <div className="image" />
              <div className="gradient" />
            </div>
            <div className="sublinks">
              {topics.map(topic => (
                <a key={topic.slug} className="sublink" href={`#${topic.slug}`}>
                  {topic.title}
                </a>
              ))}
            </div>
          </div>

          <div className="section-container">
            /* ABOUT */
            <section className="section" id="background">
              <h2>{t("about.background.title")}</h2>

              <h3>{t("about.background.subtitle1")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.background.text1")
                }}
              />

              <h3>{t("about.background.subtitle2")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.background.text2")
                }}
              />
            </section>
            /* DATA */
            <section className="section" id="data">
              <h2>{t("about.data.title")}</h2>

              <p>{t("about.data.text")}</p>

              <table>
                <thead>
                  <tr>
                    <th>{t("about.data.dataset")}</th>
                    <th>{t("about.data.source")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <a href="#dataset_casen">
                        Encuesta de Caracterización Socioeconómica Nacional
                        (CASEN)
                      </a>
                    </td>
                    <td>Instituto Nacional de Estadísticas (INE)</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">
                        Nueva Encuesta Nacional de Empleo (NENE)
                      </a>
                    </td>
                    <td>Instituto Nacional de Estadísticas (INE)</td>
                  </tr>
                </tbody>
              </table>

              <h3 id="dataset_casen">{t("about.data.casen.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.casen.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.casen.use")
                }}
              />

              <h3 id="dataset_nene">{t("about.data.nene.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.nene.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.nene.use")
                }}
              />

              <h3 id="dataset_nene">{t("about.data.nesi.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.nesi.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.nesi.use")
                }}
              />
            </section>
          </div>
        </div>
      </CanonComponent>
    );
  }
}

export default translate()(About);
