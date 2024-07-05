// eventListeners.js
import { calculateTotal } from "./statCalculations.js";
import { bar } from "./progressBar.js"

var level = document.getElementById("level");
level.addEventListener("input", function (e) {
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

level.addEventListener("blur", function (e) {
  if (e.target.value === "") {
    e.target.value = 1;
  }
});

var stats = [
  "hp",
  "attack",
  "defense",
  "special-attack",
  "special-defense",
  "speed",
];

stats.forEach(function (stat) {
  document
    .querySelector("." + stat + ".base")
    .addEventListener("change", function () {
      calculateTotal(stat);
    });
  document
    .querySelector("." + stat + ".ivs")
    .addEventListener("change", function () {
      calculateTotal(stat);
    });
  document
    .querySelector("." + stat + ".evs")
    .addEventListener("change", function () {
      calculateTotal(stat);
    });
});

var nature = document.getElementById("nature");

// Add an event listener for the 'change' event
nature.addEventListener("change", function () {
  // Recalculate the total for each stat when the nature changes
  calculateTotal("hp");
  calculateTotal("attack");
  calculateTotal("defense");
  calculateTotal("special-attack");
  calculateTotal("special-defense");
  calculateTotal("speed");
});

// Select the node that will be observed for mutations
// Select the node that will be observed for mutations
let targetNode = document.querySelector(".textbox.top-half.hp.total");

// Create an observer for the 'change' event
let targetNodeObserver = new MutationObserver(function () {
  let newHpTotal = parseInt(targetNode.getAttribute("value"));

  // Update the #hpMax field
  let hpMaxElement = document.getElementById("hpMax");
  if (hpMaxElement) {
    hpMaxElement.setAttribute("value", newHpTotal);
  }

  // Calculate the current HP as a percentage of the new HP total
  let currentHP = parseInt(hpCurElement.getAttribute("value"));
  let hpPercentage = currentHP / newHpTotal;

  // Update the progress bar
  bar.animate(hpPercentage); // Number from 0.0 to 1.0
});

// Start observing the target node for changes in the 'value' attribute
targetNodeObserver.observe(targetNode, {
  attributes: true,
  attributeFilter: ["value"],
});

const hpMaxInput = document.getElementById("hpMax");

const hpCurElement = document.getElementById("hpCur");

const statModifierToggle = document.getElementById("stat-modifier-toggle");
const statAmountInput = document.getElementById("stat-amount");
const applyStatsButton = document.getElementById("apply-stats");
const presetButtons = document.querySelectorAll(".button-container button"); // Select all buttons within the container

// Apply button click event listener
applyStatsButton.addEventListener("click", () => {
  const statModification = calculateStatModification();
  hpCurElement.setAttribute(
    "value",
    Number(hpCurElement.value) + Number(statModification)
  );
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Parse the fraction from the button text
    const [numerator, denominator] = button.textContent.split("/").map(Number);

    // Calculate the adjustment based on max HP and the button fraction
    const adjustment = Math.max(
      Math.floor((hpMaxInput.getAttribute("value") * numerator) / denominator),
      1
    );

    // Apply the adjustment to the current HP
    if (statModifierToggle.checked) {
      // If the toggle is on, increase the current HP
      hpCurElement.setAttribute(
        "value",
        Number(hpCurElement.getAttribute("value")) + adjustment
      );
    } else {
      // If the toggle is off, decrease the current HP
      hpCurElement.setAttribute(
        "value",
        Number(hpCurElement.getAttribute("value")) - adjustment
      );
    }
  });
});

function hpCurFunc() {
  let currentHP = parseInt(hpCurElement.getAttribute("value"));
  let maxHP = parseInt(hpMaxInput.getAttribute("value"));

  // Ensure hpCur doesn't exceed hpMax or go below 0
  let validHP = Math.max(0, currentHP);
  validHP = Math.min(maxHP, validHP);

  // Update hpCur if it's not within the valid range
  if (validHP !== currentHP) {
    hpCurElement.setAttribute("value", validHP);
  }

  // Calculate the percentage of the current HP
  let hpPercentage = validHP / maxHP;

  // Update the progress bar value
  bar.animate(hpPercentage); // Number from 0.0 to 1.0

  // Set the color of the progress bar based on the percentage
  /*if (hpPercentage <= 0.2) {
    bar.path.setAttribute("stroke", "red");
  } else if (hpPercentage > 0.2 && hpPercentage <= 0.5) {
    bar.path.setAttribute("stroke", "yellow");
  } else {
    bar.path.setAttribute("stroke", "green");
  }*/
}

const observer = new MutationObserver(hpCurFunc);

hpCurFunc();

observer.observe(hpCurElement, {
  attributes: true,
  attributeFilter: ["value"],
});

function calculateStatModification() {
  const isIncrease = statModifierToggle.checked; // Check if toggle switch is checked (true for increase)
  const statAmount = parseInt(statAmountInput.value, 10) || 0; // Get input value, convert to integer (or 0 if not a number)
  return isIncrease ? statAmount : -statAmount; // Return positive value for increase, negative for decrease
}

export { calculateStatModification };
