'use strict';
const {  gql } = require('apollo-server');
const typeDefs = gql`
type Query {
  allUsers: [User!]!
  recipesForUser(userId:ID!): [Recipes]
}
type Mutation {
  createUser(username: String!,password:String!): User!
  saveRecipe(userId:String!,recipeId:String!): Recipes
  deleteRecipe(userId:String!,recipeId:String!):Recipes
}
type User{
  username: String!
  id:String
  password:String 
}
type Recipes {
  _id:String!
  recipeId: Int
  createdAt: String 
}
`;
module.exports = typeDefs;