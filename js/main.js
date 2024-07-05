// main.js
import { P, fetchPokemonSpeciesBatch, addSpeciesToDropdown, fetchPokemonVarieties,fetchAndDisplayBaseStats,fetchNatures,addNaturesToDropdown } from './pokedexData.js';
import { formatOption, handleInputEvents, handleBlurEvents} from './domManipulation.js';
import { calculateTotal } from './statCalculations.js';

$(document).ready(function () {
  $("#species").select2({ selectionCssClass: "species" });
  $("#gender").select2({
    templateResult: formatOption,
    templateSelection: formatOption,
    selectionCssClass: "gender",
  });
});

window.onload = function () {
  fetchPokemonSpeciesBatch().then((speciesList) => {
    addSpeciesToDropdown(speciesList);
  });
  fetchNatures().then((natureList) => {
    addNaturesToDropdown(natureList.results);
  });
  setInterval(function () {
    fetchPokemonSpeciesBatch().then((speciesList) => {
      addSpeciesToDropdown(speciesList);
    });
  }, 5000);
};

$("#species").on("change", async function () {
  const speciesName = this.value;
  const variantSelectElement = document.getElementById("variant");
  variantSelectElement.innerHTML = "";

  fetchPokemonVarieties(speciesName).then((varieties) => {
    if (varieties.length > 1) {
      variantSelectElement.style.display = "flex";

      for (let variety of varieties) {
        let option = document.createElement("option");
        option.value = variety;
        option.text = variety;
        variantSelectElement.add(option);
      }
    } else {
      variantSelectElement.style.display = "none";
    }
    // Fetch and display base stats for the main form of the species
    fetchAndDisplayBaseStats(speciesName);
  });

  const maleGenderInfo = await P.getGender("male");
  const femaleGenderInfo = await P.getGender("female");

  const isMale = maleGenderInfo.pokemon_species_details.some(
    (species) => species.pokemon_species.name === speciesName
  );
  const isFemale = femaleGenderInfo.pokemon_species_details.some(
    (species) => species.pokemon_species.name === speciesName
  );

  $("#gender").empty();

  if (isMale) {
    $("#gender").append(new Option("Male", "male"));
  }
  if (isFemale) {
    $("#gender").append(new Option("Female", "female"));
  }
  if (isMale || isFemale) {
    $("#gender").css("display", "flex");
    if (!(isMale && isFemale)) {
      $("#gender").prop("disabled", true);
    } else {
      $("#gender").prop("disabled", false);
    }
  } else {
    $("#gender").css("display", "none");
  }
});

$("#variant").on("change", function () {
  const speciesName = $("#species").val();
  let pokemonName;

  const variantName = this.value
    .toLowerCase()
    .replace(/[ .]/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (variantName === speciesName) {
    pokemonName = speciesName;
  } else {
    // Otherwise, convert the variant name to the format "species-variant"
    pokemonName = `${speciesName}-${variantName}`;
  }

  // Fetch the Pokémon's data for the selected variant or species
  fetchAndDisplayBaseStats(pokemonName);
});


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
