import React from "react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient from 'helpers/MondrianClient';
import { GEO } from "helpers/dictionary";

export default class ImportsByOrigin extends SectionColumns {

    static need = [
        (params) => {
            const geo = GEO.getRegion(params.region);
            const prm = mondrianClient
                .cube('imports')
                .then(cube => 
                    mondrianClient.query(
                        cube.query
                            .option('parents', true)
                            .drilldown('Origin Country', 'Country')
                            .drilldown('Date', 'Year')
                            .cut(`[Geography].[Region].&[${geo.key}]`)
                            .measure('CIF US'),
                        'jsonrecords')
                )
                .then(res => ({ key: 'imports_origin', data: res.data }));

            return {
                type: "GET_DATA",
                promise: prm
            };
        }
    ];

    render() {
        const data = this.context.data.imports_origin.data;
        return (
            <SectionColumns>
                <SectionTitle>Imports by Origin Country</SectionTitle>
                <article>Aliquam erat volutpat.  Nunc eleifend leo vitae magna.  In id erat non orci commodo lobortis.  Proin neque massa, cursus ut, gravida ut, lobortis eget, lacus.  Sed diam.  Praesent fermentum tempor tellus.  Nullam tempus.  Mauris ac felis vel velit tristique imperdiet.  Donec at pede.  Etiam vel neque nec dui dignissim bibendum.  Vivamus id enim.  Phasellus neque orci, porta a, aliquet quis, semper a, massa.  Phasellus purus.  Pellentesque tristique imperdiet tortor.  Nam euismod tellus id erat.</article>
                <Treemap config={{
                    height: 552,
                    data: data,
                    groupBy: ["ID Region", "ID Country"],
                    label: d => d["Country"] instanceof Array ? d["Region"] : d["Country"],
                    sum: d => d["CIF US"],
                    time: 'ID Year'
                }} />
            </SectionColumns>
        );
    }
}
