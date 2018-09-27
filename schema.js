'use strict';
const {  gql } = require('apollo-server');
const typeDefs = gql`
type Query {
  allUsers: [User!]!
  recipesForUser(userId:ID!): [UserRecipes]
  fetchRecipesFromSpoonacular(queryString:String):String
  fetchRecipesFromSpoonacularById:[Recipes]
  fetchRecipesFromSpoonacularInBulk:[Recipes]
}
type Mutation {
  createUser(username: String!,password:String!): User!
  saveRecipe(userId:String!,recipeId:Int): Recipes
  deleteRecipe(userId:String!,recipeId:Int):Recipes
  signInUser(username: String!,password:String!):User
}
type User{
  username: String!
  id:String
  password:String 
}
type UserRecipes {
  _id:String!
  recipeId: Int
  createdAt: String 
}
type Recipes {
  property:String
  prop2:String
  prop3:String
  prop4:String
}
`;
module.exports = typeDefs;