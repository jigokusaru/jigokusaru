// statCalculations.js
import { getNatureModifier } from "./pokedexData.js";

async function calculateTotal(stat) {
  var base = Number(
    document.querySelector("." + stat + ".base").getAttribute("value")
  );
  var lvl = Number(level.getAttribute("value"));
  var iv = Number(
    document.querySelector("." + stat + ".ivs").getAttribute("value")
  );
  var ev = Number(
    document.querySelector("." + stat + ".evs").getAttribute("value")
  );
  var species = document.querySelector(".species").value;

  // Get the nature from the #nature element
  var nature = document.getElementById("nature").value;
  // Get the nature modifier
  var natureModifier = await getNatureModifier(nature, stat);

  // Check if the pokemon is Shedinja and the stat is HP
  if (stat === "hp" && species === "shedinja") {
    document.querySelector("." + stat + ".total").setAttribute("value", 1);
  } else if (stat !== "hp") {
    // Calculate total for non-HP stats
    document
      .querySelector("." + stat + ".total")
      .setAttribute(
        "value",
        Math.floor(
          (((2 * base + iv + ev / 4) * lvl) / 100 + 5) * natureModifier
        )
      );
  } else {
    document
      .querySelector("." + stat + ".total")
      .setAttribute(
        "value",
        Math.floor(((2 * base + iv + ev / 4) * lvl) / 100 + lvl + 10)
      );
    document
      .querySelector("." + stat + ".total")
      .dispatchEvent(new Event("change"));
  }
}

export { calculateTotal };
