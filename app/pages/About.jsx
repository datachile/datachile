import React, { Component } from "react";
import { translate } from "react-i18next";
import { Link } from "react-router";
import { CanonProfile } from "@datawheel/canon-core";
import Helmet from "react-helmet";

import Documentation from "components/Documentation";

import Nav from "components/Nav";
import Datasets from "components/Datasets";

import "./About.css";

class About extends Component {
  static need = [Datasets];
  state = {};

  componentDidMount() {
    //window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  render() {
    const { t, routeParams, location } = this.props;
    const locale = this.props.i18n.language;

    const section = routeParams.section ? routeParams.section : "background";

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
        slug: "api",
        title: t("about.api.title")
      },
      {
        slug: "team",
        title: t("about.team.title")
      },
      {
        slug: "acknowledgement",
        title: t("about.ack.title")
      },
      {
        slug: "terms",
        title: t("about.terms.title")
      },
      {
        slug: "changelog",
        title: t("about.changelog.title")
      }
    ];

    return (
      <CanonProfile id="about" data={this.props.data}>
        <Helmet>
          <title>{t("About")}</title>
          <meta property="og:title" content={t("About DataChile")} />
          <meta
            property="og:url"
            content={`https://${locale}.datachile.io/${location.pathname}`}
          />
          <meta
            property="og:image"
            content={`https://${locale}.datachile.io/images/logos/opengraph.png`}
          />
        </Helmet>
        <Nav
          title={t("About DataChile")}
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
                <Link
                  key={topic.slug}
                  className={`sublink ${
                    topic.slug == section ? "selected" : ""
                  }`}
                  to={`/about/${topic.slug}`}
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="section-container font-sm">
            {section == "background" && (
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

                <h3>{t("about.background.subtitle3")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.background.text3")
                  }}
                />
              </section>
            )}

            {section == "data" && (
              <section className="section" id="data">
                <h2>{t("about.data.title")}</h2>

                <p>{t("about.data.text")}</p>

                <table className="subtle-table font-xs">
                  <thead>
                    <tr>
                      <th className="subhead">{t("about.data.dataset")}</th>
                      <th className="subhead">{t("about.data.year")}</th>
                      <th className="subhead">{t("about.data.source")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_casen">
                          {t("about.data.casen.title")}
                        </a>
                      </td>
                      <td>{t("about.data.casen.year")}</td>
                      <td>{t("about.data.casen.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_nene">{t("about.data.nene.title")}</a>
                      </td>
                      <td>{t("about.data.nene.year")}</td>
                      <td>{t("about.data.nene.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_nesi">{t("about.data.nesi.title")}</a>
                      </td>
                      <td>{t("about.data.nesi.year")}</td>
                      <td>{t("about.data.nesi.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_aduana">
                          {t("about.data.aduana.title")}
                        </a>
                      </td>
                      <td>{t("about.data.aduana.year")}</td>
                      <td>{t("about.data.aduana.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_costes">
                          {t("about.data.costes.title")}
                        </a>
                      </td>
                      <td>{t("about.data.costes.year")}</td>
                      <td>{t("about.data.costes.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_iplusd">
                          {t("about.data.iplusd.title")}
                        </a>
                      </td>
                      <td>{t("about.data.iplusd.year")}</td>
                      <td>{t("about.data.iplusd.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_enrollment">
                          {t("about.data.enrollment.title")}
                        </a>
                      </td>
                      <td>{t("about.data.enrollment.year")}</td>
                      <td>{t("about.data.enrollment.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_censo">
                          {t("about.data.censo.title")}
                        </a>
                      </td>
                      <td>{t("about.data.censo.year")}</td>
                      <td>{t("about.data.censo.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_junaeb">
                          {t("about.data.junaeb_vulnerability.title")}
                        </a>
                      </td>
                      <td>{t("about.data.junaeb_vulnerability.year")}</td>
                      <td>{t("about.data.junaeb_vulnerability.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_infant_mortality">
                          {t("about.data.infant_mortality.title")}
                        </a>
                      </td>
                      <td>{t("about.data.infant_mortality.year")}</td>
                      <td>{t("about.data.infant_mortality.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_performance">
                          {t("about.data.performance.title")}
                        </a>
                      </td>
                      <td>{t("about.data.performance.year")}</td>
                      <td>{t("about.data.performance.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_psu">{t("about.data.psu.title")}</a>
                      </td>
                      <td>{t("about.data.psu.year")}</td>
                      <td>{t("about.data.psu.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_salud">
                          {t("about.data.salud.title")}
                        </a>
                      </td>
                      <td>{t("about.data.salud.year")}</td>
                      <td>{t("about.data.salud.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_muerte">
                          {t("about.data.muerte.title")}
                        </a>
                      </td>
                      <td>{t("about.data.muerte.year")}</td>
                      <td>{t("about.data.muerte.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_discapacidad">
                          {t("about.data.discapacidad.title")}
                        </a>
                      </td>
                      <td>{t("about.data.discapacidad.year")}</td>
                      <td>{t("about.data.discapacidad.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_vida">{t("about.data.vida.title")}</a>
                      </td>
                      <td>{t("about.data.vida.year")}</td>
                      <td>{t("about.data.vida.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_poblacion">
                          {t("about.data.poblacion.title")}
                        </a>
                      </td>
                      <td>{t("about.data.poblacion.year")}</td>
                      <td>{t("about.data.poblacion.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_migracion">
                          {t("about.data.migracion.title")}
                        </a>
                      </td>
                      <td>{t("about.data.migracion.year")}</td>
                      <td>{t("about.data.migracion.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_internet">
                          {t("about.data.internet.title")}
                        </a>
                      </td>
                      <td>{t("about.data.internet.year")}</td>
                      <td>{t("about.data.internet.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_servel">
                          {t("about.data.servel.title")}
                        </a>
                      </td>
                      <td>{t("about.data.servel.year")}</td>
                      <td>{t("about.data.servel.source")}</td>
                    </tr>
                    <tr>
                      <td>
                        <a className="link" href="#dataset_felonies">
                          {t("about.data.felonies.title")}
                        </a>
                      </td>
                      <td>{t("about.data.felonies.year")}</td>
                      <td>{t("about.data.felonies.source")}</td>
                    </tr>
                  </tbody>
                </table>

                <h3 id="dataset_casen">{t("about.data.casen.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.casen.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.casen.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/casen_household_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.household")}
                  </a>
                  {" | "}
                  <a
                    href="https://static.datachile.io/datasets/casen_banking_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.banking")}
                  </a>
                  {" | "}
                  <a
                    href="https://static.datachile.io/datasets/casen_health_system_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.health")}
                  </a>
                  {" | "}
                  <a
                    href="https://static.datachile.io/datasets/casen_income_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.income")}
                  </a>
                </p>

                <p>
                  <a
                    href="https://static.datachile.io/datasets/casen_documentation.zip"
                    target="_blank"
                  >
                    {t("download.docs")}
                  </a>
                </p>

                <h3 id="dataset_nene">{t("about.data.nene.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.nene.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.nene.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/nene_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                  {" | "}
                  <a
                    href="https://static.datachile.io/datasets/nene_documentation.zip"
                    target="_blank"
                  >
                    {t("download.docs")}
                  </a>
                </p>

                <h3 id="dataset_nesi">{t("about.data.nesi.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.nesi.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.nesi.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/nesi_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                  {" | "}
                  <a
                    href="https://static.datachile.io/datasets/nesi_documentation.zip"
                    target="_blank"
                  >
                    {t("download.docs")}
                  </a>
                </p>

                <h3 id="dataset_aduana">{t("about.data.aduana.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.aduana.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.aduana.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/aduanas_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>
                <p>
                  <a
                    href="https://static.datachile.io/datasets/aduanas_metadata.zip"
                    target="_blank"
                  >
                    {t("download.docs")}
                  </a>
                </p>

                <h3 id="dataset_costes">{t("about.data.costes.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.costes.text")
                  }}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.costes.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/production_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_iplusd">{t("about.data.iplusd.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.iplusd.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.iplusd.use")
                  }}
                />
                <p>
                  <a
                    href="https://static.datachile.io/datasets/research_and_development_survey_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_enrollment">
                  {t("about.data.enrollment.title")}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.enrollment.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.enrollment.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/education_enrollment_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_performance">
                  {t("about.data.performance.title")}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.performance.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.performance.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/education_performance_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_psu">{t("about.data.psu.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.psu.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.psu.use")
                  }}
                />

                <h3 id="dataset_salud">{t("about.data.salud.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.salud.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.salud.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/basic_health_indicators_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_muerte">{t("about.data.muerte.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.muerte.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.muerte.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/basic_health_indicators_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_vida">{t("about.data.vida.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.vida.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.vida.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/basic_health_indicators_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_discapacidad">
                  {t("about.data.discapacidad.title")}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.discapacidad.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.discapacidad.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/disability_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_poblacion">
                  {t("about.data.poblacion.title")}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.poblacion.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.poblacion.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/population_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_censo">{t("about.data.censo.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.censo.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.censo.use")
                  }}
                />

                <h3 id="dataset_infant_mortality">
                  {t("about.data.infant_mortality.title")}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.infant_mortality.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.infant_mortality.use")
                  }}
                />

                <h3 id="dataset_migracion">
                  {t("about.data.migracion.title")}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.migracion.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.migracion.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/immigration_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_internet">{t("about.data.internet.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.internet.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.internet.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/internet_use_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_servel">{t("about.data.servel.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.servel.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.servel.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/participation_votes_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_felonies">{t("about.data.felonies.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.felonies.text")
                  }}
                />

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.felonies.use")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/felonies_clean_data.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>

                <h3 id="dataset_ids">{t("about.data.ids.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.ids.text")
                  }}
                />

                <p>
                  <a
                    href="https://static.datachile.io/datasets/official_ids.zip"
                    target="_blank"
                  >
                    {t("download.data")}
                  </a>
                </p>
              </section>
            )}

            {section == "api" && (
              <section className="section" id="api">
                <h2>{t("about.api.title1")}</h2>

                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.api.text1")
                  }}
                />
                <Documentation />
              </section>
            )}

            {section == "team" && (
              <section className="section" id="team">
                <h2>{t("about.team.title")}</h2>

                <h3>{t("about.team.title1")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.team.text1")
                  }}
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.team.members")
                  }}
                />

                <h3>{t("about.team.title2")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.team.text2")
                  }}
                />

                <h3>{t("about.team.title3")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.team.text3")
                  }}
                />

                <h3>{t("about.team.title4")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.team.text4")
                  }}
                />
              </section>
            )}

            {section == "acknowledgement" && (
              <section className="section" id="acknowledgement">
                <h2>{t("about.ack.title")}</h2>
                <h3>{t("about.ack.partners.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.ack.partners.text")
                  }}
                />
                <h3>{t("about.ack.credits.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.ack.credits.text")
                  }}
                />
              </section>
            )}

            {section == "terms" && (
              <section className="section" id="terms">
                <h2>{t("about.terms.title")}</h2>

                <div
                  className="font-xs"
                  dangerouslySetInnerHTML={{
                    __html: t("about.terms.text")
                  }}
                />
              </section>
            )}

            {section == "changelog" && (
              <section className="section" id="terms">
                <h2>{t("about.changelog.title")}</h2>

                <h3>{t("about.changelog.hualle.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.changelog.hualle.description")
                  }}
                />

                <h3>{t("about.changelog.guayacan.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.changelog.guayacan.description")
                  }}
                />

                <h3>{t("about.changelog.fitzroya.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.changelog.fitzroya.description")
                  }}
                />

                <h3>{t("about.changelog.encino.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.changelog.encino.description")
                  }}
                />

                <h3>{t("about.changelog.diamelo.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.changelog.diamelo.description")
                  }}
                />

                <h3>{t("about.changelog.canelo.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.changelog.canelo.description")
                  }}
                />

                <h3>{t("about.changelog.belloto.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.changelog.belloto.description")
                  }}
                />

                <h3>{t("about.changelog.araucaria.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.changelog.araucaria.description")
                  }}
                />

                <h3>{t("about.changelog.launch.title")}</h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("about.changelog.launch.description")
                  }}
                />
              </section>
            )}
          </div>
        </div>
      </CanonProfile>
    );
  }
}

export default translate()(About);
