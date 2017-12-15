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
              <h2>{t("DataChile")}</h2>

              <h3>{t("¿En qué consiste el proyecto?")}</h3>
              <p>
                {t(
                  "DataChile es un proyecto desarrollado por Datawheel con el objetivo de centralizar y mostrar parte importante de la información pública del país. Este proyecto reúne información económica, demográfica, educacional y de salud."
                )}
              </p>
              <p>
                {t(
                  "Presentamos una radiografía a las comunas y regiones del país para mostrar varias dimensiones que tienen impacto en el día a día de los ciudadanos en las distintas localidades del Chile."
                )}
              </p>

              <h3>{t("¿Qué soluciona o mejora DataChile?")}</h3>
              <p>
                {t(
                  "Facilitamos el acceso a la información. A cualquier persona que consulte nuestro portal le garantizamos una economía de tiempo y esfuerzo. Todo el trabajo de reunir datos de distintas fuentes y hacer múltiples solicitudes de transparencia ya lo hicimos y dejamos los datos en tus manos."
                )}
              </p>
              <p>
                {t(
                  "Hicimos DataChile pensando en hacer un museo de datos y no una bodega de datos. La API de DataChile permite a todos los usuarios, con o sin conocimientos de programación, descargar los datos del portal o incluirlos en otra página fuera de DataChile en pocos clicks."
                )}
              </p>

              <h2>{t("Datawheel")}</h2>

              <p>
                {t(
                  "Somos una startup formada por el Profesor César Hidalgo y egresados del grupo Macro Connections del MIT."
                )}
              </p>
              <p>
                {t(
                  "Antes de hacer DataChile desarrollamos DataUSA, proyecto que ganó el premio Information is Beautiful. También desarrollamos el Observatorio de la Complejidad Económica, DataViva y DataAfrica. Te invitamos a visitar datawheel.us"
                )}
              </p>
            </section>
            /* DATA */
            <section className="section" id="data">
              <h2>{t("Datos")}</h2>

              <p>{t("DataChile contempla los siguientes datos")}</p>

              <table>
                <thead>
                  <tr>
                    <th>{t("Datos")}</th>
                    <th>{t("Fuentes")}</th>
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
                    <td>Ministerio de Desarrollo Social (MDS)</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">
                        Nueva Encuesta Nacional de Empleo (NENE)
                      </a>
                    </td>
                    <td>Instituto Nacional de Estadísticas (INE)</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">
                        Nueva Encuesta Suplementaria de Ingresos (NENE)
                      </a>
                    </td>
                    <td>Instituto Nacional de Estadísticas (INE)</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">
                        Prueba de Selección Universitaria (PSU)
                      </a>
                    </td>
                    <td>Ministerio de Educación (MINEDUC)</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">
                        Matricula y Rendimiento Escolar
                      </a>
                    </td>
                    <td>Ministerio de Educación (MINEDUC)</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">Estadísticas Migratorias</a>
                    </td>
                    <td>División de Extranjería</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">Estadísticas de Población</a>
                    </td>
                    <td>Instituto Nacional de Estadísticas (INE)</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">Comercio Internacional</a>
                    </td>
                    <td>Aduanas Chile</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">Resultados Electorales</a>
                    </td>
                    <td>Servicio Electoral (SERVEL)</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">Empleabilidad e Ingresos</a>
                    </td>
                    <td>Ministerio de Educación (MINEDUC)</td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">Causas de Muerte</a>
                    </td>
                    <td>
                      Departamento de Estadísticas e Información en Salud (DEIS)
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">Esperanza de Vida</a>
                    </td>
                    <td>
                      Departamento de Estadísticas e Información en Salud (DEIS)
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#dataset_nene">
                        Encuesta Nacional de Discapacidad
                      </a>
                    </td>
                    <td>Servicio Nacional de Discapacidad (SENADIS)</td>
                  </tr>
                </tbody>
              </table>

              <h3 id="dataset_casen">{t("CASEN (1990-2015)")}</h3>
              <p>
                {t(
                  "Datos levantados por el MInisterio de Desarrollo Social (MDS). La Encuesta Casen tiene por objetivo entregar una “ radiografía” de la  situación socioeconómica de los hogares de Chile, siendo la principal fuente de datos utilizada para la medición de la pobreza y desigualdad y ha sido ampliamente utilizada por Organismos Internacionales y ONGs."
                )}
              </p>
              <p>
                {t(
                  "Los resultados de la Encuesta Casen 2015 incluyen la medición de pobreza por ingresos y multidimensional, destacando la incorporación un conjunto de indicadores que permiten medir carencias que afectan a los hogares en relación al entorno en el que habitan. La medición de pobreza multidimensional considera 5 dimensiones relevantes para el bienestar de los hogares y sus integrantes: Educación; Salud; Trabajo y Seguridad Social; Vivienda y Entorno; Redes y Cohesión Social."
                )}
              </p>
              <p>
                {t(
                  "Se usa en los perfiles país, región y comuna en las dimensiones de economía, vivienda y entorno y salud."
                )}
              </p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.casen.use")
                }}
              />

              <h3 id="dataset_nene">{t("NENE (1990-2016)")}</h3>
              <p>
                {t(
                  "Datos levantados por el Instituto Nacional de Estadísticas (INE). La Nueva Encuesta Nacional de Empleo (NENE) se realiza mensualmente y clasifica a la población en edad de trabajar (PET), todas las personas de 15 años y más, según su situación laboral, aplicando un conjunto de reglas aceptadas a nivel mundial y definidas por la Organización Internacional del Trabajo (OIT), en las que se basa el enfoque de medición del empleo y el desempleo a partir de encuestas a hogares."
                )}
              </p>
              <p>
                {t(
                  "Se usa en los perfiles país, región y comuna en las dimensiones de economía y en el perfil de industria en la dimensión de empleo."
                )}
              </p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.nene.use")
                }}
              />

              <h3 id="dataset_nene">{t("NESI (1990-2016)")}</h3>
              <p>
                {t(
                  "Datos levantados por el Instituto Nacional de Estadísticas (INE). La Encuesta Suplementaria de Ingresos (ESI) es un módulo complementario de la Encuesta Nacional de Empleo (ENE). Se realiza cada año entre octubre y diciembre con el objetivo de caracterizar los ingresos laborales de las personas que son clasificadas como ocupadas en la ENE y los ingresos de otras fuentes de los hogares, tanto a nivel nacional como regional."
                )}
              </p>
              <p>
                {t(
                  "La encuesta comprende una batería de preguntas estrechamente asociada al formulario habitual de la encuesta de empleo, por lo que constituye una fuente de información complementaria de la caracterización de la población ocupada. Es la única encuesta que levanta información de ingresos de las personas en Chile con regularidad anual y con representatividad para todas las regiones."
                )}
              </p>
              <p>
                {t(
                  "Se usa en los perfiles país, región y comuna en las dimensiones de economía y en el perfil de industria en la dimensión de ingresos."
                )}
              </p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.nene.use")
                }}
              />

              <h3 id="dataset_nene">
                {t("Matrícula y rendimiento escolar (2004-2015)")}
              </h3>
              <p>
                {t(
                  "Datos generados por el Ministerio de Educación (MINEDUC). Proporcionan información estadística de matrícula de estudiantes del sistema escolar por nivel de enseñanza, curso y sexo, además del área geográfica, dependencia administrativa y región de los establecimientos educacionales."
                )}
              </p>
              <p>
                {t(
                  "Se usa en los perfiles país, región y comuna en las dimensión de educación."
                )}
              </p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.use")
                }}
              />

              <h3 id="dataset_nene">{t("PSU (2004-2016)")}</h3>
              <p>
                {t(
                  "Datos entregados por el Ministerio de Educación (MINEDUC) y generados por el Departamento de Evaluación, Medición y Registro Educacional (DEMRE) que contienen información que permite obtener los puntajes PSU a nivel de establecimiento educacional, establecimientos según sistema de administración (público o privado), comunas y regiones."
                )}
              </p>
              <p>
                {t(
                  "Se usa en los perfiles país, región y comuna en las dimensión de educación."
                )}
              </p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.use")
                }}
              />

              <h3 id="dataset_nene">
                {t("Empleabilidad e Ingresos (2014-2015)")}
              </h3>
              <p>
                {t(
                  "Datos generados por el Ministerio de Educación (MINEDUC). Se obtiene combinando los datos que entregan las instituciones de Educación Superior con los datos de la Subdirección de Estudios del SII sobre la base de las declaraciones de impuestos de los contribuyentes."
                )}
              </p>
              <p>{t("Se usa en el perfil de carreras.")}</p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.use")
                }}
              />

              <h3 id="dataset_nene">
                {t("Indicadores de acceso a la salud (2014)")}
              </h3>
              <p>
                {t(
                  "Datos publicados por el Departamento de Estadísticas e Información de Salud (DEIS) con el fin de ofrecer un panorama general de la situación de salud del país y que dan cuenta de la atención en medicina general, especialidades y odontología."
                )}
              </p>
              <p>
                {t(
                  "Se usa en los perfiles país, región y comuna en las dimensiones de salud."
                )}
              </p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.use")
                }}
              />

              <h3 id="dataset_nene">{t("Esperanza de vida (2010-2014)")}</h3>
              <p>
                {t(
                  "Datos publicados por el Departamento de Estadísticas e Información de Salud (DEIS). Toma como referencia la esperanza de vida al nacer, la cual es una estimación del promedio de años que viviría un grupo de personas nacidas el mismo año, si las condiciones de mortalidad de la región/país evaluado se mantuvieran constantes. Este indicador permite comparar el nivel general de la mortalidad entre países y a lo largo del tiempo."
                )}
              </p>
              <p>
                {t(
                  "Se usa en los perfiles país, región y comuna en las dimensión de salud."
                )}
              </p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.use")
                }}
              />

              <h3 id="dataset_nene">
                {t("Estadísticas Migratorias (2005 - 2016)")}
              </h3>
              <p>
                {t(
                  "Datos generados por el Departamento de Extranjería y Migración, que es la entidad encargada de otorgar permisos de residencia a población extranjera en el país. Este registro corresponde a la población migrante en situación regular."
                )}
              </p>
              <p>
                {t(
                  "Las información de visas otorgadas muestran los permisos migratorios otorgados y no da cuenta del stock de migrantes, sino solo de tendencias. No es un registro exhaustivo, pues por su naturaleza no puede incluir población migrante en situación irregular y se debe considerar que una persona puede obtener más de un permiso migratorio durante su estadía en nuestro país. Por ejemplo, a lo largo de tres años a una misma persona se le podría haber otorgado tres visas o dos visas y una permanencia definitiva. En este caso, el registro indicará las tres visas o las dos visas y la permanencia definitiva, sin considerar que se trata solo de una persona."
                )}
              </p>
              <p>
                {t(
                  "Se usa en los perfiles país, región y comuna en la dimensión de demografía."
                )}
              </p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.use")
                }}
              />

              <h3 id="dataset_nene">
                {t("Encuesta Nacional de Discapacidad (2016)")}
              </h3>
              <p>
                {t(
                  "Datos levantados por el Servicio Nacional de Discapacidad (SENADIS). Este estudio permite conocer la situación de las personas con discapacidad en Chile y cuál es su situación con respecto a la población en general, en términos de su desenvolvimiento en las actividades diarias, relación con el entorno, participación social y otros."
                )}
              </p>
              <p>
                {t(
                  "Se usa en los perfiles país, región y comuna en las dimensiones de salud."
                )}
              </p>
              <div
                className="use"
                dangerouslySetInnerHTML={{
                  __html: t("about.data.use")
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
