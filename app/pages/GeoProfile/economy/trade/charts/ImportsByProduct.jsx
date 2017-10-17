import React from "react";
import { Section } from "datawheel-canon";
import { Treemap } from "d3plus-react";
import { translate } from "react-i18next";

import mondrianClient, { geoCut } from "helpers/MondrianClient";
import { numeral } from "helpers/formatters";
import { ordinalColorScale } from "helpers/colors";
import { getGeoObject } from "helpers/dataUtils";
import { trade_by_time_and_product } from "helpers/aggregations";

export default translate()(
    class ImportsByProduct extends Section {
        static need = [
            (params, store) => {
                const geo = getGeoObject(params);

                const prm = mondrianClient.cube("imports").then(cube => {
                    var q = geoCut(
                        geo,
                        "Geography",
                        cube.query
                            .option("parents", true)
                            .drilldown("Import HS", "HS2")
                            .drilldown("Date", "Year")
                            .measure("CIF US"),
                        store.i18n.locale
                    );

                    return {
                        key: "path_imports_by_product",
                        data: store.env.CANON_API + q.path("jsonrecords")
                    };
                });

                return {
                    type: "GET_DATA",
                    promise: prm
                };
            }
        ];

        render() {
            const { t, className, i18n } = this.props;
            const locale = i18n.language.split("-")[0];
            const path = this.context.data.path_imports_by_product;

            return (
                <div className={className}>
                    <h3 className="chart-title">{t("Imports By Product")}</h3>
                    <Treemap
                        config={{
                            height: 500,
                            data: path,
                            groupBy: ["ID HS0", "ID HS2"],
                            label: d =>
                                d["HS2"] instanceof Array ? d["HS0"] : d["HS2"],
                            sum: d => d["CIF US"],
                            time: "ID Year",
                            legendConfig: {
                                label: false,
                                shapeConfig: {
                                    width: 25,
                                    height: 25,
                                    fill: d => ordinalColorScale(d["ID HS0"]),
                                    backgroundImage: d =>
                                        "/images/legend/hs/hs_" +
                                        d["ID HS0"] +
                                        ".png"
                                }
                            },
                            shapeConfig: {
                                fill: d => ordinalColorScale(d["ID HS0"])
                            },
                            tooltipConfig: {
                                title: d =>
                                    d["HS2"] instanceof Array
                                        ? d["HS0"]
                                        : d["HS2"],
                                body: d =>
                                    numeral(d["CIF US"], locale).format(
                                        "(USD 0 a)"
                                    ) +
                                    "<br/><a>" +
                                    t("tooltip.to_profile") +
                                    "</a>"
                            }
                        }}
                        dataFormat={data => data.data}
                    />
                </div>
            );
        }
    }
);
