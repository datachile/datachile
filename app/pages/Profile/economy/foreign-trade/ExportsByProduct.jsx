import React from "react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from 'helpers/MondrianClient';
import { GEO } from "helpers/GeoData";
import { ordinalColorScale } from 'helpers/colors';
import {translate} from "react-i18next";

export default translate()(class ExportsByProduct extends SectionColumns {

    static need = [
        (params) => {
            const geo = GEO.getGeo(params.region, params.comuna);
            const prm = mondrianClient
                .cube('exports')
                .then(cube => {
                    var q = geoCut(geo,
                                   'Geography',
                                   cube.query
                                       .option('parents', true)
                                       .drilldown('Export HS', 'HS2')
                                       .drilldown('Date', 'Year')
                                       .measure('FOB US'));

                    return mondrianClient.query(q, 'jsonrecords');
                })
                .then(res => ({ key: 'exports_product', data: res.data.data }));

            return {
                type: "GET_DATA",
                promise: prm
            };
        }
    ];

    render() {
        const {t} = this.props;
        const data = this.context.data.exports_product;
        return (
            <SectionColumns>
                <SectionTitle>{ t('Exports By Product') }</SectionTitle>
                <article>Aliquam erat volutpat.  Nunc eleifend leo vitae magna.  In id erat non orci commodo lobortis.  Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus.  Sed diam.  Praesent fermentum tempor tellus.  Nullam tempus.  Mauris ac felis vel velit tristique imperdiet.  Donec at pede.  Etiam vel neque nec dui dignissim bibendum.  Vivamus id enim.  Phasellus neque orci, porta a, aliquet quis, semper a, massa.  Phasellus purus.  Pellentesque tristique imperdiet tortor.  Nam euismod tellus id erat.</article>
                <Treemap config={{
                    height: 552,
                    data: data,
                    groupBy: ["ID HS0", "ID HS2"],
                    label: d => d["HS2"] instanceof Array ? d["HS0"] : d["HS2"],
                    sum: d => d["FOB US"],
                    time: 'ID Year',
                    shapeConfig: {
                        fill: d => ordinalColorScale(d['ID HS0'])
                    }
                }} />

            </SectionColumns>
        );
    }
})
