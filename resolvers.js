const User = require('./models/users');
const Recipe = require ('./models/recipes');
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
      let digest = await User.hashPassword(password);
      
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