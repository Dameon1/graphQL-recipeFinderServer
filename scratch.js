'use strict';
require('dotenv').config();
const fetch = require('node-fetch');
const {MASHAPE_KEY} = require('./config');
const fetchRecipesFromSpoonacularInBulk = (parent, {idString}, context,info) => {
  return fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=${idString}`, {
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
      results.json();
    }).then(
      function(json){
        console.log(json);
      }
    );}; 
const fetchRecipesFromSpoonacular =  (parent, {queryString}, context,info) => {
  let recipes = fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=${queryString}&limitLicense=false&number=20&ranking=1`, {
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
      console.log(results);
      return results.json();
    }).then(
      function(json){
        console.log(json);
      }
    );
  return recipes;}; 
fetchRecipesFromSpoonacular('x',{queryString:'cheese'},'x','x');
