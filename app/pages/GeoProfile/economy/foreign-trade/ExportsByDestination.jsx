import React from "react";
import { SectionColumns, SectionTitle } from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from 'helpers/MondrianClient';
import { getGeoObject } from 'helpers/dataUtils';
import { translate } from "react-i18next";

export default translate()(class ExportsByDestination extends SectionColumns {

  static need = [
    (params,store) => {
      const geo = getGeoObject(params)
      const prm = mondrianClient
        .cube('exports')
        .then(cube => {
          var q = geoCut(geo,
            'Geography',
            cube.query
              .option('parents', true)
              .drilldown('Destination Country', 'Country')
              .drilldown('Date', 'Year')
              .measure('FOB US'),
            store.i18n.locale);
          return mondrianClient.query(q, 'jsonrecords');
        })
        .then(res => ({ key: 'exports_country', data: res.data.data }));

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const { t } = this.props;

    const data = this.context.data.exports_country;
    return (
      <SectionColumns>
                <SectionTitle>{ t('Exports By Destination') }</SectionTitle>
                <article>Aliquam erat volutpat.  Nunc eleifend leo vitae magna.  In id erat non orci commodo lobortis.  Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus.  Sed diam.  Praesent fermentum tempor tellus.  Nullam tempus.  Mauris ac felis vel velit tristique imperdiet.  Donec at pede.  Etiam vel neque nec dui dignissim bibendum.  Vivamus id enim.  Phasellus neque orci, porta a, aliquet quis, semper a, massa.  Phasellus purus.  Pellentesque tristique imperdiet tortor.  Nam euismod tellus id erat.</article>
                <Treemap config={{
                    height: 552,
                    data: data,
                    groupBy: ["ID Region", "ID Country"],
                    label: d => d["Country"] instanceof Array ? d["Region"] : d["Country"],
                    sum: d => d["FOB US"],
                    time: 'ID Year'
                }} />
            </SectionColumns>
    );
  }
})
