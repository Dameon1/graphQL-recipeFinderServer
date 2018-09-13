const User = require('./models/users');
const Recipe = require ('./models/recipes');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const options = {session: false, failWithError: true};
const localAuth = passport.authenticate('local', options);
const {JWT_SECRET,JWT_EXPIRY} = require('./config');
const resolvers = {
  Query: {
    allUsers: async (parent, args, context,info) => {
      // { _id: 123123, name: "whatever"}
      const users = await User.find();
      return users.map((x) => {
        x.id = x._id.toString();
        return x;
      });
    },
    recipesForUser: async (parent, {userId}, context,info) => {
      const recipes = await Recipe.find()
      .where({userId})
      .sort({ 'updatedAt': 'desc' });
      return recipes.map(x=>x);
    } 
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
      // let digest = await User.hashPassword(password);
      // let userPassword = await User.validatePassword(password);
      // if(digest === userPassword){console.log('True')}
      // const createAuthToken = (userName) => {
      //   return jwt.sign({userName}, JWT_SECRET, {
      //     subject: userName,
      //     expiresIn: JWT_EXPIRY,
      //     algorithm: 'HS256'
        });
      };
            
      return this.username
        // const authToken = await createAuthToken(username);
        // return {authToken, username};
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