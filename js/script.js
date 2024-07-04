const P = new Pokedex.Pokedex();

$(document).ready(function () {
  $("#species").select2();
});

document.getElementById("IVs").addEventListener("input", function (e) {
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

document.getElementById("EVs").addEventListener("input", function (e) {
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

async function fetchAllPokemonSpecies() {
  try {
    const response = await P.getPokemonSpeciesList();
    const speciesList = response.results.map((species) => species.name);
    return speciesList;
  } catch (error) {
    console.error("There was an ERROR: ", error);
  }
}

async function fetchPokemonVarieties(speciesName) {
  try {
    const response = await P.getPokemonSpeciesByName(speciesName);
    const varieties = response.varieties
      .filter((variety) => !variety.pokemon.name.includes("gmax")) // Exclude GMax forms
      .filter((variety) => !variety.pokemon.name.includes("-male")) // Exclude male forms
      .filter((variety) => !variety.pokemon.name.includes("-female")) // Exclude female forms
      .map((variety) => {
        let nameParts = variety.pokemon.name.split("-");
        // If the Pokémon has a form, return the form name
        if (nameParts.length > 1) {
          return nameParts.slice(1).join("-"); // Return the form name
        } else {
          return nameParts[0]; // Return the species name
        }
      });
    return varieties;
  } catch (error) {
    console.error("There was an ERROR: ", error);
  }
}

window.onload = function () {
  const selectElement = document.getElementById("species");

  fetchAllPokemonSpecies().then((speciesList) => {
    for (let species of speciesList) {
      let option = document.createElement("option");
      option.value = species;
      option.text = species;
      selectElement.add(option);
    }
  });
};

$("#species").on("change", function () {
  const variantSelectElement = document.getElementById("varient");
  variantSelectElement.innerHTML = "";

  fetchPokemonVarieties(this.value).then((varieties) => {
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
  });
});
