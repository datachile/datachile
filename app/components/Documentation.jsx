import React from "react";
import { translate } from "react-i18next";
import "./Documentation.css";

import Datasets from "components/Datasets";

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
            <h3 className="title">{t("documentation_api.terms.cube")}</h3>
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
            <h3 className="title">{t("documentation_api.terms.drilldown")}</h3>
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
            <h3 className="title">{t("documentation_api.terms.measure")}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.definitions.measure")
              }}
            />
          </div>
          <div className="def-text">
            <h3 className="title">{t("documentation_api.terms.cut")}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.definitions.cut")
              }}
            />
          </div>
        </section>
        <section className="syntax">
          <h2>{t("documentation_api.title2")}</h2>

          <div className="method">
            <span className="subhead">URL BASE</span>{" "}
            <code className="url">{`https://chilecube.datachile.io`}</code>
          </div>

          <div className="method">
            <span className="subhead">GET</span>{" "}
            <code className="url">
              {`/cubes/{{cube_name}}/dimensions/{{dimension_name}}/levels/{{level_name}}/members`}
            </code>
            <p className="clarification font-xs"
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.syntax.text2")
              }}
            />
          </div>

          <div className="method">
            <span className="subhead">GET</span>{" "}
            <code className="url">{`/cubes/{{cube_name}}/aggregate`}</code>{" "}
            <p className="clarification font-xs"
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.syntax.text1")
              }}
            />
          </div>

          <table className="docs-table">
            <thead>
              <tr>
                <th className="subhead field">{t("Param")}</th>
                <th className="subhead">{t("Type")}</th>
                <th className="subhead description">{t("Description")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>drilldown[]</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td className="description">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("documentation_api.descriptions.drilldown[]")
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <code>measures[]</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td className="description">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("documentation_api.descriptions.measures[]")
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <code>cut[]</code>
                </td>
                <td>
                  <code>string</code>
                </td>
                <td className="description">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("documentation_api.descriptions.cut[]")
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <code>nonempty</code>
                </td>
                <td>
                  <code>boolean</code>
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
                <td>
                  <code>distinct</code>
                </td>
                <td>
                  <code>boolean</code>
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
                <td>
                  <code>parents</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td className="description">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("documentation_api.descriptions.parents")
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <code>sparse</code>
                </td>
                <td>
                  <code>boolean</code>
                </td>
                <td className="description">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("documentation_api.descriptions.sparse")
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="clarification font-xs">
            <span
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.descriptions.pagenote.text1")
              }}
            />
          </div>
        </section>
        <section className="datasets">
          <h2>{t("documentation_api.title7")}</h2>
          <Datasets />
          <p
            className="clarification font-xs"
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.datasets.text1")
            }}
          />
        </section>

        <section className="examples">
          <h2>{t("documentation_api.title3")}</h2>
          <p
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.examples.text1")
            }}
          />
          <h3>Query</h3>
          <pre className="left hidden">
            <code>
              {`https://chilecube.datachile.io//cubes/casen_health_system/aggregate.json?drilldown[]=[Health System].[Health System]&drilldown[]=[Date].[Date].[Year]&cut[]=[Geography].[Comuna].%26[64]&measures[]=Expansion Factor Comuna&caption[]=[Health System].[Health System].Description ES&caption[]=[Health System].[Health System Group].Description ES&nonempty=true&distinct=false&parents=true&sparse=true`}
            </code>
          </pre>
          <h3>Output</h3>
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
          <h2>{t("documentation_api.title4")}</h2>
          <div className="def-text">
            <p
              dangerouslySetInnerHTML={{
                __html: t("documentation_api.complex.text1")
              }}
            />

            <div className="example">
              <h3
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.complex.text2")
                }}
              />
              <pre className="hidden">
                <code>
                  {`cut[]: {[Geography].[Geography].[Region].&[4], [Geography].[Geography].[Region].&[5]}`}
                </code>
              </pre>
              <p
                className="clarification font-xs"
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.complex.text3")
                }}
              />
            </div>
            <div className="example">
              <h3
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.complex.text4")
                }}
              />
              <pre>
                <code>
                  {`drilldown[]: [Origin Country].[Country].[Country]`}
                  <br />
                  {`drilldown[]: [Geography].[Geography].[Comuna]`}
                  <br />
                  {`drilldown[]: [Date].[Date].[Year]`}
                  <br />
                  {`measures[]: CIF US`}
                  <br />
                  {`cut[]: {[Date].[Date].[Year].&[2013], [Date].[Date].[Year].&[2014], [Date].[Date].[Year].&[2015]}`}
                </code>
              </pre>
              <p
                className="clarification font-xs"
                dangerouslySetInnerHTML={{
                  __html: t("documentation_api.complex.text3")
                }}
              />
            </div>
          </div>
        </section>

        <section className="mondrian">
          <h2>{t("documentation_api.title5")}</h2>
          <p>
            <a href="https://github.com/Datawheel/mondrian-rest-client">
              https://github.com/Datawheel/mondrian-rest-client
            </a>
          </p>
        </section>

        <section className="client-python">
          <h2>{t("documentation_api.title6")}</h2>
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
          <p className="clarification font-xs"
            dangerouslySetInnerHTML={{
              __html: t("documentation_api.client-python.text3")
            }}
          />
        </section>
      </div>
    );
  }
}
export default translate()(Documentation);
