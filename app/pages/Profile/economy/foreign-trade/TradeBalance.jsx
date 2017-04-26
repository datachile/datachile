import React from "react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import { LinePlot } from "d3plus-react";
import mondrianClient from 'helpers/MondrianClient';
import { GEO } from "helpers/GeoData";
import { ordinalColorScale } from 'helpers/colors';
import { melt } from 'helpers/dataUtils';

import {translate} from "react-i18next";

export default translate()(class TradeBalance extends SectionColumns {

  static need = [
    (params) => {
      const geo = GEO.getRegion(params.region);
      const prm = mondrianClient
        .cube('exports_and_imports')
        .then(cube => {
          return mondrianClient.query(
            cube.query
              .drilldown('Date', 'Year')
              .cut(`[Geography].[Region].&[${geo.key}]`)
              .measure('FOB')
              .measure('CIF')
              .measure('Trade Balance'),
            'jsonrecords')
        }
        )
        .then(res => {
          return {
            key: 'trade_balance',
            data: res.data.data
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

    render() {
        console.log("trade_balance", this.context.data);
        const data = melt(this.context.data.trade_balance,
                          ['ID Year'],
                          ['FOB', 'CIF', 'Trade Balance']);
    const {t} = this.props;
    return (
      <SectionColumns>
        <SectionTitle>{ t('Trade Balance') }</SectionTitle>
        <article>Aliquam erat volutpat.  Nunc eleifend leo vitae magna.  In id erat non orci commodo lobortis.  Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus.  Sed diam.  Praesent fermentum tempor tellus.  Nullam tempus.  Mauris ac felis vel velit tristique imperdiet.  Donec at pede.  Etiam vel neque nec dui dignissim bibendum.  Vivamus id enim.  Phasellus neque orci, porta a, aliquet quis, semper a, massa.  Phasellus purus.  Pellentesque tristique imperdiet tortor.  Nam euismod tellus id erat.</article>
        <LinePlot config={{
          data: data,
          groupBy: 'variable',
          x: 'ID Year',
          y: 'value'
        }} />

      </SectionColumns>
    );
  }
})
