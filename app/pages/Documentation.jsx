import React from "react";
import { translate } from "react-i18next";
import "./Documentation.css";

class Documentation extends React.Component {
  render() {
    const { t } = this.props;
    return (
      <div className="documentation">
        {t("How to Query for Specific Data")}
        <h3>Primeros Pasos</h3>
        <div>
          DataChile utiliza para su funcionamiento como capa lógica
          Mondrian-REST, que es un componente del lado del servidor que permite
          la creación de APIs HTTP para acceder a una base de datos
          especificando la estructura lógica de la información.
        </div>
        <div className="def-text">
          Cut: permite al usuario especificar un filtro, que efectivamente
          restringe al XXXXX. Cortar el cubo en torno al miembro [Region].[8] en
          la dimensión Geography, sólo considerará celdas de la región de
          Bío-Bío. Múltiples cortes pueden ser especificados en una simple
          consulta.
        </div>
        <h3>Ejemplo de llamada de datos</h3>
        <div className="def-text">
          Aquí se muestra el aspecto de la URL y el JSON devuelto cuando se
          pregunta ¿Qué número de personas está en cada previsión de salud en
          Bío-Bío?
        </div>
        <div className="code">
          https://chilecube.datawheel.us//cubes/casen_health_system/aggregate.json?drilldown%5B%5D=%5BHealth+System%5D.%5BHealth+System%5D&cut%5B%5D=%5BGeography%5D.%5BComuna%5D.%26%5B64%5D&measures%5B%5D=Expansion+Factor+Comuna&caption%5B%5D=%5BHealth+System%5D.%5BHealth+System%5D.Description+ES&caption%5B%5D=%5BHealth+System%5D.%5BHealth+System+Group%5D.Description+ES&nonempty=true&distinct=false&parents=true&sparse=true
        </div>
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
        <h3>Campos</h3>
        <p>
          <table>
            <thead>
              <tr>
                <th className="field">{t("Field Name")}</th>
                <th>{t("Type")}</th>
                <th className="description">{t("Description")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>nonempty</td>
                <td>
                  <span className="code">boolean</span>
                </td>
                <td>x</td>
              </tr>
              <tr>
                <td>distinct</td>
                <td>
                  <span className="code">boolean</span>
                </td>
                <td>x</td>
              </tr>
              <tr>
                <td>parents</td>
                <td>
                  <span className="code">boolean</span>
                </td>
                <td>x</td>
              </tr>
              <tr>
                <td>sparse</td>
                <td>
                  <span className="code">boolean</span>
                </td>
                <td>x</td>
              </tr>
            </tbody>
          </table>
        </p>
        <h3>Cliente API para Python</h3>
        <p>
          Para fomentar el uso de la API de DataChile, hemos habilitado en
          Python un módulo que permite interactuar con todos los datos
          disponibles.
        </p>
        <p>
          Para instalar, debes usar:{" "}
          <span className="code">pip install datachile</span>
        </p>
        <pre>
          <code>
            {`
            from opendata_rest.datachile import DataChile 
            
            q = DataChile.get(
                "exports", { 
                    drilldowns: [
                        ["Date", "Year"], 
                        ["Destination Country", "Country", "Continent"]
                    ], 
                    measures: ["FOB US", "Geo Rank"],
                }
            ) 
            
            print(q)
            `}
          </code>
        </pre>
      </div>
    );
  }
}
export default translate()(Documentation);
