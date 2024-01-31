let pokemonName = document.getElementById("pokemonName");
let pokemonID = document.getElementById("pokemonID");
let pokemonType = document.getElementById("pokemonType");
let pokemonEvolutions = document.getElementById("pokemonEvolutions");
let pokemonArea = document.getElementById("pokemonArea");
let pokemonAbilities = document.getElementById("pokemonAbilities");
let pokemonMoves = document.getElementById("pokemonMoves");
let pokemonInput = document.getElementById("pokemonInput");
let pokemonArt = document.getElementById("pokemonArt");
let pokemonShinyArt = document.getElementById("pokemonShinyArt");
let pokemonIcon = document.getElementById("pokemonIcon");
let favBtn = document.getElementById("favBtn");
let getFavBtn = document.getElementById("getFavBtn");
let searchBtn = document.getElementById("searchBtn");

const PokeApi = async (pokemon, api = "pokemon") => {
  const promise = await fetch(
    "https://pokeapi.co/api/v2/" + api + "/" + pokemon
  );
  const data = await promise.json();
  console.log(data);
  return data;
};

async function PikachuCall() {
  // API Calls
  let pokemon = await PokeApi("pikachu");
  let pokemonSpecies = await PokeApi("pikachu", "pokemon-species");
  //   let evolutionChain = await PokeApi("10", "evolution-chain");

  //   Required Elements
  pokemonName.textContent = pokemon.name;

  pokemonID.textContent = pokemon.id;

  pokemon.types.forEach((types) => {
    pokemonType.textContent +=
      types.type.name
        .replace(new RegExp("-", "gi"), " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) + ", ";
  });
  pokemonType.textContent = pokemonType.textContent.slice(0, -2);

  pokemon.abilities.forEach((abilities) => {
    pokemonAbilities.textContent +=
      abilities.ability.name
        .replace(new RegExp("-", "gi"), " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) + ", ";
  });
  pokemonAbilities.textContent = pokemonAbilities.textContent.slice(0, -2);

//   pokemon.moves.forEach((moves) => {
//     pokemonMoves.textContent +=
//       moves.move.name
//         .replace(new RegExp("-", "gi"), " ")
//         .replace(/\b\w/g, (c) => c.toUpperCase()) + ", ";
//   });
//   pokemonMoves.textContent = pokemonMoves.textContent.slice(0, -2);


  JsonIterator(pokemon.moves, "move.name", pokemonMoves);
  
  //   pokemon.moves.forEach((moves) => {
  //     let moveName = moves.move.name;
  //     moveName = Capitalizer(moveName);
  //     pokemonMoves.textContent += moveName + ", ";
  //   });
  //   pokemonMoves.textContent =  pokemonMoves.textContent.slice(0, -2);

  pokemonArt.src = pokemon.sprites.other["official-artwork"].front_default;
  pokemonShinyArt.src = pokemon.sprites.other["official-artwork"].front_shiny;
  pokemonIcon.src =
    pokemon.sprites.versions["generation-vii"].icons.front_default;

    // Optional Elements
  pokemonArea.textContent = pokemonSpecies.habitat.name;
  //   pokemonEvolutions.textContent = evolutionChain
}

PikachuCall();

/* 
Convert the following into a function

api.object.forEach((element) => {
    elementText.textContent +=
    element.move.name
    .replace(new RegExp("-", "gi"), " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) + ", ";
});
elementText.textContent = elementText.textContent.slice(0, -2);

*/

function Capitalizer(param) {
    param = param
    .replace(new RegExp("-", "gi"), " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
    return param;
}

function JsonIterator(nestedPartOne, nestedPartTwo, textParam) {
  nestedPartOne.forEach((e) => {
    const parts = nestedPartTwo.split(".");
    /* Split stores the content of the second parameter in an arrray
        by each '.' inbetween, meaning parts is an array itself */

    let objName = e;
    /* objName declares itself as our forEach parameter as a continuation
        for our first parameter */
Capitalizer
    console.log(objName[parts[0]]);
    for (let i = 0; i < parts.length; i++) {
      objName = objName[parts[i]];
      /* objName declares itself as itself accessing a nested property, because
            nested properties can be accessed using bracket notation,
            it's allowed to stick regardless of the '=', and the bracket notation adds
            itself up depending on how many nested properties need to be
            accessed */
    }
    console.log(objName);
    objName = Capitalizer(objName);

    textParam.textContent += objName + ", ";
  });
  textParam.textContent = textParam.textContent.slice(0, -2);
}


/* .replace(/\b\w/g, (c) => c.toUpperCase());
Snippet source: https://stackoverflow.com/a/61818240
Code that capitalizes every first letter more than once (source includes capitalizing first letter once) */
