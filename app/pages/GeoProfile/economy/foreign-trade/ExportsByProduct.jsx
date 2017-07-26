import React from "react";
import { SectionColumns, SectionTitle } from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";

import { ordinalColorScale } from "helpers/colors";
import { getGeoObject } from "helpers/dataUtils";
import { translate } from "react-i18next";

export default translate()(
    class ExportsByProduct extends SectionColumns {
        static need = [
            (params, store) => {
                const geo = getGeoObject(params);

                const prm = mondrianClient.cube("exports").then(cube => {
                    var q = geoCut(
                        geo,
                        "Geography",
                        cube.query
                            .option("parents", true)
                            .drilldown("Export HS", "HS2")
                            .drilldown("Date", "Year")
                            .measure("FOB US"),
                        store.i18n.locale
                    );

                    return {
                        key: "path_exports_by_product",
                        data: "http://localhost:9292" + q.path("jsonrecords")
                    };
                });

                return {
                    type: "GET_DATA",
                    promise: prm
                };
            },
            (params, store) => {
                const geo = getGeoObject(params);
                const prm = mondrianClient
                    .cube("exports")
                    .then(cube => {
                        var q = geoCut(
                            geo,
                            "Geography",
                            cube.query
                                .drilldown("Date", "Year")
                                .drilldown("Export HS", "HS2")
                                .measure("FOB US")
                                .measure("Geo Rank Across Time"),
                            store.i18n.locale
                        );

                        return mondrianClient.query(q, "jsonrecords");
                    })
                    .then(res => {
                        return {
                            key: "text_data_exports_by_product",
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
            const { t } = this.props;
            const path = this.context.data.path_exports_by_product;

            const text_data = this.context.data.text_data_exports_by_product;

            const textgen = {
                dato: text_data.length
            };

            return (
                <SectionColumns>
                    <SectionTitle>
                        {t("Exports By Product")}
                    </SectionTitle>
                    <article>
                        {t("English text with param {{dato}}", textgen)}
                    </article>
                    <Treemap
                        config={{
                            height: 552,
                            data: path,
                            groupBy: ["ID HS0", "ID HS2"],
                            label: d =>
                                d["HS2"] instanceof Array ? d["HS0"] : d["HS2"],
                            sum: d => d["FOB US"],
                            time: "ID Year",
                            shapeConfig: {
                                fill: d => ordinalColorScale(d["ID HS0"])
                            }
                        }}
                        dataFormat={data => data.data}
                    />
                </SectionColumns>
            );
        }
    }
);
