// pokedexData.js
const P = new Pokedex.Pokedex();
let offset = 0;
const batchSize = 100;

async function fetchPokemonSpeciesBatch() {
  try {
    const response = await P.getPokemonSpeciesList({
      limit: batchSize,
      offset: offset,
    });
    offset += batchSize;

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

function addSpeciesToDropdown(speciesList) {
  const selectElement = document.getElementById("species");

  for (let species of speciesList) {
    let option = document.createElement("option");
    option.setAttribute("value", species.originalName);
    option.text = species.englishName;
    selectElement.add(option);
  }
}

async function fetchPokemonVarieties(speciesName) {
  try {
    const response = await P.getPokemonSpeciesByName(speciesName);
    const speciesEnglishName = response.names.find(
      (name) => name.language.name === "en"
    ).name;
    const varieties = response.varieties
      .filter((variety) => !variety.pokemon.name.includes("gmax"))
      .filter((variety) => !variety.pokemon.name.includes("-male"))
      .filter((variety) => !variety.pokemon.name.includes("-female"))
      .map((variety) => {
        if (variety.pokemon.name === speciesName) {
          // If variant name is the same as the species name, return the species name
          return (
            speciesEnglishName.charAt(0).toUpperCase() +
            speciesEnglishName.slice(1)
          );
        } else {
          // Remove the base form from the variant name
          let formName = variety.pokemon.name.replace(speciesName + "-", "");
          // Split and capitalize
          formName = formName
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          // Remove starting space
          formName = formName.startsWith(" ") ? formName.slice(1) : formName;
          return formName;
        }
      });
    return varieties;
  } catch (error) {
    console.error("There was an ERROR: ", error);
  }
}

async function fetchNatures() {
  return P.getNatures();
}

function addNaturesToDropdown(natureList) {
  const select = document.getElementById("nature");
  natureList.forEach((nature) => {
    const option = document.createElement("option");
    option.setAttribute("value", nature.name);
    option.text = nature.name.charAt(0).toUpperCase() + nature.name.slice(1);
    select.appendChild(option);
  });
}

async function getNatureModifier(nature, stat) {
  try {
    const response = await P.getNatureByName(nature);
    if (!response.increased_stat && !response.decreased_stat) {
      return 1; // No effect for neutral natures or "nature" option
    } else if (
      response.increased_stat &&
      response.increased_stat.name === stat
    ) {
      return 1.1; // Increase by 10%
    } else if (
      response.decreased_stat &&
      response.decreased_stat.name === stat
    ) {
      return 0.9; // Decrease by 10%
    } else {
      return 1; // No effect
    }
  } catch (error) {
    console.error("There was an error fetching the nature:", error);
    return 1; // Default to no effect if there was an error
  }
}

function fetchAndDisplayBaseStats(pokemonName) {
  // Get the selected gender
  const gender = $("#gender").val();

  // If Indeedee is selected and a gender is selected, include the gender in the Pokémon name
  if (pokemonName === "indeedee" && gender) {
    pokemonName = `${pokemonName}-${gender}`;
  }

  P.getPokemonByName(pokemonName)
    .then((pokemonData) => {
      // Find the base stats
      const baseStats = pokemonData.stats.reduce((stats, stat) => {
        stats[stat.stat.name] = stat.base_stat;
        return stats;
      }, {});

      // Set the value of each text box to the corresponding base stat
      for (const statName in baseStats) {
        var statBase = document.querySelector(`.${statName}.base`);
        statBase.setAttribute("value", baseStats[statName]);
        statBase.dispatchEvent(new Event("change")); // Trigger 'change' event
      }
    })
    .catch((error) => {
      console.error("There was an ERROR: ", error);
    });
}

export {
  P,
  fetchPokemonSpeciesBatch,
  addSpeciesToDropdown,
  fetchPokemonVarieties,
  getNatureModifier,
  fetchAndDisplayBaseStats,
  fetchNatures,
  addNaturesToDropdown,
};
