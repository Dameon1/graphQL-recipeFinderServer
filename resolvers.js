
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
  
    fetchRecipesFromSpoonacular : async(parent, {queryString}, context,info) => {
      console.log(queryString.length)
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
    return ["Working"];
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
    console.log(recipe.analyzedInstructions)
    return recipe; 
    },
 
    fetchRecipesFromSpoonacularInBulk: async (parent,{userId}, context,info) => {
      const recipes = await Recipe.find().where({userId}).sort({ 'updatedAt': 'desc' })
                            .then(recipes => recipes.map(recipe => recipe.recipeId));
      let recipeBulkString="";
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
    return recipesToReturn;    
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
      if(isValid) return user
    })
      .catch(err => {
          if (err.reason === 'LoginError') {
            return false;
          }});
          console.log(user);
    const token = await jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    context.res.cookie('token', token, {
      httpOnly:true,
      maxAge: 1000 * 60 * 60 *24 * 365,
    });
    
    if (user) { return user }
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