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
                      <a href="#dataset_casen">{t("about.data.casen.title")}</a>
                    </td>
                    <td>{t("about.data.casen.source")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">{t("about.data.nene.title")}</a>
                    </td>
                    <td>{t("about.data.nene.title")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nesi">{t("about.data.nesi.title")}</a>
                    </td>
                    <td>{t("about.data.nesi.title")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_matricula">
                        {t("about.data.matricula.title")}
                      </a>
                    </td>
                    <td>{t("about.data.matricula.title")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_psu">{t("about.data.psu.title")}</a>
                    </td>
                    <td>{t("about.data.psu.title")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_empleabilidad">
                        {t("about.data.empleabilidad.title")}
                      </a>
                    </td>
                    <td>{t("about.data.empleabilidad.title")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_salud">{t("about.data.salud.title")}</a>
                    </td>
                    <td>{t("about.data.salud.title")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_vida">{t("about.data.vida.title")}</a>
                    </td>
                    <td>{t("about.data.vida.title")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_migracion">
                        {t("about.data.migracion.title")}
                      </a>
                    </td>
                    <td>{t("about.data.migracion.title")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_discapacidad">
                        {t("about.data.discapacidad.title")}
                      </a>
                    </td>
                    <td>{t("about.data.discapacidad.title")}</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_gasto">{t("about.data.gasto.title")}</a>
                    </td>
                    <td>{t("about.data.gasto.title")}</td>
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

              <h3 id="dataset_nesi">{t("about.data.nesi.title")}</h3>
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

              <h3 id="dataset_vida">{t("about.data.vida.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.vida.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.vida.use")
                }}
              />

              <h3 id="dataset_matricula">{t("about.data.matricula.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.matricula.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.matricula.use")
                }}
              />

              <h3 id="dataset_psu">{t("about.data.psu.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.psu.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.psu.use")
                }}
              />

              <h3 id="dataset_empleabilidad">
                {t("about.data.empleabilidad.title")}
              </h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.empleabilidad.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.empleabilidad.use")
                }}
              />

              <h3 id="dataset_salud">{t("about.data.salud.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.salud.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.salud.use")
                }}
              />

              <h3 id="dataset_vida">{t("about.data.vida.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.vida.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.vida.use")
                }}
              />

              <h3 id="dataset_migracion">{t("about.data.migracion.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.migracion.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.migracion.use")
                }}
              />

              <h3 id="dataset_discapacidad">
                {t("about.data.discapacidad.title")}
              </h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.discapacidad.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.discapacidad.use")
                }}
              />

              <h3 id="dataset_gasto">{t("about.data.gasto.title")}</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("about.data.gasto.text")
                }}
              />

              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.gasto.use")
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
