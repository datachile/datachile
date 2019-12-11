[Volver al índice](general.md)

# Detalles sobre perfiles

## Primeros Pasos
La filosofía detrás de Datachile es "contar historias a partir de los datos públicos". Para mostrar los datos almacenados, se sugiere seguir el formato de "Perfiles", que son representaciones de Entidades. 

Actualmente Datachile posee cuatro perfiles:
* Geográfico
* Países
* Productos
* Industrias

Cada perfil puede contar con más de un nivel jerárquico de agregación, que permite interactuar con ellos. Por ejemplo, en el caso del perfil geográfico cuenta con 3 niveles jerárquicos: país, región, comuna, donde la lógica de estos niveles es que el nivel padre es el resultado de la agregación de todos los niveles hijos.

## Crear un perfil
Suponiendo que se desea crear un nuevo perfil de Proveedores para visualizar en Datachile, revisaremos los pasos necesarios para hacer funcional este perfil. 

### Crear entorno del Perfil
En `app/pages`, crea una carpeta para almacenar el contenido del nuevo perfil. Hasta ahora, el formato de los perfiles anteriores sigue la lógica: Nombre de Entidad en Singular (Inglés) seguido de Profile. Bajo esta premisa, para nuestro ejemplo la carpeta se debiese llamar `InstitutionProfile`.

#### Index
Dentro de la carpeta, debes crear el archivo `index.jsx`, que será el esqueleto del perfil. 

```JSX
import React, { Component } from "react";
import { connect } from "react-redux";
import { SectionColumns, Canon, CanonProfile } from "datawheel-canon";
import { withNamespaces } from "react-i18next";

// Employment Topic
import EmploymentSlide from "./employment/EmploymentSlide";
import EmployabilityByProgram from "./employment/charts/EmployabilityByProgram";

// Education Topic
import EducationSlide from "./education/EducationSlide";
import EducationBySex from "./education/charts/EducationBySex";

import "../intro.css";
import "../topics.css";

class InstitutionProfile extends Component {
  static need = [
    EmploymentSlide,
    EmployabilityByProgram,
    EducationSlide,
    EducationBySex
  ];

  const topics = [
    {
      slug: "employment",
      title: t("Employment")
    },
    {
      slug: "education",
      title: t("Education")
    }
  ];

  render(){
    return (
      <Canon>
        <CanonProfile data={this.props.data} topics={topics}>
          <Topic
            name={t("Employment")}
            id="employment"
            sections={[
              {
                name: t(""),
                slides: [t("")]
              }
            ]}
          >
            <div>
              <EmploymentSlide>
                <SectionColumns>
                  <EmployabilityByProgram className="lost-1" />
                </SectionColumns>
              </EmploymentSlide>
            </div>
          </Topic>

          <Topic
            name={t("Education")}
            id="education"
            sections={[
              {
                name: t(""),
                slides: [t("")]
              }
            ]}
          >
            <div>
              <EducationSlide>
                <SectionColumns>
                  <EducationBySex className="lost-1" />
                </SectionColumns>
              </EducationSlide>
            </div>
          </Topic>
        </CanonProfile>
      </Canon>
    )
  }
}

export default withNamespaces()(
  connect(
    state => ({
      data: state.data,
      focus: state.focus,
      stats: state.stats
    }),
    {}
  )(InstitutionProfile)
);
```

Como habrás notado, en `render` se encuentra `<Canon></Canon>`, que es la máscara de `datawheel-canon` para los perfiles. Dentro de `Canon` debe ir la etiqueta `<CanonProfile />`, que permite manipular los datos cargados en el `need` y además añadirle los tópicos.

Tanto Slides y Charts deben ir cargados en el `need` para ser utilizados dentro del perfil.

#### Secciones
Cada perfil se compone de secciones o tópicos, sobre los cuáles se agrupan los diversos temas que convergen en torno a la misma entidad. Se crea una carpeta para cada sección, la cuál tendrá en su contenido los distintos Slides relacionados, y una carpeta llamada `charts`, donde se almacenan los gráficos.
