import styles from "style.yml";

const axisConfig = {
  barConfig: {
    stroke: styles.snow,
    "stroke-width": 1
  },
  gridConfig: {
    stroke: "rgba(255,255,255,0.1)",
    "stroke-width": 0.5
  },
  shapeConfig: {
    fill: styles.snow,
    labelConfig: {
      fontColor: styles.snow,
      fontFamily: () => "Roboto Condensed",
      fontMax: 18,
      fontSize: () => 12,
      fontWeight: 300
    },
    stroke: styles.snow
  },
  tickSize: 4,
  titleConfig: {
    fontFamily: () => "Roboto, sans-serif",
    fontColor: styles.snow,
    fontSize: 12
    //fontWeight: 600,
    // textTransform: "uppercase"
  }
};

export default {
  // shape defaults
  shapeConfig: {
    fontColor: styles["near-black"],
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
        fontColor: styles.snow,
        fontFamily: () => "Roboto Condensed",
        fontMax: 18,
        fontWeight: 300
      }
    },
    // line charts
    Line: {
      // curve: "catmullRom",
      strokeLinecap: "round"
    }
  },
  // legend defaults
  legendConfig: {
    // labels are directly in the shape
    shapeConfig: {
      fontColor: styles.snow,
      fontFamily: "Roboto Condensed",
      fontResize: false,
      fontSize: 12,
      fontWeight: 300,
      height: () => 20,
      width: () => 20,
      // legend icons
      labelConfig: {
        fontColor: styles.snow
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
    fontColor: styles.snow,
    resize: false,
    textAnchor: "left"
  },
  // axis defaults (see line 1)
  xConfig: axisConfig,
  yConfig: axisConfig
};
