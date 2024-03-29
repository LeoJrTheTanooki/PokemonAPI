import {
  saveToLocalStorage,
  getLocalStorage,
  removeFromLocalStorage,
} from "./localstorage.js";

let pokemonName = document.getElementById("pokemonName");
let pokemonID = document.getElementById("pokemonID");
let pokemonType = document.getElementById("pokemonType");
let pokemonEvolutions = document.getElementById("pokemonEvolutions");
let pokemonArea = document.getElementById("pokemonArea");
let pokemonAbilities = document.getElementById("pokemonAbilities");
let pokemonMoves = document.getElementById("pokemonMoves");
let pokemonInput = Array.from(document.getElementsByClassName("pokemonInput"));
let pokemonArt = document.getElementById("pokemonArt");
let pokemonDexEntry = document.getElementById("pokemonDexEntry");
let favoriteBtn = document.getElementById("favoriteBtn");
let starBtn = document.getElementById("starBtn");
let getFavoritesBtn = document.getElementById("getFavoritesBtn");
let getFavoritesDiv = document.getElementById("getFavoritesDiv");
let pokemon = "";

const PokeApi = async (apiLink) => {
  try {
    const response = await fetch(apiLink);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

async function PokemonCall(pokemonParam) {
  // Initialization
  let shiny = false;

  // API Calls
  let pokemonMain = await PokeApi(
    "https://pokeapi.co/api/v2/pokemon/" + pokemonParam
  );
  if (pokemonMain && pokemonMain.id <= 649) {
    let pokemonSpecies = await PokeApi(pokemonMain.species.url);
    let evolutionNest = await PokeApi(pokemonSpecies.evolution_chain.url);
    let pokemonEncounters = await PokeApi(pokemonMain.location_area_encounters);

    // Testing Grounds
    // console.log(pokemonMain)
    // if(pokemonMain){
    //   console.log("Called")
    // } else {
    //   console.log("Undefined")
    // }

    // Required Elements
    pokemon = pokemonMain.name;
    console.log(pokemon);
    switch (pokemon) {
      case "mr-mime":
        pokemonName.textContent = "Mr. Mime";
        break;
      case "keldeo-ordinary":
        pokemonName.textContent = "Keldeo";
        break;
      default:
        pokemonName.textContent = Capitalizer(pokemon);
        break;
    }
    pokemonID.textContent = pokemonMain.id;
    let enDexIndex = pokemonSpecies.flavor_text_entries.findIndex(
      (object) => object.language.name === "en"
    );
    pokemonDexEntry.textContent = pokemonSpecies.flavor_text_entries[
      enDexIndex
    ].flavor_text.replace(new RegExp("\u000c", "gi"), " ");

    JsonIterator(pokemonType, pokemonMain.types, "type.name");
    JsonIterator(pokemonAbilities, pokemonMain.abilities, "ability.name");
    JsonIterator(pokemonMoves, pokemonMain.moves, "move.name");

    // Image Loader
    pokemonArt.src =
      pokemonMain.sprites.other["official-artwork"].front_default;

      pokemonArt.addEventListener("click", async () => {
        if (!shiny) {
          pokemonArt.src =
            pokemonMain.sprites.other["official-artwork"].front_shiny +
            "?t=" +
            new Date().getTime();
          pokemonArt.alt = "shiny " + pokemon;
          shiny = true;
        } else {
          pokemonArt.src =
            pokemonMain.sprites.other["official-artwork"].front_default +
            "?t=" +
            new Date().getTime();
          pokemonArt.alt = pokemon;
          shiny = false;
        }
      });

    
    if (pokemonArt.alt !== "N/A") pokemonArt.alt = pokemon;
    if (getLocalStorage().includes(pokemon)) {
      starBtn.src = "/assets/Favorited.png";
    } else if (!getLocalStorage().includes(pokemon)) {
      starBtn.src = "/assets/Unfavorited.png";
    }

    // Optional Elements

    if (pokemonEncounters.length > 0) {
      pokemonArea.textContent = "";
      pokemonEncounters.forEach(
        (object) =>
          (pokemonArea.textContent +=
            Capitalizer(object.location_area.name.split("-").join(" ")) + ", ")
      );
      pokemonArea.textContent = pokemonArea.textContent.slice(0, -2);
    } else {
      pokemonArea.textContent = "N/A";
    }

    if (evolutionNest.chain.evolves_to.length > 0) {
      pokemonEvolutions.textContent =
        Capitalizer(evolutionNest.chain.species.name) + " -> ";
      for (let i = 0; i < evolutionNest.chain.evolves_to.length; i++) {
        pokemonEvolutions.textContent += Capitalizer(
          evolutionNest.chain.evolves_to[i].species.name
        );
        if (evolutionNest.chain.evolves_to[i].evolves_to.length > 0) {
          pokemonEvolutions.textContent += " -> ";
          for (
            let j = 0;
            j < evolutionNest.chain.evolves_to[i].evolves_to.length;
            j++
          ) {
            pokemonEvolutions.textContent += Capitalizer(
              evolutionNest.chain.evolves_to[i].evolves_to[j].species.name
            );
          }
        }
        if (i !== evolutionNest.chain.evolves_to.length - 1)
          pokemonEvolutions.textContent += " | ";
      }
    } else {
      pokemonEvolutions.textContent = "N/A";
    }
  } else {
    console.log("error");
    pokemon = "";
    pokemonName.textContent = "Invalid Pokemon";
    pokemonID.textContent = "0";
    pokemonDexEntry.textContent = "N/A";
    pokemonType.textContent = "N/A";
    pokemonAbilities.textContent = "N/A";
    pokemonMoves.textContent = "N/A";
    pokemonArt.src = "/assets/UnknownPokemon.png";
    pokemonArt.alt = "N/A";
    starBtn.src = "/assets/Unfavorited.png";
    pokemonArea.textContent = "N/A";
    pokemonEvolutions.textContent = "N/A";
  }
}

function Capitalizer(param) {
  param = param
    .replace(new RegExp("-", "gi"), " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return param;
}

function JsonIterator(
  textParam,
  nestedPartOne,
  nestedPartTwo,
  clearText = true
) {
  if (clearText) textParam.textContent = " ";

  nestedPartOne.forEach((e) => {
    const parts = nestedPartTwo.split(".");
    /* Split stores the content of the second parameter in an arrray
        by each '.' inbetween, meaning parts is an array itself */

    let objName = e;
    /* objName declares itself as our forEach parameter as a continuation
        for our first parameter */
    Capitalizer;
    for (let i = 0; i < parts.length; i++) {
      objName = objName[parts[i]];
      /* objName declares itself as itself accessing a nested property, because
            nested properties can be accessed using bracket notation,
            it's allowed to stick regardless of the '=', and the bracket notation adds
            itself up depending on how many nested properties need to be
            accessed */
    }
    objName = Capitalizer(objName);

    textParam.textContent += objName + ", ";
  });
  textParam.textContent = textParam.textContent.slice(0, -2);
}

pokemonInput.forEach((input) => {
  input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      let inputtedName = event.target.value;
      switch (inputtedName) {
        case "deoxys":
          inputtedName = "386";
          // 10001, 10002, 10003
          break;
        case "wormadam":
          inputtedName = "413";
          // 10004, 10005
          break;
        case "shaymin":
          inputtedName = "492";
          // 10006
          break;
        case "giratina":
          inputtedName = "487";
          // 10007
          break;
        case "rotom":
          inputtedName = "479";
          // 10008 - 10012
          break;
        case "basculin":
          inputtedName = "550";
          // 10016
          break;
        case "darmanitan":
          inputtedName = "555";
          // 10017
          break;
        case "meloetta":
          inputtedName = "648";
          // 10018
          break;
        case "tornadus":
          inputtedName = "641";
          // 10019
          break;
        case "thundurus":
          inputtedName = "642";
          // 10020
          break;
        case "landorus":
          inputtedName = "645";
          // 10021
          break;
        case "keldeo":
          inputtedName = "647";
          // 10024
          break;
      }
      PokemonCall(
        inputtedName.toLowerCase().replace(new RegExp(" ", "gi"), "-")
      );
    }
  });
});

