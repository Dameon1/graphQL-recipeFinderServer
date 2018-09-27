
const fetch = require('node-fetch');
const {MASHAPE_KEY} = require('./config');

const User = require('./models/users');
const Recipe = require ('./models/recipes');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);
const {JWT_SECRET,JWT_EXPIRY} = require('./config');
const resolvers = {
  Query: {
    allUsers: async (parent, args, context,info) => {
      // { _id: 123123, name: "whatever"}
      const users = await User.find();
      return users.map((user) => {
        user.id = user._id.toString();
        return user;
      });
    },
    recipesForUser: async (parent, {userId}, context,info) => {
      const recipes = await Recipe.find()
      .where({userId})
      .sort({ 'updatedAt': 'desc' });
      return recipes.map(recipe=>recipe);
    },
    //TODO = complete this
    fetchRecipesFromSpoonacular : async (parent, {queryString}, context,info) => {
      let recipes = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=${queryString}&limitLicense=false&number=20&ranking=1`, {
        cache: 'no-cache', 
        credentials: 'same-origin',
        headers: { 'X-Mashape-Key': MASHAPE_KEY,
                   'content-type': 'application/json' },
        method: 'GET', 
        mode: 'cors', 
        redirect: 'follow', 
        referrer: 'no-referrer', 
        })
        .then(results => {
          console.log(results);
          return results.json();
        }).then(
          function(json){
            console.log(json);
          }
        );
    console.log(recipes);
  },
  fetchRecipesFromSpoonacular : async(parent, {queryString}, context,info) => {
   let recipes = await fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=${queryString}&limitLicense=false&number=20&ranking=1`, {
      cache: 'no-cache', 
      credentials: 'same-origin',
      headers: { 'X-Mashape-Key': process.env.MASHAPE_KEY,
        'content-type': 'application/json' },
      method: 'GET', 
      mode: 'cors', 
      redirect: 'follow', 
      referrer: 'no-referrer', 
    })
      .then(results => {
        
        return results.json();
      }).then(results => {
        console.log(results[0].title)
      return results[0].title})
      console.log(recipes)
     
    },
    fetchRecipesFromSpoonacularById : async (parent, {id}, context,info) => {
    return fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${id}/information`, {
          cache: 'no-cache', 
          credentials: 'same-origin',
          headers: { 'X-Mashape-Key': process.env.MASHAPE_KEY,
                  'content-type': 'application/json' },
          method: 'GET', 
          mode: 'cors', 
          redirect: 'follow', 
          referrer: 'no-referrer', 
          })
    .then(results => {
      const newResults = results.json()
      console.log(newResults[2].title)
      
      return 'String'} ) 
    },
    fetchRecipesFromSpoonacularInBulk: (parent, {idString}, context,info) => {
      return fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=${idString}`, {
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
    },
  },
  Mutation: {
    createUser: async (parent,{password ,username}, context,info) => {
     
      let digest = await User.hashPassword(password)
      let user = await User.create({
        username,
        password: digest,        
      });      
      return user;     
    },
    signInUser: async (parent,{password ,username}, context,info) =>{
      let digest = await User.hashPassword(password);
      let user = await User
      .findOne({ username })
      .then(async results => {
        let user = results;
        if (!user) {
          return Promise.reject({
            reason: 'LoginError',
            message: 'Incorrect username',
            location: 'username'
          });
      }
      let isValid = await user.validatePassword(password)
      return isValid
    })
      .catch(err => {
          if (err.reason === 'LoginError') {
            return false;
          }});
          console.log(user);
         if (user) { return {username,password} }
        },
    saveRecipe: async (parent, { recipeId,userId }, context,info) => {
      const recipe = await Recipe.create({ recipeId, userId })
      return recipe
    },
    deleteRecipe: async (parent, {recipeId , userId }, context,info) => {
      const recipe = await Recipe.findOneAndRemove({recipeId:recipeId,userId})
      return recipe;
      }
    },
};
module.exports = resolvers;