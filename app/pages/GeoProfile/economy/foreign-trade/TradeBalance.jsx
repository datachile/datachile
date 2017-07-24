import React from "react";
import { SectionColumns, SectionTitle } from "datawheel-canon";

import { LinePlot } from "d3plus-react";
import mondrianClient, { geoCut } from 'helpers/MondrianClient';

import { ordinalColorScale } from 'helpers/colors';
import { melt,getGeoObject } from 'helpers/dataUtils';

import { translate } from "react-i18next";

export default translate()(class TradeBalance extends SectionColumns {

  static need = [
    (params,store) => {
      const geo = getGeoObject(params)
      const prm = mondrianClient
        .cube('exports_and_imports')
        .then(cube => {
          var q = geoCut(geo,
            'Geography',
            cube.query
              .drilldown('Date', 'Year')
              .measure('FOB')
              .measure('CIF')
              .measure('Trade Balance'),
            store.i18n.locale);

          return { key: 'path_trade_balance', data: 'http://localhost:9292'+q.path('jsonrecords') };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { t } = this.props;
    const path = this.context.data.path_trade_balance;

    return (
      <SectionColumns>
        <SectionTitle>{ t('Trade Balance') }</SectionTitle>
        <article>Aliquam erat volutpat.  Nunc eleifend leo vitae magna.  In id erat non orci commodo lobortis.  Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus.  Sed diam.  Praesent fermentum tempor tellus.  Nullam tempus.  Mauris ac felis vel velit tristique imperdiet.  Donec at pede.  Etiam vel neque nec dui dignissim bibendum.  Vivamus id enim.  Phasellus neque orci, porta a, aliquet quis, semper a, massa.  Phasellus purus.  Pellentesque tristique imperdiet tortor.  Nam euismod tellus id erat.</article>
        <LinePlot config={{
          data: path,
          groupBy: 'variable',
          x: 'ID Year',
          y: 'value'
        }} 
        dataFormat={ (data) => melt(data.data, ['ID Year'], ['FOB', 'CIF', 'Trade Balance']) }/>

      </SectionColumns>
    );
  }
})
