import React from "react";
import { Section } from "datawheel-canon";

import { Treemap } from "d3plus-react";
import mondrianClient, { geoCut } from "helpers/MondrianClient";

import { ordinalColorScale } from "helpers/colors";
import { getGeoObject } from "helpers/dataUtils";
import { trade_by_time_and_product } from "helpers/aggregations";

import { translate } from "react-i18next";

export default translate()(
    class ExportsByProduct extends Section {
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
            }
        ];

        render() {
            const { t } = this.props;

            const path = this.context.data.path_exports_by_product;

            return (
                <div className="lost-1-2">
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
                </div>
            );
        }
    }
);
