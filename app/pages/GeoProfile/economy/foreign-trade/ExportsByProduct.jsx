import React from "react";
import { SectionColumns, SectionTitle } from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";

import { ordinalColorScale } from "helpers/colors";
import { getGeoObject } from "helpers/dataUtils";
import { trade_by_time_and_product } from "helpers/aggregations";

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
                        const result = trade_by_time_and_product(
                            res.data.data,
                            "FOB US",
                            geo.type != "country",
                            store.i18n.locale
                        );
                        return {
                            key: "text_data_exports_by_product",
                            data: result
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
            if (text_data) {
                text_data.geo = this.context.data.geo;
                text_data.increased_or_decreased = t(
                    text_data.increased_or_decreased
                );
            }
            console.log("DATA FINAL", text_data);

            return (
                <SectionColumns>
                    <SectionTitle>
                        {t("export_by_product.title")}
                    </SectionTitle>
                    <article>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: t("export_by_product.line1", text_data)
                            }}
                        />
                        <div
                            dangerouslySetInnerHTML={{
                                __html: t("export_by_product.line2", text_data)
                            }}
                        />
                        <div
                            dangerouslySetInnerHTML={{
                                __html: t("export_by_product.line3", text_data)
                            }}
                        />
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
