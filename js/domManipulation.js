// domManipulation.js
function formatOption(option) {
  if (!option.id) {
    return option.text;
  }
  var $option = $(
    '<img src="images/' +
      option.element.value.toLowerCase() +
      '.png" class="img-flag gender"/>'
  );
  return $option;
}

function handleInputEvents(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("input", function (e) {
      var max = parseInt(e.target.max);
      var min = parseInt(e.target.min);
      var value = parseInt(e.target.value);

      if (value > max) {
        e.target.value = max;
      }
      if (value < min) {
        e.target.value = min;
      }
    });
  }
}

function handleBlurEvents(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("blur", function (e) {
      if (e.target.value === "") {
        e.target.value = 0;
      }
    });
  }
}

export { formatOption, handleInputEvents, handleBlurEvents};
