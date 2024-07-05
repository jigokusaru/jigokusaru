export var bar = new ProgressBar.Line("#progress", {
  strokeWidth: 4,
  easing: "easeInOut",
  duration: 2800,
  color: "#FF0000", // Fill color is red
  trailColor: "transparent", // Empty part of the bar is transparent
  trailWidth: 1,
  svgStyle: { width: "100%", height: "100%" },
  text: {
    style: null, // No text
  },
  step: (state, bar) => {
    let progress = bar.value();
    if (progress <= 0.2) {
      bar.path.setAttribute("stroke", "red");
    } else if (progress > 0.2 && progress <= 0.5) {
      bar.path.setAttribute("stroke", "yellow");
    } else {
      bar.path.setAttribute("stroke", "green");
    }
  },
});
