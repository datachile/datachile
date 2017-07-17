import React from "react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from 'helpers/MondrianClient';
import { getGeoObject } from 'helpers/dataUtils';
import { ordinalColorScale } from 'helpers/colors';
import {translate} from "react-i18next";

export default translate()(class OutputByIndustry extends SectionColumns {

  static need = [
    (params,store) => {
      const geo = getGeoObject(params)
      const prm = mondrianClient
        .cube('tax_data')
        .then(cube => {
          var q = geoCut(geo,
                         'Tax Geography',
                         cube.query
                             .option('parents', true)
                             .drilldown('ISICrev4', 'Level 2')
                             .drilldown('Date', 'Year')
                             .measure('Output'),
                            store.i18n.locale);

          return mondrianClient.query(q, 'jsonrecords');
        })
        .then(res => ({ key: 'industry_output', data: res.data }));

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  render() {
    const data = this.context.data.industry_output.data;
    const {t} = this.props;
    return (
      <SectionColumns>
        <SectionTitle>{ t('Industry Output') }</SectionTitle>
        <article>Aliquam erat volutpat.  Nunc eleifend leo vitae magna.  In id erat non orci commodo lobortis.  Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus.  Sed diam.  Praesent fermentum tempor tellus.  Nullam tempus.  Mauris ac felis vel velit tristique imperdiet.  Donec at pede.  Etiam vel neque nec dui dignissim bibendum.  Vivamus id enim.  Phasellus neque orci, porta a, aliquet quis, semper a, massa.  Phasellus purus.  Pellentesque tristique imperdiet tortor.  Nam euismod tellus id erat.</article>
        <Treemap config={{
          height: 552,
          data: data,
          groupBy: ["ID Level 1", "ID Level 2"],
          label: d => d["Level 2"] instanceof Array ? d["Level 1"] : d["Level 2"],
          sum: d => d["Output"],
          time: 'ID Year',
          shapeConfig: {
            fill: d => ordinalColorScale(d['ID Level 1'])
          }
        }} />
      </SectionColumns>
    );
  }
})
