import styles from "style.yml";

const axisConfig = {
  barConfig: {
    stroke: styles.white,
    "stroke-width": 1
  },
  gridConfig: {
    stroke: "rgba(255,255,255,0.1)",
    "stroke-width": 0.5
  },
  shapeConfig: {
    fill: styles.white,
    labelConfig: {
      fontColor: styles["light-1"],
      fontFamily: () => "Roboto Condensed",
      fontMax: 18,
      fontMin: 12,
      // fontSize: () => 12,
      fontWeight: 300
    },
    stroke: styles.white
  },
  tickSize: 0, // death to ticks
  titleConfig: {
    fontFamily: () => "Roboto, sans-serif",
    fontColor: styles["light-1"]
    // fontSize: 12
    // fontWeight: 600,
    // textTransform: "uppercase"
  }
};

export default {
  // shape defaults
  shapeConfig: {
    fontColor: styles["near-black"],
    fontFamily: "Roboto Condensed",
    // fontSize: 12,
    fontWeight: 300,
    // textarea label defaults
    labelConfig: {
      fontFamily: () => "Roboto Condensed",
      fontWeight: 300,
      padding: 12,
      // fontSize: 12,
      fontMax: 18
    },
    // stacked area
    Area: {
      labelConfig: {
        fontColor: styles.white,
        fontFamily: () => "Roboto Condensed",
        fontMax: 16,
        fontWeight: 300
      }
    },
    // line charts
    Line: {
      curve: "monotoneX",
      strokeLinecap: "round",
      strokeWidth: 3
    }
  },
  // legend defaults
  legendConfig: {
    // labels are directly in the shape
    shapeConfig: {
      fontColor: styles["light-1"],
      fontFamily: "Roboto Condensed",
      fontResize: false,
      fontSize: 12,
      fontWeight: 300,
      height: () => 20,
      width: () => 20,
      // legend icons
      labelConfig: {
        fontColor: styles.white
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
    brushing: false,
    // handle
    handleConfig: {
      width: 9,
      fill: styles["accent-light"]
    },
    // main horizontal bar line
    barConfig: {
      stroke: styles.gray,
      opacity: 0.75
    },
    shapeConfig: {
      // ticks and/or button bg
      fill: styles.gray,
      stroke: "none",
      // label and/or button text
      labelConfig: {
        fontColor: styles.white
      }
    }
  },
  // total defaults
  totalConfig: {
    fontSize: 12,
    fontColor: styles["light-3"],
    resize: false,
    textAnchor: "left"
  },
  // axis defaults (see line 1)
  xConfig: axisConfig,
  yConfig: axisConfig
};
