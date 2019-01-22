
const User = require('../models/users');
const Recipe = require ('../models/recipes');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);
const {JWT_SECRET,JWT_EXPIRY} = require('../config');

const Query = {
  allUsers: async (parent, args, context,info) => {
    const users = await User.find();
    return users.map((user) => {
      user.id = user._id.toString();
      return user;
    });
  },

  me: (parent, args, ctx, info) => {
    if(!ctx.request.userId) {
      return null;
    }
    const user = User.findById(ctx.request.userId);
    return User.findById(ctx.request.userId) 
  },

  recipesForUser: async (parent, args, context,info) => {
    const {userId} = context.request;
    //console.log(context.request.userId)
    const recipes = await Recipe.find()
    .where({userId})
    .sort({ 'updatedAt': 'desc' });
    console.log(recipes.map(recipe=>recipe))
    return recipes.map(recipe=>recipe);
  }, 

  fetchRecipesFromSpoonacular : async(parent, {queryString}, context,info) => {
    if(queryString.length > 0) {
    let recipes = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=${queryString}&limitLicense=false&number=5&ranking=1`, {
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: { 'X-Mashape-Key': process.env.MASHAPE_KEY,
        'content-type': 'application/json' },
      method: 'GET', 
      mode: 'cors', 
      redirect: 'follow', 
      referrer: 'no-referrer', 
    })    
    .then(results => results.json())
    .then(JSONresults => JSONresults);
    return  recipes.map(recipe => recipe)
  }
  console.log(recipes)
  return recipes;
  },

  fetchRecipesFromSpoonacularById : async (parent, {id}, context,info) => {
    let recipe = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${id}/information`, {
        cache: 'no-cache', 
        credentials: 'same-origin',
        headers: { 'X-Mashape-Key': process.env.MASHAPE_KEY,
                'content-type': 'application/json' },
        method: 'GET', 
        mode: 'cors', 
        redirect: 'follow', 
        referrer: 'no-referrer', 
        })
  .then(results => results.json())
  .then(JSONresults => JSONresults)
  return recipe; 
  },

  fetchRecipesFromSpoonacularInBulk: async (parent,args, context,info) => {
    const {userId} = context.request;
    const recipes = await Recipe.find().where({userId}).sort({ 'updatedAt': 'desc' })
                          .then(recipes => recipes.map(recipe => recipe.recipeId));
    let recipeBulkString="";
    console.log(recipes)
    for (let i =0;i<recipes.length;i++){
      if(recipes[i] !== undefined){
      recipeBulkString += recipes[i]+",";
    }}

    let idString = recipeBulkString.slice(0,-1);
     
    let recipesToReturn = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=${idString}`, {
              cache: 'no-cache', 
            credentials: 'same-origin',
            headers: { 'X-Mashape-Key': process.env.MASHAPE_KEY,
                       'content-type': 'application/json' },
            method: 'GET', 
            mode: 'cors', 
            redirect: 'follow', 
            referrer: 'no-referrer', 
            })
  .then(results => results.json())
  .then(JSONresults => JSONresults);
  console.log(recipesToReturn)
  return recipesToReturn;    
  },
}

module.exports = Query;