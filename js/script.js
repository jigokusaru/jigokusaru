const P = new Pokedex.Pokedex();

$(document).ready(function () {
  $("#species").select2();
});

var elements = document.getElementsByClassName("IVs");
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

var elements = document.getElementsByClassName("EVs");
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

async function fetchAllPokemonSpecies() {
  try {
    const response = await P.getPokemonSpeciesList();
    const speciesList = await Promise.all(
      response.results.map(async (species) => {
        const speciesData = await P.getPokemonSpeciesByName(species.name);
        const speciesEnglishName = speciesData.names.find(
          (name) => name.language.name === "en"
        ).name;
        return {
          originalName: species.name,
          englishName: speciesEnglishName,
        };
      })
    );
    return speciesList;
  } catch (error) {
    console.error("There was an ERROR: ", error);
  }
}

async function fetchPokemonVarieties(speciesName) {
  try {
    const response = await P.getPokemonSpeciesByName(speciesName);
    const speciesEnglishName = response.names.find(
      (name) => name.language.name === "en"
    ).name;
    const varieties = response.varieties
      .filter((variety) => !variety.pokemon.name.includes("gmax")) // Exclude GMax forms
      .filter((variety) => !variety.pokemon.name.includes("-male")) // Exclude male forms
      .filter((variety) => !variety.pokemon.name.includes("-female")) // Exclude female forms
      .map((variety) => {
        let nameParts = variety.pokemon.name.split("-");
        // If the Pokémon has a form, return the form name
        if (nameParts.length > 1 && nameParts[0] === speciesName) {
          return nameParts.slice(1).join("-"); // Return the form name
        } else {
          return speciesEnglishName; // Return the English name of the species
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
      option.value = species.originalName;
      option.text = species.englishName;
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
