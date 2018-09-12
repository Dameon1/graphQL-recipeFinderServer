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
    recipesForUser: async (parent, args, context,info) => {
      const recipes = await Recipe.find()
      .where({userId:args.userId})
      .sort({ 'updatedAt': 'desc' });
      return recipes.map(x=>x);
    } 
  },
  Mutation: {
    createUser: async (parent, args, context,info) => {
      // { _id: 123123, name: "whatever"}
      const digest = await User.hashPassword(args.password)
      const user = await User.create({
        username:args.username,
        password: digest,        
      });      
      return user;     
    },
  
  },
};
module.exports = resolvers;