favoriteBtn.addEventListener("click", () => {
  if (pokemon) {
    if (getLocalStorage().includes(pokemon)) {
      removeFromLocalStorage();
      starBtn.src = "/assets/Unfavorited.png";
    } else if (!getLocalStorage().includes(pokemon)) {
      saveToLocalStorage(pokemon);
      starBtn.src = "/assets/Favorited.png";
    }
  }
});

getFavoritesBtn.addEventListener("click", async () => {
  // This retrives out data from local storage and stores it into favorites variable
  let favorites = getLocalStorage();

  // Clears getFavoritesDiv to th
  getFavoritesDiv.textContent = "";

  // Map through each element in our array
  favorites.map(async (pokeName) => {
    let pokemonApi = await PokeApi(
      "https://pokeapi.co/api/v2/pokemon/" + pokeName
    );
    let img = document.createElement("img");
    let buttonOne = document.createElement("button");
    img.src = pokemonApi.sprites.versions["generation-vii"].icons.front_default;
    img.alt = pokeName + " icon";
    img.classList.add("inline-block");
    img.classList.add("mb-2");

    let p = document.createElement("p");

    // Setting its text content to pokeName
    buttonOne.append(img);
    buttonOne.append(Capitalizer(pokeName));
    p.append(buttonOne);

    // className replaces all classes with all new classes
    p.className = "text-lg font-medium text-gray-900 dark:text-white";
    buttonOne.addEventListener("click", () => {
      PokemonCall(p.textContent.toLowerCase().slice(0, -1));
    });

    let button = document.createElement("button");

    button.type = "button";
    button.textContent = "X";
    // classList allows us to be a little more concise it doesn't replace all classes
    button.classList.add(
      "text-gray-400",
      "bg-transparent",
      "hover:bg-gray-200",
      "hover:text-gray-900",
      "rounded-lg",
      "text-sm",
      "w-8",
      "h-8",
      "justify-end",
      "dark:hover:bg-gray-600",
      "dark:hover:text-white"
    );

    // Creating an addEventListener for our button which removes pokeName from our favorites
    button.addEventListener("click", () => {
      removeFromLocalStorage(pokeName);
      p.remove();
    });
    // appending our button to our p-tag
    p.append(button);
    // appending our p-tag to our favoritesDiv
    getFavoritesDiv.append(p);
  });
});

getRandomBtn.addEventListener("click", async () => {
  PokemonCall(Math.floor(Math.random() * 649) + 1);
});

PokemonCall(Math.floor(Math.random() * 649) + 1);

/* .replace(/\b\w/g, (c) => c.toUpperCase());
Snippet source: https://stackoverflow.com/a/61818240
Code that capitalizes every first letter more than once (source includes capitalizing first letter once) */
