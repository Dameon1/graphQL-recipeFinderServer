'use strict';
const { gql } = require('apollo-server');
const typeDefs = gql`
type Query {
  allUsers: [User!]!
  recipesForUser(userId:ID!): [UserRecipes]
  fetchRecipesFromSpoonacular(queryString:String!):[Recipes]
  fetchRecipesFromSpoonacularById(id:Int!):Recipes
  fetchRecipesFromSpoonacularInBulk(userId:ID!):[Recipes]
}
type Mutation {
  createUser(username: String!,password:String!): User!
  saveRecipe(userId:String!,recipeId:Int): Recipes
  deleteRecipe(userId:String!,recipeId:Int):Recipes
  signInUser(username: String!,password:String!):User
}
type User {
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
  instructions:String,
  image:String,
  sourceUrl:String,
  id:Int,
  title:String,  
  usedIngredientCount:Int,
  missedIngredientCount:Int,
  analyzedInstructions: [AnalyzedInstructions]
}
type AnalyzedInstructions {
  steps: [Analyzed]
}
type Analyzed {
  step:String
}

`;
module.exports = typeDefs;
