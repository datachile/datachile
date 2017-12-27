import React, { Component } from "react";
//import _ from "lodash";
import keyBy from "lodash/keyBy";
import { connect } from "react-redux";
import { Link, browserHistory } from "react-router";
import { translate } from "react-i18next";
import { request as d3Request } from "d3-request";
import { select, selectAll } from "d3-selection";
import { sources } from "helpers/consts";

import { numeral, slugifyItem } from "helpers/formatters";
import mondrianClient, { setLangCaptions } from "helpers/MondrianClient";
import SVGCache from "helpers/svg";

import "./DynamicHomeHeader.css";

class DynamicHomeHeader extends Component {
  static need = [
    (params, store) => {
      const prm = mondrianClient
        .cube("population_estimate")
        .then(cube => {
          var q = setLangCaptions(
            cube.query
              .option("parents", true)
              .drilldown("Date", "Year")
              .drilldown("Geography", "Geography", "Region")
              .measure("Population")
              .cut(`[Date].[Year].&[${sources.population_estimate.year}]`),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "home_geo_population",
            data: keyBy(res.data.data, function(o) {
              return "geo_" + o["ID Region"];
            })
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = setLangCaptions(
            cube.query
              .option("parents", true)
              .drilldown("Destination Country", "Country", "Country")
              .drilldown("Date", "Date", "Year")
              .measure("FOB US")
              .cut(`[Date].[Year].&[${sources.exports.year}]`)
              .cut(
                "{[Destination Country].[Country].[Country].&[202],[Destination Country].[Country].[Country].&[219],[Destination Country].[Country].[Country].&[208],[Destination Country].[Country].[Country].&[201],[Destination Country].[Country].[Country].&[216],[Destination Country].[Country].[Country].&[505],[Destination Country].[Country].[Country].&[112],[Destination Country].[Country].[Country].&[406],[Destination Country].[Country].[Country].&[502],[Destination Country].[Country].[Country].&[220],[Destination Country].[Country].[Country].&[225],[Destination Country].[Country].[Country].&[336]}"
              ),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "home_countries_export",
            data: keyBy(res.data.data, function(o) {
              return "countries_" + o["ID Country"];
            })
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const prm = mondrianClient
        .cube("education_employability")
        .then(cube => {
          var q = setLangCaptions(
            cube.query
              .option("parents", true)
              .drilldown(
                "Higher Institutions",
                "Higher Institutions",
                "Higher Institution"
              )
              .measure("Number of records")
              .measure("Avg employability 1st year")
              .cut(
                "{[Higher Institutions].[Higher Institutions].[Higher Institution].&[97],[Higher Institutions].[Higher Institutions].[Higher Institution].&[73],[Higher Institutions].[Higher Institutions].[Higher Institution].&[75],[Higher Institutions].[Higher Institutions].[Higher Institution].&[96]}"
              ),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "home_institutions_employability",
            data: keyBy(res.data.data, function(o) {
              return "institutions_" + o["ID Higher Institution"];
            })
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const prm = mondrianClient
        .cube("education_employability")
        .then(cube => {
          var q = setLangCaptions(
            cube.query
              .option("parents", true)
              .drilldown("Careers", "Careers", "Career")
              .measure("Number of records")
              .measure("Avg anual payment 2016")
              .cut(
                "{[Careers].[Careers].[Career].&[63],[Careers].[Careers].[Career].&[26],[Careers].[Careers].[Career].&[47],[Careers].[Careers].[Career].&[280],[Careers].[Careers].[Career].&[76],[Careers].[Careers].[Career].&[68],[Careers].[Careers].[Career].&[205],[Careers].[Careers].[Career].&[18],[Careers].[Careers].[Career].&[100]}"
              ),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "home_careers_employability",
            data: keyBy(res.data.data, function(o) {
              return "careers_" + o["ID Career"];
            })
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const prm = mondrianClient
        .cube("exports")
        .then(cube => {
          var q = setLangCaptions(
            cube.query
              .option("parents", true)
              .drilldown("Export HS", "HS", "HS2")
              .drilldown("Date", "Date", "Year")
              .measure("FOB US")
              .cut(`[Date].[Year].&[${sources.exports.year}]`)
              .cut(
                "{[Export HS].[HS].[HS2].&[052501],[Export HS].[HS].[HS2].&[020814],[Export HS].[HS].[HS2].&[157403],[Export HS].[HS].[HS2].&[031509],[Export HS].[HS].[HS2].&[010305],[Export HS].[HS].[HS2].&[020806],[Export HS].[HS].[HS2].&[042204],[Export HS].[HS].[HS2].&[021104],[Export HS].[HS].[HS2].&[052710],[Export HS].[HS].[HS2].&[084404],[Export HS].[HS].[HS2].&[010201],[Export HS].[HS].[HS2].&[010401],[Export HS].[HS].[HS2].&[020808],[Export HS].[HS].[HS2].&[104811],[Export HS].[HS].[HS2].&[021212],[Export HS].[HS].[HS2].&[052711],[Export HS].[HS].[HS2].&[115101]}"
              ),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "home_product_exports",
            data: keyBy(res.data.data, function(o) {
              return "products_" + o["ID HS2"];
            })
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    },
    (params, store) => {
      const prm = mondrianClient
        .cube("tax_data")
        .then(cube => {
          var q = setLangCaptions(
            cube.query
              .option("parents", true)
              .drilldown("ISICrev4", "ISICrev4", "Level 1")
              .drilldown("Date", "Date", "Year")
              .measure("Output")
              .cut(`[Date].[Year].&[${sources.tax_data.year}]`),
            store.i18n.locale
          );

          return mondrianClient.query(q, "jsonrecords");
        })
        .then(res => {
          return {
            key: "home_industries_tax_data",
            data: keyBy(res.data.data, function(o) {
              return "industries_" + o["ID Level 1"];
            })
          };
        });

      return {
        type: "GET_DATA",
        promise: prm
      };
    }
  ];

  constructor(props) {
    super(props);
    this.cache = SVGCache.instance;
    this.state = {
      illustration: ""
    };
  }

  callbackSvg = (error, response, src) => {
    const { header, data } = this.props;
    var xml = response.responseText ? response.responseText : response;
    var that = this;

    if (!xml.startsWith("<?xml")) {
      this.setState({ illustration: "Error loading SVG" });
      console.error("Error loading " + src);
      return;
    }

    this.cache.setSvg(src, xml);
    this.setState({ illustration: xml }, () => {
      if (typeof document != "undefined") {
        select(".dynamic-home-image")
          .transition()
          .duration(500)
          .style("opacity", 1);

        var div = select("#tooltip-home");

        function getCoords(x, y) {
          const w = window.innerWidth,
            imgW = 1366,
            imgH = 241;
          const h = imgH * w / imgW;

          return [x * w / imgW, y * h / imgH];
        }

        selectAll(".dynamic-home-hotspots g.hotspot")
          .on("mouseover", function(d) {
            var hotspot = select(this);
            var region_id = hotspot.attr("id");
            var elem = hotspot.select("circle.st0");
            var coords = getCoords(elem.attr("cx"), elem.attr("cy"));

            div
              .transition()
              .duration(200)
              .style("opacity", 1);
            div
              .style("left", coords[0] - 75 + "px")
              .style("top", coords[1] + 9 + "px");

            const name = that.getTooltipName(region_id);
            div.select(".tooltip-title").html(name);

            const data_collection = that.getTooltipData(region_id);
            div
              .select(".tooltip-body")
              .html(
                data_collection
                  .map(
                    d =>
                      "<div class='tooltip-data-value color-" +
                      that.props.header.slug +
                      "'>" +
                      d.value +
                      "</div><div class='tooltip-data-title'>" +
                      d.title +
                      "</div>"
                  )
                  .join("")
              );
          })
          .on("mouseout", function(d) {
            div
              .transition()
              .duration(500)
              .style("opacity", 0);
          })
          .on("click", function(d) {
            const id = select(this).attr("id");

            if (id === null) {
              console.error("No attribute 'id' on svg file");
            } else {
              var url = that.getTooltipUrl(id);
              if (url) {
                browserHistory.push(url);
              }
            }
          });
      }
    });
  };

  getTooltipName(id) {
    const { t, header, data } = this.props;
    var name = "";

    console.log(header.slug, id);

    switch (header.slug) {
      case "geo":
        name = data.home_geo_population["geo_" + id].Region;
        break;
      case "countries":
        name = data.home_countries_export["countries_" + id]["Country"];
        break;
      case "institutions":
        name =
          data.home_institutions_employability["institutions_" + id][
            "Higher Institution"
          ];
        break;
      case "careers":
        name = data.home_careers_employability["careers_" + id]["Career"];
        break;
      case "products":
        name = data.home_product_exports["products_" + id]["HS2"];
        break;
      case "industries":
        name = data.home_industries_tax_data["industries_" + id]["Level 1"];
        break;
    }
    return name;
  }

  getTooltipData(id) {
    const { t, header, data, i18n } = this.props;
    const locale = i18n.language;

    console.log(header.slug, id);

    var datas = [];
    switch (header.slug) {
      case "geo":
        var obj = data.home_geo_population[header.slug + "_" + id];

        datas.push({
          title: t("Estimate Population") + " " + obj["Year"],
          value: numeral(obj.Population, locale).format("(0,0)") + " hab."
        });
        break;
      case "countries":
        var obj = data.home_countries_export[header.slug + "_" + id];
        datas.push({
          title: t("Imports from Chile") + " " + obj["Year"],
          value: numeral(obj["FOB US"], locale).format("($ 0.00 a)")
        });
        break;
      case "institutions":
        var obj = data.home_institutions_employability[header.slug + "_" + id];
        datas.push({
          title: t("Employability 1st Year"),
          value: numeral(obj["Avg employability 1st year"], locale).format(
            "0.00%"
          )
        });
        break;
      case "careers":
        var obj = data.home_careers_employability[header.slug + "_" + id];
        datas.push({
          title: t("Avg anual payment 2016"),
          value: numeral(obj["Avg anual payment 2016"], locale).format(
            "($ 0,0)"
          )
        });
        break;
      case "products":
        var obj = data.home_product_exports[header.slug + "_" + id];
        datas.push({
          title: t("Chile Exports") + " " + obj["Year"],
          value: numeral(obj["FOB US"], locale).format("($ 0.00 a)")
        });
        break;
      case "industries":
        var obj = data.home_industries_tax_data[header.slug + "_" + id];
        datas.push({
          title: t("Industry output") + " " + obj["Year"],
          value: numeral(obj["Output"], locale).format("($ 0.00 a)")
        });
        break;
    }
    return datas;
  }

  getTooltipUrl(id) {
    const { header, data } = this.props;

    var url = null;
    switch (header.slug) {
      case "geo":
        var obj = data.home_geo_population[header.slug + "_" + id];
        url = slugifyItem("geo", id, this.getTooltipName(id));
        break;
      case "countries":
        var obj = data.home_countries_export[header.slug + "_" + id];
        url = slugifyItem(
          "countries",
          obj["ID Subregion"],
          obj["Subregion"],
          id,
          this.getTooltipName(id)
        );
        break;
      case "institutions":
        var obj = data.home_institutions_employability[header.slug + "_" + id];
        url = slugifyItem(
          "institutions",
          obj["ID Higher Institution Subgroup"],
          obj["Higher Institution Subgroup"],
          id,
          this.getTooltipName(id)
        );
        break;
      case "careers":
        var obj = data.home_careers_employability[header.slug + "_" + id];
        url = slugifyItem(
          "careers",
          obj["ID Career Group"],
          obj["Career Group"],
          id,
          this.getTooltipName(id)
        );
        break;
      case "products":
        var obj = data.home_product_exports[header.slug + "_" + id];
        url = slugifyItem(
          "products",
          obj["ID HS0"],
          obj["HS0"],
          id,
          this.getTooltipName(id)
        );
        break;
      case "industries":
        var obj = data.home_industries_tax_data[header.slug + "_" + id];
        url = slugifyItem("industries", id, this.getTooltipName(id));
        break;
    }
    return url;
  }

  componentWillMount() {
    this.loadHeader(this.props.header);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.header) {
      this.loadHeader(nextProps.header);
    }
  }

  loadHeader(header) {
    if (typeof document != "undefined" && header) {
      const src = "/images/home/hotspots/" + header.slug + ".svg";
      const cb = this.callbackSvg;
      var cached = this.cache.getSvg(src);
      /*select(".dynamic-home-hotspots")
        .transition()
        .duration(500)
        .style("opacity", 0);*/
      select(".dynamic-home-image")
        .transition()
        .duration(500)
        .style("opacity", 0);
      if (cached) {
        cb(false, cached, src);
      } else {
        d3Request(src)
          .on("error", function(error) {
            console.error(error);
          })
          .get(src, function(error, response) {
            cb(error, response, src);
          });
      }
    }
  }

  render() {
    const { t, header } = this.props;

    return (
      <div className="dynamic-home-header">
        <div className="dynamic-home-explore-btn">
          <Link
            className={`explore-btn background-${header.slug}`}
            to={`${header.available ? "/explore/" + header.slug : ""}`}
          >
            <span>{header.available ? "Explore profiles" : t("Soon")}</span>
            {header.available && (
              <span className="pt-icon-standard pt-icon-chevron-right" />
            )}
          </Link>
        </div>
        <div className="dynamic-home-illustration">
          <div id="tooltip-home">
            <div className={`tooltip-title background-${header.slug}`} />
            <div className={`tooltip-body`} />
          </div>
          <div id="mountains-home">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1960 281">
              <path
                className="back"
                d="M1.4 282.6L0 82l154.6 60 267.9-82 485.7 64 261-64 360.2 41L1966 .3l-2.1 279.3"
                style={{ fill: header.colors[1] }}
              />
              <path
                className="front"
                d="M.7 283.6L0 224.4l66.2-61.2 185.4 73.5 201.6-110.5 282.7 137.1 267.7-120.6 156.8 32 198.1-60.6 144.3 24.6L1778.6 59 1959 229.6l.1 51"
                style={{ fill: header.colors[0] }}
              />
            </svg>
          </div>
          <div
            className="dynamic-home-block"
            style={{ backgroundColor: header.colors[2] }}
          />
          {header && (
            <div className={`dynamic-home-items illustration-${header.slug}`}>
              {header.available && (
                <div
                  className="dynamic-home-hotspots"
                  dangerouslySetInnerHTML={{ __html: this.state.illustration }}
                />
              )}
              <div className={`dynamic-home-image`}>
                <img src={`/images/home/headers/${header.slug}.png`} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default translate()(
  connect(
    state => ({
      data: state.data
    }),
    {}
  )(DynamicHomeHeader)
);
