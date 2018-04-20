[Volver al índice](general.md)

# Detalles sobre D3Plus - React

## Introducción

[D3.js](https://d3js.org/) es una librería JavaScript para manipular documentos basados en datos. D3 ayuda a representar datos usando HTML, SVG y CSS.

Basándose en esta librería, D3plus es una librería creada por Datawheel para aprovechar el conjunto de características de D3. Al mismo tiempo que proporciona una barrera de entrada bastante más baja a los usuarios, levantando el nivel de productividad.

## D3Plus React

Una de las principales ventajas de d3plus por sobre otra librería, es la posibilidad de utilizar `d3plus-react`, que entrega todas las visualizaciones de d3plus en forma de componentes React.

Por ejemplo:

```JSX
import {Treemap} from "d3plus-react";

const config = {
  groupBy: "region",
  data: [
    {region: "Biobío", value: 29, year: 2017},
    {region: "Metropolitana",  value: 10, year: 2017},
    {region: "Valparaiso",  value: 6, year: 2017},
    {region: "Biobío", value: 31, year: 2016},
    {region: "Metropolitana",  value: 12, year: 2016},
    {region: "Valparaiso",  value: 9, year: 2016}
  ],
  size: d => d.value,
  time: "year"
};

<Treemap config={config} />
```

Más detalles de `d3plus-react` en [Github](https://github.com/d3plus/d3plus-react/)
Más detalles de la documentación de `d3plus` en [Docs](http://d3plus.org/docs/)

## Utilización en Datachile

Todas las visualizaciones en Datachile están realizadas con `D3Plus` y `D3PlusReact`.

* Lines
* Stacked Areas
* Bars
* Stacked Bars
* Treemap
* Scatter Plots
