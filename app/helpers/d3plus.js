const axisConfig = {
  barConfig: {
    stroke: "#fff",
    "stroke-width": 1
  },
  gridConfig: {
    stroke: "#fff",
    "stroke-width": 0
  },
  shapeConfig: {
    fill: "#fff",
    labelConfig: {
      fontColor: "#fff",
      fontFamily: () => "'Yantramanav', sans-serif",
      fontSize: () => 12
    },
    stroke: "#fff"
  },
  tickSize: 4,
  titleConfig: {
    fontFamily: () => "'Yantramanav', sans-serif",
    fontColor: "#fff",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase"
  }
};

export default {
  legendConfig: {
    shapeConfig: {
      fontColor: "white",
      fontFamily: "'Yantramanav', sans-serif",
      fontResize: false,
      fontSize: 12,
      fontWeight: 400,
      height: () => 20,
      textTransform: "uppercase",
      width: () => 20,
      labelConfig: {
        fontColor: "white"
      }
    }
  },
  shapeConfig: {
    fontColor: "rgba(0, 0, 0, 0.4)",
    fontFamily: "'Yantramanav', sans-serif",
    fontWeight: 600
  },
  timelineConfig: {
    brushing: false
  },
  totalConfig: {
    fontSize: 16,
    fontColor: "#FFFFFF",
    resize: false,
    textAnchor: "middle"
  },
  xConfig: axisConfig,
  yConfig: axisConfig
};
