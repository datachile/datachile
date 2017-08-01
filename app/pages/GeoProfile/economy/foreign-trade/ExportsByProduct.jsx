import React from "react";
import { SectionColumns, SectionTitle } from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";

import { ordinalColorScale } from "helpers/colors";
import { getGeoObject } from "helpers/dataUtils";
import { trade_by_time_and_product } from "helpers/i18n";

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
                            data: trade_by_time_and_product(
                                res.data.data,
                                "FOB US",
                                geo.type != "country"
                            )
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
            text_data.geo = this.context.data.geo;
            text_data.escapeInterpolation = true;

            return (
                <SectionColumns>
                    <SectionTitle>
                        {t("Exports By Product")}
                    </SectionTitle>
                    <article>
                        {t(
                            'In {{latest_year}}, <a href="#">{{geo.caption}}</a> exported <i>{{trade_volume}}</i>',
                            text_data
                        )}
                        {t(
                            "making it the {{rank}}th largest exporter in Chile",
                            text_data
                        )}
                        {t(
                            "During the last {{number_of_years}} years the exports of {{geo.caption}} have <i>{{increased_or_decreased}}</i> at an annualized rate of {{annualized_rate}}, from <i>{{trade_first_year}}</i> in {{first_year}} to <i>{{trade_last_year}}</i> in {{last_year}}",
                            text_data
                        )}
                        {t(
                            'The most recent exports are led by <a href="#">{{trade_first_product}}</a> which represent {{trade_first_share}} of the total exports of {{geo.caption}}, followed by <a href="#">{{trade_second_product}}</a>, which account for {{trade_second_share}}',
                            text_data
                        )}
                        {t(
                            "Top Exported Product in {{latest_year}}",
                            text_data
                        )}
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
