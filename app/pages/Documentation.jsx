import React from "react";
import { translate } from "react-i18next";
import "./Documentation.css";

import Datasets from "components/Datasets";
/*<div
                  dangerouslySetInnerHTML={{
                    __html: t("about.data.nesi.text")
                  }}
                />
 */
class Documentation extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div className="documentation">
        <section className="intro">
          <h3>{t("documentation_api.title1")}</h3>
          <p
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.intro.text1")
            }}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.intro.text2")
            }}
          />
          <div className="def-text">
            <h5 className="title">Cubo</h5>
            <p
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.definitions.cube")
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.definitions.cube2")
              }}
            />
          </div>
          <div className="def-text">
            <h5 className="title">Drilldown</h5>
            {t("Some previous definitions")}:
            <ul>
              <li
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.definitions.member")
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.definitions.level")
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.definitions.hierarchy")
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.definitions.dimension")
                }}
              />
            </ul>
            <p
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.definitions.drilldown")
              }}
            />
          </div>

          <div className="def-text">
            <h5 className="title">Measure</h5>
            <p
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.definitions.measure")
              }}
            />
          </div>
          <div className="def-text">
            <h5 className="title">Cut</h5>
            <p
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.definitions.cut")
              }}
            />
          </div>
        </section>
        <section className="syntax">
          <h3>{t("documentation_api.title2")}</h3>

          <div className="method">
            <span className="text">GET</span>{" "}
            <span className="url">{`/cubes/{{cube_name}}/aggregate`}</span>
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.syntax.text1")
            }}
          />
          <table>
            <thead>
              <tr>
                <th className="field">{t("Param")}</th>
                <th>{t("Type")}</th>
                <th className="description">{t("Description")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>drilldown[]</td>
                <td>
                  <span className="code">string</span>
                </td>
                <td className="description">
                  Para generar un drilldown, se debe tener en cuenta: Dimension,
                  Hierarchy, Level.
                  <span className="code format">
                    [Dimension].[Hierarchy].[Level]
                  </span>
                </td>
              </tr>
              <tr>
                <td>measures[]</td>
                <td>
                  <span className="code">string</span>
                </td>
                <td className="description">
                  <span className="code">Measure</span>
                </td>
              </tr>
              <tr>
                <td>cut[]</td>
                <td>
                  <span className="code">string</span>
                </td>
                <td className="description">
                  Se debe concatenar el drilldown sobre el cuál se desea hacer
                  el corte, con <span className="code">Level ID</span>.
                  <span className="code format">
                    [Dimension].[Hierarchy].[Level].&[member_id]<sup>1</sup>
                  </span>
                </td>
              </tr>
              <tr>
                <td>nonempty</td>
                <td>
                  <span className="code">boolean</span>
                </td>
                <td className="description">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("documentation_api.definitions.nonempty")
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>distinct</td>
                <td>
                  <span className="code">boolean</span>
                </td>
                <td className="description">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("documentation_api.definitions.distinct")
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>parents</td>
                <td>
                  <span className="code">boolean</span>
                </td>
                <td className="description">
                  En caso de encontrarse en un nivel de profundidad mayor a 1,
                  obtiene el ID y nombre de los niveles padres. --
                </td>
              </tr>
              <tr>
                <td>sparse</td>
                <td>
                  <span className="code">boolean</span>
                </td>
                <td className="description">--</td>
              </tr>
            </tbody>
          </table>

          <div className="pagenote">
            1. Si se hace la consulta directamente en URL, se debe reemplazar &
            por %26 para evitar problemas de parseo del corte.
          </div>
        </section>
        <section className="syntax">
          <div className="method">
            <span className="text">GET</span>{" "}
            <span className="url">
              {`/cubes/{{cube_name}}/dimensions/{{dimension_name}}/levels/{{level_name}}/members`}
            </span>
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.syntax.text2")
            }}
          />
        </section>
        <section className="datasets">
          <h3>{t("documentation_api.title7")}</h3>
          <Datasets />
        </section>

        <section className="examples">
          <h3>{t("documentation_api.title3")}</h3>
          <p
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.examples.text1")
            }}
          />
          <h4>Query</h4>
          <div className="code left">
            {`https://chilecube.datawheel.us//cubes/casen_health_system/aggregate.json?drilldown[]=[Health System].[Health System]&cut[]=[Geography].[Comuna].%26[64]&measures[]=Expansion Factor Comuna&caption[]=[Health System].[Health System].Description ES&caption[]=[Health System].[Health System Group].Description ES&nonempty=true&distinct=false&parents=true&sparse=true`}
          </div>
          <h4>Output</h4>
          <pre>
            <code>
              {`
    {
      "axes": [
        {
          "members": [
            {
              "name": "Expansion Factor Comuna",
              "full_name": "[Measures].[Expansion Factor Comuna]",
              "caption": "Expansion Factor Comuna",
              "key": "Expansion Factor Comuna",
              ...
            }
          ]
        },
        {
          "members": [
            {
              "name": "FONASA",
              "full_name": "[Health System].[FONASA]",
              "caption": "FONASA",
              "key": 1,
              ...
            },
            {
              "name": "Isapre",
              "full_name": "[Health System].[Isapre]",
              "caption": "Isapre",
              "key": 3,
              ...
            }
            ...
          ]
        }
      ],
      "axis_dimensions": [
        {
          "name": "Measures",
          "caption": "Measures",
          "type": "measures",
          "level": "MeasuresLevel",
          "level_depth": 0
        },
        {
          "name": "Health System",
          "caption": "Health System",
          "type": "standard",
          "level": "Health System Group",
          "level_depth": 1
        }
      ],
      "values": [
        [ 1130724.0 ],
        [ 62378.0 ],
        [ 255801.0 ],
        [ 81866.0 ]
      ]
    }
                `}
            </code>
          </pre>
        </section>

        <section className="complex">
          <h3>{t("documentation_api.title4")}</h3>
          <div className="def-text">
            <p
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.complex.text1")
              }}
            />

            <div className="example">
              <p
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.complex.text2")
                }}
              />
              <div className="code">
                {`cut[]: {[Geography].[Geography].[Region].&[4], [Geography].[Geography].[Region].&[5]}`}
              </div>
              <p
                className="clarification"
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.complex.text3")
                }}
              />
            </div>
            <div className="example">
              <p
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.complex.text4")
                }}
              />
              <div className="code">
                {`drilldown[]: [Origin Country].[Country].[Country]`}
                <br />
                {`drilldown[]: [Geography].[Geography].[Comuna]`}
                <br />
                {`drilldown[]: [Date].[Date].[Year]`}
                <br />
                {`measures[]: CIF US`}
                <br />
                {`cut[]: {[Date].[Date].[Year].&[2013], [Date].[Date].[Year].&[2014], [Date].[Date].[Year].&[2015]}`}
              </div>
              <p
                className="clarification"
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.complex.text3")
                }}
              />
            </div>
          </div>
        </section>

        <section className="mondrian">
          <h3>{t("documentation_api.title5")}</h3>
          <p>https://github.com/Datawheel/mondrian-rest-client</p>
        </section>

        <section className="client-python">
          <h3>{t("documentation_api.title6")}</h3>
          <p
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.client-python.text1")
            }}
          />
          <p
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.client-python.text2")
            }}
          />
          <pre>
            <code>
              {`
    from datachile import ChileCube

    client = ChileCube()

    query = client.get(
        "exports", 
        {
            "drilldowns": [
                ["Date", "Year"],
                ["Destination Country", "Country", "Country"]
            ],
            "measures": ["FOB US"],
            "cuts": [
                {
                    "drilldown": ["Date", "Year"],
                    "values": [2012, 2013, 2014]
                }
            ],
            "parents": True
        }
    )

    print(query)
            `}
            </code>
          </pre>
        </section>
      </div>
    );
  }
}
export default translate()(Documentation);
