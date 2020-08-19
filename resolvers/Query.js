const fetch = require("node-fetch");
const User = require("../models/users");
const Recipe = require("../models/recipes");

const Query = {
  me: (parent, args, context, info) => {
    if (!context.request.userId) {
      return null;
    }
    return User.findById(context.request.userId);
  },

  recipesForUser: async (parent, args, context, info) => {
    const { userId } = context.request;
    const recipes = await Recipe.find()
      .where({ userId })
      .sort({ updatedAt: "desc" });
    return recipes.map(recipe => recipe);
  },

  fetchRecipesFromSpoonacular: async (
    parent,
    { queryString },
    context,
    info
  ) => {
    if (queryString.length > 0) {
      let recipes = await fetch(
        `spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=${queryString}&limitLicense=false&number=5&ranking=1`,
        {
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            	"x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
		          "x-rapidapi-key": "S8G91YSWRNmshR1vTJgsVCYS4VdHp1sGM9PjsnEp50JoCghtfZ",
		          "useQueryString": true,
            "content-type": "application/json"
          },
          method: "GET",
          mode: "cors",
          redirect: "follow",
          referrer: "no-referrer"
        }
      )
        .then(results => results.json())
        .then(JSONresults => JSONresults);

      return recipes.map(recipe => recipe);
    }
    return ["recipes"];
  },

  fetchRecipesFromSpoonacularById: async (parent, { id }, context, info) => {
    let recipe = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${id}/information`,
      {
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "X-Mashape-Key": process.env.MASHAPE_KEY,
          "content-type": "application/json"
        },
        method: "GET",
        mode: "cors",
        redirect: "follow",
        referrer: "no-referrer"
      }
    )
      .then(results => results.json())
      .then(JSONresults => JSONresults);

    return recipe;
  },

  fetchRecipesFromSpoonacularInBulk: async (parent, args, context, info) => {
    const { userId } = context.request;
    const recipes = await Recipe.find()
      .where({ userId })
      .sort({ updatedAt: "desc" })
      .then(recipes => recipes.map(recipe => recipe.recipeId));
    let recipeBulkString = "";
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i] !== undefined) {
        recipeBulkString += recipes[i] + ",";
      }
    }
    //**** */HERE IS PROBLEM TO FIX
    if (recipeBulkString.length === 0) {
      return ["no recipes"];
    }
    let idString = recipeBulkString.slice(0, -1);
    let recipesToReturn = await fetch(
      `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=${idString}`,
      {
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "X-Mashape-Key": process.env.MASHAPE_KEY,
          "content-type": "application/json"
        },
        method: "GET",
        mode: "cors",
        redirect: "follow",
        referrer: "no-referrer"
      }
    )
      .then(results => results.json())
      .then(JSONresults => JSONresults);
    return recipesToReturn;
  }
};

module.exports = Query;
