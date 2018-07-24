const axisConfig = {
  barConfig: {
    stroke: "#fff",
    "stroke-width": 1
  },
  gridConfig: {
    stroke: "rgba(255,255,255,0.1)",
    "stroke-width": 0.5
  },
  shapeConfig: {
    fill: "#fff",
    labelConfig: {
      fontColor: "#fff",
      fontFamily: () => "Roboto Condensed",
      fontMax: 18,
      fontSize: () => 12,
      fontWeight: 300
    },
    stroke: "#fff"
  },
  tickSize: 4,
  titleConfig: {
    fontFamily: () => "Roboto, sans-serif",
    fontColor: "#fff",
    fontSize: 12
    //fontWeight: 600,
    // textTransform: "uppercase"
  }
};

export default {
  // shape defaults
  shapeConfig: {
    fontColor: "rgba(0, 0, 0, 0.4)",
    fontFamily: "Roboto Condensed",
    fontSize: 12,
    fontWeight: 300,
    // textarea label defaults
    labelConfig: {
      fontFamily: () => "Roboto Condensed",
      fontWeight: 300,
      padding: 12,
      fontSize: 12,
      fontMax: 18
    },
    // stacked area
    Area: {
      labelConfig: {
        fontColor: "#fff",
        fontFamily: () => "Roboto Condensed",
        fontMax: 18,
        fontWeight: 300
      }
    }
  },
  // legend defaults
  legendConfig: {
    // labels are directly in the shape
    shapeConfig: {
      fontColor: "white",
      fontFamily: "Roboto Condensed",
      fontResize: false,
      fontSize: 12,
      fontWeight: 300,
      height: () => 20,
      width: () => 20,
      // legend icons
      labelConfig: {
        fontColor: "white"
      }
    }
  },
  // loading
  loadingHTML:
    "<div style='font-family: Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;'>" +
    "<img style='margin: auto; width:80px; height: 80px' src='/images/loading-visualization.gif' />" +
    "<sub style='display: block; margin-top: 15px;'>Powered by Datawheel</sub>" +
    "</div>",
  // timeline defaults
  timelineConfig: {
    brushing: false
  },
  // total defaults
  totalConfig: {
    fontSize: 12,
    fontColor: "#FFFFFF",
    resize: false,
    textAnchor: "left"
  },
  // axis defaults (see line 1)
  xConfig: axisConfig,
  yConfig: axisConfig
};
