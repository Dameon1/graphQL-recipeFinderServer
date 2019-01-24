
const User = require('../models/users');
const Recipe = require ('../models/recipes');
const jwt = require('jsonwebtoken');
// const passport = require('passport');
// const { Strategy: LocalStrategy } = require('passport-local');
// const options = {session: false, failWithError: true};
// const localAuth = passport.authenticate('local', options);
// const {JWT_SECRET,JWT_EXPIRY} = require('../config');

const Mutations = {
  createUser: async (parent,{password ,username}, context,info) => {   
    let digest = await User.hashPassword(password)
    let user = await User.create({
      username,
      password: digest,        
    });
    const token = await jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    context.response.cookie('token', token, {
      httpOnly:true,
      maxAge: 1000 * 60 * 60 *24 * 365,
    });
    return user;     
  },
  signInUser: async (parent,{password ,username}, context,info) => {
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
    let isValid = await user.validatePassword(password);
    if(isValid) return user;
  })
    .catch(err => {
        if (err.reason === 'LoginError') {
          return false;
        }});
    const token = await jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    context.response.cookie('token', token, {
      httpOnly:true,
      maxAge: 1000 * 60 * 60 *24 * 365,
    });  
    if (user) { return user };
  },

  signOutUser: (parent, { recipeId,userId }, context,info) => {
    context.response.clearCookie('token');
    return { message: "Goodbye" };
  },

  saveRecipe: async (parent, { recipeId }, context,info) => {
    const {userId} = context.request;
    const recipe = await Recipe.create({ recipeId, userId });
    return recipe;
  },

  deleteRecipe: async (parent, {recipeId}, context,info) => {
    const {userId} = context.request;
    const recipe = await Recipe.findOneAndRemove({recipeId,userId})
    return recipeId;
    }
  }

  module.exports = Mutations;